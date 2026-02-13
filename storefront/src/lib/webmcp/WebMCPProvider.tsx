"use client"

import React from "react"
import { registerWebMCPTools } from "./register-tools"
import { productsSearch } from "./tools/products-search"
import { productSearchDummyInput } from "./dummyInputs"

export const WebMCPProvider = () => {
  React.useEffect(() => {
    async function search() {
      console.log(await productsSearch(productSearchDummyInput))
    }

    search()

    registerWebMCPTools()
  }, [])

  return null
}
