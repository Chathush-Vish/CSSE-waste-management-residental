// Dispute service for payment disputes
class DisputeService {
  constructor() {
    this.disputes = JSON.parse(localStorage.getItem('paymentDisputes') || '[]');
  }

  // Create new dispute
  async createDispute(disputeData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dispute = {
          ...disputeData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'pending'
        };

        this.disputes.unshift(dispute);
        this.saveDisputes();
        resolve(dispute);
      }, 500);
    });
  }

  // Get disputes for a specific user
  async getUserDisputes(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userDisputes = this.disputes.filter(dispute => dispute.userId === userId);
        resolve(userDisputes);
      }, 300);
    });
  }

  // Get all disputes (for admin)
  async getAllDisputes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.disputes]);
      }, 400);
    });
  }

  // Update dispute status (admin action)
  async updateDisputeStatus(disputeId, status, adminResponse = '') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const disputeIndex = this.disputes.findIndex(d => d.id === disputeId);
        
        if (disputeIndex === -1) {
          reject(new Error('Dispute not found'));
          return;
        }

        this.disputes[disputeIndex] = {
          ...this.disputes[disputeIndex],
          status,
          adminResponse,
          updatedAt: new Date().toISOString(),
          resolvedAt: status !== 'pending' ? new Date().toISOString() : null
        };

        this.saveDisputes();
        resolve(this.disputes[disputeIndex]);
      }, 600);
    });
  }

  // Get dispute by ID
  async getDisputeById(disputeId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const dispute = this.disputes.find(d => d.id === disputeId);
        if (dispute) {
          resolve(dispute);
        } else {
          reject(new Error('Dispute not found'));
        }
      }, 300);
    });
  }

  // Get dispute statistics
  async getDisputeStatistics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalDisputes: this.disputes.length,
          pendingDisputes: this.disputes.filter(d => d.status === 'pending').length,
          approvedDisputes: this.disputes.filter(d => d.status === 'approved').length,
          rejectedDisputes: this.disputes.filter(d => d.status === 'rejected').length,
          totalRefundAmount: this.disputes
            .filter(d => d.status === 'approved')
            .reduce((sum, d) => sum + parseFloat(d.amount), 0),
          averageResolutionTime: this.calculateAverageResolutionTime(),
          disputesByReason: this.disputes.reduce((acc, dispute) => {
            acc[dispute.reason] = (acc[dispute.reason] || 0) + 1;
            return acc;
          }, {}),
          recentDisputes: this.disputes.slice(0, 10)
        };
        resolve(stats);
      }, 500);
    });
  }

  // Calculate average resolution time
  calculateAverageResolutionTime() {
    const resolvedDisputes = this.disputes.filter(d => d.resolvedAt);
    
    if (resolvedDisputes.length === 0) return 0;

    const totalTime = resolvedDisputes.reduce((sum, dispute) => {
      const created = new Date(dispute.createdAt);
      const resolved = new Date(dispute.resolvedAt);
      return sum + (resolved - created);
    }, 0);

    // Return average time in hours
    return Math.round(totalTime / resolvedDisputes.length / (1000 * 60 * 60));
  }

  // Add comment to dispute
  async addDisputeComment(disputeId, comment, isAdmin = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const disputeIndex = this.disputes.findIndex(d => d.id === disputeId);
        
        if (disputeIndex === -1) {
          reject(new Error('Dispute not found'));
          return;
        }

        if (!this.disputes[disputeIndex].comments) {
          this.disputes[disputeIndex].comments = [];
        }

        const newComment = {
          id: Date.now().toString(),
          text: comment,
          isAdmin,
          timestamp: new Date().toISOString()
        };

        this.disputes[disputeIndex].comments.push(newComment);
        this.disputes[disputeIndex].updatedAt = new Date().toISOString();

        this.saveDisputes();
        resolve(newComment);
      }, 400);
    });
  }

  // Save disputes to localStorage
  saveDisputes() {
    localStorage.setItem('paymentDisputes', JSON.stringify(this.disputes));
  }

  // Get disputes by status
  async getDisputesByStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredDisputes = this.disputes.filter(d => d.status === status);
        resolve(filteredDisputes);
      }, 300);
    });
  }

  // Search disputes
  async searchDisputes(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchResults = this.disputes.filter(dispute => 
          dispute.transactionId.toLowerCase().includes(query.toLowerCase()) ||
          dispute.reason.toLowerCase().includes(query.toLowerCase()) ||
          dispute.description.toLowerCase().includes(query.toLowerCase())
        );
        resolve(searchResults);
      }, 400);
    });
  }
}

export const disputeService = new DisputeService();
