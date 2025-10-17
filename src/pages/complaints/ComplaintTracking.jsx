import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { complaintService } from '../../services/complaintService';

const ComplaintTracking = ({ user }) => {
  const [complaints, setComplaints] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'collection',
    priority: 'medium',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await complaintService.getUserComplaints(user.id);
      setComplaints(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load complaints' });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewComplaint({ ...newComplaint, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const complaint = {
        ...newComplaint,
        id: Date.now().toString(),
        userId: user.id,
        userName: user.username,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await complaintService.createComplaint(complaint);
      setComplaints([complaint, ...complaints]);
      setNewComplaint({
        title: '',
        description: '',
        category: 'collection',
        priority: 'medium',
        image: null
      });
      setShowCreateForm(false);
      setMessage({ type: 'success', text: 'Complaint submitted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit complaint' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      collection: 'bg-blue-100 text-blue-800',
      payment: 'bg-purple-100 text-purple-800',
      service: 'bg-green-100 text-green-800',
      technical: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Complaint Tracking</h1>
        <p className="text-gray-600">Submit and track complaints about waste collection services</p>
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
            <AlertTriangle className="w-5 h-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          File New Complaint
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Complaint</h2>
          
          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={newComplaint.title}
                onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Brief description of the issue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="collection">Waste Collection</option>
                  <option value="payment">Payment Issues</option>
                  <option value="service">Service Quality</option>
                  <option value="technical">Technical Problems</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newComplaint.priority}
                  onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Provide detailed description of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Image (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {newComplaint.image && (
                  <div className="flex items-center text-green-600">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">Image uploaded</span>
                  </div>
                )}
              </div>
            </div>

            {newComplaint.image && (
              <div className="mt-4">
                <img
                  src={newComplaint.image}
                  alt="Complaint"
                  className="max-w-xs h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No complaints found</p>
            <p className="text-gray-400">File a complaint if you have any issues</p>
          </div>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {complaint.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(complaint.category)}`}>
                      {complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(complaint.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('_', ' ').charAt(0).toUpperCase() + complaint.status.replace('_', ' ').slice(1)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700">{complaint.description}</p>
              </div>

              {complaint.image && (
                <div className="mb-4">
                  <img
                    src={complaint.image}
                    alt="Complaint"
                    className="max-w-xs h-32 object-cover rounded-lg border"
                  />
                </div>
              )}

              <div className="text-sm text-gray-500 mb-4">
                <p>Complaint ID: #{complaint.id}</p>
                <p>Filed on: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(complaint.updatedAt).toLocaleDateString()}</p>
              </div>

              {complaint.adminResponse && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">Admin Response:</p>
                  <p className="text-blue-700">{complaint.adminResponse}</p>
                </div>
              )}

              {complaint.resolution && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">Resolution:</p>
                  <p className="text-green-700">{complaint.resolution}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintTracking;
