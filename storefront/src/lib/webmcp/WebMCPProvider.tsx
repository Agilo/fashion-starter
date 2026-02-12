"use client"

import React from "react"
import { isWebMCPSupported } from "./is-supported"

export const WebMCPProvider = () => {
  React.useEffect(() => {
    console.log("Is WebMCP supported:", isWebMCPSupported())
  }, [])

  return null
}
