"use client";

import Link from "next/link";
import { useEffect } from "react";

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────
function Cursor() {
  useEffect(() => {
    const cursor = document.getElementById("cursor")!;
    const ring = document.getElementById("cursor-ring")!;
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
    };

    const raf = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(raf);
    };

    document.addEventListener("mousemove", onMove);
    requestAnimationFrame(raf);

    const enter = () => { cursor.style.width = "20px"; cursor.style.height = "20px"; ring.style.width = "52px"; ring.style.height = "52px"; };
    const leave = () => { cursor.style.width = "12px"; cursor.style.height = "12px"; ring.style.width = "36px"; ring.style.height = "36px"; };
    document.querySelectorAll("a,button").forEach(el => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });

    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div id="cursor" style={{ position:"fixed", width:12, height:12, background:"#E8001D", borderRadius:"50%", pointerEvents:"none", zIndex:9999, transform:"translate(-50%,-50%)", transition:"width .2s,height .2s" }} />
      <div id="cursor-ring" style={{ position:"fixed", width:36, height:36, border:"1px solid rgba(232,0,29,.5)", borderRadius:"50%", pointerEvents:"none", zIndex:9998, transform:"translate(-50%,-50%)", transition:"width .25s,height .25s" }} />
    </>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const problems = [
  { num:"01", title:"Fear Prevents Action", desc:"Witnesses avoid reporting accidents out of fear — fear of police involvement, legal consequences, and being held responsible. Victims suffer while bystanders hesitate." },
  { num:"02", title:"Slow Emergency Response", desc:"Poor coordination between citizens and hospitals means critical time is lost. Without a fast reporting system, ambulances and responders are often the last to know." },
  { num:"03", title:"No Verified Reporting", desc:"Existing report systems are prone to fake alerts. Static images and pre-recorded video are easily fabricated, wasting resources and eroding trust with responders." },
  { num:"04", title:"Zero Victim Visibility", desc:"Hospitals have no real-time awareness of incoming emergencies. They react rather than prepare — and in life-threatening situations, preparation is everything." },
];

const steps = [
  { num:"01", title:"Witness Opens Rescue234", desc:"Any person who sees an accident opens the platform instantly — no account required, no registration, completely anonymous.", tags:[{l:"Anonymous",r:true},{l:"Next.js"},{l:"No Login"}] },
  { num:"02", title:"GPS Location Captured", desc:"The system automatically detects the user's precise GPS coordinates. No manual input needed — location is captured the moment reporting begins.", tags:[{l:"Auto-Location",r:true},{l:"Google Maps API"}] },
  { num:"03", title:"Live Camera Streaming Begins", desc:"The witness streams the incident live — no uploads, no recordings. Live-only streaming ensures authenticity and prevents fake reports from flooding the system.", tags:[{l:"Live Only",r:true},{l:"WebRTC"},{l:"Anti-Fake"}] },
  { num:"04", title:"AI Analyzes Severity", desc:"Gemini AI processes the live stream in real time, assessing emergency severity, number of victims, and contextual danger to prioritize the response accurately.", tags:[{l:"Gemini AI",r:true},{l:"Real-Time"},{l:"Triage"}] },
  { num:"05", title:"Nearest Hospital Alerted Instantly", desc:"The closest registered hospital receives an instant alert with live location, stream access, and AI severity analysis — ready before the ambulance even departs.", tags:[{l:"Instant Alert",r:true},{l:"Firebase"},{l:"Dashboard"}] },
];

const features = [
  { title:"Anonymous Reporting", desc:"No registration. No identity. No fear. Anyone can report an emergency without ever revealing who they are.", icon:<svg viewBox="0 0 24 24" width="22" stroke="#E8001D" fill="none" strokeWidth={1.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { title:"Live Streaming Only", desc:"No file uploads. Live camera only — so every report is verifiable, real-time, and impossible to fabricate with pre-recorded footage.", icon:<svg viewBox="0 0 24 24" width="22" stroke="#E8001D" fill="none" strokeWidth={1.5}><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg> },
  { title:"Auto GPS Detection", desc:"Precise location is captured automatically the moment reporting starts. No manual entry, no delay — just instant coordinates.", icon:<svg viewBox="0 0 24 24" width="22" stroke="#E8001D" fill="none" strokeWidth={1.5}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { title:"AI Severity Analysis", desc:"Gemini AI analyzes each live stream in real time, assessing threat level, estimated victims, and required emergency resources.", icon:<svg viewBox="0 0 24 24" width="22" stroke="#E8001D" fill="none" strokeWidth={1.5}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { title:"Hospital Dashboard", desc:"Registered hospitals get a real-time alert dashboard — viewing live streams, GPS data, AI analysis, and routing before the patient arrives.", icon:<svg viewBox="0 0 24 24" width="22" stroke="#E8001D" fill="none" strokeWidth={1.5}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { title:"Seconds, Not Minutes", desc:"The entire pipeline — report, stream, analyze, alert — happens in seconds. In emergencies, every second is the difference between life and death.", icon:<svg viewBox="0 0 24 24" width="22" stroke="#E8001D" fill="none" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
];

const stats = [
  { num:"<30s", label:"Hospital Alert Time" },
  { num:"0",    label:"Identity Exposed" },
  { num:"100%", label:"Live Stream Verified" },
  { num:"AI",   label:"Powered Triage" },
];

const tickerItems = ["Anonymous Reporting","Live GPS Tracking","AI Severity Analysis","Real-Time Hospital Alerts","Zero Fear Barrier","Gemini AI Powered"];
const techStack   = ["Next.js","TypeScript","Firebase","Gemini AI","Google Maps API","WebRTC"];

// ─── Shared style helpers ─────────────────────────────────────────────────────
const R = "#E8001D";
const styles: Record<string, React.CSSProperties> = {
  btnPrimary:   { fontFamily:"'Space Mono',monospace", fontSize:12, letterSpacing:"2px", textTransform:"uppercase", background:R, color:"#fff", padding:"18px 40px", textDecoration:"none", display:"inline-block", border:"none", cursor:"none", transition:"all .2s" },
  btnSecondary: { fontFamily:"'Space Mono',monospace", fontSize:12, letterSpacing:"2px", textTransform:"uppercase", background:"transparent", color:"rgba(245,245,240,.45)", border:"1px solid rgba(255,255,255,.07)", padding:"18px 40px", textDecoration:"none", display:"inline-block", cursor:"none", transition:"all .2s" },
  tag:          { fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", border:"1px solid rgba(255,255,255,.07)", padding:"6px 12px", color:"rgba(245,245,240,.45)" },
  tagRed:       { fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", border:"1px solid rgba(232,0,29,.4)", padding:"6px 12px", color:R },
  sectionLabel: { fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"3px", textTransform:"uppercase", color:R, display:"flex", alignItems:"center", gap:12, marginBottom:60 },
  monoSm:       { fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(245,245,240,.45)" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  useScrollReveal();

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background:#080808; color:#f5f5f0; font-family:'DM Sans',sans-serif; font-weight:300; overflow-x:hidden; cursor:none; }

        body::before { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events:none; z-index:9997; opacity:.5; }

        .fd { font-family:'Bebas Neue',sans-serif; }
        .fm { font-family:'Space Mono',monospace; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseIcon{ 0%,100%{box-shadow:0 0 0 0 rgba(232,0,29,.6)} 50%{box-shadow:0 0 0 8px rgba(232,0,29,0)} }
        @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes pulseRing{ 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:.4} }
        @keyframes pulseBtn { 0%,100%{box-shadow:0 0 0 0 rgba(232,0,29,.5)} 50%{box-shadow:0 0 0 8px rgba(232,0,29,0)} }
        @keyframes orbitGlow{ 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-52%) scale(1.1)} }

        .au1{opacity:0;animation:fadeUp .7s .2s forwards}
        .au2{opacity:0;animation:fadeUp .8s .35s forwards}
        .au3{opacity:0;animation:fadeUp .8s .5s forwards}
        .au4{opacity:0;animation:fadeUp .8s .7s forwards}
        .a-pulse-icon{animation:pulseIcon 2s infinite}
        .a-ticker{animation:ticker 20s linear infinite}
        .a-blink{animation:blink 1s infinite}
        .a-pulse-ring{animation:pulseRing 1.5s infinite}
        .a-pulse-btn{animation:pulseBtn 2s infinite}
        .a-orbit{animation:orbitGlow 4s ease-in-out infinite}

        .reveal{opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease}
        .reveal.visible{opacity:1;transform:translateY(0)}

        .hero-grid::after{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:60px 60px;pointer-events:none}

        .prob-card{position:relative;overflow:hidden;padding:48px;border:1px solid rgba(255,255,255,.07);background:#131313;transition:border-color .3s}
        .prob-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:#E8001D;transition:height .4s ease}
        .prob-card:hover{border-color:rgba(232,0,29,.3)}
        .prob-card:hover::before{height:100%}

        .feat-card{background:#080808;padding:48px 40px;transition:background .3s;position:relative;overflow:hidden}
        .feat-card:hover{background:#131313}

        .stat-card{position:relative;overflow:hidden;padding:48px 40px;background:#131313;border:1px solid rgba(255,255,255,.07)}
        .stat-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#E8001D;transform:scaleX(0);transform-origin:left;transition:transform .4s ease}
        .stat-card:hover::after{transform:scaleX(1)}

        .step{padding:40px 0;border-bottom:1px solid rgba(255,255,255,.07);transition:background .3s;display:grid;grid-template-columns:80px 1fr auto;gap:40px;align-items:center}
        .step:first-child{border-top:1px solid rgba(255,255,255,.07)}
        .step:hover{background:rgba(255,255,255,.02)}

        .stroke-faint{color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.1)}

        .nav-link{font-family:'Space Mono',monospace;font-size:11px;color:rgba(245,245,240,.45);text-decoration:none;letter-spacing:1.5px;text-transform:uppercase;transition:color .2s}
        .nav-link:hover{color:#f5f5f0}

        @media(max-width:768px){
          .nav-links{display:none!important}
          .hero-stat-bg{display:none!important}
          .hero-sub{flex-direction:column!important;align-items:flex-start!important}
          .hero-actions{align-items:flex-start!important}
          .prob-grid{grid-template-columns:1fr!important}
          .feat-grid{grid-template-columns:1fr!important}
          .stats-grid{grid-template-columns:1fr 1fr!important}
          .demo-grid{grid-template-columns:1fr!important}
          .step{grid-template-columns:60px 1fr!important}
          .step-tags{display:none!important}
          .tech-inner{flex-direction:column!important;align-items:flex-start!important;gap:24px!important}
          .footer-inner{flex-direction:column!important;text-align:center!important}
          .cta-btns{flex-direction:column!important;align-items:center!important}
          section,div.tech{padding-left:24px!important;padding-right:24px!important}
        }
      `}</style>

      <Cursor />

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 48px", borderBottom:"1px solid rgba(255,255,255,.07)", backdropFilter:"blur(20px)", background:"rgba(8,8,8,.8)" }}>
        <a href="#" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div className="fd a-pulse-icon" style={{ width:32, height:32, background:R, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg viewBox="0 0 24 24" width="18" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="fd" style={{ fontSize:22, letterSpacing:1, color:"#f5f5f0" }}>RESCUE<span style={{ color:R }}>234</span></span>
        </a>
        <ul className="nav-links" style={{ display:"flex", gap:36, listStyle:"none" }}>
          {["Problem","How It Works","Features","Impact"].map(n => (
            <li key={n}><a href={`#${n.toLowerCase().replace(/\s+/g,"")}`} className="nav-link">{n}</a></li>
          ))}
        </ul>
        <Link href="/report">
          <button className="fm" style={{ fontSize:11, letterSpacing:"1.5px", textTransform:"uppercase", background:R, color:"#fff", border:"none", padding:"10px 22px", cursor:"none", transition:"all .2s" }}
            onMouseEnter={e=>(e.currentTarget.style.background="#ff0022")}
            onMouseLeave={e=>(e.currentTarget.style.background=R)}>
            Report Emergency
          </button>
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-grid" id="home" style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"140px 48px 80px", overflow:"hidden" }}>
        <div className="fm au1" style={{ fontSize:11, letterSpacing:"3px", textTransform:"uppercase", color:R, display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
          <span style={{ display:"inline-block", width:24, height:1, background:R }} />
          Nigeria Emergency Response Platform
        </div>
        <h1 className="fd au2" style={{ fontSize:"clamp(72px,12vw,180px)", lineHeight:.9, letterSpacing:-1, marginBottom:40 }}>
          Every Second<br/><em style={{ fontStyle:"normal", color:R, display:"block" }}>Saves Lives</em>
        </h1>
        <div className="au3 hero-sub" style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:40 }}>
          <p style={{ maxWidth:440, fontSize:17, lineHeight:1.7, color:"rgba(245,245,240,.45)", fontWeight:300 }}>
            <strong style={{ color:"#f5f5f0", fontWeight:500 }}>Rescue234</strong> connects accident witnesses to the nearest hospitals in seconds — anonymously, instantly, and powered by AI. No fear. No delay. Just help.
          </p>
          <div className="hero-actions" style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12 }}>
            <Link href="/dashboard" style={styles.btnPrimary}
              onMouseEnter={e=>{ (e.currentTarget as HTMLAnchorElement).style.background="#ff0022"; (e.currentTarget as HTMLAnchorElement).style.boxShadow="0 12px 40px rgba(232,0,29,.35)"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLAnchorElement).style.background=R; (e.currentTarget as HTMLAnchorElement).style.boxShadow="none"; }}>
              Dashboard →
            </Link>
            <a href="#howitworks" style={styles.btnSecondary}
              onMouseEnter={e=>{ (e.currentTarget as HTMLAnchorElement).style.color="#f5f5f0"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,.2)"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLAnchorElement).style.color="rgba(245,245,240,.45)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,.07)"; }}>
              See How It Works
            </a>
          </div>
        </div>
        <div className="au4 hero-stat-bg" style={{ position:"absolute", right:48, top:"50%", transform:"translateY(-50%)", textAlign:"right" }}>
          <div className="fd stroke-faint" style={{ fontSize:100, lineHeight:1 }}>234</div>
          <div style={styles.monoSm}>Nigeria Country Code</div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background:R, padding:"12px 0", overflow:"hidden", whiteSpace:"nowrap" }}>
        <div className="a-ticker fm" style={{ display:"inline-block" }}>
          {[...tickerItems,...tickerItems].map((item,i) => (
            <span key={i} style={{ fontSize:11, letterSpacing:"3px", textTransform:"uppercase", color:"#fff", padding:"0 48px" }}>✦&nbsp;&nbsp;&nbsp;&nbsp;{item}</span>
          ))}
        </div>
      </div>

      {/* ── PROBLEM ── */}
      <section id="problem" style={{ padding:"120px 48px" }}>
        <div style={styles.sectionLabel}>The Problem<span style={{ flex:1, height:1, background:"rgba(255,255,255,.07)", maxWidth:80 }}/></div>
        <div className="reveal prob-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
          {problems.map(p => (
            <div key={p.num} className="prob-card">
              <div className="fd stroke-faint" style={{ fontSize:56, lineHeight:1, marginBottom:20 }}>{p.num}</div>
              <div style={{ fontSize:18, fontWeight:500, marginBottom:12 }}>{p.title}</div>
              <p style={{ fontSize:14, color:"rgba(245,245,240,.45)", lineHeight:1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="howitworks" style={{ padding:"120px 48px", background:"#0f0f0f" }}>
        <div style={styles.sectionLabel}>How It Works<span style={{ flex:1, height:1, background:"rgba(255,255,255,.07)", maxWidth:80 }}/></div>
        <h2 className="fd reveal" style={{ fontSize:"clamp(48px,6vw,96px)", lineHeight:1, marginBottom:80 }}>
          Report. Stream. <span style={{ color:R }}>Rescue.</span>
        </h2>
        <div>
          {steps.map((s,i) => (
            <div key={s.num} className="reveal step" style={i===0?{borderTop:"1px solid rgba(255,255,255,.07)"}:{}}>
              <div className="fd" style={{ fontSize:64, lineHeight:1, color:R }}>{s.num}</div>
              <div>
                <h3 style={{ fontSize:22, fontWeight:500, marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:"rgba(245,245,240,.45)", lineHeight:1.7 }}>{s.desc}</p>
              </div>
              <div className="step-tags" style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"flex-end" }}>
                {s.tags.map(t => <span key={t.l} style={t.r ? styles.tagRed : styles.tag}>{t.l}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:"120px 48px" }}>
        <div style={styles.sectionLabel}>Core Features<span style={{ flex:1, height:1, background:"rgba(255,255,255,.07)", maxWidth:80 }}/></div>
        <div className="reveal feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.07)" }}>
          {features.map(f => (
            <div key={f.title} className="feat-card">
              <div style={{ width:48, height:48, background:"rgba(232,0,29,.18)", border:"1px solid rgba(232,0,29,.25)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>{f.icon}</div>
              <div style={{ fontSize:18, fontWeight:500, marginBottom:12 }}>{f.title}</div>
              <p style={{ fontSize:14, color:"rgba(245,245,240,.45)", lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO ── */}
      <section id="demo" style={{ padding:"120px 48px", background:"#131313" }}>
        <div className="demo-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          <div className="reveal">
            <div style={styles.sectionLabel}>Live Experience<span style={{ flex:1, height:1, background:"rgba(255,255,255,.07)", maxWidth:80 }}/></div>
            <h2 className="fd" style={{ fontSize:"clamp(48px,5vw,80px)", lineHeight:1, marginBottom:24 }}>Report in <span style={{ color:R }}>Real Time</span></h2>
            <p style={{ fontSize:16, color:"rgba(245,245,240,.45)", lineHeight:1.8, marginBottom:40 }}>Open the platform, stream live, and let Rescue234 handle the rest. No account, no uploads, no hesitation. Just tap and stream — your identity stays protected while help is dispatched.</p>
            <Link href="/dashboard" style={styles.btnPrimary}
              onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background="#ff0022"}
              onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background=R}>
              Try the Platform →
            </Link>
          </div>

          {/* Phone */}
          <div className="reveal" style={{ display:"flex", justifyContent:"center", position:"relative" }}>
            <div className="a-orbit" style={{ position:"absolute", width:300, height:300, background:"radial-gradient(circle,rgba(232,0,29,.12),transparent 70%)", top:"50%", left:"50%", pointerEvents:"none" }} />
            <div style={{ width:280, background:"#0a0a0a", border:"1px solid rgba(255,255,255,.12)", borderRadius:32, padding:16, boxShadow:"0 40px 100px rgba(0,0,0,.7)" }}>
              <div style={{ width:80, height:24, background:"#000", borderRadius:"0 0 16px 16px", margin:"0 auto 12px" }} />
              <div style={{ background:"#0f0f0f", borderRadius:20, padding:20, minHeight:480, display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span className="fd" style={{ fontSize:18, letterSpacing:1 }}>RESCUE<span style={{ color:R }}>234</span></span>
                  <div className="fm" style={{ fontSize:9, letterSpacing:1, background:R, color:"#fff", padding:"4px 8px", display:"flex", alignItems:"center", gap:5 }}>
                    <span className="a-blink" style={{ width:6, height:6, background:"#fff", borderRadius:"50%", display:"inline-block" }} /> LIVE
                  </div>
                </div>
                <div style={{ background:"#1a1a1a", borderRadius:12, height:160, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(232,0,29,.2)" }}>
                  <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 30% 40%,rgba(232,0,29,.08),transparent 60%)" }} />
                  <div style={{ opacity:.3 }}><svg viewBox="0 0 24 24" width="32" stroke="white" fill="none" strokeWidth={1}><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></div>
                  <div className="a-pulse-ring" style={{ position:"absolute", top:10, right:10, width:20, height:20, border:"2px solid #E8001D", borderRadius:"50%" }} />
                </div>
                <div style={{ background:"rgba(232,0,29,.08)", border:"1px solid rgba(232,0,29,.2)", borderRadius:8, padding:12, display:"flex", alignItems:"center", gap:10 }}>
                  <svg viewBox="0 0 24 24" width="16" stroke={R} fill="none" strokeWidth={1.5} style={{ flexShrink:0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div className="fm" style={{ fontSize:10, color:"rgba(245,245,240,.45)" }}>
                    <strong style={{ display:"block", fontSize:11, color:"#f5f5f0" }}>6.5244° N, 3.3792° E</strong>
                    Lagos Mainland, Nigeria
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {["Gemini AI","Severity: HIGH","Alerting..."].map(c => (
                    <div key={c} className="fm" style={{ fontSize:9, letterSpacing:1, color:"rgba(245,245,240,.45)", border:"1px solid rgba(255,255,255,.07)", padding:"4px 8px" }}>{c}</div>
                  ))}
                </div>
                <Link href="/report">
                <button className="fd a-pulse-btn" style={{ background:R, border:"none", borderRadius:8, padding:16, fontSize:18, letterSpacing:2, color:"#fff", cursor:"none" }}>
                  STREAM EMERGENCY
                </button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section id="impact" style={{ padding:"120px 48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-200, left:-200, width:600, height:600, background:"radial-gradient(circle,rgba(232,0,29,.06),transparent 70%)", pointerEvents:"none" }} />
        <h2 className="fd reveal" style={{ fontSize:"clamp(48px,6vw,96px)", lineHeight:1, marginBottom:80, maxWidth:700 }}>
          Built to <span style={{ color:R }}>Save</span> Nigerian Lives
        </h2>
        <div className="reveal stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div className="fd" style={{ fontSize:64, lineHeight:1, color:R, marginBottom:8 }}>{s.num}</div>
              <div style={styles.monoSm}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

     

      {/* ── CTA ── */}
      <section style={{ padding:"160px 48px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%,rgba(232,0,29,.08),transparent 70%)", pointerEvents:"none" }} />
        <div className="fm" style={{ fontSize:11, letterSpacing:"3px", textTransform:"uppercase", color:R, marginBottom:24 }}>Join the Mission</div>
        <h2 className="fd" style={{ fontSize:"clamp(60px,8vw,130px)", lineHeight:.95, marginBottom:40 }}>
          Don&apos;t Wait.<em style={{ fontStyle:"normal", display:"block", color:R }}>Rescue Now.</em>
        </h2>
        <p style={{ fontSize:16, color:"rgba(245,245,240,.45)", maxWidth:480, margin:"0 auto 60px", lineHeight:1.8 }}>
          Every accident has a critical window. Rescue234 exists to make sure that window is never wasted because someone was afraid to report.
        </p>
        <div className="cta-btns" style={{ display:"flex", gap:16, justifyContent:"center" }}>
          <Link href="/report" style={styles.btnPrimary}
            onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background="#ff0022"}
            onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background=R}>
            Report an Emergency →
          </Link>
          <a href="#" style={styles.btnSecondary}
            onMouseEnter={e=>{ (e.currentTarget as HTMLAnchorElement).style.color="#f5f5f0"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,.2)"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLAnchorElement).style.color="rgba(245,245,240,.45)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,.07)"; }}>
            Register Your Hospital
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-inner" style={{ borderTop:"1px solid rgba(255,255,255,.07)", padding:48, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div className="fd" style={{ fontSize:20, letterSpacing:1 }}>RESCUE<span style={{ color:R }}>234</span></div>
        <div style={styles.monoSm}>© 2025 Rescue234. Built for Nigeria.</div>
        <div className="fm" style={{ fontSize:10, letterSpacing:1, color:"rgba(245,245,240,.45)", textAlign:"right" }}>
          <strong style={{ color:R, display:"block", fontSize:12 }}>Every Second Matters.</strong>
          Saving Lives Through Technology
        </div>
      </footer>
    </>
  );
}