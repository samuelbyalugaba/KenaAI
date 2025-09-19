
"use client"

import { useTheme as useNextTheme } from "next-themes"

// This custom hook is now a simple re-export of the hook from next-themes.
// This maintains the existing `useTheme` import paths throughout the app
// while using the more robust library.
export const useTheme = useNextTheme
