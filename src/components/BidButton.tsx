import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '../hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useArtwork } from '../hooks/useArtwork';

interface BidButtonProps {
  artworkId: string;
}

const BidButton = ({ artworkId }: BidButtonProps) => {
  const { getArtworkById, placeBid, getHighestBid } = useArtwork();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const artwork = getArtworkById(artworkId);
  const highestBid = getHighestBid(artworkId);
  
  if (!artwork) return null;
  
  // Not for sale or bidding ended
  if (!artwork.forSale || (artwork.bidEndTime && new Date(artwork.bidEndTime) < new Date())) {
    return null;
  }
  
  const minimumBid = (artwork.currentBid || artwork.startingPrice || 0) + 1;
  
  const handleBidClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to log in to place a bid",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Artist can't bid on their own artwork
    if (user.id === artwork.artistId) {
      toast({
        title: "Cannot Bid",
        description: "You can't bid on your own artwork",
        variant: "destructive"
      });
      return;
    }
    
    setShowBidDialog(true);
    setBidAmount(minimumBid.toString());
  };
  
  const handleBidSubmit = () => {
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }
    
    if (amount < minimumBid) {
      toast({
        title: "Bid Too Low",
        description: `Minimum bid is $${minimumBid}`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      placeBid(artworkId, amount);
      toast({
        title: "Bid Placed!",
        description: `Your bid of $${amount} was successful`,
      });
      setShowBidDialog(false);
    } catch (error) {
      toast({
        title: "Bid Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate time remaining for bidding
  const bidEndTimeRemaining = artwork.bidEndTime 
    ? formatDistanceToNow(new Date(artwork.bidEndTime), { addSuffix: true })
    : null;
  
  return (
    <>
      <div className="bg-white p-6 border rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Bidding</h2>
        
        <div className="mb-4">
          <p className="text-sm mb-1">Starting Price:</p>
          <p className="text-2xl font-bold">${artwork.startingPrice?.toFixed(2) || '0.00'}</p>
        </div>
        
        {artwork.currentBid && (
          <div className="mb-4">
            <p className="text-sm mb-1 text-green-600">Current Bid:</p>
            <p className="text-2xl font-bold text-green-600">${artwork.currentBid.toFixed(2)}</p>
          </div>
        )}
        
        {bidEndTimeRemaining && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Bidding ends {bidEndTimeRemaining}
            </p>
          </div>
        )}
        
        <Button 
          onClick={handleBidClick}
          className="w-full bg-amber-500 hover:bg-amber-600"
        >
          <Gavel className="mr-2 h-4 w-4" />
          Place Bid
        </Button>
      </div>
      
      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place a Bid</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Bidding on: <span className="font-medium">{artwork.title}</span>
              </p>
              
              {highestBid && (
                <p className="text-sm text-gray-600 mt-1">
                  Current highest bid: <span className="font-medium">${highestBid.amount.toFixed(2)}</span>
                </p>
              )}
              
              <p className="text-sm text-gray-600 mt-1">
                Minimum bid: <span className="font-medium">${minimumBid.toFixed(2)}</span>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bid-amount">Your Bid ($)</Label>
              <Input
                id="bid-amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={minimumBid}
                step="0.01"
                placeholder="Enter bid amount"
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowBidDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBidSubmit}
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Place Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BidButton;
