"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type NavItem   = { id: string; label: string; icon: React.ReactNode; href: string };
type Status    = "On Scene" | "En Route" | "Standby" | "Offline";
type Responder = { id: string; unit: string; org: string; status: Status; location: string; eta?: string; alert?: string; phone: string; crew: number };

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
  Phone:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={14}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Dispatch:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={14}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Alert:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={14}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Grid:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  List:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
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

const RESPONDERS: Responder[] = [
  { id:"R01", unit:"Unit 7",  org:"LASAMBUS", status:"En Route",  location:"Ikeja, Allen Ave",      eta:"3 min",  alert:"A003", phone:"+234 801 000 0007", crew:3 },
  { id:"R02", unit:"Unit 11", org:"LASG",     status:"On Scene",  location:"Lagos Island, Marina",  eta:undefined, alert:"A001", phone:"+234 801 000 0011", crew:4 },
  { id:"R03", unit:"Unit 3",  org:"FRSC",     status:"Standby",   location:"Surulere Base",         eta:undefined, alert:undefined, phone:"+234 801 000 0003", crew:2 },
  { id:"R04", unit:"Unit 2",  org:"LASAMBUS", status:"Standby",   location:"Oshodi Depot",          eta:undefined, alert:undefined, phone:"+234 801 000 0002", crew:3 },
  { id:"R05", unit:"Unit 9",  org:"FRSC",     status:"En Route",  location:"Lekki Phase 1",         eta:"6 min",  alert:"A004", phone:"+234 801 000 0009", crew:2 },
  { id:"R06", unit:"Unit 15", org:"LASAMBUS", status:"On Scene",  location:"Surulere, Aguda",       eta:undefined, alert:"A002", phone:"+234 801 000 0015", crew:4 },
  { id:"R07", unit:"Unit 4",  org:"LASG",     status:"Standby",   location:"Yaba HQ",               eta:undefined, alert:undefined, phone:"+234 801 000 0004", crew:3 },
  { id:"R08", unit:"Unit 12", org:"FRSC",     status:"Offline",   location:"—",                     eta:undefined, alert:undefined, phone:"+234 801 000 0012", crew:0 },
];

const STATUS_COLOR: Record<Status, string> = {
  "On Scene": "#E8001D",
  "En Route": "#ff7800",
  "Standby":  "#22c55e",
  "Offline":  "rgba(240,237,232,.2)",
};
const STATUS_BG: Record<Status, string> = {
  "On Scene": "rgba(232,0,29,.12)",
  "En Route": "rgba(255,120,0,.1)",
  "Standby":  "rgba(34,197,94,.1)",
  "Offline":  "rgba(255,255,255,.04)",
};

export default function RespondersPage() {
  const [active]                        = useState("responders");
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [view, setView]                 = useState<"grid"|"list">("grid");
  const [filterStatus, setFilterStatus] = useState<Status | "ALL">("ALL");
  const [selected, setSelected]         = useState<Responder | null>(null);
  const router = useRouter();

  const navigate = (item: NavItem) => router.push(item.href);

  const visible = filterStatus === "ALL"
    ? RESPONDERS
    : RESPONDERS.filter(r => r.status === filterStatus);

  const counts = {
    total:    RESPONDERS.length,
    onScene:  RESPONDERS.filter(r=>r.status==="On Scene").length,
    enRoute:  RESPONDERS.filter(r=>r.status==="En Route").length,
    standby:  RESPONDERS.filter(r=>r.status==="Standby").length,
    offline:  RESPONDERS.filter(r=>r.status==="Offline").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; background:#080808; color:#f0ede8; font-family:'DM Sans',sans-serif; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(232,0,29,.25); border-radius:2px; }
        .fd { font-family:'Bebas Neue',sans-serif; }
        .fm { font-family:'Space Mono',monospace; }

        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.75)} }
        @keyframes ping      { 0%{transform:scale(1);opacity:.75} 100%{transform:scale(2.4);opacity:0} }
        @keyframes fade-in   { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }

        .pulse-dot { animation:pulse-dot 1.8s infinite; }
        .ping      { animation:ping 1.6s infinite; }
        .fade-in   { animation:fade-in .4s ease both; }

        .live-ind::before {
          content:''; display:inline-block; width:6px; height:6px;
          background:#E8001D; border-radius:50%; margin-right:7px;
          animation:pulse-dot 1.4s infinite;
        }

        .nav-item {
          width:100%; display:flex; align-items:center; gap:10px;
          padding:9px 12px; border-radius:6px; font-size:13px;
          color:rgba(240,237,232,.5); cursor:pointer; transition:all .17s;
          position:relative; border:1px solid transparent;
          background:none; text-align:left;
        }
        .nav-item:hover  { color:#f0ede8; background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.06); }
        .nav-item.active { color:#f0ede8; background:rgba(232,0,29,.1); border-color:rgba(232,0,29,.22); }
        .nav-item.active::before {
          content:''; position:absolute; left:-1px; top:50%; transform:translateY(-50%);
          width:3px; height:52%; background:#E8001D; border-radius:0 2px 2px 0;
        }
        .nav-report { color:rgba(240,237,232,.8)!important; background:rgba(232,0,29,.07)!important; border-color:rgba(232,0,29,.16)!important; }
        .nav-report:hover  { background:rgba(232,0,29,.13)!important; }
        .nav-report.active { background:rgba(232,0,29,.17)!important; border-color:rgba(232,0,29,.38)!important; }

        .sidebar {
          position:fixed; top:0; left:0; bottom:0; width:242px;
          background:#0a0a0a; border-right:1px solid rgba(255,255,255,.07);
          display:flex; flex-direction:column;
          transition:width .22s cubic-bezier(.4,0,.2,1); z-index:50; overflow:hidden;
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

        .responder-card {
          background:#0f0f0f; border:1px solid rgba(255,255,255,.07);
          border-radius:8px; padding:18px; transition:all .2s; cursor:pointer;
          position:relative; overflow:hidden;
        }
        .responder-card:hover { border-color:rgba(255,255,255,.15); transform:translateY(-1px); }
        .responder-card.selected { border-color:rgba(232,0,29,.4); background:rgba(232,0,29,.04); }
        .responder-card::after {
          content:''; position:absolute; bottom:0; left:0; right:0;
          height:2px; background:#E8001D;
          transform:scaleX(0); transform-origin:left; transition:transform .3s;
        }
        .responder-card:hover::after { transform:scaleX(1); }

        .responder-row {
          display:grid; grid-template-columns:180px 120px 1fr 100px auto;
          gap:16px; align-items:center;
          padding:12px 16px; border-radius:6px;
          border:1px solid rgba(255,255,255,.06); background:#0d0d0d;
          transition:all .2s; cursor:pointer;
        }
        .responder-row:hover { border-color:rgba(255,255,255,.13); background:#111; }
        .responder-row.selected { border-color:rgba(232,0,29,.35); background:rgba(232,0,29,.04); }

        .status-badge {
          font-family:'Space Mono',monospace; font-size:8px; letter-spacing:1px;
          text-transform:uppercase; padding:4px 8px; border-radius:3px;
          font-weight:700; border:1px solid; white-space:nowrap;
        }

        .action-btn {
          font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1.5px;
          text-transform:uppercase; padding:7px 12px; border-radius:4px;
          cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:6px;
          white-space:nowrap; border:1px solid;
        }

        .filter-tab {
          font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1px;
          text-transform:uppercase; padding:6px 14px; border-radius:4px;
          cursor:pointer; transition:all .2s; border:1px solid rgba(255,255,255,.08);
          background:transparent; color:rgba(240,237,232,.4);
        }
        .filter-tab:hover { color:#f0ede8; border-color:rgba(255,255,255,.18); }
        .filter-tab.active { background:rgba(232,0,29,.12); border-color:rgba(232,0,29,.35); color:#E8001D; }

        @media(max-width:900px) {
          .sidebar      { display:none!important; }
          .bottom-bar   { display:flex!important; }
          .main-content { margin-left:0!important; padding-bottom:90px!important; }
          .responder-row { grid-template-columns:1fr auto; }
          .row-loc, .row-eta, .row-actions { display:none!important; }
        }
        @media(max-width:640px) {
          .card-grid { grid-template-columns:1fr!important; }
        }

        .main-scroll { height:100vh; overflow-y:auto; }
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
                    <span style={{ flexShrink:0, opacity: isActive?1:isReport?.95:.55, color: isReport&&!isActive?"#E8001D":"inherit" }}>{item.icon}</span>
                    {sidebarOpen && <>
                      <span style={{ flex:1, fontWeight: isReport?500:400 }}>{item.label}</span>
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
                title={!sidebarOpen ? item.label : undefined} style={{ opacity: item.id==="logout"?.7:1 }}>
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
        <main className="main-content main-scroll"
          style={{ flex:1, marginLeft: sidebarOpen?242:62, transition:"margin-left .22s cubic-bezier(.4,0,.2,1)", background:"#080808" }}>

          {/* Topbar */}
          <div style={{ position:"sticky", top:0, zIndex:40, background:"rgba(8,8,8,.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, gap:12 }}>
            <div>
              <div className="fd" style={{ fontSize:21, letterSpacing:.5, lineHeight:1 }}>Responder View</div>
              <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.32)", letterSpacing:"1.5px", textTransform:"uppercase" }}>Lagos State · {counts.total} Units Registered</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {/* View toggle */}
              <div style={{ display:"flex", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:5, padding:2, gap:2 }}>
                {(["grid","list"] as const).map(v => (
                  <button key={v} onClick={() => setView(v)}
                    style={{ background: view===v ? "rgba(232,0,29,.15)" : "transparent", border: view===v ? "1px solid rgba(232,0,29,.3)" : "1px solid transparent", borderRadius:4, color: view===v ? "#E8001D" : "rgba(240,237,232,.4)", cursor:"pointer", padding:6, display:"flex", transition:"all .2s" }}>
                    {v==="grid" ? Icon.Grid : Icon.List}
                  </button>
                ))}
              </div>
              <div style={{ position:"relative" }}>
                <button style={{ background:"none", border:"1px solid rgba(255,255,255,.08)", borderRadius:6, padding:"7px 9px", color:"rgba(240,237,232,.55)", cursor:"pointer", display:"flex", alignItems:"center" }}>
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

          <div style={{ padding:"22px 28px", display:"flex", flexDirection:"column", gap:20 }}>

            {/* Status summary */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:13 }}>
              {[
                { label:"On Scene",  value: counts.onScene,  color:"#E8001D" },
                { label:"En Route",  value: counts.enRoute,  color:"#ff7800" },
                { label:"Standby",   value: counts.standby,  color:"#22c55e" },
                { label:"Offline",   value: counts.offline,  color:"rgba(240,237,232,.25)" },
              ].map((s, i) => (
                <div key={s.label} className="fade-in" style={{ background:"#0f0f0f", border:`1px solid ${s.color}22`, borderRadius:8, padding:"18px 20px", animationDelay:`${i*60}ms`, cursor:"pointer", transition:"all .2s" }}
                  onClick={() => setFilterStatus(s.label as Status)}
                  onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-1px)")}
                  onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <div style={{ position:"relative", width:8, height:8 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:s.color }} />
                      {s.label!=="Offline" && <div className="ping" style={{ position:"absolute", inset:0, borderRadius:"50%", background:s.color }} />}
                    </div>
                    <span className="fm" style={{ fontSize:8, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(240,237,232,.4)" }}>{s.label}</span>
                  </div>
                  <div className="fd" style={{ fontSize:44, lineHeight:1, color:s.color }}>{s.value}</div>
                  <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.25)", marginTop:4, textTransform:"uppercase", letterSpacing:"1px" }}>
                    {Math.round((s.value/counts.total)*100)}% of fleet
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
              <div style={{ display:"flex", gap:6 }}>
                {(["ALL","On Scene","En Route","Standby","Offline"] as const).map(f => (
                  <button key={f} className={`filter-tab${filterStatus===f?" active":""}`}
                    onClick={() => setFilterStatus(f)}>
                    {f}
                    {f !== "ALL" && <span style={{ marginLeft:5, opacity:.6 }}>({RESPONDERS.filter(r=>r.status===f).length})</span>}
                  </button>
                ))}
              </div>
              <div className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.3)", letterSpacing:"1px" }}>
                {visible.length} unit{visible.length!==1?"s":""} shown
              </div>
            </div>

            {/* Grid view */}
            {view === "grid" && (
              <div className="card-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
                {visible.map((r, i) => (
                  <div key={r.id} className={`responder-card fade-in${selected?.id===r.id?" selected":""}`}
                    style={{ animationDelay:`${i*50}ms` }}
                    onClick={() => setSelected(r.id===selected?.id ? null : r)}>

                    {/* Header */}
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
                      <div>
                        <div className="fd" style={{ fontSize:20, lineHeight:1 }}>{r.unit}</div>
                        <div className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.4)", letterSpacing:"1px", textTransform:"uppercase", marginTop:2 }}>{r.org}</div>
                      </div>
                      <span className="status-badge" style={{
                        color:       STATUS_COLOR[r.status],
                        background:  STATUS_BG[r.status],
                        borderColor: `${STATUS_COLOR[r.status]}50`,
                      }}>
                        {r.status}
                      </span>
                    </div>

                    {/* Live indicator */}
                    {r.status !== "Offline" && (
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
                        <div style={{ position:"relative", width:7, height:7 }}>
                          <div style={{ width:7, height:7, borderRadius:"50%", background:STATUS_COLOR[r.status] }} />
                          {r.status==="On Scene"&&<div className="ping" style={{ position:"absolute", inset:0, borderRadius:"50%", background:STATUS_COLOR[r.status] }}/>}
                        </div>
                        <span style={{ fontSize:12, color:"rgba(240,237,232,.6)" }}>{r.location}</span>
                      </div>
                    )}

                    {/* Alert tag */}
                    {r.alert && (
                      <div style={{ background:"rgba(232,0,29,.08)", border:"1px solid rgba(232,0,29,.2)", borderRadius:4, padding:"5px 10px", marginBottom:12, display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ color:"#E8001D", flexShrink:0 }}>{Icon.Alert}</span>
                        <span className="fm" style={{ fontSize:9, color:"#E8001D", letterSpacing:"1px" }}>Alert {r.alert}</span>
                        {r.eta && <span className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.4)", marginLeft:"auto" }}>ETA {r.eta}</span>}
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12, borderTop:"1px solid rgba(255,255,255,.05)" }}>
                      <div className="fm" style={{ fontSize:9, color:"rgba(240,237,232,.35)" }}>
                        {r.crew} crew · {r.id}
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="action-btn"
                          style={{ background:"none", borderColor:"rgba(255,255,255,.1)", color:"rgba(240,237,232,.5)" }}
                          onClick={e=>{e.stopPropagation();}}
                          onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.color="#f0ede8"; (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,.25)"; }}
                          onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.color="rgba(240,237,232,.5)"; (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,.1)"; }}>
                          {Icon.Phone}
                        </button>
                        {r.status === "Standby" && (
                          <button className="action-btn"
                            style={{ background:"rgba(232,0,29,.12)", borderColor:"rgba(232,0,29,.3)", color:"#E8001D" }}
                            onClick={e=>{e.stopPropagation();}}
                            onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background="rgba(232,0,29,.22)"; }}
                            onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background="rgba(232,0,29,.12)"; }}>
                            {Icon.Dispatch} Dispatch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List view */}
            {view === "list" && (
              <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, overflow:"hidden" }}>
                {/* Column headers */}
                <div className="fm" style={{ display:"grid", gridTemplateColumns:"180px 120px 1fr 100px auto", gap:16, padding:"9px 16px", fontSize:8, letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(240,237,232,.2)", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
                  <span>Unit</span><span>Status</span><span className="row-loc">Location</span><span className="row-eta">ETA</span><span className="row-actions">Actions</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:2, padding:6 }}>
                  {visible.map((r, i) => (
                    <div key={r.id} className={`responder-row fade-in${selected?.id===r.id?" selected":""}`}
                      style={{ animationDelay:`${i*45}ms` }}
                      onClick={() => setSelected(r.id===selected?.id ? null : r)}>

                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:"50%", background:`${STATUS_COLOR[r.status]}18`, border:`1px solid ${STATUS_COLOR[r.status]}40`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <span style={{ color:STATUS_COLOR[r.status], opacity:.9 }}>{Icon.Responders}</span>
                        </div>
                        <div>
                          <div style={{ fontWeight:500, fontSize:13 }}>{r.unit}</div>
                          <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.35)", letterSpacing:"1px", textTransform:"uppercase" }}>{r.org} · {r.crew} crew</div>
                        </div>
                      </div>

                      <div>
                        <span className="status-badge" style={{ color:STATUS_COLOR[r.status], background:STATUS_BG[r.status], borderColor:`${STATUS_COLOR[r.status]}50` }}>
                          {r.status}
                        </span>
                      </div>

                      <div className="row-loc" style={{ fontSize:13, color:"rgba(240,237,232,.65)" }}>{r.location}</div>

                      <div className="row-eta">
                        {r.eta
                          ? <span className="fm" style={{ fontSize:10, color:"#ff7800" }}>{r.eta}</span>
                          : <span className="fm" style={{ fontSize:10, color:"rgba(240,237,232,.2)" }}>—</span>
                        }
                      </div>

                      <div className="row-actions" style={{ display:"flex", gap:6 }}>
                        <button className="action-btn"
                          style={{ background:"none", borderColor:"rgba(255,255,255,.1)", color:"rgba(240,237,232,.5)" }}
                          onClick={e=>{e.stopPropagation();}}>
                          {Icon.Phone}
                        </button>
                        {r.status === "Standby" && (
                          <button className="action-btn"
                            style={{ background:"rgba(232,0,29,.12)", borderColor:"rgba(232,0,29,.3)", color:"#E8001D" }}
                            onClick={e=>{e.stopPropagation();}}>
                            {Icon.Dispatch} Dispatch
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detail drawer (shows below on click) */}
            {selected && (
              <div className="fade-in" style={{ background:"#0a0a0a", border:`1px solid ${STATUS_COLOR[selected.status]}30`, borderRadius:8, padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:"50%", background:`${STATUS_COLOR[selected.status]}18`, border:`1px solid ${STATUS_COLOR[selected.status]}40`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ color:STATUS_COLOR[selected.status] }}>{Icon.Responders}</span>
                    </div>
                    <div>
                      <div className="fd" style={{ fontSize:24, lineHeight:1 }}>{selected.unit} — {selected.org}</div>
                      <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.35)", letterSpacing:"1px", textTransform:"uppercase", marginTop:2 }}>{selected.id} · {selected.crew} crew members</div>
                    </div>
                  </div>
                  <span className="status-badge" style={{ color:STATUS_COLOR[selected.status], background:STATUS_BG[selected.status], borderColor:`${STATUS_COLOR[selected.status]}50`, fontSize:10, padding:"5px 12px" }}>
                    {selected.status}
                  </span>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
                  {[
                    { label:"Location", value: selected.location },
                    { label:"Phone",    value: selected.phone },
                    { label:"Alert",    value: selected.alert ?? "None" },
                    { label:"ETA",      value: selected.eta ?? "N/A" },
                  ].map(d => (
                    <div key={d.label} style={{ background:"rgba(255,255,255,.03)", borderRadius:6, padding:"12px 14px" }}>
                      <div className="fm" style={{ fontSize:8, color:"rgba(240,237,232,.3)", letterSpacing:"1px", textTransform:"uppercase", marginBottom:5 }}>{d.label}</div>
                      <div style={{ fontSize:13, fontWeight:500, color: d.label==="Alert"&&selected.alert ? "#E8001D" : "#f0ede8" }}>{d.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", gap:10 }}>
                  {selected.status === "Standby" && (
                    <button className="action-btn fm"
                      style={{ background:"#E8001D", borderColor:"#E8001D", color:"#fff", padding:"10px 20px", fontSize:10 }}
                      onMouseEnter={e=>(e.currentTarget.style.background="#ff0022")}
                      onMouseLeave={e=>(e.currentTarget.style.background="#E8001D")}>
                      {Icon.Dispatch} Dispatch Unit
                    </button>
                  )}
                  <button className="action-btn fm"
                    style={{ background:"none", borderColor:"rgba(255,255,255,.15)", color:"rgba(240,237,232,.6)", padding:"10px 20px", fontSize:10 }}>
                    {Icon.Phone} Call Unit
                  </button>
                  <button className="action-btn fm"
                    style={{ background:"none", borderColor:"rgba(255,255,255,.15)", color:"rgba(240,237,232,.6)", padding:"10px 20px", fontSize:10 }}>
                    {Icon.Map} Track on Map
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ══ MOBILE BOTTOM BAR ══ */}
      <nav className="bottom-bar">
        {BOTTOM_BAR.map(item => {
          const isReport = item.id === "report";
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => navigate(item)}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", gap:isReport?0:3, background:"none", border:"none", cursor:"pointer", padding:isReport?"0 4px 2px":"8px 4px 2px", color:isActive?"#E8001D":"rgba(240,237,232,.38)", transition:"color .17s", position:"relative", minWidth:0 }}>
              {isReport ? (
                <div style={{ width:50, height:50, borderRadius:"50%", background:isActive?"#E8001D":"#150205", border:`2px solid ${isActive?"#ff3333":"rgba(232,0,29,.5)"}`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", boxShadow:isActive?"0 0 0 4px rgba(232,0,29,.15),0 6px 20px rgba(232,0,29,.4)":"0 4px 16px rgba(232,0,29,.25)", transform:"translateY(-12px)", transition:"all .2s", flexShrink:0 }}>
                  {item.icon}
                </div>
              ) : (
                <>
                  <span style={{ opacity:isActive?1:.55 }}>{item.icon}</span>
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