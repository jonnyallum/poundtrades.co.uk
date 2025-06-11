import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PoundSterling, Search, MapPin, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Implement search logic here
  };

  return (
    <header className="bg-background border-b border-border py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2">
          <PoundSterling className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">PoundTrades</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/listings" className="text-muted-foreground hover:text-primary transition-colors">
            Browse Listings
          </Link>
          <Link to="/map" className="text-muted-foreground hover:text-primary transition-colors">
            Map View
          </Link>
          <Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 bg-card border-border text-foreground"
          />
          <Button variant="ghost" size="icon" onClick={handleSearch}>
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
        <Button variant="ghost" className="hidden md:flex items-center space-x-2 text-muted-foreground hover:text-primary">
          <MapPin className="h-5 w-5" />
          <span>Near me</span>
        </Button>
        <Link to="/login" className="hidden md:flex items-center space-x-2 text-muted-foreground hover:text-primary">
          <User className="h-5 w-5" />
          <span>Login</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-l border-border w-64">
            <div className="flex flex-col items-start space-y-4 py-6">
              <Link to="/listings" className="text-foreground hover:text-primary transition-colors text-lg">
                Browse Listings
              </Link>
              <Link to="/map" className="text-foreground hover:text-primary transition-colors text-lg">
                Map View
              </Link>
              <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors text-lg">
                How It Works
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors text-lg">
                About
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors text-lg">
                Contact
              </Link>
              <div className="w-full border-t border-border my-4"></div>
              <Link to="/login" className="flex items-center space-x-2 text-foreground hover:text-primary text-lg">
                <User className="h-6 w-6" />
                <span>Login</span>
              </Link>
              <div className="flex items-center space-x-2 w-full">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow bg-card border-border text-foreground"
                />
                <Button variant="ghost" size="icon" onClick={handleSearch}>
                  <Search className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;


