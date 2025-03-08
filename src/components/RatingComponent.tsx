
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useArtworkStore } from '../store/artworkStore';
import { toast } from '../hooks/use-toast';

interface RatingComponentProps {
  artworkId: string;
  className?: string;
}

const RatingComponent = ({ artworkId, className = '' }: RatingComponentProps) => {
  const { user, isLoggedIn } = useAuthStore();
  const { addRating, getUserRating } = useArtworkStore();
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  
  useEffect(() => {
    if (user && isLoggedIn) {
      const userRating = getUserRating(artworkId, user.id);
      setRating(userRating);
    }
  }, [user, isLoggedIn, artworkId, getUserRating]);
  
  const handleRate = (value: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please login to rate artwork",
        variant: "destructive",
      });
      return;
    }
    
    setRating(value);
    addRating(artworkId, value);
    
    toast({
      title: "Rating Submitted",
      description: `You rated this artwork ${value} stars`,
    });
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`p-1 focus:outline-none ${
              !isLoggedIn ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
            }`}
            onClick={() => handleRate(star)}
            onMouseEnter={() => isLoggedIn && setHover(star)}
            onMouseLeave={() => isLoggedIn && setHover(0)}
            disabled={!isLoggedIn}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`h-6 w-6 ${
                (hover || rating) >= star ? 'text-yellow-500' : 'text-gray-300'
              }`}
              fill={(hover || rating) >= star ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
      
      <span className="ml-2 text-sm text-gray-600">
        {isLoggedIn 
          ? rating > 0 
            ? `Your rating: ${rating}`
            : "Rate this artwork" 
          : "Login to rate"
        }
      </span>
    </div>
  );
};

export default RatingComponent;
