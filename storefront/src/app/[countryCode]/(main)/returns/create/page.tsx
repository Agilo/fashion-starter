import { Metadata } from "next"
import { GuestReturnCreateForm } from "@modules/returns/templates/GuestReturnCreateForm"

export const metadata: Metadata = {
  title: "Create Return",
  description: "Start a return for your order without logging in",
}

export default async function GuestReturnsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  return <GuestReturnCreateForm countryCode={countryCode} />
}
