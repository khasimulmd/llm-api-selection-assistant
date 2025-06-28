# AI Product Lab 🚀

A modern, open-source web application for experimenting with open-source AI models powered by OpenRouter. Built with Next.js 14, Tailwind CSS, and shadcn/ui.

![AI Product Lab](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Open Source](https://img.shields.io/badge/Open_Source-Yes-green?style=for-the-badge)

## ✨ Features

- 🤖 **Multiple AI Models**: Support for various open-source models via OpenRouter
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- ⚡ **Fast & Free**: Uses only free-tier models from OpenRouter
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- ⌨️ **Keyboard Shortcuts**: Ctrl+Enter to submit prompts
- 📊 **Token Counter**: Real-time token estimation
- 📋 **Copy to Clipboard**: One-click response copying
- 🌙 **Dark Mode**: Automatic theme switching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenRouter API key (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khasimulmd/ai-product-lab.git
   cd ai-product-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
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

## 🔧 Setup Script

For a quick setup, you can run the provided setup script:

```bash
chmod +x setup.sh
./setup.sh
```

This script will:
- Check Node.js version
- Install dependencies
- Create environment file
- Start the development server

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Fork this repository** to your GitHub account

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Add environment variable: `OPENROUTER_API_KEY`

3. **Deploy**
   - Vercel will automatically deploy your app
   - Get your live URL instantly

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Connect your GitHub repo and add environment variables
- **Railway**: Import from GitHub and configure environment variables
- **DigitalOcean App Platform**: Connect repository and set environment variables

## 🔑 Getting OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

**Note**: OpenRouter offers free credits for new users, and many models are available on their free tier.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **AI Integration**: OpenRouter API
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
ai-product-lab/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── select.tsx
│   │       └── textarea.tsx
│   └── lib/
│       └── utils.ts
├── public/
├── .env.example
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🎯 Available Models

The app supports various open-source models available on OpenRouter's free tier:

- **Mistral 7B Instruct**: Fast and efficient
- **Mixtral 8x7B Instruct**: High performance
- **Llama 3.1 8B Instruct**: Meta's latest
- **Gemma 2 9B IT**: Google's efficient model

## 🔄 Local Model Support (Optional)

For completely local inference, you can replace the OpenRouter integration with Ollama:

1. Install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull mistral`
3. Update the API route to use Ollama's local API
4. Remove OpenRouter dependency

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) for providing free access to AI models
- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [Next.js](https://nextjs.org) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the [OpenRouter documentation](https://openrouter.ai/docs)
- Join the [Next.js community](https://nextjs.org/community)

---

**Made with ❤️ by [khasimulmd](https://github.com/khasimulmd)**

⭐ Star this repository if you found it helpful!
