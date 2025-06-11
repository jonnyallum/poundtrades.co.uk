import React from 'react';
import { Link } from 'react-router-dom';
import { PoundSterling, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-8 px-6 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <PoundSterling className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">PoundTrades</span>
          </Link>
          <p className="text-muted-foreground text-sm">
            Turn leftover building materials into cash! The UK's premier online marketplace for surplus construction materials.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/listings" className="text-muted-foreground hover:text-primary">Browse Listings</Link></li>
            <li><Link to="/how-it-works" className="text-muted-foreground hover:text-primary">How It Works</Link></li>
            <li><Link to="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
            <li><Link to="/safety-guidelines" className="text-muted-foreground hover:text-primary">Safety Guidelines</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Categories</h3>
          <ul className="space-y-2">
            <li><Link to="/category/building-materials" className="text-muted-foreground hover:text-primary">Building Materials</Link></li>
            <li><Link to="/category/tools-equipment" className="text-muted-foreground hover:text-primary">Tools & Equipment</Link></li>
            <li><Link to="/category/doors-windows" className="text-muted-foreground hover:text-primary">Doors & Windows</Link></li>
            <li><Link to="/category/plumbing-heating" className="text-muted-foreground hover:text-primary">Plumbing & Heating</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Contact Us</h3>
          <ul className="space-y-2">
            <li className="text-muted-foreground">Email: hello@poundtrades.co.uk</li>
            <li className="text-muted-foreground">Phone: 0800 123 4567</li>
            <li className="text-muted-foreground">Location: London, United Kingdom</li>
          </ul>
          <ul className="space-y-2">
            <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            <li><Link to="/cookie-policy" className="text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-muted-foreground text-sm mt-8">
        © 2024 PoundTrades. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;


