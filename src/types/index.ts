
export type User = {
    _id?: any;
    id: string;
    name: string;
    avatar: string;
    email?: string;
    phone?: string;
    assignedAgentId?: string;
    online?: boolean;
    companyId?: any;
    notes?: Note[];
  };
  
  export type Message = {
    _id?: any;
    id: string;
    chatId?: any;
    sender: 'me' | User;
    senderId?: any;
    text: string;
    timestamp: string;
  };
  
  export type Priority = 'urgent' | 'high' | 'normal' | 'low';

  export type Channel = "WhatsApp" | "Webchat" | "Instagram" | "Facebook";
  
  export type Chat = {
    _id?: any;
    id: string;
    userId?: any;
    user: User;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    priority: Priority;
    messages: Message[];
    isChatbotActive: boolean;
    channel: Channel;
    companyId?: any;
  };

  export type AgentRole = "admin" | "agent" | "super_agent";

  export type Company = {
    _id?: any;
    id?: string;
    name: string;
    createdAt: Date;
  };

  export type Agent = {
    _id?: any;
    id: string;
    name: string;
    email: string;
    phone: string;
    role: AgentRole;
    avatar: string;
    password?: string;
    status?: 'Online' | 'Offline' | 'Busy';
    conversationsToday?: number;
    avgResponseTime?: string;
    csat?: number;
    companyId?: any;
  };

  export type UserProfile = {
    id: string;
    name: string;
    avatar: string;
    role: AgentRole;
    email: string;
    phone: string;
    companyId: string;
  };
  
  export type AnnouncementCategory = "General" | "Urgent" | "Training";

  export type Comment = {
    id: string;
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    content: string;
    timestamp: string;
  };

  export type Announcement = {
    _id?: any;
    id: string;
    title: string;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    date: string;
    category: AnnouncementCategory;
    content: string;
    readBy: string[]; // Store agent IDs
    comments: Comment[];
    companyId: any;
  };

  export type AgentPerformance = {
    rank: number;
    agent: Agent;
    conversations: number;
    avgResponseTime: string;
    resolutionRate: number;
  };

  export type Campaign = {
    _id?: any;
    id: string;
    title: string;
    description?: string;
    type: "Broadcast" | "Scheduled" | "Automated";
    audience: string[]; // Store contact IDs
    message: string;
    status: "Draft" | "Scheduled" | "Sending" | "Completed" | "Failed";
    companyId: any;
    createdAt: string;
    sentAt?: string;
    delivery: number;
    engagement: number;
    conversion: number;
  };

  export type UnansweredQuery = {
    id: string;
    query: string;
    timestamp: string;
    status: 'pending' | 'resolved';
  };
  
  export type ActivityLog = {
    _id?: any;
    id?: string;
    companyId: any;
    agentName: string;
    action: string;
    details: string;
    timestamp: Date | string;
  };

  export type Note = {
    id: string;
    agentId: string;
    agentName: string;
    text: string;
    timestamp: string;
};
