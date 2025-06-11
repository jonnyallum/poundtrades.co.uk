import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Package, Lock, Users } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import AdvertisementBanner from '@/components/AdvertisementBanner';
import CategoryGrid from '@/components/CategoryGrid';

const HomePage = () => {
  const featuredListings = [
    {
      id: '1',
      title: 'Premium Oak Flooring - Unused',
      price: 15.00,
      location: 'London, UK',
      imageUrl: 'https://images.pexels.com/photos/6692131/pexels-photo-6692131.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
    {
      id: '2',
      title: 'Professional Power Tools Set',
      price: 10.00,
      location: 'Manchester, UK',
      imageUrl: 'https://images.pexels.com/photos/162534/grinder-hitachi-power-tool-flexible-162534.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
    {
      id: '3',
      title: 'Reclaimed Brick Collection',
      price: 5.00,
      location: 'Birmingham, UK',
      imageUrl: 'https://images.pexels.com/photos/23940504/pexels-photo-23940504.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
    {
      id: '4',
      title: 'Kitchen Units - Modern Style',
      price: 20.00,
      location: 'Leeds, UK',
      imageUrl: 'https://images.pexels.com/photos/8186517/pexels-photo-8186517.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-20 bg-card rounded-lg shadow-lg mb-12">
        <h1 className="text-5xl font-bold text-primary mb-4">
          Turn Leftover Building Materials Into Cash!
        </h1>
        <p className="text-xl text-foreground mb-8">
          The UK's premier marketplace for surplus construction materials. Buy and sell quality building supplies at unbeatable prices.
        </p>
        <div className="flex justify-center items-center space-x-4 mb-8">
          <Input
            type="text"
            placeholder="Search for materials, tools, or equipment..."
            className="w-full max-w-md bg-background border-border text-foreground"
          />
          <Button className="btn-primary">
            <Search className="h-5 w-5 mr-2" /> Search
          </Button>
        </div>
        <div className="flex justify-center items-center space-x-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Showing results near London, UK</span>
          <Button variant="link" className="text-primary">Change location</Button>
        </div>
      </section>

      {/* Call to Action Buttons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-card p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Browse Listings</h2>
          <p className="text-muted-foreground mb-6">Find exactly what you need from a wide range of surplus materials.</p>
          <Link to="/listings">
            <Button className="btn-primary">Browse Listings</Button>
          </Link>
        </div>
        <div className="bg-card p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Start Selling</h2>
          <p className="text-muted-foreground mb-6">Turn your excess materials into profit. Easy and hassle-free.</p>
          <Link to="/dashboard">
            <Button className="btn-primary">Start Selling</Button>
          </Link>
        </div>
      </section>

      {/* Why Choose PoundTrades? */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold text-center text-foreground mb-8">Why Choose PoundTrades?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-lg text-center">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Quality Materials</h3>
            <p className="text-muted-foreground">All listings are verified for quality and authenticity</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg text-center">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Secure Payments</h3>
            <p className="text-muted-foreground">Only £1 to unlock contact details - no hidden fees</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Trusted Community</h3>
            <p className="text-muted-foreground">Connect with verified tradespeople and businesses</p>
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold text-center text-foreground mb-8">Featured Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdvertisementBanner
            companyName="Howdens"
            title="Professional Kitchen & Joinery Solutions"
            description="Trade-only supplier of kitchens, joinery, and hardware."
            imageUrl="https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg"
            websiteUrl="https://www.howdens.com"
          />
          <AdvertisementBanner
            companyName="Jewson"
            title="Building Materials & Timber Specialists"
            description="Leading supplier of building materials, timber, and construction supplies."
            imageUrl="https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg"
            websiteUrl="https://www.jewson.co.uk"
          />
          <AdvertisementBanner
            companyName="B&Q"
            title="Home Improvement & DIY Superstore"
            description="Everything you need for home improvement, DIY projects, and garden makeovers."
            imageUrl="https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg"
            websiteUrl="https://www.diy.com"
          />
        </div>
      </section>

      {/* Featured Listings */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold text-center text-foreground mb-8">Featured Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/listings">
            <Button className="btn-primary">View All Listings</Button>
          </Link>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold text-center text-foreground mb-8">Browse by Category</h2>
        <CategoryGrid />
      </section>
    </div>
  );
};

export default HomePage;


