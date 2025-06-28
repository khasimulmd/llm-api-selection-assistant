# LLM API Selection Assistant

A modern web application for testing, comparing, and evaluating open-source LLM APIs with real-time metrics including latency, token usage, and cost estimation. Built with Next.js 14, Tailwind CSS, and designed for developers and AI product managers.

## ✨ Features

- **Multi-Model Support**: Test various open-source models via OpenRouter API
- **Real-Time Metrics**: Track latency, token usage, and estimated costs
- **Session History**: Keep track of your recent conversations and performance
- **API Integration**: Get ready-to-use code snippets (cURL and JavaScript)
- **Copy-to-Clipboard**: Easy copying of responses and code examples
- **Clean UI**: Modern, responsive design with excellent developer experience

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenRouter API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/llm-api-selection-assistant.git
   cd llm-api-selection-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |

### Adding New Models

To add new models, edit the `models` array in `src/app/page.tsx`:

```typescript
const models = [
  { 
    id: 'your-model-id', 
    name: 'Your Model Name', 
    costPer1kTokens: 0.10 
  },
  // ... existing models
];
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in the Vercel dashboard
   - Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build command
- **Railway**: Connect your GitHub repo
- **DigitalOcean App Platform**: Deploy with one click

## 🔌 API Integration

### OpenRouter API

The app uses OpenRouter's API to access various open-source models. Get your free API key at [openrouter.ai](https://openrouter.ai).

### Ollama Integration (Local)

To use local models with Ollama, modify the API route in `src/app/api/chat/route.ts`:

```typescript
// Replace the OpenRouter API call with:
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: model, // e.g., 'mistral:7b-instruct'
    prompt: prompt,
    stream: false
  })
});
```

## 📊 Metrics Explained

- **Latency**: Time from request to response (in milliseconds)
- **Tokens**: Number of tokens processed (input + output)
- **Cost**: Estimated cost based on token usage and model pricing
- **Session History**: Recent conversations with performance metrics

## 🛠️ Development

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/                   # Reusable components
└── types/                        # TypeScript types
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding Features

1. **New Models**: Add to the `models` array in `page.tsx`
2. **API Providers**: Modify the API route in `route.ts`
3. **UI Components**: Create new components in `components/`
4. **Styling**: Use Tailwind CSS classes or add to `globals.css`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) for providing access to open-source models
- [Next.js](https://nextjs.org) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Vercel](https://vercel.com) for hosting and deployment

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/llm-api-selection-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/llm-api-selection-assistant/discussions)
- **Email**: your-email@example.com

---

Made with ❤️ for the AI developer community
