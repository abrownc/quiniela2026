import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "gol2026";
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── GRUPOS REALES ────────────────────────────────────────────────────────────
const GROUPS = {
  A: ["México","Sudáfrica","Corea del Sur","Rep. Checa"],
  B: ["Canadá","Bosnia-Herz.","Catar","Suiza"],
  C: ["Brasil","Marruecos","Haití","Escocia"],
  D: ["EUA","Paraguay","Australia","Turquía"],
  E: ["Alemania","Curazao","Costa de Marfil","Ecuador"],
  F: ["Países Bajos","Japón","Suecia","Túnez"],
  G: ["Bélgica","Egipto","Irán","Nueva Zelanda"],
  H: ["España","Cabo Verde","Arabia Saudita","Uruguay"],
  I: ["Francia","Senegal","Iraq","Noruega"],
  J: ["Argentina","Argelia","Austria","Jordania"],
  K: ["Portugal","DR Congo","Uzbekistán","Colombia"],
  L: ["Inglaterra","Croacia","Ghana","Panamá"],
};

// Todos los partidos con fechas correctas verificadas de Yahoo Sports / FIFA
// date = "YYYY-MM-DD" para comparación; label = texto para mostrar
const ALL_MATCHES = [
  // ── JORNADA 1 ──
  // Jun 11
  { id:"a1", g:"A", home:"México",        away:"Sudáfrica",     date:"2026-06-11", label:"Jun 11", md:1 },
  { id:"a2", g:"A", home:"Corea del Sur", away:"Rep. Checa",    date:"2026-06-11", label:"Jun 11", md:1 },
  // Jun 12
  { id:"b1", g:"B", home:"Canadá",        away:"Bosnia-Herz.",  date:"2026-06-12", label:"Jun 12", md:1 },
  { id:"d1", g:"D", home:"EUA",           away:"Paraguay",      date:"2026-06-12", label:"Jun 12", md:1 },
  // Jun 13
  { id:"b2", g:"B", home:"Suiza",         away:"Catar",         date:"2026-06-13", label:"Jun 13", md:1 },
  { id:"c1", g:"C", home:"Brasil",        away:"Marruecos",     date:"2026-06-13", label:"Jun 13", md:1 },
  { id:"c2", g:"C", home:"Escocia",       away:"Haití",         date:"2026-06-13", label:"Jun 13", md:1 },
  { id:"d2", g:"D", home:"Australia",     away:"Turquía",       date:"2026-06-13", label:"Jun 13", md:1 },
  // Jun 14
  { id:"e1", g:"E", home:"Alemania",      away:"Curazao",       date:"2026-06-14", label:"Jun 14", md:1 },
  { id:"e2", g:"E", home:"Costa de Marfil",away:"Ecuador",      date:"2026-06-14", label:"Jun 14", md:1 },
  { id:"f1", g:"F", home:"Países Bajos",  away:"Japón",         date:"2026-06-14", label:"Jun 14", md:1 },
  { id:"f2", g:"F", home:"Suecia",        away:"Túnez",         date:"2026-06-14", label:"Jun 14", md:1 },
  // Jun 15
  { id:"g1", g:"G", home:"Bélgica",       away:"Egipto",        date:"2026-06-15", label:"Jun 15", md:1 },
  { id:"g2", g:"G", home:"Irán",          away:"Nueva Zelanda", date:"2026-06-15", label:"Jun 15", md:1 },
  { id:"h1", g:"H", home:"España",        away:"Cabo Verde",    date:"2026-06-15", label:"Jun 15", md:1 },
  { id:"h2", g:"H", home:"Arabia Saudita",away:"Uruguay",       date:"2026-06-15", label:"Jun 15", md:1 },
  // Jun 16
  { id:"i1", g:"I", home:"Francia",       away:"Senegal",       date:"2026-06-16", label:"Jun 16", md:1 },
  { id:"i2", g:"I", home:"Iraq",          away:"Noruega",       date:"2026-06-16", label:"Jun 16", md:1 },
  { id:"j1", g:"J", home:"Argentina",     away:"Argelia",       date:"2026-06-16", label:"Jun 16", md:1 },
  { id:"j2", g:"J", home:"Austria",       away:"Jordania",      date:"2026-06-17", label:"Jun 17", md:1 }, // 12am local = Jun 17
  // Jun 17
  { id:"k1", g:"K", home:"Portugal",      away:"DR Congo",      date:"2026-06-17", label:"Jun 17", md:1 },
  { id:"k2", g:"K", home:"Uzbekistán",    away:"Colombia",      date:"2026-06-17", label:"Jun 17", md:1 },
  { id:"l1", g:"L", home:"Inglaterra",    away:"Croacia",       date:"2026-06-17", label:"Jun 17", md:1 },
  { id:"l2", g:"L", home:"Ghana",         away:"Panamá",        date:"2026-06-17", label:"Jun 17", md:1 },

  // ── JORNADA 2 ──
  // Jun 18
  { id:"a3", g:"A", home:"Rep. Checa",    away:"Sudáfrica",     date:"2026-06-18", label:"Jun 18", md:2 },
  { id:"a4", g:"A", home:"México",        away:"Corea del Sur", date:"2026-06-18", label:"Jun 18", md:2 },
  { id:"b3", g:"B", home:"Suiza",         away:"Bosnia-Herz.",  date:"2026-06-18", label:"Jun 18", md:2 },
  { id:"b4", g:"B", home:"Canadá",        away:"Catar",         date:"2026-06-18", label:"Jun 18", md:2 },
  // Jun 19
  { id:"c3", g:"C", home:"Escocia",       away:"Marruecos",     date:"2026-06-19", label:"Jun 19", md:2 },
  { id:"c4", g:"C", home:"Brasil",        away:"Haití",         date:"2026-06-19", label:"Jun 19", md:2 },
  { id:"d3", g:"D", home:"EUA",           away:"Australia",     date:"2026-06-19", label:"Jun 19", md:2 },
  { id:"d4", g:"D", home:"Turquía",       away:"Paraguay",      date:"2026-06-19", label:"Jun 19", md:2 },
  // Jun 20
  { id:"e3", g:"E", home:"Alemania",      away:"Costa de Marfil",date:"2026-06-20", label:"Jun 20", md:2 },
  { id:"e4", g:"E", home:"Ecuador",       away:"Curazao",       date:"2026-06-20", label:"Jun 20", md:2 },
  { id:"f3", g:"F", home:"Países Bajos",  away:"Suecia",        date:"2026-06-20", label:"Jun 20", md:2 },
  { id:"f4", g:"F", home:"Túnez",         away:"Japón",         date:"2026-06-20", label:"Jun 20", md:2 },
  // Jun 21
  { id:"g3", g:"G", home:"Bélgica",       away:"Irán",          date:"2026-06-21", label:"Jun 21", md:2 },
  { id:"g4", g:"G", home:"Nueva Zelanda", away:"Egipto",        date:"2026-06-21", label:"Jun 21", md:2 },
  { id:"h3", g:"H", home:"España",        away:"Arabia Saudita",date:"2026-06-21", label:"Jun 21", md:2 },
  { id:"h4", g:"H", home:"Uruguay",       away:"Cabo Verde",    date:"2026-06-21", label:"Jun 21", md:2 },
  // Jun 22
  { id:"i3", g:"I", home:"Francia",       away:"Iraq",          date:"2026-06-22", label:"Jun 22", md:2 },
  { id:"i4", g:"I", home:"Noruega",       away:"Senegal",       date:"2026-06-22", label:"Jun 22", md:2 },
  { id:"j3", g:"J", home:"Argentina",     away:"Austria",       date:"2026-06-22", label:"Jun 22", md:2 },
  { id:"j4", g:"J", home:"Jordania",      away:"Argelia",       date:"2026-06-22", label:"Jun 22", md:2 },
  // Jun 23
  { id:"k3", g:"K", home:"Portugal",      away:"Uzbekistán",    date:"2026-06-23", label:"Jun 23", md:2 },
  { id:"k4", g:"K", home:"Colombia",      away:"DR Congo",      date:"2026-06-23", label:"Jun 23", md:2 },
  { id:"l3", g:"L", home:"Ghana",         away:"Croacia",       date:"2026-06-23", label:"Jun 23", md:2 },
  { id:"l4", g:"L", home:"Inglaterra",    away:"Panamá",        date:"2026-06-23", label:"Jun 23", md:2 },

  // ── JORNADA 3 ──
  // Jun 24
  { id:"a5", g:"A", home:"Rep. Checa",    away:"México",        date:"2026-06-24", label:"Jun 24", md:3 },
  { id:"a6", g:"A", home:"Sudáfrica",     away:"Corea del Sur", date:"2026-06-24", label:"Jun 24", md:3 },
  { id:"b5", g:"B", home:"Suiza",         away:"Canadá",        date:"2026-06-24", label:"Jun 24", md:3 },
  { id:"b6", g:"B", home:"Bosnia-Herz.",  away:"Catar",         date:"2026-06-24", label:"Jun 24", md:3 },
  { id:"c5", g:"C", home:"Escocia",       away:"Brasil",        date:"2026-06-24", label:"Jun 24", md:3 },
  { id:"c6", g:"C", home:"Marruecos",     away:"Haití",         date:"2026-06-24", label:"Jun 24", md:3 },
  // Jun 25
  { id:"d5", g:"D", home:"Turquía",       away:"EUA",           date:"2026-06-25", label:"Jun 25", md:3 },
  { id:"d6", g:"D", home:"Paraguay",      away:"Australia",     date:"2026-06-25", label:"Jun 25", md:3 },
  { id:"e5", g:"E", home:"Ecuador",       away:"Alemania",      date:"2026-06-25", label:"Jun 25", md:3 },
  { id:"e6", g:"E", home:"Curazao",       away:"Costa de Marfil",date:"2026-06-25", label:"Jun 25", md:3 },
  { id:"f5", g:"F", home:"Japón",         away:"Suecia",        date:"2026-06-25", label:"Jun 25", md:3 },
  { id:"f6", g:"F", home:"Túnez",         away:"Países Bajos",  date:"2026-06-25", label:"Jun 25", md:3 },
  // Jun 26
  { id:"g5", g:"G", home:"Egipto",        away:"Irán",          date:"2026-06-26", label:"Jun 26", md:3 },
  { id:"g6", g:"G", home:"Nueva Zelanda", away:"Bélgica",       date:"2026-06-26", label:"Jun 26", md:3 },
  { id:"h5", g:"H", home:"Cabo Verde",    away:"Arabia Saudita",date:"2026-06-26", label:"Jun 26", md:3 },
  { id:"h6", g:"H", home:"Uruguay",       away:"España",        date:"2026-06-26", label:"Jun 26", md:3 },
  { id:"i5", g:"I", home:"Francia",       away:"Noruega",       date:"2026-06-26", label:"Jun 26", md:3 },
  { id:"i6", g:"I", home:"Senegal",       away:"Iraq",          date:"2026-06-26", label:"Jun 26", md:3 },
  // Jun 27
  { id:"j5", g:"J", home:"Jordania",      away:"Argentina",     date:"2026-06-27", label:"Jun 27", md:3 },
  { id:"j6", g:"J", home:"Argelia",       away:"Austria",       date:"2026-06-27", label:"Jun 27", md:3 },
  { id:"k5", g:"K", home:"Colombia",      away:"Portugal",      date:"2026-06-27", label:"Jun 27", md:3 },
  { id:"k6", g:"K", home:"DR Congo",      away:"Uzbekistán",    date:"2026-06-27", label:"Jun 27", md:3 },
  { id:"l5", g:"L", home:"Ghana",         away:"Inglaterra",    date:"2026-06-27", label:"Jun 27", md:3 },
  { id:"l6", g:"L", home:"Croacia",       away:"Panamá",        date:"2026-06-27", label:"Jun 27", md:3 },
];

// Resultados ya conocidos al Jun 16 — fallback si Supabase está vacío
const KNOWN_RESULTS = {
  a1:{ home_goals:2, away_goals:0 }, // México 2-0 Sudáfrica
  a2:{ home_goals:2, away_goals:1 }, // Corea del Sur 2-1 Rep. Checa
  b1:{ home_goals:1, away_goals:1 }, // Canadá 1-1 Bosnia-Herz.
  b2:{ home_goals:1, away_goals:1 }, // Suiza 1-1 Catar
  c1:{ home_goals:1, away_goals:1 }, // Brasil 1-1 Marruecos
  c2:{ home_goals:1, away_goals:0 }, // Escocia 1-0 Haití
  d1:{ home_goals:4, away_goals:1 }, // EUA 4-1 Paraguay
  d2:{ home_goals:2, away_goals:0 }, // Australia 2-0 Turquía
  e1:{ home_goals:7, away_goals:1 }, // Alemania 7-1 Curazao
  e2:{ home_goals:1, away_goals:0 }, // Costa de Marfil 1-0 Ecuador
  f1:{ home_goals:2, away_goals:2 }, // Países Bajos 2-2 Japón
  f2:{ home_goals:5, away_goals:1 }, // Suecia 5-1 Túnez
  g1:{ home_goals:1, away_goals:1 }, // Bélgica 1-1 Egipto
  g2:{ home_goals:2, away_goals:2 }, // Irán 2-2 Nueva Zelanda
  h1:{ home_goals:0, away_goals:0 }, // España 0-0 Cabo Verde
  h2:{ home_goals:1, away_goals:1 }, // Arabia Saudita 1-1 Uruguay
};

const ALL_TEAMS = [...new Set(Object.values(GROUPS).flat())].sort();
const TOP_SCORERS = [
  "K. Mbappé (FRA)","L. Messi (ARG)","E. Haaland (NOR)","H. Kane (ENG)",
  "Vinicius Jr. (BRA)","J. Bellingham (ENG)","L. Martínez (MEX)",
  "C. Ronaldo (POR)","M. Salah (EGY)","A. Dávila (MEX)",
  "O. Giménez (MEX)","L. Werner (GER)","A. Mitoma (JPN)","V. Osimhen (NGA)",
];
const MEXICO_ROUNDS = ["Fase de Grupos","Ronda de 32","Octavos de Final","Cuartos de Final","Semifinal","Tercer Lugar","CAMPEÓN 🏆"];

function getTodayCT() {
  const d = new Date(new Date().toLocaleString("en-US",{timeZone:"America/Chicago"}));
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function calcScore(hp,ap,ha,aa) {
  if(hp==null||ap==null||ha==null||aa==null) return null;
  const pw=hp>ap?"H":hp<ap?"A":"D", aw=ha>aa?"H":ha<aa?"A":"D";
  if(pw!==aw) return 0;
  if(hp===ha&&ap===aa) return 3;
  if(Math.abs(hp-ap)===Math.abs(ha-aa)) return 2;
  return 1;
}

const S = {
  input:{width:44,height:40,background:"#0d1117",border:"1.5px solid #30363d",borderRadius:8,color:"#e6edf3",fontWeight:700,fontSize:18,textAlign:"center",outline:"none",padding:0,fontFamily:"inherit"},
  select:{width:"100%",background:"#0d1117",border:"1.5px solid #30363d",borderRadius:8,color:"#e6edf3",fontSize:13,padding:"8px 10px",outline:"none",fontFamily:"inherit"},
  label:{fontSize:11,color:"#8b949e",fontWeight:600,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8},
};

function PtsBadge({pts}) {
  if(pts==null) return null;
  const c={0:{bg:"#3d1515",co:"#f85149"},1:{bg:"#2d2000",co:"#d29922"},2:{bg:"#0d2137",co:"#388bfd"},3:{bg:"#0d2b1d",co:"#3fb950"}}[pts]||{bg:"#3d1515",co:"#f85149"};
  return <span style={{background:c.bg,color:c.co,fontWeight:800,fontSize:11,padding:"2px 8px",borderRadius:20}}>{pts===0?"0":`+${pts}`} pts</span>;
}

function MatchCard({match, pred, actual, onSave}) {
  const today = getTodayCT();
  const locked = !!actual || match.date < today;
  const [h,setH]=useState(pred?.home_goals??"");
  const [a,setA]=useState(pred?.away_goals??"");
  const [saved,setSaved]=useState(false);

  useEffect(()=>{setH(pred?.home_goals??"");setA(pred?.away_goals??"");},[pred]);

  const pts = calcScore(h!==""?+h:null,a!==""?+a:null,actual?.home_goals??null,actual?.away_goals??null);

  async function blur() {
    if(locked||h===""||a==="") return;
    await onSave(match.id,+h,+a);
    setSaved(true);setTimeout(()=>setSaved(false),1500);
  }

  return (
    <div style={{background:locked?"#0d1117":"#161b22",borderRadius:10,padding:"14px 16px",marginBottom:8,border:`1px solid ${actual?"#21262d":locked?"#161b22":"#30363d"}`}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:11,color:"#8b949e",fontWeight:600}}>
          Grupo {match.g} · J{match.md} · {match.label}
          {locked&&<span style={{marginLeft:6}}>🔒</span>}
        </span>
        {actual&&<PtsBadge pts={pts}/>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{flex:1,textAlign:"right",fontWeight:700,fontSize:14,color:locked?"#484f58":"#e6edf3"}}>{match.home}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <input type="number" min={0} max={20} style={{...S.input,opacity:locked?0.35:1}} value={h} placeholder="?" disabled={locked} onChange={e=>setH(e.target.value)} onBlur={blur}/>
          <span style={{color:"#8b949e",fontWeight:700}}>-</span>
          <input type="number" min={0} max={20} style={{...S.input,opacity:locked?0.35:1}} value={a} placeholder="?" disabled={locked} onChange={e=>setA(e.target.value)} onBlur={blur}/>
        </div>
        <span style={{flex:1,fontWeight:700,fontSize:14,color:locked?"#484f58":"#e6edf3"}}>{match.away}</span>
      </div>
      {actual&&<div style={{textAlign:"center",marginTop:6,fontSize:11,color:"#8b949e"}}>Resultado: {actual.home_goals} – {actual.away_goals}</div>}
      {saved&&<div style={{textAlign:"center",fontSize:10,color:"#3fb950",marginTop:4}}>✓ Guardado</div>}
    </div>
  );
}

function LoginScreen({onLogin}) {
  const [name,setName]=useState(""),loading=useState(false),error=useState("");
  const [l,setL]=loading, [e,setE]=error;

  async function join() {
    const t=name.trim();if(!t)return;setL(true);
    try {
      const {data,error}=await supabase.from("players").upsert({name:t},{onConflict:"name"}).select().single();
      if(error)throw error;
      localStorage.setItem("quiniela_player",JSON.stringify(data));
      onLogin(data);
    } catch {setE("Error al entrar. Intenta de nuevo.");}
    setL(false);
  }

  return (
    <div style={{minHeight:"100vh",background:"#0d1117",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:340,textAlign:"center",padding:24}}>
        <div style={{fontSize:52,marginBottom:8}}>⚽</div>
        <h1 style={{margin:"0 0 4px",fontSize:26,fontWeight:900,color:"#e6edf3"}}>Quiniela 2026</h1>
        <p style={{color:"#8b949e",fontSize:14,margin:"0 0 32px"}}>USA · Canada · Mexico</p>
        <input type="text" placeholder="Tu nombre o apodo..." value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&join()} style={{...S.select,fontSize:16,padding:"12px 16px",marginBottom:12,textAlign:"center"}}/>
        {e&&<div style={{color:"#f85149",fontSize:13,marginBottom:8}}>{e}</div>}
        <button onClick={join} disabled={l||!name.trim()} style={{width:"100%",background:"#1f6feb",border:"none",color:"white",padding:"12px",borderRadius:8,fontWeight:700,fontSize:16,cursor:"pointer",opacity:l||!name.trim()?0.5:1}}>{l?"Entrando...":"Entrar →"}</button>
        <p style={{color:"#484f58",fontSize:12,marginTop:20}}>Tu nombre recupera tus pronósticos automáticamente.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [player,setPlayer]=useState(()=>{
    try { const s=localStorage.getItem("quiniela_player"); return s?JSON.parse(s):null; } catch{return null;}
  });
  const [tab,setTab]=useState("extras");
  const [predictions,setPredictions]=useState({});
  const [actuals,setActuals]=useState({});
  const [extras,setExtras]=useState({});
  const [leaderboard,setLeaderboard]=useState([]);
  const [allPredictions,setAllPredictions]=useState([]);
  const [allPlayers,setAllPlayers]=useState([]);
  const [loading,setLoading]=useState(false);
  const [syncing,setSyncing]=useState(false);
  const [lastSync,setLastSync]=useState(null);
  const [isAdmin,setIsAdmin]=useState(false);
  const [adminInput,setAdminInput]=useState("");
  const [groupFilter,setGroupFilter]=useState("ALL");
  const [showAll,setShowAll]=useState(false);

  useEffect(()=>{
    if(!player)return;
    loadAll();
    const iv=setInterval(loadLeaderboard,30000);
    return ()=>clearInterval(iv);
  },[player]);

  async function loadAll(){
    setLoading(true);
    await Promise.all([loadPredictions(),loadActuals(),loadExtras(),loadLeaderboard()]);
    setLoading(false);
  }

  async function loadPredictions(){
    const {data}=await supabase.from("predictions").select("*").eq("player_id",player.id);
    if(data){const m={};data.forEach(r=>{m[r.match_id]=r;});setPredictions(m);}
  }

  async function loadActuals(){
    const {data}=await supabase.from("results").select("*");
    const m={...KNOWN_RESULTS}; // start with known results as fallback
    if(data)data.forEach(r=>{m[r.match_id]={home_goals:r.home_goals,away_goals:r.away_goals};});
    setActuals(m);
  }

  async function loadExtras(){
    const {data}=await supabase.from("extras").select("*").eq("player_id",player.id).maybeSingle();
    if(data)setExtras(data);
  }

  async function loadLeaderboard(){
    const [{data:players},{data:preds},{data:results}]=await Promise.all([
      supabase.from("players").select("id,name"),
      supabase.from("predictions").select("*"),
      supabase.from("results").select("*"),
    ]);
    if(!players||!preds||!results)return;
    const rMap={...KNOWN_RESULTS};
    results.forEach(r=>{rMap[r.match_id]={home_goals:r.home_goals,away_goals:r.away_goals};});
    setAllPredictions(preds);
    setAllPlayers(players);
    const board=players.map(p=>{
      const myP=preds.filter(pr=>pr.player_id===p.id);
      const pts=myP.reduce((s,pr)=>{const a=rMap[pr.match_id];if(!a)return s;return s+(calcScore(pr.home_goals,pr.away_goals,a.home_goals,a.away_goals)||0);},0);
      const exact=myP.filter(pr=>{const a=rMap[pr.match_id];return a&&calcScore(pr.home_goals,pr.away_goals,a.home_goals,a.away_goals)===3;}).length;
      return {name:p.name,pts,exact,total:myP.length};
    }).sort((a,b)=>b.pts-a.pts||b.exact-a.exact);
    setLeaderboard(board);
  }

  // Sync automático con Anthropic API — igual que el dashboard
  const syncResults = useCallback(async()=>{
    if(!ANTHROPIC_KEY){alert("Agrega VITE_ANTHROPIC_KEY en Netlify");return;}
    setSyncing(true);
    try {
      const today=getTodayCT();
      const pastMatches=ALL_MATCHES.filter(m=>m.date<=today);
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:2000,
          system:`You are a FIFA World Cup 2026 live results tracker. Today is ${today}. Return ONLY valid JSON with no markdown, no backticks, no explanation.`,
          messages:[{role:"user",content:`Return final scores for ALL 2026 FIFA World Cup matches that have finished as of ${today}.
For each finished match, return the final score. Omit matches not yet played.

Matches to check:
${pastMatches.map(m=>`${m.id}: ${m.home} vs ${m.away} (Group ${m.g}, ${m.label})`).join("\n")}

Return exactly this JSON format:
{"results":[{"id":"a1","home_goals":2,"away_goals":0},{"id":"a2","home_goals":2,"away_goals":1}]}

Only include matches with confirmed final scores.`}]
        })
      });
      const data=await res.json();
      const text=data.content?.find(b=>b.type==="text")?.text||"{}";
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      if(parsed.results?.length){
        for(const r of parsed.results){
          if(r.home_goals==null||r.away_goals==null) continue;
          await supabase.from("results").upsert({match_id:r.id,home_goals:r.home_goals,away_goals:r.away_goals},{onConflict:"match_id"});
        }
        await loadActuals();
        await loadLeaderboard();
        setLastSync(new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}));
      }
    } catch(err){console.error("Sync error:",err);alert("Error en sync. Revisa la consola.");}
    setSyncing(false);
  },[player]);

  async function savePrediction(matchId,hg,ag){
    await supabase.from("predictions").upsert({player_id:player.id,match_id:matchId,home_goals:hg,away_goals:ag},{onConflict:"player_id,match_id"});
    setPredictions(prev=>({...prev,[matchId]:{match_id:matchId,home_goals:hg,away_goals:ag}}));
  }

  async function saveExtras(nx){
    const s={...nx,player_id:player.id};
    await supabase.from("extras").upsert(s,{onConflict:"player_id"});
    setExtras(s);
  }

  if(!player) return <LoginScreen onLogin={setPlayer}/>;

  const today=getTodayCT();
  const myPts=Object.entries(predictions).reduce((sum,[mid,pred])=>{
    const a=actuals[mid];if(!a)return sum;
    return sum+(calcScore(pred.home_goals,pred.away_goals,a.home_goals,a.away_goals)||0);
  },0);
  const myRank=leaderboard.findIndex(p=>p.name===player.name)+1;
  const allGroups=["ALL",...Object.keys(GROUPS)];

  // Por defecto: solo partidos de hoy en adelante. "Ver todos" muestra historial
  const baseMatches = showAll ? ALL_MATCHES : ALL_MATCHES.filter(m=>m.date>=today);
  const visibleMatches = groupFilter==="ALL" ? baseMatches : baseMatches.filter(m=>m.g===groupFilter);

  const tabs=[
    {id:"extras",label:"⭐ Extras"},
    {id:"matches",label:"⚽ Partidos"},
    {id:"table",label:"🏆 Tabla"},
    {id:"compare",label:"👥 Comparar"},
    ...(isAdmin?[{id:"admin",label:"⚙️ Admin"}]:[]),
  ];

  return (
    <div style={{background:"#0d1117",minHeight:"100vh",fontFamily:"'Inter',-apple-system,sans-serif",color:"#e6edf3",maxWidth:700,margin:"0 auto"}}>
      {/* Header */}
      <div style={{background:"#161b22",borderBottom:"1px solid #21262d",padding:"16px 20px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:11,color:"#388bfd",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Quiniela 2026</div>
            <div style={{fontWeight:800,fontSize:20}}>Hola, {player.name} 👋</div>
            <button onClick={()=>{localStorage.removeItem("quiniela_player");setPlayer(null);}} style={{background:"none",border:"none",color:"#484f58",fontSize:10,cursor:"pointer",padding:0,marginTop:2}}>cambiar nombre</button>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:26,fontWeight:900,color:"#3fb950",lineHeight:1}}>{myPts}</div>
            <div style={{fontSize:11,color:"#8b949e"}}>pts{myRank>0?` · #${myRank}`:""}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,flexWrap:"wrap"}}>
          <button onClick={syncResults} disabled={syncing} style={{background:"#1f6feb",border:"none",color:"white",fontSize:11,padding:"5px 12px",borderRadius:6,cursor:syncing?"not-allowed":"pointer",fontWeight:600,opacity:syncing?0.6:1}}>
            {syncing?"⟳ Actualizando...":"⟳ Sync resultados"}
          </button>
          {lastSync&&<span style={{fontSize:10,color:"#484f58"}}>Última sync: {lastSync}</span>}
          {!ANTHROPIC_KEY&&<span style={{fontSize:10,color:"#f85149"}}>⚠ Sin API key</span>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #21262d",background:"#161b22"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"11px 4px",background:"none",border:"none",borderBottom:tab===t.id?"2px solid #388bfd":"2px solid transparent",color:tab===t.id?"#388bfd":"#8b949e",fontWeight:600,fontSize:12,cursor:"pointer"}}>{t.label}</button>
        ))}
      </div>

      <div style={{padding:"16px 14px 80px"}}>

        {tab==="matches"&&(
          <div>
            <div style={{background:"#161b22",border:"1px solid #1c3d5c",borderRadius:10,padding:"12px 14px",marginBottom:16}}>
              <div style={{color:"#388bfd",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>Puntuación</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 12px",color:"#8b949e",fontSize:12}}>
                <div><PtsBadge pts={0}/> Ganador incorrecto</div>
                <div><PtsBadge pts={1}/> Ganador correcto</div>
                <div><PtsBadge pts={2}/> + diferencia exacta</div>
                <div><PtsBadge pts={3}/> Marcador exacto</div>
              </div>
            </div>

            {/* Toggle ver todos / solo próximos */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{display:"flex",gap:6,overflowX:"auto",flex:1}}>
                {allGroups.map(g=>(
                  <button key={g} onClick={()=>setGroupFilter(g)} style={{background:groupFilter===g?"#1f6feb":"#161b22",border:`1px solid ${groupFilter===g?"#1f6feb":"#30363d"}`,color:groupFilter===g?"white":"#8b949e",padding:"5px 10px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{g==="ALL"?"Todos":`G-${g}`}</button>
                ))}
              </div>
              <button onClick={()=>setShowAll(!showAll)} style={{background:"#21262d",border:"1px solid #30363d",color:"#8b949e",fontSize:10,padding:"4px 8px",borderRadius:6,cursor:"pointer",marginLeft:8,whiteSpace:"nowrap"}}>
                {showAll?"Solo próximos":"Ver historial"}
              </button>
            </div>

            {loading?(
              <div style={{textAlign:"center",color:"#8b949e",padding:40}}>Cargando...</div>
            ):visibleMatches.length===0?(
              <div style={{textAlign:"center",color:"#8b949e",padding:40,fontSize:14}}>No hay partidos en este grupo.</div>
            ):visibleMatches.map(m=>(
              <MatchCard key={m.id} match={m} pred={predictions[m.id]} actual={actuals[m.id]} onSave={savePrediction}/>
            ))}
          </div>
        )}

        {tab==="extras"&&(
          <div>
            <div style={{background:"#161b22",border:"1px solid #3d2b00",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:12,color:"#8b949e"}}>
              ⭐ Pronósticos de torneo — se pueden cambiar hasta Jun 28 (eliminatoria).
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {[
                {key:"champion",label:"🏆 Campeón del mundo",options:ALL_TEAMS},
                {key:"top_scorer",label:"👟 Campeón de goleo",options:TOP_SCORERS},
                {key:"mexico_round",label:"🇲🇽 ¿Hasta dónde llega México?",options:MEXICO_ROUNDS},
              ].map(({key,label,options})=>(
                <div key={key}>
                  <label style={S.label}>{label}</label>
                  <select style={S.select} value={extras[key]||""} onChange={e=>saveExtras({...extras,[key]:e.target.value})}>
                    <option value="">Selecciona...</option>
                    {options.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={S.label}>Ganador de cada grupo</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:4}}>
                  {Object.entries(GROUPS).map(([letter,teams])=>(
                    <div key={letter} style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{color:"#8b949e",fontSize:11,fontWeight:700,width:22}}>G-{letter}</span>
                      <select style={{...S.select,fontSize:12,padding:"6px 8px"}} value={(extras.group_winners||{})[letter]||""} onChange={e=>saveExtras({...extras,group_winners:{...(extras.group_winners||{}),[letter]:e.target.value}})}>
                        <option value="">—</option>
                        {teams.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==="table"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:11,color:"#8b949e",textTransform:"uppercase",letterSpacing:1}}>{leaderboard.length} participante{leaderboard.length!==1?"s":""}</div>
              <button onClick={loadLeaderboard} style={{background:"#161b22",border:"1px solid #30363d",color:"#8b949e",fontSize:11,padding:"4px 10px",borderRadius:6,cursor:"pointer"}}>↻ Actualizar</button>
            </div>
            {leaderboard.map((p,i)=>(
              <div key={p.name} style={{display:"flex",alignItems:"center",gap:12,background:p.name===player.name?"#0d2137":"#161b22",border:`1px solid ${i===0?"#2d7d32":p.name===player.name?"#1c3d5c":"#21262d"}`,borderRadius:10,padding:"12px 16px",marginBottom:8}}>
                <span style={{fontSize:18,width:28,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15}}>{p.name}{p.name===player.name?" (tú)":""}</div>
                  <div style={{fontSize:11,color:"#8b949e"}}>{p.total} pronósticos · {p.exact} exactos</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:900,fontSize:22,color:i===0?"#3fb950":"#e6edf3"}}>{p.pts}</div>
                  <div style={{fontSize:10,color:"#8b949e"}}>pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="compare"&&(
          <div>
            <div style={{fontSize:11,color:"#8b949e",marginBottom:16}}>
              Pronósticos de todos los jugadores. 🔒 = partido cerrado, pts en verde/amarillo/azul/rojo.
            </div>
            {/* Solo partidos con resultado o pasados */}
            {ALL_MATCHES.filter(m=>actuals[m.id]||m.date<today).map(m=>{
              const actual=actuals[m.id];
              // Build per-player predictions for this match
              const playerPreds=allPlayers.map(p=>{
                const pred=allPredictions.find(pr=>pr.player_id===p.id&&pr.match_id===m.id);
                const pts=pred&&actual?calcScore(pred.home_goals,pred.away_goals,actual.home_goals,actual.away_goals):null;
                return {name:p.name,pred,pts};
              });
              if(playerPreds.every(pp=>!pp.pred)) return null; // skip if nobody predicted
              return (
                <div key={m.id} style={{background:"#161b22",borderRadius:10,padding:"12px 14px",marginBottom:10,border:"1px solid #21262d"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:11,color:"#8b949e",fontWeight:600}}>Grupo {m.g} · {m.label} · J{m.md}</span>
                    {actual&&<span style={{fontSize:11,color:"#3fb950",fontWeight:700}}>Final: {actual.home_goals}–{actual.away_goals}</span>}
                  </div>
                  <div style={{fontWeight:700,fontSize:13,color:"#e6edf3",marginBottom:10,textAlign:"center"}}>
                    {m.home} vs {m.away}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {playerPreds.filter(pp=>pp.pred).map(pp=>(
                      <div key={pp.name} style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:12,color:pp.name===player.name?"#388bfd":"#8b949e",fontWeight:pp.name===player.name?700:400,width:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pp.name}</span>
                        <span style={{fontSize:13,fontWeight:700,color:"#e6edf3",flex:1}}>
                          {pp.pred.home_goals} – {pp.pred.away_goals}
                        </span>
                        {pp.pts!==null&&<PtsBadge pts={pp.pts}/>}
                        {pp.pts===null&&actual&&<span style={{fontSize:10,color:"#484f58"}}>pendiente</span>}
                      </div>
                    ))}
                    {playerPreds.filter(pp=>!pp.pred).length>0&&(
                      <div style={{fontSize:10,color:"#484f58"}}>
                        Sin pronóstico: {playerPreds.filter(pp=>!pp.pred).map(pp=>pp.name).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {ALL_MATCHES.filter(m=>actuals[m.id]||m.date<today).length===0&&(
              <div style={{textAlign:"center",color:"#8b949e",padding:40}}>Los pronósticos aparecen aquí cuando los partidos terminen.</div>
            )}
          </div>
        )}

        {tab==="admin"&&isAdmin&&(
          <div>
            <div style={{color:"#f85149",fontSize:12,marginBottom:12,background:"#2d1515",borderRadius:8,padding:"10px 14px"}}>
              ⚠️ Panel admin — ingresa resultados finales de cada partido.
            </div>
            <button onClick={syncResults} disabled={syncing} style={{width:"100%",background:"#1f6feb",border:"none",color:"white",padding:"10px",borderRadius:8,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:16,opacity:syncing?0.6:1}}>
              {syncing?"🤖 Sincronizando con IA...":"🤖 Sync automático con IA"}
            </button>
            <div style={{fontSize:11,color:"#484f58",marginBottom:12,textAlign:"center"}}>— o ingresa manualmente —</div>
            {ALL_MATCHES.filter(m=>m.date<=getTodayCT()).map(m=>{
              const a=actuals[m.id]||{};
              return (
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #21262d",padding:"8px 0",fontSize:12}}>
                  <span style={{color:"#8b949e",width:18,fontSize:10}}>{m.g}</span>
                  <span style={{flex:1,color:"#e6edf3",fontSize:11}}>{m.home} vs {m.away}</span>
                  <span style={{color:"#484f58",fontSize:10,width:34}}>{m.label}</span>
                  <input type="number" min={0} max={20} placeholder="—" style={{...S.input,width:34,height:30,fontSize:13}}
                    defaultValue={a.home_goals??""} key={`h_${m.id}_${a.home_goals}`}
                    onBlur={async e=>{
                      const hg=e.target.value===""?null:+e.target.value;
                      const ag=actuals[m.id]?.away_goals??null;
                      if(hg!==null&&ag!==null){await supabase.from("results").upsert({match_id:m.id,home_goals:hg,away_goals:ag},{onConflict:"match_id"});await loadActuals();await loadLeaderboard();}
                    }}/>
                  <span style={{color:"#8b949e"}}>-</span>
                  <input type="number" min={0} max={20} placeholder="—" style={{...S.input,width:34,height:30,fontSize:13}}
                    defaultValue={a.away_goals??""} key={`a_${m.id}_${a.away_goals}`}
                    onBlur={async e=>{
                      const ag=e.target.value===""?null:+e.target.value;
                      const hg=actuals[m.id]?.home_goals??null;
                      if(hg!==null&&ag!==null){await supabase.from("results").upsert({match_id:m.id,home_goals:hg,away_goals:ag},{onConflict:"match_id"});await loadActuals();await loadLeaderboard();}
                    }}/>
                  {actuals[m.id]&&<span style={{color:"#3fb950",fontSize:10}}>✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin unlock */}
      {!isAdmin&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#161b22",borderTop:"1px solid #21262d",padding:"8px 16px",display:"flex",gap:8,maxWidth:700,margin:"0 auto"}}>
          <input type="password" placeholder="Contraseña admin..." value={adminInput} onChange={e=>setAdminInput(e.target.value)} style={{...S.select,flex:1,padding:"6px 10px",fontSize:12}}/>
          <button onClick={()=>{if(adminInput===ADMIN_PASSWORD){setIsAdmin(true);setTab("admin");}setAdminInput("");}} style={{background:"#21262d",border:"1px solid #30363d",color:"#8b949e",padding:"6px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>Admin</button>
        </div>
      )}
    </div>
  );
}
