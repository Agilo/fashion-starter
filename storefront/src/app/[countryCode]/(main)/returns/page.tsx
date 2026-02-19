import { Metadata } from "next"
import { GuestReturnCreateForm } from "@modules/returns/templates/GuestReturnCreateForm"

export const metadata: Metadata = {
  title: "Create Return",
  description: "Start a return for your order without logging in",
}

export default function GuestReturnsPage() {
  return <GuestReturnCreateForm />
}
