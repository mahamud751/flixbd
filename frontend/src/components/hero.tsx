"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

const banners = [
  { src: "/banners/1.webp", alt: "FANFLIX - OTT SUBSCRIPTIONS BD" },
  { src: "/banners/2.jpg", alt: "FANFLIX - OTT SUBSCRIPTIONS BD" },
  { src: "/banners/3.jpg", alt: "FANFLIX - OTT SUBSCRIPTIONS BD" },
  { src: "/banners/4.webp", alt: "FANFLIX - OTT SUBSCRIPTIONS BD" },
] as const;

const COUNT = banners.length;
const GAP = 10;

function metrics(frameWidth: number) {
  if (frameWidth >= 1280) return { slide: frameWidth * 0.6988, gap: GAP };
  if (frameWidth >= 1024) return { slide: frameWidth * 0.763, gap: GAP };
  if (frameWidth >= 768) return { slide: frameWidth * 0.8, gap: GAP };
  return { slide: frameWidth, gap: GAP };
}

function place(frame: HTMLElement, track: HTMLElement, index: number, animated: boolean) {
  const { slide, gap } = metrics(frame.clientWidth);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  Array.from(track.children).forEach((child) => {
    (child as HTMLElement).style.width = `${slide}px`;
  });
  const x = (frame.clientWidth - slide) / 2 - index * (slide + gap);
  track.style.transition = animated && !reduce ? "transform 300ms ease" : "none";
  track.style.transform = `translate3d(${x}px,0,0)`;
  return x;
}

export function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(1);
  const xRef = useRef(0);
  const firstRef = useRef(true);
  const dragRef = useRef({ down: false, x: 0, origin: 0, delta: 0 });
  const stepRef = useRef<(direction: 1 | -1) => void>(() => {});
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);

  const slides = [banners[COUNT - 1], ...banners, banners[0]];
  const active = (((index - 1) % COUNT) + COUNT) % COUNT;

  useLayoutEffect(() => {
    indexRef.current = index;
    const frame = frameRef.current;
    const track = trackRef.current;
    if (!frame || !track) return;
    const motion = firstRef.current ? false : animate;
    firstRef.current = false;
    xRef.current = place(frame, track, index, motion);
  }, [index, animate]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const track = trackRef.current;
    if (!frame || !track) return;
    const observer = new ResizeObserver(() => {
      xRef.current = place(frame, track, indexRef.current, false);
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden || dragRef.current.down) return;
      stepRef.current(1);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  function normalize(current: number) {
    if (current > COUNT) return current - COUNT;
    if (current < 1) return current + COUNT;
    return current;
  }

  function step(direction: 1 | -1) {
    const frame = frameRef.current;
    const track = trackRef.current;
    if (!frame || !track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const current = indexRef.current;
    if (reduce) {
      let next = current + direction;
      if (next > COUNT) next = 1;
      if (next < 1) next = COUNT;
      setAnimate(false);
      setIndex(next);
      return;
    }
    const base = normalize(current);
    if (base !== current) {
      indexRef.current = base;
      xRef.current = place(frame, track, base, false);
      setAnimate(false);
      setIndex(base);
      window.requestAnimationFrame(() => {
        setAnimate(true);
        setIndex(base + direction);
      });
      return;
    }
    setAnimate(true);
    setIndex(current + direction);
  }

  useLayoutEffect(() => {
    stepRef.current = step;
  });

  function goTo(real: number) {
    const frame = frameRef.current;
    const track = trackRef.current;
    if (!frame || !track) return;
    const target = real + 1;
    const base = normalize(indexRef.current);
    if (base !== indexRef.current) {
      indexRef.current = base;
      xRef.current = place(frame, track, base, false);
      setAnimate(false);
      setIndex(base);
      window.requestAnimationFrame(() => {
        setAnimate(true);
        setIndex(target);
      });
      return;
    }
    setAnimate(true);
    setIndex(target);
  }

  function onTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.target !== trackRef.current || event.propertyName !== "transform") return;
    const current = indexRef.current;
    if (current > COUNT || current < 1) {
      const next = normalize(current);
      setAnimate(false);
      setIndex(next);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setAnimate(true));
      });
    }
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    dragRef.current = { down: true, x: event.clientX, origin: xRef.current, delta: 0 };
    if (trackRef.current) trackRef.current.style.transition = "none";
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag.down || !trackRef.current) return;
    drag.delta = event.clientX - drag.x;
    trackRef.current.style.transform = `translate3d(${drag.origin + drag.delta}px,0,0)`;
  }

  function onPointerUp() {
    const drag = dragRef.current;
    if (!drag.down) return;
    drag.down = false;
    if (drag.delta <= -40) step(1);
    else if (drag.delta >= 40) step(-1);
    else {
      const frame = frameRef.current;
      const track = trackRef.current;
      if (frame && track) xRef.current = place(frame, track, indexRef.current, true);
    }
  }

  return (
    <section
      className="hero-banner relative overflow-hidden bg-white pb-12 md:pb-10"
      aria-roledescription="carousel"
      aria-label="Slideshow about our brand"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
    >
      <div
        ref={frameRef}
        className="cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={trackRef} className="hero-track" onTransitionEnd={onTransitionEnd}>
          {slides.map((banner, position) => (
            <div
              key={`${banner.src}-${position}`}
              className="hero-slide"
              aria-hidden={position === 0 || position > COUNT || position - 1 !== active}
            >
              <div className="mx-[15px] overflow-hidden rounded-[16px] md:mx-0 md:rounded-[20px]">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  width={2000}
                  height={701}
                  priority={position === 1}
                  draggable={false}
                  sizes="(min-width: 1280px) 70vw, (min-width: 768px) 80vw, 92vw"
                  className="block h-auto w-full select-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3">
        {banners.map((banner, dot) => (
          <button
            key={banner.src}
            type="button"
            aria-label={`Show slide ${dot + 1} of ${COUNT}`}
            aria-current={dot === active ? "true" : undefined}
            onClick={() => goTo(dot)}
            className={dot === active ? "hero-dot is-active" : "hero-dot"}
          />
        ))}
      </div>
    </section>
  );
}
