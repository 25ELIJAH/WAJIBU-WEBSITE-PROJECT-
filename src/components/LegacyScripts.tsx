"use client";

import { useEffect } from "react";

type Cleanup = () => void;

/**
 * Runs the original page scripts (scroll progress, burger menu, counters,
 * carousel, reveal animations, cookie banner, ...) exactly as they were written
 * in the static site, after the page has mounted.
 *
 * Because Next.js navigates client-side, everything a script registers
 * (event listeners, timers, observers, animation frames) is tracked while the
 * page is mounted and torn down on unmount so nothing leaks between routes.
 * Elements a script appends directly to <body> (progress bar, custom cursor,
 * ...) are tracked and removed too — and only those, never React's own nodes.
 */
export default function LegacyScripts({ scripts }: { scripts: string[] }) {
  useEffect(() => {
    const cleanups: Cleanup[] = [];
    const w = window as unknown as Record<string, any>;
    const d = document;

    const origWinAdd = w.addEventListener.bind(window);
    const origDocAdd = d.addEventListener.bind(d);
    const origSetTimeout = w.setTimeout.bind(window);
    const origSetInterval = w.setInterval.bind(window);
    const origRaf = w.requestAnimationFrame.bind(window);
    const OrigIO = w.IntersectionObserver;
    const OrigMO = w.MutationObserver;
    const OrigRO = w.ResizeObserver;

    const timeouts = new Set<number>();
    const intervals = new Set<number>();
    const rafs = new Set<number>();
    const addedToBody = new Set<Node>();
    let alive = true;

    /** Run fn and remember any element it added directly under <body>. */
    const tracked = <T extends (...a: any[]) => any>(fn: T): T =>
      ((...args: any[]) => {
        if (!alive) return undefined;
        const before = new Set(Array.from(d.body.children));
        try {
          return fn(...args);
        } finally {
          Array.from(d.body.children).forEach((el) => {
            if (!before.has(el)) addedToBody.add(el);
          });
        }
      }) as T;

    const trackListener =
      (target: EventTarget, orig: EventTarget["addEventListener"]) =>
      (type: string, handler: any, opts?: any) => {
        // The page is already loaded when we run: fire "load"-style handlers now.
        if (type === "DOMContentLoaded" || type === "load") {
          origSetTimeout(
            tracked(() => {
              const ev = new Event(type);
              if (typeof handler === "function") handler.call(target, ev);
              else handler?.handleEvent?.(ev);
            }),
            0
          );
          return;
        }
        orig.call(target, type, handler, opts);
        cleanups.push(() => target.removeEventListener(type, handler, opts));
      };

    w.addEventListener = trackListener(window, origWinAdd);
    d.addEventListener = trackListener(d, origDocAdd);
    w.setTimeout = (fn: any, ms?: number, ...args: any[]) => {
      const id = origSetTimeout(typeof fn === "function" ? tracked(fn) : fn, ms, ...args);
      timeouts.add(id);
      return id;
    };
    w.setInterval = (fn: any, ms?: number, ...args: any[]) => {
      const id = origSetInterval(typeof fn === "function" ? tracked(fn) : fn, ms, ...args);
      intervals.add(id);
      return id;
    };
    w.requestAnimationFrame = (fn: FrameRequestCallback) => {
      const id = origRaf(tracked(fn));
      rafs.add(id);
      return id;
    };
    const wrapObserver = (Orig: any) =>
      Orig &&
      class extends Orig {
        constructor(cb: any, ...a: any[]) {
          super(typeof cb === "function" ? tracked(cb) : cb, ...a);
          cleanups.push(() => this.disconnect());
        }
      };
    if (OrigIO) w.IntersectionObserver = wrapObserver(OrigIO);
    if (OrigMO) w.MutationObserver = wrapObserver(OrigMO);
    if (OrigRO) w.ResizeObserver = wrapObserver(OrigRO);

    // Each original <script> runs in its own function scope.
    for (const code of scripts) {
      try {
        tracked(() => new Function(code)())();
      } catch (err) {
        console.error("[legacy script]", err);
      }
    }

    return () => {
      alive = false;
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch {}
      });
      timeouts.forEach((id) => clearTimeout(id));
      intervals.forEach((id) => clearInterval(id));
      rafs.forEach((id) => cancelAnimationFrame(id));
      w.addEventListener = origWinAdd;
      d.addEventListener = origDocAdd;
      w.setTimeout = origSetTimeout;
      w.setInterval = origSetInterval;
      w.requestAnimationFrame = origRaf;
      if (OrigIO) w.IntersectionObserver = OrigIO;
      if (OrigMO) w.MutationObserver = OrigMO;
      if (OrigRO) w.ResizeObserver = OrigRO;
      addedToBody.forEach((el) => el.parentNode?.removeChild(el));
      d.body.classList.remove("menu-open");
      d.body.style.overflow = "";
    };
  }, [scripts]);

  return null;
}
