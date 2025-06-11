import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, PoundSterling } from 'lucide-react';

const ListingCard = ({ listing }) => {
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

  return (
    <Link to={`/listing/${listing.id}`}>
      <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-foreground">
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-48 object-cover" />
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-foreground leading-tight">{listing.title}</h3>
            <Badge className={`${getStatusColor(listing.status)} text-xs px-2 py-1 rounded-full`}>
              {listing.status.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <PoundSterling className="h-4 w-4 mr-1" />
            <span className="font-bold text-lg text-primary">{listing.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{listing.location}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ListingCard;


