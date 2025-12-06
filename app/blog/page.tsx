import React from "react";
import { sanityClient } from "@/lib/sanityClient";
import NewsPageClient from "./NewsPageClient";

// ====== TIPE DATA ======
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

// ====== FETCH DATA DARI SANITY ======
async function getNewsData() {
  // Fetch posts
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

  // Fetch all categories
  const categoriesQuery = `
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }
  `;

  // Fetch all authors
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

  return (
    <NewsPageClient posts={posts} categories={categories} authors={authors} />
  );
}