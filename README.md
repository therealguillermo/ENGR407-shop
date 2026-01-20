# Old Main Shop - Laser Engraved Collection

A Next.js e-commerce site for custom laser-engraved wood art, featuring Penn State's Old Main and custom image uploads.

## Features

- **Static Site Generation**: Fast, SEO-friendly pages
- **Custom Image Upload**: Upload photos to preview laser-engraved versions
- **Gemini AI Integration**: AI-powered image-to-laser-engraving conversion
- **Stripe Integration**: Ready for payment processing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

**Get your Gemini API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy it to your `.env.local` file

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Deploy

The site can be deployed to Vercel (recommended) or any platform that supports Next.js:

```bash
npm run build
```

**For Vercel:**
1. Push your code to GitHub
2. Import the project in Vercel
3. Add your `GEMINI_API_KEY` in Vercel's environment variables
4. Deploy!

## Project Structure

```
app/
  ├── page.tsx              # Home page
  ├── upload/
  │   └── page.tsx          # Image upload & preview page
  └── api/
      └── process-image/
          └── route.ts      # API endpoint for image processing

config/
  └── prompt.ts             # Laser engraving prompt (easy to edit!)
```

## Customizing the Prompt

Edit the laser engraving prompt in `config/prompt.ts`. This file contains the instructions sent to Gemini for converting images to laser-engraving style.

## Backend Setup

This project uses **Next.js API Routes** which run as serverless functions:

- **No separate backend needed** - everything is in one codebase
- **Free on Vercel** - generous free tier for serverless functions
- **Automatic scaling** - handles traffic spikes automatically
- **Secure** - API keys stay server-side, never exposed to clients

The API route (`app/api/process-image/route.ts`) handles:
- Image upload validation
- Calling Gemini API
- Returning processed images

## Notes

- The upload page is client-side (static)
- Only the API route runs server-side (serverless function)
- Most pages remain static for optimal performance
- API key is kept secure in environment variables
