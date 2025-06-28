# LLM API Selection Assistant 🚀

A clean, modern web app for testing different AI models through OpenRouter. I built this because I wanted a simple way to compare responses from various open-source LLMs without dealing with complex setups or paid APIs.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Open Source](https://img.shields.io/badge/Open_Source-Yes-green?style=for-the-badge)

## What's this about?

I got tired of switching between different AI platforms just to test a simple prompt. So I built this - a single interface where you can:
- Try different open-source models (Mistral, Llama, Gemma, etc.)
- See responses side by side
- Keep it all free using OpenRouter's generous free tier
- Have a nice, responsive UI that works on any device

## Features that actually matter

- **Multiple models**: Switch between Mistral 7B, Mixtral 8x7B, Llama 3.1, and Gemma 2
- **Clean interface**: No clutter, just prompt → response
- **Free forever**: Uses OpenRouter's free tier models
- **Keyboard shortcuts**: Ctrl+Enter to submit (because who has time for clicking?)
- **Token counter**: See roughly how many tokens your prompt will use
- **Copy responses**: One click to copy AI responses
- **Dark mode**: Because your eyes will thank you

## Getting started

### What you need
- Node.js 18+ (I used 18.17.0)
- An OpenRouter API key (free, takes 2 minutes to get)

### Quick setup

1. **Clone this repo**
   ```bash
   git clone https://github.com/khasimulmd/llm-api-selection-assistant.git
   cd llm-api-selection-assistant
   ```

2. **Install stuff**
   ```bash
   npm install
   ```

3. **Set up your API key**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_key_here
   ```

4. **Run it**
   ```bash
   npm run dev
   ```

5. **Open your browser** to [http://localhost:3000](http://localhost:3000)

### Getting your OpenRouter API key

1. Go to [OpenRouter](https://openrouter.ai)
2. Sign up (takes 30 seconds)
3. Go to API Keys section
4. Create a new key
5. Copy it to your `.env.local` file

That's it. OpenRouter gives you free credits to start, and most of the models I included are available on their free tier.

## Deployment

### Vercel (easiest)

1. Fork this repo to your GitHub
2. Go to [vercel.com](https://vercel.com) and import your fork
3. Add the environment variable: `OPENROUTER_API_KEY`
4. Deploy - Vercel handles the rest

### Other platforms

Works on any platform that supports Next.js:
- **Netlify**: Connect your repo, add env vars
- **Railway**: Import from GitHub, set environment variables
- **DigitalOcean**: Same deal

## Tech stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Next.js API routes
- **AI**: OpenRouter API
- **Hosting**: Vercel (but works anywhere)

## Project structure

```
llm-api-selection-assistant/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts    # Handles OpenRouter API calls
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Main app page
│   ├── components/ui/           # Reusable UI components
│   └── lib/utils.ts             # Utility functions
├── public/                      # Static assets
└── ... config files
```

## Available models

I picked these because they're solid performers on OpenRouter's free tier:

- **Mistral 7B Instruct**: Fast and reliable
- **Mixtral 8x7B Instruct**: More capable, still quick
- **Llama 3.1 8B Instruct**: Meta's latest, good balance
- **Gemma 2 9B IT**: Google's efficient option

## Want to run models locally?

If you prefer to run everything on your machine, you can swap out OpenRouter for Ollama:

1. Install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull mistral`
3. Update the API route to use Ollama's local API
4. Remove the OpenRouter dependency

## Contributing

Found a bug? Want to add a feature? Feel free to:

1. Fork the repo
2. Create a branch (`git checkout -b fix-that-thing`)
3. Make your changes
4. Push to the branch (`git push origin fix-that-thing`)
5. Open a pull request

## License

MIT License - do whatever you want with it.

## Thanks

- [OpenRouter](https://openrouter.ai) for the free API access
- [shadcn/ui](https://ui.shadcn.com) for the clean components
- [Next.js](https://nextjs.org) for making this so easy to build
- [Tailwind CSS](https://tailwindcss.com) for the styling

## Questions?

- Open an issue on GitHub
- Check [OpenRouter docs](https://openrouter.ai/docs)
- Hit up the [Next.js community](https://nextjs.org/community)

---

**Built by [khasimulmd](https://github.com/khasimulmd)**

If this helps you, consider giving it a star! ⭐
