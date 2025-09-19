
'use server';

import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import type { Agent, AgentRole, Announcement, Company, Comment, ActivityLog, User, Note, Chat, Message, Channel, Campaign } from "@/types";
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

async function getContactsCollection(): Promise<Collection<User>> {
    const db: Db = await getDb();
    return db.collection<User>('contacts');
}

async function getChatsCollection(): Promise<Collection<Chat>> {
    const db: Db = await getDb();
    return db.collection<Chat>('chats');
}

async function getMessagesCollection(): Promise<Collection<Message>> {
    const db: Db = await getDb();
    return db.collection<Message>('messages');
}

async function getCampaignsCollection(): Promise<Collection<Campaign>> {
    const db: Db = await getDb();
    return db.collection<Campaign>('campaigns');
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

// A simple hashing function to create a pseudo-random but consistent number from a string.
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};


export async function getAgentsByCompany(companyId: string): Promise<Agent[]> {
    try {
        if (!companyId || !ObjectId.isValid(companyId)) {
            return [];
        }
        const agentsCollection = await getAgentsCollection();
        const messagesCollection = await getMessagesCollection();
        const agents = await agentsCollection.find({ companyId: new ObjectId(companyId) }, { projection: { password: 0 } }).toArray();

        const agentDataWithStats = await Promise.all(agents.map(async (agent) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const conversationsToday = await messagesCollection.countDocuments({
                senderId: agent._id,
                timestamp: { $gte: today.toISOString() } 
            });
            
            const statuses: Array<'Online' | 'Offline' | 'Busy'> = ['Online', 'Offline', 'Busy'];
            const hash = simpleHash(agent.name);
            const randomStatus = statuses[hash % statuses.length];

            let avgResponseTime = "N/A";
            let csat: number | undefined = undefined;

            if (conversationsToday > 0) {
                const avgResponseMinutes = (hash % 4) + 1; // 1 to 4 minutes
                const avgResponseSeconds = hash % 60; // 0 to 59 seconds
                avgResponseTime = `${avgResponseMinutes}m ${avgResponseSeconds}s`;
                csat = 85 + (hash % 15);
            }

            return {
                ...agent,
                _id: agent._id.toString(),
                id: agent._id.toString(),
                companyId: agent.companyId?.toString(),
                conversationsToday,
                status: randomStatus,
                avgResponseTime,
                csat,
            };
        }));
        
        return agentDataWithStats;
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
                ...(newAnnouncement as Omit<Announcement, '_id' | 'id'>),
                _id: result.insertedId.toString(),
                id: result.insertedId.toString(),
                companyId: new ObjectId(data.companyId).toString(),
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
            comments: (announcement.comments || []).map((comment: Comment) => ({
                ...comment,
                timestamp: new Date(comment.timestamp).toISOString(),
            })),
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
        
        const agentWithStats = await getAgentsByCompany(companyId);
        const updatedAgent = agentWithStats.find(a => a.id === agentId);


        if (updatedAgent) {
            await logActivity(companyId, updatedAgent.name, 'Update Profile', `Updated agent profile for ${name}`);
            return { success: true, agent: updatedAgent };
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
      const agentDoc = await agentsCollection.findOne({ email: email.toLowerCase() });

      if (agentDoc && agentDoc.password) {
        const isPasswordValid = await verifyPassword(password_unused, agentDoc.password);
        if (isPasswordValid) {
          const { password, ...agentData } = agentDoc;
          const agent: Agent = {
            ...agentData,
            _id: agentDoc._id.toString(),
            id: agentDoc._id.toString(),
            companyId: agentDoc.companyId?.toString(),
          };
          await logActivity(agent.companyId, agent.name, 'Login', `Logged in successfully`);
          return { success: true, agent: agent };
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
            const agentsWithStats = await getAgentsByCompany(companyId);
            const newAgent = agentsWithStats.find(a => a.id === result.insertedId.toString());

            if (newAgent) {
                await logActivity(companyId, createdBy, 'Create Agent', `Created agent: ${name}`);
                return { success: true, agent: newAgent };
            }
        }
        return { success: false, message: "Failed to create agent." };
    } catch (error) {
        console.error("Create agent error:", error);
        return { success: false, message: "An unexpected error occurred while creating the agent." };
    }
}

export async function deleteAgent(agentId: string, companyId?: string, deletedBy?: string): Promise<{ success: boolean, message?: string }> {
    try {
        const agentsCollection = await getAgentsCollection();

        if (!agentId || !ObjectId.isValid(agentId)) {
            return { success: false, message: "Invalid agent ID." };
        }

        const agentToDelete = await agentsCollection.findOne({ _id: new ObjectId(agentId) });
        if (!agentToDelete) {
            return { success: false, message: "Agent not found." };
        }

        // Prevent deleting the last admin
        if (agentToDelete.role === 'admin') {
            const adminCount = await agentsCollection.countDocuments({ companyId: agentToDelete.companyId, role: 'admin' });
            if (adminCount <= 1) {
                return { success: false, message: "Cannot remove the last administrator." };
            }
        }
        
        const result = await agentsCollection.deleteOne({ _id: new ObjectId(agentId) });

        if (result.deletedCount === 1) {
            if (companyId && deletedBy) {
                await logActivity(companyId, deletedBy, 'Delete Agent', `Removed agent: ${agentToDelete.name}`);
            }
            return { success: true };
        }

        return { success: false, message: "Failed to remove agent." };
    } catch (error) {
        console.error("Delete agent error:", error);
        return { success: false, message: "An unexpected error occurred." };
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

            const newAgentDoc = await agentsCollection.findOne({ _id: agentResult.insertedId }, { session });
            if (newAgentDoc) {
                 const { password, ...agentData } = newAgentDoc;
                 newAgentResult = {
                    ...agentData,
                    _id: newAgentDoc._id.toString(),
                    id: newAgentDoc._id.toString(),
                    companyId: newAgentDoc.companyId?.toString()
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

export async function getContactsByCompany(companyId: string): Promise<User[]> {
    try {
        if (!companyId || !ObjectId.isValid(companyId)) {
            return [];
        }
        const contactsCollection = await getContactsCollection();
        const contacts = await contactsCollection.find({ companyId: new ObjectId(companyId) }).toArray();

        return contacts.map(contact => {
            const { _id, companyId, ...rest } = contact as any;
            return {
                ...rest,
                _id: _id.toString(),
                id: _id.toString(),
                companyId: companyId?.toString(),
                notes: (contact.notes || []).map((note: Note) => ({
                    ...note,
                    timestamp: new Date(note.timestamp).toISOString(),
                })),
            };
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
}

export async function createContact(name: string, email: string, phone: string, companyId: string): Promise<{ success: boolean; message?: string; contact?: User }> {
    try {
        const contactsCollection = await getContactsCollection();
        
        const existingContact = await contactsCollection.findOne({ email: email.toLowerCase(), companyId: new ObjectId(companyId) });
        if (existingContact) {
            return { success: false, message: "A contact with this email already exists." };
        }

        const avatar = `https://picsum.photos/seed/${name.replace(/\s/g, '')}/100/100`;

        const contactToInsert: Omit<User, 'id' | '_id'> = {
            name,
            email: email.toLowerCase(),
            phone,
            avatar,
            companyId: new ObjectId(companyId),
            notes: [],
            online: false,
        };

        const result = await contactsCollection.insertOne(contactToInsert as any);
        
        if (result.insertedId) {
            const newContact: User = {
                ...(contactToInsert as Omit<User, '_id'|'id'>),
                _id: result.insertedId.toString(),
                id: result.insertedId.toString(),
                companyId: new ObjectId(companyId).toString(),
            };
            return { success: true, contact: newContact };
        }

        return { success: false, message: "Failed to create contact." };

    } catch (error) {
        console.error("Create contact error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}


export async function assignAgentToContact(contactId: string, agentId: string): Promise<{ success: boolean }> {
    try {
        const contactsCollection = await getContactsCollection();
        await contactsCollection.updateOne(
            { _id: new ObjectId(contactId) },
            { $set: { assignedAgentId: agentId } }
        );
        return { success: true };
    } catch (error) {
        console.error("Error assigning agent:", error);
        return { success: false };
    }
}

export async function addNoteToContact(contactId: string, agentId: string, agentName: string, text: string): Promise<{ success: boolean; note?: Note }> {
    try {
        const contactsCollection = await getContactsCollection();
        
        const newNote: Note = {
            id: new ObjectId().toString(),
            agentId,
            agentName,
            text,
            timestamp: new Date().toISOString()
        };

        const result = await contactsCollection.updateOne(
            { _id: new ObjectId(contactId) },
            { $push: { notes: { $each: [newNote], $position: 0 } } }
        );
        
        if (result.modifiedCount > 0) {
            return { success: true, note: newNote };
        }
        return { success: false };
    } catch (error) {
        console.error("Error adding note:", error);
        return { success: false };
    }
}

export async function getNotesForContact(contactId: string): Promise<Note[]> {
     try {
        if (!contactId || !ObjectId.isValid(contactId)) {
            return [];
        }
        const contactsCollection = await getContactsCollection();
        const contact = await contactsCollection.findOne({ _id: new ObjectId(contactId) });
        return (contact?.notes || []).map((note: Note) => ({
            ...note,
            timestamp: new Date(note.timestamp).toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching notes:", error);
        return [];
    }
}

export async function getChatsByCompany(companyId: string): Promise<Chat[]> {
    try {
        if (!companyId || !ObjectId.isValid(companyId)) {
            return [];
        }
        const chatsCollection = await getChatsCollection();
        const chats = await chatsCollection.aggregate([
            { $match: { companyId: new ObjectId(companyId) } },
            { $sort: { timestamp: -1 } },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' }
        ]).toArray();

        return chats.map(chat => {
            const { _id, companyId, userId, ...rest } = chat as any;
            return {
                ...rest,
                _id: _id.toString(),
                id: _id.toString(),
                companyId: companyId.toString(),
                userId: userId.toString(),
                messages: [], // Messages will be lazy-loaded
                user: {
                    ...chat.user,
                    _id: chat.user._id.toString(),
                    id: chat.user._id.toString(),
                    companyId: chat.user.companyId ? chat.user.companyId.toString() : undefined,
                }
            };
        });
    } catch (error) {
        console.error("Error fetching chats by company:", error);
        return [];
    }
}

export async function getMessagesForChat(chatId: string): Promise<Message[]> {
    try {
        if (!chatId || !ObjectId.isValid(chatId)) {
            return [];
        }
        const messagesCollection = await getMessagesCollection();
        // Also fetch sender details if it's a user, not an agent ('me')
        const messages = await messagesCollection.aggregate([
            { $match: { chatId: new ObjectId(chatId) } },
            { $sort: { timestamp: 1 } },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'senderId',
                    foreignField: '_id',
                    as: 'senderInfo'
                }
            }
        ]).toArray();

        return messages.map(msg => {
            const { _id, chatId, senderId, senderInfo, ...rest } = msg as any;
            const sender = msg.sender === 'me' ? 'me' : (senderInfo[0] || null);

            if (sender && sender !== 'me') {
                sender.id = sender._id.toString();
            }

            return {
                ...rest,
                id: _id.toString(),
                sender,
            };
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
}

export async function sendMessage(chatId: string, text: string, agentId: string): Promise<{ success: boolean; newMessage?: Message }> {
    try {
        const messagesCollection = await getMessagesCollection();
        const chatsCollection = await getChatsCollection();
        
        const timestamp = new Date();
        const newMessageToInsert: Omit<Message, 'id' | '_id'> = {
            chatId: new ObjectId(chatId),
            sender: 'me', // 'me' denotes the agent
            senderId: new ObjectId(agentId),
            text,
            timestamp: timestamp.toISOString(),
        };

        const result = await messagesCollection.insertOne(newMessageToInsert as any);

        if (result.insertedId) {
            await chatsCollection.updateOne(
                { _id: new ObjectId(chatId) },
                { $set: { lastMessage: text, timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } }
            );
            
            const finalNewMessage: Message = {
                ...(newMessageToInsert as Omit<Message, '_id'|'id'>),
                _id: result.insertedId.toString(),
                id: result.insertedId.toString(),
                chatId: newMessageToInsert.chatId.toString(),
                senderId: newMessageToInsert.senderId.toString(),
            };

            return { 
                success: true, 
                newMessage: finalNewMessage
            };
        }
        return { success: false };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false };
    }
}

export async function setChatbotStatus(chatId: string, isActive: boolean): Promise<{ success: boolean }> {
    try {
        const chatsCollection = await getChatsCollection();
        await chatsCollection.updateOne(
            { _id: new ObjectId(chatId) },
            { $set: { isChatbotActive: isActive } }
        );
        return { success: true };
    } catch (error) {
        console.error("Error setting chatbot status:", error);
        return { success: false };
    }
}

export async function startNewChats(users: User[], message: string, companyId: string, agentId: string): Promise<Chat[]> {
    const chatsCollection = await getChatsCollection();
    const newOrUpdatedChats: Chat[] = [];

    for (const user of users) {
        const existingChatDoc = await chatsCollection.findOne({
            userId: new ObjectId(user.id),
            companyId: new ObjectId(companyId)
        });

        if (existingChatDoc) {
            await sendMessage(existingChatDoc._id.toString(), message, agentId);
            
            const updatedChat: Chat = {
                ...(existingChatDoc as any),
                _id: existingChatDoc._id.toString(),
                id: existingChatDoc._id.toString(),
                userId: existingChatDoc.userId.toString(),
                companyId: existingChatDoc.companyId.toString(),
                lastMessage: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                user: user,
                messages: [],
            };
            newOrUpdatedChats.push(updatedChat);

        } else {
            const timestamp = new Date();
            const newChatData: Omit<Chat, 'id' | '_id'> = {
                userId: new ObjectId(user.id),
                companyId: new ObjectId(companyId),
                lastMessage: message,
                timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unreadCount: 0,
                priority: 'normal',
                channel: 'Webchat',
                isChatbotActive: false,
                messages: []
            };
            const chatResult = await chatsCollection.insertOne(newChatData as any);
            
            if (chatResult.insertedId) {
                await sendMessage(chatResult.insertedId.toString(), message, agentId);
                const createdChat: Chat = {
                    ...(newChatData as any),
                    _id: chatResult.insertedId.toString(),
                    id: chatResult.insertedId.toString(),
                    userId: newChatData.userId.toString(),
                    companyId: newChatData.companyId.toString(),
                    user: user,
                    messages: [],
                };
                newOrUpdatedChats.push(createdChat);
            }
        }
    }
    return newOrUpdatedChats;
}

export async function createCampaign(data: Partial<Campaign> & { scheduleType?: 'now' | 'later' }, companyId: string, agentId: string): Promise<{ success: boolean; message?: string; campaign?: Campaign; }> {
    try {
        const campaignsCollection = await getCampaignsCollection();
        const contactsCollection = await getContactsCollection();
        
        let status: Campaign['status'] = 'Draft';
        let sentAt: string | undefined = undefined;
        let delivery = 0;
        let engagement = 0;
        let conversion = 0;

        if (data.scheduleType === 'now') {
            status = 'Completed';
            sentAt = new Date().toISOString();
            // Generate mock performance data for immediate campaigns
            delivery = 95 + Math.random() * 5; 
            engagement = 10 + Math.random() * 15;
            conversion = 2 + Math.random() * 8; 

            // Actually send the messages
            if (data.audience && data.message) {
                const audienceContacts = await contactsCollection.find({ _id: { $in: data.audience.map(id => new ObjectId(id)) } }).toArray();
                const users = audienceContacts.map(c => ({
                    ...c,
                    id: c._id.toString(),
                    _id: c._id.toString(),
                })) as User[];

                await startNewChats(users, data.message, companyId, agentId);
            }
        } else if (data.scheduleType === 'later') {
            status = 'Scheduled';
        }

        const newCampaign: Omit<Campaign, 'id' | '_id'> = {
            title: data.title!,
            type: data.type || 'Broadcast',
            status: status,
            companyId: new ObjectId(companyId),
            createdAt: new Date().toISOString(),
            audience: data.audience || [],
            message: data.message || "",
            sentAt: sentAt,
            delivery,
            engagement,
            conversion,
        };

        const result = await campaignsCollection.insertOne(newCampaign as any);
        if (result.insertedId) {
            const createdCampaign: Campaign = {
                ...newCampaign,
                _id: result.insertedId.toString(),
                id: result.insertedId.toString(),
                companyId: new ObjectId(companyId).toString(),
            };
            return { success: true, campaign: createdCampaign };
        }
        return { success: false, message: "Failed to create campaign." };
    } catch (error) {
        console.error("Create campaign error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}

export async function getCampaignsByCompany(companyId: string): Promise<Campaign[]> {
    try {
        if (!companyId || !ObjectId.isValid(companyId)) {
            return [];
        }
        const campaignsCollection = await getCampaignsCollection();
        const campaigns = await campaignsCollection.find({ companyId: new ObjectId(companyId) }).sort({ createdAt: -1 }).toArray();

        return campaigns.map(campaign => ({
            ...campaign,
            _id: campaign._id.toString(),
            id: campaign._id.toString(),
            companyId: campaign.companyId.toString(),
            createdAt: new Date(campaign.createdAt).toISOString(),
            sentAt: campaign.sentAt ? new Date(campaign.sentAt).toISOString() : undefined,
        }));
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
    }
}

export async function importContactsFromCSV(contactsData: { name: string; email: string; phone: string }[], companyId: string): Promise<{ success: boolean; message: string; newContacts: User[]; importedCount: number; skippedCount: number; }> {
    try {
        const contactsCollection = await getContactsCollection();
        const newContacts: User[] = [];
        let importedCount = 0;
        let skippedCount = 0;

        const companyObjId = new ObjectId(companyId);

        for (const contact of contactsData) {
            let existingContact = null;
            if (contact.email) {
                existingContact = await contactsCollection.findOne({
                    email: contact.email.toLowerCase(),
                    companyId: companyObjId
                });
            }

            if (existingContact) {
                skippedCount++;
                continue;
            }

            const avatar = `https://picsum.photos/seed/${contact.name.replace(/\s/g, '')}/100/100`;
            const contactToInsert: Omit<User, 'id' | '_id'> = {
                name: contact.name,
                email: contact.email.toLowerCase(),
                phone: contact.phone,
                avatar,
                companyId: companyObjId,
                notes: [],
                online: false,
            };

            const result = await contactsCollection.insertOne(contactToInsert as any);
            if (result.insertedId) {
                importedCount++;
                newContacts.push({
                    ...(contactToInsert as Omit<User, 'id' | '_id'>),
                    _id: result.insertedId.toString(),
                    id: result.insertedId.toString(),
                    companyId: companyId,
                });
            }
        }

        return {
            success: true,
            message: `Import complete. Added ${importedCount} new contacts, skipped ${skippedCount} duplicates.`,
            newContacts,
            importedCount,
            skippedCount
        };

    } catch (error) {
        console.error("CSV import error:", error);
        return { success: false, message: "An unexpected error occurred during import.", newContacts: [], importedCount: 0, skippedCount: 0 };
    }
}
    
