"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Send,
  Calendar,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";

type Post = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  mainImage: any;
  excerpt: string;
};

type FooterProps = {
  recentPosts?: Post[];
};

export default function Footer({ recentPosts = [] }: FooterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const quickLinks = [
    { label: "Beranda", href: "/" },
    { label: "Berita", href: "/blog" },
    { label: "Kontak", href: "/contact" },
    { label: "Tentang Kami", href: "/about" },
  ];

  return (
    <footer className="relative border-t border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand & Description */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                JASA SADAP WA
              </h3>
            </div>

            <p className="text-[var(--foreground)]/70 text-sm leading-relaxed">
              Membantu Anda mengakses WhatsApp target dengan layanan sadap
              terpercaya dan aman. Solusi mudah untuk kebutuhan pengawasan Anda.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-[var(--foreground)]">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[var(--foreground)]/70 hover:text-cyan-500 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Recent Posts */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-[var(--foreground)]">
              Recent Posts
            </h4>
            <div className="space-y-4">
              {recentPosts.slice(0, 3).map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group block"
                >
                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-cyan-500 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-[var(--foreground)]/60">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}

              {recentPosts.length === 0 && (
                <p className="text-sm text-[var(--foreground)]/60">
                  Belum ada postingan terbaru.
                </p>
              )}
            </div>
          </div>

          {/* Column 4: Search & Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-[var(--foreground)]">
              Cari Berita
            </h4>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)]/40" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10 focus:border-cyan-400/50 focus:outline-none text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 text-sm transition-all duration-300"
                />
              </div>
            </form>

            {/* Contact Button */}
            <div className="pt-4">
              <Link href="/contact" className="block">
                <button className="w-full px-4 py-3 bg-white/30 dark:bg-white/10 backdrop-blur-md text-[var(--foreground)] font-semibold rounded-xl border border-white/20 dark:border-white/10 hover:border-cyan-400/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm">
                  <Send className="w-4 h-4" />
                  Hubungi Kami
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}