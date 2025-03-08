
import { useState } from 'react';
import { useArtworkStore } from '../store/artworkStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '../hooks/use-toast';
import { Tag, Clock } from 'lucide-react';

interface SaleSettingsProps {
  artworkId: string;
}

const SaleSettings = ({ artworkId }: SaleSettingsProps) => {
  const { getArtworkById, setArtworkForSale } = useArtworkStore();
  const { user } = useAuthStore();
  
  const artwork = getArtworkById(artworkId);
  
  if (!artwork || !user || (user.id !== artwork.artistId && user.role !== 'admin')) {
    return null;
  }
  
  const [forSale, setForSale] = useState(artwork.forSale || false);
  const [startingPrice, setStartingPrice] = useState(artwork.startingPrice?.toString() || '');
  const [bidDuration, setBidDuration] = useState('7'); // Default 7 days
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSaveSettings = () => {
    try {
      setIsSubmitting(true);
      
      if (forSale && (!startingPrice || parseFloat(startingPrice) <= 0)) {
        toast({
          title: "Invalid Price",
          description: "Please enter a valid starting price",
          variant: "destructive"
        });
        return;
      }
      
      // Calculate end date based on duration in days
      const endDate = forSale ? new Date(Date.now() + parseInt(bidDuration) * 24 * 60 * 60 * 1000) : undefined;
      
      setArtworkForSale(
        artworkId, 
        forSale, 
        forSale ? parseFloat(startingPrice) : undefined, 
        endDate
      );
      
      toast({
        title: forSale ? "Artwork Listed for Sale" : "Artwork Removed from Sale",
        description: forSale 
          ? `Starting price: $${startingPrice}, bidding open for ${bidDuration} days` 
          : "This artwork is no longer for sale",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-6 border rounded-lg shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4">Sale Settings</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="for-sale-switch" className="text-base">List for Sale</Label>
            <p className="text-sm text-gray-500">Allow users to bid on this artwork</p>
          </div>
          <Switch 
            id="for-sale-switch"
            checked={forSale}
            onCheckedChange={setForSale}
          />
        </div>
        
        {forSale && (
          <>
            <div className="space-y-2">
              <Label htmlFor="starting-price" className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Starting Price ($)
              </Label>
              <Input
                id="starting-price"
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                min="0.01"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bid-duration" className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Bidding Duration (days)
              </Label>
              <select 
                id="bid-duration"
                value={bidDuration}
                onChange={(e) => setBidDuration(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="5">5 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </>
        )}
        
        <Button 
          onClick={handleSaveSettings}
          disabled={isSubmitting}
          className="w-full"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SaleSettings;
