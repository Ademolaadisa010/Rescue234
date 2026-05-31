"use client";

import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "intro" | "location" | "stream" | "details" | "sending" | "done";
type Severity = "CRITICAL" | "HIGH" | "MODERATE" | "UNKNOWN";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Shield:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Location: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Camera:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  Info:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Send:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Check:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={28}><polyline points="20 6 9 17 4 12"/></svg>,
  Pulse:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Eye:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Car:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  Walk:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><circle cx="12" cy="5" r="1"/><path d="M9 20l1-7-2-3 4-2 2 4h4"/><path d="M10 13l-2 7"/></svg>,
  Flame:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  ArrowRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Hospital: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Stop:     <svg viewBox="0 0 24 24" fill="currentColor" width={18}><rect x="5" y="5" width="14" height="14" rx="2"/></svg>,
  Refresh:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
};

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id:"location", label:"Location",  icon: Icons.Location },
  { id:"stream",   label:"Stream",    icon: Icons.Camera   },
  { id:"details",  label:"Details",   icon: Icons.Info     },
  { id:"sending",  label:"Send",      icon: Icons.Send     },
];

const INCIDENT_TYPES = [
  { id:"collision",  label:"Road Collision",    icon: Icons.Car   },
  { id:"pedestrian", label:"Pedestrian Struck", icon: Icons.Walk  },
  { id:"fire",       label:"Vehicle Fire",      icon: Icons.Flame },
  { id:"other",      label:"Other Emergency",   icon: Icons.Pulse },
];

// ─── AI Severity Chip ─────────────────────────────────────────────────────────
const SEV_STYLE: Record<Severity, { bg: string; border: string; color: string }> = {
  CRITICAL: { bg:"rgba(232,0,29,.15)",  border:"rgba(232,0,29,.4)",   color:"#E8001D" },
  HIGH:     { bg:"rgba(255,120,0,.12)", border:"rgba(255,120,0,.4)",   color:"#ff7800" },
  MODERATE: { bg:"rgba(255,200,0,.1)",  border:"rgba(255,200,0,.35)",  color:"#e0b800" },
  UNKNOWN:  { bg:"rgba(255,255,255,.05)", border:"rgba(255,255,255,.1)", color:"rgba(240,237,232,.4)" },
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportPage() {
  const [step, setStep]               = useState<Step>("intro");
  const [gps, setGps]                 = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [gpsLoading, setGpsLoading]   = useState(false);
  const [gpsError, setGpsError]       = useState("");
  const [streaming, setStreaming]      = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const [incidentType, setIncidentType] = useState<string>("");
  const [victims, setVictims]         = useState(1);
  const [notes, setNotes]             = useState("");
  const [severity, setSeverity]       = useState<Severity>("UNKNOWN");
  const [sendProgress, setSendProgress] = useState(0);
  const [nearestHospital, setNearestHospital] = useState("");
  const [elapsed, setElapsed]         = useState(0);
  const [cameraError, setCameraError] = useState("");

  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── GPS ───────────────────────────────────────────────────────────────────
  const detectGPS = () => {
    setGpsLoading(true);
    setGpsError("");
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported on this device.");
      setGpsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Simulate reverse-geocode
        const addr = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E — Lagos State, Nigeria`;
        setGps({ lat, lng, address: addr });
        setGpsLoading(false);
      },
      () => {
        // Fallback demo coords
        setGps({ lat: 6.5244, lng: 3.3792, address: "6.5244° N, 3.3792° E — Lagos Mainland, Nigeria" });
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  // ── Camera ────────────────────────────────────────────────────────────────
  const startStream = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; }
      setStreaming(true);
      setStreamReady(true);
      // AI severity simulation
      setTimeout(() => setSeverity("HIGH"), 3000);
      // Stream timer
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } catch {
      setCameraError("Camera access denied. Please allow camera permissions and try again.");
    }
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setStreaming(false);
    setStreamReady(false);
    setSeverity("UNKNOWN");
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ── Send ──────────────────────────────────────────────────────────────────
  const sendReport = () => {
    setStep("sending");
    setSendProgress(0);
    const hospitals = ["LUTH — 2.1km","Lagos Island General — 3.4km","LASUTH — 5.8km"];
    setNearestHospital(hospitals[0]);
    const iv = setInterval(() => {
      setSendProgress(p => {
        if (p >= 100) { clearInterval(iv); setStep("done"); return 100; }
        return p + 4;
      });
    }, 80);
  };

  const reset = () => {
    stopStream();
    setStep("intro");
    setGps(null);
    setGpsError("");
    setIncidentType("");
    setVictims(1);
    setNotes("");
    setSeverity("UNKNOWN");
    setSendProgress(0);
    setElapsed(0);
  };

  useEffect(() => () => { stopStream(); }, []);

  const fmtTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const canNext: Record<Step, boolean> = {
    intro:   true,
    location: !!gps,
    stream:  streamReady,
    details: !!incidentType,
    sending: false,
    done:    false,
  };

  const goNext = () => {
    const order: Step[] = ["intro","location","stream","details","sending","done"];
    const i = order.indexOf(step);
    if (step === "details") { sendReport(); return; }
    if (i < order.length - 1) setStep(order[i+1]);
  };

  const goBack = () => {
    const order: Step[] = ["intro","location","stream","details","sending","done"];
    const i = order.indexOf(step);
    if (step === "stream") stopStream();
    if (i > 0) setStep(order[i-1]);
  };

  const stepIndex = ["location","stream","details","sending"].indexOf(step);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; background:#080808; color:#f0ede8; font-family:'DM Sans',sans-serif; }
        input, textarea, button, select { font-family:inherit; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(232,0,29,.25); border-radius:2px; }

        .fd { font-family:'Bebas Neue',sans-serif; }
        .fm { font-family:'Space Mono',monospace; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes pulseRed{ 0%,100%{box-shadow:0 0 0 0 rgba(232,0,29,.5)} 50%{box-shadow:0 0 0 12px rgba(232,0,29,0)} }
        @keyframes ping    { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.5);opacity:0} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes scanline{ from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
        @keyframes progress{ from{width:0} to{width:100%} }
        @keyframes dash    { to{stroke-dashoffset:0} }
        @keyframes successPop { 0%{transform:scale(.5);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }

        .fade-up   { animation:fadeUp .5s ease both; }
        .fade-up-2 { animation:fadeUp .5s .1s ease both; }
        .fade-up-3 { animation:fadeUp .5s .2s ease both; }
        .fade-up-4 { animation:fadeUp .5s .3s ease both; }
        .a-pulse   { animation:pulseRed 2s infinite; }
        .a-spin    { animation:spin .7s linear infinite; }
        .a-blink   { animation:blink 1s infinite; }
        .a-success { animation:successPop .5s cubic-bezier(.34,1.56,.64,1) both; }

        .btn-primary {
          font-family:'Space Mono',monospace; font-size:11px; letter-spacing:2px;
          text-transform:uppercase; background:#E8001D; color:#fff;
          border:none; padding:16px 36px; cursor:pointer;
          transition:all .2s; display:inline-flex; align-items:center; gap:10px;
        }
        .btn-primary:hover:not(:disabled) { background:#ff0022; transform:translateY(-1px); box-shadow:0 8px 30px rgba(232,0,29,.3); }
        .btn-primary:disabled { opacity:.4; cursor:not-allowed; }

        .btn-ghost {
          font-family:'Space Mono',monospace; font-size:11px; letter-spacing:2px;
          text-transform:uppercase; background:transparent; color:rgba(240,237,232,.5);
          border:1px solid rgba(255,255,255,.1); padding:16px 28px; cursor:pointer;
          transition:all .2s; display:inline-flex; align-items:center; gap:10px;
        }
        .btn-ghost:hover { color:#f0ede8; border-color:rgba(255,255,255,.25); }

        .type-card {
          background:#0f0f0f; border:1px solid rgba(255,255,255,.08); border-radius:8px;
          padding:20px; cursor:pointer; transition:all .2s; display:flex;
          flex-direction:column; align-items:flex-start; gap:10px;
        }
        .type-card:hover { border-color:rgba(232,0,29,.3); background:#131313; }
        .type-card.selected { border-color:#E8001D; background:rgba(232,0,29,.08); }

        .counter-btn {
          width:36px; height:36px; border-radius:4px; border:1px solid rgba(255,255,255,.12);
          background:rgba(255,255,255,.05); color:#f0ede8; font-size:18px;
          display:flex; align-items:center; justify-content:center; cursor:pointer;
          transition:all .2s;
        }
        .counter-btn:hover { background:rgba(232,0,29,.15); border-color:rgba(232,0,29,.3); }

        .progress-bar {
          height:3px; background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden;
        }
        .progress-fill {
          height:100%; background:#E8001D; border-radius:2px;
          transition:width .3s ease;
        }

        .scanline {
          position:absolute; left:0; right:0; height:2px;
          background:linear-gradient(90deg, transparent, rgba(232,0,29,.3), transparent);
          animation:scanline 3s linear infinite;
          pointer-events:none;
        }

        .step-dot {
          width:28px; height:28px; border-radius:50%; display:flex;
          align-items:center; justify-content:center; flex-shrink:0;
          font-family:'Space Mono',monospace; font-size:10px; font-weight:700;
          transition:all .3s;
        }

        .ai-chip {
          font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1.5px;
          text-transform:uppercase; padding:4px 10px; border-radius:3px;
          display:inline-flex; align-items:center; gap:5px;
        }

        .textarea-field {
          width:100%; background:#0d0d0d; border:1px solid rgba(255,255,255,.1);
          border-radius:6px; padding:14px 16px; color:#f0ede8; font-size:14px;
          resize:none; outline:none; transition:border-color .2s; line-height:1.6;
        }
        .textarea-field:focus { border-color:rgba(232,0,29,.4); }
        .textarea-field::placeholder { color:rgba(240,237,232,.25); }

        @media(max-width:640px) {
          .page-inner { padding:24px 20px !important; }
          .type-grid  { grid-template-columns:1fr 1fr !important; }
          .nav-btns   { flex-direction:column-reverse !important; }
          .nav-btns .btn-primary, .nav-btns .btn-ghost { width:100%; justify-content:center; }
        }
      `}</style>

      {/* ── TOPBAR ─────────────────────────────────────────────────────────── */}
      <nav style={{ position:"sticky", top:0, zIndex:50, background:"rgba(8,8,8,.95)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:28, height:28, background:"#E8001D", borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg viewBox="0 0 24 24" width="14" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="fd" style={{ fontSize:18, letterSpacing:1 }}>RESCUE<span style={{ color:"#E8001D" }}>234</span></span>
        </a>

        <div className="fm" style={{ display:"flex", alignItems:"center", gap:6, fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(240,237,232,.3)" }}>
          <span className="a-blink" style={{ width:6, height:6, background:"#22c55e", borderRadius:"50%", display:"inline-block" }} />
          System Active
        </div>

        {/* Anonymous badge */}
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:20, padding:"6px 12px" }}>
          <span style={{ color:"rgba(240,237,232,.4)" }}>{Icons.EyeOff}</span>
          <span className="fm" style={{ fontSize:9, letterSpacing:"1px", textTransform:"uppercase", color:"rgba(240,237,232,.5)" }}>Anonymous</span>
        </div>
      </nav>

      {/* ── STEP PROGRESS BAR (not on intro/done) ─────────────────────────── */}
      {step !== "intro" && step !== "done" && step !== "sending" && (
        <div style={{ background:"#0a0a0a", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"16px 32px" }}>
          <div style={{ maxWidth:640, margin:"0 auto" }}>
            {/* Step indicators */}
            <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:16 }}>
              {STEPS.slice(0,3).map((s, i) => {
                const done = stepIndex > i;
                const curr = stepIndex === i;
                return (
                  <div key={s.id} style={{ display:"flex", alignItems:"center", flex: i < 2 ? 1 : "unset" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <div className="step-dot" style={{
                        background: done ? "#E8001D" : curr ? "rgba(232,0,29,.15)" : "rgba(255,255,255,.05)",
                        border: `1px solid ${done || curr ? "#E8001D" : "rgba(255,255,255,.1)"}`,
                        color: done || curr ? (done ? "#fff" : "#E8001D") : "rgba(240,237,232,.3)",
                      }}>
                        {done
                          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={12}><polyline points="20 6 9 17 4 12"/></svg>
                          : <span style={{ opacity: curr ? 1 : .5 }}>{s.icon}</span>
                        }
                      </div>
                      <span className="fm" style={{ fontSize:8, letterSpacing:"1px", textTransform:"uppercase", color: curr ? "#E8001D" : done ? "rgba(240,237,232,.6)" : "rgba(240,237,232,.25)" }}>{s.label}</span>
                    </div>
                    {i < 2 && <div style={{ flex:1, height:1, background: done ? "#E8001D" : "rgba(255,255,255,.08)", margin:"0 8px", marginBottom:18, transition:"background .4s" }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="page-inner" style={{ maxWidth:680, margin:"0 auto", padding:"40px 32px 80px" }}>

        {/* ════════════════════════════════════════════════════════════════
            INTRO
        ════════════════════════════════════════════════════════════════ */}
        {step === "intro" && (
          <div style={{ textAlign:"center" }}>
            <div className="fade-up" style={{ marginBottom:40 }}>
              {/* Pulsing icon */}
              <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", width:96, height:96, marginBottom:28 }}>
                <div className="a-pulse" style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(232,0,29,.3)" }} />
                <div style={{ width:72, height:72, background:"rgba(232,0,29,.12)", border:"1px solid rgba(232,0,29,.35)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E8001D" strokeWidth={1.5} width={30}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
              </div>
              <div className="fm" style={{ fontSize:10, letterSpacing:"3px", textTransform:"uppercase", color:"#E8001D", marginBottom:12 }}>Emergency Report</div>
              <h1 className="fd" style={{ fontSize:"clamp(48px,8vw,80px)", lineHeight:.95, marginBottom:16 }}>
                Report an<br/><span style={{ color:"#E8001D" }}>Accident</span>
              </h1>
              <p style={{ fontSize:16, color:"rgba(240,237,232,.5)", lineHeight:1.8, maxWidth:460, margin:"0 auto" }}>
                You are completely <strong style={{ color:"#f0ede8" }}>anonymous</strong>. No personal details are collected. Just report what you see and help save a life.
              </p>
            </div>

            {/* Reassurance cards */}
            <div className="fade-up-2" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:40 }}>
              {[
                { icon: Icons.Shield,   title:"Anonymous",    desc:"Zero identity data collected. Ever." },
                { icon: Icons.Eye,      title:"Live Only",    desc:"No uploads. Live stream prevents fakes." },
                { icon: Icons.Location, title:"Auto GPS",     desc:"Location captured automatically." },
              ].map(c => (
                <div key={c.title} style={{ background:"#0f0f0f", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, padding:20, textAlign:"left" }}>
                  <div style={{ color:"#E8001D", marginBottom:10 }}>{c.icon}</div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:6 }}>{c.title}</div>
                  <div style={{ fontSize:12, color:"rgba(240,237,232,.4)", lineHeight:1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <div className="fade-up-3">
              <button className="btn-primary a-pulse" onClick={() => { setStep("location"); detectGPS(); }} style={{ fontSize:13, padding:"18px 48px" }}>
                Start Emergency Report {Icons.ArrowRight}
              </button>
              <p className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.2)", letterSpacing:"1px", textTransform:"uppercase", marginTop:16 }}>
                Powered by Gemini AI · Firebase · Google Maps
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            LOCATION
        ════════════════════════════════════════════════════════════════ */}
        {step === "location" && (
          <div className="fade-up">
            <div className="fm" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"#E8001D", marginBottom:12 }}>Step 1 of 3</div>
            <h2 className="fd" style={{ fontSize:"clamp(36px,6vw,60px)", lineHeight:1, marginBottom:8 }}>Your Location</h2>
            <p style={{ fontSize:15, color:"rgba(240,237,232,.45)", marginBottom:36, lineHeight:1.7 }}>
              We capture your GPS coordinates automatically. This helps direct the nearest hospital to the scene.
            </p>

            {/* GPS card */}
            <div style={{ background:"#0f0f0f", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, overflow:"hidden", marginBottom:24 }}>
              {/* Map placeholder */}
              <div style={{ height:200, background:"#0a0a0a", position:"relative", overflow:"hidden" }}>
                <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.12 }} viewBox="0 0 640 200" preserveAspectRatio="none">
                  {[0,40,80,120,160,200].map(y=><line key={y} x1="0" y1={y} x2="640" y2={y} stroke="white" strokeWidth=".5"/>)}
                  {[0,80,160,240,320,400,480,560,640].map(x=><line key={x} x1={x} y1="0" x2={x} y2="200" stroke="white" strokeWidth=".5"/>)}
                </svg>
                {/* Pin */}
                {gps && (
                  <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-100%)" }}>
                    <div style={{ position:"relative" }}>
                      <div className="ping" style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:20, height:20, borderRadius:"50%", background:"#E8001D", opacity:.4 }} />
                      <svg viewBox="0 0 24 24" width="36" fill="#E8001D"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </div>
                  </div>
                )}
                {gpsLoading && (
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
                    <div className="a-spin" style={{ width:28, height:28, border:"2px solid rgba(232,0,29,.3)", borderTop:"2px solid #E8001D", borderRadius:"50%" }} />
                    <span className="fm" style={{ fontSize:9, letterSpacing:"2px", color:"rgba(240,237,232,.4)", textTransform:"uppercase" }}>Detecting location…</span>
                  </div>
                )}
                {!gps && !gpsLoading && (
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ color:"rgba(240,237,232,.2)" }}>{Icons.Location}</span>
                  </div>
                )}
              </div>

              {/* Address row */}
              <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                <div>
                  {gps
                    ? <>
                        <div style={{ fontSize:14, fontWeight:500, marginBottom:4 }}>{gps.address}</div>
                        <div className="fm" style={{ fontSize:9, color:"#22c55e", letterSpacing:"1px", textTransform:"uppercase", display:"flex", alignItems:"center", gap:5 }}>
                          <span className="a-blink" style={{ width:6, height:6, background:"#22c55e", borderRadius:"50%", display:"inline-block" }} />
                          GPS Locked
                        </div>
                      </>
                    : <div style={{ fontSize:14, color:"rgba(240,237,232,.35)" }}>{gpsLoading ? "Acquiring signal…" : "Location not detected"}</div>
                  }
                </div>
                <button
                  onClick={detectGPS}
                  className="fm"
                  style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(240,237,232,.6)", padding:"8px 16px", borderRadius:4, cursor:"pointer", display:"flex", alignItems:"center", gap:6, flexShrink:0, transition:"all .2s" }}
                >
                  {Icons.Refresh} Retry
                </button>
              </div>
            </div>

            {gpsError && (
              <div style={{ background:"rgba(232,0,29,.08)", border:"1px solid rgba(232,0,29,.25)", borderRadius:6, padding:"12px 16px", marginBottom:20 }}>
                <p className="fm" style={{ fontSize:11, color:"#E8001D" }}>{gpsError}</p>
              </div>
            )}

            {/* Privacy note */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:6, padding:"12px 16px", marginBottom:36 }}>
              <span style={{ color:"rgba(240,237,232,.3)", flexShrink:0, marginTop:1 }}>{Icons.Shield}</span>
              <p className="fm" style={{ fontSize:10, color:"rgba(240,237,232,.35)", lineHeight:1.7, letterSpacing:".3px" }}>
                Your GPS coordinates are only used to find the nearest hospital. They are never stored or linked to your identity.
              </p>
            </div>

            <div className="nav-btns" style={{ display:"flex", gap:12 }}>
              <button className="btn-ghost" onClick={goBack}>{Icons.ArrowLeft} Back</button>
              <button className="btn-primary" onClick={goNext} disabled={!canNext.location}>Continue {Icons.ArrowRight}</button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STREAM
        ════════════════════════════════════════════════════════════════ */}
        {step === "stream" && (
          <div className="fade-up">
            <div className="fm" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"#E8001D", marginBottom:12 }}>Step 2 of 3</div>
            <h2 className="fd" style={{ fontSize:"clamp(36px,6vw,60px)", lineHeight:1, marginBottom:8 }}>Live Stream</h2>
            <p style={{ fontSize:15, color:"rgba(240,237,232,.45)", marginBottom:28, lineHeight:1.7 }}>
              Stream the incident live. <strong style={{ color:"#f0ede8" }}>No recording is saved</strong> — live stream only ensures authenticity and prevents fake reports.
            </p>

            {/* Camera viewport */}
            <div style={{ position:"relative", background:"#0a0a0a", borderRadius:10, overflow:"hidden", border:`1px solid ${streaming ? "rgba(232,0,29,.4)" : "rgba(255,255,255,.08)"}`, marginBottom:20, aspectRatio:"16/9" }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width:"100%", height:"100%", objectFit:"cover", display: streaming ? "block" : "none" }}
              />

              {/* Overlay when not streaming */}
              {!streaming && (
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(232,0,29,.1)", border:"1px solid rgba(232,0,29,.25)", display:"flex", alignItems:"center", justifyContent:"center", color:"#E8001D" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={28}><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  </div>
                  <p className="fm" style={{ fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(240,237,232,.35)" }}>Camera inactive</p>
                </div>
              )}

              {/* Scanline when streaming */}
              {streaming && <div className="scanline" />}

              {/* Live badge + timer */}
              {streaming && (
                <>
                  <div style={{ position:"absolute", top:12, left:12, display:"flex", alignItems:"center", gap:6 }}>
                    <div className="fm" style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", background:"#E8001D", color:"#fff", padding:"5px 10px", borderRadius:3, display:"flex", alignItems:"center", gap:5 }}>
                      <span className="a-blink" style={{ width:6, height:6, background:"#fff", borderRadius:"50%", display:"inline-block" }} />
                      LIVE
                    </div>
                    <div className="fm" style={{ fontSize:11, background:"rgba(0,0,0,.6)", backdropFilter:"blur(8px)", padding:"4px 10px", borderRadius:3, color:"#f0ede8" }}>
                      {fmtTime(elapsed)}
                    </div>
                  </div>

                  {/* AI chip */}
                  <div style={{ position:"absolute", top:12, right:12 }}>
                    <div className="ai-chip" style={{ ...SEV_STYLE[severity], fontSize:9, padding:"5px 10px", borderRadius:3, border:`1px solid ${SEV_STYLE[severity].border}` }}>
                      <span className="a-blink" style={{ width:5, height:5, background:SEV_STYLE[severity].color, borderRadius:"50%", display:"inline-block" }} />
                      Gemini: {severity}
                    </div>
                  </div>

                  {/* Corner brackets */}
                  {[["top:8px","left:8px","border-top","border-left"],["top:8px","right:8px","border-top","border-right"],["bottom:8px","left:8px","border-bottom","border-left"],["bottom:8px","right:8px","border-bottom","border-right"]].map((_, i) => (
                    <div key={i} style={{ position:"absolute", width:16, height:16,
                      top:    i<2 ? 8 : "auto", bottom: i>=2 ? 8 : "auto",
                      left:   i%2===0 ? 8 : "auto", right: i%2===1 ? 8 : "auto",
                      borderTop:    i<2  ? "2px solid rgba(232,0,29,.6)" : "none",
                      borderBottom: i>=2 ? "2px solid rgba(232,0,29,.6)" : "none",
                      borderLeft:   i%2===0 ? "2px solid rgba(232,0,29,.6)" : "none",
                      borderRight:  i%2===1 ? "2px solid rgba(232,0,29,.6)" : "none",
                    }} />
                  ))}

                  {/* GPS overlay */}
                  <div style={{ position:"absolute", bottom:12, left:12, background:"rgba(0,0,0,.65)", backdropFilter:"blur(8px)", borderRadius:4, padding:"5px 10px", display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ color:"#E8001D" }}>{Icons.Location}</span>
                    <span className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.8)" }}>{gps?.address ?? "Locating…"}</span>
                  </div>
                </>
              )}

              {cameraError && (
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
                  <div style={{ background:"rgba(232,0,29,.1)", border:"1px solid rgba(232,0,29,.3)", borderRadius:6, padding:20, textAlign:"center" }}>
                    <p className="fm" style={{ fontSize:11, color:"#E8001D", lineHeight:1.7 }}>{cameraError}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stream controls */}
            <div style={{ display:"flex", gap:12, marginBottom:24 }}>
              {!streaming
                ? <button className="btn-primary" onClick={startStream} style={{ flex:1, justifyContent:"center" }}>
                    {Icons.Camera} Start Live Stream
                  </button>
                : <button onClick={stopStream} className="fm"
                    style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:11, letterSpacing:"2px", textTransform:"uppercase", background:"rgba(232,0,29,.1)", border:"1px solid rgba(232,0,29,.3)", color:"#E8001D", padding:"14px 24px", cursor:"pointer", borderRadius:0, transition:"all .2s" }}>
                    {Icons.Stop} Stop Stream
                  </button>
              }
            </div>

            {/* Privacy note */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:6, padding:"12px 16px", marginBottom:32 }}>
              <span style={{ color:"rgba(240,237,232,.3)", flexShrink:0, marginTop:1 }}>{Icons.Shield}</span>
              <p className="fm" style={{ fontSize:10, color:"rgba(240,237,232,.35)", lineHeight:1.7 }}>
                Live stream is transmitted directly to the emergency responder. No video is saved to any server.
              </p>
            </div>

            <div className="nav-btns" style={{ display:"flex", gap:12 }}>
              <button className="btn-ghost" onClick={goBack}>{Icons.ArrowLeft} Back</button>
              <button className="btn-primary" onClick={goNext} disabled={!canNext.stream}>Continue {Icons.ArrowRight}</button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            DETAILS
        ════════════════════════════════════════════════════════════════ */}
        {step === "details" && (
          <div className="fade-up">
            <div className="fm" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"#E8001D", marginBottom:12 }}>Step 3 of 3</div>
            <h2 className="fd" style={{ fontSize:"clamp(36px,6vw,60px)", lineHeight:1, marginBottom:8 }}>Incident Details</h2>
            <p style={{ fontSize:15, color:"rgba(240,237,232,.45)", marginBottom:32, lineHeight:1.7 }}>
              A few quick details help hospitals prepare the right resources before you arrive.
            </p>

            {/* AI severity badge */}
            {severity !== "UNKNOWN" && (
              <div className="fade-up" style={{ background: SEV_STYLE[severity].bg, border:`1px solid ${SEV_STYLE[severity].border}`, borderRadius:6, padding:"12px 16px", marginBottom:28, display:"flex", alignItems:"center", gap:10 }}>
                <div className="a-blink" style={{ width:8, height:8, borderRadius:"50%", background: SEV_STYLE[severity].color, flexShrink:0 }} />
                <div>
                  <span className="fm" style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", color: SEV_STYLE[severity].color }}>Gemini AI Assessment: {severity}</span>
                  <p style={{ fontSize:12, color:"rgba(240,237,232,.45)", marginTop:2 }}>AI has analyzed your live stream and pre-assessed the situation. You can still update below.</p>
                </div>
              </div>
            )}

            {/* Incident type */}
            <div style={{ marginBottom:28 }}>
              <div className="fm" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(240,237,232,.4)", marginBottom:14 }}>Incident Type *</div>
              <div className="type-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                {INCIDENT_TYPES.map(t => (
                  <div key={t.id} className={`type-card${incidentType===t.id?" selected":""}`} onClick={() => setIncidentType(t.id)}>
                    <div style={{ color: incidentType===t.id ? "#E8001D" : "rgba(240,237,232,.5)" }}>{t.icon}</div>
                    <span style={{ fontSize:12, fontWeight:500, color: incidentType===t.id ? "#f0ede8" : "rgba(240,237,232,.6)", lineHeight:1.4 }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Victim count */}
            <div style={{ marginBottom:28 }}>
              <div className="fm" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(240,237,232,.4)", marginBottom:14 }}>Estimated Victims</div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <button className="counter-btn" onClick={() => setVictims(v => Math.max(1,v-1))}>−</button>
                <div style={{ textAlign:"center", minWidth:60 }}>
                  <div className="fd" style={{ fontSize:52, lineHeight:1, color: victims >= 4 ? "#E8001D" : "#f0ede8" }}>{victims}</div>
                  <div className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.35)", textTransform:"uppercase", letterSpacing:"1px" }}>{victims===1?"person":"people"}</div>
                </div>
                <button className="counter-btn" onClick={() => setVictims(v => Math.min(20,v+1))}>+</button>
                {victims >= 4 && (
                  <div className="fm" style={{ fontSize:9, letterSpacing:"1px", textTransform:"uppercase", color:"#E8001D", background:"rgba(232,0,29,.1)", border:"1px solid rgba(232,0,29,.25)", borderRadius:4, padding:"4px 10px" }}>
                    Mass Casualty
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom:36 }}>
              <div className="fm" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(240,237,232,.4)", marginBottom:14 }}>Additional Notes <span style={{ opacity:.5 }}>(optional)</span></div>
              <textarea
                className="textarea-field"
                rows={4}
                placeholder="e.g. Multiple vehicles involved, one person trapped, fire visible..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <div className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.2)", marginTop:6, textAlign:"right" }}>{notes.length}/300</div>
            </div>

            {/* Summary card */}
            <div style={{ background:"#0f0f0f", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:20, marginBottom:32 }}>
              <div className="fm" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(240,237,232,.3)", marginBottom:14 }}>Report Summary</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { label:"Location",  val: gps?.address ?? "—" },
                  { label:"Type",      val: INCIDENT_TYPES.find(t=>t.id===incidentType)?.label ?? "—" },
                  { label:"Victims",   val: `${victims} ${victims===1?"person":"people"}` },
                  { label:"AI Sev.",   val: severity },
                  { label:"Stream",    val: streamReady ? "Active ✓" : "Not started" },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, paddingBottom:10, borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                    <span className="fm" style={{ fontSize:10, color:"rgba(240,237,232,.35)", letterSpacing:"1px", textTransform:"uppercase", flexShrink:0 }}>{r.label}</span>
                    <span style={{ fontSize:13, fontWeight:400, textAlign:"right", color: r.label==="AI Sev." ? SEV_STYLE[severity].color : "#f0ede8" }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="nav-btns" style={{ display:"flex", gap:12 }}>
              <button className="btn-ghost" onClick={goBack}>{Icons.ArrowLeft} Back</button>
              <button className="btn-primary" onClick={goNext} disabled={!canNext.details} style={{ flex:1, justifyContent:"center" }}>
                {Icons.Send} Send Emergency Report
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SENDING
        ════════════════════════════════════════════════════════════════ */}
        {step === "sending" && (
          <div className="fade-up" style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ marginBottom:40 }}>
              <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", width:100, height:100, marginBottom:28 }}>
                <div className="a-pulse" style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(232,0,29,.3)" }} />
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(232,0,29,.15)" strokeWidth="3"/>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#E8001D" strokeWidth="3"
                    strokeDasharray={`${2*Math.PI*34}`}
                    strokeDashoffset={`${2*Math.PI*34*(1-sendProgress/100)}`}
                    strokeLinecap="round"
                    style={{ transformOrigin:"center", transform:"rotate(-90deg)", transition:"stroke-dashoffset .15s ease" }}
                  />
                  <text x="40" y="44" textAnchor="middle" fontFamily="'Bebas Neue'" fontSize="22" fill="#f0ede8">{sendProgress}%</text>
                </svg>
              </div>

              <div className="fd" style={{ fontSize:40, marginBottom:8 }}>Sending Report</div>
              <p style={{ fontSize:14, color:"rgba(240,237,232,.45)", lineHeight:1.8 }}>
                Alerting nearest hospital and dispatching responders…
              </p>
            </div>

            {/* Progress steps */}
            <div style={{ background:"#0f0f0f", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, padding:24, textAlign:"left", maxWidth:400, margin:"0 auto" }}>
              {[
                { label:"Encrypting report data",     done: sendProgress >= 20  },
                { label:"Locating nearest hospital",  done: sendProgress >= 45  },
                { label:"Transmitting live stream",   done: sendProgress >= 65  },
                { label:"Alerting emergency team",    done: sendProgress >= 80  },
                { label:"Dispatching ambulance",      done: sendProgress >= 95  },
              ].map(s => (
                <div key={s.label} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                    background: s.done ? "rgba(34,197,94,.15)" : "rgba(255,255,255,.05)",
                    border: `1px solid ${s.done ? "rgba(34,197,94,.4)" : "rgba(255,255,255,.1)"}`,
                    transition:"all .3s",
                  }}>
                    {s.done
                      ? <svg viewBox="0 0 12 12" width="10" fill="none" stroke="#22c55e" strokeWidth={2}><polyline points="10 3 5 9 2 6"/></svg>
                      : <div className="a-spin" style={{ width:8, height:8, border:"1.5px solid rgba(255,255,255,.2)", borderTop:"1.5px solid rgba(240,237,232,.6)", borderRadius:"50%" }} />
                    }
                  </div>
                  <span style={{ fontSize:13, color: s.done ? "rgba(240,237,232,.8)" : "rgba(240,237,232,.35)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            DONE
        ════════════════════════════════════════════════════════════════ */}
        {step === "done" && (
          <div className="fade-up" style={{ textAlign:"center", padding:"40px 0" }}>
            {/* Success ring */}
            <div className="a-success" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:96, height:96, borderRadius:"50%", background:"rgba(34,197,94,.12)", border:"2px solid rgba(34,197,94,.4)", marginBottom:28, color:"#22c55e" }}>
              {Icons.Check}
            </div>

            <div className="fd fade-up-2" style={{ fontSize:"clamp(40px,7vw,72px)", lineHeight:.95, marginBottom:12 }}>
              Help is<br/><span style={{ color:"#E8001D" }}>On Its Way</span>
            </div>
            <p className="fade-up-3" style={{ fontSize:16, color:"rgba(240,237,232,.5)", lineHeight:1.8, maxWidth:420, margin:"0 auto 36px" }}>
              Your report has been received. The nearest hospital has been alerted and a response team is being dispatched.
            </p>

            {/* Hospital card */}
            <div className="fade-up-3" style={{ background:"#0f0f0f", border:"1px solid rgba(34,197,94,.2)", borderRadius:10, padding:24, maxWidth:420, margin:"0 auto 28px", textAlign:"left" }}>
              <div className="fm" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(240,237,232,.3)", marginBottom:16 }}>Nearest Hospital Alerted</div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                <div style={{ width:44, height:44, background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.25)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#22c55e", flexShrink:0 }}>
                  {Icons.Hospital}
                </div>
                <div>
                  <div style={{ fontSize:16, fontWeight:600 }}>LUTH Emergency Unit</div>
                  <div className="fm" style={{ fontSize:10, color:"rgba(240,237,232,.4)", marginTop:2 }}>2.1 km away · Estimated 4 min</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  { label:"Report ID",  val:"#R-00247" },
                  { label:"Severity",   val: severity },
                  { label:"Victims",    val:`${victims}` },
                  { label:"Response",   val:"<4 min ETA" },
                ].map(r => (
                  <div key={r.label} style={{ background:"rgba(255,255,255,.03)", borderRadius:6, padding:"10px 14px" }}>
                    <div className="fm" style={{ fontSize:8, letterSpacing:"1px", color:"rgba(240,237,232,.3)", textTransform:"uppercase", marginBottom:4 }}>{r.label}</div>
                    <div style={{ fontSize:14, fontWeight:500, color: r.label==="Severity" ? SEV_STYLE[severity].color : "#f0ede8" }}>{r.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div className="fade-up-4" style={{ background:"rgba(232,0,29,.06)", border:"1px solid rgba(232,0,29,.15)", borderRadius:8, padding:20, maxWidth:420, margin:"0 auto 36px", textAlign:"left" }}>
              <div className="fm" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"#E8001D", marginBottom:12 }}>While you wait</div>
              {[
                "Keep a safe distance from the scene.",
                "Do not move injured persons unless there is immediate danger.",
                "Keep streaming if it is safe to do so.",
                "Stay on the line if a responder calls.",
              ].map((tip, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:8 }}>
                  <span className="fm" style={{ fontSize:10, color:"rgba(232,0,29,.6)", flexShrink:0, marginTop:2 }}>{i+1}.</span>
                  <span style={{ fontSize:13, color:"rgba(240,237,232,.6)", lineHeight:1.6 }}>{tip}</span>
                </div>
              ))}
            </div>

            <div className="fade-up-4" style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <button className="btn-primary" onClick={reset}>Report Another Emergency</button>
              <a href="/" className="btn-ghost" style={{ textDecoration:"none", display:"inline-flex", alignItems:"center", gap:10 }}>Back to Home</a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}