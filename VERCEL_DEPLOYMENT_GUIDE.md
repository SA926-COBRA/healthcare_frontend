# Vercel Deployment Guide for CliniCore Frontend

## 🚀 Connecting Frontend (Vercel) to Backend (Render)

### 1. **Environment Variables Configuration**

In your Vercel dashboard, go to your project settings and add these environment variables:

```bash
# API Configuration - Render.com Backend
VITE_API_URL=https://healthcare-backend-1-3c6k.onrender.com

# Application Configuration
VITE_APP_NAME=CliniCore
VITE_APP_VERSION=1.0.0

# Production Configuration
VITE_DEBUG=false
VITE_LOG_LEVEL=warn

# Feature Flags
VITE_ENABLE_TELEMEDICINE=true
VITE_ENABLE_TISS_BILLING=true
VITE_ENABLE_MOBILE_APP=true

# File Upload Configuration
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Security Configuration
VITE_SESSION_TIMEOUT=1800000
VITE_REFRESH_TOKEN_INTERVAL=900000
```

### 2. **How to Add Environment Variables in Vercel**

1. Go to your Vercel dashboard
2. Select your project: `healthcare-frontend-3`
3. Go to **Settings** → **Environment Variables**
4. Add each variable above with the exact values
5. Make sure to set them for **Production** environment
6. Click **Save**

### 3. **Redeploy Your Frontend**

After adding the environment variables:

1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger automatic deployment

### 4. **Verify Connection**

Once redeployed, test the connection:

1. Visit: `https://healthcare-frontend-3.vercel.app/`
2. Open browser developer tools (F12)
3. Go to **Network** tab
4. Try to login or make any API call
5. Check if requests are going to: `https://healthcare-backend-1-3c6k.onrender.com`

### 5. **CORS Configuration**

The backend is already configured to allow your Vercel domain:
- ✅ `https://healthcare-frontend-3.vercel.app`
- ✅ `https://healthcare-frontend-3.vercel.app/`

### 6. **Troubleshooting**

If you encounter CORS errors:

1. **Check Environment Variables**: Make sure `VITE_API_URL` is set correctly
2. **Check Network Tab**: Verify API calls are going to the right URL
3. **Check Backend Logs**: Look at Render.com logs for any errors
4. **Test Backend Directly**: Visit `https://healthcare-backend-1-3c6k.onrender.com/health`

### 7. **Local Development**

For local development, create a `.env.local` file:

```bash
VITE_API_URL=http://localhost:8000
VITE_DEBUG=true
```

## 🎯 **Quick Setup Checklist**

- [ ] Add `VITE_API_URL=https://healthcare-backend-1-3c6k.onrender.com` to Vercel environment variables
- [ ] Redeploy frontend
- [ ] Test login functionality
- [ ] Check browser network tab for API calls
- [ ] Verify backend health endpoint

## 📞 **Support**

If you need help:
1. Check Vercel deployment logs
2. Check Render.com backend logs
3. Test backend health endpoint directly
4. Verify environment variables are set correctly
