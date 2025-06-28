'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copy, Loader2, Sparkles, Bot, MessageSquare } from 'lucide-react'

// Available models (free tier on OpenRouter)
const models = [
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B Instruct', description: 'Fast and efficient' },
  { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', description: 'High performance' },
  { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', description: 'Meta\'s latest' },
  { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B IT', description: 'Google\'s efficient model' },
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
  }, [prompt, selectedModel]) // Add dependencies

  const selectedModelInfo = models.find(m => m.id === selectedModel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              AI Product Lab
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experiment with open-source AI models powered by OpenRouter. 
            <br className="hidden sm:block" />
            Free, fast, and powerful.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Your Prompt</CardTitle>
              </div>
              <CardDescription className="text-base">
                Enter your prompt below and select an AI model to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Choose AI Model
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="h-12 text-base border-2 hover:border-blue-300 focus:border-blue-500 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex flex-col py-1">
                          <span className="font-semibold text-base">{model.name}</span>
                          <span className="text-sm text-muted-foreground">{model.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedModelInfo && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    ✓ {selectedModelInfo.description}
                  </p>
                )}
              </div>

              {/* Prompt Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Your Message
                </label>
                <Textarea
                  placeholder="Tell me something interesting, ask a question, or describe what you'd like to create..."
                  value={prompt}
                  onChange={(e) => handlePromptChange(e.target.value)}
                  className="min-h-[140px] text-base resize-none border-2 hover:border-blue-300 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                />
                <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Estimated tokens: <span className="font-semibold">{tokenCount}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded border">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded border">Enter</kbd>
                    <span>to submit</span>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !prompt.trim()}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Generating Response...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-5 w-5" />
                    Generate Response
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          {response && (
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Bot className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl">AI Response</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
                {usage && (
                  <CardDescription className="text-base">
                    <span className="font-semibold">Usage:</span> {usage.total_tokens} tokens 
                    (Input: {usage.prompt_tokens}, Output: {usage.completion_tokens})
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <pre className="whitespace-pre-wrap text-base leading-relaxed text-slate-800 dark:text-slate-200 font-normal">
                      {response}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/50">
            <p className="text-slate-600 dark:text-slate-300 mb-3">
              Powered by{' '}
              <a 
                href="https://openrouter.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors"
              >
                OpenRouter
              </a>
              {' '}• Free tier models only
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <a 
                href="https://github.com/khasimulmd/ai-product-lab" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                View on GitHub
              </a>
              {' '}• Open source and free to use
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
