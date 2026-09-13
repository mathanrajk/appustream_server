 AppuStream Server
 
A lightweight streaming server for delivering music content over HTTP/WebSocket, built for fast and reliable audio playback.
 
## Tech Stack
 
- **Runtime:** Node.js (TypeScript)
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **File Uploads:** Formidable
- **Media Storage:** Cloudinary
- **Email:** Nodemailer
- **Validation:** Yup
## Features
 
- User authentication (JWT-based) with secure password hashing
- File/media upload handling
- Cloud-based media storage via Cloudinary
- Email notifications via Nodemailer
- Request validation with Yup
- Path aliasing support (tsconfig-paths)
## Prerequisites
 
- Node.js (v18+ recommended)
- MongoDB instance (local or hosted)
- Cloudinary account (for media storage)
- SMTP credentials (for email functionality)
## Getting Started
 
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd server
 
# 2. Install dependencies
npm install
 
# 3. Run the development server
npm run dev
```
 
The server will start with hot-reload enabled via `ts-node-dev`.
 
## Installation
 
```bash
# Clone the repository
git clone <your-repo-url>
cd server
 
# Install dependencies
npm install
```
 
## Environment Variables
 
Create a `.env` file in the root directory with the following:
 
```env
PORT=8989
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
 
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
 
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```
 
## Scripts
 
| Command       | Description                                  |
|---------------|-----------------------------------------------|
| `npm run dev`   | Start the development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript for production |
 
## Project Structure
 
```
server/
├── src/
│   ├── index.ts        # Entry point
│   ├── routes/         # API routes
│   ├── controllers/    # Route controllers
│   ├── models/         # Mongoose models
│   ├── middleware/      # Custom middleware
│   └── utils/           # Helper utilities
├── tsconfig.json
├── package.json
└── .env
```
 
## License
 
This project is licensed under the ISC License. 
