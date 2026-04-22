const AudioEngine = {
      audioContext: null,
      analyser: null,
      dataArray: null,
      source: null,

      async init() {
                if (this.audioContext) return;

          try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        this.analyser = this.audioContext.createAnalyser();
                        this.analyser.fftSize = 256;

                    this.source = this.audioContext.createMediaStreamSource(stream);
                        this.source.connect(this.analyser);

                    const bufferLength = this.analyser.frequencyBinCount;
                        this.dataArray = new Uint8Array(bufferLength);
          } catch (err) {
                        console.error('Audio Engine Init Error:', err);
                        throw err;
          }
      },

      getByteFrequencyData() {
                if (!this.analyser) return null;
                this.analyser.getByteFrequencyData(this.dataArray);
                return this.dataArray;
      }
};

window.AudioEngine = AudioEngine;
