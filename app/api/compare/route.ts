import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { extract } from '@extractus/article-extractor';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { topic1, topic2, prompt } = await request.json();

    // Extract text content from URLs for both topics
    const topic1Texts = await Promise.all(
      topic1.urls.filter((url: string) => url.length > 0).map(async (url: string) => {
        const article = await extract(url);
        const content = article?.content || '';
        return content.replace(/<[^>]*>/g, ''); // Remove HTML tags
      })
    );

    const topic2Texts = await Promise.all(
      topic2.urls.map(async (url: string) => {
        const article = await extract(url);
        const content = article?.content || '';
        return content.replace(/<[^>]*>/g, ''); // Remove HTML tags
      })
    );

    // Combine and truncate texts to fit context window (roughly 4000 tokens)
    const maxChars = 36000; // Approximate 4000 tokens
    const topic1Content = topic1Texts.join('\n').slice(0, maxChars);
    const topic2Content = topic2Texts.join('\n').slice(0, maxChars);

    // Create system prompts for each topic
    const topic1SystemPrompt = `Answer the following prompt about ${topic1.name} using only the provided content as reference:
    
    Content:
    ${topic1Content}
    
    Prompt: ${prompt}`;

    const topic2SystemPrompt = `Answer the following prompt about ${topic2.name} using only the provided content as reference:
    
    Content:
    ${topic2Content}
    
    Prompt: ${prompt}`;

    // Send separate requests for each topic
    const [topic1Response, topic2Response] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: topic1SystemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: topic2SystemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      })
    ]);

    const topic1ResponseContent = topic1Response.choices[0].message?.content || '';
    const topic2ResponseContent = topic2Response.choices[0].message?.content || '';

    const diffResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'Summarize the key differences between these two responses:'
        },
        {
          role: 'user',
          content: `Response 1: ${topic1ResponseContent}\nResponse 2: ${topic2ResponseContent}`
        }
      ],
      temperature: 0.7,
    });

    const difference = diffResponse.choices[0].message?.content || '';
    
    return NextResponse.json({
      topic1ResponseContent,
      topic2ResponseContent,
      difference,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process comparison' },
      { status: 500 }
    );
  }
}