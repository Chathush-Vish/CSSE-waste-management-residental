import { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';

const FeedbackRating = ({ user }) => {
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
    category: 'general'
  });
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadFeedbackHistory();
  }, []);

  const loadFeedbackHistory = async () => {
    try {
      const history = await feedbackService.getUserFeedback(user.id);
      setFeedbackHistory(history);
    } catch (error) {
      console.error('Failed to load feedback history:', error);
    }
  };

  const handleRatingClick = (rating) => {
    setFeedback({ ...feedback, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (feedback.rating === 0) {
      setMessage({ type: 'error', text: 'Please provide a rating' });
      return;
    }

    setLoading(true);
    try {
      const newFeedback = {
        ...feedback,
        id: Date.now().toString(),
        userId: user.id,
        userName: user.username,
        timestamp: new Date().toISOString()
      };

      await feedbackService.submitFeedback(newFeedback);
      setFeedbackHistory([newFeedback, ...feedbackHistory]);
      setFeedback({ rating: 0, comment: '', category: 'general' });
      setMessage({ type: 'success', text: 'Feedback submitted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit feedback' });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false, size = 'w-8 h-8') => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`${size} cursor-pointer transition-colors ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={interactive ? () => handleRatingClick(index + 1) : undefined}
      />
    ));
  };

  const getRatingText = (rating) => {
    const texts = {
      1: 'Very Poor',
      2: 'Poor',
      3: 'Average',
      4: 'Good',
      5: 'Excellent'
    };
    return texts[rating] || '';
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      collection: 'bg-green-100 text-green-800',
      payment: 'bg-yellow-100 text-yellow-800',
      support: 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Feedback & Rating</h1>
        <p className="text-gray-600">Share your experience with our waste collection service</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Feedback Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Submit Feedback</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={feedback.category}
              onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general">General Service</option>
              <option value="collection">Waste Collection</option>
              <option value="payment">Payment System</option>
              <option value="support">Customer Support</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-2 mb-2">
              {renderStars(feedback.rating, true)}
            </div>
            {feedback.rating > 0 && (
              <p className="text-sm text-gray-600">{getRatingText(feedback.rating)}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments (Optional)
            </label>
            <textarea
              rows={4}
              value={feedback.comment}
              onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your thoughts about our service..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || feedback.rating === 0}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      {/* Feedback History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Feedback History</h2>
        
        {feedbackHistory.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No feedback submitted yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbackHistory.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(item.category)}`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(item.rating, false, 'w-5 h-5')}
                      <span className="text-sm text-gray-600 ml-2">
                        ({getRatingText(item.rating)})
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                
                {item.comment && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{item.comment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overall Statistics */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Feedback Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {feedbackHistory.length}
            </div>
            <p className="text-gray-600">Total Feedback</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {feedbackHistory.length > 0 
                ? (feedbackHistory.reduce((sum, item) => sum + item.rating, 0) / feedbackHistory.length).toFixed(1)
                : '0.0'
              }
            </div>
            <p className="text-gray-600">Average Rating</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {feedbackHistory.filter(item => item.rating >= 4).length}
            </div>
            <p className="text-gray-600">Positive Reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackRating;
