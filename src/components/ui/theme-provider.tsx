
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes/dist/types"

import { useTheme as useNextTheme } from "next-themes"

export type Theme = "dark" | "light" | "system"

export type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Re-export useTheme from next-themes
export const useTheme = useNextTheme

export function ThemeProvider({ children, ...props }: NextThemesProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
