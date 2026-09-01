"use client"

import React from "react"
import { registerWebMCPTools } from "./register-tools"
import { useRouter } from "next/navigation"

export const WebMCPProvider = () => {
  const router = useRouter()

  React.useEffect(() => {
    let cleanup: (() => void) | undefined
    registerWebMCPTools(router).then((fn) => {
      cleanup = fn
    })
    return () => cleanup?.()
  }, [router])

  return null
}
