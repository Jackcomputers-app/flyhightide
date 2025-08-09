import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Weight, MapPin, ExternalLink } from 'lucide-react';
import { Tour } from '@/data/tours';

interface TourInfoModalProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
}

export const TourInfoModal = ({ tour, isOpen, onClose, locationName }: TourInfoModalProps) => {
  if (!tour) return null;

  const handleBookNow = () => {
    window.open(tour.bookingUrl, '_blank');
    onClose();
  };

  const getRouteColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'blue': 'border-blue-500 bg-blue-50 text-blue-700',
      'green': 'border-green-500 bg-green-50 text-green-700',
      'orange': 'border-orange-500 bg-orange-50 text-orange-700',
      'yellow': 'border-yellow-500 bg-yellow-50 text-yellow-700',
      'purple': 'border-purple-500 bg-purple-50 text-purple-700',
      'red': 'border-red-500 bg-red-50 text-red-700',
      'gray': 'border-gray-500 bg-gray-50 text-gray-700',
    };
    return colorMap[color.toLowerCase()] || 'border-gray-500 bg-gray-50 text-gray-700';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Badge 
              variant="outline" 
              className={`text-sm font-medium border-2 ${tour.routeColor ? getRouteColorStyle(tour.routeColor) : 'border-gray-500 bg-gray-50 text-gray-700'}`}
            >
              {tour.name}
            </Badge>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {locationName}
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-left">{tour.name}</DialogTitle>
          <DialogDescription className="text-left text-base">
            {tour.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tour Image */}
          {tour.image && (
            <div className="w-full">
              <img 
                src={tour.image} 
                alt={`${tour.name} tour`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Tour Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-sm">
                <strong>Duration:</strong> {tour.duration}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm">
                <strong>Passengers:</strong> {tour.minPassengers}-{tour.maxPassengers}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Weight className="h-5 w-5 text-gray-500" />
              <span className="text-sm">
                <strong>Weight Limit:</strong> {tour.maxWeight} lbs
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">
                <strong>Aircraft:</strong> {tour.type === 'helicopter' ? 'Helicopter' : 'Airplane'}
              </span>
            </div>
          </div>

          {/* Features */}
          {tour.features && tour.features.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Tour Highlights</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {tour.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Pricing</h3>
            <div className="flex justify-between">
              <span>Starting Price:</span>
              <span className="font-semibold text-ocean-blue text-xl">${tour.price}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Final price may vary based on passengers and options selected during booking.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleBookNow}
              className="flex-1 bg-ocean-blue hover:bg-blue-600 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Book This Tour
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};