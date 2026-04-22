document.addEventListener('DOMContentLoaded', () => {
    UI.initVisualizer();

    // History Sidebar Logic
    UI.elements.historyToggle.addEventListener('click', () => {
        UI.renderHistory(window.HistoryEngine.getHistory());
        UI.elements.historySidebar.classList.add('active');
    });

    UI.elements.closeHistoryBtn.addEventListener('click', () => {
        UI.elements.historySidebar.classList.remove('active');
    });

    UI.elements.clearHistoryBtn.addEventListener('click', () => {
        if (confirm("Clear all transcript history?")) {
            window.HistoryEngine.clear();
            UI.renderHistory([]);
        }
    });

    // No tutorial overlay in this layout

    // Export Logic
    UI.elements.exportBtn.addEventListener('click', () => {
        const text = UI.elements.promptOutput.textContent || UI.elements.transcript.value;
        if (text) {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `voiceforge-prompt-${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    });

    let recognition;
    let isRecording = false;
    let animationFrame;
    let initialText = '';

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = async () => {
            isRecording = true;
            UI.setRecordingState(true);
            
            // Capture existing text to append to it
            initialText = UI.elements.transcript.value;
            if (initialText && !initialText.endsWith(' ')) {
                initialText += ' ';
            }
            
            try {
                await window.AudioEngine.init();
                tick();
            } catch (e) {
                console.warn("Visualizer engine failed to start");
            }
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const currentSessionTranscript = finalTranscript + interimTranscript;
            const fullTranscript = initialText + currentSessionTranscript;
            
            UI.setTranscript(fullTranscript);
            UI.elements.transcript.value = fullTranscript;
            
            if (finalTranscript) {
                handleRefinement(fullTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            stopRecording();
        };

        recognition.onend = () => {
            stopRecording();
        };
    }

    function tick() {
        if (!isRecording) return;
        const data = window.AudioEngine.getByteFrequencyData();
        UI.updateVisualizer(data);
        animationFrame = requestAnimationFrame(tick);
    }

    function stopRecording() {
        isRecording = false;
        UI.setRecordingState(false);
        recognition.stop();
        if (animationFrame) cancelAnimationFrame(animationFrame);
    }

    UI.elements.micBtn.addEventListener('click', () => {
        if (isRecording) {
            stopRecording();
        } else {
            recognition.start();
        }
    });

    UI.elements.refineBtn.addEventListener('click', () => {
        handleRefinement(UI.elements.transcript.value);
    });

    async function handleRefinement(text) {
        if (!text.trim()) return;
        
        UI.setPrompt('<em>Gemini is weaving your prompt...</em>');
        
        try {
            const aiPrompt = await window.AIEngine.generatePrompt(text);
            UI.setPrompt(aiPrompt);
            window.HistoryEngine.save(aiPrompt, text);
        } catch (err) {
            console.error(err);
            UI.setPrompt("<span style='color: #ef4444;'>AI Connection Error. Ensure backend is running.</span>");
        }
    }

    UI.elements.copyBtn.addEventListener('click', () => {
        const text = UI.elements.promptOutput.textContent || UI.elements.transcript.value;
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                UI.showCopyFeedback();
            });
        }
    });
});
