# Waste Management System - Project Structure

## Overview
This project has been restructured according to the main business flows with proper authentication, design patterns, and comprehensive functionality.

## Main Flows Implemented

### 1. Authentication System
- **Location**: `src/pages/auth/`
- **Features**:
  - Login page with user/admin role selection
  - Mock authentication with localStorage persistence
  - User session management

### 2. Coin Package Purchasing Flow
- **Location**: `src/pages/coins/`
- **Components**:
  - `CoinPackages.jsx` - Browse and purchase coin packages
  - `PaymentDisputes.jsx` - File and track payment disputes
- **Features**:
  - Multiple coin packages with different pricing
  - Mock payment processing with failure scenarios
  - Payment dispute system with admin resolution
  - Refund processing

### 3. Garbage Collection Flow
- **Location**: `src/pages/collection/`
- **Components**:
  - `GarbageCollection.jsx` - QR code scanning and waste collection
- **Features**:
  - QR code scanning for bin identification
  - Mock sensor data retrieval
  - Coin deduction based on waste type and weight
  - Collection history tracking
  - Strategy and Factory design patterns for coin calculation

### 4. Feedback & Rating Flow
- **Location**: `src/pages/feedback/`
- **Components**:
  - `FeedbackRating.jsx` - Submit and view feedback
- **Features**:
  - Star rating system (1-5 stars)
  - Category-based feedback
  - Feedback history and statistics
  - User feedback trends

### 5. Complaint Management Flow
- **Location**: `src/pages/complaints/`
- **Components**:
  - `ComplaintTracking.jsx` - File and track complaints
- **Features**:
  - Complaint submission with image upload
  - Priority and category classification
  - Status tracking (pending, in_progress, resolved)
  - Admin response system

### 6. Admin Dashboard
- **Location**: `src/pages/admin/`
- **Components**:
  - `AdminDashboard.jsx` - Comprehensive admin interface
- **Features**:
  - System overview with statistics
  - Payment dispute management
  - Complaint resolution
  - User activity monitoring

## Design Patterns Implemented

### Strategy Pattern
- **Location**: `src/services/coinCalculationService.js`
- **Purpose**: Calculate coin deduction based on waste type
- **Implementation**:
  - Different strategies for each waste type (organic, plastic, paper, glass, metal)
  - Flexible rate calculation system
  - Easy to extend with new waste types

### Factory Pattern
- **Location**: `src/services/coinCalculationService.js`
- **Purpose**: Create appropriate calculation strategy instances
- **Implementation**:
  - `WasteCalculationStrategyFactory` creates strategy instances
  - Centralized strategy creation logic
  - Type safety and error handling

## Services Architecture

### Mock Services
All services use localStorage for data persistence and simulate real-world scenarios:

1. **Bin Service** (`src/services/binService.js`)
   - Mock sensor data for different bin types
   - QR code to bin data mapping
   - Collection processing and history

2. **Payment Service** (`src/services/paymentService.js`)
   - Mock payment processing with failure scenarios
   - Transaction history management
   - Refund processing

3. **Coin Package Service** (`src/services/coinPackageService.js`)
   - Package management and pricing
   - Purchase history tracking
   - Value calculation utilities

4. **Dispute Service** (`src/services/disputeService.js`)
   - Dispute creation and management
   - Admin resolution workflow
   - Statistics and reporting

5. **Feedback Service** (`src/services/feedbackService.js`)
   - Feedback submission and retrieval
   - Rating aggregation and trends
   - Category-based analysis

6. **Complaint Service** (`src/services/complaintService.js`)
   - Complaint lifecycle management
   - Status tracking and updates
   - Admin response system

## User Roles

### Regular User Features
- Purchase coin packages
- Scan QR codes for waste collection
- Submit feedback and ratings
- File complaints with image support
- Track payment disputes
- View transaction and collection history

### Admin Features
- Dashboard with system overview
- Manage payment disputes and process refunds
- Resolve complaints and provide responses
- View all feedback and system statistics
- Monitor user activities

## Technical Features

### Authentication
- Role-based access control (user/admin)
- Session persistence with localStorage
- Protected routes based on user type

### UI/UX
- Modern, responsive design with Tailwind CSS
- Lucide React icons for consistent iconography
- Mobile-friendly sidebar navigation
- Real-time coin balance display
- Status indicators and progress tracking

### Data Management
- localStorage-based persistence
- Mock data with realistic scenarios
- Error handling and validation
- Search and filtering capabilities

## Demo Credentials

### Users
- Username: `user` / Password: `password`
- Username: `admin` / Password: `password`

### Demo QR Codes
- BIN001, BIN002, BIN003, BIN004, BIN005

### Mock Payment Cards
- 1234567890123456 (Balance: $1000)
- 9876543210987654 (Balance: $500)
- 1111222233334444 (Balance: $2000)

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Login with demo credentials
4. Explore different user flows based on role

## Future Enhancements

- Real QR code scanning with camera
- Integration with actual payment gateways
- Real-time notifications
- Advanced analytics and reporting
- Mobile app development
- IoT sensor integration
