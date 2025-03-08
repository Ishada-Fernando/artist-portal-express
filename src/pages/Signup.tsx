
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';
import { UserRole } from '../types';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simple validation
      if (!username || !email || !password || !confirmPassword) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Error",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Attempt signup
      const result = signup(username, email, password, role);
      
      if (result.success) {
        toast({
          title: "Welcome!",
          description: result.message,
        });
        navigate('/');
      } else {
        toast({
          title: "Signup Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Account Type
                </label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(value) => setRole(value as UserRole)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="artist" id="artist" />
                    <Label htmlFor="artist">Artist - I want to showcase my artwork</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="member" id="member" />
                    <Label htmlFor="member">Member - I want to browse and interact with artwork</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-art-purple hover:bg-art-purple/90" 
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-art-purple hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
