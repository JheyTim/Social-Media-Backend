# Social Media Backend
## Overview
A Node.js + GraphQL backend for a fully featured social media platform. It supports user profiles, follow system, posts with media uploads, real-time notifications, admin moderation, and more. This project is open-source ready, complete with Docker support and best practices around security and architecture.

## Features
* User Authentication
  * JWT for email/password sign-ups
  * OAuth (Google) for social logins

* User Profiles
  * Extended fields: bio, profile picture, location, etc.
  * Follower/Following system

* Posts & Media
  * Create, edit, delete posts
  * Upload images/videos to AWS S3
  * Like/Unlike system

* Real-Time
  * GraphQL Subscriptions for new posts, notifications, etc.
  * WebSockets for real-time updates

* Notifications
  * Follow notifications, likes, etc.
  * Mark as read, retrieve user-specific notifications

* Admin & Moderation
  * Role-based access (admin vs. user)
  * Ban users, remove posts, handle reports (spam, abuse)

* Security & Best Practices
  * Rate limiting, helmet, CORS
  * GraphQL depth/complexity limiting

* Deployment
  * Docker & Docker Compose
 
## Tech Stack
* **Node.js**
* **GraphQL** (Apollo Server / apollo-server-express)
* **MongoDB** (Mongoose for ODM)
* **AWS S3** (for file storage)
* **WebSockets / GraphQL Subscriptions**
* **Docker & Docker Compose** (for containerization)

## Getting Started
### Prerequisites
* Node.js installed (v22.13.1 recommended).

* MongoDB: Either local or a remote instance (e.g., MongoDB Atlas).

* AWS S3 credentials if you plan to test media uploads.

* Docker (optional, for containerized deployment).

### Installation
1. Clone the repository:
   ```bash
   https://github.com/JheyTim/Social-Media-Backend.git
   cd Social-Media-Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Create a .env file in the root directory and add the following:
    ```env
    PORT=4000
    MONGODB_URI=mongodb://localhost:27017/socialmedia
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_secret_key
    AWS_ACCESS_KEY_ID=your_aws_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret
    AWS_S3_BUCKET=your_s3_bucket_name
    AWS_REGION=your_aws_region
    ```
4. Start the application:
   ```bash
   npm run dev
   ```
## License
This project is licensed under the [MIT License](LICENSE).
