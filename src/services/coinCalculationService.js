// Strategy Pattern for different waste type calculations
class WasteCalculationStrategy {
  calculateCoins(weight) {
    throw new Error('calculateCoins method must be implemented');
  }
}

class OrganicWasteStrategy extends WasteCalculationStrategy {
  calculateCoins(weight) {
    // Organic waste: 2 coins per kg
    return Math.ceil(weight * 2);
  }
}

class PlasticWasteStrategy extends WasteCalculationStrategy {
  calculateCoins(weight) {
    // Plastic waste: 3 coins per kg (higher cost due to processing)
    return Math.ceil(weight * 3);
  }
}

class PaperWasteStrategy extends WasteCalculationStrategy {
  calculateCoins(weight) {
    // Paper waste: 1.5 coins per kg
    return Math.ceil(weight * 1.5);
  }
}

class GlassWasteStrategy extends WasteCalculationStrategy {
  calculateCoins(weight) {
    // Glass waste: 2.5 coins per kg
    return Math.ceil(weight * 2.5);
  }
}

class MetalWasteStrategy extends WasteCalculationStrategy {
  calculateCoins(weight) {
    // Metal waste: 4 coins per kg (highest cost)
    return Math.ceil(weight * 4);
  }
}

// Factory Pattern for creating calculation strategies
class WasteCalculationStrategyFactory {
  static createStrategy(wasteType) {
    switch (wasteType.toLowerCase()) {
      case 'organic':
        return new OrganicWasteStrategy();
      case 'plastic':
        return new PlasticWasteStrategy();
      case 'paper':
        return new PaperWasteStrategy();
      case 'glass':
        return new GlassWasteStrategy();
      case 'metal':
        return new MetalWasteStrategy();
      default:
        throw new Error(`Unknown waste type: ${wasteType}`);
    }
  }

  static getSupportedWasteTypes() {
    return ['organic', 'plastic', 'paper', 'glass', 'metal'];
  }

  static getWasteTypeInfo() {
    return {
      organic: { rate: 2, description: 'Biodegradable waste' },
      plastic: { rate: 3, description: 'Recyclable plastic materials' },
      paper: { rate: 1.5, description: 'Paper and cardboard' },
      glass: { rate: 2.5, description: 'Glass containers and materials' },
      metal: { rate: 4, description: 'Metal cans and materials' }
    };
  }
}

// Context class that uses the strategy
class CoinCalculationService {
  calculateCoins(wasteType, weight) {
    try {
      const strategy = WasteCalculationStrategyFactory.createStrategy(wasteType);
      return strategy.calculateCoins(weight);
    } catch (error) {
      console.error('Error calculating coins:', error);
      // Default calculation if waste type is unknown
      return Math.ceil(weight * 2);
    }
  }

  getCalculationDetails(wasteType, weight) {
    const coins = this.calculateCoins(wasteType, weight);
    const wasteInfo = WasteCalculationStrategyFactory.getWasteTypeInfo();
    const typeInfo = wasteInfo[wasteType.toLowerCase()];

    return {
      wasteType,
      weight,
      coinsRequired: coins,
      ratePerKg: typeInfo?.rate || 2,
      description: typeInfo?.description || 'Unknown waste type'
    };
  }

  getSupportedWasteTypes() {
    return WasteCalculationStrategyFactory.getSupportedWasteTypes();
  }

  getWasteTypeRates() {
    return WasteCalculationStrategyFactory.getWasteTypeInfo();
  }
}

// Export singleton instance
export const coinCalculationService = new CoinCalculationService();
