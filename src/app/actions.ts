
'use server';

import { query } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import type { Agent } from "@/types";

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
      return { success: false, message: "An unexpected error occurred." };
    }
  };
