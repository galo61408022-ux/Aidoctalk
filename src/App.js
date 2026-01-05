import { useState, useEffect } from 'react';
import { GuestChat } from './GuestChat.jsx';
import { AuthScreen } from './AuthScreen';
import { HospitalLocator } from './HospitalLocator.jsx';
import { LoggedInChat } from './LoggedInChat';
import { HospitalSearch } from './HospitalSearch.jsx';
import { DoctorReservation } from './DoctorReservation.jsx';
import { HealthArticles } from './HealthArticles.jsx';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    // Try to restore the last screen from localStorage
    const savedScreen = localStorage.getItem('currentScreen');
    return savedScreen || 'guest';
  });
  const { isAuthenticated, isLoading } = useAuth();

  // Update screen when user authentication state changes
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // If user is logged in but on auth screen, go to their saved screen or logged-in
        if (currentScreen === 'auth') {
          setCurrentScreen('logged-in');
          localStorage.setItem('currentScreen', 'logged-in');
        }
      } else {
        // If user is not logged in and on a protected screen, go to guest
        if (currentScreen === 'logged-in' || currentScreen === 'hospital' || currentScreen === 'hospital-search' || currentScreen === 'doctor-reservation' || currentScreen === 'health-articles') {
          setCurrentScreen('guest');
          localStorage.setItem('currentScreen', 'guest');
        }
      }
    }
  }, [isAuthenticated, isLoading, currentScreen]);

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    localStorage.setItem('currentScreen', screen);
  };

  const handleLogin = () => {
    setCurrentScreen('logged-in');
    localStorage.setItem('currentScreen', 'logged-in');
  };

  const handleLogout = () => {
    setCurrentScreen('guest');
    localStorage.setItem('currentScreen', 'guest');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {currentScreen === 'guest' && (
            <GuestChat onNavigate={handleNavigate} />
          )}
          {currentScreen === 'auth' && (
            <AuthScreen onLogin={handleLogin} onNavigate={handleNavigate} />
          )}
          {currentScreen === 'hospital' && isAuthenticated && (
            <HospitalLocator onNavigate={handleNavigate} isLoggedIn={isAuthenticated} />
          )}
          {currentScreen === 'hospital-search' && isAuthenticated && (
            <HospitalSearch onNavigate={handleNavigate} />
          )}
          {currentScreen === 'doctor-reservation' && isAuthenticated && (
            <DoctorReservation onNavigate={handleNavigate} />
          )}
          {currentScreen === 'health-articles' && isAuthenticated && (
            <HealthArticles onNavigate={handleNavigate} />
          )}
          {currentScreen === 'logged-in' && isAuthenticated && (
            <LoggedInChat onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          
          {/* Fallback: if we're on a protected screen and user is not authenticated, show guest */}
          {!isAuthenticated && (currentScreen === 'logged-in' || currentScreen === 'hospital' || currentScreen === 'hospital-search' || currentScreen === 'doctor-reservation' || currentScreen === 'health-articles') && (
            <GuestChat onNavigate={handleNavigate} />
          )}
          
          {/* Safety fallback: Always show something if nothing matched */}
          {currentScreen !== 'guest' && currentScreen !== 'auth' && currentScreen !== 'hospital' && currentScreen !== 'logged-in' && currentScreen !== 'hospital-search' && currentScreen !== 'doctor-reservation' && currentScreen !== 'health-articles' && (
            <GuestChat onNavigate={handleNavigate} />
          )}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;