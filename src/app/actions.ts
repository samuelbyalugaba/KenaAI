
'use server';

import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import type { Agent, AgentRole, Announcement, Company, Comment, ActivityLog } from "@/types";
import { Collection, Db, ObjectId } from "mongodb";

async function getAgentsCollection(): Promise<Collection<Agent>> {
    const db: Db = await getDb();
    return db.collection<Agent>('agents');
}

async function getCompaniesCollection(): Promise<Collection<Company>> {
    const db: Db = await getDb();
    return db.collection<Company>('companies');
}

async function getAnnouncementsCollection(): Promise<Collection<Announcement>> {
    const db: Db = await getDb();
    return db.collection<Announcement>('announcements');
}

async function getActivityLogsCollection(): Promise<Collection<ActivityLog>> {
    const db: Db = await getDb();
    return db.collection<ActivityLog>('activity_logs');
}

async function logActivity(companyId: string | ObjectId, agentName: string, action: string, details: string) {
    try {
        const logsCollection = await getActivityLogsCollection();
        await logsCollection.insertOne({
            companyId: new ObjectId(companyId),
            agentName,
            action,
            details,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}

export async function getAgentsByCompany(companyId: string): Promise<Agent[]> {
    try {
        if (!companyId || !ObjectId.isValid(companyId)) {
            return [];
        }
        const agentsCollection = await getAgentsCollection();
        const agents = await agentsCollection.find({ companyId: new ObjectId(companyId) }, { projection: { password: 0 } }).toArray();

        return agents.map(agent => ({
            ...agent,
            _id: agent._id.toString(),
            id: agent._id.toString(),
            companyId: agent.companyId?.toString(),
        }));
    } catch (error) {
        console.error("Error fetching agents by company:", error);
        return [];
    }
}

export async function createAnnouncement(data: { title: string; content: string; category: string; authorId: string; companyId: string }): Promise<{ success: boolean; message?: string; announcement?: Announcement }> {
    try {
        const announcementsCollection = await getAnnouncementsCollection();
        const agentsCollection = await getAgentsCollection();

        const author = await agentsCollection.findOne({ _id: new ObjectId(data.authorId) });
        if (!author) {
            return { success: false, message: "Author not found." };
        }

        const newAnnouncement: Omit<Announcement, 'id' | '_id'> = {
            title: data.title,
            content: data.content,
            category: data.category as any,
            author: {
                id: author._id.toString(),
                name: author.name,
                avatar: author.avatar
            },
            companyId: new ObjectId(data.companyId),
            date: new Date().toISOString(),
            readBy: [],
            comments: [],
        };

        const result = await announcementsCollection.insertOne(newAnnouncement as any);
        await logActivity(data.companyId, author.name, 'Create Announcement', `Published: "${data.title}"`);


        if (result.insertedId) {
            const createdAnnouncement: Announcement = {
                ...(newAnnouncement as Announcement),
                _id: result.insertedId,
                id: result.insertedId.toString(),
                companyId: data.companyId,
            };
            return { success: true, announcement: createdAnnouncement };
        }

        return { success: false, message: "Failed to create announcement." };
    } catch (error) {
        console.error("Create announcement error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}

export async function getAnnouncementsByCompany(companyId: string): Promise<Announcement[]> {
    try {
        if (!companyId || !ObjectId.isValid(companyId)) {
            return [];
        }
        const announcementsCollection = await getAnnouncementsCollection();
        const announcements = await announcementsCollection.find({ companyId: new ObjectId(companyId) }).sort({ date: -1 }).toArray();

        return announcements.map(announcement => ({
            ...announcement,
            _id: announcement._id.toString(),
            id: announcement._id.toString(),
            companyId: announcement.companyId.toString(),
            readBy: announcement.readBy || [],
            comments: announcement.comments || [],
        }));

    } catch (error) {
        console.error("Error fetching announcements by company:", error);
        return [];
    }
}

export async function markAnnouncementAsRead(announcementId: string, agentId: string): Promise<{ success: boolean }> {
    try {
        const announcementsCollection = await getAnnouncementsCollection();
        await announcementsCollection.updateOne(
            { _id: new ObjectId(announcementId) },
            { $addToSet: { readBy: agentId } }
        );
        return { success: true };
    } catch (error) {
        console.error("Mark as read error:", error);
        return { success: false };
    }
}

export async function addCommentToAnnouncement(announcementId: string, authorId: string, content: string): Promise<{ success: boolean, comment?: Comment }> {
    try {
        const agentsCollection = await getAgentsCollection();
        const author = await agentsCollection.findOne({ _id: new ObjectId(authorId) });
        if (!author) return { success: false };

        const newComment: Comment = {
            id: new ObjectId().toString(),
            author: {
                id: author._id.toString(),
                name: author.name,
                avatar: author.avatar
            },
            content,
            timestamp: new Date().toISOString(),
        };

        const announcementsCollection = await getAnnouncementsCollection();
        await announcementsCollection.updateOne(
            { _id: new ObjectId(announcementId) },
            { $push: { comments: newComment } }
        );
        
        return { success: true, comment: newComment };

    } catch (error) {
        console.error("Add comment error:", error);
        return { success: false };
    }
}


export async function updateAgentProfile(agentId: string, name: string, email: string, phone: string, companyId: string): Promise<{ success: boolean; message?: string; agent?: Agent; }> {
    try {
        const agentsCollection = await getAgentsCollection();
        
        const updateResult = await agentsCollection.updateOne(
            { _id: new ObjectId(agentId) },
            { $set: { name, email, phone } }
        );

        if (updateResult.modifiedCount === 0 && updateResult.matchedCount === 0) {
            return { success: false, message: "Agent not found." };
        }
        if (updateResult.modifiedCount === 0 && updateResult.matchedCount > 0) {
            // No fields were actually changed
            const updatedAgent = await agentsCollection.findOne({ _id: new ObjectId(agentId) });
             if (updatedAgent) {
                const { password, ...agentData } = updatedAgent;
                const agentWithoutPassword: Agent = {
                    ...agentData,
                    _id: updatedAgent._id.toString(),
                    id: updatedAgent._id.toString(),
                    companyId: updatedAgent.companyId?.toString(),
                };
                 return { success: true, agent: agentWithoutPassword };
            }
        }
        
        const updatedAgent = await agentsCollection.findOne({ _id: new ObjectId(agentId) });

        if (updatedAgent) {
            const { password, ...agentData } = updatedAgent;
            const agentWithoutPassword: Agent = {
                ...agentData,
                _id: updatedAgent._id.toString(),
                id: updatedAgent._id.toString(),
                companyId: updatedAgent.companyId?.toString(),
            };
            await logActivity(companyId, agentWithoutPassword.name, 'Update Profile', `Updated profile details`);
            return { success: true, agent: agentWithoutPassword };
        }

        return { success: false, message: "Failed to retrieve updated agent." };
    } catch (error) {
        console.error("Update agent profile error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}

export async function updateAgentPassword(agentId: string, currentPassword_unused: string, newPassword_unused: string, companyId: string): Promise<{ success: boolean; message: string }> {
    try {
        const agentsCollection = await getAgentsCollection();
        const agent = await agentsCollection.findOne({ _id: new ObjectId(agentId) });

        if (!agent || !agent.password) {
            return { success: false, message: "Agent not found." };
        }
        
        const isPasswordValid = await verifyPassword(currentPassword_unused, agent.password);
        if (!isPasswordValid) {
            return { success: false, message: "Incorrect current password." };
        }

        const newHashedPassword = await hashPassword(newPassword_unused);
        await agentsCollection.updateOne(
            { _id: new ObjectId(agentId) },
            { $set: { password: newHashedPassword } }
        );
        
        await logActivity(companyId, agent.name, 'Update Password', `Changed password`);
        return { success: true, message: "Password updated successfully." };

    } catch (error) {
        console.error("Update password error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}


export async function handleLogin(email: string, password_unused: string): Promise<{ success: boolean; message?: string; agent?: Agent }> {
    try {
      const agentsCollection = await getAgentsCollection();
      const agent = await agentsCollection.findOne({ email: email.toLowerCase() });

      if (agent && agent.password) {
        const isPasswordValid = await verifyPassword(password_unused, agent.password);
        if (isPasswordValid) {
          const { password, ...agentData } = agent;
          const agentWithoutPassword: Agent = {
            ...agentData,
            _id: agent._id.toString(),
            id: agent._id.toString(),
            companyId: agent.companyId?.toString(),
          };
          await logActivity(agent.companyId, agent.name, 'Login', `Logged in successfully`);
          return { success: true, agent: agentWithoutPassword };
        }
      }
      return { success: false, message: "Invalid email or password." };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Database connection error." };
    }
};

export async function createAgent(name: string, email: string, password_unused: string, role: AgentRole, companyId: string, createdBy: string): Promise<{ success: boolean; message?: string; agent?: Agent; }> {
    try {
        const agentsCollection = await getAgentsCollection();
        const existingAgent = await agentsCollection.findOne({ email: email.toLowerCase() });

        if (existingAgent) {
            return { success: false, message: "An agent with this email already exists." };
        }

        const hashedPassword = await hashPassword(password_unused);
        const avatar = `https://picsum.photos/seed/${name.replace(/\s/g, '')}/100/100`;

        const agentToInsert: Omit<Agent, 'id' | '_id'> = {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            avatar,
            phone: '', 
            companyId: new ObjectId(companyId)
        };

        const result = await agentsCollection.insertOne(agentToInsert as any);

        if (result.insertedId) {
            const newAgent = await agentsCollection.findOne({ _id: result.insertedId });
            if (newAgent) {
                const { password, ...agentData } = newAgent;
                const agentWithoutPassword: Agent = {
                  ...agentData,
                  _id: newAgent._id.toString(),
                  id: newAgent._id.toString(),
                  companyId: newAgent.companyId?.toString(),
                };
                await logActivity(companyId, createdBy, 'Create Agent', `Created agent: ${name}`);
                return { success: true, agent: agentWithoutPassword };
            }
        }
        return { success: false, message: "Failed to create agent." };
    } catch (error) {
        console.error("Create agent error:", error);
        return { success: false, message: "An unexpected error occurred while creating the agent." };
    }
}

export async function handleSignUp(name: string, email: string, password_unused: string): Promise<{ success: boolean; message?: string; agent?: Agent; }> {
    const db = await getDb();
    const session = db.client.startSession();
    try {
        let newAgentResult: Agent | undefined;
        await session.withTransaction(async () => {
            const companiesCollection = await getCompaniesCollection();
            const agentsCollection = await getAgentsCollection();
            const existingAgent = await agentsCollection.findOne({ email: email.toLowerCase() }, { session });

            if (existingAgent) {
                throw new Error("An agent with this email already exists.");
            }
            
            const companyResult = await companiesCollection.insertOne({
                name: `${name}'s Company`,
                createdAt: new Date(),
            }, { session });

            if (!companyResult.insertedId) {
                throw new Error("Failed to create company.");
            }
            const companyId = companyResult.insertedId;
            
            const hashedPassword = await hashPassword(password_unused);
            const avatar = `https://picsum.photos/seed/${name.replace(/\s/g, '')}/100/100`;
            
            const agentToInsert: Omit<Agent, 'id' | '_id'> = {
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'admin',
                avatar,
                phone: '',
                companyId: companyId,
            };

            const agentResult = await agentsCollection.insertOne(agentToInsert as any, { session });

             if (!agentResult.insertedId) {
                throw new Error("Failed to create admin agent.");
            }
            
            await logActivity(companyId, name, 'Sign Up', `Created new company and admin account.`);

            const newAgent = await agentsCollection.findOne({ _id: agentResult.insertedId }, { session });
            if (newAgent) {
                 const { password, ...agentData } = newAgent;
                 newAgentResult = {
                    ...agentData,
                    _id: newAgent._id.toString(),
                    id: newAgent._id.toString(),
                    companyId: newAgent.companyId?.toString()
                };
            }
        });
        
        if (!newAgentResult) {
            return { success: false, message: "Failed to retrieve the created agent." }
        }

        return { success: true, agent: newAgentResult };
    } catch (error: any) {
        console.error("Sign up transaction error:", error);
        // Abort transaction on error if it was started
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        return { success: false, message: error.message || "An unexpected error occurred during sign up." };
    } finally {
        await session.endSession();
    }
}


export async function getActivityLogs(companyId: string): Promise<ActivityLog[]> {
    try {
        if (!companyId || !ObjectId.isValid(companyId)) {
            return [];
        }
        const logsCollection = await getActivityLogsCollection();
        const logs = await logsCollection.find({ companyId: new ObjectId(companyId) }).sort({ timestamp: -1 }).limit(50).toArray();

        return logs.map(log => ({
            ...log,
            _id: log._id.toString(),
            id: log._id.toString(),
            companyId: log.companyId.toString(),
            timestamp: log.timestamp.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        return [];
    }
}
