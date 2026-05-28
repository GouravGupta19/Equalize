import "./globals.css";
import Header from "@/components/header";
import ConvexClientProvider from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Equalize",
  description: "The smartest way to split expenses with your friends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ConvexClientProvider>
            <Header />
            <main className="min-h-screen pt-16">{children}</main>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
