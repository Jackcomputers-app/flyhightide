import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlightComparison } from '@/components/flight-comparison';
import { tours, Tour, locations } from '@/data/tours';
import { Logo } from '@/components/logo';
import { 
  Search, 
  Filter, 
  ArrowLeft,
  MapPin,
  Plane,
  Clock,
  DollarSign
} from 'lucide-react';
import { Ambulance } from 'lucide-react';
import { Link } from 'wouter';

export default function Compare() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price');
  const [filteredTours, setFilteredTours] = useState<Tour[]>(tours);

  useEffect(() => {
    let filtered = tours;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tour =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(tour => tour.location === selectedLocation);
    }

    // Filter by aircraft type
    if (selectedType !== 'all') {
      filtered = filtered.filter(tour => tour.type === selectedType);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-100':
          filtered = filtered.filter(tour => tour.price < 100);
          break;
        case '100-150':
          filtered = filtered.filter(tour => tour.price >= 100 && tour.price <= 150);
          break;
        case '150-200':
          filtered = filtered.filter(tour => tour.price >= 150 && tour.price <= 200);
          break;
        case 'over-200':
          filtered = filtered.filter(tour => tour.price > 200);
          break;
      }
    }

    // Sort tours
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        filtered.sort((a, b) => {
          const aDuration = parseInt(a.duration.split(' ')[0]);
          const bDuration = parseInt(b.duration.split(' ')[0]);
          return aDuration - bDuration;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'passengers':
        filtered.sort((a, b) => b.maxPassengers - a.maxPassengers);
        break;
    }

    setFilteredTours(filtered);
  }, [searchTerm, selectedLocation, selectedType, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('all');
    setSelectedType('all');
    setPriceRange('all');
    setSortBy('price');
  };

  const locationOptions = locations.map(location => ({
    value: location.id,
    label: location.name
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-ocean-blue">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <Logo size="sm" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Flights</h1>
          <p className="text-lg text-gray-600">
            Compare tour options side by side to find the perfect aerial adventure
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Search
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locationOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Aircraft Type Filter */}
              <div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Aircraft" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Aircraft</SelectItem>
                    <SelectItem value="helicopter">Helicopter</SelectItem>
                    <SelectItem value="airplane">Airplane</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="under-100">Under $100</SelectItem>
                    <SelectItem value="100-150">$100 - $150</SelectItem>
                    <SelectItem value="150-200">$150 - $200</SelectItem>
                    <SelectItem value="over-200">Over $200</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="duration">Duration (Short to Long)</SelectItem>
                    <SelectItem value="name">Name (A to Z)</SelectItem>
                    <SelectItem value="passengers">Max Passengers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-red-600">
                    ×
                  </button>
                </Badge>
              )}
              {selectedLocation !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {locationOptions.find(l => l.value === selectedLocation)?.label}
                  <button onClick={() => setSelectedLocation('all')} className="ml-1 hover:text-red-600">
                    ×
                  </button>
                </Badge>
              )}
              {selectedType !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedType === 'helicopter' ? 
                    <Ambulance className="w-3 h-3" /> : 
                    <Plane className="w-3 h-3" />
                  }
                  {selectedType === 'helicopter' ? 'Helicopter' : 'Airplane'}
                  <button onClick={() => setSelectedType('all')} className="ml-1 hover:text-red-600">
                    ×
                  </button>
                </Badge>
              )}
              {priceRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {priceRange === 'under-100' && 'Under $100'}
                  {priceRange === '100-150' && '$100-$150'}
                  {priceRange === '150-200' && '$150-$200'}
                  {priceRange === 'over-200' && 'Over $200'}
                  <button onClick={() => setPriceRange('all')} className="ml-1 hover:text-red-600">
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredTours.length} tour{filteredTours.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Sorted by {sortBy === 'price' ? 'price (low to high)' : 
                         sortBy === 'duration' ? 'duration (short to long)' : 
                         sortBy === 'name' ? 'name (A to Z)' : 
                         'max passengers'}
            </div>
          </div>
        </div>

        {/* Flight Comparison Component */}
        {filteredTours.length > 0 ? (
          <FlightComparison tours={filteredTours} />
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tours found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms to find more options.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}