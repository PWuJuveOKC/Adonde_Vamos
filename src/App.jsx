import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  sun: "#FFB800", sky: "#3B82F6", grass: "#22C55E",
  coral: "#FF6B6B", cream: "#FFF8ED", bark: "#7C4A1E",
  cloud: "#E0F2FE", night: "#0F172A",
};

const AGE_GROUPS = [
  { id: "baby",    label: "👶 Baby",    range: "0–2 yrs" },
  { id: "toddler", label: "🧸 Toddler", range: "3–5 yrs" },
  { id: "child",   label: "🎒 Child",   range: "6–11 yrs" },
  { id: "tween",   label: "🎧 Tween",   range: "12–15 yrs" },
];

const PRESET_CITIES = [
  { name: "Portland, OR",     emoji: "🌲", lat: 45.523, lng: -122.676 },
  { name: "New York, NY",     emoji: "🗽", lat: 40.713, lng: -74.006  },
  { name: "Austin, TX",       emoji: "🤠", lat: 30.267, lng: -97.743  },
  { name: "Chicago, IL",      emoji: "🏙️", lat: 41.878, lng: -87.630  },
  { name: "Denver, CO",       emoji: "⛰️", lat: 39.739, lng: -104.990 },
  { name: "Miami, FL",        emoji: "🌴", lat: 25.774, lng: -80.195  },
  { name: "Seattle, WA",      emoji: "☕", lat: 47.606, lng: -122.332 },
  { name: "San Francisco, CA",emoji: "🌉", lat: 37.775, lng: -122.419 },
];

const ACTIVITY_BANK = {
  outdoor: [
    { id:"hike",    name:"Nature Hike",        emoji:"🥾", color:"#22C55E", tags:["child","tween"],                  duration:"2–4 hrs",  desc:"Explore local trails and spot wildlife",           checklist:["Water bottles (1L/person)","Trail mix & snacks","Sunscreen SPF 50+","Bug spray","Sturdy shoes","First aid kit","Trail map or GPS","Extra layer / jacket"] },
    { id:"park",    name:"Playground Park",    emoji:"🛝", color:"#FFB800", tags:["baby","toddler","child"],          duration:"1–3 hrs",  desc:"Swings, slides, and open play areas",              checklist:["Snacks & juice boxes","Sunscreen","Change of clothes","Hand sanitizer","Blanket to sit on","Ball or frisbee"] },
    { id:"beach",   name:"Beach Day",          emoji:"🏖️", color:"#3B82F6", tags:["toddler","child","tween"],         duration:"3–6 hrs",  desc:"Sun, sand, and splashing waves",                   checklist:["Towels for everyone","Sunscreen SPF 50+","Sun hats","Swimwear & rash guard","Sand toys","Cooler with drinks","Dry bag for valuables","After-sun lotion"] },
    { id:"bike",    name:"Bike Ride",          emoji:"🚲", color:"#FF6B6B", tags:["child","tween"],                  duration:"1–3 hrs",  desc:"Cruise greenways and scenic paths",                 checklist:["Helmets (required!)","Water bottles","Bike pump & repair kit","Snacks","Sunscreen","Phone mount for navigation"] },
    { id:"camping", name:"Weekend Camping",    emoji:"⛺", color:"#7C4A1E", tags:["child","tween"],                  duration:"1–2 days", desc:"Sleep under the stars and bond around the fire",    checklist:["Tent & sleeping bags","Camp stove & fuel","Food & cooler","Flashlights & batteries","Insect repellent","Rain gear","Firewood","S'mores supplies! 🍫"] },
    { id:"picnic",  name:"Picnic in the Park", emoji:"🧺", color:"#84cc16", tags:["baby","toddler","child","tween"],  duration:"2–3 hrs",  desc:"A relaxed outdoor meal with the whole family",      checklist:["Picnic blanket","Homemade sandwiches","Fresh fruit","Frisbee or ball","Sunscreen","Insect repellent","Reusable water bottles"] },
    { id:"garden",  name:"Botanical Garden",   emoji:"🌸", color:"#ec4899", tags:["baby","toddler","child","tween"],  duration:"2–3 hrs",  desc:"Wander through beautiful plants and flowers",       checklist:["Comfortable walking shoes","Water","Sunscreen","Camera","Snacks","Stroller if needed"] },
    { id:"sports",  name:"Family Sports Day",  emoji:"⚽", color:"#f59e0b", tags:["child","tween"],                  duration:"2–4 hrs",  desc:"Kick a ball, play tag, and burn off energy",        checklist:["Sports shoes","Water bottles","Sunscreen","Snacks","Ball or frisbee","First aid kit"] },
  ],
  indoor: [
    { id:"museum",  name:"Children's Museum",  emoji:"🏛️", color:"#8B5CF6", tags:["toddler","child"],                duration:"2–4 hrs",  desc:"Interactive exhibits for curious minds",            checklist:["Book tickets in advance","Snacks for breaks","Comfortable shoes","Camera","Stroller if needed","Patience & curiosity 😄"] },
    { id:"cooking", name:"Family Cooking Class",emoji:"👨‍🍳",color:"#F97316", tags:["child","tween"],                 duration:"2–3 hrs",  desc:"Cook and eat together — a delicious adventure",     checklist:["Register ahead of time","Aprons","Containers for leftovers","Allergy info for instructor","Cash for tips"] },
    { id:"escape",  name:"Escape Room",        emoji:"🔐", color:"#EC4899", tags:["tween"],                          duration:"1–2 hrs",  desc:"Solve puzzles and outsmart the clock",              checklist:["Book in advance","Arrive 15 min early","Leave phones in locker","Team strategy ready","Celebrate with food after!"] },
    { id:"library", name:"Library Story Time", emoji:"📚", color:"#06B6D4", tags:["baby","toddler","child"],          duration:"1–2 hrs",  desc:"Tales, songs, and crafts for little ones",          checklist:["Check event schedule","Library card","Quiet snacks","Spare diaper if needed","Favorite stuffed animal"] },
    { id:"science", name:"Science Center",     emoji:"🔬", color:"#22C55E", tags:["child","tween"],                  duration:"3–5 hrs",  desc:"Hands-on experiments and mind-bending displays",    checklist:["Pre-book timed entry","Budget for gift shop 😂","Comfortable walking shoes","Notebook for notes","Bring lots of questions!"] },
    { id:"bowling", name:"Bowling Alley",      emoji:"🎳", color:"#6366f1", tags:["child","tween"],                  duration:"2–3 hrs",  desc:"Strikes, spares, and silly celebrations",           checklist:["Book a lane in advance","Bowling shoes (or bring socks)","Snacks budget","Extra cash for arcade"] },
    { id:"aquarium",name:"Aquarium Visit",     emoji:"🐠", color:"#0ea5e9", tags:["toddler","child","tween"],         duration:"2–4 hrs",  desc:"Dive into an underwater world together",            checklist:["Book tickets online","Comfortable shoes","Snacks","Camera or phone charged","Ask about feeding schedules"] },
    { id:"cinema",  name:"Family Movie Day",   emoji:"🎬", color:"#a855f7", tags:["toddler","child","tween"],         duration:"2–3 hrs",  desc:"Popcorn, big screens, and shared laughs",           checklist:["Check showtimes","Snack budget","Arrive early for seats","Cozy layers (cold inside!)","Agree on the movie first 😅"] },
  ],
};

const WEEKEND_EVENT_TEMPLATES = [
  { name:"Farmers Market",           emoji:"🌽", timeSlot:"Sat 8am–1pm"       },
  { name:"Outdoor Movie Night",      emoji:"🎬", timeSlot:"Sat 8pm"           },
  { name:"Kids Art Workshop",        emoji:"🎨", timeSlot:"Sun 10am–12pm"     },
  { name:"Mini Golf Tournament",     emoji:"⛳", timeSlot:"Sat & Sun 12–5pm"  },
  { name:"Story Walk in the Park",   emoji:"📖", timeSlot:"Sun 9–11am"        },
  { name:"Science Fair",             emoji:"🧪", timeSlot:"Sat 11am–3pm"      },
  { name:"Face Painting & Games",    emoji:"🎭", timeSlot:"Sun 1–4pm"         },
  { name:"Kite Flying Festival",     emoji:"🪁", timeSlot:"Sat 2–5pm"         },
  { name:"Junior Chef Competition",  emoji:"🍳", timeSlot:"Sat 10am–1pm"      },
  { name:"Petting Zoo",              emoji:"🐑", timeSlot:"Sat & Sun 10am–4pm"},
  { name:"Magic Show for Kids",      emoji:"🪄", timeSlot:"Sun 2–3pm"         },
  { name:"Nature Photography Walk",  emoji:"📷", timeSlot:"Sat 7–9am"         },
];

const CITY_VENUES = {
  "Portland":      ["Tom McCall Waterfront","Washington Park","Powell Butte","Laurelhurst Park","Mississippi Ave"],
  "New York":      ["Central Park","Bryant Park","The High Line","Brooklyn Botanic Garden","Prospect Park"],
  "Austin":        ["Zilker Park","Barton Springs","South Congress Ave","Barton Creek Greenbelt","Pease Park"],
  "Chicago":       ["Millennium Park","Navy Pier","Lincoln Park","Grant Park","Maggie Daley Park"],
  "Denver":        ["City Park","Washington Park","Red Rocks Amphitheatre","Cheesman Park","Sloan's Lake"],
  "Miami":         ["Bayfront Park","South Pointe Park","Brickell City Centre","Coconut Grove","Wynwood"],
  "Seattle":       ["Gas Works Park","Pike Place Market","Volunteer Park","Green Lake Park","Alki Beach"],
  "San Francisco": ["Golden Gate Park","Dolores Park","Embarcadero","Crissy Field","Yerba Buena Gardens"],
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getEventForCity(city) {
  const tpl = WEEKEND_EVENT_TEMPLATES[Math.floor(Math.random() * WEEKEND_EVENT_TEMPLATES.length)];
  const cityFirst = city.split(",")[0];
  const venueList = CITY_VENUES[cityFirst] || ["Town Square","City Park","Community Center","Riverside"];
  const where = venueList[Math.floor(Math.random() * venueList.length)];
  return { ...tpl, where, city };
}

// ── Map ───────────────────────────────────────────────────────────────────────

function MapView({ filter, cityName }) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  const PLACE_TYPES = [
    { suffix:"Nature Trail",      type:"trail",  emoji:"🥾", dx:0.38, dy:0.28 },
    { suffix:"Playground",        type:"park",   emoji:"🛝", dx:0.62, dy:0.45 },
    { suffix:"City Park",         type:"park",   emoji:"🌿", dx:0.20, dy:0.55 },
    { suffix:"Children's Museum", type:"museum", emoji:"🏛️", dx:0.55, dy:0.25 },
    { suffix:"Science Center",    type:"museum", emoji:"🔬", dx:0.75, dy:0.58 },
    { suffix:"Botanical Garden",  type:"park",   emoji:"🌸", dx:0.30, dy:0.72 },
  ];

  const places = PLACE_TYPES.filter(p =>
    filter === "all" ||
    (filter === "outdoor" && ["trail","park"].includes(p.type)) ||
    (filter === "indoor"  && p.type === "museum")
  ).map(p => ({ ...p, name: `${cityName.split(",")[0]} ${p.suffix}` }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = "#d4e9c2"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 6;
    [[0,H*0.37,W,H*0.37],[0,H*0.65,W,H*0.65],[W*0.27,0,W*0.27,H],[W*0.60,0,W*0.60,H]].forEach(([x1,y1,x2,y2])=>{
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    });
    ctx.fillStyle="#93c5fd"; ctx.beginPath();
    ctx.ellipse(W*0.09,H*0.5,46,26,0.3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#aabbaa"; ctx.font="9px monospace";
    ctx.fillText(`~${cityName} (simulated)`, 8, H-8);

    places.forEach((place, i) => {
      const x = place.dx * W, y = place.dy * H;
      const isHov = hovered === i, r = isHov ? 23 : 18;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle = isHov ? "#FF6B6B" : "white";
      ctx.shadowColor="rgba(0,0,0,0.2)"; ctx.shadowBlur=8; ctx.fill(); ctx.shadowBlur=0;
      ctx.strokeStyle = isHov ? "#FF6B6B" : "#3B82F6"; ctx.lineWidth=2.5; ctx.stroke();
      ctx.font=`${isHov?16:13}px serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(place.emoji, x, y);
      if (isHov) {
        ctx.fillStyle="#0F172A"; ctx.font="bold 11px sans-serif";
        ctx.fillText(place.name, x, y-32);
      }
    });
  }, [hovered, places, cityName]);

  const handleMouseMove = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const sx = canvasRef.current.width  / rect.width;
    const sy = canvasRef.current.height / rect.height;
    const mx = (e.clientX - rect.left) * sx;
    const my = (e.clientY - rect.top)  * sy;
    const W = canvasRef.current.width, H = canvasRef.current.height;
    let found = -1;
    places.forEach((p,i) => { if (Math.hypot(mx - p.dx*W, my - p.dy*H) < 23) found = i; });
    setHovered(found >= 0 ? found : null);
  };

  return (
    <div style={{ position:"relative", borderRadius:20, overflow:"hidden", boxShadow:"0 6px 28px rgba(0,0,0,0.12)" }}>
      <canvas ref={canvasRef} width={560} height={250}
        onMouseMove={handleMouseMove} onMouseLeave={() => setHovered(null)}
        style={{ display:"block", width:"100%", cursor: hovered!=null?"pointer":"default" }} />
      {hovered !== null && (
        <div style={{ position:"absolute", bottom:10, left:10, background:"#fff", padding:"6px 12px",
          borderRadius:12, fontSize:12, fontWeight:600, boxShadow:"0 3px 12px rgba(0,0,0,0.12)",
          color:"#0F172A", display:"flex", alignItems:"center", gap:6 }}>
          {places[hovered].emoji} {places[hovered].name}
          <span style={{ background:"#E0F2FE",color:"#3B82F6",padding:"2px 7px",borderRadius:20,fontSize:10,marginLeft:4 }}>
            {places[hovered].type}
          </span>
        </div>
      )}
      <div style={{ position:"absolute",top:8,right:8,background:"rgba(255,255,255,0.88)",
        borderRadius:10,padding:"4px 9px",fontSize:10,color:"#666" }}>🗺️ Hover pins</div>
    </div>
  );
}

// ── Checklist ─────────────────────────────────────────────────────────────────

function Checklist({ items }) {
  const [checked, setChecked] = useState({});
  const toggle = i => setChecked(p => ({ ...p, [i]: !p[i] }));
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <h3 style={{ margin:0,fontSize:16,fontWeight:700,color:"#0F172A" }}>🎒 Pack List</h3>
        <span style={{ background:done===items.length?"#dcfce7":"#FFF8ED",
          color:done===items.length?"#16a34a":"#d97706",
          padding:"3px 12px",borderRadius:20,fontSize:12,fontWeight:600 }}>{done}/{items.length} packed</span>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {items.map((item,i) => (
          <div key={i} onClick={() => toggle(i)} style={{ display:"flex",alignItems:"center",gap:10,
            padding:"10px 14px",borderRadius:12,cursor:"pointer",
            background:checked[i]?"#dcfce7":"#f8fafc",
            border:`1.5px solid ${checked[i]?"#86efac":"#e2e8f0"}`,transition:"all 0.18s" }}>
            <div style={{ width:20,height:20,borderRadius:6,border:`2px solid ${checked[i]?"#22C55E":"#cbd5e1"}`,
              background:checked[i]?"#22C55E":"white",display:"flex",alignItems:"center",
              justifyContent:"center",flexShrink:0,transition:"all 0.18s" }}>
              {checked[i] && <span style={{ color:"white",fontSize:12 }}>✓</span>}
            </div>
            <span style={{ fontSize:14,color:checked[i]?"#64748b":"#1e293b",
              textDecoration:checked[i]?"line-through":"none" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Location Picker ───────────────────────────────────────────────────────────

function LocationPicker({ current, onSelect, onClose }) {
  const [custom, setCustom] = useState("");
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(15,23,42,0.65)",zIndex:200,
      display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:"white",borderRadius:"26px 26px 0 0",
        padding:"26px 22px 44px",width:"100%",maxWidth:560,boxShadow:"0 -10px 50px rgba(0,0,0,0.2)" }}>
        <div style={{ width:40,height:4,background:"#e2e8f0",borderRadius:2,margin:"0 auto 20px" }} />
        <h3 style={{ margin:"0 0 16px",fontSize:17,fontWeight:800,color:"#0F172A" }}>📍 Change Location</h3>

        <div style={{ display:"flex",gap:10,marginBottom:18 }}>
          <input value={custom} onChange={e => setCustom(e.target.value)}
            onKeyDown={e => { if (e.key==="Enter" && custom.trim()) { onSelect(custom.trim()); onClose(); }}}
            placeholder="Type any city, e.g. Boston, MA…"
            style={{ flex:1,padding:"12px 15px",borderRadius:13,border:"1.5px solid #e2e8f0",
              fontSize:14,outline:"none",fontFamily:"Georgia, serif" }} />
          <button onClick={() => { if (custom.trim()) { onSelect(custom.trim()); onClose(); }}}
            style={{ padding:"12px 18px",borderRadius:13,background:COLORS.sky,color:"white",
              border:"none",fontWeight:700,cursor:"pointer",fontSize:14 }}>Go</button>
        </div>

        <p style={{ margin:"0 0 10px",fontSize:12,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:1 }}>
          Popular cities
        </p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:9 }}>
          {PRESET_CITIES.map(city => (
            <button key={city.name} onClick={() => { onSelect(city.name); onClose(); }}
              style={{ padding:"11px 13px",borderRadius:13,textAlign:"left",cursor:"pointer",
                background:current===city.name?COLORS.cloud:"#f8fafc",
                border:`2px solid ${current===city.name?COLORS.sky:"#e2e8f0"}`,transition:"all 0.15s",
                display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontSize:18 }}>{city.emoji}</span>
              <span style={{ fontSize:12,fontWeight:600,color:"#1e293b" }}>{city.name}</span>
              {current===city.name && <span style={{ marginLeft:"auto",fontSize:12,color:COLORS.sky }}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AI Hook ───────────────────────────────────────────────────────────────────

function useAIRecommendations() {
  const [recs,    setRecs]    = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecs = useCallback(async ({ city, ages, environment }) => {
    setLoading(true); setRecs(null);
    const ageLabels = ages.map(a => AGE_GROUPS.find(g => g.id===a)?.label.replace(/[^\w\s]/g,"").trim()).join(", ") || "mixed ages";
    const envLabel  = environment === "outdoor" ? "outdoor only" : environment === "indoor" ? "indoor only" : "both indoor and outdoor";
    const pool      = environment ? ACTIVITY_BANK[environment] : [...ACTIVITY_BANK.outdoor,...ACTIVITY_BANK.indoor];
    const shuffled  = shuffle(pool);
    const poolStr   = shuffled.slice(0,7).map(a => `id:"${a.id}" name:"${a.name}"`).join("\n");

    try {
      const res = await window.fetch("/api/recommend", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are a family activity expert. Return ONLY valid JSON, no markdown, no preamble.
Shape:
{
  "headline": "fun city-aware tagline ≤10 words",
  "picks": [
    { "id":"string", "why":"personalized reason ≤18 words", "local_tip":"specific tip for ${city} ≤18 words" },
    { "id":"string", "why":"...", "local_tip":"..." },
    { "id":"string", "why":"...", "local_tip":"..." }
  ],
  "bonus_event": { "name":"string", "emoji":"single emoji", "where":"real-sounding ${city} venue", "time":"weekend time", "why":"≤12 words" }
}`,
          messages:[{ role:"user", content:`City: ${city}
Ages: ${ageLabels}
Environment: ${envLabel}
Variation seed: ${Math.random().toFixed(8)}

Pool (choose 3 varied ids from this list):
${poolStr}

Be specific to ${city}. Vary picks every call.` }]
        })
      });
      const data = await res.json();
      const raw  = data.content?.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(raw);
      const allActs = [...ACTIVITY_BANK.outdoor,...ACTIVITY_BANK.indoor];
      setRecs({
        ...parsed,
        picks: parsed.picks.map(p => ({ ...(allActs.find(a=>a.id===p.id)||shuffled[0]), ...p }))
      });
    } catch(_) {
      // Graceful fallback
      const fallback = shuffled.slice(0,3).map(a => ({
        ...a,
        why: `Perfect for families with ${ageLabels} in ${city.split(",")[0]}.`,
        local_tip: `Search for ${a.name.toLowerCase()} venues near downtown ${city.split(",")[0]}.`
      }));
      setRecs({
        headline: `Top Picks for ${city.split(",")[0]} Families!`,
        picks: fallback,
        bonus_event: getEventForCity(city),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { recs, loading, fetchRecs };
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function DondeVamos() {
  const [screen,      setScreen]      = useState("home");
  const [ages,        setAges]        = useState([]);
  const [environment, setEnvironment] = useState(null);
  const [city,        setCity]        = useState("Portland, OR");
  const [showPicker,  setShowPicker]  = useState(false);
  const [selected,    setSelected]    = useState(null);
  const [surprise,    setSurprise]    = useState(null);
  const { recs, loading, fetchRecs }  = useAIRecommendations();

  const toggleAge = id => setAges(p => p.includes(id) ? p.filter(a=>a!==id) : [...p, id]);
  const canGo     = ages.length > 0 && environment !== null;
  const cityEmoji = PRESET_CITIES.find(c => c.name === city)?.emoji || "📍";

  const goDiscover = () => { fetchRecs({ city, ages, environment }); setScreen("discover"); };
  const doSurprise = () => { setSurprise(getEventForCity(city));     setScreen("surprise"); };

  const changeCity = newCity => {
    setCity(newCity);
    if (screen === "discover") fetchRecs({ city: newCity, ages, environment });
  };

  // ── HOME ────────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{ minHeight:"100vh",
      background:"linear-gradient(160deg,#FFF8ED 0%,#E0F2FE 55%,#dcfce7 100%)",
      fontFamily:"Georgia, serif", display:"flex", flexDirection:"column",
      alignItems:"center", padding:"36px 20px 60px", position:"relative", overflow:"hidden" }}>

      {[["#FFB800","300px","-6%","4%","0.09"],["#3B82F6","210px","62%","52%","0.09"],
        ["#22C55E","260px","3%","70%","0.07"],["#FF6B6B","170px","74%","22%","0.08"]].map(([c,s,l,t,o],i)=>(
        <div key={i} style={{ position:"absolute",borderRadius:"50%",background:c,
          width:s,height:s,left:l,top:t,opacity:o,pointerEvents:"none" }} />
      ))}

      <div style={{ position:"relative",width:"100%",maxWidth:520 }}>
        {/* Location pill */}
        <button onClick={() => setShowPicker(true)} style={{ display:"flex",alignItems:"center",gap:8,
          background:"rgba(255,255,255,0.88)",border:"2px solid rgba(59,130,246,0.3)",borderRadius:50,
          padding:"10px 20px",cursor:"pointer",marginBottom:26,backdropFilter:"blur(8px)",
          boxShadow:"0 4px 18px rgba(0,0,0,0.08)",transition:"all 0.2s" }}>
          <span style={{ fontSize:20 }}>{cityEmoji}</span>
          <span style={{ fontWeight:700,fontSize:14,color:"#1e293b" }}>{city}</span>
          <span style={{ fontSize:11,color:"#94a3b8",marginLeft:4 }}>change ▼</span>
        </button>

        <div style={{ textAlign:"center",marginBottom:30 }}>
          <div style={{ fontSize:52,marginBottom:6 }}>🗺️</div>
          <h1 style={{ fontSize:"clamp(2.1rem,7vw,3.3rem)",fontWeight:900,letterSpacing:"-2px",
            color:"#0F172A",margin:0,lineHeight:1 }}>Donde Vamos</h1>
          <p style={{ color:"#64748b",fontSize:15,marginTop:8,fontStyle:"italic" }}>
            Where are we going today, familia?
          </p>
        </div>

        {/* Ages */}
        <div style={{ background:"rgba(255,255,255,0.88)",backdropFilter:"blur(10px)",borderRadius:24,
          padding:24,marginBottom:14,boxShadow:"0 8px 36px rgba(0,0,0,0.07)",
          border:"1.5px solid rgba(255,255,255,0.9)" }}>
          <p style={{ fontWeight:700,fontSize:15,color:"#0F172A",margin:"0 0 13px" }}>
            👶 How old are the kids?{" "}
            <span style={{ fontWeight:400,color:"#94a3b8" }}>(all that apply)</span>
          </p>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {AGE_GROUPS.map(ag => (
              <button key={ag.id} onClick={() => toggleAge(ag.id)} style={{ padding:"12px 14px",borderRadius:14,
                border:`2.5px solid ${ages.includes(ag.id)?COLORS.sky:"#e2e8f0"}`,
                background:ages.includes(ag.id)?COLORS.cloud:"white",cursor:"pointer",textAlign:"left",
                transition:"all 0.18s",transform:ages.includes(ag.id)?"scale(1.03)":"scale(1)" }}>
                <div style={{ fontSize:20 }}>{ag.label.split(" ")[0]}</div>
                <div style={{ fontSize:13,fontWeight:700,color:"#1e293b" }}>{ag.label.slice(3)}</div>
                <div style={{ fontSize:11,color:"#94a3b8" }}>{ag.range}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Env */}
        <div style={{ background:"rgba(255,255,255,0.88)",backdropFilter:"blur(10px)",borderRadius:24,
          padding:24,marginBottom:22,boxShadow:"0 8px 36px rgba(0,0,0,0.07)",
          border:"1.5px solid rgba(255,255,255,0.9)" }}>
          <p style={{ fontWeight:700,fontSize:15,color:"#0F172A",margin:"0 0 13px" }}>☀️ Indoors or Outdoors?</p>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {[{id:"outdoor",label:"Outdoor",emoji:"🌿",color:COLORS.grass,bg:"#dcfce7"},
              {id:"indoor", label:"Indoor", emoji:"🏠",color:"#8B5CF6",bg:"#ede9fe"}].map(opt => (
              <button key={opt.id} onClick={() => setEnvironment(opt.id)} style={{ padding:"18px",borderRadius:16,
                border:`2.5px solid ${environment===opt.id?opt.color:"#e2e8f0"}`,
                background:environment===opt.id?opt.bg:"white",cursor:"pointer",transition:"all 0.18s",
                transform:environment===opt.id?"scale(1.04)":"scale(1)" }}>
                <div style={{ fontSize:28 }}>{opt.emoji}</div>
                <div style={{ fontSize:14,fontWeight:700,color:"#1e293b",marginTop:4 }}>{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          <button onClick={goDiscover} disabled={!canGo} style={{ padding:"18px 40px",borderRadius:18,
            fontSize:17,fontWeight:800,
            background:canGo?"linear-gradient(135deg,#3B82F6,#6366f1)":"#e2e8f0",
            color:canGo?"white":"#94a3b8",border:"none",cursor:canGo?"pointer":"not-allowed",
            boxShadow:canGo?"0 8px 24px rgba(59,130,246,0.35)":"none",transition:"all 0.2s" }}>
            ✨ Get AI Recommendations
          </button>
          <button onClick={doSurprise} style={{ padding:"16px 40px",borderRadius:18,fontSize:16,fontWeight:700,
            background:`linear-gradient(135deg,${COLORS.sun},${COLORS.coral})`,
            color:"white",border:"none",cursor:"pointer",boxShadow:"0 8px 24px rgba(255,184,0,0.32)" }}>
            🎲 Surprise Me!
          </button>
        </div>
        <p style={{ color:"#94a3b8",fontSize:12,textAlign:"center",marginTop:12 }}>
          {!canGo ? "Select ages & environment to unlock" : `Ready to explore ${city.split(",")[0]}! 🎉`}
        </p>
      </div>

      {showPicker && <LocationPicker current={city} onSelect={changeCity} onClose={() => setShowPicker(false)} />}
    </div>
  );

  // ── SURPRISE ────────────────────────────────────────────────────────────────
  if (screen === "surprise") return (
    <div style={{ minHeight:"100vh",background:"linear-gradient(135deg,#FFF8ED,#fde68a)",
      fontFamily:"Georgia, serif",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ maxWidth:420,width:"100%",textAlign:"center" }}>
        <div style={{ fontSize:64,marginBottom:10 }}>🎲</div>
        <h2 style={{ fontSize:24,fontWeight:900,color:"#0F172A",margin:"0 0 3px" }}>This Weekend in</h2>
        <p style={{ fontSize:17,color:COLORS.bark,fontWeight:700,margin:"0 0 18px" }}>
          {cityEmoji} {city}
        </p>
        <div style={{ background:"white",borderRadius:26,padding:30,boxShadow:"0 12px 48px rgba(0,0,0,0.1)",margin:"0 0 18px" }}>
          <div style={{ fontSize:52,marginBottom:10 }}>{surprise?.emoji}</div>
          <h3 style={{ fontSize:22,fontWeight:800,color:"#0F172A",margin:"0 0 10px" }}>{surprise?.name}</h3>
          <p style={{ color:"#64748b",fontSize:14,margin:"0 0 4px" }}>📍 {surprise?.where}</p>
          <p style={{ color:"#64748b",fontSize:14,margin:"0 0 12px" }}>🕒 {surprise?.time}</p>
          {surprise?.why && (
            <div style={{ background:"#FFF8ED",borderRadius:14,padding:"9px 13px" }}>
              <p style={{ margin:0,fontSize:13,color:"#92400e",fontStyle:"italic" }}>"{surprise.why}"</p>
            </div>
          )}
        </div>
        <div style={{ display:"flex",gap:12,justifyContent:"center" }}>
          <button onClick={() => setSurprise(getEventForCity(city))} style={{ padding:"13px 22px",
            borderRadius:16,background:`linear-gradient(135deg,${COLORS.sun},${COLORS.coral})`,
            color:"white",border:"none",fontSize:14,fontWeight:700,cursor:"pointer" }}>🔄 Try Again</button>
          <button onClick={() => setShowPicker(true)} style={{ padding:"13px 22px",borderRadius:16,
            background:"white",border:"2px solid #e2e8f0",fontSize:14,fontWeight:700,cursor:"pointer",color:"#0F172A" }}>
            {cityEmoji} Change City
          </button>
          <button onClick={() => setScreen("home")} style={{ padding:"13px 22px",borderRadius:16,
            background:"white",border:"2px solid #e2e8f0",fontSize:14,fontWeight:700,cursor:"pointer",color:"#0F172A" }}>← Home</button>
        </div>
      </div>
      {showPicker && <LocationPicker current={city} onSelect={changeCity} onClose={() => setShowPicker(false)} />}
    </div>
  );

  // ── DISCOVER ────────────────────────────────────────────────────────────────
  if (screen === "discover") return (
    <div style={{ minHeight:"100vh",background:"#f8fafc",fontFamily:"Georgia, serif",paddingBottom:50 }}>
      <div style={{ background:"linear-gradient(135deg,#0F172A,#1e40af)",padding:"24px 20px 20px",color:"white" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
          <button onClick={() => setScreen("home")} style={{ background:"rgba(255,255,255,0.15)",border:"none",
            color:"white",padding:"6px 13px",borderRadius:10,cursor:"pointer",fontSize:13 }}>← Back</button>
          <button onClick={() => setShowPicker(true)} style={{ display:"flex",alignItems:"center",gap:7,
            background:"rgba(255,255,255,0.18)",border:"1.5px solid rgba(255,255,255,0.3)",
            color:"white",padding:"7px 14px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600 }}>
            {cityEmoji} {city.split(",")[0]}
            <span style={{ fontSize:10,opacity:0.8 }}>▼ change</span>
          </button>
        </div>
        <h2 style={{ margin:"0 0 3px",fontSize:21,fontWeight:800 }}>
          {loading ? "Finding the best picks…" : (recs?.headline || `Adventures in ${city.split(",")[0]}`)}
        </h2>
        <p style={{ margin:0,opacity:0.65,fontSize:12 }}>
          {environment==="outdoor"?"🌿 Outdoor":"🏠 Indoor"} ·{" "}
          {ages.map(a=>AGE_GROUPS.find(g=>g.id===a)?.label.split(" ")[0]).join(" ")}
        </p>
      </div>

      <div style={{ padding:"0 18px" }}>
        <div style={{ marginTop:18,marginBottom:20 }}>
          <h3 style={{ fontSize:14,fontWeight:700,margin:"0 0 10px",color:"#0F172A" }}>
            📍 Nearby in {city}
          </h3>
          <MapView filter={environment||"all"} cityName={city} />
        </div>

        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
          <h3 style={{ fontSize:14,fontWeight:700,margin:0,color:"#0F172A" }}>✨ AI Picks for Your Family</h3>
          <button onClick={() => fetchRecs({ city, ages, environment })} disabled={loading}
            style={{ background:loading?"#e2e8f0":"#EDE9FE",color:loading?"#94a3b8":"#7C3AED",
              border:"none",borderRadius:20,padding:"5px 13px",fontSize:12,fontWeight:700,
              cursor:loading?"not-allowed":"pointer" }}>
            {loading?"…":"🔄 Refresh"}
          </button>
        </div>

        {/* Shimmer skeletons */}
        {loading && (
          <>
            <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
            <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:22 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height:90,borderRadius:20,
                  background:"linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%)",
                  backgroundSize:"400% 100%",animation:"shimmer 1.4s infinite" }} />
              ))}
            </div>
          </>
        )}

        {recs && !loading && (
          <>
            <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:18 }}>
              {recs.picks.map((act, idx) => (
                <div key={act.id+idx} onClick={() => { setSelected(act); setScreen("activity"); }}
                  style={{ background:"white",borderRadius:20,padding:17,cursor:"pointer",
                    boxShadow:"0 4px 18px rgba(0,0,0,0.07)",border:"1.5px solid #f1f5f9",transition:"all 0.18s" }}>
                  <div style={{ display:"flex",alignItems:"flex-start",gap:13 }}>
                    <div style={{ width:50,height:50,borderRadius:14,background:(act.color||"#3B82F6")+"22",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:25,flexShrink:0 }}>
                      {act.emoji}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800,fontSize:15,color:"#0F172A" }}>{act.name}</div>
                      <div style={{ fontSize:12,color:"#7c3aed",fontStyle:"italic",marginTop:2 }}>💬 {act.why}</div>
                      {act.local_tip && (
                        <div style={{ fontSize:11,color:"#16a34a",marginTop:3,fontWeight:600 }}>
                          📍 {act.local_tip}
                        </div>
                      )}
                      <div style={{ marginTop:7 }}>
                        <span style={{ background:"#f1f5f9",padding:"3px 9px",borderRadius:20,fontSize:11,color:"#475569" }}>
                          ⏱ {act.duration}
                        </span>
                      </div>
                    </div>
                    <span style={{ color:"#cbd5e1",fontSize:18,marginTop:2 }}>›</span>
                  </div>
                </div>
              ))}
            </div>

            {recs.bonus_event && (
              <div onClick={() => { setSurprise(recs.bonus_event); setScreen("surprise"); }}
                style={{ background:`linear-gradient(135deg,${COLORS.sun},${COLORS.coral})`,
                  borderRadius:18,padding:"14px 17px",marginBottom:18,cursor:"pointer" }}>
                <div style={{ color:"rgba(255,255,255,0.75)",fontSize:10,fontWeight:800,
                  textTransform:"uppercase",letterSpacing:1,marginBottom:4 }}>🎲 Weekend Pick</div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontWeight:800,color:"white",fontSize:15 }}>
                      {recs.bonus_event.emoji} {recs.bonus_event.name}
                    </div>
                    <div style={{ color:"rgba(255,255,255,0.8)",fontSize:12 }}>
                      📍 {recs.bonus_event.where} · {recs.bonus_event.time}
                    </div>
                  </div>
                  <span style={{ color:"white",fontSize:20 }}>→</span>
                </div>
              </div>
            )}
          </>
        )}

        <button onClick={doSurprise} style={{ width:"100%",padding:"14px",borderRadius:18,
          background:`linear-gradient(135deg,${COLORS.sun}bb,${COLORS.coral}bb)`,
          color:"white",border:"none",fontSize:15,fontWeight:700,cursor:"pointer" }}>
          🎲 Random Surprise Event
        </button>
      </div>

      {showPicker && <LocationPicker current={city} onSelect={changeCity} onClose={() => setShowPicker(false)} />}
    </div>
  );

  // ── ACTIVITY DETAIL ─────────────────────────────────────────────────────────
  if (screen === "activity" && selected) return (
    <div style={{ minHeight:"100vh",background:"#f8fafc",fontFamily:"Georgia, serif" }}>
      <div style={{ background:`linear-gradient(160deg,${(selected.color||"#3B82F6")}33,${(selected.color||"#3B82F6")}11)`,
        padding:"24px 20px 28px",borderBottom:`3px solid ${(selected.color||"#3B82F6")}44` }}>
        <button onClick={() => setScreen("discover")} style={{ background:"rgba(255,255,255,0.8)",border:"none",
          padding:"6px 13px",borderRadius:10,cursor:"pointer",fontSize:13,marginBottom:14,color:"#0F172A" }}>
          ← Back
        </button>
        <div style={{ fontSize:50 }}>{selected.emoji}</div>
        <h2 style={{ fontSize:23,fontWeight:900,margin:"8px 0 3px",color:"#0F172A" }}>{selected.name}</h2>
        <p style={{ color:"#64748b",margin:"0 0 5px",fontSize:14 }}>{selected.desc}</p>
        {selected.why && (
          <p style={{ color:"#7c3aed",fontSize:13,fontStyle:"italic",margin:"3px 0 5px" }}>💬 {selected.why}</p>
        )}
        {selected.local_tip && (
          <p style={{ color:"#16a34a",fontSize:12,fontWeight:600,margin:"0 0 10px" }}>📍 {selected.local_tip}</p>
        )}
        <div style={{ display:"flex",gap:9 }}>
          <span style={{ background:selected.color||"#3B82F6",color:"white",padding:"5px 13px",
            borderRadius:20,fontSize:12,fontWeight:700 }}>⏱ {selected.duration}</span>
          <span style={{ background:"white",color:selected.color||"#3B82F6",padding:"5px 13px",borderRadius:20,
            fontSize:12,fontWeight:700,border:`2px solid ${selected.color||"#3B82F6"}` }}>
            {cityEmoji} {city.split(",")[0]}
          </span>
        </div>
      </div>
      <div style={{ padding:20 }}>
        <Checklist items={selected.checklist||[]} />
        <div style={{ marginTop:22,padding:16,background:"#FFF8ED",borderRadius:16,border:"1.5px solid #fde68a" }}>
          <p style={{ margin:0,fontSize:13,color:"#92400e",fontWeight:600 }}>
            💡 Check local listings & weather before heading out. Book tickets in advance when possible!
          </p>
        </div>
        <button onClick={() => setScreen("discover")} style={{ width:"100%",marginTop:20,padding:"15px",
          borderRadius:16,fontSize:15,fontWeight:700,
          background:`linear-gradient(135deg,${selected.color||"#3B82F6"},${selected.color||"#3B82F6"}99)`,
          color:"white",border:"none",cursor:"pointer",
          boxShadow:`0 8px 22px ${(selected.color||"#3B82F6")}44` }}>
          ✓ Let's Go! See More Activities →
        </button>
      </div>
    </div>
  );

  return null;
}
