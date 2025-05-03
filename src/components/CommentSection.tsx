import React, { useState, useEffect } from 'react';
import { Comment, CommentFormData } from '../types/comment';

interface CommentSectionProps {
  pageSlug: string;
  pageType: 'film' | 'blog';
}

const CommentSection: React.FC<CommentSectionProps> = ({ pageSlug, pageType }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  
  // Form state
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  
  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/comments?pageSlug=${pageSlug}&pageType=${pageType}`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch comments');
        }
        
        setComments(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [pageSlug, pageType]);
  
  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.length > 50) {
      setNameError('Name must be less than 50 characters');
      isValid = false;
    } else {
      setNameError(null);
    }
    
    // Validate message
    if (!message.trim()) {
      setMessageError('Message is required');
      isValid = false;
    } else if (message.length > 1000) {
      setMessageError('Message must be less than 1000 characters');
      isValid = false;
    } else {
      setMessageError(null);
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const commentData: CommentFormData = {
        name: name.trim(),
        message: message.trim(),
        pageSlug,
        pageType,
      };
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit comment');
      }
      
      // Add the new comment to the list
      setComments([data.data, ...comments]);
      
      // Reset form
      setName('');
      setMessage('');
      setSubmitSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      // Return the original string if date parsing fails
      return dateString;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-dark-gray">Comments</h2>
      </div>
      
      {/* Comment form */}
      <div className="px-6 py-6 bg-light-gray">
        <h3 className="text-lg font-medium mb-4">Leave a comment</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div>
            <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="comment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className={`w-full px-4 py-2 border ${
                nameError ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Your name"
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600">{nameError}</p>
            )}
          </div>
          
          {/* Message field */}
          <div>
            <label htmlFor="comment-message" className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              id="comment-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitting}
              rows={4}
              className={`w-full px-4 py-2 border ${
                messageError ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="Share your thoughts..."
            />
            {messageError && (
              <p className="mt-1 text-sm text-red-600">{messageError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 text-right">
              {message.length}/1000 characters
            </p>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Post Comment'}
            </button>
          </div>
          
          {/* Form status messages */}
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <p>{submitError}</p>
            </div>
          )}
          
          {submitSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              <p>Your comment has been posted successfully!</p>
            </div>
          )}
        </form>
      </div>
      
      {/* Comments list */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium mb-2">
          {comments.length === 0 
            ? 'No comments yet' 
            : `${comments.length} Comment${comments.length === 1 ? '' : 's'}`}
        </h3>
        
        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading comments...</p>
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-gray-600">Be the first to leave a comment!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-base font-semibold text-dark-gray">{comment.name}</h4>
                      <time className="text-xs text-gray-500">{formatDate(comment.createdAt)}</time>
                    </div>
                    <div className="text-gray-700 whitespace-pre-line break-words">{comment.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection; 