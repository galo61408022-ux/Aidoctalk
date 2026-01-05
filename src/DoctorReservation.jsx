import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, MapPin, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from './components/LoadingSpinner';

export function DoctorReservation({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reservationDetails, setReservationDetails] = useState(null);

  const specialties = [
    'General Consultation',
    'Cardiology',
    'Dentistry',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
    'Dermatology',
  ];

  const hospitals = {
    'Cardiology': [
      { id: 1, name: 'Heart & Cardiovascular Center', location: 'Ikoyi' },
      { id: 2, name: 'Lagos Medical Center', location: 'Lagos Island' },
    ],
    'Dentistry': [
      { id: 3, name: 'Dental Excellence', location: 'Lekki' },
      { id: 4, name: 'Smile Dental Clinic', location: 'Yaba' },
    ],
    'Ophthalmology': [
      { id: 5, name: 'Eye Care Specialists', location: 'Victoria Island' },
      { id: 6, name: 'Vision Plus', location: 'Surulere' },
    ],
    'Orthopedics': [
      { id: 7, name: 'Bone & Joint Clinic', location: 'Yaba' },
      { id: 8, name: 'Sports Medicine Center', location: 'Lekki' },
    ],
    'General Consultation': [
      { id: 9, name: 'Lagos Medical Center', location: 'Lagos Island' },
      { id: 10, name: 'City General Hospital', location: 'Surulere' },
    ],
    'Pediatrics': [
      { id: 11, name: 'Pediatric Care Plus', location: 'Surulere' },
      { id: 12, name: 'Children\'s Health Center', location: 'Yaba' },
    ],
    'Neurology': [
      { id: 13, name: 'Brain & Nerve Center', location: 'Ikoyi' },
      { id: 14, name: 'Neurology Clinic', location: 'Lagos Island' },
    ],
    'Dermatology': [
      { id: 15, name: 'Skin Care Clinic', location: 'Victoria Island' },
      { id: 16, name: 'Derma Plus', location: 'Lekki' },
    ],
  };

  const doctors = {
    'Heart & Cardiovascular Center': [
      { id: 1, name: 'Dr. Adeyemi Okonkwo', specialty: 'Cardiologist', experience: '15 years' },
      { id: 2, name: 'Dr. Chioma Nwosu', specialty: 'Cardiologist', experience: '12 years' },
    ],
    'Dental Excellence': [
      { id: 3, name: 'Dr. Tunde Adebayo', specialty: 'Dentist', experience: '10 years' },
      { id: 4, name: 'Dr. Amara Eze', specialty: 'Cosmetic Dentist', experience: '8 years' },
    ],
    'Eye Care Specialists': [
      { id: 5, name: 'Dr. Rasheed Yusuf', specialty: 'Ophthalmologist', experience: '20 years' },
      { id: 6, name: 'Dr. Folake Adenusi', specialty: 'Ophthalmologist', experience: '14 years' },
    ],
    'Bone & Joint Clinic': [
      { id: 7, name: 'Dr. Samuel Okafor', specialty: 'Orthopedic Surgeon', experience: '16 years' },
      { id: 8, name: 'Dr. Linda Ogbe', specialty: 'Orthopedic Surgeon', experience: '11 years' },
    ],
    'Lagos Medical Center': [
      { id: 9, name: 'Dr. Oluseun Bello', specialty: 'General Physician', experience: '18 years' },
      { id: 10, name: 'Dr. Kemi Awolola', specialty: 'General Physician', experience: '13 years' },
    ],
    'Pediatric Care Plus': [
      { id: 11, name: 'Dr. Ifeoma Anyanwu', specialty: 'Pediatrician', experience: '12 years' },
      { id: 12, name: 'Dr. Kunle Adelusi', specialty: 'Pediatrician', experience: '9 years' },
    ],
    'Brain & Nerve Center': [
      { id: 13, name: 'Dr. Emeka Nnamdi', specialty: 'Neurologist', experience: '17 years' },
      { id: 14, name: 'Dr. Ada Obi', specialty: 'Neurologist', experience: '10 years' },
    ],
    'Skin Care Clinic': [
      { id: 15, name: 'Dr. Zainab Mohammed', specialty: 'Dermatologist', experience: '13 years' },
      { id: 16, name: 'Dr. Peter Okoro', specialty: 'Dermatologist', experience: '11 years' },
    ],
  };

  const availableTimes = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const getAvailableHospitals = () => {
    return hospitals[selectedSpecialty] || [];
  };

  const getAvailableDoctors = () => {
    if (!selectedHospital) return [];
    const hospital = getAvailableHospitals().find((h) => h.id === parseInt(selectedHospital));
    return hospital ? doctors[hospital.name] || [] : [];
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    const hospital = getAvailableHospitals().find((h) => h.id === parseInt(selectedHospital));
    const doctor = getAvailableDoctors().find((d) => d.id === parseInt(selectedDoctor));

    const reservation = {
      specialty: selectedSpecialty,
      hospital: hospital.name,
      doctor: doctor.name,
      date: selectedDate,
      time: selectedTime,
      id: `RES-${Date.now()}`,
    };

    setReservationDetails(reservation);
    setStep(5);
  };

  const getNextAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (reservationDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => onNavigate('logged-in')}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed</h1>
            <div className="w-10" />
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 w-full">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
                <CheckCircle className="h-20 w-20 text-green-600 relative" />
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h2>
              <p className="text-slate-600">Your appointment has been successfully booked</p>
              <p className="text-sm text-slate-500 font-mono">ID: {reservationDetails.id}</p>
            </div>

            {/* Reservation Details */}
            <div className="space-y-4 bg-slate-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <User className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Doctor</p>
                  <p className="font-bold text-slate-900">{reservationDetails.doctor}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Hospital</p>
                  <p className="font-bold text-slate-900">{reservationDetails.hospital}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Date</p>
                  <p className="font-bold text-slate-900">{formatDate(reservationDetails.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-600">Time</p>
                  <p className="font-bold text-slate-900">{reservationDetails.time}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedSpecialty('');
                  setSelectedHospital('');
                  setSelectedDoctor('');
                  setSelectedDate('');
                  setSelectedTime('');
                  setReservationDetails(null);
                }}
                className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Book Another
              </button>
              <button
                onClick={() => onNavigate('logged-in')}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Chat
              </button>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                💡 A confirmation SMS and email have been sent to you. Please arrive 15 minutes early.
              </p>
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
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('logged-in')}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="h-6 w-6 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Book a Doctor</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
                    s <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      s < step ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-2">
            <span>Specialty</span>
            <span>Hospital</span>
            <span>Doctor</span>
            <span>Date & Time</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 min-h-96">
          {/* Step 1: Specialty Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Select Medical Specialty
                </h2>
                <p className="text-slate-600">Choose the type of care you need</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedSpecialty === specialty
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{specialty}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Hospital Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Select Hospital/Clinic
                </h2>
                <p className="text-slate-600">Choose your preferred facility for {selectedSpecialty}</p>
              </div>

              <div className="space-y-3">
                {getAvailableHospitals().map((hospital) => (
                  <button
                    key={hospital.id}
                    onClick={() => setSelectedHospital(hospital.id.toString())}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedHospital === hospital.id.toString()
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{hospital.name}</p>
                    <div className="flex items-center gap-2 text-slate-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{hospital.location}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Doctor Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Select Doctor
                </h2>
                <p className="text-slate-600">Choose your preferred doctor</p>
              </div>

              <div className="space-y-3">
                {getAvailableDoctors().map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id.toString())}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedDoctor === doctor.id.toString()
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{doctor.name}</p>
                    <div className="flex justify-between text-slate-600 mt-1 text-sm">
                      <span>{doctor.specialty}</span>
                      <span>{doctor.experience} experience</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Date & Time Selection */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Choose Date & Time
                </h2>
                <p className="text-slate-600">Select your preferred appointment slot</p>
              </div>

              <div className="space-y-6">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Select Date
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {getNextAvailableDates().slice(0, 20).map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          selectedDate === date
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs text-slate-600">{formatDate(date).split(' ')[0]}</div>
                        <div>{formatDate(date).split(' ')[2]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Picker */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg border font-medium transition-all text-sm ${
                            selectedTime === time
                              ? 'border-blue-600 bg-blue-50 text-blue-600'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-8 border-t border-slate-200">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !selectedSpecialty) ||
                  (step === 2 && !selectedHospital) ||
                  (step === 3 && !selectedDoctor)
                }
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
