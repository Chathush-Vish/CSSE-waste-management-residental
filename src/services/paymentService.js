// Mock payment service
class PaymentService {
  constructor() {
    this.mockAccounts = {
      '1234567890123456': { balance: 1000, status: 'active' },
      '9876543210987654': { balance: 500, status: 'active' },
      '1111222233334444': { balance: 2000, status: 'active' },
      '5555666677778888': { balance: 50, status: 'active' },
      '0000111122223333': { balance: 0, status: 'blocked' }
    };

    this.transactionHistory = JSON.parse(localStorage.getItem('paymentTransactions') || '[]');
  }

  // Process payment with mock validation
  async processPayment(paymentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { amount, accountBalance, cardNumber, packageId } = paymentData;
        
        // Simulate payment processing
        const transaction = {
          id: this.generateTransactionId(),
          cardNumber: cardNumber.replace(/\d(?=\d{4})/g, '*'),
          amount,
          packageId,
          timestamp: new Date().toISOString(),
          status: 'pending'
        };

        // Mock payment validation logic
        const account = this.mockAccounts[cardNumber];
        const hasValidCard = this.isValidCardNumber(cardNumber);
        const hasSufficientFunds = accountBalance >= amount;
        
        // Simulate random payment failures (10% chance)
        const randomFailure = Math.random() < 0.1;

        if (!hasValidCard) {
          transaction.status = 'failed';
          transaction.errorMessage = 'Invalid card number';
          this.saveTransaction(transaction);
          resolve({
            success: false,
            message: 'Invalid card number',
            transactionId: transaction.id
          });
        } else if (!hasSufficientFunds) {
          transaction.status = 'failed';
          transaction.errorMessage = 'Insufficient funds';
          this.saveTransaction(transaction);
          resolve({
            success: false,
            message: 'Insufficient funds in account',
            transactionId: transaction.id
          });
        } else if (account && account.status === 'blocked') {
          transaction.status = 'failed';
          transaction.errorMessage = 'Account blocked';
          this.saveTransaction(transaction);
          resolve({
            success: false,
            message: 'Account is blocked',
            transactionId: transaction.id
          });
        } else if (randomFailure) {
          transaction.status = 'failed';
          transaction.errorMessage = 'Payment gateway error';
          this.saveTransaction(transaction);
          resolve({
            success: false,
            message: 'Payment processing failed. Please try again.',
            transactionId: transaction.id
          });
        } else {
          // Successful payment
          transaction.status = 'completed';
          this.saveTransaction(transaction);
          
          // Update mock account balance
          if (account) {
            account.balance -= amount;
          }

          resolve({
            success: true,
            message: 'Payment processed successfully',
            transactionId: transaction.id,
            transaction
          });
        }
      }, 2000); // Simulate processing time
    });
  }

  // Validate card number (basic Luhn algorithm)
  isValidCardNumber(cardNumber) {
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      return false;
    }

    // Remove spaces and non-digits
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    // Basic validation - check if it's in our mock accounts or follows basic pattern
    return this.mockAccounts.hasOwnProperty(cleanNumber) || /^\d{13,19}$/.test(cleanNumber);
  }

  // Generate mock transaction ID
  generateTransactionId() {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
  }

  // Save transaction to history
  saveTransaction(transaction) {
    this.transactionHistory.unshift(transaction);
    
    // Keep only last 100 transactions
    if (this.transactionHistory.length > 100) {
      this.transactionHistory = this.transactionHistory.slice(0, 100);
    }

    localStorage.setItem('paymentTransactions', JSON.stringify(this.transactionHistory));
  }

  // Get transaction by ID
  async getTransaction(transactionId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const transaction = this.transactionHistory.find(t => t.id === transactionId);
        if (transaction) {
          resolve(transaction);
        } else {
          reject(new Error('Transaction not found'));
        }
      }, 300);
    });
  }

  // Get user transaction history
  async getUserTransactions(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, transactions would be linked to user ID
        // For now, return all transactions (mock data)
        resolve([...this.transactionHistory]);
      }, 400);
    });
  }

  // Process refund
  async processRefund(transactionId, reason) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const transaction = this.transactionHistory.find(t => t.id === transactionId);
        
        if (!transaction) {
          reject(new Error('Transaction not found'));
          return;
        }

        if (transaction.status !== 'completed') {
          reject(new Error('Cannot refund non-completed transaction'));
          return;
        }

        // Create refund transaction
        const refund = {
          id: this.generateTransactionId(),
          originalTransactionId: transactionId,
          amount: transaction.amount,
          type: 'refund',
          reason,
          timestamp: new Date().toISOString(),
          status: 'completed'
        };

        this.saveTransaction(refund);

        // Update original transaction
        transaction.refunded = true;
        transaction.refundId = refund.id;
        this.saveTransaction(transaction);

        resolve({
          success: true,
          message: 'Refund processed successfully',
          refundId: refund.id,
          refund
        });
      }, 1500);
    });
  }

  // Get payment statistics (for admin)
  async getPaymentStatistics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const completedTransactions = this.transactionHistory.filter(t => t.status === 'completed' && t.type !== 'refund');
        const failedTransactions = this.transactionHistory.filter(t => t.status === 'failed');
        const refunds = this.transactionHistory.filter(t => t.type === 'refund');

        const stats = {
          totalTransactions: this.transactionHistory.length,
          completedTransactions: completedTransactions.length,
          failedTransactions: failedTransactions.length,
          totalRevenue: completedTransactions.reduce((sum, t) => sum + t.amount, 0),
          totalRefunds: refunds.reduce((sum, t) => sum + t.amount, 0),
          successRate: completedTransactions.length / (completedTransactions.length + failedTransactions.length) * 100,
          recentTransactions: this.transactionHistory.slice(0, 10)
        };

        resolve(stats);
      }, 500);
    });
  }
}

export const paymentService = new PaymentService();
