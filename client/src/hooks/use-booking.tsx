import { useState, useCallback } from 'react';
import { Tour } from '@/data/tours';

export interface BookingState {
  step: number;
  location: string | null;
  tour: Tour | null;
  passengers: number;
  totalWeight: number;
  leadPassengerName: string;
  contactEmail: string;
  contactPhone: string;
  preferredDate: string;
  specialRequests: string;
}

const initialState: BookingState = {
  step: 1,
  location: null,
  tour: null,
  passengers: 2,
  totalWeight: 0,
  leadPassengerName: '',
  contactEmail: '',
  contactPhone: '',
  preferredDate: '',
  specialRequests: ''
};

export const useBooking = () => {
  const [booking, setBooking] = useState<BookingState>(initialState);

  const updateBooking = useCallback((updates: Partial<BookingState>) => {
    setBooking(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setBooking(prev => ({ ...prev, step: Math.min(prev.step + 1, 4) }));
  }, []);

  const prevStep = useCallback(() => {
    setBooking(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(initialState);
  }, []);

  const canProceedToStep = useCallback((step: number): boolean => {
    switch (step) {
      case 2:
        return booking.location !== null;
      case 3:
        return booking.tour !== null;
      case 4:
        return (
          booking.passengers >= (booking.tour?.minPassengers || 1) &&
          booking.passengers <= (booking.tour?.maxPassengers || 6) &&
          booking.totalWeight > 0 &&
          booking.totalWeight <= (booking.tour?.maxWeight || 1000) &&
          booking.leadPassengerName.trim() !== '' &&
          booking.contactEmail.trim() !== '' &&
          booking.contactPhone.trim() !== ''
        );
      default:
        return true;
    }
  }, [booking]);

  const getTotalPrice = useCallback(() => {
    return booking.tour ? booking.tour.price * booking.passengers : 0;
  }, [booking.tour, booking.passengers]);

  const getLocationName = useCallback(() => {
    switch (booking.location) {
      case 'southport':
        return 'Southport, NC';
      case 'st-simons':
        return 'St Simons Island, GA';
      default:
        return '';
    }
  }, [booking.location]);

  return {
    booking,
    updateBooking,
    nextStep,
    prevStep,
    resetBooking,
    canProceedToStep,
    getTotalPrice,
    getLocationName
  };
};
