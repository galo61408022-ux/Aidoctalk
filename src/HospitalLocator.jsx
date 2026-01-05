import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MapPin, Star, Phone, Navigation, Clock, Filter, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { locationService } from './services';
import { useToast, Toast } from './components/Toast';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAuth } from './context/AuthContext';

// Mock Data for Hospitals (fallback when API is not available)
const MOCK_HOSPITALS = [
  {
    id: 1,
    name: "St. Mary's General Hospital",
    address: "123 Health Avenue, Central District",
    distance: "1.2 km",
    rating: 4.8,
    reviews: 1240,
    isOpen: true,
    coordinates: { top: '30%', left: '40%' },
    image: "https://images.unsplash.com/photo-1587351021759-3e566b9af923?auto=format&fit=crop&q=80&w=1000",
    specialties: ["Cardiology", "Emergency"]
  },
  {
    id: 2,
    name: "City Care Specialist Clinic",
    address: "45 Wellspring Road, Northside",
    distance: "2.5 km",
    rating: 4.5,
    reviews: 856,
    isOpen: true,
    coordinates: { top: '50%', left: '60%' },
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
    specialties: ["Pediatrics", "General"]
  },
  {
    id: 3,
    name: "Rapid Response Emergency",
    address: "88 Urgent Way",
    distance: "4.1 km",
    rating: 4.2,
    reviews: 320,
    isOpen: false,
    coordinates: { top: '70%', left: '20%' },
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1000",
    specialties: ["Trauma", "Surgery"]
  },
];

export function HospitalLocator({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState(MOCK_HOSPITALS);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const listRef = useRef(null);

  // Try to get nearby hospitals on component mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadNearbyHospitals = async () => {
      try {
        setIsLoading(true);
        const location = await locationService.getCurrentLocation();
        const data = await locationService.findNearbyHospitals(
          location.latitude,
          location.longitude,
          5
        );
        if (Array.isArray(data) && data.length > 0) {
          setHospitals(data);
          addToast(`Found ${data.length} nearby hospitals`, 'success');
        }
      } catch (err) {
        console.error('Failed to load hospitals:', err);
        // Use mock data as fallback
        addToast('Using cached hospital data', 'info');
      } finally {
        setIsLoading(false);
      }
    };
    loadNearbyHospitals();
  }, [isAuthenticated, addToast]);

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    if (selectedHospital) {
      const element = document.getElementById(`hospital-card-${selectedHospital}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedHospital]);

  const handleAction = (action, hospitalName) => {
    addToast(`Starting ${action} for ${hospitalName}...`, 'info');
  };

  // Show auth required message if not logged in
  if (!isAuthenticated) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hospital Locator</h2>
          <p className="text-gray-600 mb-6">Please log in to find nearby hospitals</p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      
      {/* Header - Floating on Mobile, Fixed on Desktop */}
      <div className="bg-white z-20 shadow-sm border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-4">
          <button 
            onClick={() => onNavigate('logged-in')} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-slate-700" />
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search hospitals, specialists..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 placeholder:text-slate-500 transition-shadow"
            />
            {/* Clear Search Button */}
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Split View */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        
        {/* MAP SECTION (Top on Mobile, Left on Desktop) */}
        <div className="h-[45%] lg:h-full lg:w-[60%] bg-slate-200 relative group transition-all duration-300 overflow-hidden">
          {/* Mock Map Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* User Location Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          {/* Hospital Pins */}
          {filteredHospitals.map((hospital) => (
            <button
              key={hospital.id}
              onClick={() => setSelectedHospital(hospital.id)}
              style={{ top: hospital.coordinates.top, left: hospital.coordinates.left }}
              className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-500 ease-out group/pin ${
                selectedHospital === hospital.id ? 'z-30 scale-110' : 'z-20 hover:scale-110'
              }`}
            >
              <div className={`p-2 rounded-lg shadow-xl relative transition-colors duration-300 ${
                selectedHospital === hospital.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
              }`}>
                <MapPin className="h-6 w-6" fill={selectedHospital === hospital.id ? "white" : "none"} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 bg-inherit"></div>
              </div>
              
              {/* Tooltip on hover/select */}
              <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-300 ${
                selectedHospital === hospital.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover/pin:opacity-100 group-hover/pin:translate-y-0'
              }`}>
                {hospital.name}
              </div>
            </button>
          ))}
          
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs text-slate-500 shadow-sm border border-slate-200">
            Simulated Map View
          </div>
        </div>

        {/* LIST SECTION (Bottom on Mobile, Right on Desktop) */}
        <div className="h-[55%] lg:h-full lg:w-[40%] bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:shadow-none z-10">
          
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
            <h2 className="font-semibold text-slate-800">
              Nearby Hospitals <span className="text-slate-400 font-normal">({filteredHospitals.length})</span>
            </h2>
            <div className="flex gap-2">
               <button className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">Nearest</button>
               <button className="text-xs font-medium text-slate-500 px-2 py-1 cursor-pointer hover:bg-slate-50 rounded-md transition-colors">Top Rated</button>
            </div>
          </div>

          {/* Scrollable List */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 lg:pb-4 scroll-smooth">
            
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-slate-600 mt-4">Loading nearby hospitals...</p>
                </div>
              </div>
            )}

            {/* 3. Empty State Handling */}
            {filteredHospitals.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <div className="bg-slate-100 p-4 rounded-full mb-3">
                   <Search className="h-6 w-6 text-slate-400" />
                </div>
                <p>No hospitals found matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}

            {filteredHospitals.map((hospital) => (
              <div 
                key={hospital.id}
                id={`hospital-card-${hospital.id}`} // ID for scroll-to-view logic
                onClick={() => setSelectedHospital(hospital.id)}
                className={`group rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  selectedHospital === hospital.id 
                    ? 'border-blue-500 ring-1 ring-blue-500 shadow-lg bg-blue-50/30' 
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md bg-white'
                }`}
              >
                <div className="flex p-3 gap-3">
                  <ImageWithFallback 
                    src={hospital.image} 
                    alt={hospital.name}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-slate-200"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-slate-900 truncate pr-2">{hospital.name}</h3>
                      {hospital.isOpen ? (
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">OPEN</span>
                      ) : (
                         <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">CLOSED</span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 mb-2 truncate">{hospital.address}</p>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-slate-700">{hospital.rating}</span>
                      </div>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-medium text-slate-700">{hospital.distance} away</span>
                    </div>

                    <div className="flex gap-2">
                       {hospital.specialties.map(tag => (
                         <span key={tag} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{tag}</span>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Expanded Action Buttons */}
                {selectedHospital === hospital.id && (
                  <div className="flex border-t border-blue-100 divide-x divide-blue-100 animate-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAction("Call", hospital.name); }}
                      className="flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors active:bg-blue-100"
                    >
                      <Phone className="h-4 w-4" /> Call
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAction("Navigation", hospital.name); }}
                      className="flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors active:bg-blue-100"
                    >
                      <Navigation className="h-4 w-4" /> Directions
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAction("Booking", hospital.name); }}
                      className="flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors active:bg-blue-100"
                    >
                      <Clock className="h-4 w-4" /> Book
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* Toast Notifications */}
        <div className="fixed bottom-0 right-0 pointer-events-none">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto m-4">
              <Toast
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }