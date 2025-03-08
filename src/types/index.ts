
export type UserRole = 'admin' | 'artist' | 'member';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  artistId: string;
  artist: User;
  createdAt: Date;
  categories: string[];
  rating: number;
  ratingCount: number;
  imageData?: string; // Base64 encoded image data
  forSale?: boolean;
  startingPrice?: number;
  currentBid?: number;
  bidEndTime?: Date;
  year?: string; // Added year field for when the artwork was created
}

export interface Comment {
  id: string;
  artworkId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: Date;
}

export interface Rating {
  id: string;
  artworkId: string;
  userId: string;
  value: number;
  createdAt: Date;
}

export interface Bid {
  id: string;
  artworkId: string;
  userId: string;
  user: User;
  amount: number;
  createdAt: Date;
}
