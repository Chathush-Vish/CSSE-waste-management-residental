import { useState, useEffect } from 'react';
import { Coins, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { coinPackageService } from '../../services/coinPackageService';
import { paymentService } from '../../services/paymentService';

const CoinPackages = ({ user, onUpdateUser }) => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    accountBalance: 1000 // Mock account balance
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await coinPackageService.getAllPackages();
      setPackages(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load packages' });
    }
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowPayment(true);
    setMessage({ type: '', text: '' });
  };

  const handlePayment = async () => {
    if (!selectedPackage) return;

    setLoading(true);
    try {
      // Validate payment
      const paymentResult = await paymentService.processPayment({
        amount: selectedPackage.price,
        accountBalance: paymentData.accountBalance,
        cardNumber: paymentData.cardNumber,
        packageId: selectedPackage.id
      });

      if (paymentResult.success) {
        // Update user coins
        const updatedUser = {
          ...user,
          coinBalance: user.coinBalance + selectedPackage.coins
        };
        onUpdateUser(updatedUser);
        
        setMessage({ 
          type: 'success', 
          text: `Successfully purchased ${selectedPackage.coins} coins!` 
        });
        setShowPayment(false);
        setSelectedPackage(null);
      } else {
        setMessage({ 
          type: 'error', 
          text: paymentResult.message || 'Payment failed' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Payment processing failed. You can file a dispute for refund.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Coin Packages</h1>
        <p className="text-gray-600">Purchase coins to use for waste collection services</p>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Coins className="w-6 h-6 text-blue-500 mr-2" />
            <span className="text-lg font-semibold text-blue-700">
              Current Balance: {user?.coinBalance || 0} coins
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

      {!showPayment ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">{pkg.coins}</div>
                <div className="text-gray-500 mb-4">coins</div>
                <div className="text-2xl font-bold text-gray-800 mb-4">${pkg.price}</div>
                <div className="text-sm text-gray-600 mb-6">{pkg.description}</div>
                <button
                  onClick={() => handlePackageSelect(pkg)}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Purchase Package
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Payment Details</h2>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">{selectedPackage.name}</h3>
            <p className="text-gray-600">{selectedPackage.coins} coins</p>
            <p className="text-xl font-bold text-blue-600">${selectedPackage.price}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700">
                Mock Account Balance: ${paymentData.accountBalance}
              </p>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setShowPayment(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinPackages;
