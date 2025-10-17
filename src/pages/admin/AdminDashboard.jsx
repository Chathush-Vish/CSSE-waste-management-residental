import { useState, useEffect } from 'react';
import { Users, AlertTriangle, DollarSign, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { disputeService } from '../../services/disputeService';
import { complaintService } from '../../services/complaintService';

const AdminDashboard = () => {
  const [disputes, setDisputes] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingDisputes: 0,
    pendingComplaints: 0,
    totalRevenue: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [disputesData, complaintsData] = await Promise.all([
        disputeService.getAllDisputes(),
        complaintService.getAllComplaints()
      ]);

      setDisputes(disputesData);
      setComplaints(complaintsData);

      // Calculate stats
      setStats({
        totalUsers: 150, // Mock data
        pendingDisputes: disputesData.filter(d => d.status === 'pending').length,
        pendingComplaints: complaintsData.filter(c => c.status === 'pending').length,
        totalRevenue: 12500 // Mock data
      });
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const handleDisputeAction = async (disputeId, action, response = '') => {
    setLoading(true);
    try {
      await disputeService.updateDisputeStatus(disputeId, action, response);
      
      setDisputes(disputes.map(dispute => 
        dispute.id === disputeId 
          ? { ...dispute, status: action, adminResponse: response }
          : dispute
      ));
    } catch (error) {
      console.error('Failed to update dispute:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintAction = async (complaintId, action, response = '') => {
    setLoading(true);
    try {
      await complaintService.updateComplaintStatus(complaintId, action, response);
      
      setComplaints(complaints.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, status: action, adminResponse: response, updatedAt: new Date().toISOString() }
          : complaint
      ));
    } catch (error) {
      console.error('Failed to update complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 mr-4`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage disputes, complaints, and system overview</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'disputes', name: 'Payment Disputes' },
              { id: 'complaints', name: 'Complaints' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              title="Total Users"
              value={stats.totalUsers}
              color="blue"
            />
            <StatCard
              icon={AlertTriangle}
              title="Pending Disputes"
              value={stats.pendingDisputes}
              color="yellow"
            />
            <StatCard
              icon={Trash2}
              title="Pending Complaints"
              value={stats.pendingComplaints}
              color="red"
            />
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              color="green"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[...disputes.slice(0, 3), ...complaints.slice(0, 3)]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {item.transactionId ? (
                        <DollarSign className="w-5 h-5 text-yellow-500 mr-3" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.transactionId ? 'Payment Dispute' : 'Complaint'}: {item.reason || item.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'approved' || item.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {disputes.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No disputes to review</p>
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
                    <p className="text-gray-600">Amount: ${dispute.amount}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    dispute.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    dispute.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {dispute.status}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Reason:</p>
                  <p className="font-medium">{dispute.reason.replace('_', ' ').toUpperCase()}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Description:</p>
                  <p className="text-gray-800">{dispute.description}</p>
                </div>

                {dispute.status === 'pending' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleDisputeAction(dispute.id, 'approved', 'Refund processed successfully')}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Refund
                    </button>
                    <button
                      onClick={() => handleDisputeAction(dispute.id, 'rejected', 'Dispute rejected after review')}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                )}

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
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No complaints to review</p>
            </div>
          ) : (
            complaints.map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {complaint.title}
                    </h3>
                    <p className="text-gray-600">From: {complaint.userName}</p>
                    <p className="text-gray-600">Category: {complaint.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-800">{complaint.description}</p>
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

                {complaint.status === 'pending' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleComplaintAction(complaint.id, 'in_progress', 'We are investigating your complaint')}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => handleComplaintAction(complaint.id, 'resolved', 'Issue has been resolved')}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </button>
                  </div>
                )}

                {complaint.adminResponse && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">Admin Response:</p>
                    <p className="text-blue-700">{complaint.adminResponse}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
