
import type { Agent, Chat, User, AgentPerformance } from "@/types";

export const mockAdminUser: Agent = { id: '1', name: "Samuel Byalugaba", avatar: "https://picsum.photos/seed/sam/100/100", email: "samuel.b@example.com", phone: "+1-555-0201", role: "admin", password: "password" };

export const mockAgents: Agent[] = [
    mockAdminUser,
    { id: '2', name: "Kelvin Malisa", avatar: "https://picsum.photos/seed/kelvin/100/100", email: "kelvin.m@example.com", phone: "+1-555-0202", role: "admin", password: "password" },
    { id: '3', name: "Sylvester Mayaya", avatar: "https://picsum.photos/seed/sly/100/100", email: "sylvester.m@example.com", phone: "+1-555-0203", role: "super_agent", password: "password" },
    { id: '4', name: "Linaliz Ready", avatar: "https://picsum.photos/seed/linaliz/100/100", email: "linaliz.r@example.com", phone: "+1-555-0204", role: "agent", password: "password" },
];

export const mockAgentPerformance: AgentPerformance[] = [
    { rank: 1, agent: mockAgents[0], conversations: 125, avgResponseTime: "1m 30s", resolutionRate: 95 },
    { rank: 2, agent: mockAgents[1], conversations: 110, avgResponseTime: "1m 45s", resolutionRate: 92 },
    { rank: 3, agent: mockAgents[2], conversations: 98, avgResponseTime: "2m 05s", resolutionRate: 88 },
    { rank: 4, agent: { id: '5', name: "New Agent", avatar: "https://picsum.photos/seed/new/100/100", email: "new.a@example.com", phone: "+1-555-0204", role: "agent", password: "password" }, conversations: 85, avgResponseTime: "2m 15s", resolutionRate: 85 },
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

export const mockChats: Chat[] = [
  {
    id: "1",
    user: mockUsers[0],
    channel: 'Webchat',
    lastMessage: "Absolutely 🎨 We provide ful...",
    timestamp: "10:41 AM",
    unreadCount: 0,
    priority: "urgent",
    isChatbotActive: true,
    messages: [
      { id: "m1", sender: mockUsers[0], text: "Hello 👋 What services do you offer?", timestamp: "10:38 AM" },
      { id: "m2", sender: "me", text: "Hi Kelvin! 🚀 We offer web app development, mobile app solutions, and AI-powered chatbots.", timestamp: "10:39 AM" },
      { id: "m3", sender: mockUsers[0], text: "Nice! Do you also handle design?", timestamp: "10:40 AM" },
      { id: "m4", sender: "me", text: "Absolutely 🎨 We provide full-stack design: UI/UX, branding, and even responsive front-end with React.", timestamp: "10:41 AM" },
    ],
  },
  {
    id: "2",
    user: mockUsers[1],
    channel: 'WhatsApp',
    lastMessage: "Sure thing! 💡 I’ll schedule...",
    timestamp: "9:20 AM",
    unreadCount: 0,
    priority: "low",
    isChatbotActive: false,
    messages: [
      { id: "m1", sender: mockUsers[1], text: "Hi there 👋 Can you help me set up an online store?", timestamp: "09:15 AM" },
      { id: "m2", sender: "me", text: "Hello Sylvester! 🌟 Yes, we specialize in e-commerce platforms with secure payments and inventory management.", timestamp: "09:16 AM" },
      { id: "m3", sender: mockUsers[1], text: "That sounds great! Do you also integrate delivery tracking?", timestamp: "09:17 AM" },
      { id: "m4", sender: "me", text: "Absolutely 🚚 We can integrate real-time tracking and automated notifications for your customers.", timestamp: "09:18 AM" },
      { id: "m5", sender: mockUsers[1], text: "Perfect 🙌 I’d love a demo of how it works.", timestamp: "09:19 AM" },
      { id: "m6", sender: "me", text: "Sure thing! 💡 I’ll schedule a quick demo for you this afternoon.", timestamp: "09:20 AM" }
    ],
  },
  {
    id: "3",
    user: mockUsers[2],
    channel: 'Instagram',
    lastMessage: "Anytime, Linaliz! Let me k...",
    timestamp: "Yesterday",
    unreadCount: 0,
    priority: "normal",
    isChatbotActive: true,
    messages: [
      { id: "m1", sender: mockUsers[2], text: "Hello 👋 Could you tell me your business hours?", timestamp: "Yesterday" },
      { id: "m2", sender: "me", text: "Hi Linaliz! 🌸 Yes, we’re open Monday to Friday, from 9:00 AM to 6:00 PM.", timestamp: "11:06 AM" },
      { id: "m3", sender: mockUsers[2], text: "Great, are you available on weekends too?", timestamp: "Yesterday" },
      { id: "m4", sender: "me", text: "On Saturdays we’re open from 10:00 AM to 2:00 PM ⏰. Sundays we’re closed, but support is still available online.", timestamp: "Yesterday" },
      { id: "m5", sender: mockUsers[2], text: "Perfect, thanks for clarifying 🙌", timestamp: "Yesterday" },
      { id: "m6", sender: "me", text: "Anytime, Linaliz! Let me know if you’d like me to book you a slot during business hours.", timestamp: "Yesterday" }
    ],
  },
  {
    id: "4",
    user: mockUsers[3],
    channel: 'Facebook',
    lastMessage: "My order hasn't arri...",
    timestamp: "Yesterday",
    unreadCount: 1,
    priority: "high",
    isChatbotActive: false,
    messages: [
      { id: "m1", sender: mockUsers[3], text: "Hi, I placed an order three weeks ago but it still hasn’t arrived 😟", timestamp: "02:15 PM" },
      { id: "m2", sender: "me", text: "Hello Glory! 🤖 I’m checking your order details. Please provide your order number.", timestamp: "02:16 PM" },
      { id: "m3", sender: mockUsers[3], text: "Sure, it’s #ORD4582", timestamp: "02:17 PM" },
      { id: "m4", sender: "me", text: "Thanks! 🔍 This looks like it may need special assistance. Transferring you to a human support agent...", timestamp: "02:18 PM" },
      { id: "m5", sender: "me", text: "Hi Glory, this is Sylvester from support 👋 I’ll personally look into your order.", timestamp: "02:19 PM" },
      { id: "m6", sender: "me", text: "I see your package was delayed at the courier’s end 🚚. I’ll escalate this and request priority shipping.", timestamp: "02:20 PM" },
      { id: "m7", sender: mockUsers[3], text: "Okay, I really hope it arrives soon. I’ve been waiting a long time.", timestamp: "02:21 PM" },
    ]
  },
  {
    id: "5",
    user: mockUsers[4],
    channel: 'Webchat',
    lastMessage: "Yes, we have a student discount.",
    timestamp: "2 days ago",
    unreadCount: 0,
    priority: "low",
    isChatbotActive: false,
    messages: [
       { id: "m1", sender: mockUsers[4], text: "Do you offer student discounts?", timestamp: "2 days ago" },
       { id: "m2", sender: "me", text: "Yes, we have a student discount.", timestamp: "2 days ago" },
    ],
  },
  {
    id: "6",
    user: mockUsers[5],
    channel: 'WhatsApp',
    lastMessage: "Can I change my delivery address?",
    timestamp: "2 days ago",
    unreadCount: 2,
    priority: "normal",
    isChatbotActive: false,
    messages: [
        { id: "m1", sender: mockUsers[5], text: "Can I change my delivery address?", timestamp: "2 days ago" },
    ],
  },
  {
    id: "7",
    user: mockUsers[6],
    channel: 'Instagram',
    lastMessage: "What's your return policy?",
    timestamp: "3 days ago",
    unreadCount: 0,
    priority: "normal",
    isChatbotActive: true,
    messages: [
      { id: "m1", sender: mockUsers[6], text: "What's your return policy?", timestamp: "3 days ago" },
      { id: "m2", sender: "me", text: "You can return any item within 30 days of purchase.", timestamp: "3 days ago" },
    ],
  },
  {
    id: "8",
    user: mockUsers[7],
    channel: 'Facebook',
    lastMessage: "The app is crashing on startup.",
    timestamp: "4 days ago",
    unreadCount: 0,
    priority: "urgent",
    isChatbotActive: false,
    messages: [
      { id: "m1", sender: mockUsers[7], text: "The app is crashing on startup.", timestamp: "4 days ago" },
      { id: "m2", sender: "me", text: "We're sorry to hear that. Could you tell me which device you are using?", timestamp: "4 days ago" },
    ],
  },
];
