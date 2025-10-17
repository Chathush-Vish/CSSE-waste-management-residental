import { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ApiTestPanel = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testCloseApi = async () => {
    setTesting(true);
    const testComplaintId = '2bf207f9-391a-4679-9e19-fc5042e91b22'; // Use your sample complaint ID
    
    try {
      const response = await fetch(`http://localhost:8080/complaints/${testComplaintId}/close`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      setTestResults({
        ...testResults,
        close: {
          status: response.ok ? 'success' : 'error',
          message: response.ok ? 'Close API working!' : `Error: ${response.status}`,
          response: result
        }
      });
    } catch (error) {
      setTestResults({
        ...testResults,
        close: {
          status: 'error',
          message: `Network error: ${error.message}`,
          response: null
        }
      });
    } finally {
      setTesting(false);
    }
  };

  const testCreateApi = async () => {
    setTesting(true);
    
    const testData = {
      userId: 1,
      category: "Service Delay",
      description: "Test complaint from API test panel",
      evidenceUrl: "https://example.com/test-image.jpg",
      preferredContact: "1234567890"
    };
    
    try {
      const response = await fetch('http://localhost:8080/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      
      setTestResults({
        ...testResults,
        create: {
          status: response.ok ? 'success' : 'error',
          message: response.ok ? 'Create API working!' : `Error: ${response.status}`,
          response: result
        }
      });
    } catch (error) {
      setTestResults({
        ...testResults,
        create: {
          status: 'error',
          message: `Network error: ${error.message}`,
          response: null
        }
      });
    } finally {
      setTesting(false);
    }
  };

  const testGetAllApi = async () => {
    setTesting(true);
    
    try {
      const response = await fetch('http://localhost:8080/complaints/admin/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      setTestResults({
        ...testResults,
        getAll: {
          status: response.ok ? 'success' : 'error',
          message: response.ok ? 'Get All API working!' : `Error: ${response.status}`,
          response: result
        }
      });
    } catch (error) {
      setTestResults({
        ...testResults,
        getAll: {
          status: 'error',
          message: `Network error: ${error.message}`,
          response: null
        }
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">API Test Panel</h3>
      
      <div className="space-y-4">
        {/* Test Get All Complaints */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="font-medium text-gray-700">Test Get All Complaints API</span>
            {testResults.getAll && (
              <div className="ml-3 flex items-center">
                {getStatusIcon(testResults.getAll.status)}
                <span className="ml-1 text-sm text-gray-600">{testResults.getAll.message}</span>
              </div>
            )}
          </div>
          <button
            onClick={testGetAllApi}
            disabled={testing}
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Play className="w-4 h-4 mr-1" />
            Test
          </button>
        </div>

        {/* Test Create Complaint */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="font-medium text-gray-700">Test Create Complaint API</span>
            {testResults.create && (
              <div className="ml-3 flex items-center">
                {getStatusIcon(testResults.create.status)}
                <span className="ml-1 text-sm text-gray-600">{testResults.create.message}</span>
              </div>
            )}
          </div>
          <button
            onClick={testCreateApi}
            disabled={testing}
            className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <Play className="w-4 h-4 mr-1" />
            Test Create
          </button>
        </div>

        {/* Test Close Complaint */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="font-medium text-gray-700">Test Close Complaint API</span>
            {testResults.close && (
              <div className="ml-3 flex items-center">
                {getStatusIcon(testResults.close.status)}
                <span className="ml-1 text-sm text-gray-600">{testResults.close.message}</span>
              </div>
            )}
          </div>
          <button
            onClick={testCloseApi}
            disabled={testing}
            className="flex items-center px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <Play className="w-4 h-4 mr-1" />
            Test Close
          </button>
        </div>
      </div>

      {/* Show API Response Details */}
      {(testResults.getAll || testResults.create || testResults.close) && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Latest API Response:</h4>
          <pre className="text-xs text-gray-600 overflow-auto max-h-40">
            {JSON.stringify(testResults.create?.response || testResults.close?.response || testResults.getAll?.response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTestPanel;
