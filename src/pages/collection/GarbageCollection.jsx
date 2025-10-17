import { useState, useEffect } from 'react';
import { QrCode, Trash2, Coins, AlertCircle, CheckCircle, Scale } from 'lucide-react';
import { binService } from '../../services/binService';
import { coinCalculationService } from '../../services/coinCalculationService';

const GarbageCollection = ({ user, onUpdateUser }) => {
  const [qrCode, setQrCode] = useState('');
  const [binData, setBinData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [collectionHistory, setCollectionHistory] = useState([]);

  useEffect(() => {
    loadCollectionHistory();
  }, []);

  const loadCollectionHistory = async () => {
    try {
      const history = await binService.getCollectionHistory(user.id);
      setCollectionHistory(history);
    } catch (error) {
      console.error('Failed to load collection history:', error);
    }
  };

  const handleQrScan = async () => {
    if (!qrCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a QR code' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Fetch bin data from QR code
      const data = await binService.getBinData(qrCode);
      setBinData(data);
      setMessage({ type: 'success', text: 'Bin data loaded successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid QR code or bin not found' });
      setBinData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCollection = async () => {
    if (!binData) return;

    setLoading(true);
    try {
      // Calculate coins required using strategy pattern
      const coinsRequired = coinCalculationService.calculateCoins(
        binData.wasteType,
        binData.weight
      );

      if (user.coinBalance < coinsRequired) {
        setMessage({ 
          type: 'error', 
          text: `Insufficient coins. Required: ${coinsRequired}, Available: ${user.coinBalance}` 
        });
        return;
      }

      // Process collection
      const collection = {
        id: Date.now().toString(),
        binId: binData.id,
        userId: user.id,
        wasteType: binData.wasteType,
        weight: binData.weight,
        coinsDeducted: coinsRequired,
        timestamp: new Date().toISOString(),
        location: binData.location
      };

      await binService.processCollection(collection);

      // Update user coin balance
      const updatedUser = {
        ...user,
        coinBalance: user.coinBalance - coinsRequired
      };
      onUpdateUser(updatedUser);

      // Update collection history
      setCollectionHistory([collection, ...collectionHistory]);

      setMessage({ 
        type: 'success', 
        text: `Collection successful! ${coinsRequired} coins deducted.` 
      });
      
      // Reset form
      setQrCode('');
      setBinData(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'Collection failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getWasteTypeColor = (type) => {
    const colors = {
      organic: 'bg-green-100 text-green-800',
      plastic: 'bg-blue-100 text-blue-800',
      paper: 'bg-yellow-100 text-yellow-800',
      glass: 'bg-purple-100 text-purple-800',
      metal: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Garbage Collection</h1>
        <p className="text-gray-600">Scan bin QR codes to collect waste and earn rewards</p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Coins className="w-6 h-6 text-blue-500 mr-2" />
            <span className="text-lg font-semibold text-blue-700">
              Available Coins: {user?.coinBalance || 0}
            </span>
          </div>
        </div>
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

      {/* QR Code Scanner Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <QrCode className="w-6 h-6 mr-2" />
          Scan Bin QR Code
        </h2>
        
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter QR code or scan bin"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleQrScan}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Demo QR Codes: BIN001, BIN002, BIN003, BIN004, BIN005</p>
        </div>
      </div>

      {/* Bin Data Display */}
      {binData && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Trash2 className="w-6 h-6 mr-2" />
            Bin Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Bin ID</p>
                <p className="font-semibold text-lg">{binData.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{binData.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Waste Type</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getWasteTypeColor(binData.wasteType)}`}>
                  {binData.wasteType.charAt(0).toUpperCase() + binData.wasteType.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <div className="flex items-center">
                  <Scale className="w-5 h-5 text-gray-500 mr-2" />
                  <p className="font-semibold text-lg">{binData.weight} kg</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fill Level</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full" 
                    style={{ width: `${binData.fillLevel}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{binData.fillLevel}% full</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Coins Required</p>
                <div className="flex items-center">
                  <Coins className="w-5 h-5 text-yellow-500 mr-2" />
                  <p className="font-semibold text-lg text-yellow-600">
                    {coinCalculationService.calculateCoins(binData.wasteType, binData.weight)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleCollection}
              disabled={loading || user.coinBalance < coinCalculationService.calculateCoins(binData.wasteType, binData.weight)}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Collect Waste'}
            </button>
          </div>
        </div>
      )}

      {/* Collection History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Collection History</h2>
        
        {collectionHistory.length === 0 ? (
          <div className="text-center py-8">
            <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No collections yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collectionHistory.slice(0, 5).map((collection) => (
              <div key={collection.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Trash2 className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">{collection.binId}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWasteTypeColor(collection.wasteType)}`}>
                      {collection.wasteType}
                    </span>
                  </div>
                  <div className="flex items-center text-yellow-600">
                    <Coins className="w-4 h-4 mr-1" />
                    <span className="font-semibold">{collection.coinsDeducted}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{collection.location} • {collection.weight} kg</p>
                  <p>{new Date(collection.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GarbageCollection;
