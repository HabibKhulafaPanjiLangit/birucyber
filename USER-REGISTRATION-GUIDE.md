# 🎯 USER REGISTRATION SYSTEM - COMPLETE GUIDE

## 📋 Overview

Sistem registrasi user yang lengkap dengan field khusus untuk:
- ⚡ **XSS Testing** (Author Name, Bio, Avatar)
- 🔐 **Access Control Testing** (Access Token, Allowed Resources)
- 👤 **User Management** (Basic Info, Role, Contact)

---

## 🔥 NEW FEATURES

### **1. Enhanced User Schema**

```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String?
  username        String   @unique
  password        String
  role            Role     @default(GUEST)
  
  // XSS Testing Fields
  authorName      String?  // For XSS testing as comment author
  bio             String?  // User bio for XSS testing
  
  // Access Control Testing Fields
  accessToken     String?  @unique // Unique token for access control testing
  allowedResources String? // JSON array of allowed resource paths
  
  // Additional Fields
  avatar          String?  // Profile avatar URL
  phone           String?  // Phone number
  address         String?  // Address
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### **2. Complete Registration API**

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "username": "johndoe",
  "password": "default123",
  "role": "USER",
  
  // XSS Testing Fields
  "authorName": "John Doe",
  "bio": "Security researcher and penetration tester",
  "avatar": "https://example.com/avatar.jpg",
  
  // Access Control Testing Fields
  "accessToken": "token_johndoe_1730563200000",
  "allowedResources": ["/public", "/home", "/profile", "/dashboard"],
  
  // Additional Fields
  "phone": "+1234567890",
  "address": "123 Main St, City, Country"
}
```

**Response:**
```json
{
  "success": true,
  "message": "✅ User created successfully with complete testing fields!",
  "user": {
    "id": "cm2ybk1234567890",
    "email": "john@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "role": "USER",
    "authorName": "John Doe",
    "bio": "Security researcher...",
    "accessToken": "token_johndoe_1730563200000",
    "allowedResources": ["/public", "/home", "/profile", "/dashboard"],
    "avatar": "https://example.com/avatar.jpg",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country",
    "createdAt": "2025-11-02T10:00:00.000Z"
  },
  "details": {
    // Same as user object above
  },
  "testingInfo": {
    "xssTesting": {
      "field": "authorName",
      "value": "John Doe",
      "usage": "Use this as author in XSS comment testing"
    },
    "accessControlTesting": {
      "field": "accessToken",
      "value": "token_johndoe_1730563200000",
      "allowedResources": ["/public", "/home", "/profile", "/dashboard"],
      "usage": "Use this token in Access Control testing"
    }
  }
}
```

---

## 🎨 UI COMPONENTS

### **UserRegistrationForm Component**

**Location:** `src/components/UserRegistrationForm.tsx`

**Features:**
- ✅ Real-time form validation
- ✅ Auto-fill related fields
- ✅ Role-based resource generation
- ✅ Access token generator
- ✅ Success/Error alerts
- ✅ Created user details display
- ✅ Cyberpunk dark theme UI

**Sections:**

1. **👤 Basic Information**
   - Email (required, validated)
   - Full Name (required)
   - Username (auto-generated from email)
   - Password (default: "default123")
   - Role (GUEST/USER/ADMIN)
   - Phone
   - Address

2. **⚡ XSS Testing Fields**
   - Author Name (for comment testing)
   - User Bio (for XSS payloads)
   - Avatar URL (for image-based XSS)

3. **🔐 Access Control Testing Fields**
   - Access Token (auto-generated or manual)
   - Allowed Resources (JSON array, auto-filled by role)

---

## 🚀 USAGE GUIDE

### **1. Register User for XSS Testing**

```typescript
// Create user with XSS testing fields
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'hacker@test.com',
    name: 'XSS Tester',
    username: 'xsstester',
    role: 'USER',
    authorName: 'XSS Tester', // Will be used in XSS comments
    bio: 'Testing XSS vulnerabilities'
  })
})

const data = await response.json()
console.log('Author Name:', data.details.authorName)

// Now use this in XSS testing
const xssTest = await fetch('/api/xss', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    author: data.details.authorName, // Use the registered author name
    comment: '<script>alert("XSS")</script>',
    testMode: 'vulnerable'
  })
})
```

### **2. Register User for Access Control Testing**

```typescript
// Create GUEST user with limited resources
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'guest@test.com',
    name: 'Guest User',
    username: 'guestuser',
    role: 'GUEST',
    accessToken: 'token_guest_1234567890',
    allowedResources: ['/public', '/home'] // Limited access
  })
})

const data = await response.json()
console.log('Access Token:', data.details.accessToken)
console.log('Allowed Resources:', data.details.allowedResources)

// Now test access control bypass
const acTest = await fetch('/api/access-control', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resource: '/admin', // Try to access admin resource
    userToken: data.details.accessToken, // Use the guest token
    testMode: 'vulnerable',
    bypassAttempt: true
  })
})
```

### **3. Complete Registration Flow in UI**

```tsx
import UserRegistrationForm from '@/components/UserRegistrationForm'

export default function Page() {
  return (
    <div>
      <h1>Register New User</h1>
      <UserRegistrationForm />
    </div>
  )
}
```

---

## 📊 DEFAULT RESOURCES BY ROLE

### **GUEST Role**
```json
["/public", "/home"]
```
- Minimal access
- Public pages only

### **USER Role**
```json
["/public", "/home", "/profile", "/dashboard"]
```
- Standard user access
- Can access personal dashboard

### **ADMIN Role**
```json
[
  "/public",
  "/home",
  "/profile",
  "/dashboard",
  "/admin",
  "/api/users",
  "/api/reports"
]
```
- Full system access
- Administrative functions
- User management

---

## 🔧 AUTO-GENERATION FEATURES

### **1. Username Auto-generation**
```typescript
// If username not provided, extract from email
const username = email.split('@')[0]
// "john@example.com" → "johndoe"
```

### **2. Access Token Auto-generation**
```typescript
// Format: token_{username}_{timestamp}
const accessToken = `token_${username}_${Date.now()}`
// Example: "token_johndoe_1730563200000"
```

### **3. Author Name Auto-fill**
```typescript
// If authorName not provided, use name
const authorName = authorName || name
```

### **4. Allowed Resources Auto-fill**
```typescript
// Based on role, automatically set resources
switch (role) {
  case 'ADMIN':
    resources = ['/public', '/home', '/profile', '/dashboard', '/admin', '/api/users', '/api/reports']
    break
  case 'USER':
    resources = ['/public', '/home', '/profile', '/dashboard']
    break
  case 'GUEST':
    resources = ['/public', '/home']
    break
}
```

---

## 🧪 TESTING SCENARIOS

### **Scenario 1: XSS Attack with Registered User**

1. **Register User:**
   ```json
   {
     "email": "attacker@test.com",
     "name": "Attacker",
     "authorName": "Mr. Hacker",
     "bio": "Penetration tester"
   }
   ```

2. **Use in XSS Test:**
   ```json
   {
     "author": "Mr. Hacker",
     "comment": "<img src=x onerror=alert('XSS')>",
     "testMode": "vulnerable"
   }
   ```

3. **Verify:** Check if XSS payload executed

### **Scenario 2: Access Control Bypass**

1. **Register Guest User:**
   ```json
   {
     "email": "guest@test.com",
     "name": "Guest",
     "role": "GUEST",
     "accessToken": "token_guest_123"
   }
   ```

2. **Try Admin Access:**
   ```json
   {
     "resource": "/admin",
     "userToken": "token_guest_123",
     "testMode": "vulnerable",
     "bypassAttempt": true
   }
   ```

3. **Verify:** Check if bypass successful

### **Scenario 3: Role-Based Testing**

1. **Create 3 Users:**
   - Guest: Limited access
   - User: Standard access
   - Admin: Full access

2. **Test Each Token:**
   ```json
   // Test same resource with different tokens
   {
     "resource": "/dashboard",
     "userToken": "<each_token>",
     "testMode": "safe"
   }
   ```

3. **Compare Results:** Verify proper access control

---

## 📈 BENEFITS

### **For Security Testers**
✅ Quick user creation with all testing fields
✅ Auto-generated tokens for testing
✅ Role-based resource mapping
✅ No manual token management

### **For Penetration Testers**
✅ Multiple user profiles for different scenarios
✅ Easy access control bypass testing
✅ XSS payload testing with real user data
✅ Comprehensive user context

### **For Developers**
✅ Complete user model with all fields
✅ Proper validation and error handling
✅ Type-safe API with Prisma
✅ Auto-fill and generation features

### **For Education**
✅ Real-world user registration flow
✅ Security field examples
✅ Best practices demonstration
✅ Complete testing scenarios

---

## 🔒 SECURITY CONSIDERATIONS

### **⚠️ Warning: This is for Testing Only!**

1. **Default Password:** `default123` is used - DO NOT use in production
2. **Token Generation:** Simple timestamp-based - use JWT in production
3. **Password Storage:** Plain text storage - use bcrypt in production
4. **Validation:** Basic validation - add more checks in production

### **Production Recommendations:**

```typescript
// 1. Hash passwords
import bcrypt from 'bcrypt'
const hashedPassword = await bcrypt.hash(password, 10)

// 2. Generate secure tokens
import { randomBytes } from 'crypto'
const accessToken = randomBytes(32).toString('hex')

// 3. Add email verification
// 4. Add rate limiting
// 5. Add CAPTCHA
// 6. Add 2FA support
```

---

## 📝 API EXAMPLES

### **Create Admin User**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@birucyber.com",
    "name": "Super Admin",
    "username": "admin",
    "password": "admin123",
    "role": "ADMIN",
    "authorName": "Admin User",
    "bio": "System administrator and security lead",
    "phone": "+1234567890"
  }'
```

### **Create Test User for XSS**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "xsstest@test.com",
    "name": "XSS Tester",
    "role": "USER",
    "authorName": "XSS Test User",
    "bio": "<script>alert(\"XSS\")</script>"
  }'
```

### **Create Guest for Access Control**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "guest@test.com",
    "name": "Guest User",
    "role": "GUEST"
  }'
```

### **Get All Users**
```bash
curl http://localhost:3000/api/users
```

---

## 🎉 SUMMARY

### **What We Built:**

1. ✅ **Enhanced User Model** with 13 fields
2. ✅ **Complete Registration API** with validation
3. ✅ **Beautiful UI Form** with auto-fill features
4. ✅ **XSS Testing Fields** (authorName, bio, avatar)
5. ✅ **Access Control Fields** (accessToken, allowedResources)
6. ✅ **Role-Based Access** (GUEST/USER/ADMIN)
7. ✅ **Auto-Generation** (token, username, resources)
8. ✅ **Testing Integration** (ready for XSS & AC tests)

### **Ready for:**

- 🔥 Professional penetration testing
- 🔥 Security research and education
- 🔥 Comprehensive vulnerability assessment
- 🔥 Real-world attack simulation
- 🔥 Access control bypass testing
- 🔥 XSS payload testing

---

**🚀 PLATFORM SIAP UNTUK TESTING LENGKAP!**
