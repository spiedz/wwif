export interface Comment {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  pageSlug: string;
  pageType: 'film' | 'blog';
  isApproved?: boolean;
}

export interface CommentFormData {
  name: string;
  message: string;
  pageSlug: string;
  pageType: 'film' | 'blog';
} 