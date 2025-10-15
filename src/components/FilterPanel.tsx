"use client";

import { FilterOptions } from '@/types/foodbank';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export default function FilterPanel({ filters, onFiltersChange, onReset }: FilterPanelProps) {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const updateServiceFilter = (service: string, value: boolean) => {
    onFiltersChange({
      ...filters,
      services: {
        ...filters.services,
        [service]: value,
      },
    });
  };

  const hasActiveFilters = 
    filters.openNow ||
    filters.dayOfWeek ||
    filters.incomeRequirement !== undefined ||
    filters.idRequired !== undefined ||
    filters.residencyRequired !== undefined ||
    Object.values(filters.services || {}).some(v => v === true);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              aria-label="Clear all filters"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hours Filters */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Hours</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="open-now" className="text-sm font-normal">
              Open Now
            </Label>
            <Switch
              id="open-now"
              checked={filters.openNow || false}
              onCheckedChange={(checked) => updateFilter('openNow', checked || undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="day-select" className="text-sm">
              Day of Week
            </Label>
            <Select
              value={filters.dayOfWeek || 'any'}
              onValueChange={(value) => updateFilter('dayOfWeek', value === 'any' ? undefined : value)}
            >
              <SelectTrigger id="day-select" aria-label="Select day of week">
                <SelectValue placeholder="Any day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any day</SelectItem>
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Tuesday">Tuesday</SelectItem>
                <SelectItem value="Wednesday">Wednesday</SelectItem>
                <SelectItem value="Thursday">Thursday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Saturday">Saturday</SelectItem>
                <SelectItem value="Sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Requirements Filters */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Requirements</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="no-id" className="text-sm font-normal">
              No ID Required
            </Label>
            <Switch
              id="no-id"
              checked={filters.idRequired === false}
              onCheckedChange={(checked) => updateFilter('idRequired', checked ? false : undefined)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="no-income" className="text-sm font-normal">
              No Income Verification
            </Label>
            <Switch
              id="no-income"
              checked={filters.incomeRequirement === false}
              onCheckedChange={(checked) => updateFilter('incomeRequirement', checked ? false : undefined)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="no-residency" className="text-sm font-normal">
              No Residency Required
            </Label>
            <Switch
              id="no-residency"
              checked={filters.residencyRequired === false}
              onCheckedChange={(checked) => updateFilter('residencyRequired', checked ? false : undefined)}
            />
          </div>
        </div>

        {/* Services Filters */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Services Offered</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="fresh-produce" className="text-sm font-normal">
              Fresh Produce
            </Label>
            <Switch
              id="fresh-produce"
              checked={filters.services?.freshProduce || false}
              onCheckedChange={(checked) => updateServiceFilter('freshProduce', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="prepared-meals" className="text-sm font-normal">
              Prepared Meals
            </Label>
            <Switch
              id="prepared-meals"
              checked={filters.services?.preparedMeals || false}
              onCheckedChange={(checked) => updateServiceFilter('preparedMeals', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="diapers" className="text-sm font-normal">
              Diapers
            </Label>
            <Switch
              id="diapers"
              checked={filters.services?.diapers || false}
              onCheckedChange={(checked) => updateServiceFilter('diapers', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="halal" className="text-sm font-normal">
              Halal
            </Label>
            <Switch
              id="halal"
              checked={filters.services?.halal || false}
              onCheckedChange={(checked) => updateServiceFilter('halal', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="kosher" className="text-sm font-normal">
              Kosher
            </Label>
            <Switch
              id="kosher"
              checked={filters.services?.kosher || false}
              onCheckedChange={(checked) => updateServiceFilter('kosher', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}