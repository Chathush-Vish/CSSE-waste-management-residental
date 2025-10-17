// Mock bin sensor data service
class BinService {
  constructor() {
    // Mock bin data to simulate sensor readings
    this.mockBins = {
      'BIN001': {
        id: 'BIN001',
        location: 'Main Street, Block A',
        wasteType: 'organic',
        weight: 2.5,
        fillLevel: 75,
        lastUpdated: new Date().toISOString(),
        sensorData: {
          temperature: 22,
          humidity: 65,
          gasLevel: 'normal'
        }
      },
      'BIN002': {
        id: 'BIN002',
        location: 'Park Avenue, Block B',
        wasteType: 'plastic',
        weight: 1.8,
        fillLevel: 60,
        lastUpdated: new Date().toISOString(),
        sensorData: {
          temperature: 25,
          humidity: 58,
          gasLevel: 'low'
        }
      },
      'BIN003': {
        id: 'BIN003',
        location: 'Shopping Center, Block C',
        wasteType: 'paper',
        weight: 3.2,
        fillLevel: 90,
        lastUpdated: new Date().toISOString(),
        sensorData: {
          temperature: 20,
          humidity: 70,
          gasLevel: 'normal'
        }
      },
      'BIN004': {
        id: 'BIN004',
        location: 'Residential Area, Block D',
        wasteType: 'glass',
        weight: 4.1,
        fillLevel: 45,
        lastUpdated: new Date().toISOString(),
        sensorData: {
          temperature: 18,
          humidity: 55,
          gasLevel: 'low'
        }
      },
      'BIN005': {
        id: 'BIN005',
        location: 'Industrial Zone, Block E',
        wasteType: 'metal',
        weight: 2.8,
        fillLevel: 85,
        lastUpdated: new Date().toISOString(),
        sensorData: {
          temperature: 24,
          humidity: 62,
          gasLevel: 'high'
        }
      }
    };

    // Mock collection history
    this.collectionHistory = JSON.parse(localStorage.getItem('collectionHistory') || '[]');
  }

  // Simulate fetching bin data from QR code
  async getBinData(qrCode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const binData = this.mockBins[qrCode.toUpperCase()];
        if (binData) {
          // Simulate sensor reading variations
          const variation = (Math.random() - 0.5) * 0.5; // ±0.25kg variation
          const updatedBinData = {
            ...binData,
            weight: Math.max(0.1, binData.weight + variation),
            fillLevel: Math.min(100, Math.max(0, binData.fillLevel + Math.floor((Math.random() - 0.5) * 10))),
            lastUpdated: new Date().toISOString()
          };
          resolve(updatedBinData);
        } else {
          reject(new Error('Bin not found'));
        }
      }, 1000); // Simulate network delay
    });
  }

  // Process waste collection
  async processCollection(collectionData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Add to collection history
        this.collectionHistory.unshift(collectionData);
        
        // Keep only last 50 collections
        if (this.collectionHistory.length > 50) {
          this.collectionHistory = this.collectionHistory.slice(0, 50);
        }
        
        // Save to localStorage
        localStorage.setItem('collectionHistory', JSON.stringify(this.collectionHistory));
        
        resolve(collectionData);
      }, 500);
    });
  }

  // Get collection history for a user
  async getCollectionHistory(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userCollections = this.collectionHistory.filter(
          collection => collection.userId === userId
        );
        resolve(userCollections);
      }, 300);
    });
  }

  // Get all bins (for admin)
  async getAllBins() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(this.mockBins));
      }, 500);
    });
  }

  // Update bin data (for admin)
  async updateBinData(binId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.mockBins[binId]) {
          this.mockBins[binId] = {
            ...this.mockBins[binId],
            ...updates,
            lastUpdated: new Date().toISOString()
          };
          resolve(this.mockBins[binId]);
        } else {
          reject(new Error('Bin not found'));
        }
      }, 500);
    });
  }

  // Get bin statistics
  async getBinStatistics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bins = Object.values(this.mockBins);
        const stats = {
          totalBins: bins.length,
          averageFillLevel: bins.reduce((sum, bin) => sum + bin.fillLevel, 0) / bins.length,
          fullBins: bins.filter(bin => bin.fillLevel >= 80).length,
          wasteTypeDistribution: bins.reduce((acc, bin) => {
            acc[bin.wasteType] = (acc[bin.wasteType] || 0) + 1;
            return acc;
          }, {}),
          totalWeight: bins.reduce((sum, bin) => sum + bin.weight, 0)
        };
        resolve(stats);
      }, 500);
    });
  }
}

export const binService = new BinService();
