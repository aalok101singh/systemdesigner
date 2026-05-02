import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { Geist, Geist_Mono } from "next/font/google";

import { AFTER_AUTH_URL, SIGN_IN_URL, SIGN_UP_URL } from "@/lib/auth-routes";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "Real-time collaborative system design workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ClerkProvider
          signInUrl={SIGN_IN_URL}
          signUpUrl={SIGN_UP_URL}
          signInFallbackRedirectUrl={AFTER_AUTH_URL}
          signUpFallbackRedirectUrl={AFTER_AUTH_URL}
          appearance={{
            theme: dark,
            options: {
              logoPlacement: "none",
              socialButtonsPlacement: "top",
              socialButtonsVariant: "blockButton",
            },
            variables: {
              colorBackground: "var(--bg-surface)",
              colorBorder: "var(--border-default)",
              colorForeground: "var(--text-primary)",
              colorInput: "var(--bg-subtle)",
              colorInputForeground: "var(--text-primary)",
              colorMuted: "var(--bg-subtle)",
              colorMutedForeground: "var(--text-secondary)",
              colorPrimary: "var(--accent-primary)",
              colorPrimaryForeground: "var(--bg-base)",
              colorRing: "var(--accent-primary)",
              colorShadow: "var(--bg-base)",
              colorDanger: "var(--state-error)",
              colorSuccess: "var(--state-success)",
              colorWarning: "var(--state-warning)",
              borderRadius: "var(--radius)",
              fontFamily: "var(--font-geist-sans)",
            },
            elements: {
              rootBox: "w-full",
              cardBox:
                "w-full rounded-3xl border border-surface-border bg-surface text-copy-primary shadow-none",
              card: "gap-5 bg-surface px-7 py-7 sm:px-8 sm:py-8",
              header: "gap-1.5 text-center",
              formButtonPrimary:
                "h-11 rounded-xl bg-brand text-sm font-semibold hover:bg-brand/90 focus-visible:ring-brand",
              formFieldInput:
                "h-10 rounded-xl border-surface-border bg-subtle text-copy-primary placeholder:text-copy-faint focus-visible:ring-brand",
              formFieldLabel: "text-copy-secondary",
              dividerLine: "bg-surface-border",
              dividerText: "text-copy-muted",
              footer: "bg-elevated/40",
              footerActionLink:
                "font-medium text-brand hover:text-brand",
              footerActionText: "text-copy-secondary",
              headerTitle: "text-copy-primary",
              headerSubtitle: "text-copy-secondary",
              socialButtonsBlockButton:
                "h-10 rounded-xl border-surface-border bg-subtle text-copy-primary hover:bg-elevated",
              socialButtonsBlockButtonText: "font-medium",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
