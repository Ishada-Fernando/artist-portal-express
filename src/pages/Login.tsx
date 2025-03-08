
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '../hooks/use-toast';
import Navbar from '../components/Navbar';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simple validation
      if (!username || !password) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }
      
      // Attempt login
      const result = login(username, password);
      
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: result.message,
        });
        navigate('/');
      } else {
        toast({
          title: "Login Failed",
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
            <CardTitle className="text-2xl text-center">Login to Your Account</CardTitle>
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
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              
              <div className="text-sm text-gray-500">
                <p>
                  Admin credentials: Username: <span className="font-mono">Admin</span>, Password: <span className="font-mono">Password123</span>
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-art-purple hover:bg-art-purple/90" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              
              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-art-purple hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
