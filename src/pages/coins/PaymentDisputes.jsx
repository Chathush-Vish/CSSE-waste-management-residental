import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { disputeService } from '../../services/disputeService';

const PaymentDisputes = ({ user }) => {
  const [disputes, setDisputes] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDispute, setNewDispute] = useState({
    transactionId: '',
    amount: '',
    reason: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      const data = await disputeService.getUserDisputes(user.id);
      setDisputes(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load disputes' });
    }
  };

  const handleSubmitDispute = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dispute = {
        ...newDispute,
        userId: user.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
        id: Date.now().toString()
      };

      await disputeService.createDispute(dispute);
      setDisputes([dispute, ...disputes]);
      setNewDispute({ transactionId: '', amount: '', reason: '', description: '' });
      setShowCreateForm(false);
      setMessage({ type: 'success', text: 'Dispute submitted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit dispute' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
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
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Disputes</h1>
        <p className="text-gray-600">File disputes for failed payments and track their status</p>
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
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          File New Dispute
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create Payment Dispute</h2>
          
          <form onSubmit={handleSubmitDispute} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID
              </label>
              <input
                type="text"
                required
                value={newDispute.transactionId}
                onChange={(e) => setNewDispute({...newDispute, transactionId: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter transaction ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={newDispute.amount}
                onChange={(e) => setNewDispute({...newDispute, amount: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter disputed amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <select
                required
                value={newDispute.reason}
                onChange={(e) => setNewDispute({...newDispute, reason: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a reason</option>
                <option value="payment_failed">Payment Failed</option>
                <option value="double_charge">Double Charge</option>
                <option value="service_not_received">Service Not Received</option>
                <option value="technical_error">Technical Error</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={newDispute.description}
                onChange={(e) => setNewDispute({...newDispute, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide detailed description of the issue"
              />
            </div>

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
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {disputes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No disputes found</p>
            <p className="text-gray-400">File a dispute if you have payment issues</p>
          </div>
        ) : (
          disputes.map((dispute) => (
            <div key={dispute.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Dispute #{dispute.id}
                  </h3>
                  <p className="text-gray-600">Transaction: {dispute.transactionId}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(dispute.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dispute.status)}`}>
                    {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold">${dispute.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reason</p>
                  <p className="font-semibold">{dispute.reason.replace('_', ' ').toUpperCase()}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-800">{dispute.description}</p>
              </div>

              <div className="text-sm text-gray-500">
                Filed on: {new Date(dispute.createdAt).toLocaleDateString()}
              </div>

              {dispute.adminResponse && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">Admin Response:</p>
                  <p className="text-blue-700">{dispute.adminResponse}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentDisputes;
