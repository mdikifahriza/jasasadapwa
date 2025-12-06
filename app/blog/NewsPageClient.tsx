"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { urlFor } from "@/lib/imageUrl";
import { Calendar, User, ArrowRight, Search, Filter, X } from "lucide-react";

// ====== TIPE DATA BERITA ======
type Author = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  image?: any;
};

type Category = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
};

type Post = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  author: Author;
  category?: Category;
  publishedAt: string;
  mainImage: any;
  excerpt: string;
  status: string;
};

// ====== PROPS ======
type NewsPageClientProps = {
  posts: Post[];
  categories: Category[];
  authors: Author[];
};

// ====== FORMAT TANGGAL ======
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// ====== CLIENT COMPONENT ======
export default function NewsPageClient({
  posts,
  categories,
  authors,
}: NewsPageClientProps) {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    urlCategory || "all"
  );
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Update search query when URL changes
  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  // Update category when URL changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  // Filter posts berdasarkan search dan filter
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by category
      const matchesCategory =
        selectedCategory === "all" || post.category?._id === selectedCategory;

      // Filter by author
      const matchesAuthor =
        selectedAuthor === "all" || post.author._id === selectedAuthor;

      return matchesSearch && matchesCategory && matchesAuthor;
    });
  }, [posts, searchQuery, selectedCategory, selectedAuthor]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAuthor("all");
    // Remove URL params
    window.history.pushState({}, "", "/blog");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedAuthor !== "all";

  return (
    <div className="relative">
      {/* Page Content */}
      <div className="px-6 md:px-10 py-20 md:py-32 space-y-16 container mx-auto max-w-7xl">
        {/* HERO SECTION */}
        <section className="text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-[var(--foreground)] tracking-tight">
              Berita Terkini
            </h1>

            <div className="flex justify-center">
              <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
            </div>

            <p className="text-lg md:text-xl text-[var(--foreground)]/70 leading-relaxed max-w-3xl mx-auto">
              Temukan berita terbaru, artikel menarik, dan update dari kami
            </p>
          </div>
        </section>

        {/* SEARCH & FILTER SECTION */}
        <section className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground)]/40" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/10 focus:border-cyan-400/50 dark:focus:border-cyan-400/50 focus:outline-none text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 transition-all duration-300 shadow-lg"
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/10 hover:border-cyan-400/50 text-[var(--foreground)] transition-all duration-300 shadow-lg"
            >
              <Filter className="w-4 h-4" />
              <span className="font-semibold">
                {showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
              </span>
            </button>
          </div>

{/* Filter Options */} 
{showFilters && (
  <div className="max-w-4xl mx-auto p-6 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-xl space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Category Filter */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[var(--foreground)]">
          Kategori
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-3 bg-black/30 dark:bg-black/50 backdrop-blur-md rounded-xl border border-white/30 dark:border-white/20 focus:border-cyan-400/50 focus:outline-none text-[var(--foreground)] dark:text-black transition-all duration-300"
        >
          <option value="all" className="dark:text-black">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id} className="dark:text-black">
              {category.title}
            </option>
          ))}
        </select>
      </div>

      {/* Author Filter */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[var(--foreground)]">
          Penulis
        </label>
        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="w-full px-4 py-3 bg-black/30 dark:bg-white/10 backdrop-blur-md rounded-xl border border-white/30 dark:border-white/20 focus:border-cyan-400/50 focus:outline-none text-[var(--foreground)] dark:text-black transition-all duration-300"
        >
          <option value="all" className="dark:text-black">Semua Penulis</option>
          {authors.map((author) => (
            <option key={author._id} value={author._id} className="dark:text-black">
              {author.name}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Reset Button */}
    {hasActiveFilters && (
      <div className="flex justify-center pt-2">
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-600 dark:text-cyan-400 rounded-full transition-all duration-300 font-semibold"
        >
          <X className="w-4 h-4" />
          <span>Reset Filter</span>
        </button>
      </div>
    )}
  </div>
)}

{/* Active Filters Display */}
{hasActiveFilters && (
  <div className="flex flex-wrap justify-center gap-3">

    {searchQuery && (
      <div className="px-4 py-2 bg-cyan-500/20 text-cyan-600 dark:text-black-400 rounded-full text-sm font-semibold">
        Pencarian: "{searchQuery}"
      </div>
    )}

    {selectedCategory !== "all" && (
      <div className="px-4 py-2 bg-blue-500/20 text-blue-600 dark:text-black-400 rounded-full text-sm font-semibold">
        {categories.find((c) => c._id === selectedCategory)?.title}
      </div>
    )}

    {selectedAuthor !== "all" && (
      <div className="px-4 py-2 bg-purple-500/20 text-purple-600 dark:text-black-400 rounded-full text-sm font-semibold">
        {authors.find((a) => a._id === selectedAuthor)?.name}
      </div>
    )}

  </div>
)}

</section>

        {/* BERITA LIST */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/10 mb-6">
              <Search className="w-10 h-10 text-[var(--foreground)]/40" />
            </div>
            <p className="text-xl text-[var(--foreground)]/60">
              {hasActiveFilters
                ? "Tidak ada berita yang sesuai dengan filter Anda."
                : "Belum ada berita yang dipublikasikan."}
            </p>
          </div>
        ) : (
          <section className="space-y-8">
            {/* Results Count */}
            <div className="text-center">
              <p className="text-[var(--foreground)]/60">
                Menampilkan{" "}
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {filteredPosts.length}
                </span>{" "}
                berita
              </p>
            </div>  

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => {
                const imageUrl = post.mainImage
                  ? urlFor(post.mainImage).width(800).height(600).url()
                  : "/images/placeholder-news.png";

                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="group"
                  >
                    <article className="h-full flex flex-col bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 hover:border-cyan-400/50 dark:hover:border-cyan-400/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                      {/* Image */}
                      <div className="relative w-full h-64 overflow-hidden">
                        {/* Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        </div>

                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Category Badge */}
                        {post.category && (
                          <div className="absolute top-4 left-4 z-20">
                            <span className="px-4 py-2 bg-white/40 dark:bg-white/20 backdrop-blur-md text-cyan-600 dark:text-cyan-400 text-xs font-semibold rounded-full border border-white/30 dark:border-white/20 shadow-lg">
                              {post.category.title}
                            </span>
                          </div>
                        )}

                        {/* Number Badge */}
                        <div className="absolute top-4 right-4 z-20">
                          <div className="w-12 h-12 bg-white/40 dark:bg-white/10 backdrop-blur-md text-cyan-600 dark:text-cyan-400 font-bold rounded-2xl border border-white/30 dark:border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            {String(index + 1).padStart(2, "0")}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow p-6 space-y-4">
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground)]/60">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                          {post.author && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{post.author.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-[var(--foreground)]/70 text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Read More */}
                        <div className="pt-2 flex items-center text-cyan-600 dark:text-cyan-400 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                          <span>Baca Selengkapnya</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </article>
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