"use client";

export default function GooFilter() {
  return (
    <>
<svg style={{ "position": "absolute", "width": "0", "height": "0", "overflow": "hidden" }} aria-hidden="true"><defs><filter id="goo-nav"><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" /></filter></defs></svg>
    </>
  );
}
