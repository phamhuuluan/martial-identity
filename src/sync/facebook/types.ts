export interface FacebookAttachmentMedia {
  image?: { src?: string };
  source?: string;
}

export interface FacebookAttachment {
  type?: string;
  media?: FacebookAttachmentMedia;
  url?: string;
  subattachments?: { data?: FacebookAttachment[] };
  target?: { id?: string; url?: string };
}

export interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  updated_time?: string;
  permalink_url?: string;
  full_picture?: string;
  status_type?: string;
  shares?: { count?: number };
  reactions?: { summary?: { total_count?: number } };
  comments?: { summary?: { total_count?: number } };
  attachments?: { data?: FacebookAttachment[] };
}

export interface FacebookPostsResponse {
  data?: FacebookPost[];
  paging?: {
    cursors?: { after?: string; before?: string };
    next?: string;
  };
  error?: { message: string; type?: string; code?: number };
}

export interface NormalizedFacebookPost {
  facebookPostId: string;
  message: string;
  publishedAt: string;
  updatedAt: string;
  facebookUrl: string;
  remoteImages: string[];
  engagementScore: number;
  reactionsCount: number;
  commentsCount: number;
  sharesCount: number;
  statusType?: string;
}
