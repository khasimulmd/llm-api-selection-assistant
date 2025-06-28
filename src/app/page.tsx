'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copy, Loader2, Sparkles, Bot, MessageSquare, Zap, Star, Globe } from 'lucide-react'

// Available models (free tier on OpenRouter)
const models = [
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B Instruct', description: 'Fast and efficient', color: 'from-blue-500 to-cyan-500' },
  { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', description: 'High performance', color: 'from-purple-500 to-pink-500' },
  { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', description: 'Meta\'s latest', color: 'from-green-500 to-emerald-500' },
  { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B IT', description: 'Google\'s efficient model', color: 'from-orange-500 to-red-500' },
]

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('mistralai/mistral-7b-instruct')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tokenCount, setTokenCount] = useState(0)
  const [usage, setUsage] = useState<any>(null)

  // Simple token counter (rough estimation)
  const countTokens = (text: string) => {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4)
  }

  const handlePromptChange = (value: string) => {
    setPrompt(value)
    setTokenCount(countTokens(value))
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setResponse('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: selectedModel,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setResponse(data.response)
      setUsage(data.usage)
    } catch (error) {
      console.error('Error:', error)
      setResponse(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (response) {
      try {
        await navigator.clipboard.writeText(response)
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        handleSubmit()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [prompt, selectedModel])

  const selectedModelInfo = models.find(m => m.id === selectedModel)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20 float"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-400 rounded-full blur-xl opacity-20 float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-xl opacity-20 float" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl glow">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-6xl font-bold text-gradient mb-2">
                LLM API Selection Assistant
              </h1>
              <p className="text-xl text-white/80 font-medium">
                Test & Compare AI Models
              </p>
            </div>
          </div>
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            A beautiful interface for testing different AI models through OpenRouter. 
            <br className="hidden sm:block" />
            Free, fast, and designed for the modern web.
          </p>
        </div>

        <div className="grid gap-8 animate-slide-up">
          {/* Input Section */}
          <Card className="card-modern hover-lift">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-gradient font-bold">Your Prompt</CardTitle>
                  <CardDescription className="text-lg text-gray-600 mt-1">
                    Enter your message and choose an AI model
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Model Selector */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  Choose AI Model
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="input-modern h-14 text-lg hover-lift">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="card-modern">
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex flex-col py-2">
                          <span className="font-semibold text-lg">{model.name}</span>
                          <span className="text-sm text-gray-500">{model.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedModelInfo && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className={`w-3 h-3 bg-gradient-to-r ${selectedModelInfo.color} rounded-full`}></div>
                    <p className="text-blue-700 font-medium">
                      ✓ {selectedModelInfo.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Prompt Input */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-800">
                  Your Message
                </label>
                <Textarea
                  placeholder="Tell me something interesting, ask a question, or describe what you'd like to create..."
                  value={prompt}
                  onChange={(e) => handlePromptChange(e.target.value)}
                  className="input-modern min-h-[160px] text-lg resize-none hover-lift"
                />
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pulse"></div>
                      <span>Estimated tokens: <span className="font-semibold text-blue-600">{tokenCount}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-3 py-1 text-xs bg-gray-100 rounded-lg border border-gray-200 font-mono">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-3 py-1 text-xs bg-gray-100 rounded-lg border border-gray-200 font-mono">Enter</kbd>
                    <span>to submit</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !prompt.trim()}
                className="btn-primary w-full h-16 text-xl font-bold glow hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-4 h-6 w-6 animate-spin" />
                    Generating Response...
                  </>
                ) : (
                  <>
                    <Zap className="mr-4 h-6 w-6" />
                    Generate Response
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          {response && (
            <Card className="card-modern hover-lift animate-scale-in">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl text-gradient font-bold">AI Response</CardTitle>
                      {usage && (
                        <CardDescription className="text-base text-gray-600 mt-1">
                          <span className="font-semibold">Usage:</span> {usage.total_tokens} tokens 
                          (Input: {usage.prompt_tokens}, Output: {usage.completion_tokens})
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={copyToClipboard}
                    className="hover-lift glow"
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200 hover-lift">
                    <pre className="whitespace-pre-wrap text-lg leading-relaxed text-gray-800 font-normal">
                      {response}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="mt-20 text-center animate-fade-in">
          <div className="card-modern p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-gradient" />
              <p className="text-lg text-gray-700 font-medium">
                Powered by{' '}
                <a 
                  href="https://openrouter.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gradient font-bold hover:underline transition-all"
                >
                  OpenRouter
                </a>
              </p>
            </div>
            <p className="text-gray-600 mb-4">
              Free tier models only • No credit card required
            </p>
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://github.com/khasimulmd/llm-api-selection-assistant" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gradient font-semibold hover:underline transition-all flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                View on GitHub
              </a>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Open source and free to use</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
