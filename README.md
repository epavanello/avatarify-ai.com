# Avatarify AI

Avatarify AI is a SaaS platform that leverages artificial intelligence to generate personalized avatars using Stable Diffusion. The service allows users to create unique, high-quality profile pictures with various artistic styles and themes.

## Features

- 🤖 AI-powered avatar generation using Stable Diffusion
- 🎨 Multiple artistic styles and themes to choose from
- 📸 Custom prompt support for personalized results
- 🔒 Secure Google authentication
- 💳 Integrated payment system with Stripe
- 💾 Local storage for last generated image
- 🎯 Daily free credits for registered users
- 💧 Watermark protection on generated images

## Tech Stack

- **Frontend**: SvelteKit, TailwindCSS, DaisyUI
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Payment Processing**: Stripe
- **AI Model**: Stable Diffusion
- **Analytics**: Plausible Analytics

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:

   ### Public Variables

   - `PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
   - `PUBLIC_STRIPE_PRICE_ID` - Your Stripe price ID for credits
   - `PUBLIC_WEBSITE_HOST` - Your website's host URL (e.g., http://localhost:5173 for development)

   ### Private Variables

   - `PRIVATE_SUPABASE_SERVICE_ROLE` - Your Supabase service role key
   - `PRIVATE_STRIPE_SECRET_KEY` - Your Stripe secret key
   - `PRIVATE_REPLICATE_API_TOKEN` - Your Replicate API token for Stable Diffusion

4. Start the development server:
   ```bash
   npm run dev
   ```

## License

Private - All rights reserved
