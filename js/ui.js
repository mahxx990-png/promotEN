class UI {
      constructor() {
                this.statusEl = document.getElementById('status');
                this.transcriptEl = document.getElementById('transcript');
                this.historyListEl = document.getElementById('history-list');
      }

    updateStatus(message, isListening) {
              this.statusEl.textContent = message;
              this.statusEl.className = isListening ? 'listening' : '';
    }

    updateTranscript(text) {
              this.transcriptEl.textContent = text;
    }

    renderHistory(history) {
              this.historyListEl.innerHTML = history.map(item => `
                          <div class="history-item">
                                          <div class="prompt">${item.prompt}</div>
                                                          <div class="transcript">${item.transcript}</div>
                                                                          <div class="time">${new Date(item.timestamp).toLocaleTimeString()}</div>
                                                                                      </div>
                                                                                              `).join('');
    }
}
window.UI = new UI();
