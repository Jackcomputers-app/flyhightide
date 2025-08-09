import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/progress-bar';
import { locations, tours, Tour } from '@/data/tours';
import { Calendar, Clock, Users, Weight, MapPin, Plane } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClassicBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: string;
  initialTour?: Tour;
}

export const ClassicBookingModal = ({ isOpen, onClose, initialLocation, initialTour }: ClassicBookingModalProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation || '');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(initialTour || null);
  const [passengers, setPassengers] = useState(2);
  const [totalWeight, setTotalWeight] = useState(300);
  const [leadPassengerName, setLeadPassengerName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: 'Location', description: 'Choose your departure location' },
    { number: 2, title: 'Tour', description: 'Select your flight experience' },
    { number: 3, title: 'Details', description: 'Passenger information' },
    { number: 4, title: 'Confirm', description: 'Review and book' }
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialLocation) {
        setSelectedLocation(initialLocation);
        setCurrentStep(initialTour ? 3 : 2);
      }
      if (initialTour) {
        setSelectedTour(initialTour);
        setPassengers(Math.max(initialTour.minPassengers, 2));
      }
    }
  }, [isOpen, initialLocation, initialTour]);

  const getCurrentLocation = () => locations.find(loc => loc.id === selectedLocation);
  const getLocationTours = () => selectedLocation ? tours.filter(t => t.location === selectedLocation) : [];

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

  const canProceed = (step: number) => {
    switch (step) {
      case 1: return !!selectedLocation;
      case 2: return !!selectedTour;
      case 3: return !!(leadPassengerName && contactEmail && preferredDate);
      default: return true;
    }
  };

  const nextStep = () => {
    if (canProceed(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTour || !leadPassengerName || !contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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
        totalWeight: totalWeight,
        leadPassengerName: leadPassengerName,
        contactEmail: contactEmail,
        contactPhone: contactPhone,
        preferredDate: preferredDate,
        specialRequests: specialRequests || null,
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
        description: `Your ${selectedTour.name} tour has been booked for ${preferredDate}. Total: $${getTotalPrice()}`,
      });
      
      onClose();
      // Reset form
      setCurrentStep(1);
      setSelectedLocation('');
      setSelectedTour(null);
      setPassengers(2);
      setTotalWeight(300);
      setLeadPassengerName('');
      setContactEmail('');
      setContactPhone('');
      setPreferredDate('');
      setSpecialRequests('');
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Choose Your Departure Location</h3>
            <div className="grid grid-cols-1 gap-4">
              {locations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedLocation === location.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedLocation(location.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{location.name}</h4>
                        <p className="text-gray-600 text-sm">{location.description}</p>
                        <div className="flex items-center mt-2">
                          <MapPin className="w-4 h-4 text-coastal-teal mr-1" />
                          <span className="text-xs text-gray-500">{location.note}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{location.tours.length} tours</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        const locationTours = getLocationTours();
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Select Your Flight Experience</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {locationTours.map((tour) => (
                <Card
                  key={tour.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTour?.id === tour.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedTour(tour)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{tour.name}</h4>
                        <Plane className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="text-right">
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

                    <p className="text-sm text-gray-600 mb-3">{tour.description}</p>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {tour.minPassengers}-{tour.maxPassengers} passengers
                      </span>
                      <span className="flex items-center">
                        <Weight className="w-3 h-3 mr-1" />
                        {tour.maxWeight} lbs max
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="passengers" className="text-sm font-medium">Number of Passengers *</Label>
                  <Select 
                    value={passengers.toString()} 
                    onValueChange={(value) => setPassengers(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedTour && Array.from(
                        { length: selectedTour.maxPassengers - selectedTour.minPassengers + 1 }, 
                        (_, i) => selectedTour.minPassengers + i
                      ).map(num => (
                        <SelectItem key={num} value={num.toString()}>{num} passenger{num !== 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="totalWeight" className="text-sm font-medium">Total Weight (lbs) *</Label>
                  <Input
                    id="totalWeight"
                    type="number"
                    value={totalWeight}
                    onChange={(e) => setTotalWeight(parseInt(e.target.value) || 0)}
                    placeholder="Total weight of all passengers"
                  />
                  {selectedTour && totalWeight > selectedTour.maxWeight && (
                    <p className="text-red-500 text-xs mt-1">
                      Exceeds maximum weight limit of {selectedTour.maxWeight} lbs
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="preferredDate" className="text-sm font-medium">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="leadPassengerName" className="text-sm font-medium">Lead Passenger Name *</Label>
                  <Input
                    id="leadPassengerName"
                    value={leadPassengerName}
                    onChange={(e) => setLeadPassengerName(e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail" className="text-sm font-medium">Email Address *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequests" className="text-sm font-medium">Special Requests</Label>
                  <Input
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requests or dietary requirements"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        const currentLocation = getCurrentLocation();
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Your Booking</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Flight Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{currentLocation?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tour:</span>
                      <span className="font-medium">{selectedTour?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedTour?.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aircraft:</span>
                      <span className="font-medium capitalize">{selectedTour?.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{preferredDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Passenger Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lead Passenger:</span>
                      <span className="font-medium">{leadPassengerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers:</span>
                      <span className="font-medium">{passengers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Weight:</span>
                      <span className="font-medium">{totalWeight} lbs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{contactEmail}</span>
                    </div>
                    {contactPhone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{contactPhone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-ocean-blue text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold">Total Cost</h4>
                    <p className="text-blue-100">
                      ${selectedTour?.price} × {passengers} passenger{passengers !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-3xl font-bold">${getTotalPrice()}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Book Your Flight Experience
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <ProgressBar 
            currentStep={currentStep}
            totalSteps={4}
          />
        </div>

        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed(currentStep)}
                className="bg-ocean-blue hover:bg-blue-600"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !canProceed(currentStep)}
                className="bg-ocean-blue hover:bg-blue-600"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};