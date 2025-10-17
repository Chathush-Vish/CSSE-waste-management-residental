# API Integration Documentation

## Overview
The admin complaint handling system has been integrated with your REST API endpoint `http://localhost:8080/complaints/admin/all` with fallback to localStorage for development.

## API Endpoints Integrated

### 1. Create Complaint
- **Endpoint**: `POST http://localhost:8080/complaints`
- **Purpose**: Create a new complaint
- **Headers**: 
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body**:
  ```json
  {
    "userId": 1,
    "category": "Service Delay",
    "description": "The garbage collection truck did not arrive on the scheduled date.",
    "evidenceUrl": "https://example.com/uploads/truck-missed.jpg",
    "preferredContact": "0123456789"
  }
  ```
- **Response**: Expected to return status code "00" for success with complaint ID

### 2. Get All Complaints (Admin)
- **Endpoint**: `GET http://localhost:8080/complaints/admin/all`
- **Purpose**: Fetch all complaints for admin review
- **Headers**: 
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Response**: Array of complaint objects

### 2. Update Complaint Status (Admin)
- **Endpoint**: `PUT http://localhost:8080/complaints/admin/{complaintId}/status`
- **Purpose**: Update complaint status and add admin response
- **Headers**: 
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body**:
  ```json
  {
    "status": "pending|in_progress|resolved|rejected",
    "adminResponse": "Admin response message",
    "updatedAt": "2025-10-17T11:45:00.000Z",
    "resolvedAt": "2025-10-17T11:45:00.000Z" // Only for resolved status
  }
  ```

### 3. Close Complaint (Admin)
- **Endpoint**: `PUT http://localhost:8080/complaints/{complaintId}/close`
- **Purpose**: Close a complaint (final status)
- **Headers**: 
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body**: No body required
- **Response**: Expected to return status code "00" for success

## Complaint Status Flow

### Available Statuses:
1. **OPEN** - Active complaint that needs attention
2. **CLOSE** - Complaint is closed (final status)

### Status Transitions:
- `OPEN` → `CLOSE` (One-way transition only)

## Admin Actions Available

### From OPEN Status:
- **Close Complaint** - Changes status to `CLOSE` using `/complaints/{id}/close` endpoint

### From CLOSE Status:
- No actions available (final status)

## Implementation Details

### Service Integration
The `complaintService.js` has been updated with:

```javascript
// Get all complaints with API integration
async getAllComplaints() {
  try {
    const response = await fetch(`${this.baseURL}/complaints/admin/all`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    // Fallback to localStorage
    return [...this.complaints];
  }
}

// Update complaint status with API integration
async updateComplaintStatus(complaintId, status, adminResponse = '') {
  try {
    const response = await fetch(`${this.baseURL}/complaints/admin/${complaintId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        adminResponse,
        updatedAt: new Date().toISOString(),
        resolvedAt: (status === 'resolved' || status === 'closed') ? new Date().toISOString() : null
      })
    });
    return await response.json();
  } catch (error) {
    // Fallback to localStorage
  }
}
```

### API Status Monitoring
- Added `ApiStatus` component to show real-time API connection status
- Displays connection status with color-coded indicators
- Provides refresh button to recheck connection
- Shows appropriate fallback messages

### Error Handling
- **API Available**: Uses REST API endpoints
- **API Unavailable**: Falls back to localStorage with console warnings
- **Network Errors**: Graceful degradation with user feedback

## Testing the Integration

### 1. Start Your Backend Server
Make sure your backend server is running on `http://localhost:8080`

### 2. Test API Endpoints
You can test the endpoints using curl:

```bash
# Get all complaints
curl -X GET http://localhost:8080/complaints/admin/all \
  -H "Content-Type: application/json"

# Update complaint status
curl -X PUT http://localhost:8080/complaints/admin/{complaintId}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "adminResponse": "Issue has been resolved",
    "updatedAt": "2025-10-17T11:45:00.000Z",
    "resolvedAt": "2025-10-17T11:45:00.000Z"
  }'
```

### 3. Frontend Testing
1. Login as admin (`admin/password`)
2. Navigate to Complaints tab
3. Check API status indicator
4. Test complaint status updates

## Expected API Response Format

### Your API Response Structure:
```json
{
  "statusCode": "00",
  "message": "All complaints retrieved successfully",
  "content": [
    {
      "complaintId": "2bf207f9-391a-4679-9e19-fc5042e91b22",
      "userId": 1,
      "category": "Service Delay",
      "description": "The garbage collection truck did not arrive on the scheduled date.",
      "status": "OPEN",
      "evidenceUrl": "https://example.com/uploads/truck-missed.jpg",
      "createdAt": null,
      "preferredContact": "0123456789"
    }
  ]
}
```

### Status Mapping:
- **API Status** → **Frontend Status**
- `OPEN` → `OPEN` (Active complaint)
- `CLOSE` → `CLOSE` (Closed complaint)

### Category Mapping:
- **API Category** → **Frontend Category**
- `Service Delay` → `collection`
- `Payment Issue` → `payment`
- `Service Quality` → `service`
- `Technical Problem` → `technical`

### Data Transformation:
The frontend automatically transforms your API data:
- `complaintId` → `id`
- `category` → `title` (displayed as complaint title)
- `status` → mapped to frontend status
- `evidenceUrl` → `image`
- `userId` → converted to string and `userName` generated
- `preferredContact` → displayed in admin interface

## Authentication (Future Enhancement)
Currently, the API calls don't include authentication headers. To add authentication:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

## CORS Configuration
Make sure your backend server allows CORS requests from `http://localhost:5173` (Vite dev server).

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Configure backend to allow frontend origin
2. **Network Errors**: Check if backend server is running
3. **404 Errors**: Verify API endpoint URLs match backend routes
4. **JSON Parse Errors**: Ensure API returns valid JSON

### Debug Information:
- Check browser console for API call logs
- API status component shows connection status
- Fallback to localStorage when API is unavailable

## Next Steps
1. Implement authentication headers
2. Add pagination for large complaint lists
3. Add real-time updates using WebSockets
4. Implement complaint search and filtering via API
5. Add file upload handling for complaint images
