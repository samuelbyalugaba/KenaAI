export type User = {
    name: string;
    avatar: string;
    online: boolean;
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
  