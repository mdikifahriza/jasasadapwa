// components/BlogDetailClient.tsx
'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Calendar, User, ArrowLeft, Tag, Clock } from "lucide-react";
import { urlFor } from "@/lib/imageUrl"; // Pastikan path ini benar

// Import Tipe Data (atau didefinisikan ulang jika tidak ada types.ts terpusat)
// NOTE: Tipe Post harus sama persis dengan yang diekspor dari page.tsx
interface Author {
    _id: string;
    name: string;
    slug: { current: string };
    image?: any;
    bio?: any;
}
interface Category {
    _id: string;
    title: string;
    slug: { current: string };
    description?: string;
}
interface Post {
    _id: string;
    title: string;
    slug: { current: string };
    author: Author;
    category?: Category;
    publishedAt: string;
    mainImage: any;
    excerpt: string;
    body: any;
    status: string;
    estimatedReadingTime?: number;
}

// ====== PROPS CLIENT COMPONENT ======
interface BlogDetailClientProps {
    post: Post;
    relatedPosts: Post[];
    imageUrl: string;
    authorImageUrl: string;
}

// ====== FORMAT TANGGAL (Pindahkan logic ke server untuk konsistensi) ======
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Menggunakan ID-ID karena ini komponen klien, Intl.DateTimeFormat bekerja di sini
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

// ====== PORTABLE TEXT COMPONENTS (Didefinisikan di Client atau Server, selama tidak mengandung hook) ======
const portableTextComponents = {
    block: {
        h1: ({ children }: any) => <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-[var(--foreground)]">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-[var(--foreground)]">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-[var(--foreground)]">{children}</h3>,
        normal: ({ children }: any) => <p className="text-base md:text-lg leading-relaxed mb-6 text-[var(--foreground)]/80">{children}</p>,
    },
    list: {
        bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-2 mb-6 ml-4 text-[var(--foreground)]/80">{children}</ul>,
        number: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 mb-6 ml-4 text-[var(--foreground)]/80">{children}</ol>,
    },
    marks: {
        strong: ({ children }: any) => <strong className="font-bold text-[var(--foreground)]">{children}</strong>,
        em: ({ children }: any) => <em className="italic text-[var(--foreground)]">{children}</em>,
        link: ({ children, value }: any) => (
            <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline underline-offset-4 transition-colors duration-300">
                {children}
            </a>
        ),
    },
    types: {
        image: ({ value }: any) => {
            if (!value?.asset) return null;
            try {
                // urlFor digunakan di sisi klien
                const imageUrl = urlFor(value).width(1200).height(800).url();
                return (
                    <div className="my-8 rounded-2xl overflow-hidden shadow-xl">
                        <Image 
                            src={imageUrl} 
                            alt={value.caption || value.alt || "Article image"} 
                            width={1200} 
                            height={800} 
                            className="w-full h-auto" 
                        />
                        {value.caption && <p className="text-sm text-center mt-3 text-[var(--foreground)]/60 italic">{value.caption}</p>}
                    </div>
                );
            } catch (error) {
                console.error("Error rendering image:", error);
                return null;
            }
        },
    },
};


// ==================================================
// ====== KOMPONEN TAMPILAN DETAIL BERITA (CLIENT) ======
// ==================================================

export default function BlogDetailClient({ post, relatedPosts, imageUrl, authorImageUrl }: BlogDetailClientProps) {
    // Semua JSX rendering dipindahkan ke sini
    return (
        <div className="relative">
            <div className="px-6 md:px-10 py-20 md:py-32 container mx-auto max-w-5xl">
                {/* Tombol kembali tidak memerlukan state, tapi bisa di client */}
                <Link 
                    href="/blog" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/10 hover:border-cyan-400/50 text-[var(--foreground)] transition-all duration-300 shadow-lg mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="font-semibold">Kembali ke Berita</span>
                </Link>

                <div className="bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-xl p-8 md:p-12 space-y-12">
                    <header className="space-y-8">
                        {post.category && (
                            <div className="flex justify-center">
                                <Link 
                                    href={`/blog?category=${post.category._id}`} 
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-full text-sm font-semibold hover:bg-cyan-500/30 transition-all duration-300"
                                >
                                    <Tag className="w-4 h-4" />
                                    {post.category.title}
                                </Link>
                            </div>
                        )}

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[var(--foreground)] leading-tight">{post.title}</h1>
                        <p className="text-xl md:text-2xl text-center text-[var(--foreground)]/70 leading-relaxed max-w-3xl mx-auto">{post.excerpt}</p>

                        {/* Meta Data */}
                        <div className="flex flex-wrap justify-center items-center gap-6 text-[var(--foreground)]/60">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span className="font-medium">{formatDate(post.publishedAt)}</span>
                            </div>
                            {post.author && (
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">{post.author.name}</span>
                                </div>
                            )}
                            {post.estimatedReadingTime && post.estimatedReadingTime > 0 && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span className="font-medium">{post.estimatedReadingTime} menit baca</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
                        </div>
                    </header>

                    {/* Main Image */}
                    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-2xl">
                        <Image 
                            src={imageUrl} 
                            alt={post.title} 
                            fill 
                            className="object-cover" 
                            priority 
                        />
                    </div>

                    {/* Content (PortableText) */}
                    <div className="prose prose-lg max-w-none">
                        {post.body && Array.isArray(post.body) && post.body.length > 0 ? (
                            <PortableText 
                                value={post.body} 
                                components={portableTextComponents} 
                            />
                        ) : (
                            <p className="text-[var(--foreground)]/60">Konten belum tersedia.</p>
                        )}
                    </div>
                </div>

                {/* Bagian Berita Terkait (Opsional, bisa jadi Server Component terpisah) */}
                {relatedPosts.length > 0 && (
                    <section className="mt-16 pt-12 border-t border-white/20 dark:border-white/10">
                        <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-10">Berita Terkait</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedPosts.map((related) => {
                                let relatedImageUrl = "/images/placeholder-news.png";
                                try { 
                                    if (related.mainImage) relatedImageUrl = urlFor(related.mainImage).width(400).height(250).url(); 
                                } catch {}

                                return (
                                    <Link 
                                        key={related._id} 
                                        href={`/blog/${related.slug.current}`} 
                                        className="group block bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-lg overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <div className="relative w-full h-48 overflow-hidden">
                                            <Image 
                                                src={relatedImageUrl} 
                                                alt={related.title} 
                                                fill 
                                                className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        </div>
                                        <div className="p-6">
                                            {related.category && (
                                                <p className="text-xs font-semibold text-cyan-500 mb-2">
                                                    {related.category.title}
                                                </p>
                                            )}
                                            <h3 className="text-lg font-bold text-[var(--foreground)] mb-3 group-hover:text-cyan-500 transition-colors">
                                                {related.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/60">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(related.publishedAt)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}