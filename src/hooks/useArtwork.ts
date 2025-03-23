
import { useCallback } from 'react';
import { useArtworkStore } from '../store/artworkStore';
import { Artwork, Bid, Comment } from '../types';

/**
 * A custom hook that provides memoized selectors for artwork data
 * to prevent infinite re-rendering loops
 */
export function useArtwork() {
  const store = useArtworkStore();
  
  // Memoize selectors to prevent infinite rerenders
  const getAllArtworks = useCallback(() => {
    return store.getAllArtworks();
  }, [store]);
  
  const getArtworkById = useCallback((id: string): Artwork | undefined => {
    return store.getArtworkById(id);
  }, [store]);
  
  const getArtworksByArtist = useCallback((artistId: string): Artwork[] => {
    return store.getArtworksByArtist(artistId);
  }, [store]);
  
  const getCommentsByArtwork = useCallback((artworkId: string): Comment[] => {
    return store.getCommentsByArtwork(artworkId);
  }, [store]);
  
  const getBidsByArtwork = useCallback((artworkId: string): Bid[] => {
    return store.getBidsByArtwork(artworkId);
  }, [store]);
  
  const getHighestBid = useCallback((artworkId: string): Bid | null => {
    return store.getHighestBid(artworkId);
  }, [store]);
  
  const getUserBids = useCallback((userId: string): Bid[] => {
    return store.getUserBids(userId);
  }, [store]);

  return {
    artworks: getAllArtworks(),
    getArtworkById,
    getArtworksByArtist,
    getCommentsByArtwork,
    getBidsByArtwork,
    getHighestBid,
    getUserBids,
    addArtwork: store.addArtwork,
    updateArtwork: store.updateArtwork,
    deleteArtwork: store.deleteArtwork,
    addComment: store.addComment,
    addRating: store.addRating,
    placeBid: store.placeBid,
    setArtworkForSale: store.setArtworkForSale,
    getUserRating: store.getUserRating,
    getAverageRating: store.getAverageRating,
  };
}
