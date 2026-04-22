const UI = {
    elements: {
        micBtn: document.getElementById('mic-btn'),
        orbContainer: document.getElementById('mic-btn'),
        statusText: document.getElementById('status'),
        transcript: document.getElementById('transcript'),
        promptOutput: document.getElementById('prompt-output'),
        copyBtn: document.getElementById('copy-btn'),
        visualizer: document.querySelector('.visualizer-container'),
        refineBtn: document.getElementById('refine-btn'),
        historyToggle: document.getElementById('history-toggle'),
        historySidebar: document.getElementById('history-sidebar'),
        closeHistoryBtn: document.getElementById('close-history'),
        historyList: document.getElementById('history-list'),
        clearHistoryBtn: document.getElementById('clear-history'),
        exportBtn: document.getElementById('export-btn')
    },

    bars: [],

    initVisualizer() {
        if (!this.elements.visualizer) return;
        this.elements.visualizer.innerHTML = '';
        this.bars = [];
        for (let i = 0; i < 28; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            this.elements.visualizer.appendChild(bar);
            this.bars.push(bar);
        }
    },

    updateVisualizer(data) {
        if (!data) return;
        this.bars.forEach((bar, i) => {
            const val = data[i] || 0;
            const height = Math.max(4, val / 4);
            bar.style.height = `${height}px`;
            bar.style.opacity = val > 0 ? '1' : '0.3';
        });
    },

    setRecordingState(isRecording) {
        const orb = document.getElementById('mic-btn');
        if (isRecording) {
            orb.classList.add('recording');
            this.elements.statusText.textContent = 'Neural Sync Active';
        } else {
            orb.classList.remove('recording');
            this.elements.statusText.textContent = 'Ready for Neural Sync';
            this.bars.forEach(bar => { bar.style.height = '4px'; bar.style.opacity = '0.3'; });
        }
    },

    setTranscript(text) {
        this.elements.transcript.value = text;
    },

    setPrompt(html) {
        this.elements.promptOutput.innerHTML = html;
    },

    renderHistory(items) {
        this.elements.historyList.innerHTML = '';
        if (!items.length) {
            this.elements.historyList.innerHTML = '<p style="color:var(--text-dim);font-size:0.8rem;text-align:center;padding:2rem;">No logs yet.</p>';
            return;
        }
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div style="font-size:0.65rem;font-family:var(--font-head);letter-spacing:0.15em;color:var(--accent);margin-bottom:6px;">
                    ${new Date(item.timestamp).toLocaleTimeString()}
                </div>
                <div style="font-size:0.8rem;color:var(--text-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${item.transcript || ''}
                </div>
            `;
            div.onclick = () => {
                if (item.prompt) this.elements.promptOutput.innerHTML = item.prompt;
                if (item.transcript) this.elements.transcript.value = item.transcript;
                this.elements.historySidebar.classList.remove('active');
            };
            this.elements.historyList.appendChild(div);
        });
    },

    showCopyFeedback() {
        if (!this.elements.copyBtn) return;
        const original = this.elements.copyBtn.textContent;
        this.elements.copyBtn.textContent = 'Copied!';
        setTimeout(() => { this.elements.copyBtn.textContent = original; }, 2000);
    }
};

window.UI = UI;
