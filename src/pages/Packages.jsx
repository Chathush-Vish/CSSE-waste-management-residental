import { useState } from "react";
import { Package, Check, X, AlertCircle, Receipt, Coins } from "lucide-react";

export default function Packages() {
   const [selectedPackage, setSelectedPackage] = useState(null);
   const [showConfirmation, setShowConfirmation] = useState(false);
   const [paymentMethod, setPaymentMethod] = useState("credit-card");
   const [isProcessing, setIsProcessing] = useState(false);
   const [purchaseStatus, setPurchaseStatus] = useState(null);
   const [coinBalance, setCoinBalance] = useState(150);
   const [receiptData, setReceiptData] = useState(null);
   const [showReceipt, setShowReceipt] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [currentSubscription, setCurrentSubscription] = useState("Gold"); // User's current package

   // User information
   const userInfo = {
      name: "John Doe",
      email: "john.doe@email.com",
   };

   const packages = [
      {
         id: "silver",
         name: "Silver",
         coins: 100,
         price: 10.0,
         color: "bg-gray-400",
         borderColor: "border-gray-400",
         hoverColor: "hover:bg-gray-50",
         features: ["Basic waste collection", "Weekly pickup", "Email support"],
      },
      {
         id: "gold",
         name: "Gold",
         coins: 250,
         price: 23.0,
         color: "bg-yellow-500",
         borderColor: "border-yellow-500",
         hoverColor: "hover:bg-yellow-50",
         popular: true,
         features: [
            "Priority collection",
            "Bi-weekly pickup",
            "Phone support",
            "10% bonus coins",
         ],
      },
      {
         id: "diamond",
         name: "Diamond",
         coins: 500,
         price: 42.0,
         color: "bg-blue-500",
         borderColor: "border-blue-500",
         hoverColor: "hover:bg-blue-50",
         features: [
            "Premium service",
            "On-demand pickup",
            "24/7 support",
            "20% bonus coins",
            "Priority scheduling",
         ],
      },
   ];

   const handleSelectPackage = (pkg) => {
      setSelectedPackage(pkg);
      setShowConfirmation(true);
      setPurchaseStatus(null);
      setErrorMessage("");
   };

   const handleCancelPurchase = () => {
      setShowConfirmation(false);
      setSelectedPackage(null);
      setPaymentMethod("credit-card");
   };

   const simulatePaymentAuthorization = () => {
      return new Promise((resolve) => {
         setTimeout(() => {
            // 85% success rate simulation
            const success = Math.random() > 0.15;
            resolve(success);
         }, 2000);
      });
   };

   const handleConfirmPayment = async () => {
      setIsProcessing(true);
      setErrorMessage("");

      try {
         // Request authorization from payment system
         const authorized = await simulatePaymentAuthorization();

         if (authorized) {
            // Payment approved - credit coins and issue receipt
            const newBalance = coinBalance + selectedPackage.coins;
            setCoinBalance(newBalance);

            const receipt = {
               transactionId: `TXN-${Date.now()}`,
               date: new Date().toLocaleString(),
               package: selectedPackage.name,
               coins: selectedPackage.coins,
               amount: selectedPackage.price,
               paymentMethod: paymentMethod,
               newBalance: newBalance,
            };

            setReceiptData(receipt);
            setPurchaseStatus("success");
            setShowConfirmation(false);

            // Auto-show receipt after success
            setTimeout(() => {
               setShowReceipt(true);
            }, 500);
         } else {
            // Payment declined
            setPurchaseStatus("declined");
            setErrorMessage(
               "Payment was declined. Please try a different payment method or contact your bank."
            );
         }
      } catch (error) {
         // Timeout or error - no credit issued
         setPurchaseStatus("error");
         setErrorMessage(
            "Connection timeout. Please try again. No charges were made."
         );
      } finally {
         setIsProcessing(false);
      }
   };

   const handleRetryPayment = () => {
      setPurchaseStatus(null);
      setErrorMessage("");
   };

   const handleBuyAnother = () => {
      setPurchaseStatus(null);
      setShowReceipt(false);
      setReceiptData(null);
      setSelectedPackage(null);
   };

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         {/* User Info Header */}
         <div className="w-full mx-auto mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                     <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {userInfo.name
                           .split(" ")
                           .map((n) => n[0])
                           .join("")}
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                           {userInfo.name}
                        </h2>
                        <p className="text-gray-600">{userInfo.email}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm text-gray-600 mb-1">
                        Current Package
                     </p>
                     <div className="flex items-center space-x-2">
                        <Package className="text-yellow-500" size={20} />
                        <span className="text-xl font-bold text-gray-900">
                           {currentSubscription}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Header with Balance */}
         <div className="w-full mx-auto mb-8">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-3xl font-bold mb-2">Coin Packages</h1>
                     <p className="text-green-100">
                        Purchase coins to pay for waste collection services
                     </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                     <Coins className="mx-auto mb-2" size={32} />
                     <p className="text-sm text-green-100">Current Balance</p>
                     <p className="text-3xl font-bold">{coinBalance}</p>
                     <p className="text-xs text-green-100">coins</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Success Message */}
         {purchaseStatus === "success" && !showReceipt && (
            <div className="w-full mx-auto mb-6">
               <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start space-x-4">
                  <div className="bg-green-500 rounded-full p-2">
                     <Check className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                     <h3 className="text-lg font-semibold text-green-900 mb-1">
                        Purchase Successful!
                     </h3>
                     <p className="text-green-700 mb-4">
                        {selectedPackage?.coins} coins have been added to your
                        account. New balance: {coinBalance} coins.
                     </p>
                     <div className="flex space-x-3">
                        <button
                           onClick={() => setShowReceipt(true)}
                           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                           <Receipt size={18} />
                           <span>View Receipt</span>
                        </button>
                        <button
                           onClick={handleBuyAnother}
                           className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50"
                        >
                           Buy Another Package
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Package Cards */}
         {!showConfirmation && !showReceipt && (
            <div className="w-full mx-auto grid md:grid-cols-3 gap-6">
               {packages.map((pkg) => (
                  <div
                     key={pkg.id}
                     className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 ${pkg.borderColor} transition-transform hover:scale-105 relative`}
                  >
                     {pkg.popular && (
                        <div className="bg-yellow-500 text-white text-center py-1 text-sm font-semibold">
                           MOST POPULAR
                        </div>
                     )}
                     <div className={`${pkg.color} p-6 text-white text-center`}>
                        <Package className="mx-auto mb-3" size={48} />
                        <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                        <div className="text-4xl font-bold mb-1">
                           {pkg.coins}
                        </div>
                        <p className="text-sm opacity-90">Coins</p>
                     </div>
                     <div className="p-6">
                        <div className="text-center mb-6">
                           <span className="text-3xl font-bold text-gray-900">
                              ${pkg.price}
                           </span>
                           <span className="text-gray-600"> USD</span>
                        </div>
                        <ul className="space-y-3 mb-6">
                           {pkg.features.map((feature, idx) => (
                              <li
                                 key={idx}
                                 className="flex items-start space-x-2 text-sm text-gray-700"
                              >
                                 <Check
                                    size={18}
                                    className="text-green-600 flex-shrink-0 mt-0.5"
                                 />
                                 <span>{feature}</span>
                              </li>
                           ))}
                        </ul>
                        <button
                           onClick={() => handleSelectPackage(pkg)}
                           className={`w-full py-3 rounded-lg font-semibold transition-colors ${pkg.color} text-white hover:opacity-90`}
                        >
                           Select Package
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Payment Confirmation Modal */}
         {showConfirmation && selectedPackage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                     Confirm Purchase
                  </h2>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                     <h3 className="font-semibold text-gray-900 mb-3">
                        Order Summary
                     </h3>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                           <span className="text-gray-600">Package:</span>
                           <span className="font-medium">
                              {selectedPackage.name}
                           </span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-gray-600">Coins:</span>
                           <span className="font-medium">
                              {selectedPackage.coins}
                           </span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between">
                           <span className="text-gray-900 font-semibold">
                              Total:
                           </span>
                           <span className="text-xl font-bold text-gray-900">
                              ${selectedPackage.price}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                     </label>
                     <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={isProcessing}
                     >
                        <option value="credit-card">Credit Card</option>
                        <option value="debit-card">Debit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank-transfer">Bank Transfer</option>
                     </select>
                  </div>

                  {/* Error Message */}
                  {(purchaseStatus === "declined" ||
                     purchaseStatus === "error") && (
                     <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                        <AlertCircle
                           className="text-red-600 flex-shrink-0"
                           size={20}
                        />
                        <div className="flex-1">
                           <p className="text-sm text-red-800">
                              {errorMessage}
                           </p>
                           {purchaseStatus === "declined" && (
                              <button
                                 onClick={handleRetryPayment}
                                 className="mt-2 text-sm text-red-700 font-medium hover:text-red-800 underline"
                              >
                                 Try again
                              </button>
                           )}
                        </div>
                     </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                     <button
                        onClick={handleCancelPurchase}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleConfirmPayment}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 flex items-center justify-center"
                     >
                        {isProcessing ? (
                           <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Processing...
                           </>
                        ) : (
                           "Pay Now"
                        )}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Receipt Modal */}
         {showReceipt && receiptData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <div className="text-center mb-6">
                     <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Receipt className="text-green-600" size={32} />
                     </div>
                     <h2 className="text-2xl font-bold text-gray-900">
                        Payment Receipt
                     </h2>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3 text-sm">
                     <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-xs">
                           {receiptData.transactionId}
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{receiptData.date}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Package:</span>
                        <span className="font-medium">
                           {receiptData.package}
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Coins Purchased:</span>
                        <span className="font-medium">{receiptData.coins}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium capitalize">
                           {receiptData.paymentMethod.replace("-", " ")}
                        </span>
                     </div>
                     <div className="border-t pt-3 flex justify-between">
                        <span className="text-gray-900 font-semibold">
                           Amount Paid:
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                           ${receiptData.amount}
                        </span>
                     </div>
                     <div className="bg-green-100 -mx-4 -mb-4 p-4 rounded-b-lg flex justify-between">
                        <span className="text-green-800 font-semibold">
                           New Balance:
                        </span>
                        <span className="text-xl font-bold text-green-800">
                           {receiptData.newBalance} coins
                        </span>
                     </div>
                  </div>

                  <div className="flex space-x-3">
                     <button
                        onClick={() => setShowReceipt(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                     >
                        Close
                     </button>
                     <button
                        onClick={handleBuyAnother}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                     >
                        Buy Another
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
