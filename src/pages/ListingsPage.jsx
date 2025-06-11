import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ListingCard from '@/components/ListingCard';

const ListingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const allListings = [
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
    {
      id: '5',
      title: 'Bathroom Suite - Complete',
      price: 8.00,
      location: 'Glasgow, UK',
      imageUrl: 'https://images.pexels.com/photos/26886816/pexels-photo-26886816.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
    {
      id: '6',
      title: 'Roofing Tiles - Clay',
      price: 3.00,
      location: 'Liverpool, UK',
      imageUrl: 'https://images.pexels.com/photos/3621348/pexels-photo-3621348.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
    {
      id: '7',
      title: 'Assorted Lumber - Scrap',
      price: 2.00,
      location: 'Bristol, UK',
      imageUrl: 'https://images.pexels.com/photos/923167/pexels-photo-923167.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
    {
      id: '8',
      title: 'Insulation Rolls - Partial',
      price: 4.00,
      location: 'Sheffield, UK',
      imageUrl: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
    {
      id: '9',
      title: 'Drywall Sheets - Damaged',
      price: 0.50,
      location: 'Newcastle, UK',
      imageUrl: 'https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
    {
      id: '10',
      title: 'Assorted Plumbing Pipes',
      price: 1.00,
      location: 'Cardiff, UK',
      imageUrl: 'https://images.pexels.com/photos/32489252/pexels-photo-32489252.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
  ];

  const filteredListings = allListings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || listing.category === category;
    const matchesPrice = priceRange === 'all' || 
                         (priceRange === '0-10' && listing.price <= 10) ||
                         (priceRange === '10-50' && listing.price > 10 && listing.price <= 50) ||
                         (priceRange === '50+' && listing.price > 50);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Browse All Listings</h1>

      {/* Filters */}
      <div className="bg-card p-6 rounded-lg shadow-lg mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <Input
          type="text"
          placeholder="Search by title..."
          className="w-full md:w-1/3 bg-background border-border text-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger className="w-full md:w-1/3 bg-background border-border text-foreground">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-card text-foreground">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="building-materials">Building Materials</SelectItem>
            <SelectItem value="tools-equipment">Tools & Equipment</SelectItem>
            <SelectItem value="kitchen-bathroom">Kitchen & Bathroom</SelectItem>
            <SelectItem value="roofing">Roofing</SelectItem>
            <SelectItem value="insulation">Insulation</SelectItem>
            <SelectItem value="drywall">Drywall</SelectItem>
            <SelectItem value="plumbing">Plumbing</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setPriceRange} value={priceRange}>
          <SelectTrigger className="w-full md:w-1/3 bg-background border-border text-foreground">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent className="bg-card text-foreground">
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-10">£0 - £10</SelectItem>
            <SelectItem value="10-50">£10 - £50</SelectItem>
            <SelectItem value="50+">£50+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No listings found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;


