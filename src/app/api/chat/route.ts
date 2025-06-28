import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { prompt, model, apiKey } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    // OpenRouter API call
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app-domain.com', // Replace with your domain
        'X-Title': 'LLM API Selection Assistant'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    const endTime = Date.now()
    const latency = endTime - startTime

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenRouter API error:', JSON.stringify(errorData))
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your OpenRouter API key.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to get response from OpenRouter API' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Extract response text and token usage
    const responseText = data.choices?.[0]?.message?.content || 'No response received'
    const tokenUsage = data.usage?.total_tokens || null

    return NextResponse.json({
      response: responseText,
      tokens: tokenUsage,
      latency: latency,
      model: model,
      usage: data.usage || null
    })

  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/*
OLLAMA INTEGRATION EXAMPLE:

To integrate with Ollama for local inference, replace the OpenRouter API call with:

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

const data = await response.json();
const responseText = data.response || 'No response received';

// Note: Ollama doesn't provide token usage by default
// You can estimate tokens using: Math.ceil(prompt.length / 4)

return NextResponse.json({
  response: responseText,
  tokens: Math.ceil(prompt.length / 4), // Estimated
  latency: latency,
  model: model,
  cost: 0 // Local models are free
});
*/ 