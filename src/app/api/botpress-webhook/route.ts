
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { User, Chat, Message, Company } from '@/types';
import { Collection, ObjectId } from 'mongodb';

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
        const body = await req.json();

        // Basic validation for incoming Botpress payload
        if (body.type !== 'message.created') {
            return NextResponse.json({ message: 'Ignoring non-message event' }, { status: 200 });
        }

        const { data: messageData } = body;
        const { botId, conversationId, userId: botpressUserId, payload, direction } = messageData;
        
        // Ignore messages sent FROM the bot to prevent loops
        if (direction === 'outgoing') {
             return NextResponse.json({ message: 'Ignoring outgoing bot message' }, { status: 200 });
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
        let user = await usersCollection.findOne({ email: `${botpressUserId}@botpress.io` });

        if (!user) {
            const newUserToInsert: Omit<User, 'id' | '_id'> = {
                name: `Botpress User ${botpressUserId.substring(0, 5)}`,
                email: `${botpressUserId}@botpress.io`, // Create a unique email
                avatar: '',
                phone: '',
                companyId: companyId,
                notes: [],
                online: true,
            };
            const result = await usersCollection.insertOne(newUserToInsert as any);
            user = { ...newUserToInsert, _id: result.insertedId, id: result.insertedId.toString() };
        }


        // 3. Find or create the chat
        const chatsCollection = await getChatsCollection();
        let chat = await chatsCollection.findOne({ 'user.id': user.id, companyId: companyId });

        if (!chat) {
            const newChatToInsert: Omit<Chat, 'id' | '_id'> = {
                userId: user._id,
                companyId: companyId,
                lastMessage: payload.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unreadCount: 1,
                priority: 'normal',
                channel: (messageData.channel || 'Webchat') as any,
                isChatbotActive: true, // It came from the bot, so it's active
                messages: [],
                user: user, // Embedding user for easier access
            };
            const result = await chatsCollection.insertOne(newChatToInsert as any);
            chat = { ...newChatToInsert, _id: result.insertedId, id: result.insertedId.toString() };
        } else {
             // Update existing chat
            await chatsCollection.updateOne(
                { _id: chat._id },
                { 
                    $set: { 
                        lastMessage: payload.text, 
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    },
                    $inc: { unreadCount: 1 }
                }
            );
        }

        // 4. Save the new message
        const messagesCollection = await getMessagesCollection();
        const newMessage: Omit<Message, 'id' | '_id'> = {
            chatId: chat._id,
            sender: user, // The sender is the user object
            senderId: user._id,
            text: payload.text,
            timestamp: new Date(messageData.createdAt).toISOString(),
        };

        await messagesCollection.insertOne(newMessage as any);

        console.log(`Successfully processed message for conversation ${conversationId}`);
        return NextResponse.json({ success: true, message: "Message processed" }, { status: 200 });

    } catch (error) {
        console.error('Error processing Botpress webhook:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Failed to process webhook.', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
    }
}
