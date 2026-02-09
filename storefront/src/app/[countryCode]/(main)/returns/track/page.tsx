import { GuestReturnTrackingTemplate } from "@modules/returns/templates/GuestReturnTrackingTemplate"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Track Your Return",
  description: "Track the status of your return request",
}

export default function GuestReturnTrackingPage() {
  return <GuestReturnTrackingTemplate />
}
