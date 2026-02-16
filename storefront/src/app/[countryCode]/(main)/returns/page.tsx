import { Metadata } from "next"
import { GuestReturnSearchTemplate } from "@modules/returns/templates/GuestReturnSearchTemplate"

export const metadata: Metadata = {
  title: "Create Return",
  description: "Start a return for your order without logging in",
}

export default function GuestReturnsPage() {
  return <GuestReturnSearchTemplate />
}
