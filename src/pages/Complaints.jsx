import { useState } from "react";
import {
   AlertCircle,
   FileText,
   Image,
   CheckCircle,
   Clock,
   Search,
   X,
   Upload,
   Trash2,
   Calendar,
   MessageSquare,
} from "lucide-react";

export default function Complaints() {
   const [showComplaintForm, setShowComplaintForm] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState("");
   const [customCategory, setCustomCategory] = useState("");
   const [description, setDescription] = useState("");
   const [attachedPhoto, setAttachedPhoto] = useState(null);
   const [photoPreview, setPhotoPreview] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [validationError, setValidationError] = useState("");
   const [showSuccess, setShowSuccess] = useState(false);
   const [newTicketId, setNewTicketId] = useState("");
   const [networkError, setNetworkError] = useState(false);
   const [duplicateTicket, setDuplicateTicket] = useState(null);
   const [showDuplicateModal, setShowDuplicateModal] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");

   const categories = [
      {
         id: "missed-pickup",
         name: "Missed Pickup",
         icon: Trash2,
         color: "text-red-600",
         bg: "bg-red-50",
      },
      {
         id: "damaged-bin",
         name: "Damaged Bin",
         icon: AlertCircle,
         color: "text-orange-600",
         bg: "bg-orange-50",
      },
      {
         id: "other",
         name: "Other",
         icon: MessageSquare,
         color: "text-blue-600",
         bg: "bg-blue-50",
      },
   ];

   const [complaints, setComplaints] = useState([
      {
         id: "TKT-2025-001",
         category: "Missed Pickup",
         description: "Scheduled pickup was missed on Monday morning",
         status: "In Progress",
         createdAt: "2025-10-10",
         sla: "48 hours",
         hasPhoto: false,
         syncStatus: "Synced",
      },
      {
         id: "TKT-2025-002",
         category: "Damaged Bin",
         description: "Recycling bin has a large crack on the side",
         status: "Open",
         createdAt: "2025-10-12",
         sla: "72 hours",
         hasPhoto: true,
         syncStatus: "Synced",
      },
   ]);

   const MAX_DESCRIPTION_LENGTH = 500;
   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
   const ALLOWED_FILE_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
   ];

   const handleCategorySelect = (categoryId) => {
      setSelectedCategory(categoryId);
      setValidationError("");
      if (categoryId !== "other") {
         setCustomCategory("");
      }
   };

   const handlePhotoUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
         setValidationError(
            "Invalid file type. Please upload a JPEG, PNG, or WebP image."
         );
         return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
         setValidationError("File size too large. Maximum size is 5MB.");
         return;
      }

      setAttachedPhoto(file);
      setValidationError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
         setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
   };

   const handleRemovePhoto = () => {
      setAttachedPhoto(null);
      setPhotoPreview(null);
   };

   const validateForm = () => {
      // Validate category selection
      if (!selectedCategory) {
         setValidationError("Please select a complaint category.");
         return false;
      }

      // Validate custom category if "Other" is selected
      if (selectedCategory === "other" && !customCategory.trim()) {
         setValidationError("Please specify the category for your complaint.");
         return false;
      }

      // Validate description
      if (!description.trim()) {
         setValidationError("Please provide a description of your complaint.");
         return false;
      }

      if (description.length > MAX_DESCRIPTION_LENGTH) {
         setValidationError(
            `Description is too long. Maximum ${MAX_DESCRIPTION_LENGTH} characters allowed.`
         );
         return false;
      }

      setValidationError("");
      return true;
   };

   const checkForDuplicates = () => {
      // Simulate duplicate detection
      const categoryName =
         selectedCategory === "other"
            ? customCategory
            : categories.find((c) => c.id === selectedCategory)?.name;

      const existingOpen = complaints.find(
         (c) =>
            c.category === categoryName &&
            (c.status === "Open" || c.status === "In Progress") &&
            c.description
               .toLowerCase()
               .includes(description.toLowerCase().split(" ")[0])
      );

      return existingOpen || null;
   };

   const simulateNetworkRequest = () => {
      return new Promise((resolve, reject) => {
         setTimeout(() => {
            // 90% success rate
            const success = Math.random() > 0.1;
            if (success) {
               resolve(true);
            } else {
               reject(new Error("Network failure"));
            }
         }, 1500);
      });
   };

   const handleSubmit = async () => {
      if (!validateForm()) {
         return;
      }

      // Check for duplicates
      const duplicate = checkForDuplicates();
      if (duplicate) {
         setDuplicateTicket(duplicate);
         setShowDuplicateModal(true);
         return;
      }

      await submitComplaint(false);
   };

   const submitComplaint = async (linkToDuplicate = false) => {
      setIsSubmitting(true);
      setValidationError("");
      setNetworkError(false);

      try {
         await simulateNetworkRequest();

         // Generate ticket ID
         const ticketId = `TKT-${new Date().getFullYear()}-${String(
            complaints.length + 1
         ).padStart(3, "0")}`;
         const categoryName =
            selectedCategory === "other"
               ? customCategory
               : categories.find((c) => c.id === selectedCategory)?.name;

         // Determine SLA based on category
         let sla = "72 hours";
         if (selectedCategory === "missed-pickup") sla = "48 hours";
         if (selectedCategory === "damaged-bin") sla = "72 hours";

         const newComplaint = {
            id: ticketId,
            category: categoryName,
            description: description,
            status: linkToDuplicate ? "Linked" : "Open",
            createdAt: new Date().toISOString().split("T")[0],
            sla: sla,
            hasPhoto: !!attachedPhoto,
            syncStatus: "Synced",
            linkedTo: linkToDuplicate ? duplicateTicket.id : null,
         };

         setComplaints([newComplaint, ...complaints]);
         setNewTicketId(ticketId);
         setShowSuccess(true);
         setShowComplaintForm(false);
         setShowDuplicateModal(false);

         // Reset form
         setTimeout(() => {
            resetForm();
            setShowSuccess(false);
         }, 5000);
      } catch (error) {
         // Network failure - queue as pending
         setNetworkError(true);

         const ticketId = `TKT-${new Date().getFullYear()}-${String(
            complaints.length + 1
         ).padStart(3, "0")}`;
         const categoryName =
            selectedCategory === "other"
               ? customCategory
               : categories.find((c) => c.id === selectedCategory)?.name;

         const pendingComplaint = {
            id: ticketId,
            category: categoryName,
            description: description,
            status: "Open",
            createdAt: new Date().toISOString().split("T")[0],
            sla: "72 hours",
            hasPhoto: !!attachedPhoto,
            syncStatus: "Pending Sync",
         };

         setComplaints([pendingComplaint, ...complaints]);
         setNewTicketId(ticketId);

         setTimeout(() => {
            resetForm();
            setNetworkError(false);
         }, 5000);
      } finally {
         setIsSubmitting(false);
      }
   };

   const resetForm = () => {
      setSelectedCategory("");
      setCustomCategory("");
      setDescription("");
      setAttachedPhoto(null);
      setPhotoPreview(null);
      setValidationError("");
      setDuplicateTicket(null);
   };

   const handleCancel = () => {
      setShowComplaintForm(false);
      resetForm();
   };

   const getStatusColor = (status) => {
      switch (status) {
         case "Open":
            return "bg-blue-100 text-blue-800";
         case "In Progress":
            return "bg-yellow-100 text-yellow-800";
         case "Resolved":
            return "bg-green-100 text-green-800";
         case "Linked":
            return "bg-purple-100 text-purple-800";
         default:
            return "bg-gray-100 text-gray-800";
      }
   };

   const filteredComplaints = complaints.filter(
      (complaint) =>
         complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
         complaint.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
         complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
   );

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Complaints
               </h1>
               <p className="text-gray-600">
                  Submit and track your service complaints
               </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
               <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6 flex items-start space-x-4">
                  <CheckCircle
                     className="text-green-600 flex-shrink-0"
                     size={24}
                  />
                  <div className="flex-1">
                     <h3 className="text-lg font-semibold text-green-900 mb-1">
                        Complaint Submitted Successfully!
                     </h3>
                     <p className="text-green-700 mb-2">
                        Your ticket ID is{" "}
                        <span className="font-mono font-bold">
                           {newTicketId}
                        </span>
                     </p>
                     <p className="text-sm text-green-600">
                        You can track the status of your complaint in "My
                        Complaints" section below.
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
                        Network connection failed. Your complaint has been saved
                        with ticket ID{" "}
                        <span className="font-mono font-bold">
                           {newTicketId}
                        </span>{" "}
                        and will be synced when connection is restored.
                     </p>
                  </div>
               </div>
            )}

            {/* Duplicate Modal */}
            {showDuplicateModal && duplicateTicket && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-md w-full p-6">
                     <div className="flex items-start space-x-3 mb-4">
                        <AlertCircle
                           className="text-orange-600 flex-shrink-0"
                           size={24}
                        />
                        <div>
                           <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Similar Complaint Found
                           </h3>
                           <p className="text-sm text-gray-600 mb-4">
                              We found an existing open ticket that appears
                              similar to your complaint:
                           </p>
                        </div>
                     </div>

                     <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                           <span className="font-mono text-sm font-bold text-gray-900">
                              {duplicateTicket.id}
                           </span>
                           <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                 duplicateTicket.status
                              )}`}
                           >
                              {duplicateTicket.status}
                           </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                           <strong>Category:</strong> {duplicateTicket.category}
                        </p>
                        <p className="text-sm text-gray-700">
                           <strong>Description:</strong>{" "}
                           {duplicateTicket.description}
                        </p>
                     </div>

                     <p className="text-sm text-gray-600 mb-6">
                        Would you like to link your complaint to this existing
                        ticket or submit as a new ticket?
                     </p>

                     <div className="flex space-x-3">
                        <button
                           onClick={() => setShowDuplicateModal(false)}
                           className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={() => submitComplaint(false)}
                           className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                           Submit New
                        </button>
                        <button
                           onClick={() => submitComplaint(true)}
                           className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                           Link to Existing
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {!showComplaintForm ? (
               <div className="space-y-6">
                  {/* Submit New Complaint Button */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                     <button
                        onClick={() => setShowComplaintForm(true)}
                        className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                     >
                        <FileText size={24} />
                        <span>Submit New Complaint</span>
                     </button>
                  </div>

                  {/* My Complaints Section */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                           My Complaints
                        </h2>
                        <div className="relative">
                           <Search
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={20}
                           />
                           <input
                              type="text"
                              placeholder="Search tickets..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                           />
                        </div>
                     </div>

                     {filteredComplaints.length > 0 ? (
                        <div className="space-y-4">
                           {filteredComplaints.map((complaint) => (
                              <div
                                 key={complaint.id}
                                 className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                 <div className="flex items-start justify-between mb-3">
                                    <div>
                                       <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-mono font-bold text-gray-900">
                                             {complaint.id}
                                          </span>
                                          {complaint.linkedTo && (
                                             <span className="text-xs text-purple-600">
                                                (Linked to {complaint.linkedTo})
                                             </span>
                                          )}
                                       </div>
                                       <p className="text-sm text-gray-600">
                                          <Calendar
                                             size={14}
                                             className="inline mr-1"
                                          />
                                          {new Date(
                                             complaint.createdAt
                                          ).toLocaleDateString("en-US", {
                                             year: "numeric",
                                             month: "short",
                                             day: "numeric",
                                          })}
                                       </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                       <span
                                          className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                                             complaint.status
                                          )}`}
                                       >
                                          {complaint.status}
                                       </span>
                                       <span
                                          className={`text-xs px-2 py-1 rounded-full ${
                                             complaint.syncStatus === "Synced"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                          }`}
                                       >
                                          {complaint.syncStatus === "Synced" ? (
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
                                 </div>

                                 <div className="mb-3">
                                    <p className="text-sm font-semibold text-gray-700 mb-1">
                                       Category: {complaint.category}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                       {complaint.description}
                                    </p>
                                 </div>

                                 <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>SLA: {complaint.sla}</span>
                                    {complaint.hasPhoto && (
                                       <span className="flex items-center space-x-1 text-blue-600">
                                          <Image size={14} />
                                          <span>Has attachment</span>
                                       </span>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="text-center py-12">
                           <FileText
                              className="mx-auto text-gray-300 mb-3"
                              size={48}
                           />
                           <p className="text-gray-600">
                              {searchQuery
                                 ? "No complaints found matching your search"
                                 : "No complaints submitted yet"}
                           </p>
                        </div>
                     )}
                  </div>
               </div>
            ) : (
               // Complaint Form
               <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                     Submit New Complaint
                  </h2>

                  {/* Category Selection */}
                  <div className="mb-6">
                     <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Category <span className="text-red-500">*</span>
                     </label>
                     <div className="grid md:grid-cols-3 gap-4">
                        {categories.map((category) => {
                           const Icon = category.icon;
                           return (
                              <button
                                 key={category.id}
                                 onClick={() =>
                                    handleCategorySelect(category.id)
                                 }
                                 className={`p-4 border-2 rounded-lg transition-all ${
                                    selectedCategory === category.id
                                       ? "border-green-500 bg-green-50"
                                       : "border-gray-200 hover:border-green-300"
                                 }`}
                              >
                                 <div
                                    className={`${category.bg} rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3`}
                                 >
                                    <Icon
                                       className={category.color}
                                       size={24}
                                    />
                                 </div>
                                 <p className="font-semibold text-gray-900 text-center">
                                    {category.name}
                                 </p>
                              </button>
                           );
                        })}
                     </div>
                  </div>

                  {/* Custom Category for "Other" */}
                  {selectedCategory === "other" && (
                     <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Specify Category{" "}
                           <span className="text-red-500">*</span>
                        </label>
                        <input
                           type="text"
                           value={customCategory}
                           onChange={(e) => setCustomCategory(e.target.value)}
                           placeholder="e.g., Late Pickup, Spill, etc."
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                     </div>
                  )}

                  {/* Description */}
                  <div className="mb-6">
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                     </label>
                     <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe your complaint in detail..."
                        rows={5}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                     />
                     <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                           Provide as much detail as possible
                        </p>
                        <p
                           className={`text-xs ${
                              description.length > MAX_DESCRIPTION_LENGTH - 50
                                 ? "text-red-600"
                                 : "text-gray-500"
                           }`}
                        >
                           {description.length}/{MAX_DESCRIPTION_LENGTH}
                        </p>
                     </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="mb-6">
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attach Photo (Optional)
                     </label>

                     {!photoPreview ? (
                        <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors">
                           <Upload className="text-gray-400 mb-2" size={32} />
                           <p className="text-sm text-gray-600 mb-1">
                              Click to upload a photo
                           </p>
                           <p className="text-xs text-gray-500">
                              JPEG, PNG, or WebP (Max 5MB)
                           </p>
                           <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handlePhotoUpload}
                              className="hidden"
                           />
                        </label>
                     ) : (
                        <div className="relative border border-gray-300 rounded-lg p-4">
                           <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg mb-2"
                           />
                           <button
                              onClick={handleRemovePhoto}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                           >
                              <X size={16} />
                           </button>
                           <p className="text-xs text-gray-600 text-center">
                              {attachedPhoto?.name}
                           </p>
                        </div>
                     )}
                  </div>

                  {/* Validation Error */}
                  {validationError && (
                     <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
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
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 transition-colors flex items-center justify-center"
                     >
                        {isSubmitting ? (
                           <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Submitting...
                           </>
                        ) : (
                           "Submit Complaint"
                        )}
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
