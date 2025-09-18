

import type { Agent, Chat, User, AgentPerformance, UnansweredQuery } from "@/types";

export const mockAdminUser: Agent = { 
    id: '1', 
    name: "Samuel Byalugaba", 
    avatar: "https://picsum.photos/seed/sam/100/100", 
    email: "samuel.b@example.com", 
    phone: "+1-555-0201", 
    role: "admin", 
    password: "password",
    status: "Online",
    conversationsToday: 12,
    avgResponseTime: "1m 45s",
    csat: 98,
};

export const mockAgents: Agent[] = [
    mockAdminUser,
    { 
        id: '2', 
        name: "Kelvin Malisa", 
        avatar: "https://picsum.photos/seed/kelvin/100/100", 
        email: "kelvin.m@example.com", 
        phone: "+1-555-0202", 
        role: "admin", 
        password: "password",
        status: "Online",
        conversationsToday: 15,
        avgResponseTime: "1m 30s",
        csat: 95,
    },
    { 
        id: '3', 
        name: "Sylvester Mayaya", 
        avatar: "https://picsum.photos/seed/sly/100/100", 
        email: "sylvester.m@example.com", 
        phone: "+1-555-0203", 
        role: "super_agent", 
        password: "password",
        status: "Busy",
        conversationsToday: 25,
        avgResponseTime: "2m 10s",
        csat: 92,
    },
    { 
        id: '4', 
        name: "Linaliz Ready", 
        avatar: "https://picsum.photos/seed/linaliz/100/100", 
        email: "linaliz.r@example.com", 
        phone: "+1-555-0204", 
        role: "agent", 
        password: "password",
        status: "Offline",
        conversationsToday: 8,
        avgResponseTime: "3m 05s",
        csat: 88,
    },
];

export const mockAgentPerformance: AgentPerformance[] = [
    { rank: 1, agent: mockAgents[0], conversations: 125, avgResponseTime: "1m 30s", resolutionRate: 95 },
    { rank: 2, agent: mockAgents[1], conversations: 110, avgResponseTime: "1m 45s", resolutionRate: 92 },
    { rank: 3, agent: mockAgents[2], conversations: 98, avgResponseTime: "2m 05s", resolutionRate: 88 },
    { rank: 4, agent: { ...mockAgents[3], id: '5', name: "New Agent" }, conversations: 85, avgResponseTime: "2m 15s", resolutionRate: 85 },
]

export const mockUsers: User[] = [
  { id: 'user1', name: "Kelvin", avatar: "https://picsum.photos/seed/user-kelvin/100/100", email: "kelvin@example.com", phone: "+1-555-0101", assignedAgentId: '3' },
  { id: 'user2', name: "Sylvester", avatar: "https://picsum.photos/seed/user-sly/100/100", email: "sylvester@example.com", phone: "+1-555-0102" },
  { id: 'user3', name: "Linaliz", avatar: "https://picsum.photos/seed/user-linaliz/100/100", email: "linaliz@example.com", phone: "+1-555-0103", assignedAgentId: '4' },
  { id: 'user4', name: "Glory", avatar: "https://picsum.photos/seed/user-glory/100/100", email: "glory@example.com", phone: "+1-555-0104" },
  { id: 'user5', name: "Alice", avatar: "https://picsum.photos/seed/user-alice/100/100", email: "alice@example.com", phone: "+1-555-0105", assignedAgentId: '3' },
  { id: 'user6', name: "Bob", avatar: "https://picsum.photos/seed/user-bob/100/100", email: "bob@example.com", phone: "+1-555-0106" },
  { id: 'user7', name: "Charlie", avatar: "https://picsum.photos/seed/user-charlie/100/100", email: "charlie@example.com", phone: "+1-555-0107" },
  { id: 'user8', name: "Diana", avatar: "https://picsum.photos/seed/user-diana/100/100", email: "diana@example.com", phone: "+1-555-0108", assignedAgentId: '1' },
];

export const mockChats: Chat[] = []; // This will no longer be used

export const mockUnansweredQueries: UnansweredQuery[] = [
    { id: 'uq1', query: "Do you ship to Mars?", timestamp: "2 hours ago", status: 'pending' },
    { id: 'uq2', query: "Can I pay with cryptocurrency?", timestamp: "5 hours ago", status: 'pending' },
    { id: 'uq3', query: "What is the meaning of life?", timestamp: "1 day ago", status: 'resolved' },
    { id: 'uq4', query: "How do I reset my password if I forgot my email?", timestamp: "2 days ago", status: 'pending' },
];
