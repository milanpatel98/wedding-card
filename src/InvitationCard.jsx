import { useState, useRef } from "react";
import { toPng } from "html-to-image"; // kept for future use
import qrUrl from "./assets/wedding_qr.svg";
import ramImg from "./assets/ram.png";

const base = import.meta.env.BASE_URL;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

  @font-face {
    font-family: 'The Artisan';
    src: url('${base}the-artisan.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Masculin';
    src: url('${base}Masculin.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    overflow-x: hidden;
    max-width: 100vw;
  }

  .wrapper {
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
    background: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .glow {
    position: absolute;
    width: 900px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(ellipse,
      rgba(255,248,230,0.09) 0%,
      transparent 100%
    );
    pointer-events: none;
    top: 50%;
    left: 50%;
    z-index: 0;
    filter: blur(60px);
    will-change: transform;
  }

  .scene {
    width: min(370px, 90vw);
    height: min(560px, calc(90vw * 1.513));
    perspective: 1600px;
    cursor: pointer;
    position: relative;
    z-index: 1;
  }

  .card {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    z-index: 1;
  }

  .face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
    box-shadow: 0 40px 80px rgba(0,0,0,0.95);
  }

  /* FRONT */
  .front {
    background: #121212;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 44px 40px 38px;
  }

  .f-ram {
    display: block;
    width: 55px;
    margin: 0 auto 10px;
    opacity: 0.5;
  }

  .f-together {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 7.5px;
    letter-spacing: 5px;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    width: 100%;
  }

  .f-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
    justify-content: center;
  }

  .f-name1, .f-name2 {
    font-family: 'The Artisan', cursive;
    font-size: 34px;
    color: #ffffff;
    line-height: 1;
    text-align: center;
    display: block;
    width: 100%;
    white-space: nowrap;
  }

  .f-plus {
    font-family: 'Masculin', cursive;
    font-size: 50px;
    color: rgba(255,255,255,0.6);
    display: block;
    text-align: center;
    margin: 8px 0 6px;
    line-height: 1;
  }

  .f-mid {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-top: 20px;
  }

  .f-request {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 7.5px;
    letter-spacing: 2.5px;
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    margin-bottom: 10px;
  }

  .f-date {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: 22px;
    letter-spacing: 4px;
    color: rgba(255,255,255,0.95);
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    margin-bottom: 14px;
  }

  .f-details {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 7.5px;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    text-align: center;
    font-variant-numeric: lining-nums;
  }

  .f-details span {
    display: block;
    margin-bottom: 7px;
    white-space: nowrap;
  }

  .f-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 16px;
  }

  .f-reception {
    font-family: 'The Artisan', cursive;
    font-size: 21px;
    color: rgba(255,255,255,0.4);
    text-align: center;
    line-height: 1;
    white-space: nowrap;
  }

  /* BACK */
  .back {
    background: #121212;
    transform: rotateY(180deg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 44px 36px 40px;
  }

  .b-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 7px;
    color: rgba(255,255,255,0.85);
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
  }

  .b-body {
    font-family: 'Cormorant Garamond', serif;
    font-size: 8.5px;
    font-style: normal;
    font-weight: 300;
    color: rgba(255,255,255,0.38);
    text-align: center;
    line-height: 2;
    letter-spacing: 2.5px;
  }

  .b-url {
    font-family: 'Cormorant Garamond', serif;
    font-size: 7.5px;
    font-weight: 300;
    letter-spacing: 1.5px;
    color: rgba(255,255,255,0.25);
    text-align: center;
    white-space: nowrap;
  }

  .qr-wrap {
    width: 168px;
    height: 168px;
    background: transparent;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qr-wrap img { width: 100%; height: 100%; filter: invert(1); }

  .b-sigs {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .b-sig {
    font-family: 'The Artisan', cursive;
    font-size: 20px;
    color: rgba(255,255,255,0.4);
    text-align: center;
    display: block;
    line-height: 1.1;
  }

  .b-sig-plus {
    font-family: 'Masculin', cursive;
    font-size: 32px;
    color: rgba(255,255,255,0.45);
    text-align: center;
    display: block;
    line-height: 1;
  }

  .hint {
    margin-top: 26px;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 8px;
    letter-spacing: 5px;
    color: rgba(255,255,255,0.13);
    text-transform: uppercase;
    cursor: pointer;
    user-select: none;
    transition: color 0.3s;
    text-align: center;
  }
  .hint:hover { color: rgba(255,255,255,0.35); }

`;

export default function InvitationCard() {
  const [flipped, setFlipped] = useState(false);
  const flippedRef = useRef(false);
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const onMove = (e) => {
    if (flippedRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    const rx = -ny * 10;
    const ry = nx * 10;
    if (cardRef.current) {
      cardRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      cardRef.current.style.transition = "transform 0.08s ease-out";
    }
    if (glowRef.current) {
      glowRef.current.style.transform = `translate(calc(-50% + ${ry * 12}px), calc(-50% + ${rx * -6}px)) rotateX(${rx * 0.6}deg) rotateY(${ry * 0.6}deg)`;
      glowRef.current.style.transition = "transform 0.08s ease-out";
    }
  };

  const onLeave = () => {
    if (flippedRef.current) return;
    if (cardRef.current) {
      cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
      cardRef.current.style.transition = "transform 0.6s ease";
    }
    if (glowRef.current) {
      glowRef.current.style.transform = "translate(-50%, -50%) rotateX(0deg) rotateY(0deg)";
      glowRef.current.style.transition = "transform 0.6s ease";
    }
  };

  const flip = () => {
    const next = !flippedRef.current;
    flippedRef.current = next;
    setFlipped(next);
    const flipTransition = "transform 1.2s cubic-bezier(0.645,0.045,0.355,1)";
    if (cardRef.current) {
      cardRef.current.style.transform = next ? "rotateY(180deg)" : "rotateX(0deg) rotateY(0deg)";
      cardRef.current.style.transition = flipTransition;
    }
    if (glowRef.current) {
      glowRef.current.style.transform = next ? "translate(-50%, -50%) rotateY(180deg)" : "translate(-50%, -50%) rotateX(0deg) rotateY(0deg)";
      glowRef.current.style.transition = flipTransition;
    }
  };

  const download = async (ref, filename) => {
    const png = await toPng(ref.current, { pixelRatio: 4 });
    const a = document.createElement("a");
    a.href = png;
    a.download = filename;
    a.click();
  };

  return (
    <>
      <style>{css}</style>
      <div className="wrapper">
        <div
          className="scene"
          onClick={flip}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div
            ref={glowRef}
            className="glow"
            style={{ transform: "translate(-50%, -50%)", transition: "transform 0.6s ease" }}
          />
          <div
            ref={cardRef}
            className="card"
            style={{ transform: "rotateX(0deg) rotateY(0deg)", transition: "transform 0.6s ease" }}
          >

            <div className="face front" ref={frontRef}>
              <img src={ramImg} alt="" className="f-ram" />
              <p className="f-together">Together with their families</p>
              <div className="f-top">
                <span className="f-name1">Jennifer Huitron</span>
                <span className="f-plus">+</span>
                <span className="f-name2">Milan Patel</span>
              </div>
              <div className="f-mid">
                <p className="f-request">Request the pleasure of your company</p>
                <p className="f-date">The Sixth of June</p>
                <div className="f-details">
                  <span>1:00 in the Afternoon</span>
                  <span>St Thomas Church</span>
                  <span>1450 S Melrose Dr · Oceanside, CA</span>
                </div>
              </div>
              <div className="f-bottom">
                <p className="f-reception">reception to follow</p>
              </div>
            </div>

            <div className="face back" ref={backRef}>
              <p className="b-title">Our Wedding Website</p>
              <p className="b-body">
                kindly scan the QR code to RSVP<br />
                by the first of June · 2026<br />
                hotel accommodations, transport, and<br />
                other details are also on the website
              </p>
              <p className="b-url">milanpatel98.github.io/milanjenniferweds</p>
              <div className="qr-wrap">
                  <img src={qrUrl} alt="QR Code" />
              </div>
              <div className="b-sigs">
                <span className="b-sig">Jennifer</span>
                <span className="b-sig-plus">+</span>
                <span className="b-sig">Milan</span>
              </div>
            </div>

          </div>
        </div>
        <p className="hint" onClick={flip}>
          {flipped ? "← flip back" : "tap to flip →"}
        </p>
      </div>
    </>
  );
}

