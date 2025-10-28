
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
    console.log(`[WEBHOOK] Received a new request. URL: ${req.url}`);

    try {
        const { searchParams } = new URL(req.url);
        const botId = searchParams.get('botId');
        const botpressUserId = searchParams.get('userId');
        const text = searchParams.get('text');

        console.log(`[WEBHOOK] Parsed Query Params: botId=${botId}, userId=${botpressUserId}, text=${text}`);

        // Basic validation for the event object
        if (!botId || !botpressUserId || !text) {
            console.error('[WEBHOOK_ERROR] Missing required fields in query parameters.');
            return NextResponse.json({ error: 'Missing botId, userId, or text in query parameters.' }, { status: 400 });
        }
        
        // 1. Find the company associated with this bot
        console.log(`[WEBHOOK] Step 1: Finding company for botId: ${botId}`);
        const companiesCollection = await getCompaniesCollection();
        const company = await companiesCollection.findOne({ botpressBotId: botId });

        if (!company) {
            console.error(`[WEBHOOK_ERROR] Company not found for botId: ${botId}`);
            return NextResponse.json({ error: 'Company not found for this bot.' }, { status: 404 });
        }
        const companyId = company._id;
        console.log(`[WEBHOOK] Company found: ${company.name} (ID: ${companyId})`);


        // 2. Find or create the user (contact)
        console.log(`[WEBHOOK] Step 2: Finding or creating user for botpressUserId: ${botpressUserId}`);
        const usersCollection = await getUsersCollection();
        const userEmail = `${botpressUserId}@botpress.io`;
        let user = await usersCollection.findOne({ email: userEmail, companyId: companyId });

        if (!user) {
            console.log(`[WEBHOOK] User not found. Creating new user...`);
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
            console.log(`[WEBHOOK] New user created with ID: ${user._id}`);
        } else {
            console.log(`[WEBHOOK] Existing user found with ID: ${user._id}`);
        }

        // --- AI Prioritization ---
        console.log("[WEBHOOK] Step 3: Running AI chat prioritization...");
        const { priority } = await chatPrioritization({ chatText: text });
        console.log(`[WEBHOOK] AI assigned priority: ${priority}`);


        // 4. Find or create the chat
        console.log(`[WEBHOOK] Step 4: Finding or creating chat for user ID: ${user._id}`);
        const chatsCollection = await getChatsCollection();
        let chat = await chatsCollection.findOne({ userId: user._id, companyId: companyId });

        if (!chat) {
            console.log(`[WEBHOOK] Chat not found. Creating new chat...`);
            const newChatToInsert: Omit<Chat, 'id' | '_id'> = {
                userId: user._id,
                user: user,
                companyId: companyId,
                lastMessage: text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unreadCount: 1,
                priority: priority as Priority,
                channel: 'Webchat',
                isChatbotActive: true,
                messages: [],
            };
            const result = await chatsCollection.insertOne(newChatToInsert as any);
            const createdChat = await chatsCollection.findOne({ _id: result.insertedId });
            if (!createdChat) {
                 throw new Error("[WEBHOOK_ERROR] Failed to retrieve created chat");
            }
            chat = { ...createdChat, user: user, messages: [] };
            console.log(`[WEBHOOK] New chat created with ID: ${chat._id}`);

        } else {
            console.log(`[WEBHOOK] Existing chat found (ID: ${chat._id}). Updating...`);
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
            console.log(`[WEBHOOK] Chat updated successfully.`);
        }

        // 5. Save the new message
        console.log(`[WEBHOOK] Step 5: Saving new message to chat ID: ${chat._id}`);
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
        console.log(`[WEBHOOK] New message saved successfully.`);

        console.log(`[WEBHOOK_SUCCESS] Successfully processed message for user ${botpressUserId}`);
        return NextResponse.json({ success: true, message: "Message processed" }, { status: 200 });

    } catch (error) {
        console.error('[WEBHOOK_FATAL] Error processing Botpress webhook:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Failed to process webhook.', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
    }
}
