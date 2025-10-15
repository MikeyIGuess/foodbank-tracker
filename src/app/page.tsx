"use client";

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Foodbank, FilterOptions } from '@/types/foodbank';
import { mockFoodbanks } from '@/lib/mockData';
import { filterFoodbanks, calculateDistance } from '@/lib/utils/foodbankUtils';
import LocationSearch from '@/components/LocationSearch';
import FilterPanel from '@/components/FilterPanel';
import FoodbankCard from '@/components/FoodbankCard';
import SkipToContent from '@/components/SkipToContent';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, MapIcon, List } from 'lucide-react';

// Dynamically import map to avoid SSR issues with Leaflet
const FoodbankMap = dynamic(() => import('@/components/FoodbankMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] rounded-lg bg-muted animate-pulse flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string }>();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedFoodbankId, setSelectedFoodbankId] = useState<string>();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort foodbanks
  const filteredFoodbanks = useMemo(() => {
    return filterFoodbanks(
      mockFoodbanks,
      filters,
      userLocation?.lat,
      userLocation?.lng
    );
  }, [filters, userLocation]);

  // Calculate distances
  const foodbanksWithDistance = useMemo(() => {
    if (!userLocation) return filteredFoodbanks;
    
    return filteredFoodbanks.map((fb) => ({
      ...fb,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        fb.lat,
        fb.lng
      ),
    }));
  }, [filteredFoodbanks, userLocation]);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setUserLocation({ lat, lng, address });
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <>
      <SkipToContent />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card" role="banner">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Foodbank Finder</h1>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block space-y-6" role="complementary" aria-label="Search and filters">
              <div>
                <h2 className="text-lg font-semibold mb-3">Find Foodbanks</h2>
                <LocationSearch onLocationSelect={handleLocationSelect} />
              </div>
              
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                onReset={handleResetFilters}
              />
            </aside>

            {/* Mobile Controls */}
            <div className="lg:hidden space-y-4">
              <LocationSearch onLocationSelect={handleLocationSelect} />
              
              <div className="flex gap-2">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[320px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterPanel
                        filters={filters}
                        onFiltersChange={setFilters}
                        onReset={handleResetFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex rounded-lg border bg-card p-1" role="group" aria-label="View mode">
                  <Button
                    variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    aria-label="Map view"
                    aria-pressed={viewMode === 'map'}
                  >
                    <MapIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-4">
              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
                  {filteredFoodbanks.length} foodbank{filteredFoodbanks.length !== 1 ? 's' : ''} found
                  {userLocation && ` near ${userLocation.address}`}
                </p>
                
                {/* Desktop View Toggle */}
                <div className="hidden lg:flex rounded-lg border bg-card p-1" role="group" aria-label="View mode">
                  <Button
                    variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    aria-label="Map view"
                    aria-pressed={viewMode === 'map'}
                  >
                    <MapIcon className="w-4 h-4 mr-2" />
                    Map
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <List className="w-4 h-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>

              {/* Map or List View */}
              {viewMode === 'map' ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="h-[600px] rounded-lg overflow-hidden border">
                    <FoodbankMap
                      foodbanks={filteredFoodbanks}
                      userLocation={userLocation}
                      selectedId={selectedFoodbankId}
                      onSelectFoodbank={setSelectedFoodbankId}
                    />
                  </div>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2" role="list" aria-label="Foodbank results">
                    {foodbanksWithDistance.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>No foodbanks match your filters.</p>
                        <Button
                          variant="link"
                          onClick={handleResetFilters}
                          className="mt-2"
                        >
                          Clear filters
                        </Button>
                      </div>
                    ) : (
                      foodbanksWithDistance.map((foodbank) => (
                        <div key={foodbank.id} role="listitem">
                          <FoodbankCard
                            foodbank={foodbank}
                            distance={foodbank.distance}
                            isSelected={foodbank.id === selectedFoodbankId}
                            onSelect={() => setSelectedFoodbankId(foodbank.id)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4" role="list" aria-label="Foodbank results">
                  {foodbanksWithDistance.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No foodbanks match your filters.</p>
                      <Button
                        variant="link"
                        onClick={handleResetFilters}
                        className="mt-2"
                      >
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    foodbanksWithDistance.map((foodbank) => (
                      <div key={foodbank.id} role="listitem">
                        <FoodbankCard
                          foodbank={foodbank}
                          distance={foodbank.distance}
                          isSelected={foodbank.id === selectedFoodbankId}
                          onSelect={() => setSelectedFoodbankId(foodbank.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-12 py-6" role="contentinfo">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2024 Foodbank Finder. Helping communities find food assistance.</p>
          </div>
        </footer>
      </div>
    </>
  );
}