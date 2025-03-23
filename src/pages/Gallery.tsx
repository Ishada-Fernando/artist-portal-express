import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ArtworkCard from '../components/ArtworkCard';
import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';
import { useArtwork } from '../hooks/useArtwork';

const Gallery = () => {
  const { artworks } = useArtwork();
  const [filteredArtworks, setFilteredArtworks] = useState([...artworks]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Extract unique categories from artworks
  const allCategories = artworks.flatMap(artwork => artwork.categories || []);
  const uniqueCategories = [...new Set(allCategories)];
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  useEffect(() => {
    let result = [...artworks];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        artwork => 
          artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artwork.artist.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        artwork => artwork.categories?.includes(selectedCategory)
      );
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'highest-rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'most-commented') {
      // This would require knowing the comment count per artwork
      // For now, we'll sort by rating as fallback
      result.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredArtworks(result);
  }, [artworks, searchTerm, selectedCategory, sortBy]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled in the useEffect
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Gallery Hero */}
        <div className="bg-art-purple text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Artwork Gallery</h1>
            <p className="max-w-2xl mx-auto">
              Browse and discover amazing artwork from talented artists
            </p>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="bg-white py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by title, description, or artist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>
              
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest-rated">Highest Rated</SelectItem>
                    <SelectItem value="most-commented">Most Commented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gallery Grid */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            {filteredArtworks.length > 0 ? (
              <>
                <div className="mb-6 text-sm text-gray-600">
                  Showing {filteredArtworks.length} {filteredArtworks.length === 1 ? 'artwork' : 'artworks'}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredArtworks.map(artwork => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No artwork found</h3>
                <p className="text-gray-600 mb-6">
                  {artworks.length === 0 
                    ? "There are no artworks in the gallery yet."
                    : "Try adjusting your search or filters to find what you're looking for."}
                </p>
                
                {searchTerm || selectedCategory !== 'all' ? (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                ) : null}
              </div>
            )}
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

export default Gallery;
