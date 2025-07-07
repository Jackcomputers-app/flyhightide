import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBooking } from '@/hooks/use-booking';
import { ProgressBar } from '@/components/progress-bar';
import { LocationCard } from '@/components/location-card';
import { TourCard } from '@/components/tour-card';
import { locations, tours } from '@/data/tours';
import { Shield, CreditCard, Minus, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: string;
}

export const BookingModal = ({ isOpen, onClose, initialLocation }: BookingModalProps) => {
  const { booking, updateBooking, nextStep, prevStep, resetBooking, canProceedToStep, getTotalPrice, getLocationName } = useBooking();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialLocation) {
      updateBooking({ location: initialLocation });
    }
  }, [isOpen, initialLocation, updateBooking]);

  const handleClose = () => {
    resetBooking();
    onClose();
  };

  const handleNext = () => {
    if (canProceedToStep(booking.step + 1)) {
      nextStep();
    }
  };

  const handleCompleteBooking = async () => {
    setIsSubmitting(true);
    
    try {
      if (!booking.tour) {
        throw new Error("No tour selected");
      }

      const bookingData = {
        location: booking.location!,
        tourId: booking.tour.id,
        tourName: booking.tour.name,
        passengers: booking.passengers,
        totalWeight: booking.totalWeight,
        leadPassengerName: booking.leadPassengerName,
        contactEmail: booking.contactEmail,
        contactPhone: booking.contactPhone,
        preferredDate: booking.preferredDate || null,
        specialRequests: booking.specialRequests || null,
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
        description: `Your tour has been booked successfully. Booking ID: ${savedBooking.id}. You'll receive a confirmation email shortly.`,
      });
      
      handleClose();
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const locationTours = booking.location ? tours.filter(t => t.location === booking.location) : [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Book Your Tour
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <ProgressBar currentStep={booking.step} totalSteps={4} />
          
          {/* Step 1: Location Selection */}
          {booking.step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Select Your Location</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {locations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    selected={booking.location === location.id}
                    onSelect={(locationId) => updateBooking({ location: locationId })}
                  />
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToStep(2)}
                  className="bg-ocean-blue hover:bg-blue-600 text-white"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Tour Selection */}
          {booking.step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Choose Your Tour</h3>
                <p className="text-sm text-gray-600">Location: {getLocationName()}</p>
              </div>
              <div className="grid gap-4">
                {locationTours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    selected={booking.tour?.id === tour.id}
                    onSelect={(selectedTour) => updateBooking({ tour: selectedTour })}
                  />
                ))}
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="text-gray-600 border-gray-300"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToStep(3)}
                  className="bg-ocean-blue hover:bg-blue-600 text-white"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Passenger Information */}
          {booking.step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Passenger Information</h3>
              
              {booking.tour && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Tour Requirements</p>
                      <p className="text-sm text-yellow-700">
                        <strong>{booking.tour.name}</strong> - 
                        {booking.tour.minPassengers === booking.tour.maxPassengers 
                          ? ` ${booking.tour.minPassengers} passengers` 
                          : ` ${booking.tour.minPassengers}-${booking.tour.maxPassengers} passengers`}, 
                        Max {booking.tour.maxWeight} lbs total weight, 
                        ${booking.tour.price} per person
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="passengers" className="text-sm font-medium text-gray-700">
                    Number of Passengers
                  </Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateBooking({ passengers: Math.max(1, booking.passengers - 1) })}
                      disabled={booking.passengers <= (booking.tour?.minPassengers || 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl font-semibold text-gray-900 w-8 text-center">
                      {booking.passengers}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateBooking({ passengers: Math.min(booking.tour?.maxPassengers || 6, booking.passengers + 1) })}
                      disabled={booking.passengers >= (booking.tour?.maxPassengers || 6)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="totalWeight" className="text-sm font-medium text-gray-700">
                    Total Weight (lbs)
                  </Label>
                  <Input
                    id="totalWeight"
                    type="number"
                    placeholder="Enter total weight"
                    value={booking.totalWeight || ''}
                    onChange={(e) => updateBooking({ totalWeight: parseInt(e.target.value) || 0 })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="leadPassengerName" className="text-sm font-medium text-gray-700">
                    Lead Passenger Name
                  </Label>
                  <Input
                    id="leadPassengerName"
                    placeholder="Enter full name"
                    value={booking.leadPassengerName}
                    onChange={(e) => updateBooking({ leadPassengerName: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                    Contact Email
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={booking.contactEmail}
                    onChange={(e) => updateBooking({ contactEmail: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={booking.contactPhone}
                    onChange={(e) => updateBooking({ contactPhone: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="preferredDate" className="text-sm font-medium text-gray-700">
                    Preferred Date (Optional)
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={booking.preferredDate}
                    onChange={(e) => updateBooking({ preferredDate: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-700">
                    Special Requests (Optional)
                  </Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any special requests or questions?"
                    value={booking.specialRequests}
                    onChange={(e) => updateBooking({ specialRequests: e.target.value })}
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="text-gray-600 border-gray-300"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToStep(4)}
                  className="bg-ocean-blue hover:bg-blue-600 text-white"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {booking.step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Confirm & Pay</h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Booking Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{getLocationName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tour:</span>
                    <span className="font-medium text-gray-900">{booking.tour?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">{booking.tour?.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span className="font-medium text-gray-900">{booking.passengers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per person:</span>
                    <span className="font-medium text-gray-900">${booking.tour?.price}</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-ocean-blue">${getTotalPrice()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Secure Payment</p>
                    <p className="text-sm text-blue-700">
                      Your payment information is protected with industry-standard encryption
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Payment Integration</p>
                <p className="text-sm text-gray-500">
                  This is a mockup - payment processing would be integrated here
                </p>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="text-gray-600 border-gray-300"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCompleteBooking}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Booking
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
