import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Mock data for users and listings
  const users = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'customer', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'customer', status: 'active' },
    { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
  ];

  const listings = [
    { id: '1', title: 'Oak Flooring', seller: 'John Doe', status: 'green', reported: false },
    { id: '2', title: 'Power Tools', seller: 'Jane Smith', status: 'amber', reported: false },
    { id: '3', title: 'Brick Collection', seller: 'Admin User', status: 'red', reported: true },
  ];

  const handleUserStatusChange = (userId, newStatus) => {
    console.log(`User ${userId} status changed to ${newStatus}`);
    // Implement logic to update user status in Supabase
  };

  const handleListingStatusChange = (listingId, newStatus) => {
    console.log(`Listing ${listingId} status changed to ${newStatus}`);
    // Implement logic to update listing status in Supabase
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card text-foreground">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="listings">Listing Moderation</TabsTrigger>
          <TabsTrigger value="settings">Platform Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card className="bg-card text-foreground shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-md">
                    <div>
                      <p className="font-semibold text-foreground">{user.name} ({user.role})</p>
                      <p className="text-muted-foreground text-sm">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select onValueChange={(value) => handleUserStatusChange(user.id, value)} defaultValue={user.status}>
                        <SelectTrigger className="w-[180px] bg-background border-border text-foreground">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-card text-foreground">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="destructive">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="mt-6">
          <Card className="bg-card text-foreground shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Listing Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-4 border border-border rounded-md">
                    <div>
                      <p className="font-semibold text-foreground">{listing.title} (Seller: {listing.seller})</p>
                      <p className="text-muted-foreground text-sm">Status: {listing.status} {listing.reported && 
                        <span className="text-red-500 font-bold">(Reported)</span>}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select onValueChange={(value) => handleListingStatusChange(listing.id, value)} defaultValue={listing.status}>
                        <SelectTrigger className="w-[180px] bg-background border-border text-foreground">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-card text-foreground">
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="amber">Amber</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="removed">Removed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="bg-card text-foreground shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                <Input id="commission-rate" type="number" defaultValue={5} className="bg-background border-border text-foreground" />
              </div>
              <div>
                <Label htmlFor="contact-unlock-fee">Contact Unlock Fee (£)</Label>
                <Input id="contact-unlock-fee" type="number" defaultValue={1} className="bg-background border-border text-foreground" />
              </div>
              <Button className="btn-primary">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;


