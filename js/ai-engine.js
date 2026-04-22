const AIEngine = {
  async generatePrompt(text) {
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
      });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
      return data.result || 'No result returned from AI.';
    } catch (error) {
      console.error('AI Engine Error:', error);
      throw error;
    }
  }
};
window.AIEngine = AIEngine;
