import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteComment, updateCommentApproval } from '../../../utils/comments';
import { Comment } from '../../../types/comment';

type ResponseData = {
  success: boolean;
  data?: Comment;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid comment ID',
    });
  }
  
  // Handle DELETE request to remove a comment
  if (req.method === 'DELETE') {
    try {
      const { pageSlug, pageType } = req.query;
      
      if (!pageSlug || !pageType || Array.isArray(pageSlug) || Array.isArray(pageType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid pageSlug or pageType parameters',
        });
      }
      
      if (pageType !== 'film' && pageType !== 'blog') {
        return res.status(400).json({
          success: false,
          error: 'pageType must be "film" or "blog"',
        });
      }
      
      const deleted = await deleteComment(id, pageSlug, pageType);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Comment not found or could not be deleted',
        });
      }
      
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete comment',
      });
    }
  }
  
  // Handle PATCH request to update a comment (approval status)
  if (req.method === 'PATCH') {
    try {
      const { isApproved, pageSlug, pageType } = req.body;
      
      if (typeof isApproved !== 'boolean' || !pageSlug || !pageType) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request body',
        });
      }
      
      if (pageType !== 'film' && pageType !== 'blog') {
        return res.status(400).json({
          success: false,
          error: 'pageType must be "film" or "blog"',
        });
      }
      
      const updatedComment = await updateCommentApproval(id, isApproved, pageSlug, pageType);
      
      if (!updatedComment) {
        return res.status(404).json({
          success: false,
          error: 'Comment not found or could not be updated',
        });
      }
      
      return res.status(200).json({
        success: true,
        data: updatedComment,
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update comment',
      });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
} 