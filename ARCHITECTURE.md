# System Architecture

## High-Level Architecture

```mermaid
graph TB
    A[Client Browser] --> B[React Frontend]
    B --> C[Express Backend API]
    C --> D[MongoDB Database]
    C --> E[Firebase Storage]
    C --> F[Authentication Service]
    
    subgraph Frontend
        B
    end
    
    subgraph Backend
        C
        F
    end
    
    subgraph External_Services
        D
        E
    end
```

## Component Diagram

```mermaid
graph TD
    A[Frontend - React] --> B[State Management - Redux]
    A --> C[Routing - React Router]
    A --> D[UI Components]
    A --> E[HTTP Client - Axios]
    
    B --> F[Auth Store]
    B --> G[Achievement Store]
    B --> H[User Store]
    
    E --> I[Backend API]
    
    I --> J[Express Server]
    J --> K[Middleware]
    J --> L[Controllers]
    J --> M[Models]
    J --> N[Routes]
    
    M --> O[MongoDB]
    L --> O
    L --> P[Firebase SDK]
    
    subgraph Client_Side
        A
        B
        C
        D
        E
    end
    
    subgraph State_Management
        F
        G
        H
    end
    
    subgraph Server_Side
        I
        J
        K
        L
        M
        N
    end
    
    subgraph Data_Storage
        O
        P
    end
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant ReactApp
    participant ExpressAPI
    participant MongoDB
    participant Firebase
    
    User->>ReactApp: Interacts with UI
    ReactApp->>ExpressAPI: HTTP Requests
    ExpressAPI->>MongoDB: Database Operations
    ExpressAPI->>Firebase: File Storage
    Firebase-->>ExpressAPI: File URLs
    MongoDB-->>ExpressAPI: Data
    ExpressAPI-->>ReactApp: JSON Responses
    ReactApp-->>User: Updated UI
```

## Database Schema

### User Schema
```
User {
  _id: ObjectId
  name: String
  email: String (unique)
  password: String
  role: String (student/faculty/admin)
  department: String
  studentId: String (unique, optional)
  isActive: Boolean
  createdAt: Date
  updatedAt: Date
}
```

### Achievement Schema
```
Achievement {
  _id: ObjectId
  title: String
  description: String
  date: Date
  category: String (academic/sports/technical/cultural/other)
  level: String (college/university/state/national/international)
  student: ObjectId (ref: User)
  department: String
  proofDocument: String (URL)
  status: String (pending/approved/rejected)
  approvedBy: ObjectId (ref: User, optional)
  approvedAt: Date (optional)
  rejectionReason: String (optional)
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints Structure

```
/api
  /auth
    POST /register
    POST /login
    GET /profile
  /achievements
    POST /
    GET /my
    GET /
    PUT /:id/status
    GET /stats
  /users
    GET /
    GET /:id
    PUT /:id
```