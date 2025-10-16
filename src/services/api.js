const API_BASE_URL = 'http://localhost:8080';

export const coinPackageAPI = {
  // Get all available coin packages
  getAllPackages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/coinpackage/getall`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  // Buy a coin package
  buyPackage: async (packageId, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/coinpackage/buy-package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: packageId.toString(),
          userId: userId.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error buying package:', error);
      throw error;
    }
  },
};

export const feedbackAPI = {
  // Publish feedback about waste collection
  publishFeedback: async (feedbackData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error publishing feedback:', error);
      throw error;
    }
  },
};

export default coinPackageAPI;
