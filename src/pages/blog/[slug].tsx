import React, { useRef } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { getBlogBySlug, getBlogSlugs, getAllBlogPosts, getRelatedBlogPosts } from '../../lib/server/serverMarkdown';
import { Content, BlogMeta } from '../../types/content';
import SEO from '../../components/SEO';
import { getBlogSchema, getBreadcrumbSchema } from '../../utils/schema';
import { useRouter } from 'next/router';
import CommentSection from '../../components/CommentSection';
import BlogPost from '../../components/BlogPost';
import TableOfContents from '../../components/TableOfContents';
import AuthorInfo from '../../components/AuthorInfo';
import RelatedPosts from '../../components/RelatedPosts';
import { ParsedUrlQuery } from 'querystring';
import Head from 'next/head';
import { RelatedPost } from '../../types/blog-interfaces';

interface BlogPostPageProps {
  post: Content<BlogMeta>;
  relatedPosts: RelatedPost[];
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

/**
 * Convert Content<BlogMeta> to RelatedPost for consistent interfaces
 */
function convertToRelatedPost(post: Content<BlogMeta>): RelatedPost {
  return {
    slug: post.meta.slug,
    title: post.meta.title,
    description: post.meta.description,
    date: post.meta.date,
    featuredImage: post.meta.featuredImage,
    categories: post.meta.categories,
    excerpt: post.content?.substring(0, 150) + '...',
    author: post.meta.author
  };
}

const BlogPostPage = ({ post, relatedPosts }: BlogPostPageProps) => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const currentUrl = process.env.NEXT_PUBLIC_BASE_URL ? 
    `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}` : 
    `https://wherewasitfilmed.co${router.asPath}`;
    
  // Generate JSON-LD schema for this blog post
  const blogSchema = getBlogSchema(post.meta, currentUrl);
  
  // Generate breadcrumb schema
  const breadcrumbItems = [
    { name: 'Home', url: 'https://wherewasitfilmed.co/' },
    { name: 'Blog', url: 'https://wherewasitfilmed.co/blog/' },
    { name: post.meta.title, url: currentUrl }
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  
  // Combine all schemas into a single JSON string
  const schemaData = JSON.stringify([blogSchema, breadcrumbSchema].filter(Boolean));

  // Mock author data - in a real app, this would come from a database or CMS
  const authorData = {
    name: post.meta.author || 'Film Location Team',
    role: 'Author & Film Location Expert',
    bio: 'Passionate about discovering and sharing iconic film locations around the world.',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/filmlocations' },
      { platform: 'instagram', url: 'https://instagram.com/filmlocations' },
      { platform: 'website', url: 'https://wherewasitfilmed.co' }
    ]
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  const { meta, content, html } = post;

  return (
    <>
      <Head>
        <title>{meta.title} | WWIF - Where Was It Filmed</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        {meta.featuredImage && <meta property="og:image" content={meta.featuredImage} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {meta.featuredImage && <meta name="twitter:image" content={meta.featuredImage} />}
      </Head>

      <SEO 
        meta={meta} 
        type="article"
        imageUrl={meta.featuredImage}
        jsonLd={schemaData}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb navigation */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-600 hover:text-primary">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/blog" className="text-gray-600 hover:text-primary">
                Blog
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-primary font-medium truncate max-w-xs">{meta.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2">
            {/* Enhanced Blog Post Component */}
            <div ref={contentRef}>
              <BlogPost meta={meta} content={content} html={html} relatedPosts={relatedPosts} />
            </div>
          </div>
          
          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Table of Contents */}
              <TableOfContents contentRef={contentRef} />
              
              {/* Author Info */}
              <AuthorInfo 
                author={{
                  name: authorData.name,
                  bio: `${authorData.role} - ${authorData.bio}`,
                  socialLinks: authorData.socialLinks
                }}
              />
              
              {/* Newsletter Signup */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-primary text-white p-4">
                  <h3 className="text-xl font-semibold">Never Miss a Post</h3>
                  <p className="text-sm mt-1 text-white/80">Get updates on new film locations</p>
                </div>
                <div className="p-4">
                  <form className="space-y-3">
                    <div>
                      <label htmlFor="email" className="sr-only">Email address</label>
                      <input 
                        type="email" 
                        id="email" 
                        placeholder="Your email address" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Posts Section */}
        <section className="mt-12">
          <RelatedPosts 
            currentPostSlug={meta.slug} 
            posts={relatedPosts} 
          />
        </section>
        
        {/* Comment section */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <CommentSection pageSlug={meta.slug} pageType="blog" />
        </section>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Temporarily disable blog pages to prevent build errors
  // TODO: Fix component import issues causing "Element type is invalid" errors
  return {
    paths: [],
    fallback: false
  };
  
  // Original code commented out:
  /*
  try {
    const slugs = await getBlogSlugs();
    console.log(`Found ${slugs.length} blog slugs for static generation`);
    
    const paths = slugs.map((slug) => ({
      params: { slug },
    }));

    return { paths, fallback: true };
  } catch (error) {
    console.error('Error in getStaticPaths for blog:', error);
    return { paths: [], fallback: true };
  }
  */
};

export const getStaticProps: GetStaticProps<BlogPostPageProps, Params> = async ({ params }) => {
  const slug = params?.slug;
  
  if (!slug) {
    return {
      notFound: true,
    };
  }

  const post = await getBlogBySlug(slug);
  
  if (!post) {
    return {
      notFound: true,
    };
  }

  const relatedPostsData = await getRelatedBlogPosts(slug, 3);
  // Convert to RelatedPost format
  const relatedPosts = relatedPostsData.map(convertToRelatedPost);

  return {
    props: {
      post,
      relatedPosts,
    },
  };
};

export default BlogPostPage; 