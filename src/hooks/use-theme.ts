
"use client"

import { useContext } from "react"
import {
  ThemeContext,
  type ThemeContextType,
} from "@/components/ui/theme-provider"

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
