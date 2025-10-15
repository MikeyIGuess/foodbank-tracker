import { Foodbank, FilterOptions } from '@/types/foodbank';

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function isOpenNow(hours: { day: string; open: string; close: string }[]): boolean {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const todayHours = hours.find((h) => h.day === currentDay);
  if (!todayHours) return false;

  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;

  return currentTime >= openTime && currentTime <= closeTime;
}

export function isOpenOnDay(hours: { day: string; open: string; close: string }[], day: string): boolean {
  return hours.some((h) => h.day === day);
}

export function calculateScore(
  foodbank: Foodbank,
  userLat?: number,
  userLng?: number,
  filters?: FilterOptions
): number {
  let score = 100;

  // Distance factor (0-30 points)
  if (userLat && userLng) {
    const distance = calculateDistance(userLat, userLng, foodbank.lat, foodbank.lng);
    if (distance < 1) score -= 0;
    else if (distance < 3) score -= 5;
    else if (distance < 5) score -= 10;
    else if (distance < 10) score -= 20;
    else score -= 30;
  }

  // Hours match (0-20 points)
  if (filters?.openNow && !isOpenNow(foodbank.hours)) {
    score -= 20;
  }

  if (filters?.dayOfWeek && !isOpenOnDay(foodbank.hours, filters.dayOfWeek)) {
    score -= 15;
  }

  // Service fit (0-20 points)
  if (filters?.services) {
    let serviceMatches = 0;
    let totalRequested = 0;

    if (filters.services.freshProduce) {
      totalRequested++;
      if (foodbank.services.freshProduce) serviceMatches++;
    }
    if (filters.services.preparedMeals) {
      totalRequested++;
      if (foodbank.services.preparedMeals) serviceMatches++;
    }
    if (filters.services.diapers) {
      totalRequested++;
      if (foodbank.services.diapers) serviceMatches++;
    }
    if (filters.services.halal) {
      totalRequested++;
      if (foodbank.services.halal) serviceMatches++;
    }
    if (filters.services.kosher) {
      totalRequested++;
      if (foodbank.services.kosher) serviceMatches++;
    }

    if (totalRequested > 0) {
      const matchPercentage = serviceMatches / totalRequested;
      score -= Math.round((1 - matchPercentage) * 20);
    }
  }

  // Requirements (0-15 points)
  if (filters?.idRequired === false && foodbank.requirements.id) {
    score -= 10;
  }

  // Verification bonus (0-15 points)
  if (!foodbank.isVerified) {
    score -= 10;
  }

  // Recency of verification
  const lastVerifiedDate = new Date(foodbank.lastVerified);
  const daysSinceVerification = Math.floor(
    (Date.now() - lastVerifiedDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceVerification > 90) score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function filterFoodbanks(
  foodbanks: Foodbank[],
  filters: FilterOptions,
  userLat?: number,
  userLng?: number
): Foodbank[] {
  let filtered = foodbanks.filter((fb) => {
    // Open now filter
    if (filters.openNow && !isOpenNow(fb.hours)) return false;

    // Day of week filter
    if (filters.dayOfWeek && !isOpenOnDay(fb.hours, filters.dayOfWeek)) return false;

    // ID required filter
    if (filters.idRequired === false && fb.requirements.id) return false;

    // Income requirement filter
    if (filters.incomeRequirement === false && fb.requirements.income) return false;

    // Residency requirement filter
    if (filters.residencyRequired === false && fb.requirements.residency) return false;

    // Services filters
    if (filters.services) {
      if (filters.services.freshProduce && !fb.services.freshProduce) return false;
      if (filters.services.preparedMeals && !fb.services.preparedMeals) return false;
      if (filters.services.diapers && !fb.services.diapers) return false;
      if (filters.services.halal && !fb.services.halal) return false;
      if (filters.services.kosher && !fb.services.kosher) return false;
    }

    return true;
  });

  // Calculate scores
  filtered = filtered.map((fb) => ({
    ...fb,
    score: calculateScore(fb, userLat, userLng, filters),
  }));

  // Sort by score
  filtered.sort((a, b) => (b.score || 0) - (a.score || 0));

  return filtered;
}

export function formatAddress(foodbank: Foodbank): string {
  return `${foodbank.address}, ${foodbank.city}, ${foodbank.state} ${foodbank.zipCode}`;
}

export function getDirectionsUrl(foodbank: Foodbank): string {
  const address = encodeURIComponent(formatAddress(foodbank));
  return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
}