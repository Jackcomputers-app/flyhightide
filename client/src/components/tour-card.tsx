import { Tour } from '@/data/tours';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Ambulance, Clock, Users, Weight, DollarSign, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { testimonials } from '@/data/testimonials';

interface TourCardProps {
  tour: Tour;
  selected?: boolean;
  onSelect?: (tour: Tour) => void;
  className?: string;
}

export const TourCard = ({ tour, selected, onSelect, className }: TourCardProps) => {
  const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)];
  
  const getRouteColorClass = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-500 text-black';
      case 'orange':
        return 'bg-orange-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'purple':
        return 'bg-purple-500 text-white';
      case 'red':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg',
        selected && 'ring-2 ring-blue-500 bg-blue-50',
        className
      )}
      onClick={() => onSelect?.(tour)}
    >
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{tour.name}</h3>
              {tour.routeColor && (
                <Badge className={`text-xs font-bold ${getRouteColorClass(tour.routeColor)}`}>
                  {tour.routeColor.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">{tour.description}</p>
          </div>
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            {tour.type === 'helicopter' ? (
              <Ambulance className="w-5 h-5 text-ocean-blue" />
            ) : (
              <Plane className="w-5 h-5 text-ocean-blue" />
            )}
            <Badge variant="secondary" className="text-xs">
              {tour.type}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-coastal-teal" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-coastal-teal" />
            <span>
              {tour.minPassengers === tour.maxPassengers
                ? `${tour.minPassengers} passengers`
                : `${tour.minPassengers}-${tour.maxPassengers} passengers`}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Weight className="w-4 h-4 mr-2 text-coastal-teal" />
            <span>Max {tour.maxWeight} lbs</span>
          </div>
          <div className="flex items-center text-sm font-semibold text-ocean-blue">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>${tour.price}/person</span>
          </div>
        </div>

        {tour.minPassengers > 1 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-800">
              <span className="font-medium">Note:</span> Minimum {tour.minPassengers} passengers required
            </p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-600">{randomTestimonial.source}</span>
          </div>
          <p className="text-sm text-gray-600 italic">
            "{randomTestimonial.text.substring(0, 100)}..."
          </p>
          <p className="text-xs text-gray-500 mt-1">- {randomTestimonial.name}</p>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {tour.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
