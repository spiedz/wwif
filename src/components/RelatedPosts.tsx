import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RelatedPost } from '../types/blog-interfaces';

export interface RelatedPostsProps {
  posts: RelatedPost[];
  currentPostSlug: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts, currentPostSlug }) => {
  // Filter out the current post if it's included in the related posts
  const filteredPosts = posts.filter(post => post.slug !== currentPostSlug);
  
  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPosts.slice(0, 3).map((post, index) => (
          <Link href={`/blog/${post.slug}`} key={index} className="group">
            <article className="h-full bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                {post.categories && post.categories.length > 0 && (
                  <div className="mb-2 text-xs text-primary">{post.categories[0]}</div>
                )}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {post.description || post.excerpt || 'Read this related article'}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts; 