# KenaAI - Intelligent Customer Engagement Platform

Welcome to KenaAI, a modern, responsive chat dashboard designed to streamline customer communication with powerful AI-driven features. This application is built with Next.js, React, ShadCN UI, Tailwind CSS, and Genkit for its generative AI capabilities.

## ✨ Key Features

### 1. Authentication & User Management
- **Secure Sign-in/Sign-up**: A polished authentication form for agents to access the dashboard.
- **Role-Based Access Control**:
  - **Admin**: Full access to all features, including the Analytics Dashboard and Agent Management.
  - **Super Agent**: Access to most features, including agent management and campaigns.
  - **Agent**: Access to core chat functionalities and personal performance metrics.
- **Social Login**: Quick and easy sign-in using a Google account.
- **Light & Dark Mode**: A beautiful, brand-aligned interface that works perfectly in both light and dark themes.

### 2. Live Chat Dashboard
- **Centralized Inbox**: View and manage all customer conversations from different channels in one place.
- **Real-time Messaging**: Engage with customers through a clean and intuitive chat interface.
- **Chat List**: See an overview of all conversations with user avatars, last message previews, timestamps, and unread message counts.
- **Filtering and Search**: Easily find chats by searching for customer names or message content, and filter by communication channel (e.g., WhatsApp, Webchat, Facebook).
- **Start New Chats**: Initiate conversations with existing contacts or add new ones on the fly.
- **Chat Details**: View contact information and channel directly within the chat header.
- **Private Notes**: Add internal notes to a contact's profile to keep track of important information.

### 3. AI-Powered Capabilities
- **Intelligent Chat Summary**: Instantly generate a concise, AI-powered summary of any long chat conversation.
- **Chat Prioritization**: An AI flow analyzes incoming messages to automatically assign a priority level (`Urgent`, `High`, `Normal`, `Low`).
- **Hybrid Chat Mode**: Seamlessly toggle individual chats between **Bot Mode** (handled by AI) and **Manual Mode** (handled by a human agent).
- **Unanswered Query Analysis**: The dashboard logs queries the chatbot couldn't answer, allowing admins to resolve them or add them to the knowledge base to improve the bot over time.

### 4. Admin & Management Views
- **Analytics Dashboard**: (Admin-only) A comprehensive overview of key performance indicators (KPIs).
  - **Key Metrics**: Track total conversations, bot vs. agent engagement, average response time, and customer satisfaction (CSAT).
  - **Visualizations**: View charts for conversation volume and breakdown by channel.
  - **Agent Leaderboard**: Monitor agent performance with metrics like conversations handled and resolution rate.
  - **Smart Alerts**: Get notified about important events, like a spike in negative sentiment.
  - **Exporting**: Export reports as PDF/CSV or schedule them to be sent via email.
- **Agent Management**: (Admin/Super Agent)
  - **Agent Directory**: View, search, and filter all agents on the team.
  - **Add New Agents**: A simple form to onboard new team members with specific roles.
  - **Performance Insights**: See stats on the most active agents and compare response times.
- **Contact Management**:
  - **Contact Directory**: A central place to view all customer contacts.
  - **Detailed Profiles**: See contact details, assign a dedicated agent, view conversation history, and manage internal notes.
- **Campaigns & Bulk Messaging**: (Admin/Super Agent)
  - Create and manage outbound messaging campaigns.
  - A step-by-step wizard to define campaign details, audience, message, and schedule.
- **Announcements**:
  - Publish internal announcements to the entire team.
  - Supports different categories (e.g., General, Urgent) and shows a "read by" list.
  - Includes a space for internal discussion on each announcement.
- **My Performance**: A personalized dashboard for each agent to track their own stats, including conversations handled, response time, resolution rate, and CSAT scores.

### 5. Settings & Customization
- **User Profile**: Update personal information, change passwords, and manage profile photos.
- **Notification Preferences**: Configure in-app, email, and push notifications.
- **Appearance**: Switch between light and dark themes, and set language or time zone preferences.
- **System Settings**: (Admin-only) Manage integrations, team permissions, and chatbot behavior.
