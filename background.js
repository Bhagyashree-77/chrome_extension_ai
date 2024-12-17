require('dotenv').config();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'QUERY') {
      handleQuery(message.text).then(response => sendResponse(response));
      return true; // Keeps the messaging channel open for async response
    }
  });
  
  async function handleQuery(query) {
    const githubData = await fetchGitHubData(query); // Placeholder for GitHub API call
    const promptResponse = await sendToGeminiNano(query, githubData); // Placeholder for Gemini Nano API call
    return promptResponse;
  }
  
  async function fetchGitHubData(query) {
    // Sample GitHub API call (replace `YOUR_GITHUB_TOKEN`)
    const response = await fetch('https://api.github.com/repos/owner/repo', {
      headers: { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` }
    });
    const data = await response.json();
    return data;
    
  }
  
  async function sendToGeminiNano(query, githubData) {
    // Replace `YOUR_GEMINI_NANO_API_KEY` with the actual API key and format as needed
    const response = await fetch('https://api.chromium.org/v1/gemini/prompt', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` },
      body: JSON.stringify({
        prompt: `Analyze this query: "${query}" based on this GitHub data: ${githubData}`
      })
    });
    const result = await response.json();
    return result.response; // Assuming the response structure
  }
  