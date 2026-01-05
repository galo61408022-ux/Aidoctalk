import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Clock, X, Menu, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from './components/LoadingSpinner';

export function HospitalSearch({ onNavigate }) {
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const specialties = [
    'General Hospital',
    'Cardiology',
    'Dentist',
    'Eye Clinic (Ophthalmology)',
    'Orthopedic/Bone',
    'Pediatrics',
    'Neurology',
    'Oncology',
    'Emergency Care',
    'Mental Health',
    'Surgery',
    'Gynecology',
  ];

  const locations = [
    'Lagos Island',
    'Victoria Island',
    'Lekki',
    'Ikoyi',
    'Yaba',
    'Surulere',
    'Mushin',
    'Ojodu',
    'Kano',
    'Abuja',
    'Port Harcourt',
    'Ibadan',
  ];

  // Mock hospital data
  const mockHospitals = [
    {
      id: 1,
      name: 'Lagos Medical Center',
      specialty: 'General Hospital',
      location: 'Lagos Island',
      address: '123 Marina Street, Lagos Island',
      phone: '+234-800-123-4567',
      hours: '24/7',
      rating: 4.8,
      reviews: 256,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
      about: 'State-of-the-art medical facility with experienced doctors and modern equipment.',
      services: ['Emergency', 'Surgery', 'Diagnostics', 'Pharmacy'],
    },
    {
      id: 2,
      name: 'Eye Care Specialists',
      specialty: 'Eye Clinic (Ophthalmology)',
      location: 'Victoria Island',
      address: '456 Ahmadu Bello Way, Victoria Island',
      phone: '+234-800-234-5678',
      hours: 'Mon-Fri 9AM-6PM, Sat 10AM-2PM',
      rating: 4.6,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1631217314830-e67cf9d09caa?w=400&h=300&fit=crop',
      about: 'Specialized eye care with latest technology and experienced ophthalmologists.',
      services: ['Eye Exams', 'Surgery', 'Contact Lens', 'Laser Treatment'],
    },
    {
      id: 3,
      name: 'Dental Excellence',
      specialty: 'Dentist',
      location: 'Lekki',
      address: '789 Lekki Phase 1, Lekki',
      phone: '+234-800-345-6789',
      hours: 'Mon-Fri 9AM-7PM, Sat 10AM-4PM',
      rating: 4.7,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1606811841689-23db3d821364?w=400&h=300&fit=crop',
      about: 'Premium dental care with cosmetic and restorative services.',
      services: ['Cleaning', 'Filling', 'Extraction', 'Cosmetic Dentistry', 'Implants'],
    },
    {
      id: 4,
      name: 'Heart & Cardiovascular Center',
      specialty: 'Cardiology',
      location: 'Ikoyi',
      address: '321 Ozumba Mbadiwe, Ikoyi',
      phone: '+234-800-456-7890',
      hours: '24/7',
      rating: 4.9,
      reviews: 428,
      image: 'https://images.unsplash.com/photo-1576091160399-1c6ddb1c2b40?w=400&h=300&fit=crop',
      about: 'Specialized cardiac care with world-class facilities.',
      services: ['Cardiac Surgery', 'ECG', 'Stress Test', 'Angiography', 'Pacemaker'],
    },
    {
      id: 5,
      name: 'Bone & Joint Clinic',
      specialty: 'Orthopedic/Bone',
      location: 'Yaba',
      address: '654 Awojobi Street, Yaba',
      phone: '+234-800-567-8901',
      hours: 'Mon-Sat 8AM-6PM',
      rating: 4.5,
      reviews: 267,
      image: 'https://images.unsplash.com/photo-1579154204601-01d430248e74?w=400&h=300&fit=crop',
      about: 'Expert orthopedic care for bone and joint conditions.',
      services: ['X-ray', 'Orthopedic Surgery', 'Physical Therapy', 'Sports Medicine'],
    },
    {
      id: 6,
      name: 'Pediatric Care Plus',
      specialty: 'Pediatrics',
      location: 'Surulere',
      address: '987 Herbert Macaulay Way, Surulere',
      phone: '+234-800-678-9012',
      hours: 'Mon-Fri 8AM-5PM, Sat 9AM-1PM',
      rating: 4.7,
      reviews: 305,
      image: 'https://images.unsplash.com/photo-1631217314830-e67cf9d09caa?w=400&h=300&fit=crop',
      about: 'Child-friendly healthcare facility with pediatric specialists.',
      services: ['Vaccinations', 'General Care', 'Emergency', 'Growth Monitoring'],
    },
  ];

  useEffect(() => {
    // Simulate loading hospitals
    setTimeout(() => {
      setHospitals(mockHospitals);
      setFilteredHospitals(mockHospitals);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = hospitals;

    if (searchQuery) {
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter((h) => h.specialty === selectedSpecialty);
    }

    if (selectedLocation) {
      filtered = filtered.filter((h) => h.location === selectedLocation);
    }

    setFilteredHospitals(filtered);
  }, [searchQuery, selectedSpecialty, selectedLocation, hospitals]);

  if (selectedHospital) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => setSelectedHospital(null)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">{selectedHospital.name}</h1>
          </div>
        </header>

        {/* Hospital Details */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Image */}
          <div className="mb-8">
            <img
              src={selectedHospital.image}
              alt={selectedHospital.name}
              className="w-full h-96 object-cover rounded-xl"
            />
          </div>

          {/* Main Info */}
          <div className="bg-white rounded-xl p-6 mb-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">About</h2>
              <p className="text-slate-600">{selectedHospital.about}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Specialty */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Specialty</p>
                <p className="font-semibold text-slate-900">{selectedHospital.specialty}</p>
              </div>

              {/* Location */}
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Location
                </p>
                <p className="font-semibold text-slate-900">{selectedHospital.location}</p>
              </div>

              {/* Hours */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Hours
                </p>
                <p className="font-semibold text-slate-900">{selectedHospital.hours}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl">⭐</div>
              <div>
                <p className="font-bold text-slate-900">{selectedHospital.rating}/5</p>
                <p className="text-sm text-slate-600">{selectedHospital.reviews} reviews</p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Available Services</h3>
              <div className="flex flex-wrap gap-2">
                {selectedHospital.services.map((service, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="text-slate-900 font-medium">{selectedHospital.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-slate-900 font-medium">{selectedHospital.address}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
              <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Call Now
              </button>
              <button
                onClick={() => onNavigate('doctor-reservation')}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Book Doctor
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('logged-in')}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="h-6 w-6 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Hospital & Clinic Search</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search hospital or clinic name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <p className="text-sm text-slate-600">
            Found {filteredHospitals.length} hospital(s)
          </p>
        </div>

        {/* Hospital List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredHospitals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No hospitals found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                onClick={() => setSelectedHospital(hospital)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-1 flex items-center gap-1">
                    <span className="text-amber-500">⭐</span>
                    <span className="font-bold text-slate-900">{hospital.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                      {hospital.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">{hospital.specialty}</p>
                  </div>

                  {/* Location and Hours */}
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span className="line-clamp-1">{hospital.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span className="line-clamp-1">{hospital.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span className="line-clamp-1">{hospital.phone}</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1">
                    {hospital.services.slice(0, 3).map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Reviews */}
                  <p className="text-xs text-slate-500">{hospital.reviews} reviews</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
