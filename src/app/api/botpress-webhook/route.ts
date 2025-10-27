
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { User, Chat, Message, Company, Priority } from '@/types';
import { Collection, ObjectId } from 'mongodb';
import { chatPrioritization } from '@/ai/flows/chat-prioritization';

// Helper function to get database collections
async function getCompaniesCollection(): Promise<Collection<Company>> {
    const db = await getDb();
    return db.collection<Company>('companies');
}

async function getUsersCollection(): Promise<Collection<User>> {
    const db = await getDb();
    return db.collection<User>('contacts');
}

async function getChatsCollection(): Promise<Collection<Chat>> {
    const db = await getDb();
    return db.collection<Chat>('chats');
}

async function getMessagesCollection(): Promise<Collection<Message>> {
    const db = await getDb();
    return db.collection<Message>('messages');
}


// This is the main webhook handler
export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const botId = searchParams.get('botId');
        const botpressUserId = searchParams.get('userId');
        const text = searchParams.get('text');

        // Basic validation for the event object
        if (!botId || !botpressUserId || !text) {
            console.error('Webhook Error: Missing required fields in query parameters.', { botId, botpressUserId, text });
            return NextResponse.json({ error: 'Missing botId, userId, or text in query parameters.' }, { status: 400 });
        }
        
        // 1. Find the company associated with this bot
        const companiesCollection = await getCompaniesCollection();
        const company = await companiesCollection.findOne({ botpressBotId: botId });

        if (!company) {
            console.error(`Webhook Error: Company not found for botId: ${botId}`);
            return NextResponse.json({ error: 'Company not found for this bot.' }, { status: 404 });
        }
        const companyId = company._id;

        // 2. Find or create the user (contact)
        const usersCollection = await getUsersCollection();
        const userEmail = `${botpressUserId}@botpress.io`;
        let user = await usersCollection.findOne({ email: userEmail, companyId: companyId });

        if (!user) {
            const newUserToInsert: Omit<User, 'id' | '_id'> = {
                name: `Botpress User ${botpressUserId.substring(0, 5)}`,
                email: userEmail,
                avatar: `https://picsum.photos/seed/${botpressUserId}/100/100`,
                phone: '',
                companyId: companyId,
                notes: [],
                online: true,
            };
            const result = await usersCollection.insertOne(newUserToInsert as any);
            user = { ...newUserToInsert, _id: result.insertedId, id: result.insertedId.toString(), companyId: companyId.toString() };
        }

        // --- AI Prioritization ---
        const { priority } = await chatPrioritization({ chatText: text });


        // 3. Find or create the chat
        const chatsCollection = await getChatsCollection();
        let chat = await chatsCollection.findOne({ userId: user._id, companyId: companyId });

        if (!chat) {
            const newChatToInsert: Omit<Chat, 'id' | '_id'> = {
                userId: user._id,
                user: user, // <-- CRITICAL FIX: Embed the user object
                companyId: companyId,
                lastMessage: text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unreadCount: 1,
                priority: priority as Priority,
                channel: 'Webchat', // Default channel, can be customized
                isChatbotActive: true, // It came from the bot, so it's active
                messages: [],
            };
            const result = await chatsCollection.insertOne(newChatToInsert as any);
            const createdChat = await chatsCollection.findOne({ _id: result.insertedId });
            if (!createdChat) {
                 throw new Error("Failed to retrieve created chat");
            }
            chat = { ...createdChat, user: user, messages: [] };

        } else {
             // Update existing chat
            await chatsCollection.updateOne(
                { _id: chat._id },
                { 
                    $set: { 
                        lastMessage: text, 
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        priority: priority as Priority,
                    },
                    $inc: { unreadCount: 1 }
                }
            );
        }

        // 4. Save the new message
        const messagesCollection = await getMessagesCollection();
        const newMessage: Omit<Message, 'id' | '_id'> = {
            chatId: chat._id,
            sender: {
                ...user,
                _id: user._id.toString(),
                id: user._id.toString(),
            },
            senderId: user._id,
            text: text,
            timestamp: new Date().toISOString(),
        };

        await messagesCollection.insertOne(newMessage as any);

        console.log(`Successfully processed message for user ${botpressUserId}`);
        return NextResponse.json({ success: true, message: "Message processed" }, { status: 200 });

    } catch (error) {
        console.error('Error processing Botpress webhook:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Failed to process webhook.', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
    }
}
