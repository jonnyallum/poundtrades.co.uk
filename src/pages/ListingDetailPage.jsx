import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, PoundSterling, User, Phone, Mail } from 'lucide-react';
import StripePaymentModal from '@/components/StripePaymentModal';

const ListingDetailPage = () => {
  const { id } = useParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [contactUnlocked, setContactUnlocked] = useState(false);

  // Mock data for a single listing (replace with actual data fetching from Supabase)
  const listing = {
    id: id,
    title: 'Premium Oak Flooring - Unused',
    description: 'Approximately 50 sq meters of premium oak flooring, still in original packaging. Perfect for a living room or bedroom renovation. High quality, durable, and easy to install. Selling due to change in renovation plans.',
    price: 1.00,
    location: 'London, UK',
    imageUrl: 'https://images.pexels.com/photos/6692131/pexels-photo-6692131.jpeg?auto=compress&cs=tinysrgb&h=350',
    status: 'green',
    seller: {
      name: 'John Doe',
      phone: '07123 456789',
      email: 'john.doe@example.com',
    },
    images: [
      'https://images.pexels.com/photos/6692131/pexels-photo-6692131.jpeg?auto=compress&cs=tinysrgb&h=350',
      'https://images.pexels.com/photos/6692132/pexels-photo-6692132.jpeg?auto=compress&cs=tinysrgb&h=350',
      'https://images.pexels.com/photos/6692133/pexels-photo-6692133.jpeg?auto=compress&cs=tinysrgb&h=350',
    ],
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'green':
        return 'traffic-light-green';
      case 'amber':
        return 'traffic-light-amber';
      case 'red':
        return 'traffic-light-red';
      default:
        return 'bg-gray-500';
    }
  };

  const handleUnlockContact = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setContactUnlocked(true);
    setShowPaymentModal(false);
    // In a real application, you would update the listing status in Supabase here
  };

  if (!listing) {
    return <div className="container mx-auto px-4 py-8 text-foreground">Listing not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-card text-foreground shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Image Gallery */}
          <div className="flex flex-col">
            <img
              src={listing.images[currentImageIndex]}
              alt={listing.title}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
            <div className="flex space-x-2 overflow-x-auto">
              {listing.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer ${index === currentImageIndex ? 'border-2 border-primary' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Listing Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-primary">{listing.title}</h1>
              <Badge className={`${getStatusColor(listing.status)} text-sm px-3 py-1 rounded-full`}>
                {listing.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">{listing.description}</p>
            <div className="flex items-center text-foreground text-2xl font-bold">
              <PoundSterling className="h-6 w-6 mr-2" />
              <span>{listing.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{listing.location}</span>
            </div>

            {/* Seller Contact Info */}
            <Card className="bg-background p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-foreground mb-3">Seller Contact</h2>
              {contactUnlocked ? (
                <div className="space-y-2">
                  <div className="flex items-center text-foreground">
                    <User className="h-5 w-5 mr-2" />
                    <span>{listing.seller.name}</span>
                  </div>
                  <div className="flex items-center text-foreground">
                    <Phone className="h-5 w-5 mr-2" />
                    <a href={`tel:${listing.seller.phone}`} className="hover:underline">{listing.seller.phone}</a>
                  </div>
                  <div className="flex items-center text-foreground">
                    <Mail className="h-5 w-5 mr-2" />
                    <a href={`mailto:${listing.seller.email}`} className="hover:underline">{listing.seller.email}</a>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Pay £1.00 to unlock seller contact details.</p>
                  <Button className="btn-primary" onClick={handleUnlockContact}>
                    <Lock className="h-5 w-5 mr-2" /> Unlock Contact for £1.00
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Card>

      {showPaymentModal && (
        <StripePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amount={1.00}
          description={`Unlock contact for ${listing.title}`}
        />
      )}
    </div>
  );
};

export default ListingDetailPage;


