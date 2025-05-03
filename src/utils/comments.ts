import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Comment, CommentFormData } from '../types/comment';

const COMMENTS_DIR = path.join(process.cwd(), 'data/comments');

// Initialize comments system - call at application startup
export function initializeCommentsSystem() {
  ensureCommentsDir();
  console.log('Comments system initialized');
}

// Ensure comments directory exists
function ensureCommentsDir() {
  if (!fs.existsSync(COMMENTS_DIR)) {
    try {
      fs.mkdirSync(COMMENTS_DIR, { recursive: true });
      console.log(`Created comments directory at ${COMMENTS_DIR}`);
    } catch (error) {
      console.error('Failed to create comments directory:', error);
    }
  }
}

// Get the file path for a specific page's comments
function getCommentsFilePath(pageSlug: string, pageType: 'film' | 'blog'): string {
  ensureCommentsDir();
  return path.join(COMMENTS_DIR, `${pageType}-${pageSlug}.json`);
}

// Get all comments for a specific page
export async function getComments(pageSlug: string, pageType: 'film' | 'blog'): Promise<Comment[]> {
  const filePath = getCommentsFilePath(pageSlug, pageType);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const comments = JSON.parse(fileContent) as Comment[];
    
    // Sort by date (newest first)
    return comments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error(`Error reading comments for ${pageType}/${pageSlug}:`, error);
    return [];
  }
}

// Add a new comment for a specific page
export async function addComment(commentData: CommentFormData): Promise<Comment | null> {
  const { pageSlug, pageType, name, message } = commentData;
  
  // Basic validation
  if (!pageSlug || !pageType || !name || !message) {
    return null;
  }
  
  try {
    const filePath = getCommentsFilePath(pageSlug, pageType);
    let comments: Comment[] = [];
    
    // Read existing comments if file exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      comments = JSON.parse(fileContent) as Comment[];
    }
    
    // Create new comment
    const newComment: Comment = {
      id: uuidv4(),
      name,
      message,
      createdAt: new Date().toISOString(),
      pageSlug,
      pageType,
      isApproved: true, // Auto-approve for simplicity
    };
    
    // Add new comment
    comments.push(newComment);
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2), 'utf8');
    
    return newComment;
  } catch (error) {
    console.error(`Error adding comment for ${pageType}/${pageSlug}:`, error);
    return null;
  }
}

// Delete a comment by ID
export async function deleteComment(commentId: string, pageSlug: string, pageType: 'film' | 'blog'): Promise<boolean> {
  try {
    const filePath = getCommentsFilePath(pageSlug, pageType);
    
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const comments = JSON.parse(fileContent) as Comment[];
    
    // Filter out the comment to delete
    const filteredComments = comments.filter(comment => comment.id !== commentId);
    
    if (filteredComments.length === comments.length) {
      // No comment was removed
      return false;
    }
    
    // Write filtered comments back to file
    fs.writeFileSync(filePath, JSON.stringify(filteredComments, null, 2), 'utf8');
    
    return true;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    return false;
  }
}

// Update a comment's approval status
export async function updateCommentApproval(
  commentId: string, 
  isApproved: boolean, 
  pageSlug: string, 
  pageType: 'film' | 'blog'
): Promise<Comment | null> {
  try {
    const filePath = getCommentsFilePath(pageSlug, pageType);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const comments = JSON.parse(fileContent) as Comment[];
    
    // Find and update the comment
    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    
    if (commentIndex === -1) {
      return null;
    }
    
    comments[commentIndex].isApproved = isApproved;
    
    // Write updated comments back to file
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2), 'utf8');
    
    return comments[commentIndex];
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error);
    return null;
  }
} 