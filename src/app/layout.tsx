import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "BiruCyber Security Portal - Cybersecurity Training Platform",
  description: "Interactive cybersecurity training platform for learning SQL Injection, XSS, and Access Control vulnerabilities.",
  keywords: ["Cybersecurity", "SQL Injection", "XSS", "Access Control", "Security Training", "Ethical Hacking"],
  authors: [{ name: "BiruCyber Team" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "BiruCyber Security Portal",
    description: "Interactive cybersecurity training platform",
    url: "/",
    siteName: "BiruCyber",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BiruCyber Security Portal",
    description: "Interactive cybersecurity training platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            if (typeof window !== 'undefined') {
              const style = document.createElement('style');
              style.innerHTML = \`
                [data-sonner-toaster],
                [data-sonner-toast],
                [data-radix-toast-viewport],
                [data-radix-toast-root],
                [data-radix-portal],
                [role="status"],
                [role="alert"],
                [role="region"],
                .toaster,
                .toast,
                ol[data-sonner-toaster],
                li[data-sonner-toast],
                div[style*="position: fixed"][style*="z-index"] {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  pointer-events: none !important;
                  position: absolute !important;
                  left: -99999px !important;
                  width: 0 !important;
                  height: 0 !important;
                  overflow: hidden !important;
                }
              \`;
              document.head.appendChild(style);
              
              setInterval(function() {
                var selectors = ['[data-sonner-toaster]', '[data-sonner-toast]', '[data-radix-toast-viewport]', '[data-radix-portal]', 'ol[data-sonner-toaster]', 'li[data-sonner-toast]'];
                selectors.forEach(function(sel) {
                  var els = document.querySelectorAll(sel);
                  els.forEach(function(el) { 
                    if (el && el.parentNode) el.parentNode.removeChild(el); 
                  });
                });
              }, 50);
            }
          })();
        `}} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#000000', color: '#00ff00', margin: 0, padding: 0 }}
      >
        {children}
      </body>
    </html>
  );
}
