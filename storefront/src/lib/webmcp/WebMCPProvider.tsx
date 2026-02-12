"use client"

import React from "react"
import { registerWebMCPTools } from "./register-tools"
import { productsSearch } from "./tools/products-search"

export const WebMCPProvider = () => {
  React.useEffect(() => {
    async function search() {
      console.log(await productsSearch({ query: "Nordic" }))
    }

    search()

    registerWebMCPTools()
  }, [])

  return null
}
