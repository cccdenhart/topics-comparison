import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { extract } from '@extractus/article-extractor';
import fs from 'fs/promises';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function writeDebugFile(filename: string, content: string, ts: string) {
  const debugDir = path.join(process.cwd(), 'debug', ts);
  try {
    // Create debug directory if it doesn't exist
    await fs.mkdir(debugDir, { recursive: true });
    await fs.writeFile(path.join(debugDir, filename), content);
  } catch (error) {
    console.error(`Error writing debug file ${filename}:`, error);
  }
}

export async function POST(request: Request) {
  try {
    const { topic1, topic2, prompt } = await request.json();

    const ts = Date.now().toString()

    // Extract text content from URLs for both topics
    const topic1Texts = await Promise.all(
      topic1.urls.map(async (url: string) => {
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

    // Write full extracted content to debug files
    await writeDebugFile(`topic1_full.txt`, topic1Texts.join('\n'), ts);
    await writeDebugFile(`topic2_full.txt`, topic2Texts.join('\n'), ts);

    // Combine and truncate texts to fit context window (roughly 4000 tokens)
    const maxChars = 36000; // Approximate 4000 tokens
    const topic1Content = topic1Texts.join('\n').slice(0, maxChars);
    const topic2Content = topic2Texts.join('\n').slice(0, maxChars);

    // Write truncated content to debug files
    await writeDebugFile(`topic1_truncated.txt`, topic1Content, ts);
    await writeDebugFile(`topic2_truncated.txt`, topic2Content, ts);

    // Create system prompts for each topic
    const topic1SystemPrompt = `Answer the following prompt about ${topic1.name} using only the provided content as reference:
    
    Content:
    ${topic1Content}
    
    Prompt: ${prompt}`;

    const topic2SystemPrompt = `Answer the following prompt about ${topic2.name} using only the provided content as reference:
    
    Content:
    ${topic2Content}
    
    Prompt: ${prompt}`;

    // Write system prompts to debug files
    await writeDebugFile(`topic1_system_prompt.txt`, topic1SystemPrompt, ts);
    await writeDebugFile(`topic2_system_prompt.txt`, topic2SystemPrompt, ts);

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

    // Write API response to debug file
    await writeDebugFile(`api_response_1.txt`, topic1ResponseContent, ts);
    await writeDebugFile(`api_response_2.txt`, topic2ResponseContent, ts);

    // Generate a difference summary
    /*
    const diffResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'Summarize the key differences between these two responses:'
        },
        {
          role: 'user',
          content: `Response 1: ${topic1Response}\nResponse 2: ${topic2Response}`
        }
      ],
      temperature: 0.7,
    });

    const difference = diffResponse.choices[0].message?.content || '';
    */
    const difference = '';
    
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