import type { NextApiRequest, NextApiResponse } from 'next';
import { getComments, addComment } from '../../../utils/comments';
import { Comment, CommentFormData } from '../../../types/comment';

type ResponseData = {
  success: boolean;
  data?: Comment[] | Comment;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Handle GET request to fetch comments
  if (req.method === 'GET') {
    try {
      const { pageSlug, pageType } = req.query;
      
      if (!pageSlug || !pageType || Array.isArray(pageSlug) || Array.isArray(pageType)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid pageSlug or pageType parameters'
        });
      }

      if (pageType !== 'film' && pageType !== 'blog') {
        return res.status(400).json({ 
          success: false, 
          error: 'pageType must be "film" or "blog"'
        });
      }
      
      const comments = await getComments(pageSlug, pageType);
      
      return res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch comments',
      });
    }
  }
  
  // Handle POST request to add a comment
  if (req.method === 'POST') {
    try {
      const commentData = req.body as CommentFormData;
      
      // Validate required fields
      if (!commentData.name || !commentData.message || !commentData.pageSlug || !commentData.pageType) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }
      
      // Validate pageType
      if (commentData.pageType !== 'film' && commentData.pageType !== 'blog') {
        return res.status(400).json({
          success: false,
          error: 'pageType must be "film" or "blog"',
        });
      }
      
      const newComment = await addComment(commentData);
      
      if (!newComment) {
        return res.status(500).json({
          success: false,
          error: 'Failed to add comment',
        });
      }
      
      return res.status(201).json({
        success: true,
        data: newComment,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to add comment',
      });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
} 