import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tour } from '@/data/tours';
import { 
  Clock, 
  Users, 
  Weight, 
  Plane, 
  Ambulance, 
  ExternalLink,
  Scale,
  X,
  Plus
} from 'lucide-react';

interface FlightComparisonProps {
  tours: Tour[];
  selectedTours?: Tour[];
  onSelectionChange?: (tours: Tour[]) => void;
}

export const FlightComparison = ({ tours, selectedTours = [], onSelectionChange }: FlightComparisonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [compareList, setCompareList] = useState<Tour[]>(selectedTours);

  const addToComparison = (tour: Tour) => {
    if (compareList.length < 3 && !compareList.find(t => t.id === tour.id)) {
      const newList = [...compareList, tour];
      setCompareList(newList);
      onSelectionChange?.(newList);
    }
  };

  const removeFromComparison = (tourId: string) => {
    const newList = compareList.filter(t => t.id !== tourId);
    setCompareList(newList);
    onSelectionChange?.(newList);
  };

  const clearComparison = () => {
    setCompareList([]);
    onSelectionChange?.([]);
  };

  const getRouteColorStyle = (color: string) => {
    switch (color) {
      case 'yellow':
        return { backgroundColor: '#facc15', color: '#000', borderColor: '#eab308' };
      case 'orange':
        return { backgroundColor: '#fb923c', color: '#fff', borderColor: '#ea580c' };
      case 'blue':
        return { backgroundColor: '#60a5fa', color: '#fff', borderColor: '#3b82f6' };
      case 'purple':
        return { backgroundColor: '#a78bfa', color: '#fff', borderColor: '#8b5cf6' };
      case 'red':
        return { backgroundColor: '#f87171', color: '#fff', borderColor: '#ef4444' };
      case 'green':
        return { backgroundColor: '#4ade80', color: '#fff', borderColor: '#22c55e' };
      case 'gray':
        return { backgroundColor: '#9ca3af', color: '#fff', borderColor: '#6b7280' };
      default:
        return { backgroundColor: '#9ca3af', color: '#fff', borderColor: '#6b7280' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Tour Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tours.map((tour) => (
          <Card key={tour.id} className="relative hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tour.type === 'helicopter' ? (
                    <Ambulance className="w-5 h-5 text-ocean-blue" />
                  ) : (
                    <Plane className="w-5 h-5 text-ocean-blue" />
                  )}
                  <CardTitle className="text-lg">{tour.name}</CardTitle>
                </div>
                <Checkbox
                  checked={compareList.some(t => t.id === tour.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addToComparison(tour);
                    } else {
                      removeFromComparison(tour.id);
                    }
                  }}
                  disabled={compareList.length >= 3 && !compareList.some(t => t.id === tour.id)}
                />
              </div>
              {tour.routeColor && (
                <Badge 
                  className="text-xs font-bold border-2 w-fit"
                  style={getRouteColorStyle(tour.routeColor)}
                >
                  {tour.routeColor.toUpperCase()} ROUTE
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{tour.minPassengers}-{tour.maxPassengers} passengers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-gray-500" />
                  <span>{tour.maxWeight} lbs max</span>
                </div>
                <div className="text-lg font-semibold text-ocean-blue mt-2">
                  ${tour.price}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compare Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-ocean-blue hover:bg-blue-600 text-white shadow-lg"
              >
                <Scale className="w-5 h-5 mr-2" />
                Compare Tours ({compareList.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold">Flight Comparison</DialogTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearComparison}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                </div>
              </DialogHeader>

              {/* Comparison Table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {compareList.map((tour) => (
                  <Card key={tour.id} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                      onClick={() => removeFromComparison(tour.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        {tour.type === 'helicopter' ? (
                          <Ambulance className="w-5 h-5 text-ocean-blue" />
                        ) : (
                          <Plane className="w-5 h-5 text-ocean-blue" />
                        )}
                        <CardTitle className="text-lg">{tour.name}</CardTitle>
                      </div>
                      {tour.routeColor && (
                        <Badge 
                          className="text-xs font-bold border-2 w-fit"
                          style={getRouteColorStyle(tour.routeColor)}
                        >
                          {tour.routeColor.toUpperCase()} ROUTE
                        </Badge>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Tour Image */}
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <img
                          src={tour.image}
                          alt={tour.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Duration</span>
                            <span className="font-medium">{tour.duration}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Price</span>
                            <span className="font-bold text-lg text-ocean-blue">${tour.price}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Aircraft</span>
                            <span className="font-medium capitalize">{tour.type}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Passengers</span>
                            <span className="font-medium">{tour.minPassengers}-{tour.maxPassengers}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Weight Limit</span>
                            <span className="font-medium">{tour.maxWeight} lbs</span>
                          </div>
                        </div>

                        {/* Features */}
                        <div>
                          <h4 className="font-semibold mb-2">Features</h4>
                          <ul className="text-sm space-y-1">
                            {tour.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500 text-xs">✓</span>
                                <span className="text-gray-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-sm text-gray-600">{tour.description}</p>
                        </div>

                        {/* Book Button */}
                        <Button
                          onClick={() => window.open(tour.bookingUrl, '_blank')}
                          className="w-full bg-ocean-blue hover:bg-blue-600 text-white"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Book This Tour
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add More Tours Placeholder */}
                {compareList.length < 3 && (
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
                      <Plus className="w-12 h-12 mb-4" />
                      <p className="text-center">
                        Add up to {3 - compareList.length} more tour{3 - compareList.length !== 1 ? 's' : ''} to compare
                      </p>
                      <p className="text-sm text-center mt-2">
                        Select tours from the list above
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Summary Comparison */}
              {compareList.length > 1 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Quick Comparison</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Lowest Price:</span>
                      <div className="font-bold text-green-600">
                        ${Math.min(...compareList.map(t => t.price))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Longest Duration:</span>
                      <div className="font-bold">
                        {compareList.reduce((max, tour) => {
                          const minutes = parseInt(tour.duration.split(' ')[0]);
                          const maxMinutes = parseInt(max.split(' ')[0]);
                          return minutes > maxMinutes ? tour.duration : max;
                        }, '0 minutes')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Passengers:</span>
                      <div className="font-bold">
                        {Math.max(...compareList.map(t => t.maxPassengers))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Aircraft Types:</span>
                      <div className="font-bold">
                        {[...new Set(compareList.map(t => t.type))].join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};