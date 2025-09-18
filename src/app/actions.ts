
'use server';

import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import type { Agent, AgentRole } from "@/types";
import { Collection, Db, ObjectId } from "mongodb";

async function getAgentsCollection(): Promise<Collection<Agent>> {
    const db: Db = await getDb();
    return db.collection<Agent>('agents');
}

async function getCompaniesCollection(): Promise<Collection> {
    const db: Db = await getDb();
    return db.collection('companies');
}

export async function handleLogin(email: string, password_unused: string) {
    try {
      const agentsCollection = await getAgentsCollection();
      const agent = await agentsCollection.findOne({ email: email.toLowerCase() });

      if (agent && agent.password) {
        const isPasswordValid = await verifyPassword(password_unused, agent.password);
        if (isPasswordValid) {
          // Omit password and convert to plain object before returning
          const { password, _id, ...agentData } = agent;
          const agentWithoutPassword = {
            _id: _id.toString(),
            ...agentData,
            companyId: agent.companyId?.toString()
          };
          return { success: true, agent: agentWithoutPassword };
        }
      }
      return { success: false, message: "Invalid email or password." };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Database connection error. Please check server logs and ensure the MONGODB_URI is correctly configured in your .env file." };
    }
  };

export async function createAgent(name: string, email: string, password_unused: string, role: AgentRole, companyId: string) {
    try {
        const agentsCollection = await getAgentsCollection();
        const existingAgent = await agentsCollection.findOne({ email: email.toLowerCase() });

        if (existingAgent) {
            return { success: false, message: "An agent with this email already exists." };
        }

        const hashedPassword = await hashPassword(password_unused);
        const avatar = `https://picsum.photos/seed/${name}/100/100`;

        const result = await agentsCollection.insertOne({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            avatar,
            id: '', // id will be created by MongoDB
            phone: '', // Add a default phone number
            companyId: new ObjectId(companyId)
        });

        if (result.insertedId) {
            const newAgent = await agentsCollection.findOne({ _id: result.insertedId });
            if (newAgent) {
                // Omit password and convert to plain object before returning
                const { password, _id, ...agentData } = newAgent;
                const agentWithoutPassword = {
                  _id: _id.toString(),
                  ...agentData,
                  companyId: newAgent.companyId?.toString(),
                };
                return { success: true, agent: agentWithoutPassword };
            }
        }
        return { success: false, message: "Failed to create agent." };
    } catch (error) {
        console.error("Create agent error:", error);
        return { success: false, message: "An unexpected error occurred while creating the agent." };
    }
}

export async function handleSignUp(name: string, email: string, password_unused: string) {
    const db = await getDb();
    const session = db.client.startSession();
    try {
        let newAgentResult;
        await session.withTransaction(async () => {
            const companiesCollection = await getCompaniesCollection();
            const agentsCollection = await getAgentsCollection();
            const existingAgent = await agentsCollection.findOne({ email: email.toLowerCase() }, { session });

            if (existingAgent) {
                await session.abortTransaction();
                // This throw will be caught by the outer catch block
                throw new Error("An agent with this email already exists.");
            }

            // 1. Create company
            const companyResult = await companiesCollection.insertOne({
                name: `${name}'s Company`,
                createdAt: new Date(),
            }, { session });

            if (!companyResult.insertedId) {
                throw new Error("Failed to create company.");
            }
            const companyId = companyResult.insertedId;

            // 2. Create admin user for that company
            const hashedPassword = await hashPassword(password_unused);
            const avatar = `https://picsum.photos/seed/${name}/100/100`;
            const agentResult = await agentsCollection.insertOne({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'admin',
                avatar,
                id: '',
                phone: '',
                companyId: companyId,
            }, { session });

             if (!agentResult.insertedId) {
                throw new Error("Failed to create admin agent.");
            }

            const newAgent = await agentsCollection.findOne({ _id: agentResult.insertedId }, { session });
            if (newAgent) {
                 const { password, _id, ...agentData } = newAgent;
                 newAgentResult = {
                    _id: _id.toString(),
                    ...agentData,
                    companyId: newAgent.companyId?.toString()
                };
            }
        });
        return { success: true, agent: newAgentResult };
    } catch (error: any) {
        console.error("Sign up transaction error:", error);
        return { success: false, message: error.message || "An unexpected error occurred during sign up." };
    } finally {
        await session.endSession();
    }
}
