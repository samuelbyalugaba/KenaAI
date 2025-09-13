
import type { Agent, Chat, User } from "@/types";

export const mockAdminUser: Agent = { id: '1', name: "Samuel Byalugaba", avatar: "https://picsum.photos/id/1/100/100", email: "samuel.b@example.com", phone: "+1-555-0201", role: "admin", password: "password" };

export const mockAgents: Agent[] = [
    mockAdminUser,
    { id: '2', name: "Kelvin Malisa", avatar: "https://picsum.photos/id/1025/100/100", email: "kelvin.m@example.com", phone: "+1-555-0202", role: "admin", password: "password" },
    { id: '3', name: "Sylvester Mayaya", avatar: "https://picsum.photos/id/40/100/100", email: "sylvester.m@example.com", phone: "+1-555-0203", role: "super_agent", password: "password" },
    { id: '4', name: "Linaliz Ready", avatar: "https://picsum.photos/id/43/100/100", email: "linaliz.r@example.com", phone: "+1-555-0204", role: "agent", password: "password" },
];

export const mockUsers: User[] = [
  { id: 'user1', name: "Kelvin", avatar: "https://picsum.photos/id/1011/100/100", online: true, email: "kelvin@example.com", phone: "+1-555-0101" },
  { id: 'user2', name: "Sylvester", avatar: "https://picsum.photos/id/1025/100/100", online: false, email: "sylvester@example.com", phone: "+1-555-0102" },
  { id: 'user3', name: "Linaliz", avatar: "https://picsum.photos/id/1027/100/100", online: true, email: "linaliz@example.com", phone: "+1-555-0103" },
  { id: 'user4', name: "Glory", avatar: "https://picsum.photos/id/103/100/100", online: false, email: "glory@example.com", phone: "+1-555-0104" },
];

export const mockChats: Chat[] = [
  {
    id: "1",
    user: mockUsers[0],
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
    lastMessage: "Sure thing! 💡 I’ll schedule...",
    timestamp: "9:20 AM",
    unreadCount: 0,
    priority: "low",
    isChatbotActive: false,
    messages: [
      { id: "m1", sender: { name: "Sylvester", avatar: "https://picsum.photos/id/1005/100/100", online: true }, text: "Hi there 👋 Can you help me set up an online store?", timestamp: "09:15 AM" },
      { id: "m2", sender: "me", text: "Hello Sylvester! 🌟 Yes, we specialize in e-commerce platforms with secure payments and inventory management.", timestamp: "09:16 AM" },
      { id: "m3", sender: { name: "Sylvester", avatar: "https://picsum.photos/id/1005/100/100", online: true }, text: "That sounds great! Do you also integrate delivery tracking?", timestamp: "09:17 AM" },
      { id: "m4", sender: "me", text: "Absolutely 🚚 We can integrate real-time tracking and automated notifications for your customers.", timestamp: "09:18 AM" },
      { id: "m5", sender: { name: "Sylvester", avatar: "https://picsum.photos/id/1005/100/100", online: true }, text: "Perfect 🙌 I’d love a demo of how it works.", timestamp: "09:19 AM" },
      { id: "m6", sender: "me", text: "Sure thing! 💡 I’ll schedule a quick demo for you this afternoon.", timestamp: "09:20 AM" }
    ],
  },
  {
    id: "3",
    user: mockUsers[2],
    lastMessage: "Anytime, Linaliz! Let me k...",
    timestamp: "Yesterday",
    unreadCount: 0,
    priority: "normal",
    isChatbotActive: true,
    messages: [
      { id: "m1", sender: { name: "Linaliz", avatar: "https://picsum.photos/id/1012/100/100", online: true }, text: "Hello 👋 Could you tell me your business hours?", timestamp: "Yesterday" },
      { id: "m2", sender: "me", text: "Hi Linaliz! 🌸 Yes, we’re open Monday to Friday, from 9:00 AM to 6:00 PM.", timestamp: "11:06 AM" },
      { id: "m3", sender: { name: "Linaliz", avatar: "https://picsum.photos/id/1012/100/100", online: true }, text: "Great, are you available on weekends too?", timestamp: "Yesterday" },
      { id: "m4", sender: "me", text: "On Saturdays we’re open from 10:00 AM to 2:00 PM ⏰. Sundays we’re closed, but support is still available online.", timestamp: "Yesterday" },
      { id: "m5", sender: { name: "Linaliz", avatar: "https://picsum.photos/id/1012/100/100", online: true }, text: "Perfect, thanks for clarifying 🙌", timestamp: "Yesterday" },
      { id: "m6", sender: "me", text: "Anytime, Linaliz! Let me know if you’d like me to book you a slot during business hours.", timestamp: "Yesterday" }
    ],
  },
  {
    id: "4",
    user: mockUsers[3],
    lastMessage: "My order hasn't arri...",
    timestamp: "Yesterday",
    unreadCount: 1,
    priority: "high",
    isChatbotActive: false,
    messages: [
      { id: "m1", sender: { name: "Glory", avatar: "https://picsum.photos/id/1027/100/100", online: true }, text: "Hi, I placed an order three weeks ago but it still hasn’t arrived 😟", timestamp: "02:15 PM" },
      { id: "m2", sender: "me", text: "Hello Glory! 🤖 I’m checking your order details. Please provide your order number.", timestamp: "02:16 PM" },
      { id: "m3", sender: { name: "Glory", avatar: "https://picsum.photos/id/1027/100/100", online: true }, text: "Sure, it’s #ORD4582", timestamp: "02:17 PM" },
      { id: "m4", sender: "me", text: "Thanks! 🔍 This looks like it may need special assistance. Transferring you to a human support agent...", timestamp: "02:18 PM" },
      { id: "m5", sender: "me", text: "Hi Glory, this is Sylvester from support 👋 I’ll personally look into your order.", timestamp: "02:19 PM" },
      { id: "m6", sender: "me", text: "I see your package was delayed at the courier’s end 🚚. I’ll escalate this and request priority shipping.", timestamp: "02:20 PM" },
      { id: "m7", sender: { name: "Glory", avatar: "https://picsum.photos/id/1027/100/100", online: true }, text: "Okay, I really hope it arrives soon. I’ve been waiting a long time.", timestamp: "02:21 PM" },
    ]
  },
];
