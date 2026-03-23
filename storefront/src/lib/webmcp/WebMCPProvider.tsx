"use client"

import React from "react"
import { registerWebMCPTools } from "./register-tools"
import { useRouter } from "next/navigation"

export const WebMCPProvider = () => {
  const router = useRouter()

  React.useEffect(() => {
    registerWebMCPTools(router)
  }, [router])

  return null
}
