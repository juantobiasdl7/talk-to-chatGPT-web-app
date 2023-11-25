import React, { useRef, useEffect } from 'react';

class Bar {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color; 
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(micInput) {
        this.height = micInput * 800;
        // this.draw(ctx);
        // this.x += this.velocity;
    }
}

class Microphone {
    constructor() {
        this.initialized = false;
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            this.audioContext = new AudioContext();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 512;
            this.analyser.smoothingTimeConstant = 0.3;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            // this.analyser.connect(this.audioContext.destination);
            this.microphone.connect(this.analyser);
            this.initialized = true;
        }).catch(err => {
            console.log(err);
        });
    }
    getSamples() {
        if (!this.initialized) {
            return [];
        }
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map(e => e/128 - 1);
        return normSamples;
    }
    getVolume() {
        if (!this.initialized) {
            return 0;
        }
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map(e => e/128 - 1);
        let sum = 0;
        for (let i = 0; i < normSamples.length; i++) {
            sum += normSamples[i] * normSamples[i];
        }
        let volume = Math.sqrt(sum / normSamples.length);
        return volume;
    }
    initialize() {
        if (this.initialized) {
            return Promise.resolve();
        }

        return navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                // ... microphone initialization code ...
                this.audioContext = new AudioContext();
                this.microphone = this.audioContext.createMediaStreamSource(stream);
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 512;
                this.analyser.smoothingTimeConstant = 0.3;
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                // this.analyser.connect(this.audioContext.destination);
                this.microphone.connect(this.analyser);

                this.initialized = true;
            });

    }
}

// const microphone = new Microphone();
// console.log(microphone);
// const bar1 = new Bar(0, 10, 50, 50, 'blue');

function Visualizer() {
    const canvasRef = useRef(null);
    const microphoneRef = useRef(new Microphone());
    const barsRef = useRef([]); 
    const animationFrameRef = useRef();

    const createBars = (canvasWidth, canvasHeight) => {
        let bars = [];
        let barWidth = canvasWidth / 256;
        for (let i = 0; i < 256; i++) {
            let color = `hsl(${i * 2}, 100%, 50%)`;
            bars.push(new Bar(i * barWidth, canvasHeight / 2, barWidth, 20, color));
        }
        return bars;
    };

    const animate = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const microphone = microphoneRef.current;
        const bars = barsRef.current; 

        console.log('animate');
        console.log(microphone.initialized);

        if (canvas && microphone.initialized) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const samples = microphone.getSamples();
            console.log(samples);
            // ... use samples to update and draw bars ..

            // For example, if you had an array of bars:
            bars.forEach((bar, index) => {
                bar.update(samples[index]);
                bar.draw(ctx);
            });

            // Continue the loop
            animationFrameRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight/2;

        const initializeMicrophone = async () => {
            try {
                await microphoneRef.current.initialize();
                barsRef.current = createBars(canvas.width, canvas.height);
                animationFrameRef.current = requestAnimationFrame(animate);
            } catch (error) {
                console.error('Microphone initialization failed:', error);
                // Update UI to show retry button or error message
            }
        };

        initializeMicrophone();

        console.log('useEffect');
        
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return <canvas ref={canvasRef} className='bg-black' />;
}

export default Visualizer;
