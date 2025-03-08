
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';
import ArtworkCard from '../components/ArtworkCard';
import { useArtworkStore } from '../store/artworkStore';

const Index = () => {
  const navigate = useNavigate();
  const artworks = useArtworkStore(state => state.getAllArtworks());
  
  // Get only the most recent 3 artworks for the showcase
  const recentArtworks = [...artworks].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-art-purple/90 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Amazing Artwork
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Explore a world of creativity, connect with artists, and find the perfect piece for your collection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate('/gallery')} 
              className="bg-white text-art-purple hover:bg-gray-100"
              size="lg"
            >
              Browse Gallery
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              size="lg"
            >
              Join as Artist
            </Button>
          </div>
        </div>
      </section>
      
      {/* Recent Artwork Section */}
      {recentArtworks.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-art-dark mb-4">Recent Artwork</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Check out the latest creations from our talented artists
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArtworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                onClick={() => navigate('/gallery')} 
                className="bg-art-purple hover:bg-art-purple/90"
              >
                View All Artwork
              </Button>
            </div>
          </div>
        </section>
      )}
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-art-dark mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform connects artists with art enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg">
              <div className="w-16 h-16 bg-art-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-art-purple">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Account</h3>
              <p className="text-gray-600">
                Sign up as an artist to showcase your work or as a member to discover and support artists.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg">
              <div className="w-16 h-16 bg-art-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-art-purple">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Artwork</h3>
              <p className="text-gray-600">
                Artists can easily upload their creations with details to share with the community.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg">
              <div className="w-16 h-16 bg-art-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-art-purple">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Engage</h3>
              <p className="text-gray-600">
                Rate artwork, leave comments, and connect with the creative community.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-art-light py-16 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-art-dark mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join our community of artists and art enthusiasts today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate('/signup')} 
              className="bg-art-purple hover:bg-art-purple/90"
              size="lg"
            >
              Sign Up Now
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline" 
              className="border-art-purple text-art-purple hover:bg-art-purple/10"
              size="lg"
            >
              Login
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-art-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} ArtGallery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
