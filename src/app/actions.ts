
'use server';

import { query } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import type { Agent, AgentRole } from "@/types";

export async function handleLogin(email: string, password_unused: string) {
    try {
      const result = await query('SELECT * FROM agents WHERE email = $1', [email.toLowerCase()]);
      const agent: Agent | undefined = result.rows[0];

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
      return { success: false, message: "Database connection error. Please check server logs and ensure the POSTGRES_URL is correctly configured in your .env file." };
    }
  };

export async function createAgent(name: string, email: string, password_unused: string, role: AgentRole) {
    try {
        const existingAgentResult = await query('SELECT * FROM agents WHERE email = $1', [email.toLowerCase()]);
        if (existingAgentResult.rows.length > 0) {
            return { success: false, message: "An agent with this email already exists." };
        }

        const hashedPassword = await hashPassword(password_unused);
        const avatar = `https://picsum.photos/seed/${name}/100/100`;

        const result = await query(
            'INSERT INTO agents (name, email, password, role, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email.toLowerCase(), hashedPassword, role, avatar]
        );
        const newAgent: Agent | undefined = result.rows[0];

        if (newAgent) {
            const { password, ...agentWithoutPassword } = newAgent;
            return { success: true, agent: agentWithoutPassword };
        }
        return { success: false, message: "Failed to create agent." };
    } catch (error) {
        console.error("Create agent error:", error);
        return { success: false, message: "An unexpected error occurred while creating the agent." };
    }
}

export async function handleSignUp(name: string, email: string, password_unused: string) {
    return createAgent(name, email, password_unused, "agent");
}
