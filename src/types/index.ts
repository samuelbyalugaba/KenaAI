

export type User = {
    name: string;
    avatar: string;
    online: boolean;
    email?: string;
    phone?: string;
  };
  
  export type Message = {
    id: string;
    sender: 'me' | User;
    text: string;
    timestamp: string;
  };
  
  export type Priority = 'urgent' | 'high' | 'normal' | 'low';
  
  export type Chat = {
    id: string;
    user: User;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    priority: Priority;
    messages: Message[];
    isChatbotActive: boolean;
  };

  export type AgentRole = "admin" | "agent" | "super_agent";

  export type Agent = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: AgentRole;
    avatar: string;
  };

  export type UserProfile = {
    name: string;
    avatar: string;
    role: AgentRole;
  };
  
  export type AnnouncementCategory = "General" | "Urgent" | "Training";

  export type Announcement = {
    id: string;
    title: string;
    author: Agent;
    date: string;
    category: AnnouncementCategory;
    content: string;
    readBy: Agent[];
  };

  export type AgentPerformance = {
    rank: number;
    agent: Agent;
    conversations: number;
    avgResponseTime: string;
    resolutionRate: number;
  };

