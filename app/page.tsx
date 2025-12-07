// app/page.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; 
import imageUrlBuilder from '@sanity/image-url'; 

// Import Lucide Icons
import {
  Newspaper,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  Shield,
  Zap,
  User,
  BookOpen,
} from "lucide-react";

// Import Sanity Client and Fetcher
// PASTIKAN LOKASI IMPORT INI BENAR SESUAI STRUKTUR PROYEK ANDA
import { sanityClient } from "@/lib/sanityClient"; 
import { sanityFetch } from "@/lib/sanityFetch"; 
import { urlFor } from "@/lib/imageUrl";

// --- TIPE DATA SANITY ---
interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  mainImage: any;
  categoryTitle: string; 
  authorName: string;    
}

// --- FUNGSI FETCH DATA SANITY ---
const GET_LATEST_POSTS_QUERY = `
  *[_type == "post" && status == "published"] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "categoryTitle": category->title, 
    "authorName": author->name 
  }
`;

async function getLatestPosts(): Promise<Post[]> {
  try {
    const posts = await sanityFetch<Post[]>({
      query: GET_LATEST_POSTS_QUERY,
      tags: ['post'], 
    });
    return posts;
  } catch (error) {
    console.error("Gagal mengambil post dari Sanity:", error);
    return [];
  }
}

// --- DATA FITUR ---

const features = [
  {
    id: 1,
    icon: Clock,
    title: "Real-time Update",
    description: "Akses data pesan dan log panggilan secara instan.",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/20",
  },
  {
    id: 2,
    icon: Shield,
    title: "Anonimitas Terjamin",
    description: "Keamanan dan kerahasiaan identitas klien adalah prioritas.",
    color: "from-blue-500 to-purple-500",
    bgColor: "bg-blue-500/20",
  },
  {
    id: 3,
    icon: Users,
    title: "Dukungan 24/7",
    description: "Layanan support teknis dan panduan lengkap kapan pun.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/20",
  },
  {
    id: 4,
    icon: Zap,
    title: "Proses Cepat",
    description: "Pengerjaan layanan sadap dilakukan dengan cepat dan efisien.",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/20",
  },
];


export default async function HomePage() {
  const latestPosts = await getLatestPosts();

  return (
    <div className="relative">
      {/* HERO SECTION */}
      <section className="relative px-6 md:px-10 py-24 md:py-32 overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
            <div className="flex justify-center py-8">
              <Image
                src="/images/logo.jpg"
                alt="Logo Jasa Sadap WA"
                width={250} 
                height={250} 
                className="rounded-full object-cover border-4 border-white/50 dark:border-zinc-800 shadow-2xl transition-all duration-500 hover:scale-110"
                priority 
              />
            </div>
            {/* AKHIR GAMBAR LOGO */}

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-[var(--foreground)] tracking-tight">
                Dapatkan Akses
                <br />
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Penuh & Real-time
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-[var(--foreground)]/70 leading-relaxed max-w-3xl mx-auto">
                Layanan profesional untuk memantau pesan WhatsApp, riwayat panggilan,
                dan media dengan aman dan anonim.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="group">
                <button className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <span className="relative flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Konsultasi Gratis Sekarang
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </Link>

              <Link href="/about" className="group">
                <button className="px-8 py-4 bg-white/30 dark:bg-white/5 backdrop-blur-xl text-[var(--foreground)] font-semibold rounded-full border border-white/20 dark:border-white/10 hover:border-cyan-400/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Tentang Layanan Kami
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-6 md:px-10 py-32 container mx-auto max-w-7xl">
        <div className="space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)]">
              Mengapa Kami Pilihan Terbaik?
            </h2>
            <div className="flex justify-center">
              <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
            </div>
            <p className="text-lg md:text-xl text-[var(--foreground)]/70 max-w-3xl mx-auto">
              Kami memberikan layanan yang cepat, aman, dan terpercaya.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="group relative p-8 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 hover:border-cyan-400/50 dark:hover:border-cyan-400/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  {/* Background Gradient on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  <div className="relative z-10 space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                      <div
                        className={`w-20 h-20 ${feature.bgColor} backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}
                      >
                        <Icon className="w-10 h-10 text-cyan-600 dark:text-cyan-400" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-3">
                      <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-[var(--foreground)]/70 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BERITA & ARTIKEL TERKINI SECTION */}
      {latestPosts.length > 0 && (
        <section className="px-6 md:px-10 py-32 container mx-auto max-w-7xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border-t border-white/20 dark:border-white/10">
          <div className="space-y-16">
            {/* Section Header */}
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)]">
                Berita & Informasi Terkini
              </h2>
              <div className="flex justify-center">
                <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
              </div>
              <p className="text-lg md:text-xl text-[var(--foreground)]/70 max-w-3xl mx-auto">
                Dapatkan artikel terbaru seputar keamanan digital dan layanan kami.
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group block rounded-3xl overflow-hidden bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={urlFor(post.mainImage).width(500).height(300).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {post.categoryTitle && (
                      <span className="absolute top-4 right-4 text-xs font-semibold text-white bg-purple-500 px-3 py-1 rounded-full">
                        {post.categoryTitle}
                      </span>
                    )}
                  </div>
                  <div className="p-6 space-y-3">
                    <p className="text-sm text-[var(--foreground)]/60 flex items-center gap-2">
                      <BookOpen size={14} className="text-cyan-500" />
                      {format(new Date(post.publishedAt), 'd MMMM yyyy', { locale: id })}
                      <span className="text-xs ml-2">by {post.authorName}</span>
                    </p>
                    <h3 className="text-xl font-bold text-[var(--foreground]] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[var(--foreground)]/70 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 group-hover:gap-3 transition-all">
                      Baca Selengkapnya <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Tombol Lihat Semua */}
            <div className="text-center pt-8">
              <Link href="/blog" className="group">
                <button className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <span className="relative flex items-center gap-2">
                    <Newspaper className="w-5 h-5" />
                    Lihat Semua Artikel
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}


      {/* CTA SECTION */}
      <section className="px-6 md:px-10 py-32 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border-y border-white/20 dark:border-white/10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8 p-12 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-xl">
              <Sparkles className="w-10 h-10 text-white" strokeWidth={2} />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)]">
              Siap untuk Memulai Layanan Sadap?
            </h2>

            <p className="text-lg md:text-xl text-[var(--foreground)]/70 max-w-2xl mx-auto">
              Hubungi kami sekarang untuk konsultasi gratis dan rahasia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/contact" className="group">
                <button className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <span className="relative flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Hubungi Kami Sekarang
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

}
