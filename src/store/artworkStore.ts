import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artwork, Comment, Rating, Bid, User } from '../types';
import { useAuthStore } from './authStore';

// Generate a unique string ID
const generateId = () => Math.random().toString(36).substring(2, 15);

interface ArtworkState {
  artworks: Artwork[];
  comments: Comment[];
  ratings: Rating[];
  bids: Bid[];
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
  placeBid: (artworkId: string, amount: number) => Bid | null;
  getBidsByArtwork: (artworkId: string) => Bid[];
  getHighestBid: (artworkId: string) => Bid | null;
  getUserBids: (userId: string) => Bid[];
  setArtworkForSale: (artworkId: string, forSale: boolean, startingPrice?: number, bidEndTime?: Date) => void;
}

export const useArtworkStore = create<ArtworkState>()(
  persist(
    (set, get) => {
      // Get Vincent van Gogh user for initialization
      const vanGoghUser: User = {
        id: 'artist6',
        username: 'VincentVanGogh',
        email: 'vincentvangogh@artgallery.com',
        role: 'artist',
        name: 'Vincent van Gogh',
        bio: 'Dutch post-impressionist painter who posthumously became one of the most famous and influential figures in Western art history.',
      };

      return {
        artworks: [
          {
            id: 'starry-night',
            title: 'The Starry Night',
            description: 'The Starry Night is an oil on canvas painting by Dutch post-impressionist painter Vincent van Gogh. Painted in June 1889, it depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an imaginary village.',
            imageUrl: '/lovable-uploads/619bbdc6-e3ee-4f54-b6f4-898568cb1970.png',
            artistId: 'artist6',
            artist: vanGoghUser,
            createdAt: new Date('1889-06-01'),
            categories: ['Post-Impressionism', 'Landscape', 'Masterpiece'],
            rating: 5,
            ratingCount: 1,
            year: '1889',
            forSale: true,
            startingPrice: 100000000
          }
        ],
        comments: [],
        ratings: [
          {
            id: 'initial-rating',
            artworkId: 'starry-night',
            userId: 'admin1',
            value: 5,
            createdAt: new Date()
          }
        ],
        bids: [],

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
            bids: state.bids.filter(bid => bid.artworkId !== id),
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

        placeBid: (artworkId, amount) => {
          const currentUser = useAuthStore.getState().user;
          if (!currentUser) {
            throw new Error('User must be logged in to place a bid');
          }

          const artwork = get().getArtworkById(artworkId);
          if (!artwork) {
            throw new Error('Artwork not found');
          }

          if (!artwork.forSale) {
            throw new Error('This artwork is not for sale');
          }

          // Check if bid amount is higher than current bid or starting price
          const currentBidAmount = artwork.currentBid || artwork.startingPrice || 0;
          if (amount <= currentBidAmount) {
            throw new Error(`Bid must be higher than current amount: ${currentBidAmount}`);
          }

          // Check if bidding period has ended
          if (artwork.bidEndTime && new Date(artwork.bidEndTime) < new Date()) {
            throw new Error('Bidding period has ended for this artwork');
          }

          const newBid: Bid = {
            id: generateId(),
            artworkId,
            userId: currentUser.id,
            user: currentUser,
            amount,
            createdAt: new Date(),
          };

          set(state => ({
            bids: [...state.bids, newBid],
            artworks: state.artworks.map(art => 
              art.id === artworkId 
                ? { ...art, currentBid: amount } 
                : art
            ),
          }));

          return newBid;
        },

        getBidsByArtwork: (artworkId) => {
          return get().bids
            .filter(bid => bid.artworkId === artworkId)
            .sort((a, b) => b.amount - a.amount); // Sort by highest amount first
        },

        getHighestBid: (artworkId) => {
          const bids = get().getBidsByArtwork(artworkId);
          return bids.length > 0 ? bids[0] : null;
        },

        getUserBids: (userId) => {
          return get().bids.filter(bid => bid.userId === userId);
        },

        setArtworkForSale: (artworkId, forSale, startingPrice, bidEndTime) => {
          const artwork = get().getArtworkById(artworkId);
          if (!artwork) {
            throw new Error('Artwork not found');
          }

          // Verify the user is the artist or an admin
          const currentUser = useAuthStore.getState().user;
          if (!currentUser || (currentUser.id !== artwork.artistId && currentUser.role !== 'admin')) {
            throw new Error('Only the artist or an admin can put artwork for sale');
          }

          set(state => ({
            artworks: state.artworks.map(art => 
              art.id === artworkId 
                ? { 
                    ...art, 
                    forSale,
                    startingPrice: forSale ? (startingPrice || art.startingPrice) : undefined,
                    bidEndTime: forSale ? (bidEndTime || art.bidEndTime) : undefined,
                    currentBid: forSale ? art.currentBid : undefined
                  } 
                : art
            ),
          }));
        },
      };
    },
    {
      name: 'artwork-storage',
    }
  )
);
