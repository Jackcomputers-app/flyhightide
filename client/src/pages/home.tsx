import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LocationCard } from '@/components/location-card';
import { TestimonialCard } from '@/components/testimonial-card';

import { Logo } from '@/components/logo';
import { locations } from '@/data/tours';
import { testimonials, getRandomTestimonials } from '@/data/testimonials';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Plane, 
  Ambulance, 
  MapPin, 
  Clock, 
  Star, 
  ChevronDown, 
  Menu, 
  X,
  Phone,
  Mail,
  Facebook,
  Instagram
} from 'lucide-react';
import { Link } from 'wouter';

export default function Home() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const randomTestimonials = getRandomTestimonials(3);

  const scrollToLocations = () => {
    scrollToSection('locations');
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToLocation = (locationId: string) => {
    const element = document.getElementById(`location-${locationId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsLocationMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Logo size="md" />
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-gray-700 hover:text-ocean-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('locations')}
                  className="text-gray-700 hover:text-ocean-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  Locations
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-gray-700 hover:text-ocean-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-gray-700 hover:text-ocean-blue px-3 py-2 text-sm font-medium transition-colors"
                >
                  Reviews
                </button>
                <Link href="/bookings" className="text-gray-700 hover:text-ocean-blue px-3 py-2 text-sm font-medium transition-colors">
                  View Bookings
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-ocean-blue px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </Link>
                <button
                  onClick={() => scrollToSection('locations')}
                  className="bg-ocean-blue hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
                >
                  View Tours
                </button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-ocean-blue"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-ocean-blue"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('locations')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-ocean-blue"
              >
                Locations
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-ocean-blue"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-ocean-blue"
              >
                Reviews
              </button>
              <Link
                href="/bookings"
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-ocean-blue"
              >
                View Bookings
              </Link>
              <Link
                href="/contact"
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-ocean-blue"
              >
                Contact
              </Link>
              <button
                onClick={scrollToLocations}
                className="w-full mt-2 bg-ocean-blue hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
              >
                View Tours
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://flyhightide.com/_astro/high-tide-helicopter-with-pilot-ready-to-takeoff.FFBadvWW.jpg")'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Choose Your Location</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Experience the breathtaking beauty of the Carolina and Georgia coasts from a bird's eye view
          </p>
          
          <div className="max-w-md mx-auto">
            <Collapsible open={isLocationMenuOpen} onOpenChange={setIsLocationMenuOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  size="lg"
                  className="w-full bg-ocean-blue hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold flex items-center justify-between"
                >
                  Select Your Tour Location
                  <ChevronDown className={`h-5 w-5 transition-transform ${isLocationMenuOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4 space-y-2">
                <Button
                  onClick={() => scrollToLocation('wilmington')}
                  size="lg"
                  variant="outline"
                  className="w-full bg-white/90 border-2 border-white text-gray-900 hover:bg-white hover:text-gray-800 px-6 py-3 text-base font-medium"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Wilmington, NC
                </Button>
                
                <Button
                  onClick={() => scrollToLocation('southport')}
                  size="lg"
                  variant="outline"
                  className="w-full bg-white/90 border-2 border-white text-gray-900 hover:bg-white hover:text-gray-800 px-6 py-3 text-base font-medium"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Southport, NC
                </Button>
                
                <Button
                  onClick={() => scrollToLocation('st-simons')}
                  size="lg"
                  variant="outline"
                  className="w-full bg-white/90 border-2 border-white text-gray-900 hover:bg-white hover:text-gray-800 px-6 py-3 text-base font-medium"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  St Simons Island, GA
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="mt-6">
            <Button
              onClick={() => scrollToSection('locations')}
              size="lg"
              variant="ghost"
              className="text-white hover:text-gray-200 underline"
            >
              View All Locations
            </Button>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              High Tide Tour Locations
            </h2>
            <p className="text-lg text-gray-600">Choose your coastline adventure</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location) => (
              <div key={location.id} id={`location-${location.id}`}>
                <LocationCard
                  location={location}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-sandy-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Fly?</h2>
            <p className="text-lg text-gray-600">4 Simple Steps to Your Adventure</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Location</h3>
              <p className="text-gray-600">Choose which coastline you'd like to fly over</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pick a Tour</h3>
              <p className="text-gray-600">Select from our scenic route options</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Passengers</h3>
              <p className="text-gray-600">Enter passenger details and requirements</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Ready to Fly</h3>
              <p className="text-gray-600">Complete payment and receive confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Words from Our Guests
            </h2>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">5.0 (112 Google Reviews)</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">4.9 (266 TripAdvisor Reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {randomTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section (Collapsible) */}
      <section id="about" className="py-16 bg-sandy-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">About High Tide Aviation</h3>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 px-6 pb-6">
                    <p className="text-gray-600 mb-4">
                      High Tide Aviation offers premier aerial tours along the stunning coastlines of North Carolina and Georgia. 
                      Our experienced pilots provide safe, memorable flights that showcase the natural beauty of our coastal regions.
                    </p>
                    <p className="text-gray-600">
                      With both helicopter and airplane options available, we cater to different preferences and group sizes, 
                      ensuring every guest has an unforgettable experience above the clouds.
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
            
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 px-6 pb-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Do you have weight restrictions?</h4>
                        <p className="text-gray-600">
                          Yes, weight restrictions vary by aircraft type and tour. Details are provided during booking.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">What's the minimum passenger count?</h4>
                        <p className="text-gray-600">
                          Helicopter tours require a minimum of 2 passengers. Airplane tours have no minimum requirement.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">What happens if weather is bad?</h4>
                        <p className="text-gray-600">
                          Safety is our priority. Tours may be rescheduled due to weather conditions with full refund options available.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">How far in advance should I book?</h4>
                        <p className="text-gray-600">
                          We recommend booking at least 24-48 hours in advance, especially during peak season and weekends.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
            
            <Collapsible>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 px-6 pb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Southport, NC Location (KSUT)</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>Southport, North Carolina</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span><a href="tel:+1 (910) 477 1926" className="text-blue-500 hover:underline"> +1 (910) 477 1926</a></span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">St Simons Island, GA Location (KSSI)</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>St Simons Island, Georgia</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span><a href="tel:+1 (912) 434 2937" className="text-blue-500 hover:underline"> +1 (912) 434 2937</a></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </div>
      </section>

      {/* Sticky Book Button (Mobile) */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={() => openBooking()}
            size="lg"
            className="bg-ocean-blue hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-medium"
          >
            <Plane className="w-5 h-5 mr-2" />
            Book Now
          </Button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">High Tide Aviation</h3>
              <p className="text-gray-300">
                Experience the beauty of coastal aviation with our premier aerial tours.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Locations</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Southport, NC</li>
                <li>St Simons Island, GA</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Ambulance Tours</li>
                <li>Airplane Tours</li>
                <li>Scenic Flights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/flyhightide" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
                </a>
                <a href="https://www.instagram.com/hightideaviation/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 High Tide Aviation. All rights reserved.</p>
          </div>
        </div>
      </footer>



    </div>
  );
}
