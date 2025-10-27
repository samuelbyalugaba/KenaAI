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
"[project]/src/ai/flows/data:e545fe [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"4014430748ef3b36b27095eb31bdef60ea95f7dfca":"generateCampaignMessage"},"src/ai/flows/generate-campaign-message.ts",""] */ __turbopack_context__.s({
    "generateCampaignMessage": (()=>generateCampaignMessage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var generateCampaignMessage = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4014430748ef3b36b27095eb31bdef60ea95f7dfca", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "generateCampaignMessage"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZ2VuZXJhdGUtY2FtcGFpZ24tbWVzc2FnZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbi8qKlxuICogQGZpbGVPdmVydmlldyBBIEdlbmtpdCBmbG93IGZvciBnZW5lcmF0aW5nIG1hcmtldGluZyBjYW1wYWlnbiBtZXNzYWdlcy5cbiAqXG4gKiAtIGdlbmVyYXRlQ2FtcGFpZ25NZXNzYWdlIC0gQSBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyBhIGNhbXBhaWduIG1lc3NhZ2UgYmFzZWQgb24gYSB0aXRsZS5cbiAqIC0gR2VuZXJhdGVDYW1wYWlnbk1lc3NhZ2VJbnB1dCAtIFRoZSBpbnB1dCB0eXBlIGZvciB0aGUgZ2VuZXJhdGVDYW1wYWlnbk1lc3NhZ2UgZnVuY3Rpb24uXG4gKiAtIEdlbmVyYXRlQ2FtcGFpZ25NZXNzYWdlT3V0cHV0IC0gVGhlIHJldHVybiB0eXBlIGZvciB0aGUgZ2VuZXJhdGVDYW1wYWlnbk1lc3NhZ2UgZnVuY3Rpb24uXG4gKi9cblxuaW1wb3J0IHthaX0gZnJvbSAnQC9haS9nZW5raXQnO1xuaW1wb3J0IHt6fSBmcm9tICdnZW5raXQnO1xuXG5jb25zdCBHZW5lcmF0ZUNhbXBhaWduTWVzc2FnZUlucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBjYW1wYWlnblRpdGxlOiB6LnN0cmluZygpLmRlc2NyaWJlKCdUaGUgdGl0bGUgb2YgdGhlIG1hcmtldGluZyBjYW1wYWlnbi4nKSxcbn0pO1xuZXhwb3J0IHR5cGUgR2VuZXJhdGVDYW1wYWlnbk1lc3NhZ2VJbnB1dCA9IHouaW5mZXI8dHlwZW9mIEdlbmVyYXRlQ2FtcGFpZ25NZXNzYWdlSW5wdXRTY2hlbWE+O1xuXG5jb25zdCBHZW5lcmF0ZUNhbXBhaWduTWVzc2FnZU91dHB1dFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgbWVzc2FnZTogelxuICAgIC5zdHJpbmcoKVxuICAgIC5kZXNjcmliZSgnVGhlIGdlbmVyYXRlZCBtYXJrZXRpbmcgbWVzc2FnZSBmb3IgdGhlIGNhbXBhaWduLicpLFxufSk7XG5leHBvcnQgdHlwZSBHZW5lcmF0ZUNhbXBhaWduTWVzc2FnZU91dHB1dCA9IHouaW5mZXI8dHlwZW9mIEdlbmVyYXRlQ2FtcGFpZ25NZXNzYWdlT3V0cHV0U2NoZW1hPjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlQ2FtcGFpZ25NZXNzYWdlKGlucHV0OiBHZW5lcmF0ZUNhbXBhaWduTWVzc2FnZUlucHV0KTogUHJvbWlzZTxHZW5lcmF0ZUNhbXBhaWduTWVzc2FnZU91dHB1dD4ge1xuICByZXR1cm4gZ2VuZXJhdGVDYW1wYWlnbk1lc3NhZ2VGbG93KGlucHV0KTtcbn1cblxuY29uc3QgcHJvbXB0ID0gYWkuZGVmaW5lUHJvbXB0KHtcbiAgbmFtZTogJ2dlbmVyYXRlQ2FtcGFpZ25NZXNzYWdlUHJvbXB0JyxcbiAgaW5wdXQ6IHtzY2hlbWE6IEdlbmVyYXRlQ2FtcGFpZ25NZXNzYWdlSW5wdXRTY2hlbWF9LFxuICBvdXRwdXQ6IHtzY2hlbWE6IEdlbmVyYXRlQ2FtcGFpZ25NZXNzYWdlT3V0cHV0U2NoZW1hfSxcbiAgcHJvbXB0OiBgWW91IGFyZSBhIG1hcmtldGluZyBleHBlcnQuIFdyaXRlIGEgY29uY2lzZSBhbmQgY29tcGVsbGluZyBtZXNzYWdlIGZvciBhIG1hcmtldGluZyBjYW1wYWlnbiB3aXRoIHRoZSBmb2xsb3dpbmcgdGl0bGU6XG5cInt7e2NhbXBhaWduVGl0bGV9fX1cIlxuXG5LZWVwIHRoZSBtZXNzYWdlIHVuZGVyIDE2MCBjaGFyYWN0ZXJzLiBJbmNsdWRlIGEgY2xlYXIgY2FsbCB0byBhY3Rpb24uXG5gLFxufSk7XG5cbmNvbnN0IGdlbmVyYXRlQ2FtcGFpZ25NZXNzYWdlRmxvdyA9IGFpLmRlZmluZUZsb3coXG4gIHtcbiAgICBuYW1lOiAnZ2VuZXJhdGVDYW1wYWlnbk1lc3NhZ2VGbG93JyxcbiAgICBpbnB1dFNjaGVtYTogR2VuZXJhdGVDYW1wYWlnbk1lc3NhZ2VJbnB1dFNjaGVtYSxcbiAgICBvdXRwdXRTY2hlbWE6IEdlbmVyYXRlQ2FtcGFpZ25NZXNzYWdlT3V0cHV0U2NoZW1hLFxuICB9LFxuICBhc3luYyBpbnB1dCA9PiB7XG4gICAgY29uc3Qge291dHB1dH0gPSBhd2FpdCBwcm9tcHQoaW5wdXQpO1xuICAgIHJldHVybiBvdXRwdXQhO1xuICB9XG4pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIwVEF5QnNCIn0=
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
const useTheme = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_daafa018._.js.map