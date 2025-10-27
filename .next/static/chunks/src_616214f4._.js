(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/ai/flows/data:3fb10a [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"401584ba643ed7e5c544243d17d29b0fd409ded3b0":"intelligentChatSummary"},"src/ai/flows/intelligent-chat-summary.ts",""] */ __turbopack_context__.s({
    "intelligentChatSummary": (()=>intelligentChatSummary)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var intelligentChatSummary = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("401584ba643ed7e5c544243d17d29b0fd409ded3b0", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "intelligentChatSummary"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vaW50ZWxsaWdlbnQtY2hhdC1zdW1tYXJ5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc2VydmVyJztcblxuLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IFRoaXMgZmlsZSBkZWZpbmVzIGEgR2Vua2l0IGZsb3cgZm9yIHN1bW1hcml6aW5nIGxvbmcgY2hhdCB0aHJlYWRzIHVzaW5nIEFJLlxuICpcbiAqIFRoZSBmbG93IHRha2VzIGEgY2hhdCB0aHJlYWQgYXMgaW5wdXQgYW5kIHJldHVybnMgYSBjb25jaXNlIHN1bW1hcnkgb2YgdGhlIGNvbnZlcnNhdGlvbidzIGtleSBwb2ludHMuXG4gKlxuICogQGludGVyZmFjZSBJbnRlbGxpZ2VudENoYXRTdW1tYXJ5SW5wdXQgLSBEZWZpbmVzIHRoZSBpbnB1dCBzY2hlbWEgZm9yIHRoZSBpbnRlbGxpZ2VudENoYXRTdW1tYXJ5IGZ1bmN0aW9uLlxuICogQGludGVyZmFjZSBJbnRlbGxpZ2VudENoYXRTdW1tYXJ5T3V0cHV0IC0gRGVmaW5lcyB0aGUgb3V0cHV0IHNjaGVtYSBmb3IgdGhlIGludGVsbGlnZW50Q2hhdFN1bW1hcnkgZnVuY3Rpb24uXG4gKiBAZnVuY3Rpb24gaW50ZWxsaWdlbnRDaGF0U3VtbWFyeSAtIEEgd3JhcHBlciBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSBpbnRlbGxpZ2VudENoYXRTdW1tYXJ5RmxvdyB3aXRoIHRoZSBpbnB1dCBhbmQgcmV0dXJucyB0aGUgb3V0cHV0LlxuICovXG5cbmltcG9ydCB7YWl9IGZyb20gJ0AvYWkvZ2Vua2l0JztcbmltcG9ydCB7en0gZnJvbSAnZ2Vua2l0JztcblxuY29uc3QgSW50ZWxsaWdlbnRDaGF0U3VtbWFyeUlucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBjaGF0VGhyZWFkOiB6XG4gICAgLnN0cmluZygpXG4gICAgLmRlc2NyaWJlKCdUaGUgY29tcGxldGUgY2hhdCB0aHJlYWQgdG8gYmUgc3VtbWFyaXplZC4nKSxcbn0pO1xuXG5leHBvcnQgdHlwZSBJbnRlbGxpZ2VudENoYXRTdW1tYXJ5SW5wdXQgPSB6LmluZmVyPFxuICB0eXBlb2YgSW50ZWxsaWdlbnRDaGF0U3VtbWFyeUlucHV0U2NoZW1hXG4+O1xuXG5jb25zdCBJbnRlbGxpZ2VudENoYXRTdW1tYXJ5T3V0cHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBzdW1tYXJ5OiB6LnN0cmluZygpLmRlc2NyaWJlKCdBIGNvbmNpc2Ugc3VtbWFyeSBvZiB0aGUgY2hhdCB0aHJlYWQuJyksXG59KTtcblxuZXhwb3J0IHR5cGUgSW50ZWxsaWdlbnRDaGF0U3VtbWFyeU91dHB1dCA9IHouaW5mZXI8XG4gIHR5cGVvZiBJbnRlbGxpZ2VudENoYXRTdW1tYXJ5T3V0cHV0U2NoZW1hXG4+O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW50ZWxsaWdlbnRDaGF0U3VtbWFyeShcbiAgaW5wdXQ6IEludGVsbGlnZW50Q2hhdFN1bW1hcnlJbnB1dFxuKTogUHJvbWlzZTxJbnRlbGxpZ2VudENoYXRTdW1tYXJ5T3V0cHV0PiB7XG4gIHJldHVybiBpbnRlbGxpZ2VudENoYXRTdW1tYXJ5RmxvdyhpbnB1dCk7XG59XG5cbmNvbnN0IHByb21wdCA9IGFpLmRlZmluZVByb21wdCh7XG4gIG5hbWU6ICdpbnRlbGxpZ2VudENoYXRTdW1tYXJ5UHJvbXB0JyxcbiAgaW5wdXQ6IHtzY2hlbWE6IEludGVsbGlnZW50Q2hhdFN1bW1hcnlJbnB1dFNjaGVtYX0sXG4gIG91dHB1dDoge3NjaGVtYTogSW50ZWxsaWdlbnRDaGF0U3VtbWFyeU91dHB1dFNjaGVtYX0sXG4gIHByb21wdDogYFlvdSBhcmUgYW4gQUkgZXhwZXJ0IHNwZWNpYWxpemluZyBpbiBzdW1tYXJpemluZyBjaGF0IHRocmVhZHMuXG5cbiAgUGxlYXNlIHByb3ZpZGUgYSBjb25jaXNlIHN1bW1hcnkgb2YgdGhlIGtleSBwb2ludHMgaW4gdGhlIGZvbGxvd2luZyBjaGF0IHRocmVhZDpcbiAgXFxcInt7e2NoYXRUaHJlYWR9fX1cXFwiLlxuICBUaGUgc3VtbWFyeSBzaG91bGQgYmUgbm8gbW9yZSB0aGFuIDIwMCB3b3Jkcy5cbiAgYCxcbn0pO1xuXG5jb25zdCBpbnRlbGxpZ2VudENoYXRTdW1tYXJ5RmxvdyA9IGFpLmRlZmluZUZsb3coXG4gIHtcbiAgICBuYW1lOiAnaW50ZWxsaWdlbnRDaGF0U3VtbWFyeUZsb3cnLFxuICAgIGlucHV0U2NoZW1hOiBJbnRlbGxpZ2VudENoYXRTdW1tYXJ5SW5wdXRTY2hlbWEsXG4gICAgb3V0cHV0U2NoZW1hOiBJbnRlbGxpZ2VudENoYXRTdW1tYXJ5T3V0cHV0U2NoZW1hLFxuICB9LFxuICBhc3luYyBpbnB1dCA9PiB7XG4gICAgY29uc3Qge291dHB1dH0gPSBhd2FpdCBwcm9tcHQoaW5wdXQpO1xuICAgIHJldHVybiBvdXRwdXQhO1xuICB9XG4pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ3VEFpQ3NCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/use-mobile.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useIsMobile": (()=>useIsMobile)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
    _s();
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useIsMobile.useEffect": ()=>{
            const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
            const onChange = {
                "useIsMobile.useEffect.onChange": ()=>{
                    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
                }
            }["useIsMobile.useEffect.onChange"];
            mql.addEventListener("change", onChange);
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
            return ({
                "useIsMobile.useEffect": ()=>mql.removeEventListener("change", onChange)
            })["useIsMobile.useEffect"];
        }
    }["useIsMobile.useEffect"], []);
    return !!isMobile;
}
_s(useIsMobile, "D6B2cPXNCaIbeOx+abFr1uxLRM0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/use-theme.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useTheme": (()=>useTheme)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/theme-provider.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const useTheme = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeContext"]);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
_s(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/mock-data.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "mockAdminUser": (()=>mockAdminUser),
    "mockAgentPerformance": (()=>mockAgentPerformance),
    "mockAgents": (()=>mockAgents),
    "mockChats": (()=>mockChats),
    "mockUnansweredQueries": (()=>mockUnansweredQueries),
    "mockUsers": (()=>mockUsers)
});
const mockAdminUser = {
    id: '1',
    name: "Samuel Byalugaba",
    avatar: "https://picsum.photos/seed/sam/100/100",
    email: "samuel.b@example.com",
    phone: "+1-555-0201",
    role: "admin",
    password: "password",
    status: "Online",
    conversationsToday: 12,
    avgResponseTime: "1m 45s",
    csat: 98
};
const mockAgents = [
    mockAdminUser,
    {
        id: '2',
        name: "Kelvin Malisa",
        avatar: "https://picsum.photos/seed/kelvin/100/100",
        email: "kelvin.m@example.com",
        phone: "+1-555-0202",
        role: "admin",
        password: "password",
        status: "Online",
        conversationsToday: 15,
        avgResponseTime: "1m 30s",
        csat: 95
    },
    {
        id: '3',
        name: "Sylvester Mayaya",
        avatar: "https://picsum.photos/seed/sly/100/100",
        email: "sylvester.m@example.com",
        phone: "+1-555-0203",
        role: "super_agent",
        password: "password",
        status: "Busy",
        conversationsToday: 25,
        avgResponseTime: "2m 10s",
        csat: 92
    },
    {
        id: '4',
        name: "Linaliz Ready",
        avatar: "https://picsum.photos/seed/linaliz/100/100",
        email: "linaliz.r@example.com",
        phone: "+1-555-0204",
        role: "agent",
        password: "password",
        status: "Offline",
        conversationsToday: 8,
        avgResponseTime: "3m 05s",
        csat: 88
    }
];
const mockAgentPerformance = [
    {
        rank: 1,
        agent: mockAgents[0],
        conversations: 125,
        avgResponseTime: "1m 30s",
        resolutionRate: 95
    },
    {
        rank: 2,
        agent: mockAgents[1],
        conversations: 110,
        avgResponseTime: "1m 45s",
        resolutionRate: 92
    },
    {
        rank: 3,
        agent: mockAgents[2],
        conversations: 98,
        avgResponseTime: "2m 05s",
        resolutionRate: 88
    },
    {
        rank: 4,
        agent: {
            ...mockAgents[3],
            id: '5',
            name: "New Agent"
        },
        conversations: 85,
        avgResponseTime: "2m 15s",
        resolutionRate: 85
    }
];
const mockUsers = [
    {
        id: 'user1',
        name: "Kelvin",
        avatar: "https://picsum.photos/seed/user-kelvin/100/100",
        email: "kelvin@example.com",
        phone: "+1-555-0101",
        assignedAgentId: '3'
    },
    {
        id: 'user2',
        name: "Sylvester",
        avatar: "https://picsum.photos/seed/user-sly/100/100",
        email: "sylvester@example.com",
        phone: "+1-555-0102"
    },
    {
        id: 'user3',
        name: "Linaliz",
        avatar: "https://picsum.photos/seed/user-linaliz/100/100",
        email: "linaliz@example.com",
        phone: "+1-555-0103",
        assignedAgentId: '4'
    },
    {
        id: 'user4',
        name: "Glory",
        avatar: "https://picsum.photos/seed/user-glory/100/100",
        email: "glory@example.com",
        phone: "+1-555-0104"
    },
    {
        id: 'user5',
        name: "Alice",
        avatar: "https://picsum.photos/seed/user-alice/100/100",
        email: "alice@example.com",
        phone: "+1-555-0105",
        assignedAgentId: '3'
    },
    {
        id: 'user6',
        name: "Bob",
        avatar: "https://picsum.photos/seed/user-bob/100/100",
        email: "bob@example.com",
        phone: "+1-555-0106"
    },
    {
        id: 'user7',
        name: "Charlie",
        avatar: "https://picsum.photos/seed/user-charlie/100/100",
        email: "charlie@example.com",
        phone: "+1-555-0107"
    },
    {
        id: 'user8',
        name: "Diana",
        avatar: "https://picsum.photos/seed/user-diana/100/100",
        email: "diana@example.com",
        phone: "+1-555-0108",
        assignedAgentId: '1'
    }
];
const mockChats = [
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
            {
                id: "m1",
                sender: mockUsers[0],
                text: "Hello 👋 What services do you offer?",
                timestamp: "10:38 AM"
            },
            {
                id: "m2",
                sender: "me",
                text: "Hi Kelvin! 🚀 We offer web app development, mobile app solutions, and AI-powered chatbots.",
                timestamp: "10:39 AM"
            },
            {
                id: "m3",
                sender: mockUsers[0],
                text: "Nice! Do you also handle design?",
                timestamp: "10:40 AM"
            },
            {
                id: "m4",
                sender: "me",
                text: "Absolutely 🎨 We provide full-stack design: UI/UX, branding, and even responsive front-end with React.",
                timestamp: "10:41 AM"
            }
        ]
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
            {
                id: "m1",
                sender: mockUsers[1],
                text: "Hi there 👋 Can you help me set up an online store?",
                timestamp: "09:15 AM"
            },
            {
                id: "m2",
                sender: "me",
                text: "Hello Sylvester! 🌟 Yes, we specialize in e-commerce platforms with secure payments and inventory management.",
                timestamp: "09:16 AM"
            },
            {
                id: "m3",
                sender: mockUsers[1],
                text: "That sounds great! Do you also integrate delivery tracking?",
                timestamp: "09:17 AM"
            },
            {
                id: "m4",
                sender: "me",
                text: "Absolutely 🚚 We can integrate real-time tracking and automated notifications for your customers.",
                timestamp: "09:18 AM"
            },
            {
                id: "m5",
                sender: mockUsers[1],
                text: "Perfect 🙌 I’d love a demo of how it works.",
                timestamp: "09:19 AM"
            },
            {
                id: "m6",
                sender: "me",
                text: "Sure thing! 💡 I’ll schedule a quick demo for you this afternoon.",
                timestamp: "09:20 AM"
            }
        ]
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
            {
                id: "m1",
                sender: mockUsers[2],
                text: "Hello 👋 Could you tell me your business hours?",
                timestamp: "Yesterday"
            },
            {
                id: "m2",
                sender: "me",
                text: "Hi Linaliz! 🌸 Yes, we’re open Monday to Friday, from 9:00 AM to 6:00 PM.",
                timestamp: "11:06 AM"
            },
            {
                id: "m3",
                sender: mockUsers[2],
                text: "Great, are you available on weekends too?",
                timestamp: "Yesterday"
            },
            {
                id: "m4",
                sender: "me",
                text: "On Saturdays we’re open from 10:00 AM to 2:00 PM ⏰. Sundays we’re closed, but support is still available online.",
                timestamp: "Yesterday"
            },
            {
                id: "m5",
                sender: mockUsers[2],
                text: "Perfect, thanks for clarifying 🙌",
                timestamp: "Yesterday"
            },
            {
                id: "m6",
                sender: "me",
                text: "Anytime, Linaliz! Let me know if you’d like me to book you a slot during business hours.",
                timestamp: "Yesterday"
            }
        ]
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
            {
                id: "m1",
                sender: mockUsers[3],
                text: "Hi, I placed an order three weeks ago but it still hasn’t arrived 😟",
                timestamp: "02:15 PM"
            },
            {
                id: "m2",
                sender: "me",
                text: "Hello Glory! 🤖 I’m checking your order details. Please provide your order number.",
                timestamp: "02:16 PM"
            },
            {
                id: "m3",
                sender: mockUsers[3],
                text: "Sure, it’s #ORD4582",
                timestamp: "02:17 PM"
            },
            {
                id: "m4",
                sender: "me",
                text: "Thanks! 🔍 This looks like it may need special assistance. Transferring you to a human support agent...",
                timestamp: "02:18 PM"
            },
            {
                id: "m5",
                sender: "me",
                text: "Hi Glory, this is Sylvester from support 👋 I’ll personally look into your order.",
                timestamp: "02:19 PM"
            },
            {
                id: "m6",
                sender: "me",
                text: "I see your package was delayed at the courier’s end 🚚. I’ll escalate this and request priority shipping.",
                timestamp: "02:20 PM"
            },
            {
                id: "m7",
                sender: mockUsers[3],
                text: "Okay, I really hope it arrives soon. I’ve been waiting a long time.",
                timestamp: "02:21 PM"
            }
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
            {
                id: "m1",
                sender: mockUsers[4],
                text: "Do you offer student discounts?",
                timestamp: "2 days ago"
            },
            {
                id: "m2",
                sender: "me",
                text: "Yes, we have a student discount.",
                timestamp: "2 days ago"
            }
        ]
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
            {
                id: "m1",
                sender: mockUsers[5],
                text: "Can I change my delivery address?",
                timestamp: "2 days ago"
            }
        ]
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
            {
                id: "m1",
                sender: mockUsers[6],
                text: "What's your return policy?",
                timestamp: "3 days ago"
            },
            {
                id: "m2",
                sender: "me",
                text: "You can return any item within 30 days of purchase.",
                timestamp: "3 days ago"
            }
        ]
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
            {
                id: "m1",
                sender: mockUsers[7],
                text: "The app is crashing on startup.",
                timestamp: "4 days ago"
            },
            {
                id: "m2",
                sender: "me",
                text: "We're sorry to hear that. Could you tell me which device you are using?",
                timestamp: "4 days ago"
            }
        ]
    }
];
const mockUnansweredQueries = [
    {
        id: 'uq1',
        query: "Do you ship to Mars?",
        timestamp: "2 hours ago",
        status: 'pending'
    },
    {
        id: 'uq2',
        query: "Can I pay with cryptocurrency?",
        timestamp: "5 hours ago",
        status: 'pending'
    },
    {
        id: 'uq3',
        query: "What is the meaning of life?",
        timestamp: "1 day ago",
        status: 'resolved'
    },
    {
        id: 'uq4',
        query: "How do I reset my password if I forgot my email?",
        timestamp: "2 days ago",
        status: 'pending'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/data:14dfc0 [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"70780065eead8858964f97f44aaa44c48f608e84ba":"handleSignUp"},"src/app/actions.ts",""] */ __turbopack_context__.s({
    "handleSignUp": (()=>handleSignUp)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var handleSignUp = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("70780065eead8858964f97f44aaa44c48f608e84ba", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "handleSignUp"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcXVlcnkgfSBmcm9tIFwiQC9saWIvZGJcIjtcbmltcG9ydCB7IGhhc2hQYXNzd29yZCwgdmVyaWZ5UGFzc3dvcmQgfSBmcm9tIFwiQC9saWIvYXV0aFwiO1xuaW1wb3J0IHR5cGUgeyBBZ2VudCwgQWdlbnRSb2xlIH0gZnJvbSBcIkAvdHlwZXNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUxvZ2luKGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkX3VudXNlZDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIGFnZW50cyBXSEVSRSBlbWFpbCA9ICQxJywgW2VtYWlsLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgIGNvbnN0IGFnZW50OiBBZ2VudCB8IHVuZGVmaW5lZCA9IHJlc3VsdC5yb3dzWzBdO1xuXG4gICAgICBpZiAoYWdlbnQgJiYgYWdlbnQucGFzc3dvcmQpIHtcbiAgICAgICAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgdmVyaWZ5UGFzc3dvcmQocGFzc3dvcmRfdW51c2VkLCBhZ2VudC5wYXNzd29yZCk7XG4gICAgICAgIGlmIChpc1Bhc3N3b3JkVmFsaWQpIHtcbiAgICAgICAgICAvLyBPbWl0IHBhc3N3b3JkIGZyb20gdGhlIG9iamVjdCByZXR1cm5lZCB0byB0aGUgY2xpZW50XG4gICAgICAgICAgY29uc3QgeyBwYXNzd29yZCwgLi4uYWdlbnRXaXRob3V0UGFzc3dvcmQgfSA9IGFnZW50O1xuICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGFnZW50OiBhZ2VudFdpdGhvdXRQYXNzd29yZCB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogXCJJbnZhbGlkIGVtYWlsIG9yIHBhc3N3b3JkLlwiIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJMb2dpbiBlcnJvcjpcIiwgZXJyb3IpO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IFwiRGF0YWJhc2UgY29ubmVjdGlvbiBlcnJvci4gUGxlYXNlIGNoZWNrIHNlcnZlciBsb2dzIGFuZCBlbnN1cmUgdGhlIFBPU1RHUkVTX1VSTCBpcyBjb3JyZWN0bHkgY29uZmlndXJlZCBpbiB5b3VyIC5lbnYgZmlsZS5cIiB9O1xuICAgIH1cbiAgfTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUFnZW50KG5hbWU6IHN0cmluZywgZW1haWw6IHN0cmluZywgcGFzc3dvcmRfdW51c2VkOiBzdHJpbmcsIHJvbGU6IEFnZW50Um9sZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nQWdlbnRSZXN1bHQgPSBhd2FpdCBxdWVyeSgnU0VMRUNUICogRlJPTSBhZ2VudHMgV0hFUkUgZW1haWwgPSAkMScsIFtlbWFpbC50b0xvd2VyQ2FzZSgpXSk7XG4gICAgICAgIGlmIChleGlzdGluZ0FnZW50UmVzdWx0LnJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IFwiQW4gYWdlbnQgd2l0aCB0aGlzIGVtYWlsIGFscmVhZHkgZXhpc3RzLlwiIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNoZWRQYXNzd29yZCA9IGF3YWl0IGhhc2hQYXNzd29yZChwYXNzd29yZF91bnVzZWQpO1xuICAgICAgICBjb25zdCBhdmF0YXIgPSBgaHR0cHM6Ly9waWNzdW0ucGhvdG9zL3NlZWQvJHtuYW1lfS8xMDAvMTAwYDtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeShcbiAgICAgICAgICAgICdJTlNFUlQgSU5UTyBhZ2VudHMgKG5hbWUsIGVtYWlsLCBwYXNzd29yZCwgcm9sZSwgYXZhdGFyKSBWQUxVRVMgKCQxLCAkMiwgJDMsICQ0LCAkNSkgUkVUVVJOSU5HIConLFxuICAgICAgICAgICAgW25hbWUsIGVtYWlsLnRvTG93ZXJDYXNlKCksIGhhc2hlZFBhc3N3b3JkLCByb2xlLCBhdmF0YXJdXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG5ld0FnZW50OiBBZ2VudCB8IHVuZGVmaW5lZCA9IHJlc3VsdC5yb3dzWzBdO1xuXG4gICAgICAgIGlmIChuZXdBZ2VudCkge1xuICAgICAgICAgICAgY29uc3QgeyBwYXNzd29yZCwgLi4uYWdlbnRXaXRob3V0UGFzc3dvcmQgfSA9IG5ld0FnZW50O1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgYWdlbnQ6IGFnZW50V2l0aG91dFBhc3N3b3JkIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGNyZWF0ZSBhZ2VudC5cIiB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdGUgYWdlbnQgZXJyb3I6XCIsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IFwiQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyB0aGUgYWdlbnQuXCIgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVTaWduVXAobmFtZTogc3RyaW5nLCBlbWFpbDogc3RyaW5nLCBwYXNzd29yZF91bnVzZWQ6IHN0cmluZykge1xuICAgIHJldHVybiBjcmVhdGVBZ2VudChuYW1lLCBlbWFpbCwgcGFzc3dvcmRfdW51c2VkLCBcImFnZW50XCIpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ3UkFzRHNCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/data:57dfa1 [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"6049a27b16f34690f84c6af4f9a048cb3293c23e61":"handleLogin"},"src/app/actions.ts",""] */ __turbopack_context__.s({
    "handleLogin": (()=>handleLogin)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var handleLogin = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("6049a27b16f34690f84c6af4f9a048cb3293c23e61", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "handleLogin"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcXVlcnkgfSBmcm9tIFwiQC9saWIvZGJcIjtcbmltcG9ydCB7IGhhc2hQYXNzd29yZCwgdmVyaWZ5UGFzc3dvcmQgfSBmcm9tIFwiQC9saWIvYXV0aFwiO1xuaW1wb3J0IHR5cGUgeyBBZ2VudCwgQWdlbnRSb2xlIH0gZnJvbSBcIkAvdHlwZXNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUxvZ2luKGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkX3VudXNlZDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIGFnZW50cyBXSEVSRSBlbWFpbCA9ICQxJywgW2VtYWlsLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgIGNvbnN0IGFnZW50OiBBZ2VudCB8IHVuZGVmaW5lZCA9IHJlc3VsdC5yb3dzWzBdO1xuXG4gICAgICBpZiAoYWdlbnQgJiYgYWdlbnQucGFzc3dvcmQpIHtcbiAgICAgICAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgdmVyaWZ5UGFzc3dvcmQocGFzc3dvcmRfdW51c2VkLCBhZ2VudC5wYXNzd29yZCk7XG4gICAgICAgIGlmIChpc1Bhc3N3b3JkVmFsaWQpIHtcbiAgICAgICAgICAvLyBPbWl0IHBhc3N3b3JkIGZyb20gdGhlIG9iamVjdCByZXR1cm5lZCB0byB0aGUgY2xpZW50XG4gICAgICAgICAgY29uc3QgeyBwYXNzd29yZCwgLi4uYWdlbnRXaXRob3V0UGFzc3dvcmQgfSA9IGFnZW50O1xuICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGFnZW50OiBhZ2VudFdpdGhvdXRQYXNzd29yZCB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogXCJJbnZhbGlkIGVtYWlsIG9yIHBhc3N3b3JkLlwiIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJMb2dpbiBlcnJvcjpcIiwgZXJyb3IpO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IFwiRGF0YWJhc2UgY29ubmVjdGlvbiBlcnJvci4gUGxlYXNlIGNoZWNrIHNlcnZlciBsb2dzIGFuZCBlbnN1cmUgdGhlIFBPU1RHUkVTX1VSTCBpcyBjb3JyZWN0bHkgY29uZmlndXJlZCBpbiB5b3VyIC5lbnYgZmlsZS5cIiB9O1xuICAgIH1cbiAgfTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUFnZW50KG5hbWU6IHN0cmluZywgZW1haWw6IHN0cmluZywgcGFzc3dvcmRfdW51c2VkOiBzdHJpbmcsIHJvbGU6IEFnZW50Um9sZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nQWdlbnRSZXN1bHQgPSBhd2FpdCBxdWVyeSgnU0VMRUNUICogRlJPTSBhZ2VudHMgV0hFUkUgZW1haWwgPSAkMScsIFtlbWFpbC50b0xvd2VyQ2FzZSgpXSk7XG4gICAgICAgIGlmIChleGlzdGluZ0FnZW50UmVzdWx0LnJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IFwiQW4gYWdlbnQgd2l0aCB0aGlzIGVtYWlsIGFscmVhZHkgZXhpc3RzLlwiIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYXNoZWRQYXNzd29yZCA9IGF3YWl0IGhhc2hQYXNzd29yZChwYXNzd29yZF91bnVzZWQpO1xuICAgICAgICBjb25zdCBhdmF0YXIgPSBgaHR0cHM6Ly9waWNzdW0ucGhvdG9zL3NlZWQvJHtuYW1lfS8xMDAvMTAwYDtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBxdWVyeShcbiAgICAgICAgICAgICdJTlNFUlQgSU5UTyBhZ2VudHMgKG5hbWUsIGVtYWlsLCBwYXNzd29yZCwgcm9sZSwgYXZhdGFyKSBWQUxVRVMgKCQxLCAkMiwgJDMsICQ0LCAkNSkgUkVUVVJOSU5HIConLFxuICAgICAgICAgICAgW25hbWUsIGVtYWlsLnRvTG93ZXJDYXNlKCksIGhhc2hlZFBhc3N3b3JkLCByb2xlLCBhdmF0YXJdXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG5ld0FnZW50OiBBZ2VudCB8IHVuZGVmaW5lZCA9IHJlc3VsdC5yb3dzWzBdO1xuXG4gICAgICAgIGlmIChuZXdBZ2VudCkge1xuICAgICAgICAgICAgY29uc3QgeyBwYXNzd29yZCwgLi4uYWdlbnRXaXRob3V0UGFzc3dvcmQgfSA9IG5ld0FnZW50O1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgYWdlbnQ6IGFnZW50V2l0aG91dFBhc3N3b3JkIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGNyZWF0ZSBhZ2VudC5cIiB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdGUgYWdlbnQgZXJyb3I6XCIsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IFwiQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZCB3aGlsZSBjcmVhdGluZyB0aGUgYWdlbnQuXCIgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVTaWduVXAobmFtZTogc3RyaW5nLCBlbWFpbDogc3RyaW5nLCBwYXNzd29yZF91bnVzZWQ6IHN0cmluZykge1xuICAgIHJldHVybiBjcmVhdGVBZ2VudChuYW1lLCBlbWFpbCwgcGFzc3dvcmRfdW51c2VkLCBcImFnZW50XCIpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ1UkFPc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$chat$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/chat-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$vertical$2d$nav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/vertical-nav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$contacts$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/contacts-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$agents$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/agents-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$dashboard$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/dashboard-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$announcements$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/announcements-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$settings$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/settings-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$campaigns$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/campaigns-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$my$2d$performance$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/my-performance-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$auth$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/auth-form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$3a$57dfa1__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/data:57dfa1 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
function Home({ params, searchParams }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(searchParams);
    const [activeView, setActiveView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Chat");
    const [isNavOpen, setIsNavOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSettingsOpen, setIsSettingsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const onLogin = async (email, password_unused)=>{
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$3a$57dfa1__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["handleLogin"])(email, password_unused);
        if (result.success && result.agent) {
            const agent = result.agent;
            setCurrentUser({
                name: agent.name,
                avatar: agent.avatar,
                role: agent.role,
                email: agent.email,
                phone: agent.phone
            });
            if (agent.role === 'admin') {
                setActiveView('Dashboard');
            } else {
                setActiveView('Chat');
            }
        }
        return {
            success: result.success,
            message: result.message
        };
    };
    const handleLogout = ()=>{
        setCurrentUser(null);
        setActiveView('Chat');
    };
    const renderView = ()=>{
        const props = {
            onMenuClick: ()=>setIsNavOpen(true),
            user: currentUser
        };
        switch(activeView){
            case "Chat":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$chat$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatLayout"], {
                    user: currentUser,
                    onMenuClick: ()=>setIsNavOpen(true)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 61,
                    columnNumber: 16
                }, this);
            case "Contacts":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$contacts$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContactsView"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 63,
                    columnNumber: 16
                }, this);
            case "Agents":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$agents$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AgentsView"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 65,
                    columnNumber: 16
                }, this);
            case "Dashboard":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$dashboard$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardView"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 67,
                    columnNumber: 16
                }, this);
            case "Announcements":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$announcements$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnnouncementsView"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 69,
                    columnNumber: 16
                }, this);
            case "My Performance":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$my$2d$performance$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MyPerformanceView"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 71,
                    columnNumber: 16
                }, this);
            case "Campaigns":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$campaigns$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CampaignsView"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 73,
                    columnNumber: 17
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$chat$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatLayout"], {
                    user: currentUser,
                    onMenuClick: ()=>setIsNavOpen(true)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 75,
                    columnNumber: 16
                }, this);
        }
    };
    if (!currentUser) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "flex h-screen w-full items-center justify-center bg-background p-4 overflow-hidden auth-page-background",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$auth$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthForm"], {
                onLogin: onLogin
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$settings$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsDialog"], {
                open: isSettingsOpen,
                onOpenChange: setIsSettingsOpen,
                user: currentUser
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$vertical$2d$nav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VerticalNav"], {
                activeView: activeView,
                setActiveView: setActiveView,
                user: currentUser,
                onLogout: handleLogout,
                isOpen: isNavOpen,
                setIsOpen: setIsNavOpen,
                onSettingsClick: ()=>setIsSettingsOpen(true)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 md:pl-[70px] min-w-0",
                children: renderView()
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(Home, "byu3A2zRqEsvvVlisbcIetuC49c=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_616214f4._.js.map