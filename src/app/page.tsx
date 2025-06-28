'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BeakerIcon, 
  BoltIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  DocumentTextIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { Tab } from '@headlessui/react'

interface ChatSession {
  id: string;
  prompt: string;
  response: string;
  model: string;
  latency: number;
  tokens: number;
  cost: number;
  timestamp: Date;
}

interface ModelResponse {
  model: string;
  response: string;
  latency: number;
  tokens: number;
  cost: number;
  isLoading: boolean;
  error?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('mistralai/mistral-7b-instruct')
  const [latency, setLatency] = useState<number | null>(null)
  const [tokens, setTokens] = useState<number | null>(null)
  const [cost, setCost] = useState<number | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyForm, setShowApiKeyForm] = useState(false)
  const [error, setError] = useState('')
  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectedModels, setSelectedModels] = useState<string[]>(['mistralai/mistral-7b-instruct'])
  const [modelResponses, setModelResponses] = useState<ModelResponse[]>([])

  const models = [
    { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B Instruct', costPer1kTokens: 0.14, description: 'Fast and efficient 7B parameter model' },
    { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', costPer1kTokens: 0.24, description: 'High-performance mixture of experts model' },
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', costPer1kTokens: 0.5, description: 'OpenAI\'s reliable and fast model' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', costPer1kTokens: 0.25, description: 'Anthropic\'s fastest Claude model' },
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', costPer1kTokens: 0.075, description: 'Google\'s cost-effective model' }
  ]

  // Check if API key is stored in localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openrouter_api_key')
    if (storedApiKey) {
      setApiKey(storedApiKey)
    } else {
      setShowApiKeyForm(true)
    }
  }, [])

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      localStorage.setItem('openrouter_api_key', apiKey)
      setShowApiKeyForm(false)
      setError('')
    } else {
      setError('Please enter a valid API key')
    }
  }

  const handleModelToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId))
    } else {
      setSelectedModels([...selectedModels, modelId])
    }
  }

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    if (!apiKey.trim()) {
      setShowApiKeyForm(true)
      setError('API key is required')
      return
    }

    setIsLoading(true)
    setResponse('')
    setLatency(null)
    setTokens(null)
    setCost(null)
    setError('')

    const startTime = Date.now()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          apiKey: apiKey,
        }),
      })

      const endTime = Date.now()
      const responseLatency = endTime - startTime

      if (!res.ok) {
        const errorData = await res.json()
        if (res.status === 401) {
          setError('Invalid API key. Please check your OpenRouter API key.')
          setShowApiKeyForm(true)
        } else {
          setError(errorData.error || 'Failed to get response')
        }
        return
      }

      const data = await res.json()
      setResponse(data.response)
      setLatency(responseLatency)
      setTokens(data.tokens || Math.ceil(prompt.length / 4))
      
      const selectedModelInfo = models.find(m => m.id === selectedModel)
      const estimatedCost = selectedModelInfo ? (data.tokens || Math.ceil(prompt.length / 4)) * selectedModelInfo.costPer1kTokens / 1000 : 0
      setCost(estimatedCost)

      const newSession: ChatSession = {
        id: Date.now().toString(),
        prompt,
        response: data.response,
        model: selectedModel,
        latency: responseLatency,
        tokens: data.tokens || Math.ceil(prompt.length / 4),
        cost: estimatedCost,
        timestamp: new Date()
      }
      setSessions(prev => [newSession, ...prev.slice(0, 9)])

    } catch (error) {
      console.error('Error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleComparisonSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || selectedModels.length === 0) return
    if (!apiKey.trim()) {
      setShowApiKeyForm(true)
      setError('API key is required')
      return
    }

    setError('')
    
    const initialResponses: ModelResponse[] = selectedModels.map(modelId => ({
      model: modelId,
      response: '',
      latency: 0,
      tokens: 0,
      cost: 0,
      isLoading: true
    }))
    setModelResponses(initialResponses)

    const promises = selectedModels.map(async (modelId, index) => {
      const startTime = Date.now()
      
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            model: modelId,
            apiKey: apiKey,
          }),
        })

        const endTime = Date.now()
        const responseLatency = endTime - startTime

        if (!res.ok) {
          const errorData = await res.json()
          return {
            model: modelId,
            response: '',
            latency: responseLatency,
            tokens: 0,
            cost: 0,
            isLoading: false,
            error: errorData.error || 'Failed to get response'
          }
        }

        const data = await res.json()
        const modelInfo = models.find(m => m.id === modelId)
        const estimatedCost = modelInfo ? (data.tokens || Math.ceil(prompt.length / 4)) * modelInfo.costPer1kTokens / 1000 : 0

        return {
          model: modelId,
          response: data.response,
          latency: responseLatency,
          tokens: data.tokens || Math.ceil(prompt.length / 4),
          cost: estimatedCost,
          isLoading: false
        }

      } catch (error) {
        return {
          model: modelId,
          response: '',
          latency: 0,
          tokens: 0,
          cost: 0,
          isLoading: false,
          error: 'Network error'
        }
      }
    })

    const results = await Promise.all(promises)
    setModelResponses(results)

    results.forEach(result => {
      if (result.response) {
        const newSession: ChatSession = {
          id: Date.now().toString() + Math.random(),
          prompt,
          response: result.response,
          model: result.model,
          latency: result.latency,
          tokens: result.tokens,
          cost: result.cost,
          timestamp: new Date()
        }
        setSessions(prev => [newSession, ...prev.slice(0, 9)])
      }
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const clearApiKey = () => {
    localStorage.removeItem('openrouter_api_key')
    setApiKey('')
    setShowApiKeyForm(true)
  }

  const getModelName = (modelId: string) => {
    return models.find(m => m.id === modelId)?.name || modelId
  }

  const getModelDescription = (modelId: string) => {
    return models.find(m => m.id === modelId)?.description || ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <SparklesIcon className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              LLM API Selection Assistant
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test, compare, and evaluate open-source LLM APIs with real-time metrics: latency, token usage, and cost estimation
          </p>
        </motion.div>

        {/* API Key Setup */}
        <AnimatePresence>
          {showApiKeyForm && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card p-8 mb-8 max-w-md mx-auto"
            >
              <div className="flex items-center mb-4">
                <CogIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Setup Required</h2>
              </div>
              <p className="text-gray-600 mb-6">
                To get started, you need an OpenRouter API key. It's free and takes 2 minutes to get.
              </p>
              
              <form onSubmit={handleApiKeySubmit} className="space-y-4">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    OpenRouter API Key
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="input w-full"
                    required
                  />
                </div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="error-badge p-3 rounded-lg text-sm flex items-center"
                  >
                    <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                    {error}
                  </motion.div>
                )}
                
                <button type="submit" className="btn-primary w-full">
                  Save API Key
                </button>
              </form>
              
              <div className="mt-6 p-4 info-badge rounded-lg">
                <h3 className="text-sm font-medium mb-2">How to get your API key:</h3>
                <ol className="text-sm space-y-1">
                  <li>1. Go to <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai/keys</a></li>
                  <li>2. Sign up or log in</li>
                  <li>3. Create a new API key</li>
                  <li>4. Copy and paste it above</li>
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Interface */}
        <AnimatePresence>
          {!showApiKeyForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* API Key Status */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center mb-6 p-4 success-badge rounded-lg"
              >
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm">API Key configured</span>
                </div>
                <button
                  onClick={clearApiKey}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <CogIcon className="h-4 w-4 mr-1" />
                  Change API Key
                </button>
              </motion.div>

              {/* Mode Toggle */}
              <div className="flex justify-center mb-8">
                <Tab.Group onChange={(index) => setComparisonMode(index === 1)}>
                  <Tab.List className="bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <Tab
                      className={({ selected }) =>
                        `px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                          selected 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`
                      }
                    >
                      <BeakerIcon className="h-4 w-4 mr-2" />
                      Single Model
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        `px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                          selected 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`
                      }
                    >
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      Compare Models
                    </Tab>
                  </Tab.List>
                </Tab.Group>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-3">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-8 mb-8"
                  >
                    <form onSubmit={comparisonMode ? handleComparisonSubmit : handleSingleSubmit} className="space-y-6">
                      {/* Model Selection */}
                      {!comparisonMode ? (
                        <div>
                          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Model
                          </label>
                          <select
                            id="model"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="input w-full"
                          >
                            {models.map((model) => (
                              <option key={model.id} value={model.id}>
                                {model.name} (${model.costPer1kTokens}/1k tokens)
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Models to Compare
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {models.map((model) => (
                              <motion.label 
                                key={model.id} 
                                className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                  selectedModels.includes(model.id)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedModels.includes(model.id)}
                                  onChange={() => handleModelToggle(model.id)}
                                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">
                                    {model.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {model.description}
                                  </div>
                                  <div className="text-xs text-blue-600 mt-1">
                                    ${model.costPer1kTokens}/1k tokens
                                  </div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                          {selectedModels.length === 0 && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-red-600 mt-2 flex items-center"
                            >
                              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                              Please select at least one model
                            </motion.p>
                          )}
                        </div>
                      )}

                      {/* Prompt Input */}
                      <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Prompt
                        </label>
                        <textarea
                          id="prompt"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Enter your prompt here... (e.g., 'Explain quantum computing in simple terms')"
                          rows={4}
                          className="input w-full resize-none"
                          required
                        />
                      </div>

                      {/* Error Display */}
                      <AnimatePresence>
                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="error-badge p-4 rounded-lg flex items-center"
                          >
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                            <div className="text-sm">{error}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isLoading || !prompt.trim() || (comparisonMode && selectedModels.length === 0)}
                        className="btn-primary w-full flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoading ? (
                          <>
                            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                            Getting Response{comparisonMode ? 's' : ''}...
                          </>
                        ) : (
                          <>
                            <BoltIcon className="h-5 w-5 mr-2" />
                            {comparisonMode ? `Compare ${selectedModels.length} Model${selectedModels.length !== 1 ? 's' : ''}` : 'Get Response'}
                          </>
                        )}
                      </motion.button>
                    </form>
                  </motion.div>

                  {/* Response Display */}
                  <AnimatePresence>
                    {!comparisonMode && response && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card p-8 mb-8"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <DocumentTextIcon className="h-6 w-6 mr-2" />
                            Response
                          </h2>
                          <button
                            onClick={() => copyToClipboard(response)}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                            Copy Response
                          </button>
                        </div>
                        
                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <ClockIcon className="h-5 w-5 text-blue-600 mr-1" />
                              <div className="text-2xl font-bold text-blue-600">{latency}ms</div>
                            </div>
                            <div className="text-sm text-gray-600">Latency</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <DocumentTextIcon className="h-5 w-5 text-green-600 mr-1" />
                              <div className="text-2xl font-bold text-green-600">{tokens}</div>
                            </div>
                            <div className="text-sm text-gray-600">Tokens</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <CurrencyDollarIcon className="h-5 w-5 text-purple-600 mr-1" />
                              <div className="text-2xl font-bold text-purple-600">${cost?.toFixed(4)}</div>
                            </div>
                            <div className="text-sm text-gray-600">Estimated Cost</div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm">
                            {response}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Comparison Results */}
                  <AnimatePresence>
                    {comparisonMode && modelResponses.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        {modelResponses.map((result, index) => (
                          <motion.div 
                            key={result.model} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card p-6"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                  <BeakerIcon className="h-5 w-5 mr-2" />
                                  {getModelName(result.model)}
                                </h3>
                                <p className="text-sm text-gray-500">{result.model}</p>
                                <p className="text-xs text-gray-400 mt-1">{getModelDescription(result.model)}</p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(result.response)}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                disabled={!result.response}
                              >
                                <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                                Copy
                              </button>
                            </div>

                            {result.isLoading ? (
                              <div className="flex items-center justify-center py-8">
                                <ArrowPathIcon className="h-6 w-6 mr-2 animate-spin text-blue-600" />
                                <span className="text-gray-600">Getting response...</span>
                              </div>
                            ) : result.error ? (
                              <div className="error-badge p-4 rounded-lg flex items-center">
                                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                                <div className="text-sm">{result.error}</div>
                              </div>
                            ) : (
                              <>
                                {/* Metrics */}
                                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                  <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                      <ClockIcon className="h-4 w-4 text-blue-600 mr-1" />
                                      <div className="text-lg font-bold text-blue-600">{result.latency}ms</div>
                                    </div>
                                    <div className="text-xs text-gray-600">Latency</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                      <DocumentTextIcon className="h-4 w-4 text-green-600 mr-1" />
                                      <div className="text-lg font-bold text-green-600">{result.tokens}</div>
                                    </div>
                                    <div className="text-xs text-gray-600">Tokens</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                      <CurrencyDollarIcon className="h-4 w-4 text-purple-600 mr-1" />
                                      <div className="text-lg font-bold text-purple-600">${result.cost.toFixed(4)}</div>
                                    </div>
                                    <div className="text-xs text-gray-600">Cost</div>
                                  </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                  <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm">
                                    {result.response}
                                  </pre>
                                </div>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Session History */}
                <div className="lg:col-span-1">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card p-6"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <ChartBarIcon className="h-5 w-5 mr-2" />
                      Session History
                    </h2>
                    {sessions.length === 0 ? (
                      <p className="text-gray-500 text-sm">No sessions yet. Start by sending a prompt!</p>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
                        {sessions.map((session, index) => (
                          <motion.div 
                            key={session.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium text-gray-600">
                                {session.model.split('/').pop()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {session.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 mb-2 line-clamp-2">
                              {session.prompt}
                            </p>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{session.latency}ms</span>
                              <span>{session.tokens} tokens</span>
                              <span>${session.cost.toFixed(4)}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-gray-500"
        >
          <p className="text-sm">
            Powered by OpenRouter API • Free tier models available • 
            <a href="https://github.com/yourusername/llm-api-selection-assistant" className="text-blue-600 hover:text-blue-800 ml-1">
              View on GitHub
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
