// Complaint service
class ComplaintService {
  constructor() {
    this.complaints = JSON.parse(localStorage.getItem('userComplaints') || '[]');
  }

  // Create new complaint
  async createComplaint(complaintData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const complaint = {
          ...complaintData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'pending'
        };

        this.complaints.unshift(complaint);
        this.saveComplaints();
        resolve(complaint);
      }, 500);
    });
  }

  // Get complaints for a specific user
  async getUserComplaints(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userComplaints = this.complaints.filter(complaint => complaint.userId === userId);
        resolve(userComplaints);
      }, 300);
    });
  }

  // Get all complaints (for admin)
  async getAllComplaints() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.complaints]);
      }, 400);
    });
  }

  // Update complaint status (admin action)
  async updateComplaintStatus(complaintId, status, adminResponse = '') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaintIndex = this.complaints.findIndex(c => c.id === complaintId);
        
        if (complaintIndex === -1) {
          reject(new Error('Complaint not found'));
          return;
        }

        this.complaints[complaintIndex] = {
          ...this.complaints[complaintIndex],
          status,
          adminResponse,
          updatedAt: new Date().toISOString(),
          resolvedAt: status === 'resolved' ? new Date().toISOString() : null
        };

        this.saveComplaints();
        resolve(this.complaints[complaintIndex]);
      }, 600);
    });
  }

  // Get complaint by ID
  async getComplaintById(complaintId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaint = this.complaints.find(c => c.id === complaintId);
        if (complaint) {
          resolve(complaint);
        } else {
          reject(new Error('Complaint not found'));
        }
      }, 300);
    });
  }

  // Get complaint statistics
  async getComplaintStatistics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalComplaints: this.complaints.length,
          pendingComplaints: this.complaints.filter(c => c.status === 'pending').length,
          inProgressComplaints: this.complaints.filter(c => c.status === 'in_progress').length,
          resolvedComplaints: this.complaints.filter(c => c.status === 'resolved').length,
          rejectedComplaints: this.complaints.filter(c => c.status === 'rejected').length,
          averageResolutionTime: this.calculateAverageResolutionTime(),
          complaintsByCategory: this.complaints.reduce((acc, complaint) => {
            acc[complaint.category] = (acc[complaint.category] || 0) + 1;
            return acc;
          }, {}),
          complaintsByPriority: this.complaints.reduce((acc, complaint) => {
            acc[complaint.priority] = (acc[complaint.priority] || 0) + 1;
            return acc;
          }, {}),
          recentComplaints: this.complaints.slice(0, 10)
        };
        resolve(stats);
      }, 500);
    });
  }

  // Calculate average resolution time
  calculateAverageResolutionTime() {
    const resolvedComplaints = this.complaints.filter(c => c.resolvedAt);
    
    if (resolvedComplaints.length === 0) return 0;

    const totalTime = resolvedComplaints.reduce((sum, complaint) => {
      const created = new Date(complaint.createdAt);
      const resolved = new Date(complaint.resolvedAt);
      return sum + (resolved - created);
    }, 0);

    // Return average time in hours
    return Math.round(totalTime / resolvedComplaints.length / (1000 * 60 * 60));
  }

  // Get complaints by status
  async getComplaintsByStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredComplaints = this.complaints.filter(c => c.status === status);
        resolve(filteredComplaints);
      }, 300);
    });
  }

  // Get complaints by category
  async getComplaintsByCategory(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categoryComplaints = this.complaints.filter(c => c.category === category);
        resolve(categoryComplaints);
      }, 300);
    });
  }

  // Search complaints
  async searchComplaints(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchResults = this.complaints.filter(complaint => 
          complaint.title.toLowerCase().includes(query.toLowerCase()) ||
          complaint.description.toLowerCase().includes(query.toLowerCase()) ||
          complaint.category.toLowerCase().includes(query.toLowerCase()) ||
          complaint.userName.toLowerCase().includes(query.toLowerCase())
        );
        resolve(searchResults);
      }, 400);
    });
  }

  // Add comment to complaint
  async addComplaintComment(complaintId, comment, isAdmin = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaintIndex = this.complaints.findIndex(c => c.id === complaintId);
        
        if (complaintIndex === -1) {
          reject(new Error('Complaint not found'));
          return;
        }

        if (!this.complaints[complaintIndex].comments) {
          this.complaints[complaintIndex].comments = [];
        }

        const newComment = {
          id: Date.now().toString(),
          text: comment,
          isAdmin,
          timestamp: new Date().toISOString()
        };

        this.complaints[complaintIndex].comments.push(newComment);
        this.complaints[complaintIndex].updatedAt = new Date().toISOString();

        this.saveComplaints();
        resolve(newComment);
      }, 400);
    });
  }

  // Get complaint trends (monthly)
  async getComplaintTrends() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trends = {};
        
        this.complaints.forEach(complaint => {
          const month = new Date(complaint.createdAt).toISOString().slice(0, 7); // YYYY-MM
          if (!trends[month]) {
            trends[month] = {
              total: 0,
              pending: 0,
              resolved: 0,
              categories: {}
            };
          }
          
          trends[month].total++;
          trends[month][complaint.status]++;
          trends[month].categories[complaint.category] = (trends[month].categories[complaint.category] || 0) + 1;
        });

        resolve(trends);
      }, 600);
    });
  }

  // Update complaint (user can edit pending complaints)
  async updateComplaint(complaintId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaintIndex = this.complaints.findIndex(c => c.id === complaintId);
        
        if (complaintIndex === -1) {
          reject(new Error('Complaint not found'));
          return;
        }

        // Only allow updates to pending complaints
        if (this.complaints[complaintIndex].status !== 'pending') {
          reject(new Error('Cannot update complaint that is already being processed'));
          return;
        }

        this.complaints[complaintIndex] = {
          ...this.complaints[complaintIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        this.saveComplaints();
        resolve(this.complaints[complaintIndex]);
      }, 400);
    });
  }

  // Delete complaint (only pending complaints)
  async deleteComplaint(complaintId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaintIndex = this.complaints.findIndex(c => c.id === complaintId);
        
        if (complaintIndex === -1) {
          reject(new Error('Complaint not found'));
          return;
        }

        // Only allow deletion of pending complaints
        if (this.complaints[complaintIndex].status !== 'pending') {
          reject(new Error('Cannot delete complaint that is already being processed'));
          return;
        }

        const deletedComplaint = this.complaints.splice(complaintIndex, 1)[0];
        this.saveComplaints();
        resolve(deletedComplaint);
      }, 400);
    });
  }

  // Save complaints to localStorage
  saveComplaints() {
    localStorage.setItem('userComplaints', JSON.stringify(this.complaints));
  }

  // Get high priority complaints
  async getHighPriorityComplaints() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const highPriorityComplaints = this.complaints.filter(
          c => c.priority === 'high' && c.status !== 'resolved'
        );
        resolve(highPriorityComplaints);
      }, 300);
    });
  }

  // Get overdue complaints (pending for more than 48 hours)
  async getOverdueComplaints() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const overdueComplaints = this.complaints.filter(
          c => c.status === 'pending' && new Date(c.createdAt) < twoDaysAgo
        );
        resolve(overdueComplaints);
      }, 300);
    });
  }
}

export const complaintService = new ComplaintService();
