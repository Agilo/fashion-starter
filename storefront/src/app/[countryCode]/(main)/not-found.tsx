import { Metadata } from "next"

import { NotFoundContent } from "@/components/NotFoundContent"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return <NotFoundContent />
}
