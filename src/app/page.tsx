// src/app/page.tsx
"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    createjs: any;
    gsap: any;
  }
}

interface SpriteSheetData {
  frames: [number, number, number, number][];
  animations: {
    dig: {
      frames: number[];
    };
  };
  images?: HTMLImageElement[];
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!window.createjs || !window.gsap) return;

    // Create the CreateJS stage using the canvas element.
    const stage = new window.createjs.Stage(canvasRef.current);

    // Define the sprite sheet data.
    const spriteSheetData: SpriteSheetData = {
      frames: [
        [0, 0, 0, 0],
        [0, 0, 264, 160],
        [264, 0, 264, 160],
        [528, 0, 264, 160],
        [792, 0, 264, 160],
        [0, 160, 264, 160],
        [264, 160, 264, 160],
        [528, 160, 264, 160],
        [792, 160, 264, 160],
        [0, 320, 264, 160],
        [264, 320, 264, 160],
        [528, 320, 264, 160],
        [792, 320, 264, 160],
        [0, 480, 264, 160],
      ],
      animations: {
        dig: {
          frames: [
            1, 2, 2, 2, 2, 1, 3, 4, 5, 6, 7, 8, 8, 9, 9,
            10, 10, 11, 11, 12, 12, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 6, 6,
            5, 5, 4, 4, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1,
          ],
        },
      },
    };

    // Create and load the sprite image using document.createElement("img")
    const spriteImage = document.createElement("img");
    spriteImage.crossOrigin = "Anonymous";
    spriteImage.src = "https://assets.codepen.io/128542/construction.png?v2";

    spriteImage.onload = () => {
      // Add the loaded image to the sprite sheet data.
      spriteSheetData.images = [spriteImage];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spriteSheet = new (window.createjs.SpriteSheet as any)(spriteSheetData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sprite = new (window.createjs.Sprite as any)(spriteSheet);

      // Start the sprite at the "dig" animation.
      sprite.gotoAndStop("dig");
      stage.addChild(sprite);
      stage.update();

      // Create a GSAP timeline to animate the sprite frames.
      const tl = window.gsap.timeline({
        paused: true,
        repeat: -1,
        defaults: { ease: "none" },
      });
      tl.to(sprite, {
        currentAnimationFrame: window.gsap.utils.snap(
          1,
          spriteSheetData.animations.dig.frames.length
        ),
        duration: 2.5,
      });
      tl.eventCallback("onUpdate", () => {
        stage.update();
      });
      tl.play();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Under Construction</h1>
      <canvas
        ref={canvasRef}
        width="264"
        height="160"
        style={{ imageRendering: "pixelated" }}
      />
      {/* Load external libraries */}
      <Script
        src="https://code.createjs.com/1.0.0/createjs.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"
        strategy="beforeInteractive"
      />
    </div>
  );
}
