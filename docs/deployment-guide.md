# Deployment Guide

## Frontend on Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Set the root directory to `client`.
4. Add the environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-render-backend-url/api`
5. Deploy.

## Backend on Render

1. Create a new Web Service in Render.
2. Connect the same GitHub repository.
3. Set the root directory to `server`.
4. Use:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `PORT=10000`
   - `MONGODB_URI=your-mongodb-connection-string`
   - `JWT_SECRET=your-long-random-secret`
   - `CLIENT_URL=https://your-vercel-frontend-url`
6. Deploy the backend.

## MongoDB

Use MongoDB Atlas for production and allow the Render service IP range or open trusted access appropriately.

## Post Deployment Checklist

1. Verify the frontend can sign up and log in against the deployed backend.
2. Confirm CORS uses the correct Vercel domain.
3. Generate a study plan and verify analytics update.
4. Test the PDF export and planner pages in production.
