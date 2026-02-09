import { GuestReturnsTemplate } from "@modules/returns/templates/GuestReturnsTemplate"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Return",
  description: "Start a return for your order without logging in",
}

export default function GuestReturnsPage() {
  return <GuestReturnsTemplate />
}
