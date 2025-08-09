import { Tour } from '@/data/tours';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plane, Ambulance, Clock, Users, Weight, DollarSign, Star, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { testimonials } from '@/data/testimonials';

interface TourCardProps {
  tour: Tour;
  className?: string;
}

export const TourCard = ({ tour, className }: TourCardProps) => {
  const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)];
  
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

  const handleBookNow = () => {
    window.open(tour.bookingUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <Card
      className={cn(
        'transition-all hover:shadow-lg',
        className
      )}
    >
      <div className="aspect-[4/3] sm:aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{tour.name}</h3>
              {tour.routeColor && (
                <Badge 
                  className="text-xs font-bold border-2"
                  style={getRouteColorStyle(tour.routeColor)}
                >
                  {tour.routeColor.toUpperCase()} ROUTE
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

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button 
            onClick={handleBookNow}
            className="w-full bg-ocean-blue hover:bg-ocean-blue/90 text-white"
          >
            Book Now
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
