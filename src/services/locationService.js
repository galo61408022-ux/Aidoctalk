/**
 * Location Service
 * Handles hospital locator and geolocation functionality
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const locationService = {
  /**
   * Find nearby hospitals
   * @param {number} latitude - User latitude
   * @param {number} longitude - User longitude
   * @param {number} radius - Search radius in km (default: 5)
   * @returns {Promise<Array>} Array of nearby hospitals
   */
  async findNearbyHospitals(latitude, longitude, radius = 5) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/hospitals/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to find nearby hospitals:', error);
      throw error;
    }
  },

  /**
   * Search hospitals by name or location
   * @param {string} query - Search query
   * @returns {Promise<Array>} Search results
   */
  async searchHospitals(query) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/hospitals/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to search hospitals:', error);
      throw error;
    }
  },

  /**
   * Get hospital details
   * @param {string} hospitalId - Hospital ID
   * @returns {Promise<Object>} Hospital details
   */
  async getHospitalDetails(hospitalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch hospital details:', error);
      throw error;
    }
  },

  /**
   * Get user's current geolocation
   * @returns {Promise<Object>} Object with latitude and longitude
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        }
      );
    });
  },
};
