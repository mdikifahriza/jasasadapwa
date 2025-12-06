import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanityClient";
import { urlFor } from "@/lib/imageUrl";
import { PortableText } from "@portabletext/react";
import { Calendar, User, ArrowLeft, Tag, Clock } from "lucide-react";

// ====== TIPE DATA ======
type Author = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  image?: any;
  bio?: any;
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
  body: any;
  status: string;
  estimatedReadingTime?: number;
};

// ====== FETCH POST BY SLUG ======
async function getPost(slug: string): Promise<Post | null> {
  try {
    const query = `
      *[_type == "post" && slug.current == $slug && status == "published"][0] {
        _id,
        title,
        slug,
        author->{
          _id,
          name,
          slug,
          image,
          bio
        },
        category->{
          _id,
          title,
          slug,
          description
        },
        publishedAt,
        mainImage,
        excerpt,
        body,
        status
      }
    `;

    const post = await sanityClient.fetch<Post | null>(query, { slug });
    
    // Calculate reading time in JavaScript instead
    if (post && post.body) {
      const text = post.body
        .filter((block: any) => block._type === 'block')
        .map((block: any) => 
          block.children
            ?.filter((child: any) => child._type === 'span')
            .map((child: any) => child.text)
            .join('')
        )
        .join(' ');
      
      const wordsPerMinute = 200;
      const wordCount = text.split(/\s+/).length;
      post.estimatedReadingTime = Math.ceil(wordCount / wordsPerMinute);
    }
    
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// ====== FETCH RELATED POSTS ======
async function getRelatedPosts(
  categoryId: string | undefined,
  currentPostId: string,
  limit: number = 3
): Promise<Post[]> {
  try {
    if (!categoryId) return [];

    const query = `
      *[_type == "post" && status == "published" && category._ref == $categoryId && _id != $currentPostId] | order(publishedAt desc) [0...${limit}] {
        _id,
        title,
        slug,
        author->{
          _id,
          name,
          slug
        },
        category->{
          _id,
          title,
          slug
        },
        publishedAt,
        mainImage,
        excerpt
      }
    `;

    const posts = await sanityClient.fetch<Post[]>(query, {
      categoryId,
      currentPostId,
    });

    return posts || [];
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

// ====== FORMAT TANGGAL ======
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// ====== PORTABLE TEXT COMPONENTS ======
const portableTextComponents = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-[var(--foreground)]">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-[var(--foreground)]">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-[var(--foreground)]">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg md:text-xl font-bold mt-6 mb-3 text-[var(--foreground)]">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-base md:text-lg leading-relaxed mb-6 text-[var(--foreground)]/80">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-cyan-500 pl-6 py-4 my-8 bg-white/20 dark:bg-white/5 backdrop-blur-md rounded-r-xl italic text-[var(--foreground)]/90">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 mb-6 ml-4 text-[var(--foreground)]/80">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 ml-4 text-[var(--foreground)]/80">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-[var(--foreground)]">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-[var(--foreground)]">{children}</em>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline underline-offset-4 transition-colors duration-300"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      
      try {
        const imageUrl = urlFor(value).width(1200).height(800).url();
        return (
          <div className="my-8 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={imageUrl}
              alt={value.caption || value.alt || "Article image"}
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            {value.caption && (
              <p className="text-sm text-center mt-3 text-[var(--foreground)]/60 italic">
                {value.caption}
              </p>
            )}
          </div>
        );
      } catch (error) {
        console.error("Error rendering image:", error);
        return null;
      }
    },
  },
};

// ====== PAGE COMPONENT ======
export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category?._id, post._id);

  // Safe image URL generation
  let imageUrl = "/images/placeholder-news.png";
  try {
    if (post.mainImage) {
      imageUrl = urlFor(post.mainImage).width(1200).height(700).url();
    }
  } catch (error) {
    console.error("Error generating main image URL:", error);
  }

  let authorImageUrl = "/images/placeholder-author.png";
  try {
    if (post.author?.image) {
      authorImageUrl = urlFor(post.author.image).width(200).height(200).url();
    }
  } catch (error) {
    console.error("Error generating author image URL:", error);
  }

  return (
    <div className="relative">
      {/* Page Content */}
      <div className="px-6 md:px-10 py-20 md:py-32 container mx-auto max-w-5xl">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-full border border-white/20 dark:border-white/10 hover:border-cyan-400/50 text-[var(--foreground)] transition-all duration-300 shadow-lg mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Kembali ke Berita</span>
        </Link>

        {/* Main Article */}
        <article className="space-y-12">
          {/* Header */}
          <header className="space-y-8">
            {/* Category Badge */}
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

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[var(--foreground)] leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-center text-[var(--foreground)]/70 leading-relaxed max-w-3xl mx-auto">
              {post.excerpt}
            </p>

            {/* Meta Info */}
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
                  <span className="font-medium">
                    {post.estimatedReadingTime} menit baca
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex justify-center">
              <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-xl p-8 md:p-12">
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

          {/* Author Bio */}
          {post.author && (
            <div className="bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-xl p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Author Image */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-white/30 dark:border-white/20 shadow-lg">
                  <Image
                    src={authorImageUrl}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Author Info */}
                <div className="flex-grow space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--foreground)] mb-1">
                      {post.author.name}
                    </h3>
                    <p className="text-[var(--foreground)]/60 font-medium">
                      Penulis
                    </p>
                  </div>

                  {post.author.bio && Array.isArray(post.author.bio) && (
                    <div className="text-[var(--foreground)]/80 leading-relaxed">
                      <PortableText value={post.author.bio} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
                Berita Terkait
              </h2>
              <div className="flex justify-center">
                <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => {
                let relatedImageUrl = "/images/placeholder-news.png";
                try {
                  if (relatedPost.mainImage) {
                    relatedImageUrl = urlFor(relatedPost.mainImage)
                      .width(600)
                      .height(400)
                      .url();
                  }
                } catch (error) {
                  console.error("Error generating related post image:", error);
                }

                return (
                  <Link
                    key={relatedPost._id}
                    href={`/blog/${relatedPost.slug.current}`}
                    className="group"
                  >
                    <article className="h-full flex flex-col bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 hover:border-cyan-400/50 dark:hover:border-cyan-400/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                      {/* Image */}
                      <div className="relative w-full h-48 overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        </div>

                        <Image
                          src={relatedImageUrl}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {relatedPost.category && (
                          <div className="absolute top-3 left-3 z-20">
                            <span className="px-3 py-1 bg-white/40 dark:bg-white/20 backdrop-blur-md text-cyan-600 dark:text-cyan-400 text-xs font-semibold rounded-full border border-white/30 dark:border-white/20 shadow-lg">
                              {relatedPost.category.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-grow p-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/60">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(relatedPost.publishedAt)}</span>
                        </div>

                        <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                          {relatedPost.title}
                        </h3>

                        <p className="text-[var(--foreground)]/70 text-sm leading-relaxed line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
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

// ====== GENERATE METADATA ======
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const post = await getPost(params.slug);

    if (!post) {
      return {
        title: "Berita Tidak Ditemukan",
      };
    }

    let imageUrl: string | undefined;
    try {
      if (post.mainImage) {
        imageUrl = urlFor(post.mainImage).width(1200).height(630).url();
      }
    } catch (error) {
      console.error("Error generating metadata image:", error);
    }

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Berita",
    };
  }
}