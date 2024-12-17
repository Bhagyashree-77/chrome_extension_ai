document.getElementById('send-button').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput) {
      document.getElementById('user-input').value = "";
      document.getElementById('chat-output').innerHTML += `<div>User: ${userInput}</div>`;
      chrome.runtime.sendMessage({ type: 'QUERY', text: userInput }, (response) => {
        document.getElementById('chat-output').innerHTML += `<div>Bot: ${response}</div>`;
      });
    }
  });
  