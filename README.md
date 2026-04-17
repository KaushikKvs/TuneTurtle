# TuneTurtle - Emerging Artists Platform 🐢🎵

A premium music streaming and marketplace platform built with Spring Boot, React, and Tailwind CSS.

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Java 17+
- Node.js 18+
- MongoDB (Local or Atlas)
- PostgreSQL (Local or Supabase)

### 2. Environment Setup
TuneTurtle uses a **Secure Hybrid Configuration** model. Secrets are never stored in the codebase.

#### Method A: Environment Variables (Recommended)
Set the following variables in your terminal or IDE:
```bash
# Backend Secrets
export STRIPE_SECRET_KEY=sk_test_...
export MONGODB_URI=mongodb://...
export DB_PASSWORD=your_db_password
export CLOUDINARY_API_KEY=your_key
export CLOUDINARY_API_SECRET=your_secret
export JWT_SECRET=your_jwt_secret
```

#### Method B: Local Properties File
Create a file at `backend/music-service/src/main/resources/application-local.properties` (this file is ignored by Git):
```properties
stripe.secret.key=sk_test_...
spring.data.mongodb.uri=mongodb://...
spring.datasource.password=your_db_password
# ... and other secrets
```

### 3. Run the Backend
```bash
cd backend/music-service
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### 4. Run the Frontend
```bash
cd frontend/user-app
npm install
npm run dev
```

## ☁️ Production Deployment (AWS)

TuneTurtle is designed to run securely on AWS. It automatically attempts to pull secrets from **AWS Secrets Manager** using the following key:
`tuneturtle/prod/secrets`

### Required IAM Policy
The execution environment (EC2/ECS/Lambda) requires:
```json
{
  "Effect": "Allow",
  "Action": "secretsmanager:GetSecretValue",
  "Resource": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:tuneturtle/prod/secrets-*"
}
```

## 🎨 Theme Engine
TuneTurtle features a dynamic animated background system inspired by **AWS** and **Solo Leveling**.
- **Default**: Slate Dark
- **AWS Gradient**: Immersive animated blobs with hardware acceleration.
- **Solo Leveling**: Procedural shadow silhouettes on Canvas.

---
*Built with ❤️ for emerging artists.*
