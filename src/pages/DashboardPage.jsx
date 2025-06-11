import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ListingCard from '@/components/ListingCard';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('my-listings');
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    imageUrl: '',
  });

  // Mock data for user listings and favorites
  const userListings = [
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
      status: 'amber',
    },
  ];

  const favoriteListings = [
    {
      id: '3',
      title: 'Reclaimed Brick Collection',
      price: 5.00,
      location: 'Birmingham, UK',
      imageUrl: 'https://images.pexels.com/photos/23940504/pexels-photo-23940504.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
    },
  ];

  const handleNewListingChange = (e) => {
    const { id, value } = e.target;
    setNewListing((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddListing = (e) => {
    e.preventDefault();
    console.log('Adding new listing:', newListing);
    // Implement logic to add listing to Supabase
    setNewListing({
      title: '',
      description: '',
      price: '',
      location: '',
      imageUrl: '',
    });
    setActiveTab('my-listings');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-foreground mb-8 text-center">My Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card text-foreground">
          <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          <TabsTrigger value="add-listing">Add New Listing</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="my-listings" className="mt-6">
          <Card className="bg-card text-foreground shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Your Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {userListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">You have no active listings. Why not add one?</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-listing" className="mt-6">
          <Card className="bg-card text-foreground shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Add New Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddListing} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={newListing.title} onChange={handleNewListingChange} required className="bg-background border-border text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (£)</Label>
                    <Input id="price" type="number" value={newListing.price} onChange={handleNewListingChange} required className="bg-background border-border text-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={newListing.description} onChange={handleNewListingChange} required className="bg-background border-border text-foreground" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={newListing.location} onChange={handleNewListingChange} required className="bg-background border-border text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" value={newListing.imageUrl} onChange={handleNewListingChange} required className="bg-background border-border text-foreground" />
                  </div>
                </div>
                <Button type="submit" className="btn-primary">Add Listing</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <Card className="bg-card text-foreground shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Your Favorite Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">You haven't favorited any listings yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;


