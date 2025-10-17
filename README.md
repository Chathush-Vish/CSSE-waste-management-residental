# ♻️ Smart Waste Management System

A complete **Smart Waste Management System** designed to digitalize urban waste collection and recycling through a coin-based reward model.  
This system includes **Admin** and **User** modules that handle operations such as coin package management, payments, disputes, feedback, and complaints.

---

## 🚀 Tech Stack
- **Backend:** Spring Boot (Java)
- **Database:** MySQL
- **API Testing:** Postman / Swagger UI
- **Frontend:** React.js or Angular (optional)
- **Version Control:** Git & GitHub

---

## 👥 Roles

### 🧑‍💼 Admin
- Manage user accounts and complaints.
- View all payments, refunds, and disputes.
- Close resolved complaints and disputes.
- Process refunds for valid disputes.

### 👨‍💻 User
- Purchase coin packages (Silver / Gold / Diamond).
- Pay for waste collection using coins.
- Submit feedback, ratings, and complaints.
- Track complaint and payment history.

---

## ⚙️ Core Functionalities

### 🪙 Coin Package Management
- **Get All Packages** → `GET /coinpackage/getall`
- **Buy Package** → `POST /coinpackage/buy-package`

### 💰 Payment Management
- **Get All Payments (Admin)** → `GET /payments/all`
- **Get Payments by User** → `GET /payments/user/{userId}`
- **Process Refund (Admin)** → `POST /refund/process`

### ⚖️ Dispute Handling
- **Create Dispute (User)** → `POST /dispute/create`
- **Resolve Dispute (Admin)** → `PUT /dispute/resolve/{id}`
- **View All Disputes (Admin)** → `GET /dispute/all`

### 💬 Complaint Management
- **Create Complaint (User)** → `POST /complaints/create`
- **Get Complaints by User** → `GET /complaints/user/{userId}`
- **Get All Complaints (Admin)** → `GET /complaints/admin/all`
- **Close Complaint (Admin)** → `PUT /complaints/{id}/close`

### ⭐ Feedback System
- **Publish Feedback (User)** → `POST /feedback/publish`

---

## 🧠 How It Works

1. **User buys a coin package** via the system.
2. **Coins are credited** to their account for future waste collections.
3. After service, users can **rate and review** the collection.
4. In case of problems, users can **submit complaints or disputes**.
5. **Admin reviews disputes and complaints**, and may issue **refunds**.
6. Reports are available for payments, disputes, and complaint tracking.

---

## 🧾 Example Flow
1. User logs in → Purchases “Gold” package (2000 coins for Rs.5000).  
2. Coins are added → User pays coins for garbage collection.  
3. User submits feedback: ⭐⭐⭐⭐⭐ “Great service!”  
4. User files a complaint if service fails → Admin resolves or refunds.

---

## 🧩 API Example

```json
POST /coinpackage/buy-package
{
  "packageId": "1",
  "userId": "1"
}
