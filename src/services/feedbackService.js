// Feedback service
class FeedbackService {
  constructor() {
    this.feedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
  }

  // Submit new feedback
  async submitFeedback(feedbackData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedback = {
          ...feedbackData,
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        };

        this.feedback.unshift(feedback);
        this.saveFeedback();
        resolve(feedback);
      }, 500);
    });
  }

  // Get feedback for a specific user
  async getUserFeedback(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userFeedback = this.feedback.filter(fb => fb.userId === userId);
        resolve(userFeedback);
      }, 300);
    });
  }

  // Get all feedback (for admin)
  async getAllFeedback() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.feedback]);
      }, 400);
    });
  }

  // Get feedback by category
  async getFeedbackByCategory(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categoryFeedback = this.feedback.filter(fb => fb.category === category);
        resolve(categoryFeedback);
      }, 300);
    });
  }

  // Get feedback statistics
  async getFeedbackStatistics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalFeedback: this.feedback.length,
          averageRating: this.calculateAverageRating(),
          ratingDistribution: this.getRatingDistribution(),
          categoryDistribution: this.getCategoryDistribution(),
          recentFeedback: this.feedback.slice(0, 10),
          positiveRating: this.feedback.filter(fb => fb.rating >= 4).length,
          negativeRating: this.feedback.filter(fb => fb.rating <= 2).length,
          neutralRating: this.feedback.filter(fb => fb.rating === 3).length
        };
        resolve(stats);
      }, 500);
    });
  }

  // Calculate average rating
  calculateAverageRating() {
    if (this.feedback.length === 0) return 0;
    
    const totalRating = this.feedback.reduce((sum, fb) => sum + fb.rating, 0);
    return (totalRating / this.feedback.length).toFixed(1);
  }

  // Get rating distribution
  getRatingDistribution() {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    this.feedback.forEach(fb => {
      distribution[fb.rating]++;
    });

    return distribution;
  }

  // Get category distribution
  getCategoryDistribution() {
    return this.feedback.reduce((acc, fb) => {
      acc[fb.category] = (acc[fb.category] || 0) + 1;
      return acc;
    }, {});
  }

  // Get feedback by rating range
  async getFeedbackByRating(minRating, maxRating) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredFeedback = this.feedback.filter(
          fb => fb.rating >= minRating && fb.rating <= maxRating
        );
        resolve(filteredFeedback);
      }, 300);
    });
  }

  // Search feedback
  async searchFeedback(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchResults = this.feedback.filter(fb => 
          fb.comment.toLowerCase().includes(query.toLowerCase()) ||
          fb.category.toLowerCase().includes(query.toLowerCase()) ||
          fb.userName.toLowerCase().includes(query.toLowerCase())
        );
        resolve(searchResults);
      }, 400);
    });
  }

  // Get feedback trends (monthly)
  async getFeedbackTrends() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trends = {};
        
        this.feedback.forEach(fb => {
          const month = new Date(fb.timestamp).toISOString().slice(0, 7); // YYYY-MM
          if (!trends[month]) {
            trends[month] = {
              count: 0,
              totalRating: 0,
              categories: {}
            };
          }
          
          trends[month].count++;
          trends[month].totalRating += fb.rating;
          trends[month].categories[fb.category] = (trends[month].categories[fb.category] || 0) + 1;
        });

        // Calculate average ratings for each month
        Object.keys(trends).forEach(month => {
          trends[month].averageRating = (trends[month].totalRating / trends[month].count).toFixed(1);
        });

        resolve(trends);
      }, 600);
    });
  }

  // Update feedback (if user wants to edit)
  async updateFeedback(feedbackId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const feedbackIndex = this.feedback.findIndex(fb => fb.id === feedbackId);
        
        if (feedbackIndex === -1) {
          reject(new Error('Feedback not found'));
          return;
        }

        this.feedback[feedbackIndex] = {
          ...this.feedback[feedbackIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        this.saveFeedback();
        resolve(this.feedback[feedbackIndex]);
      }, 400);
    });
  }

  // Delete feedback
  async deleteFeedback(feedbackId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const feedbackIndex = this.feedback.findIndex(fb => fb.id === feedbackId);
        
        if (feedbackIndex === -1) {
          reject(new Error('Feedback not found'));
          return;
        }

        const deletedFeedback = this.feedback.splice(feedbackIndex, 1)[0];
        this.saveFeedback();
        resolve(deletedFeedback);
      }, 400);
    });
  }

  // Save feedback to localStorage
  saveFeedback() {
    localStorage.setItem('userFeedback', JSON.stringify(this.feedback));
  }

  // Get top rated services/categories
  async getTopRatedCategories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categoryRatings = {};
        
        this.feedback.forEach(fb => {
          if (!categoryRatings[fb.category]) {
            categoryRatings[fb.category] = {
              totalRating: 0,
              count: 0
            };
          }
          
          categoryRatings[fb.category].totalRating += fb.rating;
          categoryRatings[fb.category].count++;
        });

        const topCategories = Object.keys(categoryRatings)
          .map(category => ({
            category,
            averageRating: (categoryRatings[category].totalRating / categoryRatings[category].count).toFixed(1),
            count: categoryRatings[category].count
          }))
          .sort((a, b) => b.averageRating - a.averageRating);

        resolve(topCategories);
      }, 400);
    });
  }
}

export const feedbackService = new FeedbackService();
