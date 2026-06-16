import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "gol2026";
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── REAL 2026 WORLD CUP DATA ─────────────────────────────────────────────────

const GROUPS = {
  A: ["México","Sudáfrica","Corea del Sur","Rep. Checa"],
  B: ["Canadá","Bosnia-Herz.","Catar","Suiza"],
  C: ["Brasil","Marruecos","Haití","Escocia"],
  D: ["EUA","Paraguay","Australia","Turquía"],
  E: ["Alemania","Curazao","Costa de Marfil","Ecuador"],
  F: ["Países Bajos","Japón","Portugal","Corea del Norte"],
  G: ["Bélgica","Egipto","Irán","Nueva Zelanda"],
  H: ["España","Cabo Verde","Arabia Saudita","Uruguay"],
  I: ["Francia","Senegal","Iraq","Noruega"],
  J: ["Argentina","Argelia","Austria","Jordania"],
  K: ["Portugal","DR Congo","Uzbekistán","Colombia"],
  L: ["Inglaterra","Croacia","Ghana","Panamá"],
};

const MATCHES = [
  // MD1
  { id:"m01", group:"A", home:"México", away:"Sudáfrica", date:"Jun 11", md:1 },
  { id:"m02", group:"A", home:"Corea del Sur", away:"Rep. Checa", date:"Jun 12", md:1 },
  { id:"m03", group:"B", home:"Catar", away:"Suiza", date:"Jun 13", md:1 },
  { id:"m04", group:"C", home:"Brasil", away:"Marruecos", date:"Jun 13", md:1 },
  { id:"m05", group:"D", home:"EUA", away:"Paraguay", date:"Jun 13", md:1 },
  { id:"m06", group:"E", home:"Alemania", away:"Curazao", date:"Jun 14", md:1 },
  { id:"m07", group:"F", home:"Países Bajos", away:"Japón", date:"Jun 14", md:1 },
  { id:"m08", group:"E", home:"Costa de Marfil", away:"Ecuador", date:"Jun 14", md:1 },
  { id:"m09", group:"C", home:"Haití", away:"Escocia", date:"Jun 14", md:1 },
  { id:"m10", group:"H", home:"España", away:"Cabo Verde", date:"Jun 15", md:1 },
  { id:"m11", group:"G", home:"Bélgica", away:"Egipto", date:"Jun 15", md:1 },
  { id:"m12", group:"H", home:"Arabia Saudita", away:"Uruguay", date:"Jun 15", md:1 },
  { id:"m13", group:"I", home:"Francia", away:"Senegal", date:"Jun 16", md:1 },
  { id:"m14", group:"I", home:"Iraq", away:"Noruega", date:"Jun 16", md:1 },
  { id:"m15", group:"J", home:"Argentina", away:"Argelia", date:"Jun 16", md:1 },
  { id:"m16", group:"J", home:"Austria", away:"Jordania", date:"Jun 16", md:1 },
  { id:"m17", group:"L", home:"Inglaterra", away:"Croacia", date:"Jun 17", md:1 },
  { id:"m18", group:"L", home:"Ghana", away:"Panamá", date:"Jun 17", md:1 },
  { id:"m19", group:"K", home:"Uzbekistán", away:"Colombia", date:"Jun 18", md:1 },
  { id:"m20", group:"G", home:"Irán", away:"Nueva Zelanda", date:"Jun 16", md:1 },
  // MD2
  { id:"m21", group:"B", home:"Canadá", away:"Catar", date:"Jun 18", md:2 },
  { id:"m22", group:"D", home:"EUA", away:"Australia", date:"Jun 19", md:2 },
  { id:"m23", group:"C", home:"Escocia", away:"Marruecos", date:"Jun 19", md:2 },
  { id:"m24", group:"A", home:"México", away:"Corea del Sur", date:"Jun 19", md:2 },
  { id:"m25", group:"E", home:"Alemania", away:"Costa de Marfil", date:"Jun 20", md:2 },
  { id:"m26", group:"C", home:"Brasil", away:"Haití", date:"Jun 20", md:2 },
  { id:"m27", group:"B", home:"Bosnia-Herz.", away:"Suiza", date:"Jun 20", md:2 },
  { id:"m28", group:"D", home:"Paraguay", away:"Turquía", date:"Jun 20", md:2 },
  { id:"m29", group:"A", home:"Sudáfrica", away:"Rep. Checa", date:"Jun 21", md:2 },
  { id:"m30", group:"E", home:"Ecuador", away:"Curazao", date:"Jun 21", md:2 },
  { id:"m31", group:"G", home:"Bélgica", away:"Irán", date:"Jun 22", md:2 },
  { id:"m32", group:"H", home:"España", away:"Arabia Saudita", date:"Jun 22", md:2 },
  { id:"m33", group:"I", home:"Francia", away:"Iraq", date:"Jun 22", md:2 },
  { id:"m34", group:"J", home:"Argentina", away:"Austria", date:"Jun 22", md:2 },
  { id:"m35", group:"H", home:"Uruguay", away:"Cabo Verde", date:"Jun 23", md:2 },
  { id:"m36", group:"I", home:"Noruega", away:"Senegal", date:"Jun 23", md:2 },
  { id:"m37", group:"K", home:"Portugal", away:"DR Congo", date:"Jun 23", md:2 },
  { id:"m38", group:"L", home:"Ghana", away:"Croacia", date:"Jun 23", md:2 },
  { id:"m39", group:"J", home:"Argelia", away:"Jordania", date:"Jun 23", md:2 },
  { id:"m40", group:"K", home:"Colombia", away:"Uzbekistán", date:"Jun 24", md:2 },
  { id:"m41", group:"L", home:"Inglaterra", away:"Panamá", date:"Jun 24", md:2 },
  { id:"m42", group:"B", home:"Canadá", away:"Bosnia-Herz.", date:"Jun 24", md:2 },
  { id:"m43", group:"G", home:"Egipto", away:"Nueva Zelanda", date:"Jun 21", md:2 },
  // MD3
  { id:"m44", group:"A", home:"México", away:"Rep. Checa", date:"Jun 24", md:3 },
  { id:"m45", group:"A", home:"Sudáfrica", away:"Corea del Sur", date:"Jun 24", md:3 },
  { id:"m46", group:"B", home:"Suiza", away:"Catar", date:"Jun 25", md:3 },
  { id:"m47", group:"B", home:"Bosnia-Herz.", away:"Canadá", date:"Jun 25", md:3 },
  { id:"m48", group:"C", home:"Brasil", away:"Escocia", date:"Jun 25", md:3 },
  { id:"m49", group:"C", home:"Marruecos", away:"Haití", date:"Jun 25", md:3 },
  { id:"m50", group:"D", home:"EUA", away:"Turquía", date:"Jun 25", md:3 },
  { id:"m51", group:"D", home:"Paraguay", away:"Australia", date:"Jun 25", md:3 },
  { id:"m52", group:"E", home:"Alemania", away:"Ecuador", date:"Jun 26", md:3 },
  { id:"m53", group:"E", home:"Costa de Marfil", away:"Curazao", date:"Jun 26", md:3 },
  { id:"m54", group:"G", home:"Bélgica", away:"Nueva Zelanda", date:"Jun 26", md:3 },
  { id:"m55", group:"G", home:"Egipto", away:"Irán", date:"Jun 26", md:3 },
  { id:"m56", group:"H", home:"España", away:"Uruguay", date:"Jun 26", md:3 },
  { id:"m57", group:"H", home:"Cabo Verde", away:"Arabia Saudita", date:"Jun 26", md:3 },
  { id:"m58", group:"I", home:"Francia", away:"Noruega", date:"Jun 26", md:3 },
  { id:"m59", group:"I", home:"Senegal", away:"Iraq", date:"Jun 26", md:3 },
  { id:"m60", group:"J", home:"Argentina", away:"Jordania", date:"Jun 27", md:3 },
  { id:"m61", group:"J", home:"Argelia", away:"Austria", date:"Jun 27", md:3 },
  { id:"m62", group:"K", home:"Portugal", away:"Uzbekistán", date:"Jun 27", md:3 },
  { id:"m63", group:"K", home:"DR Congo", away:"Colombia", date:"Jun 27", md:3 },
  { id:"m64", group:"L", home:"Inglaterra", away:"Ghana", date:"Jun 27", md:3 },
  { id:"m65", group:"L", home:"Croacia", away:"Panamá", date:"Jun 27", md:3 },
  { id:"m66", group:"F", home:"Países Bajos", away:"Japón", date:"Jun 27", md:3 },
];

const ALL_TEAMS = [...new Set(Object.values(GROUPS).flat())].sort();
const TOP_SCORERS = [
  "K. Mbappé (FRA)","L. Messi (ARG)","V. Osimhen (NGA)","H. Kane (ENG)",
  "E. Haaland (NOR)","Vinicius Jr. (BRA)","J. Bellingham (ENG)",
  "L. Martínez (MEX)","C. Ronaldo (POR)","M. Salah (EGY)",
  "A. Dávila (MEX)","O. Giménez (MEX)","L. Werner (GER)","A. Mitoma (JPN)",
];
const MEXICO_ROUNDS = [
  "Fase de Grupos","Ronda de 32","Octavos de Final",
  "Cuartos de Final","Semifinal","Tercer Lugar","CAMPEÓN 🏆",
];

// ─── SCORING ──────────────────────────────────────────────────────────────────

function calcScore(homeP, awayP, homeA, awayA) {
  if (homeP==null||awayP==null||homeA==null||awayA==null) return null;
  const pw = homeP>awayP?"H":homeP<awayP?"A":"D";
  const aw = homeA>awayA?"H":homeA<awayA?"A":"D";
  if (pw!==aw) return 0;
  if (homeP===homeA&&awayP===awayA) return 3;
  if (Math.abs(homeP-awayP)===Math.abs(homeA-awayA)) return 2;
  return 1;
}

// ─── FETCH RESULTS FROM ANTHROPIC ─────────────────────────────────────────────

async function fetchLiveResults() {
  if (!ANTHROPIC_KEY) return null;
  try {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        system: `You are a FIFA World Cup 2026 results tracker. Today is ${today}. 
Return ONLY valid JSON, no markdown, no explanation, no backticks.
Return results for ALL matches that have FINISHED. For unplayed or in-progress matches use null scores.
Use the exact match IDs provided.`,
        messages: [{
          role: "user",
          content: `Return final scores for these 2026 World Cup matches that have already been played as of today ${today}.
Only include matches with confirmed final scores (null if not played yet or in progress).

Matches to check:
${MATCHES.map(m => `${m.id}: ${m.home} vs ${m.away} (Group ${m.group}, ${m.date})`).join("\n")}

Return this exact JSON:
{
  "results": [
    {"id": "m01", "home_goals": 2, "away_goals": 0},
    {"id": "m02", "home_goals": null, "away_goals": null}
  ]
}
Only include matches with actual final scores (not null). Omit matches not yet played.`
        }]
      })
    });
    const data = await res.json();
    const text = data.content?.find(b => b.type==="text")?.text || "{}";
    const clean = text.replace(/```json|```/g,"").trim();
    const parsed = JSON.parse(clean);
    return parsed.results || [];
  } catch (e) {
    console.error("Failed to fetch results:", e);
    return null;
  }
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const S = {
  input: {
    width:44, height:40, background:"#0d1117", border:"1.5px solid #30363d",
    borderRadius:8, color:"#e6edf3", fontWeight:700, fontSize:18,
    textAlign:"center", outline:"none", padding:0, fontFamily:"inherit",
  },
  select: {
    width:"100%", background:"#0d1117", border:"1.5px solid #30363d",
    borderRadius:8, color:"#e6edf3", fontSize:13, padding:"8px 10px",
    outline:"none", fontFamily:"inherit",
  },
  label: {
    fontSize:11, color:"#8b949e", fontWeight:600,
    display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.8,
  },
};

function PtsBadge({ pts }) {
  if (pts===null||pts===undefined) return null;
  const cfg = {
    0:{bg:"#3d1515",color:"#f85149"},
    1:{bg:"#2d2000",color:"#d29922"},
    2:{bg:"#0d2137",color:"#388bfd"},
    3:{bg:"#0d2b1d",color:"#3fb950"},
  };
  const c = cfg[pts]||cfg[0];
  return <span style={{background:c.bg,color:c.color,fontWeight:800,fontSize:11,padding:"2px 8px",borderRadius:20}}>{pts===0?"0":`+${pts}`} pts</span>;
}

function MatchCard({ match, pred, actual, onSave }) {
  const isLocked = !!actual;
  const [home, setHome] = useState(pred?.home_goals??"");
  const [away, setAway] = useState(pred?.away_goals??"");
  const [saved, setSaved] = useState(false);

  useEffect(() => { setHome(pred?.home_goals??""); setAway(pred?.away_goals??""); }, [pred]);

  const pts = calcScore(home!==""?+home:null, away!==""?+away:null, actual?.home_goals??null, actual?.away_goals??null);

  async function handleBlur() {
    if (isLocked||home===""||away==="") return;
    await onSave(match.id, +home, +away);
    setSaved(true); setTimeout(()=>setSaved(false),1500);
  }

  return (
    <div style={{
      background: isLocked?"#0d1117":"#161b22", borderRadius:10,
      padding:"14px 16px", marginBottom:8,
      border:`1px solid ${actual?"#21262d":isLocked?"#1a1f2e":"#30363d"}`,
      opacity: isLocked && !actual ? 0.45 : 1,
    }}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:11,color:"#8b949e",fontWeight:600}}>
          Grupo {match.group} · J{match.md} · {match.date}
          {isLocked && !actual && <span style={{color:"#484f58",marginLeft:6}}>🔒</span>}
        </span>
        {actual && <PtsBadge pts={pts} />}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{flex:1,textAlign:"right",fontWeight:700,fontSize:14,color:isLocked&&!actual?"#484f58":"#e6edf3"}}>{match.home}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <input type="number" min={0} max={20} style={{...S.input,opacity:isLocked?0.5:1}}
            value={home} placeholder="?" disabled={isLocked}
            onChange={e=>setHome(e.target.value)} onBlur={handleBlur}/>
          <span style={{color:"#8b949e",fontWeight:700}}>-</span>
          <input type="number" min={0} max={20} style={{...S.input,opacity:isLocked?0.5:1}}
            value={away} placeholder="?" disabled={isLocked}
            onChange={e=>setAway(e.target.value)} onBlur={handleBlur}/>
        </div>
        <span style={{flex:1,fontWeight:700,fontSize:14,color:isLocked&&!actual?"#484f58":"#e6edf3"}}>{match.away}</span>
      </div>
      {actual && <div style={{textAlign:"center",marginTop:6,fontSize:11,color:"#8b949e"}}>Resultado: {actual.home_goals} – {actual.away_goals}</div>}
      {saved && <div style={{textAlign:"center",fontSize:10,color:"#3fb950",marginTop:4}}>✓ Guardado</div>}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    const trimmed = name.trim(); if (!trimmed) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from("players").upsert({name:trimmed},{onConflict:"name"}).select().single();
      if (error) throw error;
      onLogin(data);
    } catch { setError("Error al entrar. Intenta de nuevo."); }
    setLoading(false);
  }

  return (
    <div style={{minHeight:"100vh",background:"#0d1117",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:340,textAlign:"center",padding:24}}>
        <div style={{fontSize:52,marginBottom:8}}>⚽</div>
        <h1 style={{margin:"0 0 4px",fontSize:26,fontWeight:900,color:"#e6edf3"}}>Quiniela 2026</h1>
        <p style={{color:"#8b949e",fontSize:14,margin:"0 0 32px"}}>USA · Canada · Mexico</p>
        <input type="text" placeholder="Tu nombre o apodo..."
          value={name} onChange={e=>setName(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleJoin()}
          style={{...S.select,fontSize:16,padding:"12px 16px",marginBottom:12,textAlign:"center"}}/>
        {error && <div style={{color:"#f85149",fontSize:13,marginBottom:8}}>{error}</div>}
        <button onClick={handleJoin} disabled={loading||!name.trim()} style={{
          width:"100%",background:"#1f6feb",border:"none",color:"white",
          padding:"12px",borderRadius:8,fontWeight:700,fontSize:16,
          cursor:"pointer",opacity:loading||!name.trim()?0.5:1,
        }}>{loading?"Entrando...":"Entrar →"}</button>
        <p style={{color:"#484f58",fontSize:12,marginTop:20}}>
          Tu nombre recupera tus pronósticos automáticamente.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [player, setPlayer] = useState(null);
  const [tab, setTab] = useState("matches");
  const [predictions, setPredictions] = useState({});
  const [actuals, setActuals] = useState({});
  const [extras, setExtras] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [groupFilter, setGroupFilter] = useState("ALL");

  useEffect(() => {
    if (!player) return;
    loadAll();
    // Auto-sync results every 10 minutes
    const interval = setInterval(syncResults, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [player]);

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadPredictions(), loadActuals(), loadExtras(), loadLeaderboard()]);
    setLoading(false);
  }

  async function loadPredictions() {
    const { data } = await supabase.from("predictions").select("*").eq("player_id", player.id);
    if (data) { const m={}; data.forEach(r=>{m[r.match_id]=r;}); setPredictions(m); }
  }

  async function loadActuals() {
    const { data } = await supabase.from("results").select("*");
    if (data) { const m={}; data.forEach(r=>{m[r.match_id]=r;}); setActuals(m); }
  }

  async function loadExtras() {
    const { data } = await supabase.from("extras").select("*").eq("player_id",player.id).maybeSingle();
    if (data) setExtras(data);
  }

  async function loadLeaderboard() {
    const [{ data: players },{ data: preds },{ data: results }] = await Promise.all([
      supabase.from("players").select("id,name"),
      supabase.from("predictions").select("*"),
      supabase.from("results").select("*"),
    ]);
    if (!players||!preds||!results) return;
    const rMap={}; results.forEach(r=>{rMap[r.match_id]=r;});
    const board = players.map(p => {
      const myP = preds.filter(pr=>pr.player_id===p.id);
      const pts = myP.reduce((s,pr)=>{
        const a=rMap[pr.match_id]; if(!a) return s;
        return s+(calcScore(pr.home_goals,pr.away_goals,a.home_goals,a.away_goals)||0);
      },0);
      const exact = myP.filter(pr=>{const a=rMap[pr.match_id];return a&&calcScore(pr.home_goals,pr.away_goals,a.home_goals,a.away_goals)===3;}).length;
      return {name:p.name,pts,exact,predictions:myP.length};
    }).sort((a,b)=>b.pts-a.pts||b.exact-a.exact);
    setLeaderboard(board);
  }

  async function syncResults() {
    setSyncing(true);
    try {
      const results = await fetchLiveResults();
      if (!results || results.length === 0) { setSyncing(false); return; }

      // Save each result to Supabase
      for (const r of results) {
        if (r.home_goals==null||r.away_goals==null) continue;
        await supabase.from("results").upsert({
          match_id: r.id, home_goals: r.home_goals, away_goals: r.away_goals
        }, { onConflict:"match_id" });
      }
      await loadActuals();
      await loadLeaderboard();
      setLastSync(new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}));
    } catch(e) { console.error(e); }
    setSyncing(false);
  }

  async function savePrediction(matchId, homeGoals, awayGoals) {
    await supabase.from("predictions").upsert({
      player_id:player.id, match_id:matchId, home_goals:homeGoals, away_goals:awayGoals,
    },{onConflict:"player_id,match_id"});
    setPredictions(prev=>({...prev,[matchId]:{match_id:matchId,home_goals:homeGoals,away_goals:awayGoals}}));
  }

  async function saveExtras(newExtras) {
    const toSave = {...newExtras, player_id:player.id};
    await supabase.from("extras").upsert(toSave,{onConflict:"player_id"});
    setExtras(toSave);
  }

  if (!player) return <LoginScreen onLogin={setPlayer} />;

  const myPts = Object.entries(predictions).reduce((sum,[mid,pred])=>{
    const a=actuals[mid]; if(!a) return sum;
    return sum+(calcScore(pred.home_goals,pred.away_goals,a.home_goals,a.away_goals)||0);
  },0);
  const myRank = leaderboard.findIndex(p=>p.name===player.name)+1;
  const allGroups = ["ALL",...Object.keys(GROUPS)];
  const visibleMatches = groupFilter==="ALL"?MATCHES:MATCHES.filter(m=>m.group===groupFilter);

  // A match is locked if it has a result OR if its date is strictly before today (CT timezone)
  const todayCT = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const todayStr = `${todayCT.getFullYear()}-${String(todayCT.getMonth()+1).padStart(2,"0")}-${String(todayCT.getDate()).padStart(2,"0")}`;

  // Map month abbreviations to numbers
  const monthMap = { Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12" };

  function isMatchLocked(match) {
    if (actuals[match.id]) return true;
    // Parse "Jun 11" → "2026-06-11"
    const [mon, day] = match.date.split(" ");
    const matchDateStr = `2026-${monthMap[mon]}-${String(day).padStart(2,"0")}`;
    // Lock if match date is strictly before today
    return matchDateStr < todayStr;
  }

  const tabs = [
    {id:"matches",label:"⚽ Partidos"},
    {id:"extras",label:"⭐ Extras"},
    {id:"table",label:"🏆 Tabla"},
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
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:26,fontWeight:900,color:"#3fb950",lineHeight:1}}>{myPts}</div>
            <div style={{fontSize:11,color:"#8b949e"}}>pts{myRank>0?` · #${myRank}`:""}</div>
          </div>
        </div>
        {/* Sync bar */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
          <button onClick={syncResults} disabled={syncing} style={{
            background:"#21262d",border:"1px solid #30363d",color:syncing?"#484f58":"#8b949e",
            fontSize:11,padding:"4px 10px",borderRadius:6,cursor:syncing?"not-allowed":"pointer",
          }}>
            {syncing?"⟳ Actualizando...":"⟳ Sync resultados"}
          </button>
          {lastSync && <span style={{fontSize:10,color:"#484f58"}}>Última sync: {lastSync}</span>}
          {!ANTHROPIC_KEY && <span style={{fontSize:10,color:"#f85149"}}>⚠ Sin API key — sync manual</span>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #21262d",background:"#161b22"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1,padding:"11px 4px",background:"none",border:"none",
            borderBottom:tab===t.id?"2px solid #388bfd":"2px solid transparent",
            color:tab===t.id?"#388bfd":"#8b949e",fontWeight:600,fontSize:12,cursor:"pointer",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{padding:"16px 14px 80px"}}>

        {tab==="matches" && (
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

            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:12}}>
              {allGroups.map(g=>(
                <button key={g} onClick={()=>setGroupFilter(g)} style={{
                  background:groupFilter===g?"#1f6feb":"#161b22",
                  border:`1px solid ${groupFilter===g?"#1f6feb":"#30363d"}`,
                  color:groupFilter===g?"white":"#8b949e",
                  padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",
                }}>{g==="ALL"?"Todos":`G-${g}`}</button>
              ))}
            </div>

            {loading?(
              <div style={{textAlign:"center",color:"#8b949e",padding:40}}>Cargando...</div>
            ):visibleMatches.map(m=>(
              <MatchCard key={m.id} match={{...m, locked: isMatchLocked(m)}}
                pred={predictions[m.id]} actual={actuals[m.id]} onSave={savePrediction}/>
            ))}
          </div>
        )}

        {tab==="extras" && (
          <div>
            <div style={{background:"#161b22",border:"1px solid #3d2b00",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:12,color:"#8b949e"}}>
              ⭐ Cambia estos pronósticos antes del Jun 28 (inicio de eliminatoria).
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {[
                {key:"champion",label:"🏆 Campeón del mundo",options:ALL_TEAMS},
                {key:"top_scorer",label:"👟 Campeón de goleo",options:TOP_SCORERS},
                {key:"mexico_round",label:"🇲🇽 ¿Hasta dónde llega México?",options:MEXICO_ROUNDS},
              ].map(({key,label,options})=>(
                <div key={key}>
                  <label style={S.label}>{label}</label>
                  <select style={S.select} value={extras[key]||""}
                    onChange={e=>saveExtras({...extras,[key]:e.target.value})}>
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
                      <select style={{...S.select,fontSize:12,padding:"6px 8px"}}
                        value={(extras.group_winners||{})[letter]||""}
                        onChange={e=>saveExtras({...extras,group_winners:{...(extras.group_winners||{}),[letter]:e.target.value}})}>
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

        {tab==="table" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:11,color:"#8b949e",textTransform:"uppercase",letterSpacing:1}}>
                {leaderboard.length} participante{leaderboard.length!==1?"s":""}
              </div>
              <button onClick={loadLeaderboard} style={{background:"#161b22",border:"1px solid #30363d",color:"#8b949e",fontSize:11,padding:"4px 10px",borderRadius:6,cursor:"pointer"}}>
                ↻ Actualizar
              </button>
            </div>
            {leaderboard.map((p,i)=>(
              <div key={p.name} style={{
                display:"flex",alignItems:"center",gap:12,
                background:p.name===player.name?"#0d2137":"#161b22",
                border:`1px solid ${i===0?"#2d7d32":p.name===player.name?"#1c3d5c":"#21262d"}`,
                borderRadius:10,padding:"12px 16px",marginBottom:8,
              }}>
                <span style={{fontSize:18,width:28,textAlign:"center"}}>
                  {i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}
                </span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15}}>{p.name}{p.name===player.name?" (tú)":""}</div>
                  <div style={{fontSize:11,color:"#8b949e"}}>{p.predictions} pronósticos · {p.exact} exactos</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:900,fontSize:22,color:i===0?"#3fb950":"#e6edf3"}}>{p.pts}</div>
                  <div style={{fontSize:10,color:"#8b949e"}}>pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="admin" && isAdmin && (
          <div>
            <div style={{color:"#f85149",fontSize:12,marginBottom:16,background:"#2d1515",borderRadius:8,padding:"10px 14px"}}>
              ⚠️ Panel admin — los resultados que ingreses aquí se guardan en Supabase y calculan puntos para todos.
            </div>
            <button onClick={syncResults} disabled={syncing} style={{
              width:"100%",background:"#1f6feb",border:"none",color:"white",
              padding:"10px",borderRadius:8,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:16,
            }}>
              {syncing?"Sincronizando con IA...":"🤖 Sync automático con IA"}
            </button>
            <div style={{fontSize:11,color:"#484f58",marginBottom:16,textAlign:"center"}}>
              O ingresa resultados manualmente:
            </div>
            {MATCHES.map(m=>{
              const a = actuals[m.id]||{};
              return (
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #21262d",padding:"8px 0",fontSize:12}}>
                  <span style={{color:"#8b949e",width:20}}>{m.group}</span>
                  <span style={{flex:1,color:"#e6edf3",fontSize:11}}>{m.home} vs {m.away}</span>
                  <span style={{color:"#484f58",fontSize:10,width:36}}>{m.date}</span>
                  <input type="number" min={0} max={20} placeholder="—"
                    style={{...S.input,width:34,height:30,fontSize:13}}
                    defaultValue={a.home_goals??""} key={`h_${m.id}_${a.home_goals}`}
                    onBlur={async e=>{
                      const hg=e.target.value===""?null:+e.target.value;
                      const ag=actuals[m.id]?.away_goals??null;
                      if(hg!==null&&ag!==null) {
                        await supabase.from("results").upsert({match_id:m.id,home_goals:hg,away_goals:ag},{onConflict:"match_id"});
                        await loadActuals(); await loadLeaderboard();
                      }
                    }}/>
                  <span style={{color:"#8b949e"}}>-</span>
                  <input type="number" min={0} max={20} placeholder="—"
                    style={{...S.input,width:34,height:30,fontSize:13}}
                    defaultValue={a.away_goals??""} key={`a_${m.id}_${a.away_goals}`}
                    onBlur={async e=>{
                      const ag=e.target.value===""?null:+e.target.value;
                      const hg=actuals[m.id]?.home_goals??null;
                      if(hg!==null&&ag!==null) {
                        await supabase.from("results").upsert({match_id:m.id,home_goals:hg,away_goals:ag},{onConflict:"match_id"});
                        await loadActuals(); await loadLeaderboard();
                      }
                    }}/>
                  {actuals[m.id] && <span style={{color:"#3fb950",fontSize:10}}>✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin unlock */}
      {!isAdmin && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#161b22",borderTop:"1px solid #21262d",padding:"8px 16px",display:"flex",gap:8,maxWidth:700,margin:"0 auto"}}>
          <input type="password" placeholder="Contraseña admin..."
            value={adminInput} onChange={e=>setAdminInput(e.target.value)}
            style={{...S.select,flex:1,padding:"6px 10px",fontSize:12}}/>
          <button onClick={()=>{
            if(adminInput===ADMIN_PASSWORD){setIsAdmin(true);setTab("admin");}
            setAdminInput("");
          }} style={{background:"#21262d",border:"1px solid #30363d",color:"#8b949e",padding:"6px 12px",borderRadius:6,cursor:"pointer",fontSize:12}}>
            Admin
          </button>
        </div>
      )}
    </div>
  );
}
