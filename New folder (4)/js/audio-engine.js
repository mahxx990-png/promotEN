class AudioEngine {
    constructor() {
        this.audioCtx = null;
        this.analyzer = null;
        this.source = null;
        this.dataArray = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.source = this.audioCtx.createMediaStreamSource(stream);
            this.analyzer = this.audioCtx.createAnalyser();
            this.analyzer.fftSize = 64;
            
            // Create a BiquadFilter (Low-Pass Filter for 'cleaning')
            const filter = this.audioCtx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(3000, this.audioCtx.currentTime); // Filter high frequency noise

            this.source.connect(filter);
            filter.connect(this.analyzer);
            
            this.dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
            this.isInitialized = true;
            console.log("Audio Engine Initialized with Filtering");
        } catch (err) {
            console.error("Audio initialization failed:", err);
            throw err;
        }
    }

    getByteFrequencyData() {
        if (!this.analyzer) return null;
        this.analyzer.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    stop() {
        if (this.audioCtx) {
            this.audioCtx.close();
            this.isInitialized = false;
        }
    }
}

window.AudioEngine = new AudioEngine();
