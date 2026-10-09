import { Metadata } from "next"
import { NotFoundContent } from "@/components/NotFoundContent"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <NotFoundContent />
      <Footer />
    </>
  )
}
