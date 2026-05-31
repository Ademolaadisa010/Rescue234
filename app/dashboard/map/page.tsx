"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type NavItem = { id: string; label: string; icon: React.ReactNode; href: string };
type Incident = { id: string; x: number; y: number; severity: "CRITICAL" | "HIGH" | "MODERATE"; location: string; victims: number; status: "INCOMING" | "ACTIVE" | "RESOLVED"; time: string };
type Hospital = { id: string; x: number; y: number; name: string; available: number; distance: string };

const Icon = {
  Dashboard:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Report:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  Map:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Responders: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Settings:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ChevL:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14}><path d="M15 18l-6-6 6-6"/></svg>,
  ChevR:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14}><path d="M9 18l6-6-6-6"/></svg>,
  ExtLink:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={11}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Close:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Layers:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Filter:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  ZoomIn:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  ZoomOut:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  Crosshair:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>,
  Bell:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={18}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};

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
const BOTTOM_BAR: NavItem[] = [
  { id:"dashboard",  label:"Home",       icon:Icon.Dashboard,  href:"/dashboard"            },
  { id:"map",        label:"Map",        icon:Icon.Map,        href:"/dashboard/map"        },
  { id:"report",     label:"Report",     icon:Icon.Report,     href:"/report"               },
  { id:"responders", label:"Responders", icon:Icon.Responders, href:"/dashboard/responders" },
  { id:"settings",   label:"Settings",   icon:Icon.Settings,   href:"/dashboard/settings"   },
];

const INCIDENTS: Incident[] = [
  { id:"A001", x:22,  y:31,  severity:"CRITICAL", location:"Lagos Island, Marina",  victims:4, status:"INCOMING", time:"0m ago"  },
  { id:"A002", x:48,  y:55,  severity:"HIGH",     location:"Surulere, Aguda",       victims:2, status:"ACTIVE",   time:"3m ago"  },
  { id:"A003", x:65,  y:22,  severity:"CRITICAL", location:"Ikeja, Allen Ave",      victims:6, status:"INCOMING", time:"7m ago"  },
  { id:"A004", x:75,  y:65,  severity:"MODERATE", location:"Lekki Phase 1",         victims:1, status:"ACTIVE",   time:"12m ago" },
  { id:"A005", x:38,  y:72,  severity:"HIGH",     location:"Oshodi Expressway",     victims:3, status:"RESOLVED", time:"18m ago" },
  { id:"A006", x:82,  y:42,  severity:"CRITICAL", location:"Victoria Island, Eko",  victims:5, status:"INCOMING", time:"1m ago"  },
];

const HOSPITALS: Hospital[] = [
  { id:"H1", x:44,  y:44,  name:"LUTH Emergency",         available:8,  distance:"2.1km" },
  { id:"H2", x:28,  y:60,  name:"Lagos Island General",   available:3,  distance:"3.4km" },
  { id:"H3", x:70,  y:38,  name:"LASUTH Ikeja",           available:12, distance:"5.8km" },
  { id:"H4", x:60,  y:78,  name:"Reddington Hospital",    available:5,  distance:"6.2km" },
];

const SEV_COLOR: Record<string, string> = {
  CRITICAL:"#E8001D", HIGH:"#ff7800", MODERATE:"#e0b800",
};

export default function MapPage() {
  const [active]                        = useState("map");
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [selectedIncident, setSelected] = useState<Incident | null>(null);
  const [filterSev, setFilterSev]       = useState<string[]>(["CRITICAL","HIGH","MODERATE"]);
  const [showHospitals, setShowHospitals] = useState(true);
  const [zoom, setZoom]                 = useState(1);
  const router = useRouter();

  const navigate = (item: NavItem) => router.push(item.href);

  const toggleSev = (s: string) =>
    setFilterSev(f => f.includes(s) ? f.filter(x => x !== s) : [...f, s]);

  const visibleIncidents = INCIDENTS.filter(i => filterSev.includes(i.severity));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; background:#080808; color:#f0ede8; font-family:'DM Sans',sans-serif; overflow:hidden; }
        .fd { font-family:'Bebas Neue',sans-serif; }
        .fm { font-family:'Space Mono',monospace; }

        @keyframes pulse-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.75)} }
        @keyframes ping       { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.8);opacity:0} }
        @keyframes ping-slow  { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(3.5);opacity:0} }
        @keyframes fade-in    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slide-right{ from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scan       { from{top:-2px} to{top:100%} }

        .pulse-dot  { animation:pulse-dot 1.8s infinite; }
        .ping       { animation:ping 1.5s infinite; }
        .ping-slow  { animation:ping-slow 2.5s infinite; }
        .fade-in    { animation:fade-in .4s ease both; }
        .slide-right{ animation:slide-right .3s ease both; }

        .live-ind::before {
          content:''; display:inline-block; width:6px; height:6px;
          background:#E8001D; border-radius:50%; margin-right:7px;
          animation:pulse-dot 1.4s infinite;
        }

        .nav-item {
          width:100%; display:flex; align-items:center; gap:10px;
          padding:9px 12px; border-radius:6px;
          font-size:13px; color:rgba(240,237,232,.5);
          cursor:pointer; transition:all .17s; position:relative;
          border:1px solid transparent; background:none; text-align:left;
        }
        .nav-item:hover  { color:#f0ede8; background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.06); }
        .nav-item.active { color:#f0ede8; background:rgba(232,0,29,.1); border-color:rgba(232,0,29,.22); }
        .nav-item.active::before {
          content:''; position:absolute; left:-1px; top:50%; transform:translateY(-50%);
          width:3px; height:52%; background:#E8001D; border-radius:0 2px 2px 0;
        }
        .nav-report { color:rgba(240,237,232,.8)!important; background:rgba(232,0,29,.07)!important; border-color:rgba(232,0,29,.16)!important; }
        .nav-report:hover { background:rgba(232,0,29,.13)!important; }
        .nav-report.active { background:rgba(232,0,29,.17)!important; border-color:rgba(232,0,29,.38)!important; }

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
          display:none; position:fixed; bottom:0; left:0; right:0;
          background:rgba(8,8,8,.97); border-top:1px solid rgba(255,255,255,.08);
          backdrop-filter:blur(20px); z-index:50;
          padding:0 4px; padding-bottom:max(10px,env(safe-area-inset-bottom));
          align-items:flex-end;
        }

        .map-btn {
          background:rgba(15,15,15,.95); border:1px solid rgba(255,255,255,.1);
          border-radius:6px; padding:8px; color:rgba(240,237,232,.6);
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          transition:all .2s;
        }
        .map-btn:hover { background:rgba(232,0,29,.12); border-color:rgba(232,0,29,.3); color:#E8001D; }
        .map-btn.active { background:rgba(232,0,29,.15); border-color:rgba(232,0,29,.4); color:#E8001D; }

        .filter-chip {
          font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1px;
          text-transform:uppercase; padding:5px 10px; border-radius:4px;
          cursor:pointer; transition:all .2s; border:1px solid;
        }

        .incident-marker { position:absolute; transform:translate(-50%,-50%); cursor:pointer; }
        .hospital-marker { position:absolute; transform:translate(-50%,-50%); }

        .detail-panel {
          position:absolute; top:12px; right:12px; bottom:12px;
          width:280px; background:rgba(10,10,10,.96);
          border:1px solid rgba(255,255,255,.1); border-radius:8px;
          backdrop-filter:blur(20px); overflow-y:auto;
          scrollbar-width:thin; scrollbar-color:rgba(232,0,29,.2) transparent;
        }

        /* scan line */
        .map-scan {
          position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(232,0,29,.25),transparent);
          animation:scan 4s linear infinite; pointer-events:none;
        }

        @media(max-width:900px){
          .sidebar    { display:none!important; }
          .bottom-bar { display:flex!important; }
          .map-wrap   { left:0!important; }
          .detail-panel { width:calc(100% - 24px); }
        }
      `}</style>

      <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>

        {/* ══ SIDEBAR ══ */}
        <aside className={`sidebar${sidebarOpen ? "" : " collapsed"}`}>
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
            <button onClick={() => setSidebarOpen(v=>!v)}
              style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:5, color:"rgba(240,237,232,.4)", cursor:"pointer", padding:5, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", marginLeft:"auto" }}>
              {sidebarOpen ? Icon.ChevL : Icon.ChevR}
            </button>
          </div>

          {sidebarOpen
            ? <div style={{ margin:"10px 12px 2px", background:"rgba(232,0,29,.07)", border:"1px solid rgba(232,0,29,.18)", borderRadius:6, padding:"7px 11px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span className="fm live-ind" style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", color:"#E8001D" }}>System Live</span>
                <span className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.35)" }}>23 hospitals</span>
              </div>
            : <div style={{ display:"flex", justifyContent:"center", padding:"8px 0 2px" }}>
                <div className="pulse-dot" style={{ width:7, height:7, borderRadius:"50%", background:"#E8001D" }} />
              </div>
          }

          {sidebarOpen && <div className="fm" style={{ fontSize:7, letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(240,237,232,.18)", padding:"10px 14px 3px" }}>Navigation</div>}

          <nav style={{ flex:1, padding:"4px 8px", display:"flex", flexDirection:"column", gap:1 }}>
            {NAV_TOP.map((item, idx) => {
              const isReport = item.id === "report";
              const isActive = active === item.id;
              return (
                <div key={item.id}>
                  {idx === 1 && <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"5px 4px" }} />}
                  <button className={`nav-item${isActive?" active":""}${isReport?" nav-report":""}`}
                    onClick={() => navigate(item)} title={!sidebarOpen ? item.label : undefined}>
                    <span style={{ flexShrink:0, opacity: isActive ? 1 : isReport ? .95 : .55, color: isReport&&!isActive ? "#E8001D" : "inherit" }}>{item.icon}</span>
                    {sidebarOpen && <>
                      <span style={{ flex:1, fontWeight: isReport ? 500 : 400 }}>{item.label}</span>
                      {isReport && !isActive && <span style={{ opacity:.45, color:"#E8001D" }}>{Icon.ExtLink}</span>}
                    </>}
                  </button>
                  {idx === 1 && <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"5px 4px" }} />}
                </div>
              );
            })}
          </nav>

          <div style={{ padding:"6px 8px 10px", borderTop:"1px solid rgba(255,255,255,.07)", display:"flex", flexDirection:"column", gap:1 }}>
            {NAV_BOTTOM.map(item => (
              <button key={item.id} className="nav-item" onClick={() => navigate(item)}
                title={!sidebarOpen ? item.label : undefined} style={{ opacity: item.id==="logout" ? .7 : 1 }}>
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

        {/* ══ MAP AREA ══ */}
        <div className="map-wrap" style={{ position:"fixed", top:0, bottom:0, left: sidebarOpen ? 242 : 62, right:0, transition:"left .22s cubic-bezier(.4,0,.2,1)" }}>

          {/* Topbar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:20, background:"rgba(8,8,8,.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, gap:12 }}>
            <div>
              <div className="fd" style={{ fontSize:21, letterSpacing:.5, lineHeight:1 }}>Live Map</div>
              <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.32)", letterSpacing:"1.5px", textTransform:"uppercase" }}>Lagos State · Real-Time Incident Tracking</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {/* Severity filters */}
              <div style={{ display:"flex", gap:6 }}>
                {(["CRITICAL","HIGH","MODERATE"] as const).map(s => (
                  <button key={s} className="filter-chip"
                    onClick={() => toggleSev(s)}
                    style={{
                      background: filterSev.includes(s) ? `${SEV_COLOR[s]}18` : "transparent",
                      borderColor: filterSev.includes(s) ? SEV_COLOR[s] : "rgba(255,255,255,.1)",
                      color: filterSev.includes(s) ? SEV_COLOR[s] : "rgba(240,237,232,.3)",
                      opacity: filterSev.includes(s) ? 1 : .5,
                    }}>
                    {s}
                  </button>
                ))}
              </div>
              <button className={`map-btn${showHospitals ? " active" : ""}`} onClick={() => setShowHospitals(v=>!v)} title="Toggle hospitals">
                {Icon.Layers}
              </button>
              <div style={{ position:"relative" }}>
                <button style={{ background:"none", border:"1px solid rgba(255,255,255,.08)", borderRadius:6, padding:"7px 9px", color:"rgba(240,237,232,.55)", cursor:"pointer", display:"flex", alignItems:"center" }}>
                  {Icon.Bell}
                </button>
                <span style={{ position:"absolute", top:-4, right:-4, width:16, height:16, background:"#E8001D", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span className="fm" style={{ fontSize:8, color:"#fff", fontWeight:700 }}>6</span>
                </span>
              </div>
            </div>
          </div>

          {/* Map canvas */}
          <div style={{ position:"absolute", inset:0, top:58, background:"#080c10", overflow:"hidden" }}>

            {/* Grid lines */}
            <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.06 }} viewBox="0 0 100 100" preserveAspectRatio="none">
              {[0,10,20,30,40,50,60,70,80,90,100].map(v=>(
                <g key={v}>
                  <line x1="0" y1={v} x2="100" y2={v} stroke="white" strokeWidth=".3"/>
                  <line x1={v} y1="0" x2={v} y2="100" stroke="white" strokeWidth=".3"/>
                </g>
              ))}
            </svg>

            {/* Road-like paths */}
            <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.08 }} viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 45 Q25 40 50 45 Q75 50 100 45" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M0 65 Q30 60 50 65 Q70 70 100 65" stroke="white" strokeWidth="1" fill="none"/>
              <path d="M35 0 Q38 25 40 50 Q42 75 38 100" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M65 0 Q68 25 66 50 Q64 75 67 100" stroke="white" strokeWidth="1" fill="none"/>
              <path d="M10 20 Q30 35 50 30 Q70 25 90 35" stroke="white" strokeWidth=".8" fill="none"/>
              <path d="M5 80 Q25 75 45 80 Q65 85 95 78" stroke="white" strokeWidth=".8" fill="none"/>
            </svg>

            {/* Scan line */}
            <div className="map-scan" />

            {/* Area tint (simulate Lagos geography) */}
            <div style={{ position:"absolute", left:"15%", top:"20%", width:"70%", height:"65%", background:"radial-gradient(ellipse, rgba(232,0,29,.03) 0%, transparent 70%)", pointerEvents:"none" }} />

            {/* Hospital markers */}
            {showHospitals && HOSPITALS.map(h => (
              <div key={h.id} className="hospital-marker" style={{ left:`${h.x}%`, top:`${h.y}%` }}>
                <div title={h.name} style={{ position:"relative" }}>
                  <div style={{ width:18, height:18, background:"rgba(34,197,94,.85)", borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #080c10", cursor:"pointer", transition:"transform .2s" }}
                    onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.2)")}
                    onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
                    <svg viewBox="0 0 10 10" width="10"><path d="M5 1v8M1 5h8" strokeWidth={2} stroke="white"/></svg>
                  </div>
                  {/* Hospital label */}
                  <div style={{ position:"absolute", top:"100%", left:"50%", transform:"translateX(-50%)", marginTop:4, whiteSpace:"nowrap", background:"rgba(8,12,16,.9)", border:"1px solid rgba(34,197,94,.3)", borderRadius:3, padding:"2px 6px" }}>
                    <div className="fm" style={{ fontSize:7, color:"#22c55e" }}>{h.name}</div>
                    <div className="fm" style={{ fontSize:7, color:"rgba(240,237,232,.4)" }}>{h.available} beds · {h.distance}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Incident markers */}
            {visibleIncidents.map(inc => (
              <div key={inc.id} className="incident-marker" style={{ left:`${inc.x}%`, top:`${inc.y}%` }}
                onClick={() => setSelected(inc)}>
                <div style={{ position:"relative", width:20, height:20 }}>
                  {/* Ping rings for INCOMING */}
                  {inc.status === "INCOMING" && <>
                    <div className="ping" style={{ position:"absolute", inset:-6, borderRadius:"50%", background:SEV_COLOR[inc.severity], opacity:.3 }} />
                    <div className="ping-slow" style={{ position:"absolute", inset:-10, borderRadius:"50%", background:SEV_COLOR[inc.severity], opacity:.15, animationDelay:".5s" }} />
                  </>}
                  {/* Dot */}
                  <div style={{
                    width:20, height:20, borderRadius:"50%",
                    background:SEV_COLOR[inc.severity],
                    border:`3px solid #080c10`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:`0 0 12px ${SEV_COLOR[inc.severity]}60`,
                    transition:"transform .2s",
                    transform: selectedIncident?.id === inc.id ? "scale(1.3)" : "scale(1)",
                  }}>
                    <span style={{ fontFamily:"'Bebas Neue'", fontSize:9, color:"#fff", lineHeight:1 }}>{inc.victims}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Map controls */}
            <div style={{ position:"absolute", right:selectedIncident ? 304 : 16, bottom:16, display:"flex", flexDirection:"column", gap:6, transition:"right .3s" }}>
              <button className="map-btn" onClick={() => setZoom(z => Math.min(z+.25, 2))} title="Zoom in">{Icon.ZoomIn}</button>
              <button className="map-btn" onClick={() => setZoom(z => Math.max(z-.25, .5))} title="Zoom out">{Icon.ZoomOut}</button>
              <button className="map-btn" title="Center">{Icon.Crosshair}</button>
            </div>

            {/* Legend */}
            <div style={{ position:"absolute", left:12, bottom:12, background:"rgba(8,12,16,.9)", border:"1px solid rgba(255,255,255,.08)", borderRadius:6, padding:"10px 14px", display:"flex", flexDirection:"column", gap:6 }}>
              <div className="fm" style={{ fontSize:8, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(240,237,232,.3)", marginBottom:2 }}>Legend</div>
              {[["CRITICAL","#E8001D"],["HIGH","#ff7800"],["MODERATE","#e0b800"]].map(([l,c])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:c, boxShadow:`0 0 6px ${c}80` }} />
                  <span className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.55)" }}>{l}</span>
                </div>
              ))}
              <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"2px 0" }} />
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:"rgba(34,197,94,.85)" }} />
                <span className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.55)" }}>Hospital</span>
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", bottom:12, background:"rgba(8,12,16,.9)", border:"1px solid rgba(255,255,255,.08)", borderRadius:6, padding:"8px 16px", display:"flex", gap:20 }}>
              {[
                { label:"Active", value: INCIDENTS.filter(i=>i.status!=="RESOLVED").length.toString(), color:"#E8001D" },
                { label:"Critical", value: INCIDENTS.filter(i=>i.severity==="CRITICAL").length.toString(), color:"#E8001D" },
                { label:"Hospitals", value: HOSPITALS.length.toString(), color:"#22c55e" },
                { label:"Zoom", value:`${Math.round(zoom*100)}%`, color:"rgba(240,237,232,.5)" },
              ].map(s => (
                <div key={s.label} style={{ textAlign:"center" }}>
                  <div className="fd" style={{ fontSize:20, color:s.color, lineHeight:1 }}>{s.value}</div>
                  <div className="fm" style={{ fontSize:7, color:"rgba(240,237,232,.35)", letterSpacing:"1px", textTransform:"uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            {selectedIncident && (
              <div className="detail-panel slide-right">
                <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div className="fd" style={{ fontSize:16, color: SEV_COLOR[selectedIncident.severity] }}>{selectedIncident.severity}</div>
                    <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.35)", letterSpacing:"1px" }}>ID: {selectedIncident.id}</div>
                  </div>
                  <button onClick={() => setSelected(null)}
                    style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:4, color:"rgba(240,237,232,.5)", cursor:"pointer", padding:6, display:"flex" }}>
                    {Icon.Close}
                  </button>
                </div>

                <div style={{ padding:16, display:"flex", flexDirection:"column", gap:14 }}>
                  {/* Pulsing severity */}
                  <div style={{ background:`${SEV_COLOR[selectedIncident.severity]}10`, border:`1px solid ${SEV_COLOR[selectedIncident.severity]}30`, borderRadius:6, padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
                    <div className="pulse-dot" style={{ width:8, height:8, borderRadius:"50%", background:SEV_COLOR[selectedIncident.severity], flexShrink:0 }} />
                    <div>
                      <div className="fm" style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", color:SEV_COLOR[selectedIncident.severity] }}>{selectedIncident.status}</div>
                      <div style={{ fontSize:13, fontWeight:500, marginTop:2 }}>{selectedIncident.location}</div>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {[
                      { label:"Victims",  value: selectedIncident.victims.toString() },
                      { label:"Reported", value: selectedIncident.time },
                      { label:"Severity", value: selectedIncident.severity },
                      { label:"AI Triage",value: "Active" },
                    ].map(d => (
                      <div key={d.label} style={{ background:"rgba(255,255,255,.03)", borderRadius:5, padding:"10px 12px" }}>
                        <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.3)", letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>{d.label}</div>
                        <div style={{ fontSize:14, fontWeight:500, color: d.label==="Severity" ? SEV_COLOR[selectedIncident.severity] : "#f0ede8" }}>{d.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Nearest hospitals */}
                  <div>
                    <div className="fm" style={{ fontSize:8, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(240,237,232,.3)", marginBottom:10 }}>Nearest Hospitals</div>
                    {HOSPITALS.slice(0,3).map(h => (
                      <div key={h.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:6, height:6, borderRadius:1, background:"#22c55e", flexShrink:0 }} />
                          <span style={{ fontSize:12 }}>{h.name}</span>
                        </div>
                        <span className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.4)" }}>{h.distance}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {selectedIncident.status !== "RESOLVED" && (
                      <button className="fm"
                        style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", background:"#E8001D", color:"#fff", border:"none", padding:"12px", borderRadius:5, cursor:"pointer", transition:"all .2s", fontWeight:700 }}
                        onMouseEnter={e=>(e.currentTarget.style.background="#ff0022")}
                        onMouseLeave={e=>(e.currentTarget.style.background="#E8001D")}>
                        Dispatch Ambulance
                      </button>
                    )}
                    <button className="fm"
                      style={{ fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", background:"transparent", color:"rgba(240,237,232,.5)", border:"1px solid rgba(255,255,255,.12)", padding:"10px", borderRadius:5, cursor:"pointer", transition:"all .2s" }}
                      onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.color="#f0ede8"; (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,.25)"; }}
                      onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.color="rgba(240,237,232,.5)"; (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,.12)"; }}>
                      View Live Stream
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ MOBILE BOTTOM BAR ══ */}
      <nav className="bottom-bar">
        {BOTTOM_BAR.map(item => {
          const isReport = item.id === "report";
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => navigate(item)}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", gap: isReport?0:3, background:"none", border:"none", cursor:"pointer", padding: isReport?"0 4px 2px":"8px 4px 2px", color: isActive?"#E8001D":"rgba(240,237,232,.38)", transition:"color .17s", position:"relative", minWidth:0 }}>
              {isReport ? (
                <div style={{ width:50, height:50, borderRadius:"50%", background: isActive?"#E8001D":"#150205", border:`2px solid ${isActive?"#ff3333":"rgba(232,0,29,.5)"}`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", boxShadow: isActive?"0 0 0 4px rgba(232,0,29,.15),0 6px 20px rgba(232,0,29,.4)":"0 4px 16px rgba(232,0,29,.25)", transform:"translateY(-12px)", transition:"all .2s", flexShrink:0 }}>
                  {item.icon}
                </div>
              ) : (
                <>
                  <span style={{ opacity: isActive?1:.55 }}>{item.icon}</span>
                  <span className="fm" style={{ fontSize:8, letterSpacing:".5px", textTransform:"uppercase", marginTop:2 }}>{item.label}</span>
                  {isActive && <span style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:20, height:2, background:"#E8001D", borderRadius:"0 0 2px 2px" }} />}
                </>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}