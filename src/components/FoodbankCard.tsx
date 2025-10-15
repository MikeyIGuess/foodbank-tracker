"use client";

import { Foodbank } from '@/types/foodbank';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatAddress, isOpenNow } from '@/lib/utils/foodbankUtils';

interface FoodbankCardProps {
  foodbank: Foodbank;
  distance?: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function FoodbankCard({
  foodbank,
  distance,
  isSelected,
  onSelect,
}: FoodbankCardProps) {
  const openNow = isOpenNow(foodbank.hours);

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-label={`${foodbank.name}, score ${foodbank.score || 'N/A'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.();
        }
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{foodbank.name}</CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            {foodbank.score !== undefined && (
              <Badge
                variant={foodbank.score >= 90 ? 'default' : 'secondary'}
                className="font-bold"
              >
                {foodbank.score}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div>
            <p>{foodbank.address}</p>
            <p className="text-muted-foreground">
              {foodbank.city}, {foodbank.state} {foodbank.zipCode}
            </p>
            {distance !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                {distance.toFixed(1)} miles away
              </p>
            )}
          </div>
        </div>

        {foodbank.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 shrink-0 text-muted-foreground" />
            <a
              href={`tel:${foodbank.phone}`}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {foodbank.phone}
            </a>
          </div>
        )}

        <div className="flex items-start gap-2 text-sm">
          <Clock className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {openNow ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Open Now
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Closed
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {foodbank.hours.length} days/week
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {foodbank.services.freshProduce && (
            <Badge variant="outline" className="text-xs">
              Fresh Produce
            </Badge>
          )}
          {foodbank.services.preparedMeals && (
            <Badge variant="outline" className="text-xs">
              Prepared Meals
            </Badge>
          )}
          {foodbank.services.diapers && (
            <Badge variant="outline" className="text-xs">
              Diapers
            </Badge>
          )}
          {foodbank.services.halal && (
            <Badge variant="outline" className="text-xs">
              Halal
            </Badge>
          )}
          {foodbank.services.kosher && (
            <Badge variant="outline" className="text-xs">
              Kosher
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            asChild
            variant="default"
            size="sm"
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/foodbank/${foodbank.id}`}>View Details</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                formatAddress(foodbank)
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get directions"
            >
              <MapPin className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {foodbank.isVerified && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            Verified {new Date(foodbank.lastVerified).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}