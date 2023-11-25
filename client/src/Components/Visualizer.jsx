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

    update(ctx) {
        this.draw(ctx);
        this.x += this.velocity;
    }
}

const bar1 = new Bar(0, 10, 50, 50, 'blue');

function Visualizer() {
    const canvasRef = useRef(null);

    useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight/2;

    bar1.draw(ctx);

    // You can add any drawing logic here using ctx

    }, []); // Empty dependency array means this effect runs once on mount

    return <canvas ref={canvasRef} className='bg-black' />;
}

export default Visualizer;
