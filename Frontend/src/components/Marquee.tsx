"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export function Marquee({ items, speed = 1 }: { items: string[]; speed?: number }) {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!textRef.current) return;
      
      const width = textRef.current.offsetWidth || 0;
      
      // Set hardware acceleration
      gsap.set(textRef.current, {
        willChange: "transform",
        force3D: true,
      });
      
      gsap.to(textRef.current, {
        x: -width / 2,
        duration: 20 / speed,
        ease: "none",
        repeat: -1,
      });
    }, container);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={container} className="w-full overflow-hidden border-y border-primary/10 py-6 bg-background">
      <div ref={textRef} className="flex whitespace-nowrap w-fit" style={{ willChange: "transform" }}>
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-16 px-8">
            <span className="font-semibold text-sm uppercase tracking-[0.2em] opacity-60">
              {item}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

