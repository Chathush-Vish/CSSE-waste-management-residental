// Coin package service
class CoinPackageService {
  constructor() {
    this.packages = [
      {
        id: 'starter',
        name: 'Starter Pack',
        coins: 50,
        price: 9.99,
        description: 'Perfect for occasional waste collection',
        popular: false
      },
      {
        id: 'standard',
        name: 'Standard Pack',
        coins: 120,
        price: 19.99,
        description: 'Great value for regular users',
        popular: true
      },
      {
        id: 'premium',
        name: 'Premium Pack',
        coins: 250,
        price: 34.99,
        description: 'Best value for heavy users',
        popular: false
      },
      {
        id: 'family',
        name: 'Family Pack',
        coins: 500,
        price: 59.99,
        description: 'Ideal for large families',
        popular: false
      },
      {
        id: 'business',
        name: 'Business Pack',
        coins: 1000,
        price: 99.99,
        description: 'For small businesses and offices',
        popular: false
      }
    ];

    // Load purchase history from localStorage
    this.purchaseHistory = JSON.parse(localStorage.getItem('coinPurchaseHistory') || '[]');
  }

  // Get all available packages
  async getAllPackages() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.packages]);
      }, 300);
    });
  }

  // Get package by ID
  async getPackageById(packageId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const pkg = this.packages.find(p => p.id === packageId);
        if (pkg) {
          resolve({ ...pkg });
        } else {
          reject(new Error('Package not found'));
        }
      }, 200);
    });
  }

  // Record package purchase
  async recordPurchase(userId, packageId, transactionData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const purchase = {
          id: Date.now().toString(),
          userId,
          packageId,
          ...transactionData,
          timestamp: new Date().toISOString(),
          status: 'completed'
        };

        this.purchaseHistory.unshift(purchase);
        
        // Keep only last 100 purchases
        if (this.purchaseHistory.length > 100) {
          this.purchaseHistory = this.purchaseHistory.slice(0, 100);
        }

        localStorage.setItem('coinPurchaseHistory', JSON.stringify(this.purchaseHistory));
        resolve(purchase);
      }, 500);
    });
  }

  // Get user purchase history
  async getUserPurchaseHistory(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userPurchases = this.purchaseHistory.filter(
          purchase => purchase.userId === userId
        );
        resolve(userPurchases);
      }, 300);
    });
  }

  // Get package statistics (for admin)
  async getPackageStatistics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalPurchases: this.purchaseHistory.length,
          totalRevenue: this.purchaseHistory.reduce((sum, purchase) => sum + purchase.amount, 0),
          popularPackages: this.purchaseHistory.reduce((acc, purchase) => {
            acc[purchase.packageId] = (acc[purchase.packageId] || 0) + 1;
            return acc;
          }, {}),
          recentPurchases: this.purchaseHistory.slice(0, 10)
        };
        resolve(stats);
      }, 400);
    });
  }

  // Calculate package value (coins per dollar)
  getPackageValue(pkg) {
    return (pkg.coins / pkg.price).toFixed(2);
  }

  // Get recommended package based on usage
  getRecommendedPackage(monthlyCollections) {
    const estimatedCoinsNeeded = monthlyCollections * 3; // Assume 3 coins per collection on average
    
    const suitablePackages = this.packages.filter(pkg => pkg.coins >= estimatedCoinsNeeded);
    
    if (suitablePackages.length === 0) {
      return this.packages[this.packages.length - 1]; // Return largest package
    }
    
    // Return the smallest suitable package (best value)
    return suitablePackages.reduce((best, current) => 
      current.coins < best.coins ? current : best
    );
  }
}

export const coinPackageService = new CoinPackageService();
