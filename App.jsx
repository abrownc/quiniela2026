import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG — replace these with your Supabase project values ───────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "gol2026";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── DATA ────────────────────────────────────────────────────────────────────

const GROUPS = {
  A: ["México","RSA","Nueva Zelanda","Honduras"],
  B: ["Argentina","Marruecos","Irak","Eslovaquia"],
  C: ["EUA","Panamá","Albania","Ucrania"],
  D: ["Francia","Japón","Ecuador","Arabia S."],
  E: ["España","Brasil","Australia","Dinamarca"],
  F: ["Portugal","Senegal","Alemania","Costa Rica"],
  G: ["Países Bajos","Turquía","Serbia","China"],
  H: ["Uruguay","Colombia","Bélgica","Camerún"],
  I: ["Inglaterra","Nigeria","Rep. Checa","Argelia"],
  J: ["Suiza","Egipto","Ghana","Tailandia"],
  K: ["Croacia","Korea","Chile","Togo"],
  L: ["Italia","Canadá","Perú","Angola"],
};

const ALL_TEAMS = Object.values(GROUPS).flat().sort();

const TOP_SCORERS = [
  "K. Mbappé (FRA)","L. Messi (ARG)","V. Osimhen (NGA)","H. Kane (ENG)",
  "R. Lewandowski (POL)","Vinicius Jr. (BRA)","J. Bellingham (ENG)",
  "L. Martínez (MEX)","C. Ronaldo (POR)","M. Salah (EGY)",
  "A. Mitoma (JPN)","F. Torres (ESP)","A. Dávila (MEX)","O. Giménez (MEX)",
];

const MEXICO_ROUNDS = [
  "Fase de Grupos","Ronda de 32","Octavos de Final",
  "Cuartos de Final","Semifinal","Tercer Lugar","CAMPEÓN 🏆",
];

const MATCHES = [
  { id: "g_a1", group: "A", home: "México", away: "RSA", date: "Jun 11", matchday: 1 },
  { id: "g_a2", group: "A", home: "Nueva Zelanda", away: "Honduras", date: "Jun 12", matchday: 1 },
  { id: "g_b1", group: "B", home: "Argentina", away: "Marruecos", date: "Jun 12", matchday: 1 },
  { id: "g_b2", group: "B", home: "Irak", away: "Eslovaquia", date: "Jun 13", matchday: 1 },
  { id: "g_c1", group: "C", home: "EUA", away: "Panamá", date: "Jun 13", matchday: 1 },
  { id: "g_c2", group: "C", home: "Albania", away: "Ucrania", date: "Jun 14", matchday: 1 },
  { id: "g_d1", group: "D", home: "Francia", away: "Japón", date: "Jun 14", matchday: 1 },
  { id: "g_d2", group: "D", home: "Ecuador", away: "Arabia S.", date: "Jun 15", matchday: 1 },
  { id: "g_e1", group: "E", home: "España", away: "Brasil", date: "Jun 15", matchday: 1 },
  { id: "g_e2", group: "E", home: "Australia", away: "Dinamarca", date: "Jun 16", matchday: 1 },
  { id: "g_f1", group: "F", home: "Portugal", away: "Senegal", date: "Jun 16", matchday: 1 },
  { id: "g_f2", group: "F", home: "Alemania", away: "Costa Rica", date: "Jun 17", matchday: 1 },
  { id: "g_g1", group: "G", home: "Países Bajos", away: "Turquía", date: "Jun 17", matchday: 1 },
  { id: "g_g2", group: "G", home: "Serbia", away: "China", date: "Jun 18", matchday: 1 },
  { id: "g_h1", group: "H", home: "Uruguay", away: "Colombia", date: "Jun 18", matchday: 1 },
  { id: "g_h2", group: "H", home: "Bélgica", away: "Camerún", date: "Jun 19", matchday: 1 },
  { id: "g_i1", group: "I", home: "Inglaterra", away: "Nigeria", date: "Jun 19", matchday: 1 },
  { id: "g_i2", group: "I", home: "Rep. Checa", away: "Argelia", date: "Jun 20", matchday: 1 },
  { id: "g_j1", group: "J", home: "Suiza", away: "Egipto", date: "Jun 20", matchday: 1 },
  { id: "g_j2", group: "J", home: "Ghana", away: "Tailandia", date: "Jun 21", matchday: 1 },
  { id: "g_k1", group: "K", home: "Croacia", away: "Korea", date: "Jun 21", matchday: 1 },
  { id: "g_k2", group: "K", home: "Chile", away: "Togo", date: "Jun 22", matchday: 1 },
  { id: "g_l1", group: "L", home: "Italia", away: "Canadá", date: "Jun 22", matchday: 1 },
  { id: "g_l2", group: "L", home: "Perú", away: "Angola", date: "Jun 23", matchday: 1 },
  // Jornada 2
  { id: "g_a3", group: "A", home: "México", away: "Nueva Zelanda", date: "Jun 15", matchday: 2 },
  { id: "g_a4", group: "A", home: "RSA", away: "Honduras", date: "Jun 15", matchday: 2 },
  { id: "g_b3", group: "B", home: "Argentina", away: "Irak", date: "Jun 16", matchday: 2 },
  { id: "g_b4", group: "B", home: "Marruecos", away: "Eslovaquia", date: "Jun 16", matchday: 2 },
  { id: "g_c3", group: "C", home: "EUA", away: "Albania", date: "Jun 17", matchday: 2 },
  { id: "g_c4", group: "C", home: "Panamá", away: "Ucrania", date: "Jun 17", matchday: 2 },
  { id: "g_d3", group: "D", home: "Francia", away: "Ecuador", date: "Jun 18", matchday: 2 },
  { id: "g_d4", group: "D", home: "Japón", away: "Arabia S.", date: "Jun 18", matchday: 2 },
  { id: "g_e3", group: "E", home: "España", away: "Australia", date: "Jun 19", matchday: 2 },
  { id: "g_e4", group: "E", home: "Brasil", away: "Dinamarca", date: "Jun 19", matchday: 2 },
  { id: "g_f3", group: "F", home: "Portugal", away: "Alemania", date: "Jun 20", matchday: 2 },
  { id: "g_f4", group: "F", home: "Senegal", away: "Costa Rica", date: "Jun 20", matchday: 2 },
  { id: "g_g3", group: "G", home: "Países Bajos", away: "Serbia", date: "Jun 21", matchday: 2 },
  { id: "g_g4", group: "G", home: "Turquía", away: "China", date: "Jun 21", matchday: 2 },
  { id: "g_h3", group: "H", home: "Uruguay", away: "Bélgica", date: "Jun 22", matchday: 2 },
  { id: "g_h4", group: "H", home: "Colombia", away: "Camerún", date: "Jun 22", matchday: 2 },
  { id: "g_i3", group: "I", home: "Inglaterra", away: "Rep. Checa", date: "Jun 23", matchday: 2 },
  { id: "g_i4", group: "I", home: "Nigeria", away: "Argelia", date: "Jun 23", matchday: 2 },
  { id: "g_j3", group: "J", home: "Suiza", away: "Ghana", date: "Jun 24", matchday: 2 },
  { id: "g_j4", group: "J", home: "Egipto", away: "Tailandia", date: "Jun 24", matchday: 2 },
  { id: "g_k3", group: "K", home: "Croacia", away: "Chile", date: "Jun 25", matchday: 2 },
  { id: "g_k4", group: "K", home: "Korea", away: "Togo", date: "Jun 25", matchday: 2 },
  { id: "g_l3", group: "L", home: "Italia", away: "Perú", date: "Jun 26", matchday: 2 },
  { id: "g_l4", group: "L", home: "Canadá", away: "Angola", date: "Jun 26", matchday: 2 },
  // Jornada 3
  { id: "g_a5", group: "A", home: "México", away: "Honduras", date: "Jun 26", matchday: 3 },
  { id: "g_a6", group: "A", home: "RSA", away: "Nueva Zelanda", date: "Jun 26", matchday: 3 },
  { id: "g_b5", group: "B", home: "Argentina", away: "Eslovaquia", date: "Jun 27", matchday: 3 },
  { id: "g_b6", group: "B", home: "Marruecos", away: "Irak", date: "Jun 27", matchday: 3 },
  { id: "g_c5", group: "C", home: "EUA", away: "Ucrania", date: "Jun 28", matchday: 3 },
  { id: "g_c6", group: "C", home: "Panamá", away: "Albania", date: "Jun 28", matchday: 3 },
  { id: "g_d5", group: "D", home: "Francia", away: "Arabia S.", date: "Jun 29", matchday: 3 },
  { id: "g_d6", group: "D", home: "Japón", away: "Ecuador", date: "Jun 29", matchday: 3 },
  { id: "g_e5", group: "E", home: "España", away: "Dinamarca", date: "Jun 30", matchday: 3 },
  { id: "g_e6", group: "E", home: "Brasil", away: "Australia", date: "Jun 30", matchday: 3 },
  { id: "g_f5", group: "F", home: "Portugal", away: "Costa Rica", date: "Jul 1", matchday: 3 },
  { id: "g_f6", group: "F", home: "Alemania", away: "Senegal", date: "Jul 1", matchday: 3 },
  { id: "g_g5", group: "G", home: "Países Bajos", away: "China", date: "Jul 2", matchday: 3 },
  { id: "g_g6", group: "G", home: "Turquía", away: "Serbia", date: "Jul 2", matchday: 3 },
  { id: "g_h5", group: "H", home: "Uruguay", away: "Bélgica", date: "Jul 3", matchday: 3 },
  { id: "g_h6", group: "H", home: "Colombia", away: "Camerún", date: "Jul 3", matchday: 3 },
  { id: "g_i5", group: "I", home: "Inglaterra", away: "Argelia", date: "Jul 4", matchday: 3 },
  { id: "g_i6", group: "I", home: "Nigeria", away: "Rep. Checa", date: "Jul 4", matchday: 3 },
  { id: "g_j5", group: "J", home: "Suiza", away: "Tailandia", date: "Jul 5", matchday: 3 },
  { id: "g_j6", group: "J", home: "Egipto", away: "Ghana", date: "Jul 5", matchday: 3 },
  { id: "g_k5", group: "K", home: "Croacia", away: "Togo", date: "Jul 6", matchday: 3 },
  { id: "g_k6", group: "K", home: "Korea", away: "Chile", date: "Jul 6", matchday: 3 },
  { id: "g_l5", group: "L", home: "Italia", away: "Angola", date: "Jul 7", matchday: 3 },
  { id: "g_l6", group: "L", home: "Canadá", away: "Perú", date: "Jul 7", matchday: 3 },
];

// ─── SCORING ─────────────────────────────────────────────────────────────────

function calcScore(homeP, awayP, homeA, awayA) {
  if (homeP == null || awayP == null || homeA == null || awayA == null) return null;
  const predWinner = homeP > awayP ? "H" : homeP < awayP ? "A" : "D";
  const actWinner  = homeA > awayA ? "H" : homeA < awayA ? "A" : "D";
  if (predWinner !== actWinner) return 0;
  if (homeP === homeA && awayP === awayA) return 3;
  if (Math.abs(homeP - awayP) === Math.abs(homeA - awayA)) return 2;
  return 1;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const S = {
  input: {
    width: 44, height: 40, background: "#0d1117",
    border: "1.5px solid #30363d", borderRadius: 8,
    color: "#e6edf3", fontWeight: 700, fontSize: 18,
    textAlign: "center", outline: "none", padding: 0,
    fontFamily: "inherit",
  },
  select: {
    width: "100%", background: "#0d1117",
    border: "1.5px solid #30363d", borderRadius: 8,
    color: "#e6edf3", fontSize: 13, padding: "8px 10px",
    outline: "none", fontFamily: "inherit",
  },
  label: {
    fontSize: 11, color: "#8b949e", fontWeight: 600,
    display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8,
  },
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function PtsBadge({ pts }) {
  if (pts === null || pts === undefined) return null;
  const cfg = {
    0: { bg: "#3d1515", color: "#f85149", label: "0" },
    1: { bg: "#2d2000", color: "#d29922", label: "+1" },
    2: { bg: "#0d2137", color: "#388bfd", label: "+2" },
    3: { bg: "#0d2b1d", color: "#3fb950", label: "+3" },
  };
  const c = cfg[pts] || cfg[0];
  return (
    <span style={{
      background: c.bg, color: c.color, fontWeight: 800,
      fontSize: 11, padding: "2px 8px", borderRadius: 20, letterSpacing: 0.5,
    }}>{c.label} pts</span>
  );
}

function MatchCard({ match, pred, actual, onSave, locked }) {
  const [home, setHome] = useState(pred?.home_goals ?? "");
  const [away, setAway] = useState(pred?.away_goals ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setHome(pred?.home_goals ?? "");
    setAway(pred?.away_goals ?? "");
  }, [pred]);

  const pts = calcScore(
    home !== "" ? +home : null,
    away !== "" ? +away : null,
    actual?.home_goals ?? null,
    actual?.away_goals ?? null
  );

  async function handleSave() {
    if (home === "" || away === "") return;
    setSaving(true);
    await onSave(match.id, +home, +away);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div style={{
      background: "#161b22", borderRadius: 10,
      padding: "14px 16px", marginBottom: 8,
      border: `1px solid ${actual ? "#21262d" : "#30363d"}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#8b949e", fontWeight: 600 }}>
          Grupo {match.group} · J{match.matchday} · {match.date}
        </span>
        <PtsBadge pts={actual ? pts : null} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ flex: 1, textAlign: "right", fontWeight: 700, fontSize: 14, color: "#e6edf3" }}>{match.home}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="number" min={0} max={20} style={S.input}
            value={home} placeholder="?" disabled={locked}
            onChange={e => setHome(e.target.value)} onBlur={handleSave} />
          <span style={{ color: "#8b949e", fontWeight: 700 }}>-</span>
          <input type="number" min={0} max={20} style={S.input}
            value={away} placeholder="?" disabled={locked}
            onChange={e => setAway(e.target.value)} onBlur={handleSave} />
        </div>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: "#e6edf3" }}>{match.away}</span>
      </div>
      {actual && (
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 11, color: "#8b949e" }}>
          Resultado: {actual.home_goals} – {actual.away_goals}
        </div>
      )}
      {saving && <div style={{ textAlign: "center", fontSize: 10, color: "#8b949e", marginTop: 4 }}>Guardando...</div>}
      {saved && <div style={{ textAlign: "center", fontSize: 10, color: "#3fb950", marginTop: 4 }}>✓ Guardado</div>}
    </div>
  );
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("players")
        .upsert({ name: trimmed }, { onConflict: "name" })
        .select()
        .single();
      if (error) throw error;
      onLogin(data);
    } catch (e) {
      setError("Error al entrar. Intenta de nuevo.");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 340, textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>⚽</div>
        <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 900, color: "#e6edf3" }}>Quiniela 2026</h1>
        <p style={{ color: "#8b949e", fontSize: 14, margin: "0 0 32px" }}>USA · Canada · Mexico</p>
        <input
          type="text" placeholder="Tu nombre o apodo..."
          value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleJoin()}
          style={{
            ...S.select, fontSize: 16, padding: "12px 16px",
            marginBottom: 12, textAlign: "center",
          }}
        />
        {error && <div style={{ color: "#f85149", fontSize: 13, marginBottom: 8 }}>{error}</div>}
        <button onClick={handleJoin} disabled={loading || !name.trim()} style={{
          width: "100%", background: "#1f6feb", border: "none", color: "white",
          padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 16,
          cursor: "pointer", opacity: loading || !name.trim() ? 0.5 : 1,
        }}>
          {loading ? "Entrando..." : "Entrar a la quiniela →"}
        </button>
        <p style={{ color: "#484f58", fontSize: 12, marginTop: 20 }}>
          Si ya ingresaste antes, tu nombre recupera tus pronósticos.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [player, setPlayer] = useState(null);
  const [tab, setTab] = useState("matches");
  const [predictions, setPredictions] = useState({});
  const [actuals, setActuals] = useState({});
  const [extras, setExtras] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminActuals, setAdminActuals] = useState({});
  const [groupFilter, setGroupFilter] = useState("ALL");

  // ── Load data on login ──
  useEffect(() => {
    if (!player) return;
    loadAll();
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [player]);

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadPredictions(), loadActuals(), loadExtras(), loadLeaderboard()]);
    setLoading(false);
  }

  async function loadPredictions() {
    const { data } = await supabase
      .from("predictions")
      .select("*")
      .eq("player_id", player.id);
    if (data) {
      const map = {};
      data.forEach(r => { map[r.match_id] = r; });
      setPredictions(map);
    }
  }

  async function loadActuals() {
    const { data } = await supabase.from("results").select("*");
    if (data) {
      const map = {};
      data.forEach(r => { map[r.match_id] = r; });
      setActuals(map);
      setAdminActuals(map);
    }
  }

  async function loadExtras() {
    const { data } = await supabase
      .from("extras")
      .select("*")
      .eq("player_id", player.id)
      .maybeSingle();
    if (data) setExtras(data);
  }

  async function loadLeaderboard() {
    const { data: players } = await supabase.from("players").select("id, name");
    const { data: preds } = await supabase.from("predictions").select("*");
    const { data: results } = await supabase.from("results").select("*");
    if (!players || !preds || !results) return;

    const resultsMap = {};
    results.forEach(r => { resultsMap[r.match_id] = r; });

    const board = players.map(p => {
      const myPreds = preds.filter(pr => pr.player_id === p.id);
      const pts = myPreds.reduce((sum, pr) => {
        const actual = resultsMap[pr.match_id];
        if (!actual) return sum;
        const s = calcScore(pr.home_goals, pr.away_goals, actual.home_goals, actual.away_goals);
        return sum + (s || 0);
      }, 0);
      const correct = myPreds.filter(pr => {
        const actual = resultsMap[pr.match_id];
        if (!actual) return false;
        return calcScore(pr.home_goals, pr.away_goals, actual.home_goals, actual.away_goals) === 3;
      }).length;
      return { name: p.name, pts, exact: correct, predictions: myPreds.length };
    }).sort((a, b) => b.pts - a.pts || b.exact - a.exact);

    setLeaderboard(board);
  }

  async function savePrediction(matchId, homeGoals, awayGoals) {
    await supabase.from("predictions").upsert({
      player_id: player.id,
      match_id: matchId,
      home_goals: homeGoals,
      away_goals: awayGoals,
    }, { onConflict: "player_id,match_id" });
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], match_id: matchId, home_goals: homeGoals, away_goals: awayGoals }
    }));
  }

  async function saveActual(matchId, homeGoals, awayGoals) {
    await supabase.from("results").upsert({
      match_id: matchId,
      home_goals: homeGoals,
      away_goals: awayGoals,
    }, { onConflict: "match_id" });
    setActuals(prev => ({ ...prev, [matchId]: { match_id: matchId, home_goals: homeGoals, away_goals: awayGoals } }));
  }

  async function saveExtras(newExtras) {
    const toSave = { ...newExtras, player_id: player.id };
    await supabase.from("extras").upsert(toSave, { onConflict: "player_id" });
    setExtras(toSave);
  }

  if (!player) return <LoginScreen onLogin={setPlayer} />;

  const myPts = Object.entries(predictions).reduce((sum, [mid, pred]) => {
    const actual = actuals[mid];
    if (!actual) return sum;
    return sum + (calcScore(pred.home_goals, pred.away_goals, actual.home_goals, actual.away_goals) || 0);
  }, 0);

  const myRank = leaderboard.findIndex(p => p.name === player.name) + 1;

  const allGroups = ["ALL", ...Object.keys(GROUPS)];
  const visibleMatches = groupFilter === "ALL"
    ? MATCHES
    : MATCHES.filter(m => m.group === groupFilter);

  return (
    <div style={{ background: "#0d1117", minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif", color: "#e6edf3", maxWidth: 700, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "#161b22", borderBottom: "1px solid #21262d", padding: "16px 20px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: "#388bfd", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Quiniela 2026</div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>Hola, {player.name} 👋</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#3fb950", lineHeight: 1 }}>{myPts}</div>
            <div style={{ fontSize: 11, color: "#8b949e" }}>pts{myRank > 0 ? ` · #${myRank}` : ""}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #21262d", background: "#161b22" }}>
        {[
          { id: "matches", label: "⚽ Partidos" },
          { id: "extras", label: "⭐ Extras" },
          { id: "table", label: "🏆 Tabla" },
          ...(isAdmin ? [{ id: "admin", label: "⚙️ Admin" }] : []),
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "11px 4px", background: "none", border: "none",
            borderBottom: tab === t.id ? "2px solid #388bfd" : "2px solid transparent",
            color: tab === t.id ? "#388bfd" : "#8b949e",
            fontWeight: 600, fontSize: 12, cursor: "pointer",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "16px 14px 80px" }}>

        {/* MATCHES TAB */}
        {tab === "matches" && (
          <div>
            {/* Scoring legend */}
            <div style={{ background: "#161b22", border: "1px solid #1c3d5c", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 12 }}>
              <div style={{ color: "#388bfd", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Puntuación</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 12px", color: "#8b949e" }}>
                <div><PtsBadge pts={0} /> Ganador incorrecto</div>
                <div><PtsBadge pts={1} /> Ganador correcto</div>
                <div><PtsBadge pts={2} /> + diferencia correcta</div>
                <div><PtsBadge pts={3} /> Marcador exacto</div>
              </div>
            </div>

            {/* Group filter */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
              {allGroups.map(g => (
                <button key={g} onClick={() => setGroupFilter(g)} style={{
                  background: groupFilter === g ? "#1f6feb" : "#161b22",
                  border: `1px solid ${groupFilter === g ? "#1f6feb" : "#30363d"}`,
                  color: groupFilter === g ? "white" : "#8b949e",
                  padding: "5px 12px", borderRadius: 20, fontSize: 12,
                  fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                }}>{g === "ALL" ? "Todos" : `Grupo ${g}`}</button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", color: "#8b949e", padding: 40 }}>Cargando...</div>
            ) : (
              visibleMatches.map(m => (
                <MatchCard
                  key={m.id} match={m}
                  pred={predictions[m.id]}
                  actual={actuals[m.id]}
                  onSave={savePrediction}
                  locked={!!actuals[m.id]}
                />
              ))
            )}
          </div>
        )}

        {/* EXTRAS TAB */}
        {tab === "extras" && (
          <div>
            <div style={{ background: "#161b22", border: "1px solid #3d2b00", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#8b949e" }}>
              ⚠️ Estos pronósticos se registran una sola vez. Puedes cambiarlos mientras la quiniela esté activa.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "champion", label: "🏆 Campeón del mundo", options: ALL_TEAMS },
                { key: "top_scorer", label: "👟 Campeón de goleo", options: TOP_SCORERS },
                { key: "mexico_round", label: "🇲🇽 ¿Hasta dónde llega México?", options: MEXICO_ROUNDS },
              ].map(({ key, label, options }) => (
                <div key={key}>
                  <label style={S.label}>{label}</label>
                  <select style={S.select} value={extras[key] || ""}
                    onChange={e => saveExtras({ ...extras, [key]: e.target.value })}>
                    <option value="">Selecciona...</option>
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={S.label}>Ganadores de grupo (1° lugar)</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                  {Object.entries(GROUPS).map(([letter, teams]) => (
                    <div key={letter} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#8b949e", fontSize: 11, fontWeight: 700, width: 22 }}>G-{letter}</span>
                      <select style={{ ...S.select, fontSize: 12, padding: "6px 8px" }}
                        value={(extras.group_winners || {})[letter] || ""}
                        onChange={e => saveExtras({
                          ...extras,
                          group_winners: { ...(extras.group_winners || {}), [letter]: e.target.value }
                        })}>
                        <option value="">—</option>
                        {teams.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {tab === "table" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#8b949e", textTransform: "uppercase", letterSpacing: 1 }}>
                {leaderboard.length} participante{leaderboard.length !== 1 ? "s" : ""}
              </div>
              <button onClick={loadLeaderboard} style={{
                background: "#161b22", border: "1px solid #30363d", color: "#8b949e",
                fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
              }}>↻ Actualizar</button>
            </div>
            {leaderboard.length === 0 ? (
              <div style={{ textAlign: "center", color: "#8b949e", padding: 40 }}>Cargando tabla...</div>
            ) : leaderboard.map((p, i) => (
              <div key={p.name} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: p.name === player.name ? "#0d2137" : "#161b22",
                border: `1px solid ${i === 0 ? "#2d7d32" : p.name === player.name ? "#1c3d5c" : "#21262d"}`,
                borderRadius: 10, padding: "12px 16px", marginBottom: 8,
              }}>
                <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}{p.name === player.name ? " (tú)" : ""}</div>
                  <div style={{ fontSize: 11, color: "#8b949e" }}>
                    {p.predictions} pronósticos · {p.exact} exactos
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 900, fontSize: 22, color: i === 0 ? "#3fb950" : "#e6edf3" }}>{p.pts}</div>
                  <div style={{ fontSize: 10, color: "#8b949e" }}>pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADMIN TAB */}
        {tab === "admin" && isAdmin && (
          <div>
            <div style={{ color: "#f85149", fontSize: 12, marginBottom: 16, background: "#2d1515", borderRadius: 8, padding: "10px 14px" }}>
              ⚠️ Solo admins. Los resultados que ingreses aquí calculan los puntos de todos.
            </div>
            {MATCHES.map(m => {
              const a = adminActuals[m.id] || {};
              return (
                <div key={m.id} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  borderBottom: "1px solid #21262d", padding: "10px 0", fontSize: 13,
                }}>
                  <span style={{ color: "#8b949e", fontSize: 11, width: 16 }}>{m.group}</span>
                  <span style={{ flex: 1, color: "#e6edf3", fontSize: 13 }}>{m.home} vs {m.away}</span>
                  <input type="number" min={0} max={20} placeholder="—" style={{ ...S.input, width: 36, height: 32, fontSize: 14 }}
                    value={a.home_goals ?? ""}
                    onChange={e => setAdminActuals(prev => ({ ...prev, [m.id]: { ...prev[m.id], home_goals: e.target.value === "" ? null : +e.target.value } }))} />
                  <span style={{ color: "#8b949e" }}>-</span>
                  <input type="number" min={0} max={20} placeholder="—" style={{ ...S.input, width: 36, height: 32, fontSize: 14 }}
                    value={a.away_goals ?? ""}
                    onChange={e => setAdminActuals(prev => ({ ...prev, [m.id]: { ...prev[m.id], away_goals: e.target.value === "" ? null : +e.target.value } }))} />
                  <button onClick={() => {
                    const a = adminActuals[m.id];
                    if (a?.home_goals != null && a?.away_goals != null) saveActual(m.id, a.home_goals, a.away_goals);
                  }} style={{
                    background: "#1f6feb", border: "none", color: "white",
                    padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12,
                  }}>✓</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin unlock footer */}
      {!isAdmin && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#161b22", borderTop: "1px solid #21262d", padding: "8px 16px", display: "flex", gap: 8, maxWidth: 700, margin: "0 auto" }}>
          <input type="password" placeholder="Contraseña admin..."
            value={adminInput} onChange={e => setAdminInput(e.target.value)}
            style={{ ...S.select, flex: 1, padding: "6px 10px", fontSize: 12 }} />
          <button onClick={() => {
            if (adminInput === ADMIN_PASSWORD) { setIsAdmin(true); setTab("admin"); }
            setAdminInput("");
          }} style={{
            background: "#21262d", border: "1px solid #30363d", color: "#8b949e",
            padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12,
          }}>Admin</button>
        </div>
      )}
    </div>
  );
}
