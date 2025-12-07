import React from "react";
import { sanityClient } from "@/lib/sanityClient";
import NewsPageClient from "./NewsPageClient";

// ====== TIPE DATA SANITY ======
type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: string };
};

type Author = {
  _id: string;
  name: string;
  slug: { current: string };
  image?: SanityImage | null;
};

type Category = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  author: Author;
  category?: Category;
  publishedAt: string;
  mainImage?: SanityImage | null;
  excerpt: string;
  status: string;
};

// ====== FETCH DATA DARI SANITY ======
async function getNewsData() {
  const postsQuery = `
    *[_type == "post" && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author->{
        _id,
        name,
        slug,
        image
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
      status
    }
  `;

  const categoriesQuery = `
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }
  `;

  const authorsQuery = `
    *[_type == "author"] | order(name asc) {
      _id,
      name,
      slug,
      image
    }
  `;

  const [posts, categories, authors] = await Promise.all([
    sanityClient.fetch<Post[]>(postsQuery),
    sanityClient.fetch<Category[]>(categoriesQuery),
    sanityClient.fetch<Author[]>(authorsQuery),
  ]);

  return { posts, categories, authors };
}

// ====== SERVER COMPONENT ======
export default async function NewsPage() {
  const { posts, categories, authors } = await getNewsData();

  return <NewsPageClient posts={posts} categories={categories} authors={authors} />;
}
