
import { useArtworkStore } from '../store/artworkStore';
import { format } from 'date-fns';
import { Gavel } from 'lucide-react';

interface BidHistoryProps {
  artworkId: string;
}

const BidHistory = ({ artworkId }: BidHistoryProps) => {
  const { getBidsByArtwork } = useArtworkStore();
  const bids = getBidsByArtwork(artworkId);
  
  if (bids.length === 0) {
    return (
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Bid History</h2>
        <p className="text-gray-500 text-center py-6">No bids have been placed yet</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Bid History</h2>
      
      <div className="space-y-3">
        {bids.map((bid) => (
          <div key={bid.id} className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Gavel className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">${bid.amount.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{bid.user.name || bid.user.username}</p>
            </div>
            <div className="text-xs text-gray-400">
              {format(new Date(bid.createdAt), 'MMM d, h:mm a')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidHistory;
