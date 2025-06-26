import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button } from '@/components/ui/button.jsx'
import { MapPin, Locate, X } from 'lucide-react'

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicHRyYWRlczY5IiwiYSI6ImNtYmN0NmszNjFzbGYybXMxbWVqNnE4dXMifQ.GFqon86ldO4ztORiOg4WsA'

const Map = ({ isOpen, onClose, onLocationSelect }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(-2.2426)
  const [lat, setLat] = useState(53.4808)
  const [zoom, setZoom] = useState(6)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    if (!isOpen || map.current) return // Initialize map only once and when open

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Google Earth style
      center: [lng, lat],
      zoom: zoom,
      pitch: 45, // 3D tilt for Google Earth effect
      bearing: 0
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    // Update coordinates on move
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })

    // Handle map clicks
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat
      
      // Add marker at clicked location
      new mapboxgl.Marker({
        color: '#FFD700' // More vibrant yellow color to match theme
      })
        .setLngLat([lng, lat])
        .addTo(map.current)

      // Call callback with selected location
      if (onLocationSelect) {
        onLocationSelect({ lng, lat })
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [isOpen])

  // Function to get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          setUserLocation({ lng: longitude, lat: latitude })
          
          if (map.current) {
            // Fly to user location with Google Earth style animation
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 16,
              pitch: 60,
              bearing: 0,
              essential: true,
              duration: 3000 // 3 second animation
            })

            // Add marker at user location
            new mapboxgl.Marker({
              color: '#ef4444' // Red color for user location
            })
              .setLngLat([longitude, latitude])
              .addTo(map.current)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please ensure location services are enabled.')
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  // Function to search for a location
  const searchLocation = async (query) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=GB&limit=1`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center
        
        if (map.current) {
          // Fly to searched location
          map.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            pitch: 45,
            essential: true,
            duration: 2000
          })

          // Add marker at searched location
          new mapboxgl.Marker({
            color: '#FFD700'
          })
            .setLngLat([lng, lat])
            .addTo(map.current)
        }
      }
    } catch (error) {
      console.error('Error searching location:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-yellow-400" />
            Select Location
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={getUserLocation}
              className="bg-yellow-400 text-black hover:bg-yellow-400"
              size="sm"
            >
              <Locate className="h-4 w-4 mr-1" />
              My Location
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Map Info Overlay */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>

          {/* Instructions Overlay */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-3 rounded shadow-lg max-w-xs">
            <p className="text-sm text-gray-700">
              <strong>Click anywhere</strong> on the map to select a location, or use the "My Location" button to zoom to your current position.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Click on the map to place a marker and select a location
            </p>
            <Button onClick={onClose} className="bg-yellow-400 text-black hover:bg-yellow-400">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Map

