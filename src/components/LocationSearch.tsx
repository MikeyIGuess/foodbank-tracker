"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  const geocodeAddress = async (addressText: string) => {
    try {
      setIsSearching(true);
      
      // Using Nominatim API for geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressText
        )}&limit=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        onLocationSelect(parseFloat(lat), parseFloat(lon), display_name);
        toast({
          title: 'Location found',
          description: `Searching near ${display_name}`,
        });
      } else {
        toast({
          title: 'Location not found',
          description: 'Please try a different address',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search for location',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      geocodeAddress(address.trim());
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Not supported',
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect(latitude, longitude, 'Your location');
        toast({
          title: 'Location detected',
          description: 'Showing nearby foodbanks',
        });
        setIsGettingLocation(false);
      },
      (error) => {
        let message = 'Failed to get your location';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location access denied. Please enable location services.';
        }
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter address or zip code"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1"
          aria-label="Search by address"
        />
        <Button
          type="submit"
          disabled={isSearching || !address.trim()}
          aria-label="Search location"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Search'
          )}
        </Button>
      </form>
      
      <Button
        type="button"
        variant="outline"
        onClick={handleUseMyLocation}
        disabled={isGettingLocation}
        className="w-full"
        aria-label="Use my current location"
      >
        <MapPin className="w-4 h-4 mr-2" />
        {isGettingLocation ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Getting location...
          </>
        ) : (
          'Use My Location'
        )}
      </Button>
    </div>
  );
}