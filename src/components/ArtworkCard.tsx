
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Artwork } from '../types';
import { Star, MessageCircle } from 'lucide-react';
import { useArtworkStore } from '../store/artworkStore';
import { Card, CardContent, CardFooter } from '../components/ui/card';

interface ArtworkCardProps {
  artwork: Artwork;
  showArtistDetails?: boolean;
}

const ArtworkCard = ({ artwork, showArtistDetails = true }: ArtworkCardProps) => {
  const { title, description, imageUrl, artist, rating, ratingCount } = artwork;
  const comments = useArtworkStore(state => state.getCommentsByArtwork(artwork.id));
  
  // Placeholder image if no image URL is provided
  const displayImageUrl = imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative pb-[56.25%] overflow-hidden">
        <img 
          src={displayImageUrl}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{title}</h3>
        
        {showArtistDetails && (
          <p className="text-sm text-gray-600 mb-2">
            By {artist.name || artist.username}
          </p>
        )}
        
        <p className="text-sm text-gray-700 line-clamp-2 mb-2">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Star 
              className={`h-4 w-4 ${rating > 0 ? 'text-yellow-500' : 'text-gray-300'} mr-1`} 
              fill={rating > 0 ? 'currentColor' : 'none'} 
            />
            <span>{rating ? rating.toFixed(1) : 'No ratings'}</span>
            {ratingCount > 0 && <span className="text-xs ml-1">({ratingCount})</span>}
          </div>
          
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{comments.length}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link 
          to={`/artwork/${artwork.id}`} 
          className="text-art-purple hover:text-art-purple/80 text-sm font-medium"
        >
          View Details →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArtworkCard;
