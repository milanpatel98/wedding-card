import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image"; // kept for future use
import qrUrl from "./assets/wedding_qr.svg";
import ramImg from "./assets/ram.png";

const base = import.meta.env.BASE_URL;

const es = typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("es");

const t = {
  together:    es ? "Junto con sus familias"              : "Together with their families",
  request:     es ? "Solicitan el honor de su compañía"   : "Request the pleasure of your company",
  date:        es ? <>El Verano de<br />Dos Mil Veintiséis</>  : <>The Summer of<br />Twenty Twenty Six</>,
  time:        es ? "1:00 de la Tarde"                    : "1:00 in the Afternoon",
  reception:   es ? "recepción a continuación"            : "reception to follow",
  backTitle:   es ? "Nuestro Sitio de Boda"               : "Our Wedding Website",
  backBody1:   es ? "escanee el código QR o use los botones de abajo"  : "scan the QR code or use the buttons below",
  backBody2:   es ? "para confirmar asistencia y más información"       : "to RSVP for date, venue & full details",
  backBody3:   es ? "por favor responda antes del 30 de mayo · 2026"   : "please respond by May 30th · 2026",
  flipHint:    es ? "toca para voltear →"                 : "tap to flip →",
  flipBack:    es ? "← voltear"                           : "← flip back",
  calBtn:      es ? "Agregar al Calendario"               : "Add to Calendar",
  rsvpBtn:     es ? "Confirmar"                           : "RSVP",
  cerSummary:  es ? "Ceremonia de Boda · Jennifer & Milan" : "Jennifer & Milan's Wedding Ceremony",
  cerDesc:     es ? "Por favor únanse a la boda de Jennifer Huitron y Milan Patel. Confirmen su asistencia antes del 30 de mayo · 2026."
                  : "Please join us for the wedding of Jennifer Huitron and Milan Patel. Kindly RSVP by May 30th · 2026.",
  recSummary:  es ? "Recepción de Boda · Jennifer & Milan" : "Jennifer & Milan's Wedding Reception",
  recDesc:     es ? "Recepción de boda de Jennifer Huitron y Milan Patel."
                  : "Reception following the wedding ceremony of Jennifer Huitron and Milan Patel.",
};

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
    background: #000;
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
    padding: 40px 20px 100px;
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
    width: min(390px, 90vw);
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

  @keyframes hintWobble {
    0%   { transform: rotateX(0deg) rotateY(0deg); }
    15%  { transform: rotateX(2deg) rotateY(-18deg); }
    35%  { transform: rotateX(-1deg) rotateY(12deg); }
    55%  { transform: rotateX(1.5deg) rotateY(-10deg); }
    75%  { transform: rotateX(-1deg) rotateY(6deg); }
    90%  { transform: rotateX(0.5deg) rotateY(-3deg); }
    100% { transform: rotateX(0deg) rotateY(0deg); }
  }

  .card.wobble {
    animation: hintWobble 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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
    font-size: 15px;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.95);
    text-transform: uppercase;
    text-align: center;
    white-space: normal;
    line-height: 1.6;
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
    padding: 76px 36px 109px;
  }

  .b-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .b-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .b-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 14px;
    letter-spacing: 5px;
    color: rgba(255,255,255,0.85);
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
  }

  .b-body {
    font-family: 'Cormorant Garamond', serif;
    font-size: 10px;
    font-style: normal;
    font-weight: 300;
    color: rgba(255,255,255,0.45);
    text-align: center;
    line-height: 1.7;
    letter-spacing: 2px;
  }

  .b-url {
    font-family: 'Cormorant Garamond', serif;
    font-size: 9px;
    font-weight: 300;
    font-style: italic;
    letter-spacing: 0.5px;
    color: rgba(255,255,255,0.3);
    text-align: center;
    white-space: nowrap;
  }

  .qr-wrap {
    width: 175px;
    height: 175px;
    background: transparent;
    padding: 4px;
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
    margin-top: 22px;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 9px;
    letter-spacing: 4px;
    color: rgba(255,255,255,0.32);
    text-transform: uppercase;
    cursor: pointer;
    user-select: none;
    transition: color 0.3s;
    text-align: center;
  }
  .hint:hover { color: rgba(255,255,255,0.6); }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    padding: 16px 0 calc(16px + env(safe-area-inset-bottom));
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(255,255,255,0.07);
  }

  .cal-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0.3px;
    color: rgba(255,248,230,0.45);
    cursor: pointer;
    user-select: none;
    background: none;
    border: none;
    outline: none;
    padding: 4px 0;
    white-space: nowrap;
    border-right: 1px solid rgba(255,255,255,0.12);
    transition: color 0.3s;
  }
  .cal-btn:hover { color: rgba(255,248,230,0.85); }
  .cal-btn svg {
    opacity: 0.5;
    transition: opacity 0.3s;
    flex-shrink: 0;
  }
  .cal-btn:hover svg { opacity: 1; }

  .rsvp-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0.3px;
    color: rgba(255,248,230,0.75);
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
    padding: 4px 0;
    white-space: nowrap;
    transition: color 0.3s, gap 0.3s;
  }
  .rsvp-btn:hover {
    color: rgba(255,248,230,1);
    gap: 13px;
  }

`;

export default function InvitationCard() {
  const [flipped, setFlipped] = useState(false);
  const [wobble, setWobble] = useState(false);
  const flippedRef = useRef(false);
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const wobbleIntervalRef = useRef(null);

  useEffect(() => {
    const triggerWobble = () => {
      if (!flippedRef.current) {
        setWobble(true);
        setTimeout(() => setWobble(false), 1900);
      }
    };

    const initialTimer = setTimeout(() => {
      triggerWobble();
      wobbleIntervalRef.current = setInterval(triggerWobble, 5000);
    }, 2500);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(wobbleIntervalRef.current);
    };
  }, []);

  const onMove = (e) => {
    setWobble(false);
    clearInterval(wobbleIntervalRef.current);
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
    setWobble(false);
    clearInterval(wobbleIntervalRef.current);
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

  const addToCalendar = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Milan & Jennifer Wedding//EN",
      // Ceremony
      "BEGIN:VEVENT",
      "DTSTART:20260606T130000",
      "DTEND:20260606T150000",
      `SUMMARY:${t.cerSummary}`,
      "LOCATION:St Thomas Church\\, 1450 S Melrose Dr\\, Oceanside\\, CA 92056",
      `DESCRIPTION:${t.cerDesc}`,
      "URL:https://milanpatel98.github.io/milanjenniferweds",
      "END:VEVENT",
      // Reception
      "BEGIN:VEVENT",
      "DTSTART:20260606T163000",
      "DTEND:20260606T233000",
      `SUMMARY:${t.recSummary}`,
      "LOCATION:Aria Event Hall\\, 740 Nordahl Rd Ste 125\\, San Marcos\\, CA 92069",
      `DESCRIPTION:${t.recDesc}`,
      "URL:https://milanpatel98.github.io/milanjenniferweds",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jennifer-milan-wedding.ics";
    a.click();
    URL.revokeObjectURL(url);
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
            className={`card${wobble ? " wobble" : ""}`}
            style={{ transform: "rotateX(0deg) rotateY(0deg)", transition: wobble ? "none" : "transform 0.6s ease" }}
          >

            <div className="face front" ref={frontRef}>
              <img src={ramImg} alt="" className="f-ram" />
              <p className="f-together">{t.together}</p>
              <div className="f-top">
                <span className="f-name1">Jennifer Huitron</span>
                <span className="f-plus">+</span>
                <span className="f-name2">Milan Patel</span>
              </div>
              <div className="f-mid">
                <p className="f-request">{t.request}</p>
                <p className="f-date">{t.date}</p>
                <div className="f-details">
                  <span>{t.time}</span>
                  <span>St Thomas Church</span>
                  <span>1450 S Melrose Dr · Oceanside, CA</span>
                </div>
              </div>
              <div className="f-bottom">
                <p className="f-reception">{t.reception}</p>
              </div>
            </div>

            <div className="face back" ref={backRef}>
              <div className="b-top">
                <p className="b-title">{t.backTitle}</p>
                <p className="b-body">
                  {t.backBody1}<br />
                  {t.backBody2}<br />
                  {t.backBody3}
                </p>
                <p className="b-url">milanpatel98.github.io/milanjenniferweds</p>
              </div>
              <div className="b-main">
                <a
                  className="qr-wrap"
                  href="https://milanpatel98.github.io/milanjenniferweds"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  <img src={qrUrl} alt="QR Code" />
                </a>
                <div className="b-sigs">
                  <span className="b-sig">Jennifer</span>
                  <span className="b-sig-plus">+</span>
                  <span className="b-sig">Milan</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <p className="hint" onClick={flip}>
          {flipped ? t.flipBack : t.flipHint}
        </p>
        <div className="bottom-bar">
          <button className="cal-btn" onClick={addToCalendar}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {t.calBtn}
          </button>
          <a
            className="rsvp-btn"
            href="https://milanpatel98.github.io/milanjenniferweds"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.rsvpBtn}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}

