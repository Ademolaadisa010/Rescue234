"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type NavItem = { id: string; label: string; icon: React.ReactNode; badge?: number; href: string };
type Alert   = { id: string; severity: "CRITICAL" | "HIGH" | "MODERATE"; location: string; time: string; victims: number; status: "INCOMING" | "ACTIVE" | "RESOLVED" };

const Icon = {
  Dashboard:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Report:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  Map:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Responders: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Settings:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Bell:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={18}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  ChevL:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14}><path d="M15 18l-6-6 6-6"/></svg>,
  ChevR:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14}><path d="M9 18l6-6-6-6"/></svg>,
  ExtLink:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={11}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

// ─── Only 4 pages ─────────────────────────────────────────────────────────────
const NAV_TOP: NavItem[] = [
  { id:"dashboard",  label:"Dashboard",        icon:Icon.Dashboard,  href:"/dashboard"            },
  { id:"report",     label:"Report Emergency", icon:Icon.Report,     href:"/report"               },
  { id:"map",        label:"Live Map",         icon:Icon.Map,        href:"/dashboard/map"        },
  { id:"responders", label:"Responder View",   icon:Icon.Responders, href:"/dashboard/responders" },
];

const NAV_BOTTOM: NavItem[] = [
  { id:"settings", label:"Settings", icon:Icon.Settings, href:"/dashboard/settings" },
  { id:"logout",   label:"Logout",   icon:Icon.Logout,   href:"/"                   },
];

// Bottom bar mirrors the 4 pages, Report floats as pill in center
const BOTTOM_BAR: NavItem[] = [
  { id:"dashboard",  label:"Home",       icon:Icon.Dashboard,  href:"/dashboard"            },
  { id:"map",        label:"Map",        icon:Icon.Map,        href:"/dashboard/map"        },
  { id:"report",     label:"Report",     icon:Icon.Report,     href:"/report"               },
  { id:"responders", label:"Responders", icon:Icon.Responders, href:"/dashboard/responders" },
  { id:"settings",   label:"Settings",   icon:Icon.Settings,   href:"/dashboard/settings"   },
];

const ALERTS: Alert[] = [
  { id:"A001", severity:"CRITICAL", location:"Lagos Island, Marina", time:"0m ago",  victims:4, status:"INCOMING" },
  { id:"A002", severity:"HIGH",     location:"Surulere, Aguda",      time:"3m ago",  victims:2, status:"ACTIVE"   },
  { id:"A003", severity:"CRITICAL", location:"Ikeja, Allen Ave",     time:"7m ago",  victims:6, status:"INCOMING" },
  { id:"A004", severity:"MODERATE", location:"Lekki Phase 1",        time:"12m ago", victims:1, status:"ACTIVE"   },
  { id:"A005", severity:"HIGH",     location:"Oshodi Expressway",    time:"18m ago", victims:3, status:"RESOLVED" },
];

const STATS = [
  { label:"Active Alerts",    value:"7",     delta:"+2"   },
  { label:"Avg Response",     value:"2m14s", delta:"-18s" },
  { label:"Hospitals Online", value:"23",    delta:"100%" },
  { label:"Saved Today",      value:"14",    delta:"+3"   },
];

const SEV: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  CRITICAL: { bg:"rgba(232,0,29,.12)",  border:"rgba(232,0,29,.4)",   text:"#E8001D", dot:"#E8001D" },
  HIGH:     { bg:"rgba(255,120,0,.1)",  border:"rgba(255,120,0,.35)", text:"#ff7800", dot:"#ff7800" },
  MODERATE: { bg:"rgba(255,200,0,.08)", border:"rgba(255,200,0,.3)",  text:"#e0b800", dot:"#e0b800" },
};

export default function Dashboard() {
  const [active, setActive]           = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const navigate = (item: NavItem) => {
    setActive(item.id);
    router.push(item.href);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; background:#080808; color:#f0ede8; font-family:'DM Sans',sans-serif; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(232,0,29,.25); border-radius:2px; }
        .fd { font-family:'Bebas Neue',sans-serif; }
        .fm { font-family:'Space Mono',monospace; }

        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.75)} }
        @keyframes ping      { 0%{transform:scale(1);opacity:.75} 100%{transform:scale(2.4);opacity:0} }
        @keyframes fade-in   { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }

        .pulse-dot { animation:pulse-dot 1.8s infinite; }
        .ping      { animation:ping 1.6s infinite; }
        .fade-in   { animation:fade-in .45s ease both; }

        .live-ind::before {
          content:''; display:inline-block; width:6px; height:6px;
          background:#E8001D; border-radius:50%; margin-right:7px;
          animation:pulse-dot 1.4s infinite;
        }

        .nav-item {
          width:100%; display:flex; align-items:center; gap:10px;
          padding:9px 12px; border-radius:6px;
          font-size:13px; font-weight:400; color:rgba(240,237,232,.5);
          cursor:pointer; transition:all .17s; position:relative;
          border:1px solid transparent; white-space:nowrap;
          background:none; text-align:left;
        }
        .nav-item:hover { color:#f0ede8; background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.06); }
        .nav-item.active { color:#f0ede8; background:rgba(232,0,29,.1); border-color:rgba(232,0,29,.22); }
        .nav-item.active::before {
          content:''; position:absolute; left:-1px; top:50%; transform:translateY(-50%);
          width:3px; height:52%; background:#E8001D; border-radius:0 2px 2px 0;
        }
        .nav-report {
          color:rgba(240,237,232,.8) !important;
          background:rgba(232,0,29,.07) !important;
          border-color:rgba(232,0,29,.16) !important;
        }
        .nav-report:hover  { background:rgba(232,0,29,.13) !important; color:#f0ede8 !important; }
        .nav-report.active { background:rgba(232,0,29,.17) !important; border-color:rgba(232,0,29,.38) !important; }

        .stat-card {
          background:#0f0f0f; border:1px solid rgba(255,255,255,.07);
          border-radius:8px; padding:22px; position:relative; overflow:hidden;
          transition:border-color .2s, transform .2s;
        }
        .stat-card:hover { border-color:rgba(232,0,29,.25); transform:translateY(-1px); }
        .stat-card::after {
          content:''; position:absolute; bottom:0; left:0; right:0;
          height:2px; background:#E8001D;
          transform:scaleX(0); transform-origin:left; transition:transform .3s;
        }
        .stat-card:hover::after { transform:scaleX(1); }

        .alert-row {
          display:grid; align-items:center; gap:14px;
          padding:13px 16px; border-radius:6px;
          border:1px solid rgba(255,255,255,.06); background:#0d0d0d;
          grid-template-columns:90px 1fr auto auto auto;
          transition:border-color .2s, background .2s;
        }
        .alert-row:hover { border-color:rgba(255,255,255,.13); background:#111; }

        .badge { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1px; padding:3px 8px; border-radius:3px; text-transform:uppercase; font-weight:700; }
        .btn-dispatch { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; background:#E8001D; color:#fff; border:none; padding:7px 13px; border-radius:4px; cursor:pointer; transition:all .2s; white-space:nowrap; }
        .btn-dispatch:hover { background:#ff0022; transform:translateY(-1px); box-shadow:0 4px 14px rgba(232,0,29,.3); }
        .btn-view { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; background:transparent; color:rgba(240,237,232,.5); border:1px solid rgba(255,255,255,.1); padding:7px 13px; border-radius:4px; cursor:pointer; transition:all .2s; white-space:nowrap; }
        .btn-view:hover { color:#f0ede8; border-color:rgba(255,255,255,.25); }

        .bar { background:rgba(232,0,29,.3); border-radius:2px 2px 0 0; transition:background .2s; }
        .bar:hover { background:#E8001D; }

        .sidebar {
          position:fixed; top:0; left:0; bottom:0;
          width:242px; background:#0a0a0a;
          border-right:1px solid rgba(255,255,255,.07);
          display:flex; flex-direction:column;
          transition:width .22s cubic-bezier(.4,0,.2,1);
          z-index:50; overflow:hidden;
        }
        .sidebar.collapsed { width:62px; }
        .sidebar nav { overflow-y:auto; scrollbar-width:none; }
        .sidebar nav::-webkit-scrollbar { display:none; }

        .bottom-bar {
          display:none;
          position:fixed; bottom:0; left:0; right:0;
          background:rgba(8,8,8,.97);
          border-top:1px solid rgba(255,255,255,.08);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          z-index:50;
          padding:0 4px;
          padding-bottom:max(10px, env(safe-area-inset-bottom));
          align-items:flex-end;
        }

        @media(max-width:900px) {
          .sidebar      { display:none !important; }
          .bottom-bar   { display:flex !important; }
          .main-content { margin-left:0 !important; padding-bottom:90px !important; }
          .alert-row    { grid-template-columns:76px 1fr; }
          .alert-victims, .alert-actions { display:none !important; }
          .stats-grid   { grid-template-columns:1fr 1fr !important; }
          .two-col      { grid-template-columns:1fr !important; }
          .right-col    { display:none !important; }
        }
        @media(max-width:480px) {
          .stats-grid { grid-template-columns:1fr 1fr !important; }
        }
        .main-scroll { height:100vh; overflow-y:auto; }
      `}</style>

      <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>

        {/* ══ SIDEBAR ══ */}
        <aside className={`sidebar${sidebarOpen ? "" : " collapsed"}`}>

          {/* Logo + toggle */}
          <div style={{ padding:"18px 14px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <div style={{ width:32, height:32, background:"#E8001D", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg viewBox="0 0 24 24" width="16" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            {sidebarOpen && (
              <div style={{ overflow:"hidden", flex:1 }}>
                <div className="fd" style={{ fontSize:18, letterSpacing:1, lineHeight:1 }}>RESCUE<span style={{ color:"#E8001D" }}>234</span></div>
                <div className="fm" style={{ fontSize:7, letterSpacing:"2px", color:"rgba(240,237,232,.28)", textTransform:"uppercase", marginTop:1 }}>Hospital Dashboard</div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:5, color:"rgba(240,237,232,.4)", cursor:"pointer", padding:5, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", marginLeft:"auto" }}
              title={sidebarOpen ? "Collapse" : "Expand"}
            >
              {sidebarOpen ? Icon.ChevL : Icon.ChevR}
            </button>
          </div>

          {/* Live pill */}
          {sidebarOpen
            ? <div style={{ margin:"10px 12px 2px", background:"rgba(232,0,29,.07)", border:"1px solid rgba(232,0,29,.18)", borderRadius:6, padding:"7px 11px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span className="fm live-ind" style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", color:"#E8001D" }}>System Live</span>
                <span className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.35)" }}>23 hospitals</span>
              </div>
            : <div style={{ display:"flex", justifyContent:"center", padding:"8px 0 2px" }}>
                <div className="pulse-dot" style={{ width:7, height:7, borderRadius:"50%", background:"#E8001D" }} />
              </div>
          }

          {sidebarOpen && (
            <div className="fm" style={{ fontSize:7, letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(240,237,232,.18)", padding:"10px 14px 3px" }}>
              Navigation
            </div>
          )}

          {/* Top nav — 4 pages only */}
          <nav style={{ flex:1, padding:"4px 8px", display:"flex", flexDirection:"column", gap:1 }}>
            {NAV_TOP.map((item, idx) => {
              const isReport = item.id === "report";
              const isActive = active === item.id;
              return (
                <div key={item.id}>
                  {idx === 1 && <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"5px 4px" }} />}
                  <button
                    className={`nav-item${isActive ? " active" : ""}${isReport ? " nav-report" : ""}`}
                    onClick={() => navigate(item)}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <span style={{ flexShrink:0, opacity: isActive ? 1 : isReport ? 0.95 : 0.55, color: isReport && !isActive ? "#E8001D" : "inherit" }}>
                      {item.icon}
                    </span>
                    {sidebarOpen && (
                      <>
                        <span style={{ flex:1, fontWeight: isReport ? 500 : 400 }}>{item.label}</span>
                        {isReport && !isActive && <span style={{ opacity:.45, color:"#E8001D" }}>{Icon.ExtLink}</span>}
                      </>
                    )}
                  </button>
                  {idx === 1 && <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"5px 4px" }} />}
                </div>
              );
            })}
          </nav>

          {/* Bottom nav */}
          <div style={{ padding:"6px 8px 10px", borderTop:"1px solid rgba(255,255,255,.07)", display:"flex", flexDirection:"column", gap:1 }}>
            {NAV_BOTTOM.map(item => (
              <button
                key={item.id}
                className={`nav-item${active === item.id ? " active" : ""}`}
                onClick={() => navigate(item)}
                title={!sidebarOpen ? item.label : undefined}
                style={{ opacity: item.id === "logout" ? 0.7 : 1 }}
              >
                <span style={{ flexShrink:0, opacity:.55 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}

            {sidebarOpen && (
              <div style={{ marginTop:8, padding:11, background:"rgba(255,255,255,.03)", borderRadius:6, border:"1px solid rgba(255,255,255,.07)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:"rgba(232,0,29,.16)", border:"1px solid rgba(232,0,29,.25)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg viewBox="0 0 24 24" width="13" stroke="#E8001D" fill="none" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div style={{ overflow:"hidden", flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>LUTH Emergency</div>
                    <div className="fm" style={{ fontSize:7, color:"rgba(240,237,232,.32)", letterSpacing:"1px", textTransform:"uppercase" }}>Duty Doctor · Online</div>
                  </div>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", flexShrink:0 }} />
                </div>
              </div>
            )}

            {!sidebarOpen && (
              <div style={{ display:"flex", justifyContent:"center", paddingTop:6 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:"rgba(232,0,29,.16)", border:"1px solid rgba(232,0,29,.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg viewBox="0 0 24 24" width="13" stroke="#E8001D" fill="none" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main
          className="main-content main-scroll"
          style={{ flex:1, marginLeft: sidebarOpen ? 242 : 62, transition:"margin-left .22s cubic-bezier(.4,0,.2,1)", background:"#080808" }}
        >
          {/* Topbar */}
          <div style={{ position:"sticky", top:0, zIndex:40, background:"rgba(8,8,8,.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, gap:12 }}>
            <div>
              <div className="fd" style={{ fontSize:21, letterSpacing:.5, lineHeight:1 }}>Emergency Dashboard</div>
              <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.32)", letterSpacing:"1.5px", textTransform:"uppercase" }}>Lagos State Operations Center</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button
                onClick={() => navigate(NAV_TOP[1])}
                className="fm"
                style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", background:"#E8001D", color:"#fff", border:"none", padding:"8px 14px", borderRadius:4, cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all .2s" }}
                onMouseEnter={e=>(e.currentTarget.style.background="#ff0022")}
                onMouseLeave={e=>(e.currentTarget.style.background="#E8001D")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width={11}><path d="M12 5v14M5 12h14"/></svg>
                New Report
              </button>
              <div className="fm" style={{ fontSize:9, letterSpacing:"1px", color:"rgba(240,237,232,.32)" }}>
                {new Date().toLocaleTimeString("en-NG", { hour:"2-digit", minute:"2-digit" })}
              </div>
              <div style={{ position:"relative" }}>
                <button style={{ background:"none", border:"1px solid rgba(255,255,255,.08)", borderRadius:6, padding:"7px 9px", color:"rgba(240,237,232,.55)", cursor:"pointer", display:"flex", alignItems:"center", transition:"all .2s" }}>
                  {Icon.Bell}
                </button>
                <span style={{ position:"absolute", top:-4, right:-4, width:16, height:16, background:"#E8001D", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span className="fm" style={{ fontSize:8, color:"#fff", fontWeight:700 }}>5</span>
                </span>
              </div>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(232,0,29,.16)", border:"1px solid rgba(232,0,29,.25)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <svg viewBox="0 0 24 24" width="14" stroke="#E8001D" fill="none" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            </div>
          </div>

          <div style={{ padding:"22px 28px", display:"flex", flexDirection:"column", gap:22 }}>

            {/* Stats */}
            <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:13 }}>
              {STATS.map((s, i) => (
                <div key={s.label} className="stat-card fade-in" style={{ animationDelay:`${i*70}ms` }}>
                  <div className="fm" style={{ fontSize:8, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(240,237,232,.3)", marginBottom:10 }}>{s.label}</div>
                  <div className="fd" style={{ fontSize:44, lineHeight:1, marginBottom:4 }}>{s.value}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span className="fm" style={{ fontSize:9, color:"#22c55e" }}>{s.delta}</span>
                    <span className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.2)" }}>vs yesterday</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:2, marginTop:14, height:26 }}>
                    {[40,62,44,78,52,88,68,82,57,74].map((h,j) => (
                      <div key={j} className="bar" style={{ flex:1, height:`${h}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Two-col */}
            <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 310px", gap:16 }}>

              {/* Alerts */}
              <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, overflow:"hidden" }}>
                <div style={{ padding:"13px 16px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <span className="fd live-ind" style={{ fontSize:15, color:"#E8001D" }}>Live Alerts</span>
                    <span className="fm" style={{ fontSize:9, background:"rgba(232,0,29,.12)", border:"1px solid rgba(232,0,29,.28)", color:"#E8001D", padding:"2px 8px", borderRadius:3 }}>5 ACTIVE</span>
                  </div>
                  <button className="fm" style={{ fontSize:9, letterSpacing:"1px", textTransform:"uppercase", background:"none", border:"1px solid rgba(255,255,255,.1)", color:"rgba(240,237,232,.5)", padding:"5px 12px", borderRadius:4, cursor:"pointer" }}>
                    View All
                  </button>
                </div>
                <div className="fm" style={{ display:"grid", gridTemplateColumns:"90px 1fr auto auto auto", gap:14, padding:"8px 16px", fontSize:8, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(240,237,232,.2)", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                  <span>Severity</span><span>Location</span>
                  <span className="alert-victims">Victims</span>
                  <span>Status</span>
                  <span className="alert-actions">Actions</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:2, padding:"6px" }}>
                  {ALERTS.map((a, i) => {
                    const s = SEV[a.severity];
                    return (
                      <div key={a.id} className="alert-row fade-in" style={{ animationDelay:`${i*55}ms` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <div style={{ position:"relative", width:9, height:9, flexShrink:0 }}>
                            <div style={{ width:9, height:9, borderRadius:"50%", background:s.dot }} />
                            {a.status==="INCOMING" && <div className="ping" style={{ position:"absolute", inset:0, borderRadius:"50%", background:s.dot }} />}
                          </div>
                          <div>
                            <div className="fm" style={{ fontSize:8, letterSpacing:"1px", color:s.text, textTransform:"uppercase" }}>{a.severity}</div>
                            <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.27)" }}>{a.time}</div>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>{a.location}</div>
                          <div className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.3)" }}>ID: {a.id}</div>
                        </div>
                        <div className="alert-victims" style={{ textAlign:"center" }}>
                          <div className="fd" style={{ fontSize:22, color: a.victims>=4 ? "#E8001D" : "#f0ede8", lineHeight:1 }}>{a.victims}</div>
                          <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.27)" }}>victims</div>
                        </div>
                        <div>
                          <span className="fm badge" style={{
                            background: a.status==="INCOMING" ? "rgba(232,0,29,.13)" : a.status==="ACTIVE" ? "rgba(255,120,0,.1)" : "rgba(34,197,94,.1)",
                            color:      a.status==="INCOMING" ? "#E8001D" : a.status==="ACTIVE" ? "#ff7800" : "#22c55e",
                            border:`1px solid ${a.status==="INCOMING" ? "rgba(232,0,29,.3)" : a.status==="ACTIVE" ? "rgba(255,120,0,.27)" : "rgba(34,197,94,.25)"}`,
                          }}>{a.status}</span>
                        </div>
                        <div className="alert-actions" style={{ display:"flex", gap:5 }}>
                          {a.status !== "RESOLVED" && <button className="btn-dispatch">Dispatch</button>}
                          <button className="btn-view">View</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right col */}
              <div className="right-col" style={{ display:"flex", flexDirection:"column", gap:13 }}>
                {/* Map */}
                <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, overflow:"hidden", flex:1, minHeight:230 }}>
                  <div style={{ padding:"12px 14px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span className="fd" style={{ fontSize:14 }}>Live Map</span>
                    <button onClick={()=>navigate(NAV_TOP[2])} className="fm" style={{ fontSize:8, letterSpacing:"1px", textTransform:"uppercase", background:"none", border:"none", color:"rgba(240,237,232,.32)", cursor:"pointer", transition:"color .2s" }}
                      onMouseEnter={e=>(e.currentTarget.style.color="#E8001D")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(240,237,232,.32)")}>
                      Open →
                    </button>
                  </div>
                  <div style={{ position:"relative", height:194, background:"#0d0d0d", overflow:"hidden" }}>
                    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.1 }} viewBox="0 0 310 194" preserveAspectRatio="none">
                      {[0,38,76,114,152,194].map(y=><line key={y} x1="0" y1={y} x2="310" y2={y} stroke="white" strokeWidth=".5"/>)}
                      {[0,62,124,186,248,310].map(x=><line key={x} x1={x} y1="0" x2={x} y2="194" stroke="white" strokeWidth=".5"/>)}
                    </svg>
                    {[{x:95,y:68,s:"CRITICAL"},{x:180,y:115,s:"HIGH"},{x:65,y:135,s:"CRITICAL"},{x:230,y:60,s:"MODERATE"}].map((d,i)=>(
                      <div key={i} style={{ position:"absolute", left:d.x, top:d.y, transform:"translate(-50%,-50%)" }}>
                        <div className="ping" style={{ position:"absolute", inset:-5, borderRadius:"50%", background:SEV[d.s].dot, opacity:.3 }} />
                        <div style={{ width:10, height:10, borderRadius:"50%", background:SEV[d.s].dot, border:"2px solid #0a0a0a" }} />
                      </div>
                    ))}
                    <div style={{ position:"absolute", left:150, top:100, transform:"translate(-50%,-50%)" }}>
                      <div style={{ width:13, height:13, background:"rgba(34,197,94,.9)", borderRadius:2, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #0a0a0a" }}>
                        <svg viewBox="0 0 10 10" width="7"><path d="M5 1v8M1 5h8" strokeWidth={2} stroke="white"/></svg>
                      </div>
                    </div>
                    <div style={{ position:"absolute", bottom:8, left:8, display:"flex", flexDirection:"column", gap:3 }}>
                      {[["CRITICAL","#E8001D"],["HIGH","#ff7800"],["MODERATE","#e0b800"],["Hospital","#22c55e"]].map(([l,c])=>(
                        <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <div style={{ width:5, height:5, borderRadius:"50%", background:c as string }} />
                          <span className="fm" style={{ fontSize:7, color:"rgba(240,237,232,.4)" }}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Responders */}
                <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, padding:13 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:11 }}>
                    <span className="fd" style={{ fontSize:14 }}>Responders</span>
                    <button onClick={()=>navigate(NAV_TOP[3])} className="fm" style={{ fontSize:8, letterSpacing:"1px", textTransform:"uppercase", background:"none", border:"none", color:"rgba(240,237,232,.32)", cursor:"pointer", transition:"color .2s" }}
                      onMouseEnter={e=>(e.currentTarget.style.color="#E8001D")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(240,237,232,.32)")}>
                      View All →
                    </button>
                  </div>
                  {[
                    { name:"Unit 7 — LASAMBUS", status:"En Route" },
                    { name:"Unit 3 — FRSC",     status:"Standby"  },
                    { name:"Unit 11 — LASG",    status:"On Scene" },
                    { name:"Unit 2 — LASAMBUS", status:"Standby"  },
                  ].map(r => (
                    <div key={r.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background: r.status==="On Scene" ? "#E8001D" : r.status==="En Route" ? "#ff7800" : "#22c55e", flexShrink:0 }} />
                        <span style={{ fontSize:12 }}>{r.name}</span>
                      </div>
                      <span className="fm" style={{ fontSize:8, letterSpacing:"1px", textTransform:"uppercase", color: r.status==="On Scene" ? "#E8001D" : r.status==="En Route" ? "#ff7800" : "rgba(240,237,232,.32)" }}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity */}
            <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, padding:16 }}>
              <div className="fd" style={{ fontSize:16, marginBottom:13 }}>Recent Activity</div>
              {[
                { time:"14:32", msg:"Alert A003 — Unit 7 dispatched to Ikeja Allen Ave",   color:"#E8001D" },
                { time:"14:28", msg:"Alert A002 — Gemini AI severity upgraded to HIGH",    color:"#ff7800" },
                { time:"14:21", msg:"Alert A004 — Lekki hospital received live stream",    color:"rgba(240,237,232,.4)" },
                { time:"14:15", msg:"Alert A005 — Victim stabilized, case resolved",       color:"#22c55e" },
                { time:"14:09", msg:"System — LUTH Emergency joined dashboard",             color:"rgba(240,237,232,.22)" },
              ].map((a,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                  <span className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.27)", whiteSpace:"nowrap", flexShrink:0, marginTop:2 }}>{a.time}</span>
                  <div style={{ width:2, alignSelf:"stretch", background:a.color, borderRadius:1, flexShrink:0, opacity:.5 }} />
                  <span style={{ fontSize:13, color:"rgba(240,237,232,.62)", lineHeight:1.55 }}>{a.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ══ MOBILE BOTTOM BAR ══ */}
      <nav className="bottom-bar">
        {BOTTOM_BAR.map(item => {
          const isReport = item.id === "report";
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item)}
              style={{
                flex:1, display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"flex-end",
                gap: isReport ? 0 : 3,
                background:"none", border:"none", cursor:"pointer",
                padding: isReport ? "0 4px 2px" : "8px 4px 2px",
                color: isActive ? "#E8001D" : "rgba(240,237,232,.38)",
                transition:"color .17s", position:"relative", minWidth:0,
              }}
            >
              {isReport ? (
                <div style={{
                  width:50, height:50, borderRadius:"50%",
                  background: isActive ? "#E8001D" : "#150205",
                  border:`2px solid ${isActive ? "#ff3333" : "rgba(232,0,29,.5)"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff",
                  boxShadow: isActive ? "0 0 0 4px rgba(232,0,29,.15),0 6px 20px rgba(232,0,29,.4)" : "0 4px 16px rgba(232,0,29,.25)",
                  transform:"translateY(-12px)", transition:"all .2s", flexShrink:0,
                }}>
                  {item.icon}
                </div>
              ) : (
                <>
                  <span style={{ opacity: isActive ? 1 : 0.55, transition:"opacity .17s" }}>{item.icon}</span>
                  <span className="fm" style={{ fontSize:8, letterSpacing:".5px", textTransform:"uppercase", marginTop:2 }}>{item.label}</span>
                  {isActive && (
                    <span style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:20, height:2, background:"#E8001D", borderRadius:"0 0 2px 2px" }} />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}