
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useArtworkStore } from '../store/artworkStore';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { toast } from '../hooks/use-toast';
import { format } from 'date-fns';

interface CommentSectionProps {
  artworkId: string;
}

const CommentSection = ({ artworkId }: CommentSectionProps) => {
  const [comment, setComment] = useState('');
  const { isLoggedIn, user } = useAuthStore();
  const { addComment, getCommentsByArtwork } = useArtworkStore();
  
  const comments = getCommentsByArtwork(artworkId);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please login to comment",
        variant: "destructive",
      });
      return;
    }
    
    if (comment.trim() === '') {
      toast({
        title: "Empty Comment",
        description: "Please write something before submitting",
        variant: "destructive",
      });
      return;
    }
    
    addComment(artworkId, comment.trim());
    setComment('');
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Comments ({comments.length})</h3>
      
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave your thoughts about this artwork..."
            className="min-h-[100px]"
          />
          <Button type="submit" className="bg-art-purple hover:bg-art-purple/90">
            Post Comment
          </Button>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-700">Please log in to leave a comment</p>
        </div>
      )}
      
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 bg-gray-50 p-3 rounded-md">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-art-purple text-white">
                  {comment.user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">{comment.user.username}</div>
                  <time className="text-xs text-gray-500">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                  </time>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
