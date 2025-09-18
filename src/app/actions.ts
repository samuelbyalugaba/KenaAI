
'use server';

import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import type { Agent, AgentRole } from "@/types";
import { Collection, Db } from "mongodb";

async function getAgentsCollection(): Promise<Collection<Agent>> {
    const db: Db = await getDb();
    return db.collection<Agent>('agents');
}

export async function handleLogin(email: string, password_unused: string) {
    try {
      const agentsCollection = await getAgentsCollection();
      const agent = await agentsCollection.findOne({ email: email.toLowerCase() });

      if (agent && agent.password) {
        const isPasswordValid = await verifyPassword(password_unused, agent.password);
        if (isPasswordValid) {
          // Omit password from the object returned to the client
          const { password, ...agentWithoutPassword } = agent;
          return { success: true, agent: agentWithoutPassword };
        }
      }
      return { success: false, message: "Invalid email or password." };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Database connection error. Please check server logs and ensure the MONGODB_URI is correctly configured in your .env file." };
    }
  };

export async function createAgent(name: string, email: string, password_unused: string, role: AgentRole) {
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
            phone: '' // Add a default phone number
        });

        if (result.insertedId) {
            const newAgent = await agentsCollection.findOne({ _id: result.insertedId });
            if (newAgent) {
                const { password, ...agentWithoutPassword } = newAgent;
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
    return createAgent(name, email, password_unused, "admin");
}
