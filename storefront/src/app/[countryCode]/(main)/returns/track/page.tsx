import { Metadata } from "next"
import { GuestReturnTrackForm } from "@modules/returns/templates/GuestReturnTrackForm"

export const metadata: Metadata = {
  title: "Track Your Return",
  description: "Track the status of your return request",
}

export default function GuestReturnTrackingPage() {
  return <GuestReturnTrackForm />
}
