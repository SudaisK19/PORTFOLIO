"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";

// Define a minimal interface for GSAP timeline chaining.
interface GsapTimeline {
  to(
    target: unknown,
    vars: { currentAnimationFrame?: number; duration?: number; [key: string]: unknown }
  ): GsapTimeline;
  eventCallback(event: string, callback: () => void): GsapTimeline;
  play(): GsapTimeline;
}

// Extend the global Window interface with minimal types for CreateJS and GSAP.
declare global {
  interface Window {
    createjs: {
      Stage: new (canvas: HTMLCanvasElement) => {
        update(): void;
        addChild(child: unknown): void;
      };
      SpriteSheet: new (data: object) => unknown;
      Sprite: new (spriteSheet: unknown) => {
        gotoAndStop(animation: string): void;
      };
    };
    gsap: {
      timeline(options?: {
        paused?: boolean;
        repeat?: number;
        defaults?: { ease?: string };
      }): GsapTimeline;
      utils: {
        snap(increment: number, value: number): number;
      };
    };
  }
}

// Define an interface for our sprite sheet data.
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

    // Create and load the sprite image using document.createElement("img").
    const spriteImage = document.createElement("img");
    spriteImage.crossOrigin = "Anonymous";
    spriteImage.src = "https://assets.codepen.io/128542/construction.png?v2";

    spriteImage.onload = () => {
      // Add the loaded image to the sprite sheet data.
      spriteSheetData.images = [spriteImage];

      // Create the SpriteSheet and Sprite objects.
      const spriteSheet = new window.createjs.SpriteSheet(spriteSheetData);
      const sprite = new window.createjs.Sprite(spriteSheet);

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
      {/* Header with Contact Details */}
      <header className="w-full flex justify-end items-center mb-4 space-x-4">
        <a
          href="https://github.com/SudaisK19"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/sudaiskatiya/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          LinkedIn
        </a>
        <a
          href="mailto:sudais.katiya191@gmail.com"
          className="text-blue-500 hover:underline"
        >
          Email
        </a>
      </header>

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
