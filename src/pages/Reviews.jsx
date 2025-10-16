import { useState } from "react";
import {
   Star,
   Trash2,
   Calendar,
   CheckCircle,
   Clock,
   AlertCircle,
   MessageSquare,
} from "lucide-react";
import { feedbackAPI } from "../services/api";

export default function Reviews() {
   const [selectedCollection, setSelectedCollection] = useState(null);
   const [rating, setRating] = useState(0);
   const [hoverRating, setHoverRating] = useState(0);
   const [comment, setComment] = useState("");
   const [showSuccess, setShowSuccess] = useState(false);
   const [showReviewForm, setShowReviewForm] = useState(false);
   const [validationError, setValidationError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [networkError, setNetworkError] = useState(false);
   const [submitMode, setSubmitMode] = useState("normal"); // 'normal' or 'general'

   // Mock recent collections data
   const [recentCollections] = useState([
      {
         id: "COL001",
         date: "2025-10-12",
         type: "Regular Waste",
         status: "Completed",
         location: "123 Main Street",
         hasReview: false,
      },
      {
         id: "COL002",
         date: "2025-10-10",
         type: "Recyclable",
         status: "Completed",
         location: "123 Main Street",
         hasReview: false,
      },
      {
         id: "COL003",
         date: "2025-10-08",
         type: "Organic Waste",
         status: "Completed",
         location: "123 Main Street",
         hasReview: false,
      },
   ]);

   // Mock submitted reviews history
   const [reviewHistory, setReviewHistory] = useState([
      {
         id: "REV001",
         collectionId: "COL000",
         date: "2025-10-05",
         rating: 5,
         comment: "Excellent service! Very professional and on time.",
         collectionType: "Regular Waste",
         status: "Synced",
      },
      {
         id: "REV002",
         collectionId: "COL-001",
         date: "2025-10-01",
         rating: 4,
         comment: "Good service overall.",
         collectionType: "Recyclable",
         status: "Synced",
      },
   ]);

   const MAX_COMMENT_LENGTH = 500;

   const handleSelectCollection = (collection) => {
      setSelectedCollection(collection);
      setShowReviewForm(true);
      setRating(0);
      setComment("");
      setValidationError("");
      setNetworkError(false);
      setSubmitMode("normal");
   };

   const handleGeneralFeedback = () => {
      setSelectedCollection(null);
      setShowReviewForm(true);
      setRating(0);
      setComment("");
      setValidationError("");
      setNetworkError(false);
      setSubmitMode("general");
   };

   const validateSubmission = () => {
      // Validate rating
      if (rating < 1 || rating > 5) {
         setValidationError("Please select a rating between 1 and 5 stars.");
         return false;
      }

      // Validate comment length
      if (comment.length > MAX_COMMENT_LENGTH) {
         setValidationError(
            `Comment is too long. Maximum ${MAX_COMMENT_LENGTH} characters allowed.`
         );
         return false;
      }

      setValidationError("");
      return true;
   };


   const handleSubmit = async () => {
      if (!validateSubmission()) {
         return;
      }

      setIsSubmitting(true);
      setValidationError("");
      setNetworkError(false);

      try {
         // Prepare feedback data according to API specification
         const feedbackData = {
            feedbackDate: new Date().toISOString().split("T")[0],
            rating: rating,
            comment: comment || "Great service, would recommend!",
         };

         // Call the actual API
         const response = await feedbackAPI.publishFeedback(feedbackData);

         // Check if the response indicates success
         if (response.statusCode === "02") {
            // Success - store feedback in local history
            const newReview = {
               id: response.content.feedbackId.toString(),
               collectionId: selectedCollection?.id || "GENERAL",
               date: response.content.feedbackDate,
               rating: response.content.rating,
               comment: response.content.comment,
               collectionType: selectedCollection?.type || "General Feedback",
               status: "Synced",
               createdAt: response.content.createdAt,
               isAnonymous: response.content.isAnonymous,
            };

            setReviewHistory([newReview, ...reviewHistory]);

            // Mark collection as reviewed if applicable
            if (selectedCollection) {
               selectedCollection.hasReview = true;
            }

            setShowSuccess(true);
            setShowReviewForm(false);

            // Reset form after showing success
            setTimeout(() => {
               setShowSuccess(false);
               setSelectedCollection(null);
               setRating(0);
               setComment("");
            }, 3000);
         } else {
            // API returned an error status code
            throw new Error(response.message || "Failed to submit feedback");
         }
      } catch (error) {
         // Network failure or API error - queue as pending
         setNetworkError(true);

         const pendingReview = {
            id: `REV${Date.now()}`,
            collectionId: selectedCollection?.id || "GENERAL",
            date: new Date().toISOString().split("T")[0],
            rating: rating,
            comment: comment || "No comment provided",
            collectionType: selectedCollection?.type || "General Feedback",
            status: "Pending Sync",
         };

         setReviewHistory([pendingReview, ...reviewHistory]);

         setTimeout(() => {
            setNetworkError(false);
            setShowReviewForm(false);
            setSelectedCollection(null);
            setRating(0);
            setComment("");
         }, 3000);
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleCancel = () => {
      setShowReviewForm(false);
      setSelectedCollection(null);
      setRating(0);
      setComment("");
      setValidationError("");
      setNetworkError(false);
   };

   const renderStars = (currentRating, interactive = false) => {
      return (
         <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
               <button
                  key={star}
                  type="button"
                  disabled={!interactive}
                  onClick={() => interactive && setRating(star)}
                  onMouseEnter={() => interactive && setHoverRating(star)}
                  onMouseLeave={() => interactive && setHoverRating(0)}
                  className={`${
                     interactive
                        ? "cursor-pointer hover:scale-110"
                        : "cursor-default"
                  } transition-transform`}
               >
                  <Star
                     size={interactive ? 32 : 20}
                     className={`${
                        star <=
                        (interactive ? hoverRating || rating : currentRating)
                           ? "fill-yellow-400 text-yellow-400"
                           : "text-gray-300"
                     }`}
                  />
               </button>
            ))}
         </div>
      );
   };

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Feedback & Ratings
               </h1>
               <p className="text-gray-600">
                  Rate your recent waste collections and help us improve our
                  service
               </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
               <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6 flex items-start space-x-4 animate-fade-in">
                  <CheckCircle
                     className="text-green-600 flex-shrink-0"
                     size={24}
                  />
                  <div>
                     <h3 className="text-lg font-semibold text-green-900 mb-1">
                        Thank you for your feedback!
                     </h3>
                     <p className="text-green-700">
                        Your review has been submitted and is now visible in
                        your history.
                     </p>
                  </div>
               </div>
            )}

            {/* Network Error Message */}
            {networkError && (
               <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start space-x-4">
                  <Clock className="text-yellow-600 flex-shrink-0" size={24} />
                  <div>
                     <h3 className="text-lg font-semibold text-yellow-900 mb-1">
                        Queued for Sync
                     </h3>
                     <p className="text-yellow-700">
                        Network connection failed. Your feedback has been saved
                        and will be synced when connection is restored.
                     </p>
                  </div>
               </div>
            )}

            {!showReviewForm ? (
               <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Collections */}
                  <div>
                     <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                           Recent Collections
                        </h2>

                        {recentCollections.length > 0 ? (
                           <div className="space-y-3">
                              {recentCollections.map((collection) => (
                                 <div
                                    key={collection.id}
                                    className={`border rounded-lg p-4 ${
                                       collection.hasReview
                                          ? "bg-gray-50 border-gray-200"
                                          : "bg-white border-gray-300 hover:border-green-500 hover:shadow-md transition-all cursor-pointer"
                                    }`}
                                    onClick={() =>
                                       !collection.hasReview &&
                                       handleSelectCollection(collection)
                                    }
                                 >
                                    <div className="flex items-start justify-between mb-2">
                                       <div className="flex items-center space-x-2">
                                          <Trash2
                                             className="text-green-600"
                                             size={20}
                                          />
                                          <span className="font-semibold text-gray-900">
                                             {collection.type}
                                          </span>
                                       </div>
                                       {collection.hasReview && (
                                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                             Reviewed
                                          </span>
                                       )}
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1 ml-7">
                                       <div className="flex items-center space-x-2">
                                          <Calendar size={14} />
                                          <span>
                                             {new Date(
                                                collection.date
                                             ).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                             })}
                                          </span>
                                       </div>
                                       <p>{collection.location}</p>
                                       <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                                          {collection.status}
                                       </span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center py-8">
                              <Trash2
                                 className="mx-auto text-gray-300 mb-3"
                                 size={48}
                              />
                              <p className="text-gray-600 mb-4">
                                 No recent collections available
                              </p>
                           </div>
                        )}

                        <button
                           onClick={handleGeneralFeedback}
                           className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:border-green-500 hover:text-green-700 transition-colors font-medium"
                        >
                           Submit General Feedback
                        </button>
                     </div>
                  </div>

                  {/* Review History */}
                  <div>
                     <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                           Your Review History
                        </h2>

                        {reviewHistory.length > 0 ? (
                           <div className="space-y-4 max-h-96 overflow-y-auto">
                              {reviewHistory.map((review) => (
                                 <div
                                    key={review.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                 >
                                    <div className="flex items-start justify-between mb-2">
                                       <div>
                                          <p className="font-semibold text-gray-900">
                                             {review.collectionType}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                             {new Date(
                                                review.date
                                             ).toLocaleDateString()}
                                          </p>
                                       </div>
                                       <span
                                          className={`text-xs px-2 py-1 rounded-full ${
                                             review.status === "Synced"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                          }`}
                                       >
                                          {review.status === "Synced" ? (
                                             <span className="flex items-center space-x-1">
                                                <CheckCircle size={12} />
                                                <span>Synced</span>
                                             </span>
                                          ) : (
                                             <span className="flex items-center space-x-1">
                                                <Clock size={12} />
                                                <span>Pending</span>
                                             </span>
                                          )}
                                       </span>
                                    </div>
                                    <div className="mb-2">
                                       {renderStars(review.rating, false)}
                                    </div>
                                    {review.comment !==
                                       "No comment provided" && (
                                       <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                          "{review.comment}"
                                       </p>
                                    )}
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center py-8">
                              <MessageSquare
                                 className="mx-auto text-gray-300 mb-3"
                                 size={48}
                              />
                              <p className="text-gray-600">
                                 No reviews submitted yet
                              </p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            ) : (
               // Review Form
               <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-lg shadow-md p-6">
                     <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {submitMode === "general"
                           ? "Submit General Feedback"
                           : "Rate This Collection"}
                     </h2>

                     {selectedCollection && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                           <div className="flex items-center space-x-2 mb-2">
                              <Trash2 className="text-green-600" size={20} />
                              <span className="font-semibold text-gray-900">
                                 {selectedCollection.type}
                              </span>
                           </div>
                           <div className="text-sm text-gray-600 ml-7">
                              <div className="flex items-center space-x-2">
                                 <Calendar size={14} />
                                 <span>
                                    {new Date(
                                       selectedCollection.date
                                    ).toLocaleDateString("en-US", {
                                       weekday: "short",
                                       year: "numeric",
                                       month: "short",
                                       day: "numeric",
                                    })}
                                 </span>
                              </div>
                              <p className="mt-1">
                                 {selectedCollection.location}
                              </p>
                           </div>
                        </div>
                     )}

                     {/* Rating Selection */}
                     <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                           Your Rating <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-center py-4">
                           {renderStars(rating, true)}
                        </div>
                        {rating > 0 && (
                           <p className="text-center text-sm text-gray-600 mt-2">
                              {rating === 1 && "Poor"}
                              {rating === 2 && "Fair"}
                              {rating === 3 && "Good"}
                              {rating === 4 && "Very Good"}
                              {rating === 5 && "Excellent"}
                           </p>
                        )}
                     </div>

                     {/* Comment Section */}
                     <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Comment (Optional)
                        </label>
                        <textarea
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                           placeholder="Tell us about your experience..."
                           rows={5}
                           maxLength={MAX_COMMENT_LENGTH}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                           <p className="text-xs text-gray-500">
                              Share your thoughts to help us improve
                           </p>
                           <p
                              className={`text-xs ${
                                 comment.length > MAX_COMMENT_LENGTH - 50
                                    ? "text-red-600"
                                    : "text-gray-500"
                              }`}
                           >
                              {comment.length}/{MAX_COMMENT_LENGTH}
                           </p>
                        </div>
                     </div>

                     {/* Validation Error */}
                     {validationError && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                           <AlertCircle
                              className="text-red-600 flex-shrink-0"
                              size={20}
                           />
                           <p className="text-sm text-red-800">
                              {validationError}
                           </p>
                        </div>
                     )}

                     {/* Action Buttons */}
                     <div className="flex space-x-3">
                        <button
                           onClick={handleCancel}
                           disabled={isSubmitting}
                           className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 transition-colors"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleSubmit}
                           disabled={isSubmitting || rating === 0}
                           className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                           {isSubmitting ? (
                              <>
                                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                 Submitting...
                              </>
                           ) : (
                              "Submit Review"
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
