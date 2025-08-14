# 🧪 API Testing Guide - Shipsy Backend

## 📋 **API Endpoints & Test Commands**

### 🔐 **Authentication Endpoints**

#### 1. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### 2. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 3. Get Current User Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

### 🚢 **Ships Management Endpoints**

#### 4. Get All Ships (with pagination)
```bash
# Basic request
curl -X GET "http://localhost:5000/api/ships"

# With pagination
curl -X GET "http://localhost:5000/api/ships?page=1&limit=5"

# With filtering
curl -X GET "http://localhost:5000/api/ships?status=Active&type=Container%20Ship"

# With search
curl -X GET "http://localhost:5000/api/ships?search=Ocean"

# With sorting
curl -X GET "http://localhost:5000/api/ships?sortBy=name&sortOrder=asc"
```

#### 5. Get Ship by ID
```bash
curl -X GET http://localhost:5000/api/ships/SHIP_ID_HERE
```

#### 6. Create New Ship
```bash
curl -X POST http://localhost:5000/api/ships \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Test Ship",
    "type": "Container Ship",
    "capacity": "3000 TEU",
    "status": "Active",
    "specifications": {
      "length": 250,
      "width": 35,
      "height": 20,
      "draft": 12,
      "yearBuilt": 2022,
      "flag": "Panama",
      "homePort": "Rotterdam"
    },
    "crew": {
      "captain": "Capt. Test Captain",
      "totalCrew": 20,
      "requiredCrew": 18
    },
    "location": {
      "currentPort": "Atlantic Ocean",
      "nextPort": "Port of New York",
      "estimatedArrival": "2024-01-15T10:00:00.000Z"
    },
    "maintenance": {
      "lastMaintenance": "2024-01-01T00:00:00.000Z",
      "nextMaintenance": "2024-02-01T00:00:00.000Z"
    }
  }'
```

#### 7. Update Ship
```bash
curl -X PUT http://localhost:5000/api/ships/SHIP_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Updated Ship Name",
    "status": "Maintenance",
    "specifications": {
      "length": 260,
      "width": 36
    }
  }'
```

#### 8. Delete Ship
```bash
curl -X DELETE http://localhost:5000/api/ships/SHIP_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### 9. Get Fleet Statistics
```bash
curl -X GET http://localhost:5000/api/ships/stats/overview
```

---

### 👤 **User Management Endpoints**

#### 10. Get User Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### 11. Update User Profile
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "username": "newusername",
    "profile": {
      "firstName": "Updated",
      "lastName": "Name",
      "phone": "+1234567890"
    }
  }'
```

#### 12. Change Password
```bash
curl -X PUT http://localhost:5000/api/users/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword123"
  }'
```

#### 13. Get All Users (Admin Only)
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

### 🧪 **Testing Workflow**

#### **Step 1: Test Server Health**
```bash
curl -X GET http://localhost:5000/
```

#### **Step 2: Test Registration**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### **Step 3: Test Login & Get Token**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### **Step 4: Use Token for Protected Endpoints**
```bash
# Copy the token from login response and use it here
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

### 📱 **Postman Collection Import**

You can also import these endpoints into Postman:

1. **Create a new collection** called "Shipsy API"
2. **Set base URL** to `http://localhost:5000`
3. **Create environment variables**:
   - `base_url`: `http://localhost:5000`
   - `token`: (leave empty, will be set after login)
4. **Import the endpoints** using the curl commands above

---

### 🔑 **Sample Test Data**

#### **Test Users**
```json
{
  "admin": {
    "email": "admin@shipsy.com",
    "password": "admin123"
  },
  "manager": {
    "email": "manager@shipsy.com", 
    "password": "manager123"
  },
  "operator": {
    "email": "operator@shipsy.com",
    "password": "operator123"
  }
}
```

#### **Test Ship Data**
```json
{
  "name": "Test Vessel",
  "type": "Container Ship",
  "capacity": "4000 TEU",
  "status": "Active",
  "specifications": {
    "length": 280,
    "width": 38,
    "height": 22,
    "draft": 14,
    "yearBuilt": 2021,
    "flag": "Liberia",
    "homePort": "Singapore"
  },
  "crew": {
    "captain": "Capt. John Doe",
    "totalCrew": 22,
    "requiredCrew": 20
  }
}
```

---

### 🚨 **Error Testing**

#### **Test Invalid Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@email.com",
    "password": "wrongpassword"
  }'
```

#### **Test Unauthorized Access**
```bash
curl -X GET http://localhost:5000/api/users/profile
# Should return 401 Unauthorized
```

#### **Test Invalid Ship Data**
```bash
curl -X POST http://localhost:5000/api/ships \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "",
    "type": "Invalid Type"
  }'
# Should return 400 Bad Request
```

---

### 📊 **Expected Responses**

#### **Successful Response Format**
```json
{
  "message": "Operation successful",
  "data": { ... },
  "status": "success"
}
```

#### **Error Response Format**
```json
{
  "message": "Error description",
  "error": "Detailed error info",
  "status": "error"
}
```

---

### 🎯 **Quick Test Commands**

#### **Health Check**
```bash
curl http://localhost:5000/
```

#### **Register & Login in One Go**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

**Happy Testing! 🚢✨**

**Note**: Replace `YOUR_JWT_TOKEN_HERE` with the actual token received from the login response.
**Note**: Replace `SHIP_ID_HERE` with actual ship IDs when testing update/delete operations. 