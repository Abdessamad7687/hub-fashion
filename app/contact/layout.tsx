import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | StyleHub",
  description: "Get in touch with StyleHub. Send us a message and we'll respond as soon as possible. Contact us for support, inquiries, or feedback.",
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
