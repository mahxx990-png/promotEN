class HistoryEngine {
      constructor() {
                this.storageKey = 'voiceforge_history';
                this.history = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      }

    save(prompt, transcript) {
              const item = {
                            id: Date.now(),
                            prompt: prompt,
                            transcript: transcript,
                            timestamp: new Date().toISOString()
              };
              this.history.unshift(item);
              if (this.history.length > 50) this.history.pop(); // Keep last 50
          this.persist();
              return item;
    }

    persist() {
              localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    }

    clear() {
              this.history = [];
              this.persist();
    }

    getHistory() {
              return this.history;
    }
}
window.HistoryEngine = new HistoryEngine();
