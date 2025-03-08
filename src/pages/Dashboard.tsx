
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useArtworkStore } from '../store/artworkStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from '../hooks/use-toast';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import ArtworkCard from '../components/ArtworkCard';
import { Trash2, Search, User, Image, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const { users, getUsersByRole } = useAuthStore();
  const { artworks, comments, deleteArtwork } = useArtworkStore();
  
  const [artistSearch, setArtistSearch] = useState('');
  const [artworkSearch, setArtworkSearch] = useState('');
  
  // Get users by role
  const artists = getUsersByRole('artist');
  const members = getUsersByRole('member');
  
  // Filter artists based on search
  const filteredArtists = artists.filter(artist =>
    artist.username.toLowerCase().includes(artistSearch.toLowerCase()) ||
    artist.email.toLowerCase().includes(artistSearch.toLowerCase())
  );
  
  // Filter artworks based on search
  const filteredArtworks = artworks.filter(artwork =>
    artwork.title.toLowerCase().includes(artworkSearch.toLowerCase()) ||
    artwork.description.toLowerCase().includes(artworkSearch.toLowerCase()) ||
    artwork.artist.username.toLowerCase().includes(artworkSearch.toLowerCase())
  );
  
  const handleDeleteArtwork = (artworkId: string) => {
    if (window.confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      deleteArtwork(artworkId);
      toast({
        title: "Artwork Deleted",
        description: "The artwork has been successfully deleted",
      });
    }
  };
  
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow bg-gray-50">
          <div className="bg-art-purple text-white py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-2">Manage users, artworks, and content</p>
            </div>
          </div>
          
          {/* Dashboard Stats */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
                  <User className="h-4 w-4 text-art-purple" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{artists.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
                  <Image className="h-4 w-4 text-art-purple" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{artworks.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                  <MessageSquare className="h-4 w-4 text-art-purple" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{comments.length}</div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="artworks" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="artworks">Artworks</TabsTrigger>
                <TabsTrigger value="artists">Artists</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>
              
              {/* Artworks Tab */}
              <TabsContent value="artworks">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Artworks</CardTitle>
                    <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search artworks by title, description, or artist..."
                        value={artworkSearch}
                        onChange={(e) => setArtworkSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredArtworks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArtworks.map(artwork => (
                          <div key={artwork.id} className="relative group">
                            <ArtworkCard artwork={artwork} />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteArtwork(artwork.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No artworks found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Artists Tab */}
              <TabsContent value="artists">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Artists</CardTitle>
                    <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search artists by username or email..."
                        value={artistSearch}
                        onChange={(e) => setArtistSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredArtists.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArtists.map(artist => (
                          <Card key={artist.id}>
                            <CardContent className="p-6">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-art-purple/10 flex items-center justify-center text-art-purple">
                                  {artist.username.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <h3 className="font-medium">{artist.username}</h3>
                                  <p className="text-sm text-gray-500">{artist.email}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 text-sm">
                                <p>
                                  <span className="font-medium">Artworks: </span>
                                  {artworks.filter(a => a.artistId === artist.id).length}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No artists found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Members Tab */}
              <TabsContent value="members">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {members.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {members.map(member => (
                          <Card key={member.id}>
                            <CardContent className="p-6">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                  {member.username.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <h3 className="font-medium">{member.username}</h3>
                                  <p className="text-sm text-gray-500">{member.email}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 text-sm">
                                <p>
                                  <span className="font-medium">Comments: </span>
                                  {comments.filter(c => c.userId === member.id).length}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No members found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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

export default Dashboard;
