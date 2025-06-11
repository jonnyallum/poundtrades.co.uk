import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PoundSterling, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox access token

const MapboxMap = ({ listings, onListingClick }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (mapRef.current) return; // Initialize map only once

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark theme map style
      center: [-0.1278, 51.5074], // Default to London, UK
      zoom: 9,
    });

    mapRef.current.on('load', () => {
      // Add navigation control
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for listings
      listings.forEach((listing) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url('/path/to/marker-icon.png')`; // Custom marker icon
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = '100%';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([listing.longitude, listing.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 class="text-lg font-semibold">${listing.title}</h3><p>£${listing.price.toFixed(2)}</p>`
          ))
          .addTo(mapRef.current);

        el.addEventListener('click', () => onListingClick(listing));
        markersRef.current.push(marker);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [listings, onListingClick]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-lg" />;
};

const MapPage = () => {
  const [selectedListing, setSelectedListing] = useState(null);

  // Mock listings data with coordinates
  const listings = [
    {
      id: '1',
      title: 'Premium Oak Flooring',
      price: 1.00,
      location: 'London, UK',
      imageUrl: 'https://images.pexels.com/photos/6692131/pexels-photo-6692131.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
      latitude: 51.5074,
      longitude: -0.1278,
    },
    {
      id: '2',
      title: 'Professional Power Tools',
      price: 0.50,
      location: 'Manchester, UK',
      imageUrl: 'https://images.pexels.com/photos/162534/grinder-hitachi-power-tool-flexible-162534.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
      latitude: 53.4808,
      longitude: -2.2426,
    },
    {
      id: '3',
      title: 'Reclaimed Brick Collection',
      price: 0.25,
      location: 'Birmingham, UK',
      imageUrl: 'https://images.pexels.com/photos/23940504/pexels-photo-23940504.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
      latitude: 52.4862,
      longitude: -1.8904,
    },
    {
      id: '4',
      title: 'Kitchen Units - Modern Style',
      price: 2.00,
      location: 'Leeds, UK',
      imageUrl: 'https://images.pexels.com/photos/8186517/pexels-photo-8186517.jpeg?auto=compress&cs=tinysrgb&h=350',
      status: 'green',
      latitude: 53.8008,
      longitude: -1.5491,
    },
  ];

  const handleListingClick = (listing) => {
    setSelectedListing(listing);
    // Implement Google Earth-style zoom animation here
    // For now, just log the click
    console.log('Listing clicked:', listing);
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[700px] flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-2/3 h-full">
        <MapboxMap listings={listings} onListingClick={handleListingClick} />
      </div>
      <div className="w-full lg:w-1/3 h-full overflow-y-auto">
        <Card className="bg-card text-foreground shadow-lg rounded-lg p-4">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Listings Near You</h2>
            {listings.map((listing) => (
              <Link to={`/listing/${listing.id}`} key={listing.id}>
                <div className="flex items-center space-x-4 p-3 hover:bg-background rounded-md cursor-pointer transition-colors duration-200">
                  <img src={listing.imageUrl} alt={listing.title} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <h3 className="font-semibold text-foreground">{listing.title}</h3>
                    <p className="text-muted-foreground text-sm">{listing.location}</p>
                    <div className="flex items-center text-primary text-lg font-bold">
                      <PoundSterling className="h-4 w-4 mr-1" />
                      <span>{listing.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapPage;


