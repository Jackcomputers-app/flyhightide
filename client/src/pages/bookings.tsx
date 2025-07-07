import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, Users, Weight, DollarSign, Clock } from 'lucide-react';
import { Booking } from '@shared/schema';

const fetchBookings = async (): Promise<Booking[]> => {
  const response = await fetch('/api/bookings');
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};

const fetchBookingsByEmail = async (email: string): Promise<Booking[]> => {
  const response = await fetch(`/api/bookings/email/${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};

export default function Bookings() {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchMode, setSearchMode] = useState<'all' | 'email'>('all');

  const { data: allBookings, isLoading: isLoadingAll } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: fetchBookings,
    enabled: searchMode === 'all',
  });

  const { data: emailBookings, isLoading: isLoadingEmail } = useQuery({
    queryKey: ['/api/bookings', 'email', searchEmail],
    queryFn: () => fetchBookingsByEmail(searchEmail),
    enabled: searchMode === 'email' && searchEmail.length > 0,
  });

  const bookings = searchMode === 'all' ? allBookings : emailBookings;
  const isLoading = searchMode === 'all' ? isLoadingAll : isLoadingEmail;

  const handleSearchByEmail = () => {
    if (searchEmail.trim()) {
      setSearchMode('email');
    }
  };

  const handleShowAll = () => {
    setSearchMode('all');
    setSearchEmail('');
  };

  return (
    <div className="min-h-screen bg-sandy-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tour Bookings</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Search by email address..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSearchByEmail}
                disabled={!searchEmail.trim()}
                className="bg-ocean-blue hover:bg-blue-600 text-white"
              >
                Search by Email
              </Button>
              <Button
                onClick={handleShowAll}
                variant="outline"
                className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white"
              >
                Show All
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Showing: {searchMode === 'all' ? 'All bookings' : `Bookings for ${searchEmail}`}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {booking.tourName}
                      </CardTitle>
                      <p className="text-sm text-gray-600 capitalize">{booking.location}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-ocean-blue" />
                    <span className="truncate">{booking.contactEmail}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-ocean-blue" />
                    <span>{booking.contactPhone}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-coastal-teal" />
                      <span>{booking.passengers} passengers</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Weight className="w-4 h-4 mr-2 text-coastal-teal" />
                      <span>{booking.totalWeight} lbs</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm font-semibold text-ocean-blue">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>${booking.totalPrice}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {booking.id}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {booking.leadPassengerName}
                    </p>
                    {booking.preferredDate && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Preferred: {booking.preferredDate}</span>
                      </div>
                    )}
                    {booking.specialRequests && (
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Notes:</strong> {booking.specialRequests}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      Booked: {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {searchMode === 'email' 
                ? `No bookings found for ${searchEmail}`
                : 'No bookings have been made yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}