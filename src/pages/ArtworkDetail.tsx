
import { useParams, useNavigate } from 'react-router-dom';
import { useArtworkStore } from '../store/artworkStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';
import RatingComponent from '../components/RatingComponent';
import CommentSection from '../components/CommentSection';
import BidButton from '../components/BidButton';
import BidHistory from '../components/BidHistory';
import SaleSettings from '../components/SaleSettings';
import { ArrowLeft, Calendar, User, Trash2, Gavel } from 'lucide-react';
import { format } from 'date-fns';

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { getArtworkById, deleteArtwork } = useArtworkStore();
  const { user } = useAuthStore();
  
  if (!id) {
    navigate('/gallery');
    return null;
  }
  
  const artwork = getArtworkById(id);
  
  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Artwork Not Found</h2>
            <p className="text-gray-600 mb-6">The artwork you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/gallery')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  const canDelete = user && (user.role === 'admin' || user.id === artwork.artistId);
  const isArtist = user && user.id === artwork.artistId;
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      deleteArtwork(id);
      toast({
        title: "Artwork Deleted",
        description: "The artwork has been successfully deleted",
      });
      navigate('/gallery');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate('/gallery')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl font-bold">
                {artwork.title}
                {artwork.forSale && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <Gavel className="h-3 w-3 mr-1" />
                    For Sale
                  </span>
                )}
              </h1>
              
              {canDelete && (
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  className="flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Artwork
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                <span>By {artwork.artist.name || artwork.artist.username}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{format(new Date(artwork.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Artwork Image */}
              <div className="bg-white p-2 border rounded-lg shadow-sm mb-8">
                <img 
                  src={artwork.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'} 
                  alt={artwork.title}
                  className="w-full h-auto rounded"
                />
              </div>
              
              {/* Artwork Description */}
              <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-4">About This Artwork</h2>
                <p className="whitespace-pre-line">{artwork.description}</p>
              </div>
              
              {/* Categories */}
              {artwork.categories && artwork.categories.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {artwork.categories.map((category, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Bid History */}
              {artwork.forSale && (
                <div className="mb-8">
                  <BidHistory artworkId={id} />
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              {/* Sale Settings (for artist only) */}
              {isArtist && (
                <SaleSettings artworkId={id} />
              )}
              
              {/* Bid Button (for non-artists) */}
              {artwork.forSale && (
                <BidButton artworkId={id} />
              )}
              
              {/* Ratings */}
              <div className="bg-white p-6 border rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">Rate this Artwork</h2>
                <div className="mb-6">
                  <RatingComponent artworkId={artwork.id} />
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Average Rating</h3>
                    <p className="text-2xl font-bold">{artwork.rating.toFixed(1)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Total Ratings</h3>
                    <p className="text-2xl font-bold">{artwork.ratingCount}</p>
                  </div>
                </div>
              </div>
              
              {/* Artist Info */}
              <div className="bg-white p-6 border rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">About the Artist</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-art-purple/10 flex items-center justify-center text-art-purple">
                    {artwork.artist.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium">{artwork.artist.name || artwork.artist.username}</h3>
                    <p className="text-sm text-gray-500">{artwork.artist.email}</p>
                  </div>
                </div>
                
                {artwork.artist.bio && (
                  <p className="text-sm text-gray-700">{artwork.artist.bio}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="mt-12">
            <Separator className="my-8" />
            <CommentSection artworkId={artwork.id} />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-art-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} ArtGallery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ArtworkDetail;
