module.exports = {

"[project]/.next-internal/server/app/api/botpress-webhook/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/mongodb [external] (mongodb, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}}),
"[project]/src/lib/db.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getDb": (()=>getDb)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri, {});
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    "TURBOPACK unreachable";
}
let db;
async function getDb() {
    if (db) {
        return db;
    }
    const mongoClient = await clientPromise;
    const dbName = new URL(uri).pathname.substring(1) || 'kena-ai';
    db = mongoClient.db(dbName);
    console.log(`Connected to database: ${db.databaseName}`);
    return db;
}
}}),
"[project]/src/app/api/botpress-webhook/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
;
// Helper function to get database collections
async function getCompaniesCollection() {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    return db.collection('companies');
}
async function getUsersCollection() {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    return db.collection('contacts');
}
async function getChatsCollection() {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    return db.collection('chats');
}
async function getMessagesCollection() {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
    return db.collection('messages');
}
async function POST(req) {
    try {
        const body = await req.json();
        // Basic validation for incoming Botpress payload
        if (body.type !== 'message.created') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Ignoring non-message event'
            }, {
                status: 200
            });
        }
        const { data: messageData } = body;
        const { botId, conversationId, userId: botpressUserId, payload, direction } = messageData;
        // Ignore messages sent FROM the bot to prevent loops
        if (direction === 'outgoing') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Ignoring outgoing bot message'
            }, {
                status: 200
            });
        }
        // 1. Find the company associated with this bot
        const companiesCollection = await getCompaniesCollection();
        const company = await companiesCollection.findOne({
            botpressBotId: botId
        });
        if (!company) {
            console.error(`Webhook Error: Company not found for botId: ${botId}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Company not found for this bot.'
            }, {
                status: 404
            });
        }
        const companyId = company._id;
        // 2. Find or create the user (contact)
        const usersCollection = await getUsersCollection();
        let user = await usersCollection.findOne({
            email: `${botpressUserId}@botpress.io`
        });
        if (!user) {
            const newUserToInsert = {
                name: `Botpress User ${botpressUserId.substring(0, 5)}`,
                email: `${botpressUserId}@botpress.io`,
                avatar: '',
                phone: '',
                companyId: companyId,
                notes: [],
                online: true
            };
            const result = await usersCollection.insertOne(newUserToInsert);
            user = {
                ...newUserToInsert,
                _id: result.insertedId,
                id: result.insertedId.toString()
            };
        }
        // 3. Find or create the chat
        const chatsCollection = await getChatsCollection();
        let chat = await chatsCollection.findOne({
            'user.id': user.id,
            companyId: companyId
        });
        if (!chat) {
            const newChatToInsert = {
                userId: user._id,
                companyId: companyId,
                lastMessage: payload.text,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                unreadCount: 1,
                priority: 'normal',
                channel: messageData.channel || 'Webchat',
                isChatbotActive: true,
                messages: [],
                user: user
            };
            const result = await chatsCollection.insertOne(newChatToInsert);
            chat = {
                ...newChatToInsert,
                _id: result.insertedId,
                id: result.insertedId.toString()
            };
        } else {
            // Update existing chat
            await chatsCollection.updateOne({
                _id: chat._id
            }, {
                $set: {
                    lastMessage: payload.text,
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                },
                $inc: {
                    unreadCount: 1
                }
            });
        }
        // 4. Save the new message
        const messagesCollection = await getMessagesCollection();
        const newMessage = {
            chatId: chat._id,
            sender: user,
            senderId: user._id,
            text: payload.text,
            timestamp: new Date(messageData.createdAt).toISOString()
        };
        await messagesCollection.insertOne(newMessage);
        console.log(`Successfully processed message for conversation ${conversationId}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Message processed"
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error processing Botpress webhook:', error);
        if (error instanceof Error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to process webhook.',
                details: error.message
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'An unknown error occurred.'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__d4dd72e2._.js.map