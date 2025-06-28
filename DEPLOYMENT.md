# Deployment Guide 🚀

This guide will help you deploy AI Product Lab to Vercel.

## Prerequisites

- Node.js 18+ installed
- OpenRouter API key (free)
- GitHub account (optional, for automatic deployments)

## Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Product Lab"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com) and create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/ai-product-lab.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Get OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up for a free account
3. Generate an API key
4. Copy the key for the next step

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**:
   - In the project settings, go to "Environment Variables"
   - Add the following:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `NEXT_PUBLIC_APP_URL`: Your deployed app URL (e.g., `https://your-app.vercel.app`)

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at the provided URL!

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variables**:
   - Follow the prompts to add your OpenRouter API key
   - Or add them later in the Vercel dashboard

## Step 4: Configure Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## Step 5: Set Up Automatic Deployments

1. **Connect GitHub Repository**:
   - In Vercel dashboard, go to "Settings" → "Git"
   - Connect your GitHub repository

2. **Automatic Deployments**:
   - Every push to the `main` branch will trigger a new deployment
   - Pull requests will create preview deployments

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check that Node.js version is 18+
   - Ensure all dependencies are installed
   - Check the build logs in Vercel dashboard

2. **API Errors**:
   - Verify your OpenRouter API key is correct
   - Check that the environment variable is set in Vercel
   - Ensure you're using free-tier models

3. **Environment Variables Not Working**:
   - Redeploy after adding environment variables
   - Check variable names are exactly correct
   - Ensure no extra spaces in the values

### Getting Help

- Check the [Vercel documentation](https://vercel.com/docs)
- Review the [OpenRouter documentation](https://openrouter.ai/docs)
- Open an issue on the GitHub repository

## Next Steps

After deployment:

1. **Test Your App**: Make sure everything works as expected
2. **Share Your App**: Share the URL with others
3. **Monitor Usage**: Check your OpenRouter usage dashboard
4. **Customize**: Add your own branding and features

## Production Checklist

- [ ] Environment variables configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate active
- [ ] App tested thoroughly
- [ ] README updated with live URL
- [ ] GitHub repository public (if open source)

---

🎉 **Congratulations!** Your AI Product Lab is now live and ready to use! 