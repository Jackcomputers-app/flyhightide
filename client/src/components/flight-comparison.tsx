import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tour } from '@/data/tours';
import { Check, X, Plus, Minus } from 'lucide-react';

interface FlightComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
}

export const FlightComparison = ({ isOpen, onClose, tours, onSelectTour }: FlightComparisonProps) => {
  const [selectedTours, setSelectedTours] = useState<Tour[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  const toggleTourSelection = (tour: Tour) => {
    setSelectedTours(prev => {
      const isSelected = prev.some(t => t.id === tour.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tour.id);
      } else if (prev.length < 3) {
        return [...prev, tour];
      }
      return prev;
    });
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

  const getUniqueFeatures = () => {
    const allFeatures = new Set<string>();
    tours.forEach(tour => tour.features.forEach(feature => allFeatures.add(feature)));
    return Array.from(allFeatures);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {comparisonMode && selectedTours.length > 0 ? 'Compare Flights' : 'Browse All Tours'}
          </DialogTitle>
          <div className="flex gap-2 mt-2">
            <Button
              variant={comparisonMode ? "outline" : "default"}
              onClick={() => setComparisonMode(false)}
              className="text-sm"
            >
              Browse Tours
            </Button>
            <Button
              variant={comparisonMode ? "default" : "outline"}
              onClick={() => setComparisonMode(true)}
              disabled={selectedTours.length === 0}
              className="text-sm"
            >
              Compare Selected ({selectedTours.length})
            </Button>
          </div>
        </DialogHeader>

        {!comparisonMode ? (
          // Browse Mode
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tours.map((tour) => {
              const isSelected = selectedTours.some(t => t.id === tour.id);
              return (
                <Card key={tour.id} className={`relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{tour.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{tour.location.replace('-', ' ')}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-xl font-bold text-ocean-blue">${tour.price}</div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {tour.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {tour.duration}
                      </Badge>
                      {tour.routeColor && (
                        <Badge 
                          variant="outline" 
                          className="text-xs border-2"
                          style={getRouteColorStyle(tour.routeColor)}
                        >
                          Route
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{tour.description}</p>

                    <div className="text-xs text-gray-500 mb-4">
                      <div>Passengers: {tour.minPassengers}-{tour.maxPassengers}</div>
                      <div>Max Weight: {tour.maxWeight} lbs</div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleTourSelection(tour)}
                        variant={isSelected ? "destructive" : "outline"}
                        size="sm"
                        disabled={!isSelected && selectedTours.length >= 3}
                      >
                        {isSelected ? (
                          <>
                            <Minus className="w-4 h-4 mr-1" />
                            Remove
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-1" />
                            Compare
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => onSelectTour(tour)}
                        className="flex-1 bg-ocean-blue hover:bg-blue-600"
                        size="sm"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          // Comparison Mode
          <div className="space-y-6">
            {selectedTours.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Select tours to compare by clicking "Compare" in browse mode.</p>
              </div>
            ) : (
              <>
                {/* Price Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedTours.map((tour) => (
                    <Card key={tour.id} className="text-center">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{tour.name}</h3>
                        <div className="text-2xl font-bold text-ocean-blue mb-1">${tour.price}</div>
                        <p className="text-sm text-gray-600">{tour.duration}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {tour.type}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Feature Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 p-3 text-left font-semibold">Feature</th>
                        {selectedTours.map((tour) => (
                          <th key={tour.id} className="border border-gray-200 p-3 text-center font-semibold">
                            {tour.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 p-3 font-medium">Price</td>
                        {selectedTours.map((tour) => (
                          <td key={tour.id} className="border border-gray-200 p-3 text-center">
                            <span className="font-bold text-ocean-blue">${tour.price}</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 p-3 font-medium">Duration</td>
                        {selectedTours.map((tour) => (
                          <td key={tour.id} className="border border-gray-200 p-3 text-center">
                            {tour.duration}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3 font-medium">Aircraft Type</td>
                        {selectedTours.map((tour) => (
                          <td key={tour.id} className="border border-gray-200 p-3 text-center capitalize">
                            {tour.type}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 p-3 font-medium">Max Passengers</td>
                        {selectedTours.map((tour) => (
                          <td key={tour.id} className="border border-gray-200 p-3 text-center">
                            {tour.maxPassengers}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3 font-medium">Max Weight</td>
                        {selectedTours.map((tour) => (
                          <td key={tour.id} className="border border-gray-200 p-3 text-center">
                            {tour.maxWeight} lbs
                          </td>
                        ))}
                      </tr>
                      {getUniqueFeatures().map((feature, index) => (
                        <tr key={feature} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="border border-gray-200 p-3 font-medium">{feature}</td>
                          {selectedTours.map((tour) => (
                            <td key={tour.id} className="border border-gray-200 p-3 text-center">
                              {tour.features.includes(feature) ? (
                                <Check className="w-5 h-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedTours.map((tour) => (
                    <div key={tour.id} className="text-center">
                      <Button
                        onClick={() => onSelectTour(tour)}
                        className="w-full bg-ocean-blue hover:bg-blue-600"
                      >
                        Book {tour.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};