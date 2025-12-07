import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sanityClient } from "@/lib/sanityClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jasa sadap WA",
  description: "Layanan sadap WhatsApp profesional, cepat, dan rahasia untuk kebutuhan pengawasan Anda.",
};

// Fetch recent posts untuk footer
async function getRecentPosts() {
  try {
    const query = `
      *[_type == "post" && status == "published"] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        publishedAt,
        mainImage,
        excerpt
      }
    `;
    const posts = await sanityClient.fetch(query);
    return posts || [];
  } catch (error) {
    console.error("Error fetching recent posts for footer:", error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const recentPosts = await getRecentPosts();

  return (
    <html className="scroll-smooth" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes blob {
              0%, 100% {
                transform: translate(0px, 0px) scale(1);
              }
              33% {
                transform: translate(30px, -50px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
            }
            
            .animate-blob {
              animation: blob 8s infinite;
            }
            
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            
            .animation-delay-4000 {
              animation-delay: 4s;
            }

            @keyframes spin-slow {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

            .animate-spin-slow {
              animation: spin-slow 10s linear infinite;
            }

            @keyframes bounce-slow {
              0%, 100% {
                transform: translateY(-5%);
                animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
              }
              50% {
                transform: translateY(0);
                animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
              }
            }

            .animate-bounce-slow {
              animation: bounce-slow 2s infinite;
            }
          `,
          }}
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              {/* Gradient Orbs */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 dark:from-cyan-600/5 dark:to-blue-700/5 rounded-full blur-3xl animate-blob" />
              <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 dark:from-purple-600/5 dark:to-pink-700/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 dark:from-emerald-600/5 dark:to-teal-700/5 rounded-full blur-3xl animate-blob animation-delay-4000" />

              {/* Grid Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.02]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, currentColor 1px, transparent 1px),
                    linear-gradient(to bottom, currentColor 1px, transparent 1px)
                  `,
                  backgroundSize: "80px 80px",
                }}
              />
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />

              {/* Main Content Area */}
              <main className="flex-grow">{children}</main>

              {/* Footer with Recent Posts */}
              <Footer recentPosts={recentPosts} />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}