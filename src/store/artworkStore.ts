
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artwork, Comment, Rating, User } from '../types';
import { useAuthStore } from './authStore';

// Generate a unique string ID
const generateId = () => Math.random().toString(36).substring(2, 15);

interface ArtworkState {
  artworks: Artwork[];
  comments: Comment[];
  ratings: Rating[];
  addArtwork: (artwork: Omit<Artwork, 'id' | 'createdAt' | 'rating' | 'ratingCount' | 'artist'>) => Artwork;
  updateArtwork: (id: string, updates: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  getArtworksByArtist: (artistId: string) => Artwork[];
  getAllArtworks: () => Artwork[];
  getArtworkById: (id: string) => Artwork | undefined;
  addComment: (artworkId: string, content: string) => void;
  getCommentsByArtwork: (artworkId: string) => Comment[];
  addRating: (artworkId: string, value: number) => void;
  getUserRating: (artworkId: string, userId: string) => number;
  getAverageRating: (artworkId: string) => number;
}

export const useArtworkStore = create<ArtworkState>()(
  persist(
    (set, get) => ({
      artworks: [],
      comments: [],
      ratings: [],

      addArtwork: (artworkData) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          throw new Error('User must be logged in to add artwork');
        }

        // Use the imageData if provided or fall back to imageUrl
        const imageToUse = artworkData.imageData || artworkData.imageUrl;
        
        const newArtwork: Artwork = {
          ...artworkData,
          id: generateId(),
          artistId: currentUser.id,
          artist: currentUser,
          createdAt: new Date(),
          rating: 0,
          ratingCount: 0,
          imageUrl: imageToUse
        };

        set(state => ({
          artworks: [...state.artworks, newArtwork],
        }));

        return newArtwork;
      },

      updateArtwork: (id, updates) => {
        set(state => ({
          artworks: state.artworks.map(artwork => 
            artwork.id === id ? { ...artwork, ...updates } : artwork
          ),
        }));
      },

      deleteArtwork: (id) => {
        set(state => ({
          artworks: state.artworks.filter(artwork => artwork.id !== id),
          comments: state.comments.filter(comment => comment.artworkId !== id),
          ratings: state.ratings.filter(rating => rating.artworkId !== id),
        }));
      },

      getArtworksByArtist: (artistId) => {
        return get().artworks.filter(artwork => artwork.artistId === artistId);
      },

      getAllArtworks: () => {
        return get().artworks;
      },

      getArtworkById: (id) => {
        return get().artworks.find(artwork => artwork.id === id);
      },

      addComment: (artworkId, content) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          throw new Error('User must be logged in to add a comment');
        }

        const newComment: Comment = {
          id: generateId(),
          artworkId,
          userId: currentUser.id,
          user: currentUser,
          content,
          createdAt: new Date(),
        };

        set(state => ({
          comments: [...state.comments, newComment],
        }));
      },

      getCommentsByArtwork: (artworkId) => {
        return get().comments.filter(comment => comment.artworkId === artworkId);
      },

      addRating: (artworkId, value) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          throw new Error('User must be logged in to add a rating');
        }

        // Check if the user has already rated this artwork
        const existingRatingIndex = get().ratings.findIndex(
          rating => rating.artworkId === artworkId && rating.userId === currentUser.id
        );

        let newRatings = [...get().ratings];

        if (existingRatingIndex >= 0) {
          // Update existing rating
          newRatings[existingRatingIndex] = {
            ...newRatings[existingRatingIndex],
            value,
          };
        } else {
          // Add new rating
          newRatings.push({
            id: generateId(),
            artworkId,
            userId: currentUser.id,
            value,
            createdAt: new Date(),
          });
        }

        // Update artwork average rating
        const artworkRatings = newRatings.filter(rating => rating.artworkId === artworkId);
        const averageRating = artworkRatings.reduce((sum, rating) => sum + rating.value, 0) / artworkRatings.length;

        set(state => ({
          ratings: newRatings,
          artworks: state.artworks.map(artwork => 
            artwork.id === artworkId 
              ? { 
                  ...artwork, 
                  rating: averageRating, 
                  ratingCount: artworkRatings.length
                } 
              : artwork
          ),
        }));
      },

      getUserRating: (artworkId, userId) => {
        const rating = get().ratings.find(
          rating => rating.artworkId === artworkId && rating.userId === userId
        );
        return rating ? rating.value : 0;
      },

      getAverageRating: (artworkId) => {
        const artworkRatings = get().ratings.filter(rating => rating.artworkId === artworkId);
        if (artworkRatings.length === 0) return 0;
        return artworkRatings.reduce((sum, rating) => sum + rating.value, 0) / artworkRatings.length;
      },
    }),
    {
      name: 'artwork-storage',
    }
  )
);
