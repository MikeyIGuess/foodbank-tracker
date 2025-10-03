"use client";

import { useParams, useRouter } from 'next/navigation';
import { mockFoodbanks } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  Users,
  ArrowLeft,
  Navigation,
} from 'lucide-react';
import Link from 'next/link';
import { formatAddress, getDirectionsUrl, isOpenNow } from '@/lib/utils/foodbankUtils';

export default function FoodbankDetailPage() {
  const params = useParams();
  const router = useRouter();
  const foodbank = mockFoodbanks.find((fb) => fb.id === params.id);

  if (!foodbank) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Foodbank Not Found</h1>
          <p className="text-muted-foreground">
            The foodbank you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const openNow = isOpenNow(foodbank.hours);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold">Foodbank Details</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Title and Score */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{foodbank.name}</h2>
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
            {foodbank.score !== undefined && (
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {foodbank.score}
                </div>
                <div className="text-sm text-muted-foreground">Match Score</div>
              </div>
            )}
          </div>

          {/* Verification Status */}
          {foodbank.isVerified && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>
                Verified on {new Date(foodbank.lastVerified).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="flex-1 sm:flex-none">
              <a
                href={getDirectionsUrl(foodbank)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </a>
            </Button>
            {foodbank.phone && (
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${foodbank.phone}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
              </Button>
            )}
            {foodbank.website && (
              <Button asChild variant="outline" size="lg">
                <a href={foodbank.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </a>
              </Button>
            )}
          </div>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{foodbank.address}</p>
              <p className="text-muted-foreground">
                {foodbank.city}, {foodbank.state} {foodbank.zipCode}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {foodbank.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${foodbank.phone}`}
                    className="text-lg hover:underline"
                  >
                    {foodbank.phone}
                  </a>
                </div>
              )}
              {foodbank.website && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <a
                    href={foodbank.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:underline break-all"
                  >
                    {foodbank.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hours of Operation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {foodbank.hours.map((hour, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <span className="font-medium">{hour.day}</span>
                    <span className="text-muted-foreground">
                      {hour.open} - {hour.close}
                    </span>
                  </div>
                ))}
              </div>
              {foodbank.queueNotes && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Queue Notes
                    </p>
                    <p className="text-sm">{foodbank.queueNotes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Eligibility & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  ID Requirement
                </p>
                <Badge variant={foodbank.requirements.id ? 'secondary' : 'default'}>
                  {foodbank.requirements.id ? 'ID Required' : 'No ID Required'}
                </Badge>
              </div>

              {foodbank.requirements.income && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Income Requirement
                  </p>
                  <p>{foodbank.requirements.income}</p>
                </div>
              )}

              {foodbank.requirements.residency && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Residency Requirement
                  </p>
                  <p>{foodbank.requirements.residency}</p>
                </div>
              )}

              {foodbank.requiredDocuments && foodbank.requiredDocuments.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Required Documents
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {foodbank.requiredDocuments.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Services Offered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {foodbank.services.freshProduce && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Fresh Produce</span>
                  </div>
                )}
                {foodbank.services.preparedMeals && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Prepared Meals</span>
                  </div>
                )}
                {foodbank.services.diapers && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Diapers</span>
                  </div>
                )}
                {foodbank.services.halal && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Halal</span>
                  </div>
                )}
                {foodbank.services.kosher && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Kosher</span>
                  </div>
                )}
                {foodbank.services.other &&
                  foodbank.services.other.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Issues */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Notice incorrect information or want to add details?
                </p>
                <Button asChild variant="outline">
                  <Link href={`/submit?foodbankId=${foodbank.id}`}>
                    Submit Correction
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}