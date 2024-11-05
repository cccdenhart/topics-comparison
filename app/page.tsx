'use client';

import { useState } from 'react';

interface Topic {
  name: string;
  urls: string[];
}

interface ComparisonResult {
  topic1ResponseContent: string;
  topic2ResponseContent: string;
  difference?: string;
}

export default function Home() {
  const [topic1, setTopic1] = useState<Topic>({ name: '', urls: [''] });
  const [topic2, setTopic2] = useState<Topic>({ name: '', urls: [''] });
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddUrl = (topicIndex: number) => {
    if (topicIndex === 1) {
      setTopic1({ ...topic1, urls: [...topic1.urls, ''] });
    } else {
      setTopic2({ ...topic2, urls: [...topic2.urls, ''] });
    }
  };

  const handleUrlChange = (topicIndex: number, urlIndex: number, value: string) => {
    if (topicIndex === 1) {
      const newUrls = [...topic1.urls];
      newUrls[urlIndex] = value;
      setTopic1({ ...topic1, urls: newUrls });
    } else {
      const newUrls = [...topic2.urls];
      newUrls[urlIndex] = value;
      setTopic2({ ...topic2, urls: newUrls });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic1,
          topic2,
          prompt,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setTopic1({ name: '', urls: [''] });
    setTopic2({ name: '', urls: [''] });
    setPrompt('');
    setResult(null);
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Topic Comparison Tool</h1>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Topic 1 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Topic 1</h2>
          <input
            type="text"
            placeholder="Topic name"
            className="w-full p-2 mb-4 border rounded"
            value={topic1.name}
            onChange={(e) => setTopic1({ ...topic1, name: e.target.value })}
          />
          {topic1.urls.map((url, index) => (
            <input
              key={index}
              type="url"
              placeholder="Enter URL"
              className="w-full p-2 mb-2 border rounded"
              value={url}
              onChange={(e) => handleUrlChange(1, index, e.target.value)}
            />
          ))}
          <button
            onClick={() => handleAddUrl(1)}
            className="text-blue-500 hover:text-blue-700"
          >
            + Add another URL
          </button>
        </div>

        {/* Topic 2 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Topic 2</h2>
          <input
            type="text"
            placeholder="Topic name"
            className="w-full p-2 mb-4 border rounded"
            value={topic2.name}
            onChange={(e) => setTopic2({ ...topic2, name: e.target.value })}
          />
          {topic2.urls.map((url, index) => (
            <input
              key={index}
              type="url"
              placeholder="Enter URL"
              className="w-full p-2 mb-2 border rounded"
              value={url}
              onChange={(e) => handleUrlChange(2, index, e.target.value)}
            />
          ))}
          <button
            onClick={() => handleAddUrl(2)}
            className="text-blue-500 hover:text-blue-700"
          >
            + Add another URL
          </button>
        </div>
      </div>

      <div className="mb-8">
        <textarea
          placeholder="Enter your question/prompt"
          className="w-full p-2 border rounded h-32"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Comparing...' : 'Compare'}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">{topic1.name} Response:</h3>
            <div className="p-4 bg-background border border-foreground/10 rounded">{result.topic1ResponseContent}</div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{topic2.name} Response:</h3>
            <div className="p-4 bg-background border border-foreground/10 rounded">{result.topic2ResponseContent}</div>
          </div>
          {result.difference && (
            <div className="col-span-2">
              <h3 className="font-semibold mb-2">Key Differences:</h3>
              <div className="p-4 bg-background border border-foreground/10 rounded">{result.difference}</div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}