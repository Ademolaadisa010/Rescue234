"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavItem = { id: string; label: string; icon: React.ReactNode; badge?: number };
type Alert   = { id: string; severity: "CRITICAL" | "HIGH" | "MODERATE"; location: string; time: string; victims: number; status: "INCOMING" | "ACTIVE" | "RESOLVED" };

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Dashboard:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Alerts:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Map:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  LiveFeed:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>,
  Hospitals:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Analytics:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Responders: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Reports:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Settings:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Bell:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={18}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Ambulance:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={14}><rect x="1" y="9" width="15" height="12" rx="1"/><path d="M16 16h2l3-3V9h-5v7z"/><circle cx="5.5" cy="21" r="1.5"/><circle cx="18.5" cy="21" r="1.5"/><path d="M7 9V5l4 4"/><path d="M9 7H5"/></svg>,
  Cross:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={12}><path d="M12 5v14M5 12h14"/></svg>,
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_TOP: NavItem[] = [
  { id:"dashboard",  label:"Dashboard",   icon: Icon.Dashboard  },
  { id:"alerts",     label:"Live Alerts", icon: Icon.Alerts,    badge: 3 },
  { id:"map",        label:"Map View",    icon: Icon.Map        },
  { id:"livefeed",   label:"Live Feeds",  icon: Icon.LiveFeed,  badge: 2 },
  { id:"hospitals",  label:"Hospitals",   icon: Icon.Hospitals  },
  { id:"responders", label:"Responders",  icon: Icon.Responders },
  { id:"analytics",  label:"Analytics",   icon: Icon.Analytics  },
  { id:"reports",    label:"Reports",     icon: Icon.Reports    },
];
const NAV_BOTTOM: NavItem[] = [
  { id:"settings", label:"Settings", icon: Icon.Settings },
  { id:"logout",   label:"Logout",   icon: Icon.Logout   },
];

// Bottom bar shows top 5 most important
const BOTTOM_BAR: NavItem[] = [
  { id:"dashboard", label:"Dashboard", icon: Icon.Dashboard  },
  { id:"alerts",    label:"Alerts",    icon: Icon.Alerts, badge: 3 },
  { id:"map",       label:"Map",       icon: Icon.Map        },
  { id:"livefeed",  label:"Live",      icon: Icon.LiveFeed, badge: 2 },
  { id:"settings",  label:"Settings",  icon: Icon.Settings  },
];

const ALERTS: Alert[] = [
  { id:"A001", severity:"CRITICAL", location:"Lagos Island, Marina", time:"0m ago",  victims:4, status:"INCOMING" },
  { id:"A002", severity:"HIGH",     location:"Surulere, Aguda",      time:"3m ago",  victims:2, status:"ACTIVE"   },
  { id:"A003", severity:"CRITICAL", location:"Ikeja, Allen Ave",     time:"7m ago",  victims:6, status:"INCOMING" },
  { id:"A004", severity:"MODERATE", location:"Lekki Phase 1",        time:"12m ago", victims:1, status:"ACTIVE"   },
  { id:"A005", severity:"HIGH",     location:"Oshodi Expressway",    time:"18m ago", victims:3, status:"RESOLVED" },
];

const STATS = [
  { label:"Active Alerts",    value:"7",    delta:"+2", up:true  },
  { label:"Avg Response",     value:"2m14s", delta:"-18s", up:true  },
  { label:"Hospitals Online", value:"23",   delta:"100%", up:true  },
  { label:"Saved Today",      value:"14",   delta:"+3", up:true  },
];

// ─── Severity colors ──────────────────────────────────────────────────────────
const SEV: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  CRITICAL: { bg:"rgba(232,0,29,.12)", border:"rgba(232,0,29,.4)", text:"#E8001D", dot:"#E8001D" },
  HIGH:     { bg:"rgba(255,120,0,.1)", border:"rgba(255,120,0,.35)", text:"#ff7800", dot:"#ff7800" },
  MODERATE: { bg:"rgba(255,200,0,.08)", border:"rgba(255,200,0,.3)", text:"#e0b800", dot:"#e0b800" },
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; background:#080808; color:#f0ede8; font-family:'DM Sans',sans-serif; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(232,0,29,.3); border-radius:2px; }

        .fd { font-family:'Bebas Neue',sans-serif; }
        .fm { font-family:'Space Mono',monospace; }

        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
        @keyframes ping { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
        @keyframes slide-in { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bar-grow { from{width:0} to{width:var(--w)} }

        .pulse-dot { animation:pulse-dot 2s infinite; }
        .ping       { animation:ping 1.5s infinite; }
        .slide-in   { animation:slide-in .4s ease both; }
        .fade-in    { animation:fade-in .5s ease both; }

        .nav-item {
          display:flex; align-items:center; gap:12px;
          padding:10px 16px; border-radius:6px;
          font-size:13px; font-weight:400; color:rgba(240,237,232,.5);
          cursor:pointer; transition:all .18s; position:relative;
          border:1px solid transparent; white-space:nowrap;
        }
        .nav-item:hover { color:#f0ede8; background:rgba(255,255,255,.05); }
        .nav-item.active {
          color:#f0ede8; background:rgba(232,0,29,.12);
          border-color:rgba(232,0,29,.25);
        }
        .nav-item.active::before {
          content:''; position:absolute; left:0; top:50%; transform:translateY(-50%);
          width:3px; height:60%; background:#E8001D; border-radius:0 2px 2px 0;
        }

        .stat-card {
          background:#0f0f0f; border:1px solid rgba(255,255,255,.07);
          border-radius:8px; padding:24px; position:relative; overflow:hidden;
          transition:border-color .2s;
        }
        .stat-card:hover { border-color:rgba(232,0,29,.25); }
        .stat-card::after {
          content:''; position:absolute; bottom:0; left:0; right:0;
          height:2px; background:#E8001D;
          transform:scaleX(0); transform-origin:left;
          transition:transform .3s ease;
        }
        .stat-card:hover::after { transform:scaleX(1); }

        .alert-row {
          display:grid; align-items:center; gap:16px;
          padding:16px 20px; border-radius:6px;
          border:1px solid rgba(255,255,255,.06);
          background:#0d0d0d;
          grid-template-columns: 90px 1fr auto auto auto;
          transition:border-color .2s, background .2s;
          animation: fade-in .4s ease both;
        }
        .alert-row:hover { border-color:rgba(255,255,255,.12); background:#111; }

        .badge {
          font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1px;
          padding:3px 8px; border-radius:3px; text-transform:uppercase; font-weight:700;
        }

        .btn-dispatch {
          font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1.5px;
          text-transform:uppercase; background:#E8001D; color:#fff;
          border:none; padding:8px 16px; border-radius:4px; cursor:pointer;
          transition:all .2s; white-space:nowrap;
        }
        .btn-dispatch:hover { background:#ff0022; transform:translateY(-1px); }
        .btn-view {
          font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1.5px;
          text-transform:uppercase; background:transparent; color:rgba(240,237,232,.5);
          border:1px solid rgba(255,255,255,.1); padding:8px 16px; border-radius:4px;
          cursor:pointer; transition:all .2s; white-space:nowrap;
        }
        .btn-view:hover { color:#f0ede8; border-color:rgba(255,255,255,.25); }

        /* Sidebar */
        .sidebar {
          position:fixed; top:0; left:0; bottom:0;
          width:240px; background:#0a0a0a;
          border-right:1px solid rgba(255,255,255,.07);
          display:flex; flex-direction:column;
          transition:width .25s ease, transform .25s ease;
          z-index:50; overflow:hidden;
        }
        .sidebar.collapsed { width:64px; }

        /* Bottom bar (mobile) */
        .bottom-bar {
          display:none; position:fixed; bottom:0; left:0; right:0;
          background:#0a0a0a; border-top:1px solid rgba(255,255,255,.07);
          z-index:50; padding:8px 0 max(8px,env(safe-area-inset-bottom));
        }

        /* Responsive */
        @media(max-width:768px) {
          .sidebar { display:none; }
          .bottom-bar { display:flex; }
          .main-content { margin-left:0 !important; padding-bottom:80px !important; }
          .alert-row { grid-template-columns:70px 1fr; }
          .alert-actions { display:none; }
          .stats-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:480px) {
          .stats-grid { grid-template-columns:1fr !important; }
        }

        /* Scrollable main */
        .main-scroll { height:100vh; overflow-y:auto; }

        /* Blinking live indicator */
        .live-ind::before {
          content:''; display:inline-block; width:7px; height:7px;
          background:#E8001D; border-radius:50%; margin-right:7px;
          animation:pulse-dot 1.2s infinite;
        }

        /* Mini sparkline bars */
        .bar { background:rgba(232,0,29,.35); border-radius:2px 2px 0 0; transition:background .2s; }
        .bar:hover { background:#E8001D; }
      `}</style>

      <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside className={`sidebar${sidebarOpen ? "" : " collapsed"}`}>

          {/* Logo */}
          <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <div style={{ width:32, height:32, background:"#E8001D", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg viewBox="0 0 24 24" width="16" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            {sidebarOpen && (
              <div style={{ overflow:"hidden" }}>
                <div className="fd" style={{ fontSize:18, letterSpacing:1, lineHeight:1 }}>
                  RESCUE<span style={{ color:"#E8001D" }}>234</span>
                </div>
                <div className="fm" style={{ fontSize:8, letterSpacing:"2px", color:"rgba(240,237,232,.3)", textTransform:"uppercase" }}>Hospital Dashboard</div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              style={{ marginLeft:"auto", background:"none", border:"none", color:"rgba(240,237,232,.3)", cursor:"pointer", padding:4, flexShrink:0 }}
            >
              <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth={1.5}>
                {sidebarOpen
                  ? <path d="M19 12H5M12 5l-7 7 7 7"/>
                  : <path d="M5 12h14M12 5l7 7-7 7"/>}
              </svg>
            </button>
          </div>

          {/* Live status pill */}
          {sidebarOpen && (
            <div style={{ margin:"12px 16px", background:"rgba(232,0,29,.08)", border:"1px solid rgba(232,0,29,.2)", borderRadius:6, padding:"8px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span className="fm live-ind" style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", color:"#E8001D" }}>System Live</span>
              <span className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.4)" }}>23 hospitals</span>
            </div>
          )}

          {/* Top nav */}
          <nav style={{ flex:1, overflowY:"auto", padding:"8px 10px", display:"flex", flexDirection:"column", gap:2 }}>
            <div className="fm" style={{ fontSize:8, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(240,237,232,.2)", padding:"8px 6px 4px" }}>
              {sidebarOpen ? "Navigation" : ""}
            </div>
            {NAV_TOP.map(item => (
              <button
                key={item.id}
                className={`nav-item${active === item.id ? " active" : ""}`}
                onClick={() => setActive(item.id)}
                title={!sidebarOpen ? item.label : undefined}
                style={{ width:"100%", background:"none", border:"1px solid transparent", textAlign:"left" }}
              >
                <span style={{ flexShrink:0, opacity: active===item.id ? 1 : 0.6 }}>{item.icon}</span>
                {sidebarOpen && <span style={{ flex:1 }}>{item.label}</span>}
                {sidebarOpen && item.badge && (
                  <span className="fm" style={{ fontSize:9, background:"#E8001D", color:"#fff", padding:"2px 7px", borderRadius:10, fontWeight:700 }}>{item.badge}</span>
                )}
                {!sidebarOpen && item.badge && (
                  <span style={{ position:"absolute", top:6, right:6, width:8, height:8, background:"#E8001D", borderRadius:"50%" }} />
                )}
              </button>
            ))}
          </nav>

          {/* Bottom nav */}
          <div style={{ padding:"8px 10px 16px", borderTop:"1px solid rgba(255,255,255,.07)", display:"flex", flexDirection:"column", gap:2 }}>
            {NAV_BOTTOM.map(item => (
              <button
                key={item.id}
                className={`nav-item${active === item.id ? " active" : ""}`}
                onClick={() => setActive(item.id)}
                title={!sidebarOpen ? item.label : undefined}
                style={{ width:"100%", background:"none", border:"1px solid transparent", textAlign:"left" }}
              >
                <span style={{ flexShrink:0, opacity:.6 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}

            {sidebarOpen && (
              <div style={{ marginTop:12, padding:"12px", background:"rgba(255,255,255,.03)", borderRadius:6, border:"1px solid rgba(255,255,255,.07)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(232,0,29,.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg viewBox="0 0 24 24" width="14" stroke="#E8001D" fill="none" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div style={{ overflow:"hidden" }}>
                    <div style={{ fontSize:13, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>LUTH Emergency</div>
                    <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.35)", letterSpacing:"1px" }}>DUTY DOCTOR</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN ────────────────────────────────────────────────────────── */}
        <main
          className="main-content main-scroll"
          style={{ flex:1, marginLeft: sidebarOpen ? 240 : 64, transition:"margin-left .25s ease", background:"#080808" }}
        >
          {/* Topbar */}
          <div style={{ position:"sticky", top:0, zIndex:40, background:"rgba(8,8,8,.9)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
            <div>
              <div className="fd" style={{ fontSize:22, letterSpacing:.5, lineHeight:1 }}>Emergency Dashboard</div>
              <div className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.35)", letterSpacing:"1.5px", textTransform:"uppercase" }}>Lagos State Operations Center</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div className="fm" style={{ fontSize:9, letterSpacing:"1px", color:"rgba(240,237,232,.4)" }}>
                {new Date().toLocaleTimeString("en-NG", { hour:"2-digit", minute:"2-digit" })}
              </div>
              <div style={{ position:"relative" }}>
                <button style={{ background:"none", border:"1px solid rgba(255,255,255,.08)", borderRadius:6, padding:"7px 10px", color:"rgba(240,237,232,.6)", cursor:"pointer", display:"flex", alignItems:"center" }}>
                  {Icon.Bell}
                </button>
                <span style={{ position:"absolute", top:-3, right:-3, width:16, height:16, background:"#E8001D", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span className="fm" style={{ fontSize:8, color:"#fff" }}>5</span>
                </span>
              </div>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(232,0,29,.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg viewBox="0 0 24 24" width="14" stroke="#E8001D" fill="none" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            </div>
          </div>

          <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:28 }}>

            {/* Stats row */}
            <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {STATS.map((s, i) => (
                <div key={s.label} className="stat-card fade-in" style={{ animationDelay:`${i*80}ms` }}>
                  <div className="fm" style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(240,237,232,.35)", marginBottom:12 }}>{s.label}</div>
                  <div className="fd" style={{ fontSize:48, lineHeight:1, color:"#f0ede8", marginBottom:6 }}>{s.value}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span className="fm" style={{ fontSize:9, color:"#22c55e" }}>{s.delta}</span>
                    <span className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.25)" }}>vs yesterday</span>
                  </div>
                  {/* mini sparkline */}
                  <div style={{ display:"flex", alignItems:"flex-end", gap:3, marginTop:16, height:28 }}>
                    {[40,65,45,80,55,90,70,85,60,75].map((h,j) => (
                      <div key={j} className="bar" style={{ flex:1, height:`${h}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Two column */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>

              {/* Alerts panel */}
              <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, overflow:"hidden" }}>
                {/* Panel header */}
                <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span className="fd live-ind" style={{ fontSize:16, color:"#E8001D" }}>LIVE ALERTS</span>
                    <span className="fm" style={{ fontSize:9, background:"rgba(232,0,29,.15)", border:"1px solid rgba(232,0,29,.3)", color:"#E8001D", padding:"2px 8px", borderRadius:3 }}>5 ACTIVE</span>
                  </div>
                  <button className="fm" style={{ fontSize:9, letterSpacing:"1px", textTransform:"uppercase", background:"none", border:"1px solid rgba(255,255,255,.1)", color:"rgba(240,237,232,.5)", padding:"6px 14px", borderRadius:4, cursor:"pointer" }}>
                    View All
                  </button>
                </div>

                {/* Column headers */}
                <div className="fm" style={{ display:"grid", gridTemplateColumns:"90px 1fr auto auto auto", gap:16, padding:"10px 20px", fontSize:8, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(240,237,232,.25)", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                  <span>Severity</span><span>Location</span><span>Victims</span><span>Status</span><span>Actions</span>
                </div>

                {/* Alert rows */}
                <div style={{ display:"flex", flexDirection:"column", gap:2, padding:"8px" }}>
                  {ALERTS.map((a, i) => {
                    const s = SEV[a.severity];
                    return (
                      <div key={a.id} className="alert-row" style={{ animationDelay:`${i*60}ms` }}>
                        {/* Severity */}
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <div style={{ position:"relative", width:10, height:10, flexShrink:0 }}>
                            <div style={{ width:10, height:10, borderRadius:"50%", background:s.dot }} />
                            {a.status==="INCOMING" && <div className="ping" style={{ position:"absolute", inset:0, borderRadius:"50%", background:s.dot }} />}
                          </div>
                          <div>
                            <div className="fm" style={{ fontSize:8, letterSpacing:"1px", color:s.text, textTransform:"uppercase" }}>{a.severity}</div>
                            <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.3)" }}>{a.time}</div>
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>{a.location}</div>
                          <div className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.35)" }}>ID: {a.id}</div>
                        </div>

                        {/* Victims */}
                        <div style={{ textAlign:"center" }}>
                          <div className="fd" style={{ fontSize:24, color: a.victims >= 4 ? "#E8001D" : "#f0ede8", lineHeight:1 }}>{a.victims}</div>
                          <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.3)" }}>victims</div>
                        </div>

                        {/* Status */}
                        <div>
                          <span className="fm badge" style={{
                            background: a.status==="INCOMING" ? "rgba(232,0,29,.15)" : a.status==="ACTIVE" ? "rgba(255,120,0,.1)" : "rgba(34,197,94,.1)",
                            color:      a.status==="INCOMING" ? "#E8001D"             : a.status==="ACTIVE" ? "#ff7800"             : "#22c55e",
                            border:`1px solid ${a.status==="INCOMING" ? "rgba(232,0,29,.3)" : a.status==="ACTIVE" ? "rgba(255,120,0,.3)" : "rgba(34,197,94,.25)"}`,
                          }}>
                            {a.status}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="alert-actions" style={{ display:"flex", gap:6 }}>
                          {a.status !== "RESOLVED" && <button className="btn-dispatch">Dispatch</button>}
                          <button className="btn-view">View</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right column */}
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                {/* Map placeholder */}
                <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, overflow:"hidden", flex:1, minHeight:260, position:"relative" }}>
                  <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span className="fd" style={{ fontSize:16 }}>Live Map</span>
                    <span className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.35)", letterSpacing:"1px", textTransform:"uppercase" }}>Lagos State</span>
                  </div>
                  <div style={{ position:"relative", height:220, background:"#0d0d0d", overflow:"hidden" }}>
                    {/* Fake map grid */}
                    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.15 }} viewBox="0 0 340 220">
                      {[0,40,80,120,160,200].map(y=><line key={y} x1="0" y1={y} x2="340" y2={y} stroke="rgba(255,255,255,.3)" strokeWidth=".5"/>)}
                      {[0,60,120,180,240,300].map(x=><line key={x} x1={x} y1="0" x2={x} y2="220" stroke="rgba(255,255,255,.3)" strokeWidth=".5"/>)}
                    </svg>
                    {/* Incident dots */}
                    {[
                      { x:120, y:80,  sev:"CRITICAL" },
                      { x:200, y:130, sev:"HIGH"     },
                      { x:80,  y:150, sev:"CRITICAL" },
                      { x:260, y:70,  sev:"MODERATE" },
                    ].map((dot, i) => (
                      <div key={i} style={{ position:"absolute", left:dot.x, top:dot.y, transform:"translate(-50%,-50%)" }}>
                        <div className="ping" style={{ position:"absolute", inset:-6, borderRadius:"50%", background:SEV[dot.sev].dot, opacity:.4 }} />
                        <div style={{ width:12, height:12, borderRadius:"50%", background:SEV[dot.sev].dot, border:"2px solid #0a0a0a" }} />
                      </div>
                    ))}
                    {/* Hospital marker */}
                    <div style={{ position:"absolute", left:170, top:110, transform:"translate(-50%,-50%)" }}>
                      <div style={{ width:16, height:16, background:"rgba(34,197,94,.9)", borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #0a0a0a" }}>
                        <svg viewBox="0 0 10 10" width="8" fill="white"><path d="M5 1v8M1 5h8" strokeWidth={2} stroke="white"/></svg>
                      </div>
                    </div>
                    <div style={{ position:"absolute", bottom:10, left:10 }}>
                      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                        {[["CRITICAL","#E8001D"],["HIGH","#ff7800"],["MODERATE","#e0b800"],["Hospital","#22c55e"]].map(([l,c])=>(
                          <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <div style={{ width:6, height:6, borderRadius:"50%", background:c as string }} />
                            <span className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.5)" }}>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Responders online */}
                <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, padding:16 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                    <span className="fd" style={{ fontSize:16 }}>Responders</span>
                    <span className="fm" style={{ fontSize:8, color:"#22c55e", letterSpacing:"1px", textTransform:"uppercase" }}>12 Online</span>
                  </div>
                  {[
                    { name:"Unit 7 — LASAMBUS", status:"En Route", load:true  },
                    { name:"Unit 3 — FRSC",     status:"Standby",  load:false },
                    { name:"Unit 11 — LASG",    status:"On Scene", load:true  },
                    { name:"Unit 2 — LASAMBUS", status:"Standby",  load:false },
                  ].map(r => (
                    <div key={r.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background: r.status==="On Scene" ? "#E8001D" : r.status==="En Route" ? "#ff7800" : "#22c55e", flexShrink:0 }} />
                        <span style={{ fontSize:12, fontWeight:400 }}>{r.name}</span>
                      </div>
                      <span className="fm" style={{ fontSize:8, letterSpacing:"1px", textTransform:"uppercase", color: r.status==="On Scene" ? "#E8001D" : r.status==="En Route" ? "#ff7800" : "rgba(240,237,232,.4)" }}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent activity strip */}
            <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, padding:20 }}>
              <div className="fd" style={{ fontSize:18, marginBottom:14 }}>Recent Activity</div>
              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {[
                  { time:"14:32", msg:"Alert A003 — Unit 7 dispatched to Ikeja Allen Ave", color:"#E8001D" },
                  { time:"14:28", msg:"Alert A002 — Gemini AI severity upgraded to HIGH", color:"#ff7800" },
                  { time:"14:21", msg:"Alert A004 — Lekki hospital received live stream", color:"rgba(240,237,232,.5)" },
                  { time:"14:15", msg:"Alert A005 — Victim stabilized, case resolved",  color:"#22c55e" },
                  { time:"14:09", msg:"System — LUTH Emergency joined dashboard",         color:"rgba(240,237,232,.3)" },
                ].map((a,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                    <span className="fm" style={{ fontSize:10, color:"rgba(240,237,232,.3)", whiteSpace:"nowrap", flexShrink:0, marginTop:1 }}>{a.time}</span>
                    <div style={{ width:2, alignSelf:"stretch", background:a.color, borderRadius:1, flexShrink:0, opacity:.6 }} />
                    <span style={{ fontSize:13, color:"rgba(240,237,232,.7)", lineHeight:1.5 }}>{a.msg}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── MOBILE BOTTOM BAR ──────────────────────────────────────────────── */}
      <nav className="bottom-bar">
        {BOTTOM_BAR.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              background:"none", border:"none", cursor:"pointer", padding:"4px 0",
              color: active===item.id ? "#E8001D" : "rgba(240,237,232,.4)",
              transition:"color .18s", position:"relative",
            }}
          >
            {item.badge && (
              <span style={{ position:"absolute", top:0, right:"calc(50% - 16px)", width:14, height:14, background:"#E8001D", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span className="fm" style={{ fontSize:8, color:"#fff" }}>{item.badge}</span>
              </span>
            )}
            <span style={{ opacity: active===item.id ? 1 : 0.6 }}>{item.icon}</span>
            <span className="fm" style={{ fontSize:8, letterSpacing:"1px", textTransform:"uppercase" }}>{item.label}</span>
            {active===item.id && (
              <span style={{ position:"absolute", bottom:-8, left:"50%", transform:"translateX(-50%)", width:20, height:2, background:"#E8001D", borderRadius:1 }} />
            )}
          </button>
        ))}
      </nav>
    </>
  );
}