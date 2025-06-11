import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      console.log('Registering:', { email, password });
      // Implement registration logic
    } else {
      console.log('Logging in:', { email, password });
      // Implement login logic
    }
    // Redirect to dashboard or home on success
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md bg-card text-foreground shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            {isRegister ? 'Register' : 'Login'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border text-foreground"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background border-border text-foreground"
              />
            </div>
            <Button type="submit" className="w-full btn-primary">
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </form>
          <p className="text-center text-muted-foreground text-sm mt-6">
            {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
            <Button variant="link" onClick={() => setIsRegister(!isRegister)} className="text-primary p-0 h-auto">
              {isRegister ? 'Login' : 'Register'}
            </Button>
          </p>
          <p className="text-center text-muted-foreground text-sm mt-4">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot Password?
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;


