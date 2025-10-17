import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ApiStatus = () => {
  const [apiStatus, setApiStatus] = useState({
    complaints: 'checking',
    message: 'Checking API connection...'
  });

  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/complaints/admin/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setApiStatus({
          complaints: 'connected',
          message: 'API connected successfully'
        });
      } else {
        setApiStatus({
          complaints: 'error',
          message: `API error: ${response.status} ${response.statusText}`
        });
      }
    } catch (error) {
      setApiStatus({
        complaints: 'offline',
        message: 'API offline - using localStorage fallback'
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'offline':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className={`mb-4 p-3 rounded-lg border flex items-center ${getStatusColor(apiStatus.complaints)}`}>
      {getStatusIcon(apiStatus.complaints)}
      <span className="ml-2 text-sm font-medium">
        API Status: {apiStatus.message}
      </span>
      <button
        onClick={checkApiConnection}
        className="ml-auto px-3 py-1 text-xs bg-white rounded border hover:bg-gray-50 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
};

export default ApiStatus;
