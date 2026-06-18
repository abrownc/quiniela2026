import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "gol2026";
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GROUPS = {
  A:["México","Sudáfrica","Corea del Sur","Rep. Checa"],
  B:["Canadá","Bosnia-Herz.","Catar","Suiza"],
  C:["Brasil","Marruecos","Haití","Escocia"],
  D:["EUA","Paraguay","Australia","Turquía"],
  E:["Alemania","Curazao","Costa de Marfil","Ecuador"],
  F:["Países Bajos","Japón","Suecia","Túnez"],
  G:["Bélgica","Egipto","Irán","Nueva Zelanda"],
  H:["España","Cabo Verde","Arabia Saudita","Uruguay"],
  I:["Francia","Senegal","Iraq","Noruega"],
  J:["Argentina","Argelia","Austria","Jordania"],
  K:["Portugal","DR Congo","Uzbekistán","Colombia"],
  L:["Inglaterra","Croacia","Ghana","Panamá"],
};

// Resultados conocidos Jun 11-16 (para calcular puntos, no se muestran)
const KNOWN_RESULTS = {
  a1:{home_goals:2,away_goals:0}, a2:{home_goals:2,away_goals:1},
  b1:{home_goals:1,away_goals:1}, b2:{home_goals:1,away_goals:1},
  c1:{home_goals:1,away_goals:1}, c2:{home_goals:1,away_goals:0},
  d1:{home_goals:4,away_goals:1}, d2:{home_goals:2,away_goals:0},
  e1:{home_goals:7,away_goals:1}, e2:{home_goals:1,away_goals:0},
  f1:{home_goals:2,away_goals:2}, f2:{home_goals:5,away_goals:1},
  g1:{home_goals:1,away_goals:1}, g2:{home_goals:2,away_goals:2},
  h1:{home_goals:0,away_goals:0}, h2:{home_goals:1,away_goals:1},
};

// Partidos (incluye fases anteriores)
const MATCHES = [
  // Jun 11 - Jun 16 (added historical matches)
  {id:"a1",g:"A",home:"México",        away:"Sudáfrica",      date:"2026-06-11",datetime:"2026-06-11T14:00:00-05:00",label:"Jun 11"},
  {id:"a2",g:"A",home:"Corea del Sur", away:"Rep. Checa",     date:"2026-06-11",datetime:"2026-06-11T21:00:00-05:00",label:"Jun 11"},
  {id:"b1",g:"B",home:"Canadá",        away:"Bosnia-Herz.",  date:"2026-06-12",datetime:"2026-06-12T14:00:00-05:00",label:"Jun 12"},
  {id:"d1",g:"D",home:"EUA",           away:"Paraguay",       date:"2026-06-12",datetime:"2026-06-12T20:00:00-05:00",label:"Jun 12"},
  {id:"c1",g:"C",home:"Haití",         away:"Escocia",        date:"2026-06-13",datetime:"2026-06-13T20:00:00-05:00",label:"Jun 13"},
  {id:"d2",g:"D",home:"Australia",     away:"Turquía",       date:"2026-06-13",datetime:"2026-06-13T23:00:00-05:00",label:"Jun 13"},
  {id:"c2",g:"C",home:"Brasil",        away:"Marruecos",      date:"2026-06-13",datetime:"2026-06-13T17:00:00-05:00",label:"Jun 13"},
  {id:"b2",g:"B",home:"Catar",         away:"Suiza",          date:"2026-06-13",datetime:"2026-06-13T14:00:00-05:00",label:"Jun 13"},
  {id:"e1",g:"E",home:"Costa de Marfil",away:"Ecuador",       date:"2026-06-14",datetime:"2026-06-14T18:00:00-05:00",label:"Jun 14"},
  {id:"e2",g:"E",home:"Alemania",      away:"Curazao",        date:"2026-06-14",datetime:"2026-06-14T12:00:00-05:00",label:"Jun 14"},
  {id:"f1",g:"F",home:"Países Bajos",  away:"Japón",          date:"2026-06-14",datetime:"2026-06-14T15:00:00-05:00",label:"Jun 14"},
  {id:"f2",g:"F",home:"Suecia",        away:"Túnez",          date:"2026-06-14",datetime:"2026-06-14T21:00:00-05:00",label:"Jun 14"},
  {id:"h1",g:"H",home:"Arabia Saudita",away:"Uruguay",        date:"2026-06-15",datetime:"2026-06-15T17:00:00-05:00",label:"Jun 15"},
  {id:"h2",g:"H",home:"España",        away:"Cabo Verde",     date:"2026-06-15",datetime:"2026-06-15T11:00:00-05:00",label:"Jun 15"},
  {id:"g1",g:"G",home:"Irán",          away:"Nueva Zelanda",  date:"2026-06-15",datetime:"2026-06-15T20:00:00-05:00",label:"Jun 15"},
  {id:"g2",g:"G",home:"Bélgica",       away:"Egipto",         date:"2026-06-15",datetime:"2026-06-15T14:00:00-05:00",label:"Jun 15"},
  {id:"i1",g:"I",home:"Francia",       away:"Senegal",        date:"2026-06-16",datetime:"2026-06-16T14:00:00-05:00",label:"Jun 16"},
  {id:"i2",g:"I",home:"Iraq",          away:"Noruega",        date:"2026-06-16",datetime:"2026-06-16T17:00:00-05:00",label:"Jun 16"},
  {id:"j1",g:"J",home:"Argentina",     away:"Argelia",        date:"2026-06-16",datetime:"2026-06-16T20:00:00-05:00",label:"Jun 16"},
  // Jun 17
  {id:"k1",g:"K",home:"Portugal",      away:"DR Congo",       date:"2026-06-17",datetime:"2026-06-17T12:00:00-05:00",label:"Jun 17",md:1},
  {id:"k2",g:"K",home:"Uzbekistán",    away:"Colombia",       date:"2026-06-17",datetime:"2026-06-17T21:00:00-05:00",label:"Jun 17",md:1},
  {id:"l1",g:"L",home:"Inglaterra",    away:"Croacia",        date:"2026-06-17",datetime:"2026-06-17T15:00:00-05:00",label:"Jun 17",md:1},
  {id:"l2",g:"L",home:"Ghana",         away:"Panamá",         date:"2026-06-17",datetime:"2026-06-17T15:00:00-05:00",label:"Jun 17",md:1},
  {id:"j2",g:"J",home:"Austria",       away:"Jordania",       date:"2026-06-16",datetime:"2026-06-16T23:00:00-05:00",label:"Jun 16",md:1},
  // Jun 18
  {id:"a3",g:"A",home:"Rep. Checa",    away:"Sudáfrica",      date:"2026-06-18",datetime:"2026-06-18T11:00:00-05:00",label:"Jun 18",md:2},
  {id:"a4",g:"A",home:"México",        away:"Corea del Sur",  date:"2026-06-18",datetime:"2026-06-18T22:00:00-05:00",label:"Jun 18",md:2},
  {id:"b3",g:"B",home:"Suiza",         away:"Bosnia-Herz.",   date:"2026-06-18",datetime:"2026-06-18T14:00:00-05:00",label:"Jun 18",md:2},
  {id:"b4",g:"B",home:"Canadá",        away:"Catar",          date:"2026-06-18",datetime:"2026-06-18T17:00:00-05:00",label:"Jun 18",md:2},
  // Jun 19
  {id:"c3",g:"C",home:"Escocia",       away:"Marruecos",      date:"2026-06-19",datetime:"2026-06-19T17:00:00-05:00",label:"Jun 19",md:2},
  {id:"c4",g:"C",home:"Brasil",        away:"Haití",          date:"2026-06-19",datetime:"2026-06-19T20:00:00-05:00",label:"Jun 19",md:2},
  {id:"d3",g:"D",home:"EUA",           away:"Australia",      date:"2026-06-19",datetime:"2026-06-19T14:00:00-05:00",label:"Jun 19",md:2},
  {id:"d4",g:"D",home:"Turquía",       away:"Paraguay",       date:"2026-06-19",datetime:"2026-06-19T22:00:00-05:00",label:"Jun 19",md:2},
  // Jun 20
  {id:"e3",g:"E",home:"Alemania",      away:"Costa de Marfil",date:"2026-06-20",datetime:"2026-06-20T15:00:00-05:00",label:"Jun 20",md:2},
  {id:"e4",g:"E",home:"Ecuador",       away:"Curazao",        date:"2026-06-20",datetime:"2026-06-20T19:00:00-05:00",label:"Jun 20",md:2},
  {id:"f3",g:"F",home:"Países Bajos",  away:"Suecia",         date:"2026-06-20",datetime:"2026-06-20T12:00:00-05:00",label:"Jun 20",md:2},
  {id:"f4",g:"F",home:"Túnez",         away:"Japón",          date:"2026-06-20",datetime:"2026-06-20T23:00:00-05:00",label:"Jun 20",md:2},
  // Jun 21
  {id:"g3",g:"G",home:"Bélgica",       away:"Irán",           date:"2026-06-21",datetime:"2026-06-21T17:00:00-05:00",label:"Jun 21",md:2},
  {id:"g4",g:"G",home:"Nueva Zelanda", away:"Egipto",         date:"2026-06-21",datetime:"2026-06-21T20:00:00-05:00",label:"Jun 21",md:2},
  {id:"h3",g:"H",home:"España",        away:"Arabia Saudita", date:"2026-06-21",datetime:"2026-06-21T11:00:00-05:00",label:"Jun 21",md:2},
  {id:"h4",g:"H",home:"Uruguay",       away:"Cabo Verde",     date:"2026-06-21",datetime:"2026-06-21T17:00:00-05:00",label:"Jun 21",md:2},
  // Jun 22
  {id:"i3",g:"I",home:"Francia",       away:"Iraq",           date:"2026-06-22",datetime:"2026-06-22T16:00:00-05:00",label:"Jun 22",md:2},
  {id:"i4",g:"I",home:"Noruega",       away:"Senegal",        date:"2026-06-22",datetime:"2026-06-22T19:00:00-05:00",label:"Jun 22",md:2},
  {id:"j3",g:"J",home:"Argentina",     away:"Austria",        date:"2026-06-22",datetime:"2026-06-22T12:00:00-05:00",label:"Jun 22",md:2},
  {id:"j4",g:"J",home:"Jordania",      away:"Argelia",        date:"2026-06-22",datetime:"2026-06-22T22:00:00-05:00",label:"Jun 22",md:2},
  // Jun 23
  {id:"k3",g:"K",home:"Portugal",      away:"Uzbekistán",     date:"2026-06-23",datetime:"2026-06-23T12:00:00-05:00",label:"Jun 23",md:2},
  {id:"k4",g:"K",home:"Colombia",      away:"DR Congo",       date:"2026-06-23",datetime:"2026-06-23T21:00:00-05:00",label:"Jun 23",md:2},
  {id:"l3",g:"L",home:"Ghana",         away:"Croacia",        date:"2026-06-23",datetime:"2026-06-23T15:00:00-05:00",label:"Jun 23",md:2},
  {id:"l4",g:"L",home:"Inglaterra",    away:"Panamá",         date:"2026-06-23",datetime:"2026-06-23T18:00:00-05:00",label:"Jun 23",md:2},
  // Jun 24
  {id:"a5",g:"A",home:"Rep. Checa",    away:"México",         date:"2026-06-24",datetime:"2026-06-24T22:00:00-05:00",label:"Jun 24",md:3},
  {id:"a6",g:"A",home:"Sudáfrica",     away:"Corea del Sur",  date:"2026-06-24",datetime:"2026-06-24T22:00:00-05:00",label:"Jun 24",md:3},
  {id:"b5",g:"B",home:"Suiza",         away:"Canadá",         date:"2026-06-24",datetime:"2026-06-24T14:00:00-05:00",label:"Jun 24",md:3},
  {id:"b6",g:"B",home:"Bosnia-Herz.",  away:"Catar",          date:"2026-06-24",datetime:"2026-06-24T14:00:00-05:00",label:"Jun 24",md:3},
  {id:"c5",g:"C",home:"Escocia",       away:"Brasil",         date:"2026-06-24",datetime:"2026-06-24T17:00:00-05:00",label:"Jun 24",md:3},
  {id:"c6",g:"C",home:"Marruecos",     away:"Haití",          date:"2026-06-24",datetime:"2026-06-24T17:00:00-05:00",label:"Jun 24",md:3},
  // Jun 25
  {id:"d5",g:"D",home:"Turquía",       away:"EUA",            date:"2026-06-25",datetime:"2026-06-25T21:00:00-05:00",label:"Jun 25",md:3},
  {id:"d6",g:"D",home:"Paraguay",      away:"Australia",      date:"2026-06-25",datetime:"2026-06-25T21:00:00-05:00",label:"Jun 25",md:3},
  {id:"e5",g:"E",home:"Ecuador",       away:"Alemania",       date:"2026-06-25",datetime:"2026-06-25T15:00:00-05:00",label:"Jun 25",md:3},
  {id:"e6",g:"E",home:"Curazao",       away:"Costa de Marfil",date:"2026-06-25",datetime:"2026-06-25T15:00:00-05:00",label:"Jun 25",md:3},
  {id:"f5",g:"F",home:"Japón",         away:"Suecia",         date:"2026-06-25",datetime:"2026-06-25T18:00:00-05:00",label:"Jun 25",md:3},
  {id:"f6",g:"F",home:"Túnez",         away:"Países Bajos",   date:"2026-06-25",datetime:"2026-06-25T18:00:00-05:00",label:"Jun 25",md:3},
  // Jun 26
  {id:"g5",g:"G",home:"Egipto",        away:"Irán",           date:"2026-06-26",datetime:"2026-06-26T22:00:00-05:00",label:"Jun 26",md:3},
  {id:"g6",g:"G",home:"Nueva Zelanda", away:"Bélgica",        date:"2026-06-26",datetime:"2026-06-26T22:00:00-05:00",label:"Jun 26",md:3},
  {id:"h5",g:"H",home:"Cabo Verde",    away:"Arabia Saudita", date:"2026-06-26",datetime:"2026-06-26T17:00:00-05:00",label:"Jun 26",md:3},
  {id:"h6",g:"H",home:"Uruguay",       away:"España",         date:"2026-06-26",datetime:"2026-06-26T19:00:00-05:00",label:"Jun 26",md:3},
  {id:"i5",g:"I",home:"Francia",       away:"Noruega",        date:"2026-06-26",datetime:"2026-06-26T14:00:00-05:00",label:"Jun 26",md:3},
  {id:"i6",g:"I",home:"Senegal",       away:"Iraq",           date:"2026-06-26",datetime:"2026-06-26T14:00:00-05:00",label:"Jun 26",md:3},
  // Jun 27
  {id:"j5",g:"J",home:"Jordania",      away:"Argentina",      date:"2026-06-27",datetime:"2026-06-27T21:00:00-05:00",label:"Jun 27",md:3},
  {id:"j6",g:"J",home:"Argelia",       away:"Austria",        date:"2026-06-27",datetime:"2026-06-27T21:00:00-05:00",label:"Jun 27",md:3},
  {id:"k5",g:"K",home:"Colombia",      away:"Portugal",       date:"2026-06-27",datetime:"2026-06-27T18:30:00-05:00",label:"Jun 27",md:3},
  {id:"k6",g:"K",home:"DR Congo",      away:"Uzbekistán",     date:"2026-06-27",datetime:"2026-06-27T18:30:00-05:00",label:"Jun 27",md:3},
  {id:"l5",g:"L",home:"Ghana",         away:"Inglaterra",     date:"2026-06-27",datetime:"2026-06-27T16:00:00-05:00",label:"Jun 27",md:3},
  {id:"l6",g:"L",home:"Croacia",       away:"Panamá",         date:"2026-06-27",datetime:"2026-06-27T16:00:00-05:00",label:"Jun 27",md:3},
];

// Knockout stages
// Round of 32 (m73 - m88)
MATCHES.push(
  {id:"m73",g:"R32",home:"Runner-up Group A",away:"Runner-up Group B",date:"2026-06-28",datetime:"2026-06-28T14:00:00-05:00",label:"Jun 28"},
  {id:"m74",g:"R32",home:"Winner Group E",away:"3rd place (A/B/C/D/F)",date:"2026-06-29",datetime:"2026-06-29T15:30:00-05:00",label:"Jun 29"},
  {id:"m75",g:"R32",home:"Winner Group F",away:"Runner-up Group C",date:"2026-06-29",datetime:"2026-06-29T22:00:00-05:00",label:"Jun 29"},
  {id:"m76",g:"R32",home:"Winner Group C",away:"Runner-up Group F",date:"2026-06-29",datetime:"2026-06-29T12:00:00-05:00",label:"Jun 29"},
  {id:"m77",g:"R32",home:"Winner Group I",away:"3rd place (C/D/F/G/H)",date:"2026-06-30",datetime:"2026-06-30T16:00:00-05:00",label:"Jun 30"},
  {id:"m78",g:"R32",home:"Runner-up Group E",away:"Runner-up Group I",date:"2026-06-30",datetime:"2026-06-30T12:00:00-05:00",label:"Jun 30"},
  {id:"m79",g:"R32",home:"Winner Group A",away:"3rd place (C/E/F/H/I)",date:"2026-06-30",datetime:"2026-06-30T22:00:00-05:00",label:"Jun 30"},
  {id:"m80",g:"R32",home:"Winner Group L",away:"3rd place (E/H/I/J/K)",date:"2026-07-01",datetime:"2026-07-01T11:00:00-05:00",label:"Jul 01"},
  {id:"m81",g:"R32",home:"Winner Group D",away:"3rd place (B/E/F/I/J)",date:"2026-07-01",datetime:"2026-07-01T19:00:00-05:00",label:"Jul 01"},
  {id:"m82",g:"R32",home:"Winner Group G",away:"3rd place (A/E/H/I/J)",date:"2026-07-01",datetime:"2026-07-01T15:00:00-05:00",label:"Jul 01"},
  {id:"m83",g:"R32",home:"Runner-up Group K",away:"Runner-up Group L",date:"2026-07-02",datetime:"2026-07-02T18:00:00-05:00",label:"Jul 02"},
  {id:"m84",g:"R32",home:"Winner Group H",away:"Runner-up Group J",date:"2026-07-02",datetime:"2026-07-02T14:00:00-05:00",label:"Jul 02"},
  {id:"m85",g:"R32",home:"Winner Group B",away:"3rd place (E/F/G/I/J)",date:"2026-07-02",datetime:"2026-07-02T22:00:00-05:00",label:"Jul 02"},
  {id:"m86",g:"R32",home:"Winner Group J",away:"Runner-up Group H",date:"2026-07-03",datetime:"2026-07-03T17:00:00-05:00",label:"Jul 03"},
  {id:"m87",g:"R32",home:"Winner Group K",away:"3rd place (D/E/I/J/L)",date:"2026-07-03",datetime:"2026-07-03T20:30:00-05:00",label:"Jul 03"},
  {id:"m88",g:"R32",home:"Runner-up Group D",away:"Runner-up Group G",date:"2026-07-03",datetime:"2026-07-03T13:00:00-05:00",label:"Jul 03"}
);

// Round of 16 (m89 - m96)
MATCHES.push(
  {id:"m89",g:"R16",home:"Winner of M74",away:"Winner of M77",date:"2026-07-04",datetime:"2026-07-04T16:00:00-05:00",label:"Jul 04"},
  {id:"m90",g:"R16",home:"Winner of M73",away:"Winner of M75",date:"2026-07-04",datetime:"2026-07-04T12:00:00-05:00",label:"Jul 04"},
  {id:"m91",g:"R16",home:"Winner of M76",away:"Winner of M78",date:"2026-07-05",datetime:"2026-07-05T15:00:00-05:00",label:"Jul 05"},
  {id:"m92",g:"R16",home:"Winner of M79",away:"Winner of M80",date:"2026-07-05",datetime:"2026-07-05T21:00:00-05:00",label:"Jul 05"},
  {id:"m93",g:"R16",home:"Winner of M83",away:"Winner of M84",date:"2026-07-06",datetime:"2026-07-06T14:00:00-05:00",label:"Jul 06"},
  {id:"m94",g:"R16",home:"Winner of M81",away:"Winner of M82",date:"2026-07-06",datetime:"2026-07-06T19:00:00-05:00",label:"Jul 06"},
  {id:"m95",g:"R16",home:"Winner of M86",away:"Winner of M88",date:"2026-07-07",datetime:"2026-07-07T11:00:00-05:00",label:"Jul 07"},
  {id:"m96",g:"R16",home:"Winner of M85",away:"Winner of M87",date:"2026-07-07",datetime:"2026-07-07T15:00:00-05:00",label:"Jul 07"}
);

// Quarter-finals (m97 - m100)
MATCHES.push(
  {id:"m97",g:"QF",home:"Winner of M89",away:"Winner of M90",date:"2026-07-09",datetime:"2026-07-09T15:00:00-05:00",label:"Jul 09"},
  {id:"m98",g:"QF",home:"Winner of M93",away:"Winner of M94",date:"2026-07-10",datetime:"2026-07-10T14:00:00-05:00",label:"Jul 10"},
  {id:"m99",g:"QF",home:"Winner of M91",away:"Winner of M92",date:"2026-07-11",datetime:"2026-07-11T16:00:00-05:00",label:"Jul 11"},
  {id:"m100",g:"QF",home:"Winner of M95",away:"Winner of M96",date:"2026-07-11",datetime:"2026-07-11T20:00:00-05:00",label:"Jul 11"}
);

// Semi-finals (m101 - m102)
MATCHES.push(
  {id:"m101",g:"SF",home:"Winner of M97",away:"Winner of M98",date:"2026-07-14",datetime:"2026-07-14T14:00:00-05:00",label:"Jul 14"},
  {id:"m102",g:"SF",home:"Winner of M99",away:"Winner of M100",date:"2026-07-15",datetime:"2026-07-15T14:00:00-05:00",label:"Jul 15"}
);

// Third-place (m103) and Final (m104)
MATCHES.push(
  {id:"m103",g:"3P",home:"Loser of M101",away:"Loser of M102",date:"2026-07-18",datetime:"2026-07-18T16:00:00-05:00",label:"Jul 18"},
  {id:"m104",g:"F",home:"Winner of M101",away:"Winner of M102",date:"2026-07-19",datetime:"2026-07-19T14:00:00-05:00",label:"Jul 19"}
);

const ALL_TEAMS=[...new Set(Object.values(GROUPS).flat())].sort();
const TOP_SCORERS=["K. Mbappé (FRA)","L. Messi (ARG)","E. Haaland (NOR)","H. Kane (ENG)","Vinicius Jr. (BRA)","J. Bellingham (ENG)","L. Martínez (MEX)","C. Ronaldo (POR)","M. Salah (EGY)","A. Dávila (MEX)","O. Giménez (MEX)","L. Werner (GER)","A. Mitoma (JPN)","V. Osimhen (NGA)"];
const MEXICO_ROUNDS=["Fase de Grupos","Ronda de 32","Octavos de Final","Cuartos de Final","Semifinal","Tercer Lugar","CAMPEÓN 🏆"];

function getTodayCT(){
  const d=new Date(new Date().toLocaleString("en-US",{timeZone:"America/Chicago"}));
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function getNowCT(){
  return new Date(new Date().toLocaleString("en-US",{timeZone:"America/Chicago"}));
}

function getMatchStart(match){
  // If a precise datetime is provided (ISO string), use it. Otherwise fall back to date-only at midnight CT.
  if(match.datetime){
    return new Date(match.datetime);
  }
  return new Date(new Date(match.date).toLocaleString("en-US",{timeZone:"America/Chicago"}));
}

function formatMatchStart(match){
  const d = getMatchStart(match);
  try{
    return d.toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'America/Chicago'}).replace(',', '');
  }catch{
    return d.toISOString();
  }
}

function calcScore(hp,ap,ha,aa){
  if(hp==null||ap==null||ha==null||aa==null) return null;
  const pw=hp>ap?"H":hp<ap?"A":"D",aw=ha>aa?"H":ha<aa?"A":"D";
  if(pw!==aw) return 0;
  if(hp===ha&&ap===aa) return 3;
  if(Math.abs(hp-ap)===Math.abs(ha-aa)) return 2;
  return 1;
}

const S={
  sel:{width:"100%",background:"#0d1117",border:"1.5px solid #30363d",borderRadius:8,color:"#e6edf3",fontSize:13,padding:"8px 10px",outline:"none",fontFamily:"inherit"},
  lbl:{fontSize:11,color:"#8b949e",fontWeight:600,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8},
};

function PtsBadge({pts}){
  if(pts==null) return null;
  const c={0:{bg:"#3d1515",co:"#f85149"},1:{bg:"#2d2000",co:"#d29922"},2:{bg:"#0d2137",co:"#388bfd"},3:{bg:"#0d2b1d",co:"#3fb950"}}[pts]||{bg:"#3d1515",co:"#f85149"};
  return <span style={{background:c.bg,color:c.co,fontWeight:800,fontSize:10,padding:"1px 6px",borderRadius:20,whiteSpace:"nowrap"}}>{pts===0?"0":`+${pts}`}</span>;
}

// Compact match row
function MatchRow({match,pred,actual,onSave}){
  const now=getNowCT();
  const locked=!!actual || getMatchStart(match) <= now;
  const [h,setH]=useState(pred?.home_goals??"");
  const [a,setA]=useState(pred?.away_goals??"");
  const [saved,setSaved]=useState(false);
  useEffect(()=>{setH(pred?.home_goals??"");setA(pred?.away_goals??"");},[pred]);
  const pts=calcScore(h!==""?+h:null,a!==""?+a:null,actual?.home_goals??null,actual?.away_goals??null);

  async function blur(){
    if(locked||h===""||a==="") return;
    await onSave(match.id,+h,+a);
    setSaved(true);setTimeout(()=>setSaved(false),1200);
  }

  return (
    <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderBottom:"1px solid #1a1f2e",background:locked&&!actual?"transparent":"transparent"}}>
      {/* Group badge */}
      <span style={{fontSize:9,color:"#484f58",fontWeight:700,width:16,textAlign:"center",flexShrink:0}}>{match.g}</span>
      <span style={{color:"#8b949e",fontSize:11,width:110,flexShrink:0,textAlign:"left"}}>{formatMatchStart(match)}</span>
      {/* Home team */}
      <span style={{flex:1,textAlign:"right",fontSize:12,fontWeight:600,color:locked?"#484f58":"#e6edf3",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{match.home}</span>
      {/* Score inputs */}
      <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
        {locked?(
          <>
            <span style={{width:22,height:26,background:"#0d1117",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:actual?"#e6edf3":"#2d333b"}}>{h!==""?h:"—"}</span>
            <span style={{color:"#484f58",fontSize:11}}>-</span>
            <span style={{width:22,height:26,background:"#0d1117",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:actual?"#e6edf3":"#2d333b"}}>{a!==""?a:"—"}</span>
          </>
        ):(
          <>
            <input type="number" min={0} max={20} value={h} placeholder="?" onChange={e=>setH(e.target.value)} onBlur={blur}
              style={{width:28,height:28,background:"#161b22",border:"1.5px solid #30363d",borderRadius:5,color:"#e6edf3",fontWeight:700,fontSize:14,textAlign:"center",outline:"none",padding:0,fontFamily:"inherit"}}/>
            <span style={{color:"#484f58",fontSize:11}}>-</span>
            <input type="number" min={0} max={20} value={a} placeholder="?" onChange={e=>setA(e.target.value)} onBlur={blur}
              style={{width:28,height:28,background:"#161b22",border:"1.5px solid #30363d",borderRadius:5,color:"#e6edf3",fontWeight:700,fontSize:14,textAlign:"center",outline:"none",padding:0,fontFamily:"inherit"}}/>
          </>
        )}
      </div>
      {/* Away team */}
      <span style={{flex:1,fontSize:12,fontWeight:600,color:locked?"#484f58":"#e6edf3",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{match.away}</span>
      {/* Points / status */}
      <div style={{width:30,textAlign:"right",flexShrink:0}}>
        {actual&&<PtsBadge pts={pts}/>}
        {saved&&<span style={{fontSize:9,color:"#3fb950"}}>✓</span>}
        {locked&&!actual&&<span style={{fontSize:9,color:"#2d333b"}}>🔒</span>}
      </div>
    </div>
  );
}

function LoginScreen({onLogin}){
  const [name,setName]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  async function join(){
    const t=name.trim();if(!t)return;setLoading(true);
    try{
      const {data,error}=await supabase.from("players").upsert({name:t},{onConflict:"name"}).select().single();
      if(error)throw error;
      localStorage.setItem("quiniela_player",JSON.stringify(data));
      onLogin(data);
    }catch{setError("Error al entrar. Intenta de nuevo.");}
    setLoading(false);
  }
  return(
    <div style={{minHeight:"100vh",background:"#0d1117",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:320,textAlign:"center",padding:24}}>
        <div style={{fontSize:48,marginBottom:8}}>⚽</div>
        <h1 style={{margin:"0 0 4px",fontSize:24,fontWeight:900,color:"#e6edf3"}}>Quiniela 2026</h1>
        <p style={{color:"#8b949e",fontSize:13,margin:"0 0 28px"}}>USA · Canada · Mexico</p>
        <input type="text" placeholder="Tu nombre o apodo..." value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&join()}
          style={{...S.sel,fontSize:15,padding:"11px 14px",marginBottom:10,textAlign:"center"}}/>
        {error&&<div style={{color:"#f85149",fontSize:12,marginBottom:8}}>{error}</div>}
        <button onClick={join} disabled={loading||!name.trim()} style={{width:"100%",background:"#1f6feb",border:"none",color:"white",padding:"11px",borderRadius:8,fontWeight:700,fontSize:15,cursor:"pointer",opacity:loading||!name.trim()?0.5:1}}>
          {loading?"Entrando...":"Entrar →"}
        </button>
        <p style={{color:"#484f58",fontSize:11,marginTop:16}}>La próxima vez entras automáticamente.</p>
      </div>
    </div>
  );
}

export default function App(){
  const [player,setPlayer]=useState(()=>{
    try{const s=localStorage.getItem("quiniela_player");return s?JSON.parse(s):null;}catch{return null;}
  });
  const [tab,setTab]=useState("matches");
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

  useEffect(()=>{
    if(!player)return;
    loadAll();
    const iv=setInterval(loadLeaderboard,30000);
    return()=>clearInterval(iv);
  },[player]);

  async function loadAll(){setLoading(true);await Promise.all([loadPredictions(),loadActuals(),loadExtras(),loadLeaderboard()]);setLoading(false);}

  async function loadPredictions(){
    const{data}=await supabase.from("predictions").select("*").eq("player_id",player.id);
    if(data){const m={};data.forEach(r=>{m[r.match_id]=r;});setPredictions(m);}
  }

  async function loadActuals(){
    const{data}=await supabase.from("results").select("*");
    const m={...KNOWN_RESULTS};
    if(data)data.forEach(r=>{m[r.match_id]={home_goals:r.home_goals,away_goals:r.away_goals};});
    setActuals(m);
  }

  async function loadExtras(){
    const{data}=await supabase.from("extras").select("*").eq("player_id",player.id).maybeSingle();
    if(data)setExtras(data);
  }

  async function loadLeaderboard(){
    const[{data:players},{data:preds},{data:results}]=await Promise.all([
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
      return{name:p.name,pts,exact,total:myP.length};
    }).sort((a,b)=>b.pts-a.pts||b.exact-a.exact);
    setLeaderboard(board);
  }

  const syncResults=useCallback(async()=>{
    if(!ANTHROPIC_KEY){alert("Falta VITE_ANTHROPIC_KEY en Netlify");return;}
    setSyncing(true);
    try{
      const now=getNowCT();
      const today=getTodayCT();
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",max_tokens:2000,
          system:`FIFA World Cup 2026 results tracker. Today is ${today}. Return ONLY valid JSON, no markdown.`,
          messages:[{role:"user",content:`Return final scores for finished 2026 World Cup matches as of ${today}.
Matches: ${MATCHES.filter(m=>getMatchStart(m)<=now).map(m=>`${m.id}:${m.home} vs ${m.away}(${m.label})`).join(",")}
JSON format: {"results":[{"id":"k1","home_goals":2,"away_goals":0}]}
Only include confirmed final scores.`}]
        })
      });
      const data=await res.json();
      const text=data.content?.find(b=>b.type==="text")?.text||"{}";
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      if(parsed.results?.length){
        for(const r of parsed.results){
          if(r.home_goals==null||r.away_goals==null)continue;
          await supabase.from("results").upsert({match_id:r.id,home_goals:r.home_goals,away_goals:r.away_goals},{onConflict:"match_id"});
        }
        await loadActuals();await loadLeaderboard();
        setLastSync(new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}));
      }
    }catch(e){console.error(e);}
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

  if(!player)return<LoginScreen onLogin={setPlayer}/>;

  const today=getTodayCT();
  const now=getNowCT();
  const myPts=Object.entries(predictions).reduce((sum,[mid,pred])=>{
    const a=actuals[mid];if(!a)return sum;
    return sum+(calcScore(pred.home_goals,pred.away_goals,a.home_goals,a.away_goals)||0);
  },0);
  const myRank=leaderboard.findIndex(p=>p.name===player.name)+1;

  // Refs for scrolling to current day
  const dateRefs = useRef({});
  const compareRefs = useRef({});

  // Scroll helper: try today, then next date, else last
  function scrollToDateMap(refMap, keys){
    if(!keys||keys.length===0) return;
    const target = keys.find(d=>d===today) || keys.find(d=>d>today) || keys[keys.length-1];
    const el = refMap.current && refMap.current[target];
    if(el && typeof el.scrollIntoView === 'function') setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),50);
  }

  // Group matches by date and sort by datetime
  const matchesByDate={};
  MATCHES.forEach(m=>{
    if(!matchesByDate[m.date])matchesByDate[m.date]=[];
    matchesByDate[m.date].push(m);
  });
  // Sort matches within each date by their datetime
  Object.keys(matchesByDate).forEach(d=>{
    matchesByDate[d].sort((a,b)=>getMatchStart(a) - getMatchStart(b));
  });
  // Sort dates by the first match datetime for each date
  const dates=Object.keys(matchesByDate).sort((a,b)=>getMatchStart(matchesByDate[a][0]) - getMatchStart(matchesByDate[b][0]));
  const finishedMatchesSorted=[...MATCHES]
    .filter(m=>actuals[m.id])
    .sort((a,b)=>getMatchStart(a) - getMatchStart(b));

  // When tab changes or dates update, scroll to current day for matches/compare
  // (moved below so `dates` and `finishedMatchesSorted` are defined)
  useEffect(()=>{
    if(tab==="matches") scrollToDateMap(dateRefs, dates);
    if(tab==="compare"){
      const compareDates = Object.keys(compareRefs.current).sort();
      scrollToDateMap(compareRefs, compareDates);
    }
  },[tab,dates,finishedMatchesSorted]);

  const tabs=[
    {id:"matches",label:"⚽ Partidos"},
    {id:"extras",label:"⭐ Extras"},
    {id:"table",label:"🏆 Tabla"},
    {id:"compare",label:"👥 Comparar"},
    ...(isAdmin?[{id:"admin",label:"⚙️ Admin"}]:[]),
  ];

  return(
    <div style={{background:"#0d1117",height:"100vh",display:"flex",flexDirection:"column",fontFamily:"'Inter',-apple-system,sans-serif",color:"#e6edf3",maxWidth:640,margin:"0 auto"}}>
      {/* Header */}
      <div style={{background:"#161b22",borderBottom:"1px solid #21262d",padding:"12px 16px 10px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:10,color:"#388bfd",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Quiniela 2026</div>
            <div style={{fontWeight:800,fontSize:18}}>{player.name} 👋</div>
            <button onClick={()=>{localStorage.removeItem("quiniela_player");setPlayer(null);}} style={{background:"none",border:"none",color:"#484f58",fontSize:9,cursor:"pointer",padding:0}}>cambiar nombre</button>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:900,color:"#3fb950",lineHeight:1}}>{myPts}</div>
            <div style={{fontSize:10,color:"#8b949e"}}>pts{myRank>0?` · #${myRank}`:""}</div>
            <button onClick={syncResults} disabled={syncing} style={{marginTop:4,background:syncing?"#21262d":"#1f6feb",border:"none",color:"white",fontSize:9,padding:"3px 8px",borderRadius:4,cursor:syncing?"not-allowed":"pointer",fontWeight:600,opacity:syncing?0.6:1}}>
              {syncing?"⟳...":"⟳ Sync"}
            </button>
          </div>
        </div>
        {lastSync&&<div style={{fontSize:9,color:"#484f58",marginTop:2}}>Última sync: {lastSync}</div>}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #21262d",background:"#161b22"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 2px",background:"none",border:"none",borderBottom:tab===t.id?"2px solid #388bfd":"2px solid transparent",color:tab===t.id?"#388bfd":"#8b949e",fontWeight:600,fontSize:10,cursor:"pointer"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Mini legend (kept visible with header when on matches tab) */}
      {tab==="matches"&&(
        <div style={{display:"flex",gap:8,margin:"8px 12px",flexWrap:"wrap",fontSize:10,color:"#8b949e"}}>
          <span>Puntos:</span>
          {[0,1,2,3].map(p=>{
            const c={0:{bg:"#3d1515",co:"#f85149"},1:{bg:"#2d2000",co:"#d29922"},2:{bg:"#0d2137",co:"#388bfd"},3:{bg:"#0d2b1d",co:"#3fb950"}}[p];
            const l={0:"Incorrecto",1:"Ganador",2:"+diferencia",3:"Exacto"}[p];
            return<span key={p} style={{display:"flex",alignItems:"center",gap:3}}><span style={{background:c.bg,color:c.co,fontWeight:800,fontSize:9,padding:"1px 5px",borderRadius:10}}>{p===0?"0":`+${p}`}</span>{l}</span>;
          })}
        </div>
      )}

      <div style={{flex:1,overflowY:"auto",padding:"12px 12px 80px"}}>

        {/* ── PARTIDOS ── */}
        {tab==="matches"&&(
          <div>
            {loading?(
              <div style={{textAlign:"center",color:"#8b949e",padding:40}}>Cargando...</div>
            ):dates.map(date=>{
              const dayMatches=matchesByDate[date];
              const dayLabel=dayMatches[0].label;
              const isToday=date===today;
              const isPast=date<today;
              return(
                <div key={date} ref={el=>dateRefs.current[date]=el} style={{marginBottom:12}}>
                  {/* Date header */}
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,padding:"0 2px"}}>
                    <span style={{fontSize:11,fontWeight:700,color:isToday?"#3fb950":isPast?"#484f58":"#e6edf3"}}>{dayLabel}{isToday?" · Hoy":""}</span>
                    <div style={{flex:1,height:1,background:"#21262d"}}/>
                    <span style={{fontSize:9,color:"#484f58"}}>{dayMatches.length} partidos</span>
                  </div>
                  {/* Matches block */}
                  <div style={{background:"#161b22",borderRadius:8,border:"1px solid #21262d",overflow:"hidden"}}>
                    {dayMatches.map((m,i)=>(
                      <MatchRow key={m.id} match={m} pred={predictions[m.id]} actual={actuals[m.id]} onSave={savePrediction}/>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── EXTRAS ── */}
        {tab==="extras"&&(
          <div>
            <div style={{background:"#161b22",border:"1px solid #3d2b00",borderRadius:8,padding:"10px 12px",marginBottom:14,fontSize:11,color:"#8b949e"}}>
              ⭐ Pronósticos de torneo — cambia antes del Jun 28.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {key:"champion",label:"🏆 Campeón del mundo",options:ALL_TEAMS},
                {key:"top_scorer",label:"👟 Campeón de goleo",options:TOP_SCORERS},
                {key:"mexico_round",label:"🇲🇽 ¿Hasta dónde llega México?",options:MEXICO_ROUNDS},
              ].map(({key,label,options})=>(
                <div key={key}>
                  <label style={S.lbl}>{label}</label>
                  <select style={S.sel} value={extras[key]||""} onChange={e=>saveExtras({...extras,[key]:e.target.value})}>
                    <option value="">Selecciona...</option>
                    {options.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={S.lbl}>Ganador de cada grupo</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:4}}>
                  {Object.entries(GROUPS).map(([letter,teams])=>(
                    <div key={letter} style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{color:"#8b949e",fontSize:10,fontWeight:700,width:20}}>G-{letter}</span>
                      <select style={{...S.sel,fontSize:11,padding:"5px 7px"}} value={(extras.group_winners||{})[letter]||""} onChange={e=>saveExtras({...extras,group_winners:{...(extras.group_winners||{}),[letter]:e.target.value}})}>
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

        {/* ── TABLA ── */}
        {tab==="table"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:10,color:"#8b949e",textTransform:"uppercase",letterSpacing:1}}>{leaderboard.length} participantes</span>
              <button onClick={loadLeaderboard} style={{background:"#161b22",border:"1px solid #30363d",color:"#8b949e",fontSize:10,padding:"3px 8px",borderRadius:5,cursor:"pointer"}}>↻</button>
            </div>
            {leaderboard.map((p,i)=>(
              <div key={p.name} style={{display:"flex",alignItems:"center",gap:10,background:p.name===player.name?"#0d2137":"#161b22",border:`1px solid ${i===0?"#2d7d32":p.name===player.name?"#1c3d5c":"#21262d"}`,borderRadius:8,padding:"10px 12px",marginBottom:6}}>
                <span style={{fontSize:16,width:24,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13}}>{p.name}{p.name===player.name?" (tú)":""}</div>
                  <div style={{fontSize:10,color:"#8b949e"}}>{p.total} pronósticos · {p.exact} exactos</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:900,fontSize:20,color:i===0?"#3fb950":"#e6edf3"}}>{p.pts}</div>
                  <div style={{fontSize:9,color:"#8b949e"}}>pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── COMPARAR ── */}
        {tab==="compare"&&(
          <div>
            <div style={{fontSize:10,color:"#8b949e",marginBottom:12}}>
              Pronósticos por partido — solo partidos terminados. Tu nombre en azul.
            </div>
            {finishedMatchesSorted.map((m,i)=>{
              const actual=actuals[m.id];
              const playerPreds=allPlayers.map(p=>{
                const pred=allPredictions.find(pr=>pr.player_id===p.id&&pr.match_id===m.id);
                const pts=pred?calcScore(pred.home_goals,pred.away_goals,actual.home_goals,actual.away_goals):null;
                return{name:p.name,pred,pts};
              }).filter(pp=>pp.pred);
              if(playerPreds.length===0)return null;
              return(
                <div key={m.id} ref={el=>{ if(i===0||finishedMatchesSorted[i-1].date!==m.date) compareRefs.current[m.date]=el }} style={{background:"#161b22",borderRadius:8,padding:"10px 12px",marginBottom:8,border:"1px solid #21262d"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:9,color:"#8b949e"}}>Grupo {m.g} · {m.label}</span>
                    <span style={{fontSize:10,color:"#3fb950",fontWeight:700}}>{actual.home_goals}–{actual.away_goals}</span>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:"#e6edf3",marginBottom:8,textAlign:"center"}}>{m.home} vs {m.away}</div>
                  {playerPreds.map(pp=>(
                    <div key={pp.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                      <span style={{fontSize:11,color:pp.name===player.name?"#388bfd":"#8b949e",fontWeight:pp.name===player.name?700:400,width:72,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pp.name}</span>
                      <span style={{fontSize:12,fontWeight:700,flex:1}}>{pp.pred.home_goals} – {pp.pred.away_goals}</span>
                      <PtsBadge pts={pp.pts}/>
                    </div>
                  ))}
                </div>
              );
            })}
            {finishedMatchesSorted.length===0&&(
              <div style={{textAlign:"center",color:"#8b949e",padding:40,fontSize:13}}>Aquí aparecen los pronósticos cuando terminen los partidos.</div>
            )}
          </div>
        )}

        {/* ── ADMIN ── */}
        {tab==="admin"&&isAdmin&&(
          <div>
            <div style={{color:"#f85149",fontSize:11,marginBottom:12,background:"#2d1515",borderRadius:8,padding:"10px 12px"}}>
              ⚠️ Panel admin — ingresa resultados finales.
            </div>
            <button onClick={syncResults} disabled={syncing} style={{width:"100%",background:"#1f6feb",border:"none",color:"white",padding:"10px",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",marginBottom:12,opacity:syncing?0.6:1}}>
              {syncing?"🤖 Sincronizando...":"🤖 Sync automático con IA"}
            </button>
            <div style={{fontSize:10,color:"#484f58",marginBottom:10,textAlign:"center"}}>— o ingresa manualmente —</div>
            {MATCHES.filter(m=>getMatchStart(m)<=now).map(m=>{
              const a=actuals[m.id]||{};
              return(
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:6,borderBottom:"1px solid #21262d",padding:"7px 0"}}>
                  <span style={{color:"#484f58",fontSize:9,width:16}}>{m.g}</span>
                  <span style={{color:"#8b949e",fontSize:11,width:110,flexShrink:0,textAlign:"left"}}>{formatMatchStart(m)}</span>
                  <span style={{flex:1,color:"#e6edf3",fontSize:10}}>{m.home} vs {m.away}</span>
                  <span style={{color:"#484f58",fontSize:9,width:32}}>{m.label}</span>
                  <input type="number" min={0} max={20} placeholder="—" key={`h_${m.id}_${a.home_goals}`} defaultValue={a.home_goals??""}
                    style={{width:30,height:26,background:"#0d1117",border:"1px solid #30363d",borderRadius:4,color:"#e6edf3",fontWeight:700,fontSize:12,textAlign:"center",outline:"none",padding:0}}
                    onBlur={async e=>{const hg=e.target.value===""?null:+e.target.value;const ag=actuals[m.id]?.away_goals??null;if(hg!==null&&ag!==null){await supabase.from("results").upsert({match_id:m.id,home_goals:hg,away_goals:ag},{onConflict:"match_id"});await loadActuals();await loadLeaderboard();}}}/>
                  <span style={{color:"#484f58",fontSize:10}}>-</span>
                  <input type="number" min={0} max={20} placeholder="—" key={`a_${m.id}_${a.away_goals}`} defaultValue={a.away_goals??""}
                    style={{width:30,height:26,background:"#0d1117",border:"1px solid #30363d",borderRadius:4,color:"#e6edf3",fontWeight:700,fontSize:12,textAlign:"center",outline:"none",padding:0}}
                    onBlur={async e=>{const ag=e.target.value===""?null:+e.target.value;const hg=actuals[m.id]?.home_goals??null;if(hg!==null&&ag!==null){await supabase.from("results").upsert({match_id:m.id,home_goals:hg,away_goals:ag},{onConflict:"match_id"});await loadActuals();await loadLeaderboard();}}}/>
                  {actuals[m.id]&&<span style={{color:"#3fb950",fontSize:9}}>✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin unlock */}
      {!isAdmin&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#161b22",borderTop:"1px solid #21262d",padding:"6px 12px",display:"flex",gap:6,maxWidth:640,margin:"0 auto"}}>
          <input type="password" placeholder="Contraseña admin..." value={adminInput} onChange={e=>setAdminInput(e.target.value)}
            style={{...S.sel,flex:1,padding:"5px 8px",fontSize:11}}/>
          <button onClick={()=>{if(adminInput===ADMIN_PASSWORD){setIsAdmin(true);setTab("admin");}setAdminInput("");}}
            style={{background:"#21262d",border:"1px solid #30363d",color:"#8b949e",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:11}}>
            Admin
          </button>
        </div>
      )}
    </div>
  );
}
