
# Blog Application with AI-Powered Sentiment Analysis

This is a **blog application** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with AI-powered sentiment analysis for blog posts. The application allows users to **create blogs**, **post comments**, and **analyze sentiment** (positive, negative, neutral) of blog text. It also includes **user authentication** with **JWT** (JSON Web Tokens).

## Features

- **User Authentication**:
  - User registration with email and password.
  - User login with email and password.
  - Protected routes with JWT for authentication.

- **Blog Operations**:
  - Create new blog posts with sentiment analysis.
  - View individual blog posts.
  - View all blog posts.
  - Edit blog posts.
  - Delete blog posts (soft delete).

- **Comment System**:
  - Post comments on blog posts.
  - Display comments under blog posts.

- **Sentiment Analysis**:
  - AI-powered sentiment analysis to analyze the sentiment (positive, neutral, or negative) of the blog content.

## Tech Stack

- **Frontend**: React.js, Axios, React Router, Redux (optional)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose for ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Sentiment Analysis**: Integration with any free AI-powered sentiment analysis API (e.g., Aylien, Twinword)
- **Deployment**:
  - Frontend: Vercel (for React app)
  - Backend: Render/Heroku
  - Database: MongoDB Atlas

## Installation

### Prerequisites

- Node.js and npm (or yarn) installed.
- MongoDB instance (you can use MongoDB Atlas for cloud DB).
- AI sentiment analysis API key or endpoint.

### 1. Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/blog-app.git
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add your MongoDB URI and JWT secret:
   ```
   MONGO_URI=mongodb://localhost:27017/blogApp
   JWT_SECRET=your_jwt_secret_key
   AI_SENTIMENT_API_URL=your_sentiment_analysis_api_url
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. The backend will be available at `http://localhost:5000`.

### 2. Frontend Setup

1. Navigate to the frontend directory (React app):
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URLs in the frontend files to match your backend URL (`http://localhost:5000` or deployed URL).

4. Start the frontend development server:
   ```bash
   npm start
   ```

5. The frontend will be available at `http://localhost:3000`.

### 3. Testing

- **User Authentication**: Test user registration and login using **Postman** or any HTTP client.
- **Blog Operations**: Test CRUD operations for blogs (create, read, update, delete).
- **Comments**: Test adding and viewing comments under blog posts.
- **Sentiment Analysis**: The sentiment of the blog text will be analyzed and returned as part of the blog creation process.

## API Endpoints

### 1. Authentication Routes

- **POST `/api/auth/register`**: Register a new user.
  - Request Body: `{ name, email, username, password, gender, topics }`
  - Response: JWT token on successful registration.

- **POST `/api/auth/login`**: Login a user.
  - Request Body: `{ email, password }`
  - Response: JWT token on successful login.

- **GET `/api/auth/profile`**: Get user profile (protected route).
  - Requires JWT token in the `Authorization` header.
  - Response: User profile data (name, email, topics, gender).

### 2. Blog Routes

- **POST `/api/blog/createBlog`**: Create a new blog post.
  - Request Body: `{ title, textBody, image, topic }`
  - Response: New blog data with sentiment analysis result.

- **GET `/api/blog/readBlog/:blogID`**: Get a specific blog by its ID.
  - Response: Blog data including title, textBody, sentiment, etc.

- **GET `/api/blog/readAllBlogs`**: Get all blogs.
  - Response: Array of blogs with titles, sentiments, and more.

- **PATCH `/api/blog/editBlog/:blogID`**: Edit a blog post.
  - Request Body: `{ title, textBody, image, topic }`
  - Response: Updated blog data.

- **DELETE `/api/blog/deleteBlog/:blogID`**: Delete a blog post (soft delete).
  - Response: Success message.

### 3. Comment Routes

- **POST `/api/comments`**: Post a comment on a blog.
  - Request Body: `{ blogID, text }`
  - Response: Success message.

### 4. Sentiment Analysis Route

- **POST `/api/ai/sentiment`**: Analyze the sentiment of a block of text.
  - Request Body: `{ text }`
  - Response: Sentiment value (Positive, Negative, Neutral).

## Deployment

- **Frontend**: Deploy the React app to **Vercel** or **Netlify**.
- **Backend**: Deploy the Node.js/Express app to **Render** or **Heroku**.
- **Database**: Use **MongoDB Atlas** for cloud database hosting.

## Contributing

If you'd like to contribute to this project:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push to your forked repository (`git push origin feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

---

### Final Notes:

- This **README** gives a comprehensive guide on setting up and running the project.
- Make sure to **replace placeholder values** like `your_jwt_secret_key` and `your_sentiment_analysis_api_url` in the `.env` file with your actual credentials.
- You can add more features like **search**, **pagination**, **role-based access control**, etc., as you scale the project.

