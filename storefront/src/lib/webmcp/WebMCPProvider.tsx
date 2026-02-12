"use client"

import React from "react"
import { registerWebMCPTools } from "./register-tools"

export const WebMCPProvider = () => {
  React.useEffect(() => {
    registerWebMCPTools()
  }, [])

  return null
}
