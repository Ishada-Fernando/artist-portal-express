
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtworkStore } from '../store/artworkStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from '../hooks/use-toast';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import ArtworkCard from '../components/ArtworkCard';
import FileUpload from '../components/FileUpload';
import { PlusCircle, UploadCloud, X } from 'lucide-react';

const ArtistPortal = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addArtwork, getArtworksByArtist } = useArtworkStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Get artworks by the current artist
  const artistArtworks = user ? getArtworksByArtist(user.id) : [];
  
  const handleAddCategory = () => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
      setCategory('');
    }
  };
  
  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(c => c !== categoryToRemove));
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simple validation
      if (!title || !description) {
        toast({
          title: "Missing Information",
          description: "Please provide a title and description for your artwork",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!selectedFile) {
        toast({
          title: "Missing Artwork",
          description: "Please upload an image for your artwork",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Convert the selected file to base64
      const imageData = await convertFileToBase64(selectedFile);
      
      // Create new artwork
      const newArtwork = addArtwork({
        title,
        description,
        imageUrl: 'placeholder', // Will be replaced by imageData
        imageData, // Add the base64 data
        artistId: user!.id,
        categories,
      });
      
      toast({
        title: "Artwork Submitted",
        description: "Your artwork has been successfully added to the gallery",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setCategories([]);
      
      // Navigate to the new artwork
      navigate(`/artwork/${newArtwork.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting your artwork",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ProtectedRoute allowedRoles={['artist', 'admin']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <div className="bg-art-purple text-white py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold">Artist Portal</h1>
              <p className="mt-2">Submit your artwork and manage your portfolio</p>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Submit Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit New Artwork</CardTitle>
                    <CardDescription>
                      Share your latest creation with the community
                    </CardDescription>
                  </CardHeader>
                  
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Title
                        </label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter artwork title"
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                          Description
                        </label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe your artwork..."
                          rows={4}
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Artwork Image
                        </label>
                        <FileUpload 
                          onFileSelect={handleFileSelect}
                          selectedFile={selectedFile}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Categories
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Add a category"
                            disabled={loading}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={handleAddCategory}
                            disabled={!category || loading}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {categories.map((cat, index) => (
                              <div 
                                key={index} 
                                className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                              >
                                {cat}
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveCategory(cat)}
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-art-purple hover:bg-art-purple/90"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <UploadCloud className="mr-2 h-4 w-4 animate-bounce" />
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Submit Artwork
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>
              
              {/* Artist's Artwork */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Your Artwork</h2>
                
                {artistArtworks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {artistArtworks.map(artwork => (
                      <ArtworkCard 
                        key={artwork.id} 
                        artwork={artwork} 
                        showArtistDetails={false} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-gray-500 mb-4">
                      <UploadCloud className="mx-auto h-12 w-12" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No artwork yet</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't submitted any artwork yet. Use the form to share your first piece!
                    </p>
                  </div>
                )}
              </div>
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
    </ProtectedRoute>
  );
};

export default ArtistPortal;
