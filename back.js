chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'QUERY') {
      handleQuery(message.text).then(response => sendResponse(response));
      return true; // Keeps the messaging channel open for async response
    }
  });
  
  async function handleQuery(query) {
    const githubData = await fetchGitHubData(query); // Fetch data from GitHub based on query
    let promptResponse;
  
    // Determine API usage based on keywords in the query
    if (query.includes("summarize") || query.includes("summary")) {
      promptResponse = await sendToGeminiSummarization(query, githubData);
    } else if (query.includes("explain") || query.includes("rephrase") || query.includes("simplify")) {
      promptResponse = await sendToGeminiRewrite(query, githubData);
    } else {
      promptResponse = await sendToGeminiPrompt(query, githubData);
    }
  
    return promptResponse;
  }
  
  async function fetchGitHubData(query) {
    try {
      const response = await fetch('https://api.github.com/repos/owner/repo', {
        headers: { 'Authorization': `Bearer YOUR_GITHUB_TOKEN` }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch GitHub data:', error);
      return { error: 'GitHub fetch failed' };
    }
  }
  
  // Summarization API call
  async function sendToGeminiSummarization(query, githubData) {
    try {
      const response = await fetch('https://api.chromium.org/v1/gemini/summarize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_GEMINI_NANO_API_KEY`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Summarize the code and structure of this GitHub repository and provide insights. Query: "${query}", Data: ${JSON.stringify(githubData)}`
        })
      });
      const result = await response.json();
      return result.response;
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      return 'Could not fetch summary.';
    }
  }
  
  // Rewrite API call
  async function sendToGeminiRewrite(query, githubData) {
    try {
      const response = await fetch('https://api.chromium.org/v1/gemini/rewrite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_GEMINI_NANO_API_KEY`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Rewrite this explanation in simpler terms: ${query}. Data: ${JSON.stringify(githubData)}`
        })
      });
      const result = await response.json();
      return result.response;
    } catch (error) {
      console.error('Failed to fetch rewritten response:', error);
      return 'Could not fetch rewritten response.';
    }
  }
  
  // General Prompt API call
  async function sendToGeminiPrompt(query, githubData) {
    try {
      const response = await fetch('https://api.chromium.org/v1/gemini/prompt', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_GEMINI_NANO_API_KEY`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Analyze this query: "${query}" based on this GitHub data: ${JSON.stringify(githubData)}`
        })
      });
      const result = await response.json();
      return result.response;
    } catch (error) {
      console.error('Failed to fetch prompt response:', error);
      return 'Could not fetch response.';
    }
  }
  