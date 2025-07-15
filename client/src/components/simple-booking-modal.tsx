import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { locations, tours } from '@/data/tours';
import { Minus, Plus, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: string;
}

export const SimpleBookingModal = ({ isOpen, onClose, initialLocation }: SimpleBookingModalProps) => {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation || '');
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [passengers, setPassengers] = useState(2);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialLocation) {
      setSelectedLocation(initialLocation);
      setSelectedTour(null);
    }
  }, [isOpen, initialLocation]);

  const currentLocation = locations.find(loc => loc.id === selectedLocation);
  const locationTours = selectedLocation ? tours.filter(t => t.location === selectedLocation) : [];

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

  const getTotalPrice = () => {
    return selectedTour ? selectedTour.price * passengers : 0;
  };

  const handleSubmit = async () => {
    if (!selectedTour || !customerName || !customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a tour.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingData = {
        location: selectedLocation,
        tourId: selectedTour.id,
        tourName: selectedTour.name,
        passengers: passengers,
        totalWeight: 0,
        leadPassengerName: customerName,
        contactEmail: customerEmail,
        contactPhone: customerPhone,
        preferredDate: null,
        specialRequests: null,
        totalPrice: getTotalPrice().toString(),
        status: "confirmed"
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const savedBooking = await response.json();
      
      setIsSubmitting(false);
      toast({
        title: "Booking Confirmed!",
        description: `Your ${selectedTour.name} tour has been booked for ${passengers} passenger${passengers !== 1 ? 's' : ''}. Total: $${getTotalPrice()}`,
      });
      
      onClose();
      // Reset form
      setSelectedTour(null);
      setPassengers(2);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Book Your Tour - {currentLocation?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left side - Map and Location Info */}
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={currentLocation?.image}
                alt={currentLocation?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentLocation?.name}</h3>
              <p className="text-gray-600 mb-4">{currentLocation?.description}</p>
              
              <div className="flex items-center mb-4">
                <MapPin className="w-4 h-4 text-coastal-teal mr-2" />
                <span className="text-sm text-gray-600">{currentLocation?.note}</span>
              </div>

              {/* Location selector if no initial location */}
              {!initialLocation && (
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    Choose Location
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {locations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => setSelectedLocation(location.id)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          selectedLocation === location.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-gray-600">{location.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Tour Selection and Booking */}
          <div className="space-y-6">
            {/* Tour Selection */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Your Tour</h4>
              <div className="space-y-3">
                {locationTours.map((tour) => (
                  <div
                    key={tour.id}
                    onClick={() => setSelectedTour(tour)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTour?.id === tour.id 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h5 className="font-semibold text-gray-900">{tour.name}</h5>
                        {tour.routeColor && (
                          <Badge 
                            variant="outline" 
                            className="text-xs font-medium border-2"
                            style={getRouteColorStyle(tour.routeColor)}
                          >
                            Route
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-ocean-blue">${tour.price}</div>
                        <div className="text-xs text-gray-600">per person</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tour.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{tour.duration}</span>
                      <span>{tour.type} • {tour.minPassengers}-{tour.maxPassengers} passengers</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Passenger count and booking form */}
            {selectedTour && (
              <div className="space-y-4 border-t pt-6">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    Number of Passengers
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPassengers(Math.max(selectedTour.minPassengers, passengers - 1))}
                      disabled={passengers <= selectedTour.minPassengers}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium text-lg px-4">{passengers}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPassengers(Math.min(selectedTour.maxPassengers, passengers + 1))}
                      disabled={passengers >= selectedTour.maxPassengers}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Min: {selectedTour.minPassengers}, Max: {selectedTour.maxPassengers}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="customerName" className="text-sm font-medium text-gray-900">
                      Lead Passenger Name *
                    </Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter full name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail" className="text-sm font-medium text-gray-900">
                      Email Address *
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone" className="text-sm font-medium text-gray-900">
                      Phone Number
                    </Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-2xl font-bold text-ocean-blue">${getTotalPrice()}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedTour.name} × {passengers} passenger{passengers !== 1 ? 's' : ''} 
                    ({selectedTour.duration})
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !customerName || !customerEmail}
                  className="w-full bg-ocean-blue hover:bg-blue-600 text-white"
                >
                  {isSubmitting ? 'Booking...' : 'Book Tour Now'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};