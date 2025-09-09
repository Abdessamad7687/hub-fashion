import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import ClientWrapper from "@/components/client-wrapper";
import ConditionalLayout from "@/components/conditional-layout";

export const metadata = {
  title: "StyleHub - Modern Fashion Store",
  description: "Discover the latest fashion trends for men, women, and kids. Shop premium clothing and accessories online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
        <ClientWrapper>
          <Toaster />
        </ClientWrapper>
      </body>
    </html>
  );
}
