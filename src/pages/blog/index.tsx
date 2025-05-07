import React from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllBlogPosts } from '../../lib/server/serverMarkdown';
import { Content, BlogMeta } from '../../types/content';

interface BlogPageProps {
  posts: Content<BlogMeta>[];
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <>
      <Head>
        <title>Blog | Where Was It Filmed</title>
        <meta name="description" content="Articles and guides about famous filming locations around the world" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Blog</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link href={`/blog/${post.meta.slug}`} key={post.meta.slug} className="block group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {post.meta.featuredImage ? (
                  <div className="h-48 bg-light-gray overflow-hidden">
                    <img 
                      src={post.meta.featuredImage} 
                      alt={post.meta.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-light-gray flex items-center justify-center">
                    <div className="text-xl font-bold text-dark-gray opacity-30">
                      WWIF Blog
                    </div>
                  </div>
                )}
                
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {post.meta.title}
                  </h2>
                  
                  <div className="mb-3 flex items-center text-sm text-gray-600">
                    {post.meta.date && (
                      <span className="mr-4">
                        {new Date(post.meta.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                    
                    {post.meta.author && (
                      <span>By {post.meta.author}</span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 line-clamp-3 mb-3 flex-1">
                    {post.meta.description}
                  </p>
                  
                  {post.meta.categories && post.meta.categories.length > 0 && (
                    <div className="flex flex-wrap mt-auto">
                      {post.meta.categories.map((category) => (
                        <span key={category} className="mr-2 mb-2 px-2 py-1 bg-light-gray text-dark-gray rounded text-xs">
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No blog posts found.</p>
          </div>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllBlogPosts();
  
  return {
    props: {
      posts,
    },
  };
}; 