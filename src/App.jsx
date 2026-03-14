import { useState, useEffect, createContext, useContext } from "react";

// ─── Storage ──────────────────────────────────────────────────────────────────
const getLocal = (key) => {
  try { return window.localStorage.getItem(key); } catch { return null; }
};
const setLocal = (key, val) => {
  try { window.localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; }
};

const readJSON = (raw, fb) => {
  try { return raw !== null && raw !== undefined ? JSON.parse(raw) : fb; } catch { return fb; }
};

const tryGet = async (key, fb) => {
  if (window.storage?.get) {
    try {
      const r = await window.storage.get(key);
      if (r?.value !== undefined) return readJSON(r.value, fb);
    } catch {}
  }

  return readJSON(getLocal(key), fb);
};

const trySave = (key, val) => {
  const payload = JSON.stringify(val);

  if (window.storage?.set) {
    window.storage.set(key, payload)
      .then(() => setLocal(key, val))
      .catch(() => setLocal(key, val));
    return;
  }

  setLocal(key, val);
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const now = (locale = "es-AR") => new Date().toLocaleString(locale, { dateStyle: "short", timeStyle: "short" });

// ─── i18n ─────────────────────────────────────────────────────────────────────
const LANGS = [
  { code: "es", flag: "🇦🇷", label: "Castellano" },
  { code: "en", flag: "🇬🇧", label: "English"    },
  { code: "it", flag: "🇮🇹", label: "Italiano"   },
  { code: "uk", flag: "🇺🇦", label: "Українська" },
];
const LOCALES = { es: "es-AR", en: "en-GB", it: "it-IT", uk: "uk-UA" };

const T = {
  es: {
    appBadge:"🎮 GAME TRACKER",appTitle:"Gestor de\nJuegos de Mesa",appSub:"Elegí un juego para empezar a trackear",
    comingSoon:"Próximamente",comingSoonGames:"Truco · Chinchón · Canasta · Escoba de 15",
    sharedPlayers:"LOS JUGADORES SON COMPARTIDOS ENTRE TODOS LOS JUEGOS",
    tabs:{players:"Jugadores",newgame:"Nueva",active:"En curso",history:"Historial",ranking:"Ranking"},
    players:"👥 Jugadores",newPlayer:"Nuevo jugador",namePlaceholder:"Nombre…",addBtn:"➕ Agregar",
    activeCount:(n)=>`Activos (${n})`,noPlayers:"No hay jugadores activos todavía.",deactivate:"🗑 Baja",
    alreadyExists:(n)=>`"${n}" ya existe.`,reactivated:(n)=>`¡${n} reactivado!`,added:(n)=>`¡${n} agregado!`,
    newGameUno:"🆕 Nueva partida de UNO",newGameGen:"🆕 Nueva partida de Generala",
    limitLabel:"Límite de puntos (quien llega, pierde)",
    playersMin:"Jugadores (mín. 2)",addPlayersFirst:"Agregá jugadores primero.",
    activeWarning:"⚠️ Partida activa en curso",activeWarningMsg:"Cerrá la partida actual antes de crear una nueva.",
    createGame:(n)=>`🎮 Crear partida con ${n} jugador${n!==1?"es":""}`,
    createGameGen:(n)=>`🎲 Crear partida con ${n} jugador${n!==1?"es":""}`,
    gameCreated:"🎮 ¡Partida creada!",howToPlay:"📋 Cómo se juega",
    genRules:["🎲 Completá las 10 combinaciones del cartón","✅ Por turno ingresás tu puntaje o tachás (0 pts)","⭐ Generala Servida (primer tiro) vale 100 pts","🏆 Gana quien más puntos acumule al completar el cartón"],
    active:"🎯 Partida en curso",noActive:`No hay ninguna partida activa. Creá una en "Nueva".`,
    roundLabel:"Ronda",limitShort:"💀 límite:",scoreLabel:"Puntaje · 🏆 menor gana",scoreLabelGen:"Puntaje · 🏆 mayor gana",
    breakdown:"📊 Breakdown",loadRound:"✍️ Cargar ronda",saveRound:"💾 Guardar ronda",
    cutJust:"✂️ Corta justo (−50 pts · 1 vez por ronda)",
    cutJustUsed:"Ya se usó Corta justo en esta ronda.",cutJustApplied:"✂️ −50 aplicado",
    cutJustNote:"Solo un jugador puede cortar justo por ronda. Se resetea al guardar la siguiente ronda.",
    undoRound:"↩️ Deshacer ronda",undoCut:"↩️ Deshacer corta justo",undoCell:"↩️ Deshacer",
    nothingToUndo:"Nada para deshacer.",undoDone:"↩️ Deshecho",
    closeGame:"⛔ Cerrar partida",confirmClose:"Sí, cerrar",cancelClose:"Cancelar",
    gameClosed:"🔒 Partida cerrada",roundSaved:"Ronda guardada ✓",cellSaved:"✅ Guardado",
    losers:(names,target)=>`💀 ¡${names} llegó al límite de ${target} pts! Podés cerrar la partida.`,
    cartLabel:"📋 Cartón · tocá una celda libre para completar",
    subtotal:"Subtotal",total:"TOTAL",upperSec:"◆ Sección Superior",lowerSec:"◆ Sección Inferior",
    completeMsg:(name,pts)=>`🏆 ¡Cartón completo! ${name} ganó con ${pts} pts. Podés cerrar la partida.`,
    filledCount:(n,tot)=>`(${n}/${tot})`,
    modalSave:(v)=>`✅ Guardar ${v} pts`,modalCross:"✗ Tachar",modalRange:(max)=>`Valor entre 0 y ${max} pts`,
    genServida:"⭐ Generala servida",served:"⭐ Servida",achieved:"✅ Conseguida",crossNo:"✗ Tachar — no lograda (0 pts)",
    history:"📜 Historial",noHistory:"Sin partidas aún.",result:"Resultado",finalCard:"Cartón final",events:"Eventos",
    ranking:"🏆 Ranking global",noRanking:"Sin partidas cerradas aún.",
    rankingNote_low:"Menos puntos = mejor · victorias = menor score al cierre",
    rankingNote_high:"Más puntos = mejor · victorias = mayor score al cierre",
    colPlayer:"Jugador",colGames:"Partidas",colWins:"Victorias",colWinPct:"Win %",colAvg:"Avg pts",
    bdBreakdown:"📊 Breakdown",bdNoEvents:"Sin eventos aún.",bdAccum:"acumulado",bdFinal:"TOTAL FINAL",
    unoTagline:"El que llega al límite, pierde",unoDesc:"Acumulá puntos ronda a ronda. Usá Corta Justo para restarle 50 pts a tu rival.",
    genTagline:"El que más puntos junta, gana",genDesc:"Completá tu cartón con las 10 combinaciones. Conseguí la Generala Servida para 100 pts.",
    loading:"Cargando…",
    combos:{ones:"Unos",twos:"Doses",threes:"Treses",fours:"Cuatros",fives:"Cincos",sixes:"Seises",escalera:"Escalera",full:"Full",poker:"Póker",generala:"Generala"},
    comboHints:{ones:"Suma de 1s",twos:"Suma de 2s",threes:"Suma de 3s",fours:"Suma de 4s",fives:"Suma de 5s",sixes:"Suma de 6s",escalera:"20 o 25 servida",full:"30 o 35 servido",poker:"40 o 45 servido",generala:"50 o 60 servida"},
  },
  en: {
    appBadge:"🎮 GAME TRACKER",appTitle:"Board Game\nTracker",appSub:"Choose a game to start tracking",
    comingSoon:"Coming soon",comingSoonGames:"Truco · Chinchón · Canasta · Escoba de 15",
    sharedPlayers:"PLAYERS ARE SHARED ACROSS ALL GAMES",
    tabs:{players:"Players",newgame:"New",active:"In play",history:"History",ranking:"Ranking"},
    players:"👥 Players",newPlayer:"New player",namePlaceholder:"Name…",addBtn:"➕ Add",
    activeCount:(n)=>`Active (${n})`,noPlayers:"No active players yet.",deactivate:"🗑 Remove",
    alreadyExists:(n)=>`"${n}" already exists.`,reactivated:(n)=>`${n} reactivated!`,added:(n)=>`${n} added!`,
    newGameUno:"🆕 New UNO game",newGameGen:"🆕 New Generala game",
    limitLabel:"Point limit (whoever reaches it, loses)",
    playersMin:"Players (min. 2)",addPlayersFirst:"Add players first.",
    activeWarning:"⚠️ Game in progress",activeWarningMsg:"Close the current game before creating a new one.",
    createGame:(n)=>`🎮 Start game with ${n} player${n!==1?"s":""}`,
    createGameGen:(n)=>`🎲 Start game with ${n} player${n!==1?"s":""}`,
    gameCreated:"🎮 Game created!",howToPlay:"📋 How to play",
    genRules:["🎲 Complete all 10 combinations on your scorecard","✅ Each turn: enter your score or cross it out (0 pts)","⭐ First-roll Generala is worth 100 pts","🏆 Most points when scorecard is complete wins"],
    active:"🎯 Game in progress",noActive:`No active game. Create one under "New".`,
    roundLabel:"Round",limitShort:"💀 limit:",scoreLabel:"Score · 🏆 lowest wins",scoreLabelGen:"Score · 🏆 highest wins",
    breakdown:"📊 Breakdown",loadRound:"✍️ Enter round",saveRound:"💾 Save round",
    cutJust:"✂️ Cut Just (−50 pts · once per round)",
    cutJustUsed:"Cut Just already used this round.",cutJustApplied:"✂️ −50 applied",
    cutJustNote:"Only one player can use Cut Just per round. Resets when the next round is saved.",
    undoRound:"↩️ Undo round",undoCut:"↩️ Undo cut just",undoCell:"↩️ Undo",
    nothingToUndo:"Nothing to undo.",undoDone:"↩️ Undone",
    closeGame:"⛔ Close game",confirmClose:"Yes, close",cancelClose:"Cancel",
    gameClosed:"🔒 Game closed",roundSaved:"Round saved ✓",cellSaved:"✅ Saved",
    losers:(names,target)=>`💀 ${names} reached the limit of ${target} pts! You can close the game.`,
    cartLabel:"📋 Scorecard · tap a free cell to fill",
    subtotal:"Subtotal",total:"TOTAL",upperSec:"◆ Upper Section",lowerSec:"◆ Lower Section",
    completeMsg:(name,pts)=>`🏆 Scorecard complete! ${name} won with ${pts} pts. You can close the game.`,
    filledCount:(n,tot)=>`(${n}/${tot})`,
    modalSave:(v)=>`✅ Save ${v} pts`,modalCross:"✗ Cross out",modalRange:(max)=>`Value between 0 and ${max} pts`,
    genServida:"⭐ First-roll Generala",served:"⭐ Served",achieved:"✅ Achieved",crossNo:"✗ Cross out — not achieved (0 pts)",
    history:"📜 History",noHistory:"No games yet.",result:"Result",finalCard:"Final scorecard",events:"Events",
    ranking:"🏆 Global ranking",noRanking:"No closed games yet.",
    rankingNote_low:"Fewer points = better · wins = lowest score at close",
    rankingNote_high:"More points = better · wins = highest score at close",
    colPlayer:"Player",colGames:"Games",colWins:"Wins",colWinPct:"Win %",colAvg:"Avg pts",
    bdBreakdown:"📊 Breakdown",bdNoEvents:"No events yet.",bdAccum:"running total",bdFinal:"FINAL TOTAL",
    unoTagline:"Whoever hits the limit, loses",unoDesc:"Accumulate points round by round. Use Cut Just to subtract 50 pts from a rival.",
    genTagline:"Whoever scores the most, wins",genDesc:"Complete your scorecard with all 10 combos. Get a First-roll Generala for 100 pts.",
    loading:"Loading…",
    combos:{ones:"Ones",twos:"Twos",threes:"Threes",fours:"Fours",fives:"Fives",sixes:"Sixes",escalera:"Straight",full:"Full House",poker:"Four of a Kind",generala:"Generala"},
    comboHints:{ones:"Sum of 1s",twos:"Sum of 2s",threes:"Sum of 3s",fours:"Sum of 4s",fives:"Sum of 5s",sixes:"Sum of 6s",escalera:"20 or 25 served",full:"30 or 35 served",poker:"40 or 45 served",generala:"50 or 60 served"},
  },
  it: {
    appBadge:"🎮 GAME TRACKER",appTitle:"Gestione\nGiochi da Tavolo",appSub:"Scegli un gioco per iniziare",
    comingSoon:"Prossimamente",comingSoonGames:"Truco · Chinchón · Canasta · Escoba de 15",
    sharedPlayers:"I GIOCATORI SONO CONDIVISI TRA TUTTI I GIOCHI",
    tabs:{players:"Giocatori",newgame:"Nuova",active:"In corso",history:"Storico",ranking:"Classifica"},
    players:"👥 Giocatori",newPlayer:"Nuovo giocatore",namePlaceholder:"Nome…",addBtn:"➕ Aggiungi",
    activeCount:(n)=>`Attivi (${n})`,noPlayers:"Nessun giocatore attivo ancora.",deactivate:"🗑 Rimuovi",
    alreadyExists:(n)=>`"${n}" esiste già.`,reactivated:(n)=>`${n} riattivato!`,added:(n)=>`${n} aggiunto!`,
    newGameUno:"🆕 Nuova partita di UNO",newGameGen:"🆕 Nuova partita di Generala",
    limitLabel:"Limite di punti (chi arriva, perde)",
    playersMin:"Giocatori (min. 2)",addPlayersFirst:"Aggiungi prima i giocatori.",
    activeWarning:"⚠️ Partita in corso",activeWarningMsg:"Chiudi la partita attuale prima di crearne una nuova.",
    createGame:(n)=>`🎮 Crea partita con ${n} giocator${n!==1?"i":"e"}`,
    createGameGen:(n)=>`🎲 Crea partita con ${n} giocator${n!==1?"i":"e"}`,
    gameCreated:"🎮 Partita creata!",howToPlay:"📋 Come si gioca",
    genRules:["🎲 Completa le 10 combinazioni della cartella","✅ Ogni turno: inserisci il punteggio o segna zero","⭐ Generala al primo lancio vale 100 pts","🏆 Vince chi accumula più punti a cartella completa"],
    active:"🎯 Partita in corso",noActive:`Nessuna partita attiva. Creane una in "Nuova".`,
    roundLabel:"Round",limitShort:"💀 limite:",scoreLabel:"Punteggio · 🏆 vince il minore",scoreLabelGen:"Punteggio · 🏆 vince il maggiore",
    breakdown:"📊 Dettaglio",loadRound:"✍️ Inserisci round",saveRound:"💾 Salva round",
    cutJust:"✂️ Taglia Giusto (−50 pts · una volta per round)",
    cutJustUsed:"Taglia Giusto già usato in questo round.",cutJustApplied:"✂️ −50 applicato",
    cutJustNote:"Solo un giocatore può tagliare giusto per round. Si resetta al salvataggio del round successivo.",
    undoRound:"↩️ Annulla round",undoCut:"↩️ Annulla taglia giusto",undoCell:"↩️ Annulla",
    nothingToUndo:"Niente da annullare.",undoDone:"↩️ Annullato",
    closeGame:"⛔ Chiudi partita",confirmClose:"Sì, chiudi",cancelClose:"Annulla",
    gameClosed:"🔒 Partita chiusa",roundSaved:"Round salvato ✓",cellSaved:"✅ Salvato",
    losers:(names,target)=>`💀 ${names} ha raggiunto il limite di ${target} pts! Puoi chiudere la partita.`,
    cartLabel:"📋 Cartella · tocca una cella libera per compilare",
    subtotal:"Subtotale",total:"TOTALE",upperSec:"◆ Sezione Superiore",lowerSec:"◆ Sezione Inferiore",
    completeMsg:(name,pts)=>`🏆 Cartella completa! ${name} ha vinto con ${pts} pts. Puoi chiudere la partita.`,
    filledCount:(n,tot)=>`(${n}/${tot})`,
    modalSave:(v)=>`✅ Salva ${v} pts`,modalCross:"✗ Barrare",modalRange:(max)=>`Valore tra 0 e ${max} pts`,
    genServida:"⭐ Generala al primo lancio",served:"⭐ Servita",achieved:"✅ Ottenuta",crossNo:"✗ Barrare — non ottenuta (0 pts)",
    history:"📜 Storico",noHistory:"Nessuna partita ancora.",result:"Risultato",finalCard:"Cartella finale",events:"Eventi",
    ranking:"🏆 Classifica globale",noRanking:"Nessuna partita chiusa ancora.",
    rankingNote_low:"Meno punti = meglio · vittorie = punteggio minore alla chiusura",
    rankingNote_high:"Più punti = meglio · vittorie = punteggio maggiore alla chiusura",
    colPlayer:"Giocatore",colGames:"Partite",colWins:"Vittorie",colWinPct:"Win %",colAvg:"Media pts",
    bdBreakdown:"📊 Dettaglio",bdNoEvents:"Nessun evento ancora.",bdAccum:"cumulato",bdFinal:"TOTALE FINALE",
    unoTagline:"Chi arriva al limite, perde",unoDesc:"Accumula punti round dopo round. Usa Taglia Giusto per sottrarre 50 pts a un avversario.",
    genTagline:"Chi fa più punti, vince",genDesc:"Completa la cartella con tutte le 10 combinazioni. Ottieni la Generala al primo lancio per 100 pts.",
    loading:"Caricamento…",
    combos:{ones:"Uni",twos:"Due",threes:"Tre",fours:"Quattro",fives:"Cinque",sixes:"Sei",escalera:"Scala",full:"Full",poker:"Poker",generala:"Generala"},
    comboHints:{ones:"Somma degli 1",twos:"Somma dei 2",threes:"Somma dei 3",fours:"Somma dei 4",fives:"Somma dei 5",sixes:"Somma dei 6",escalera:"20 o 25 servita",full:"30 o 35 servito",poker:"40 o 45 servito",generala:"50 o 60 servita"},
  },
  uk: {
    appBadge:"🎮 ТРЕКЕР ІГОР",appTitle:"Менеджер\nНастільних Ігор",appSub:"Оберіть гру для відстеження",
    comingSoon:"Незабаром",comingSoonGames:"Truco · Chinchón · Canasta · Escoba de 15",
    sharedPlayers:"ГРАВЦІ СПІЛЬНІ ДЛЯ ВСІХ ІГОР",
    tabs:{players:"Гравці",newgame:"Нова",active:"В грі",history:"Історія",ranking:"Рейтинг"},
    players:"👥 Гравці",newPlayer:"Новий гравець",namePlaceholder:"Ім'я…",addBtn:"➕ Додати",
    activeCount:(n)=>`Активні (${n})`,noPlayers:"Поки що немає активних гравців.",deactivate:"🗑 Видалити",
    alreadyExists:(n)=>`"${n}" вже існує.`,reactivated:(n)=>`${n} реактивовано!`,added:(n)=>`${n} додано!`,
    newGameUno:"🆕 Нова гра UNO",newGameGen:"🆕 Нова гра Генерала",
    limitLabel:"Ліміт очок (хто досягає — програє)",
    playersMin:"Гравці (мін. 2)",addPlayersFirst:"Спочатку додайте гравців.",
    activeWarning:"⚠️ Гра в процесі",activeWarningMsg:"Закрийте поточну гру перед створенням нової.",
    createGame:(n)=>`🎮 Розпочати гру з ${n} гравц${n===1?"ем":"ями"}`,
    createGameGen:(n)=>`🎲 Розпочати гру з ${n} гравц${n===1?"ем":"ями"}`,
    gameCreated:"🎮 Гру створено!",howToPlay:"📋 Як грати",
    genRules:["🎲 Заповніть 10 комбінацій у картці","✅ За хід: вводите очки або закреслюєте (0 очок)","⭐ Генерала з першого кидку — 100 очок","🏆 Перемагає той, хто набере більше очок"],
    active:"🎯 Гра в процесі",noActive:`Немає активної гри. Створіть у розділі "Нова".`,
    roundLabel:"Раунд",limitShort:"💀 ліміт:",scoreLabel:"Рахунок · 🏆 менше — краще",scoreLabelGen:"Рахунок · 🏆 більше — краще",
    breakdown:"📊 Деталі",loadRound:"✍️ Ввести раунд",saveRound:"💾 Зберегти раунд",
    cutJust:"✂️ Точний удар (−50 очок · раз за раунд)",
    cutJustUsed:"Точний удар вже використано в цьому раунді.",cutJustApplied:"✂️ −50 застосовано",
    cutJustNote:"Лише один гравець може зробити точний удар за раунд. Скидається при наступному раунді.",
    undoRound:"↩️ Скасувати раунд",undoCut:"↩️ Скасувати точний удар",undoCell:"↩️ Скасувати",
    nothingToUndo:"Нічого скасовувати.",undoDone:"↩️ Скасовано",
    closeGame:"⛔ Закрити гру",confirmClose:"Так, закрити",cancelClose:"Скасувати",
    gameClosed:"🔒 Гру закрито",roundSaved:"Раунд збережено ✓",cellSaved:"✅ Збережено",
    losers:(names,target)=>`💀 ${names} досяг ліміту ${target} очок! Можна закрити гру.`,
    cartLabel:"📋 Картка · торкніться вільної комірки для заповнення",
    subtotal:"Проміжний",total:"РАЗОМ",upperSec:"◆ Верхня секція",lowerSec:"◆ Нижня секція",
    completeMsg:(name,pts)=>`🏆 Картку заповнено! ${name} переміг з ${pts} очками. Можна закрити гру.`,
    filledCount:(n,tot)=>`(${n}/${tot})`,
    modalSave:(v)=>`✅ Зберегти ${v} очок`,modalCross:"✗ Закреслити",modalRange:(max)=>`Значення від 0 до ${max} очок`,
    genServida:"⭐ Генерала з першого кидку",served:"⭐ З першого кидка",achieved:"✅ Досягнуто",crossNo:"✗ Закреслити — не досягнуто (0 очок)",
    history:"📜 Історія",noHistory:"Поки що немає ігор.",result:"Результат",finalCard:"Фінальна картка",events:"Події",
    ranking:"🏆 Глобальний рейтинг",noRanking:"Поки що немає завершених ігор.",
    rankingNote_low:"Менше очок = краще · перемоги = найменший рахунок",
    rankingNote_high:"Більше очок = краще · перемоги = найбільший рахунок",
    colPlayer:"Гравець",colGames:"Ігри",colWins:"Перемоги",colWinPct:"Win %",colAvg:"Сер. очок",
    bdBreakdown:"📊 Деталі",bdNoEvents:"Подій ще немає.",bdAccum:"накопичено",bdFinal:"ПІДСУМОК",
    unoTagline:"Хто досягає ліміту — програє",unoDesc:"Накопичуйте очки раунд за раундом. Використовуйте Точний Удар, щоб відняти 50 очок суперника.",
    genTagline:"Хто більше набрав — перемагає",genDesc:"Заповніть картку всіма 10 комбінаціями. Отримайте Генералу з першого кидку за 100 очок.",
    loading:"Завантаження…",
    combos:{ones:"Одиниці",twos:"Двійки",threes:"Трійки",fours:"Четвірки",fives:"П'ятірки",sixes:"Шістки",escalera:"Стрит",full:"Фул-хаус",poker:"Покер",generala:"Генерала"},
    comboHints:{ones:"Сума 1",twos:"Сума 2",threes:"Сума 3",fours:"Сума 4",fives:"Сума 5",sixes:"Сума 6",escalera:"20 або 25 подано",full:"30 або 35 подано",poker:"40 або 45 подано",generala:"50 або 60 подано"},
  },
};

const LangCtx = createContext({ lang:"es", t:T.es });
const useLang = () => useContext(LangCtx);

// ─── Language Selector ────────────────────────────────────────────────────────
function LangSelector({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const cur = LANGS.find(l => l.code === lang) || LANGS[0];
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background:"rgba(0,0,0,0.28)", border:"1px solid rgba(255,255,255,0.18)", color:"#fff", borderRadius:8, padding:"7px 11px", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontWeight:700, letterSpacing:0.5 }}>
        <span style={{ fontSize:16 }}>{cur.flag}</span>
        <span style={{ fontSize:11 }}>{cur.code.toUpperCase()}</span>
        <span style={{ fontSize:9, opacity:0.55 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", background:"#10181f", border:"1px solid #1e3448", borderRadius:12, overflow:"hidden", zIndex:500, minWidth:150, boxShadow:"0 10px 40px rgba(0,0,0,0.6)" }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); trySave("gt:lang", l.code); setOpen(false); }}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"11px 16px", border:"none", background:lang===l.code?"#1e3448":"transparent", color:lang===l.code?"#f0f4f8":"#a3b4c8", cursor:"pointer", fontSize:13, fontWeight:lang===l.code?700:400, textAlign:"left" }}>
              <span style={{ fontSize:18 }}>{l.flag}</span>
              <span>{l.label}</span>
              {lang===l.code && <span style={{ marginLeft:"auto", color:"#3b82f6", fontSize:14 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Game Registry ────────────────────────────────────────────────────────────
const makeRegistry = (t) => [
  { id:"uno",      name:"UNO",      icon:"🃏", tagline:t.unoTagline, description:t.unoDesc, gradient:"linear-gradient(135deg,#7f1d1d 0%,#b91c1c 60%,#ef4444 100%)", winMode:"lowest"  },
  { id:"generala", name:"Generala", icon:"🎲", tagline:t.genTagline, description:t.genDesc, gradient:"linear-gradient(135deg,#78350f 0%,#b45309 60%,#f59e0b 100%)", winMode:"highest" },
];

const makeGenCombos = (t) => [
  { id:"ones",     label:t.combos.ones,     sec:"upper", hint:t.comboHints.ones,     max:5   },
  { id:"twos",     label:t.combos.twos,     sec:"upper", hint:t.comboHints.twos,     max:10  },
  { id:"threes",   label:t.combos.threes,   sec:"upper", hint:t.comboHints.threes,   max:15  },
  { id:"fours",    label:t.combos.fours,    sec:"upper", hint:t.comboHints.fours,    max:20  },
  { id:"fives",    label:t.combos.fives,    sec:"upper", hint:t.comboHints.fives,    max:25  },
  { id:"sixes",    label:t.combos.sixes,    sec:"upper", hint:t.comboHints.sixes,    max:30  },
  { id:"escalera", label:t.combos.escalera, sec:"lower", hint:t.comboHints.escalera, fixed:[20,25]   },
  { id:"full",     label:t.combos.full,     sec:"lower", hint:t.comboHints.full,     fixed:[30,35]   },
  { id:"poker",    label:t.combos.poker,    sec:"lower", hint:t.comboHints.poker,    fixed:[40,45]   },
  { id:"generala", label:t.combos.generala, sec:"lower", hint:t.comboHints.generala, fixed:[50,60]   },
];

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [lang,         setLang]         = useState("es");
  const [selGame,      setSelGame]      = useState(null);
  const [tab,          setTab]          = useState("players");
  const [players,      setPlayers]      = useState([]);
  const [games,        setGames]        = useState([]);
  const [activeGameId, setActiveGameId] = useState(null);
  const [loaded,       setLoaded]       = useState(false);
  const [toast,        setToast]        = useState(null);

  useEffect(() => {
    (async () => {
      setPlayers(await tryGet("gt:players", []));
      setGames(await tryGet("gt:games", []));
      setActiveGameId(await tryGet("gt:activeGame", null));
      setLang(await tryGet("gt:lang", "es"));
      setLoaded(true);
    })();
  }, []);

  const t      = T[lang] || T.es;
  const locale = LOCALES[lang] || "es-AR";
  const nowL   = () => now(locale);

  const showToast   = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };
  const savePlayers = p  => { setPlayers(p);  trySave("gt:players", p); };
  const saveGames   = g  => { setGames(g);    trySave("gt:games", g); };
  const saveActive  = id => { setActiveGameId(id); trySave("gt:activeGame", id); };
  const patchGame   = game => { const u = games.map(g => g.id===game.id ? game : g); saveGames(u); };

  const activeGame  = games.find(g => g.id===activeGameId) || null;
  const gt          = selGame ? makeRegistry(t).find(g => g.id===selGame) : null;
  const curActive   = activeGame?.gameType===selGame ? activeGame : null;
  const GEN_COMBOS  = makeGenCombos(t);
  const TABS = [
    { id:"players", icon:"👥", label:t.tabs.players },
    { id:"newgame", icon:"🆕", label:t.tabs.newgame },
    { id:"active",  icon:"🎯", label:t.tabs.active  },
    { id:"history", icon:"📜", label:t.tabs.history },
    { id:"ranking", icon:"🏆", label:t.tabs.ranking },
  ];

  const addPlayer = name => {
    const n = name.trim(); if(!n) return;
    const am = players.find(p => p.active && p.name.toLowerCase()===n.toLowerCase());
    const im = players.find(p => !p.active && p.name.toLowerCase()===n.toLowerCase());
    if(am) return showToast(t.alreadyExists(n),"err");
    if(im){ savePlayers(players.map(p => p.id===im.id?{...p,active:true}:p)); return showToast(t.reactivated(n)); }
    savePlayers([...players,{id:uid(),name:n,createdAt:nowL(),active:true}]);
    showToast(t.added(n));
  };
  const deactivatePlayer = id => savePlayers(players.map(p => p.id===id?{...p,active:false}:p));

  const createGame = (config, playerIds) => {
    const names = playerIds.map(id => players.find(p=>p.id===id)?.name).filter(Boolean);
    const base  = {id:uid(),gameType:selGame,name:names.join(", ")+" · "+nowL(),playerIds,status:"ACTIVE",startedAt:nowL(),endedAt:null,events:[]};
    const extra = selGame==="generala"
      ? {scorecards:Object.fromEntries(playerIds.map(id=>[id,Object.fromEntries(GEN_COMBOS.map(c=>[c.id,null]))]))}
      : {target:config.target};
    const ng = {...base,...extra};
    saveGames([...games,ng]); saveActive(ng.id);
    showToast(t.gameCreated); setTab("active");
  };

  const addRound = pm => {
    if(!curActive) return;
    const roundId = uid();
    patchGame({...curActive,events:[...curActive.events,...Object.entries(pm).map(([pid,val])=>({id:uid(),roundId,type:"ADD_POINTS",playerId:pid,value:val,ts:nowL()}))]});
    showToast(t.roundSaved);
  };
  const cutJust = (pid,blocked) => {
    if(blocked) return showToast(t.cutJustUsed,"err");
    if(!curActive) return;
    patchGame({...curActive,events:[...curActive.events,{id:uid(),type:"CUT_JUST",playerId:pid,value:-50,ts:nowL()}]});
    showToast(t.cutJustApplied);
  };
  const fillCell = (pid,comboId,value) => {
    if(!curActive) return;
    const prev = curActive.scorecards[pid][comboId];
    const newSc = {...curActive.scorecards,[pid]:{...curActive.scorecards[pid],[comboId]:value}};
    patchGame({...curActive,scorecards:newSc,events:[...curActive.events,{id:uid(),type:"FILL_CELL",playerId:pid,comboId,value,prevValue:prev,ts:nowL()}]});
    showToast(t.cellSaved);
  };
  const undoLast = () => {
    if(!curActive?.events.length) return showToast(t.nothingToUndo,"err");
    const ev=curActive.events, last=ev[ev.length-1];
    if(last.type==="FILL_CELL"){
      patchGame({...curActive,events:ev.slice(0,-1),scorecards:{...curActive.scorecards,[last.playerId]:{...curActive.scorecards[last.playerId],[last.comboId]:last.prevValue}}});
    } else if(last.type==="ADD_POINTS"){
      patchGame({...curActive,events:ev.filter(e=>e.roundId!==last.roundId)});
    } else { patchGame({...curActive,events:ev.slice(0,-1)}); }
    showToast(t.undoDone);
  };
  const closeGame = () => {
    if(!curActive) return;
    const updated = {...curActive,events:[...curActive.events,{id:uid(),type:"END_GAME",ts:nowL()}],status:"ENDED",endedAt:nowL()};
    saveGames(games.map(g=>g.id===updated.id?updated:g)); saveActive(null);
    showToast(t.gameClosed); setTab("history");
  };

  const getScores = game => {
    const s={}; game.playerIds.forEach(id=>s[id]=0);
    if(game.gameType==="generala"){
      game.playerIds.forEach(id=>{ s[id]=Object.values(game.scorecards?.[id]||{}).reduce((a,v)=>a+(v||0),0); });
    } else {
      game.events.forEach(e=>{ if(e.playerId&&(e.type==="ADD_POINTS"||e.type==="CUT_JUST")) s[e.playerId]=(s[e.playerId]||0)+e.value; });
    }
    return s;
  };
  const getRanking = () => {
    const ended = games.filter(g=>g.status==="ENDED"&&g.gameType===selGame);
    const stats={}; players.forEach(p=>{stats[p.id]={name:p.name,played:0,wins:0,totalPts:0};});
    ended.forEach(game=>{
      const sc=getScores(game),vals=Object.values(sc);
      const best=gt?.winMode==="highest"?Math.max(...vals):Math.min(...vals);
      game.playerIds.forEach(pid=>{if(!stats[pid])return;stats[pid].played++;stats[pid].totalPts+=sc[pid]||0;if(sc[pid]===best)stats[pid].wins++;});
    });
    return Object.values(stats).filter(s=>s.played>0)
      .map(s=>({...s,winRate:((s.wins/s.played)*100).toFixed(1),avg:(s.totalPts/s.played).toFixed(1)}))
      .sort((a,b)=>b.wins-a.wins||parseFloat(b.winRate)-parseFloat(a.winRate));
  };

  if(!loaded) return (
    <><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={S.loading}><div style={S.spinner}/><p style={{color:"#a3b4c8",marginTop:16,fontFamily:"'DM Sans',sans-serif"}}>{t.loading}</p></div>
    </>
  );

  const ctxVal = {lang,t};
  const REGISTRY = makeRegistry(t);

  // ── HOME ────────────────────────────────────────────────────────────────────
  if(!selGame) return (
    <LangCtx.Provider value={ctxVal}>
      <><style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.gc:hover{transform:translateY(-3px) scale(1.01);box-shadow:0 16px 48px rgba(0,0,0,0.55)!important;}.gc{transition:transform .2s ease,box-shadow .2s ease;}`}</style>
        <div style={S.app}>
          <div style={S.homeHero}>
            <div style={{position:"absolute",top:14,right:16}}><LangSelector lang={lang} setLang={setLang}/></div>
            <div style={S.homeBadge}>{t.appBadge}</div>
            <h1 style={S.homeTitle}>{t.appTitle.split("\n").map((l,i)=><span key={i}>{l}{i===0?<br/>:""}</span>)}</h1>
            <p style={S.homeSubtitle}>{t.appSub}</p>
          </div>
          <main style={{...S.main,paddingTop:20}}>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {REGISTRY.map((g,i)=>(
                <button key={g.id} className="gc"
                  onClick={()=>{setSelGame(g.id);setTab("players");}}
                  style={{...S.gameCard,background:g.gradient,animationDelay:`${i*0.1}s`}}>
                  <div style={S.gameCardIcon}>{g.icon}</div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"-0.5px"}}>{g.name}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4}}>{g.tagline}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:6,lineHeight:1.5}}>{g.description}</div>
                  </div>
                  <span style={{fontSize:28,color:"rgba(255,255,255,0.35)",marginLeft:8}}>›</span>
                </button>
              ))}
              <div style={S.gameCardPlaceholder}>
                <span style={{fontSize:24,opacity:0.35}}>➕</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#2a4052"}}>{t.comingSoon}</div>
                  <div style={{fontSize:11,color:"#1e3040",marginTop:2}}>{t.comingSoonGames}</div>
                </div>
              </div>
            </div>
            <p style={{textAlign:"center",marginTop:32,fontSize:11,color:"#1e3040",letterSpacing:1}}>{t.sharedPlayers}</p>
          </main>
          {toast && <div style={{...S.toast,background:toast.type==="err"?"#ef4444":"#10b981"}}>{toast.msg}</div>}
        </div>
      </>
    </LangCtx.Provider>
  );

  // ── IN-GAME ────────────────────────────────────────────────────────────────
  const filteredGames = games.filter(g=>g.gameType===selGame);
  return (
    <LangCtx.Provider value={ctxVal}>
      <><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={S.app}>
          <header style={{...S.header,background:gt.gradient}}>
            <div style={S.headerInner}>
              <button onClick={()=>setSelGame(null)} style={S.backBtn}>‹</button>
              <span style={{fontSize:30}}>{gt.icon}</span>
              <div style={{flex:1}}>
                <h1 style={S.title}>{gt.name}</h1>
                <p style={S.subtitle}>{gt.tagline}</p>
              </div>
              <LangSelector lang={lang} setLang={setLang}/>
            </div>
          </header>
          <nav style={S.nav}>
            {TABS.map(tb=>(
              <button key={tb.id} onClick={()=>setTab(tb.id)} style={{...S.tabBtn,...(tab===tb.id?S.tabActive:{})}}>
                <span>{tb.icon}</span><span style={S.tabLabel}>{tb.label}</span>
                {tb.id==="active"&&curActive&&<span style={S.badge}>●</span>}
              </button>
            ))}
          </nav>
          <main style={S.main}>
            {tab==="players" && <TabPlayers players={players} games={games} onAdd={addPlayer} onDeactivate={deactivatePlayer}/>}
            {tab==="newgame"&&selGame==="uno"      && <TabNewGameUno      players={players} activeGame={curActive} onCreate={createGame}/>}
            {tab==="newgame"&&selGame==="generala" && <TabNewGameGenerala players={players} activeGame={curActive} onCreate={createGame}/>}
            {tab==="active" &&selGame==="uno"      && <TabActiveUno       game={curActive} players={players} getScores={getScores} onAddRound={addRound} onCutJust={cutJust} onUndo={undoLast} onClose={closeGame}/>}
            {tab==="active" &&selGame==="generala" && <TabActiveGenerala  game={curActive} players={players} getScores={getScores} onFillCell={fillCell} onUndo={undoLast} onClose={closeGame} GEN_COMBOS={GEN_COMBOS}/>}
            {tab==="history" && <TabHistory games={filteredGames} players={players} getScores={getScores} gameType={gt} GEN_COMBOS={GEN_COMBOS}/>}
            {tab==="ranking" && <TabRanking ranking={getRanking()} gameType={gt}/>}
          </main>
          {toast && <div style={{...S.toast,background:toast.type==="err"?"#ef4444":"#10b981"}}>{toast.msg}</div>}
        </div>
      </>
    </LangCtx.Provider>
  );
}

// ── Tab Players ───────────────────────────────────────────────────────────────
function TabPlayers({players,games,onAdd,onDeactivate}){
  const {t}=useLang(); const [name,setName]=useState("");
  const active=players.filter(p=>p.active);
  const submit=()=>{const n=name.trim();if(!n)return;onAdd(n);setName("");};
  const confirmDeactivate = (p) => {
    const linkedGames = games.filter(g => g.playerIds.includes(p.id)).length;
    const msg = linkedGames > 0
      ? `¿Seguro que querés dar de baja a ${p.name}?

Este jugador aparece en ${linkedGames} partida${linkedGames!==1?"s":""}.
El historial y ranking se conservan.`
      : `¿Seguro que querés dar de baja a ${p.name}?`;
    if (window.confirm(msg)) onDeactivate(p.id);
  };
  return(
    <div style={S.tabContent}>
      <h2 style={S.sectionTitle}>{t.players}</h2>
      <div style={S.card}>
        <p style={S.cardLabel}>{t.newPlayer}</p>
        <div style={S.row}>
          <input style={S.input} placeholder={t.namePlaceholder} value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          <button style={S.btnPrimary} onClick={submit}>{t.addBtn}</button>
        </div>
      </div>
      {active.length===0?<div style={S.empty}>{t.noPlayers}</div>:
        <div style={S.card}>
          <p style={S.cardLabel}>{t.activeCount(active.length)}</p>
          {active.map(p=>(
            <div key={p.id} style={S.playerRow}>
              <div><span style={S.playerName}>{p.name}</span><span style={S.meta}> · {p.createdAt}</span></div>
              <button style={S.btnDanger} onClick={()=>confirmDeactivate(p)}>{t.deactivate}</button>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

// ── Tab New Game UNO ──────────────────────────────────────────────────────────
function TabNewGameUno({players,activeGame,onCreate}){
  const {t}=useLang(); const [target,setTarget]=useState(100); const [sel,setSel]=useState([]);
  const active=players.filter(p=>p.active);
  const toggle=id=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const submit=()=>{if(sel.length<2)return;onCreate({target},sel);setSel([]);setTarget(100);};
  if(activeGame) return(
    <div style={S.tabContent}><h2 style={S.sectionTitle}>{t.newGameUno}</h2>
      <div style={{...S.card,borderColor:"#f59e0b"}}><p style={{color:"#f59e0b",fontWeight:700,marginBottom:8}}>{t.activeWarning}</p><p style={{color:"#a3b4c8"}}>{t.activeWarningMsg}</p></div>
    </div>
  );
  return(
    <div style={S.tabContent}>
      <h2 style={S.sectionTitle}>{t.newGameUno}</h2>
      <div style={S.card}>
        <p style={S.cardLabel}>{t.limitLabel}</p>
        <div style={S.row}>
          {[50,100,150,200,500].map(v=><button key={v} style={{...S.chip,...(target===v?S.chipActive:{})}} onClick={()=>setTarget(v)}>{v}</button>)}
          <input type="number" style={{...S.input,maxWidth:80}} value={target} onChange={e=>setTarget(Number(e.target.value))}/>
        </div>
      </div>
      <div style={S.card}>
        <p style={S.cardLabel}>{t.playersMin}</p>
        {active.length===0?<p style={{color:"#a3b4c8"}}>{t.addPlayersFirst}</p>:
          active.map(p=>(
            <div key={p.id} onClick={()=>toggle(p.id)} style={{...S.selectRow,...(sel.includes(p.id)?S.selectRowActive:{})}}>
              <span style={{fontSize:18}}>{sel.includes(p.id)?"✅":"⬜"}</span><span style={S.playerName}>{p.name}</span>
            </div>
          ))
        }
      </div>
      <button style={{...S.btnPrimary,width:"100%",opacity:sel.length<2?0.5:1}} onClick={submit} disabled={sel.length<2}>{t.createGame(sel.length)}</button>
    </div>
  );
}

// ── Tab New Game Generala ─────────────────────────────────────────────────────
function TabNewGameGenerala({players,activeGame,onCreate}){
  const {t}=useLang(); const [sel,setSel]=useState([]);
  const active=players.filter(p=>p.active);
  const toggle=id=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const submit=()=>{if(sel.length<2)return;onCreate({},sel);setSel([]);};
  if(activeGame) return(
    <div style={S.tabContent}><h2 style={S.sectionTitle}>{t.newGameGen}</h2>
      <div style={{...S.card,borderColor:"#f59e0b"}}><p style={{color:"#f59e0b",fontWeight:700,marginBottom:8}}>{t.activeWarning}</p><p style={{color:"#a3b4c8"}}>{t.activeWarningMsg}</p></div>
    </div>
  );
  return(
    <div style={S.tabContent}>
      <h2 style={S.sectionTitle}>{t.newGameGen}</h2>
      <div style={{...S.card,borderColor:"#78350f"}}>
        <p style={S.cardLabel}>{t.howToPlay}</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {t.genRules.map((rule,i)=>{
            const parts=rule.split(" "); const icon=parts[0]; const text=parts.slice(1).join(" ");
            return(<div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:13,color:"#a3b4c8"}}><span style={{fontSize:16,flexShrink:0}}>{icon}</span><span>{text}</span></div>);
          })}
        </div>
      </div>
      <div style={S.card}>
        <p style={S.cardLabel}>{t.playersMin}</p>
        {active.length===0?<p style={{color:"#a3b4c8"}}>{t.addPlayersFirst}</p>:
          active.map(p=>(
            <div key={p.id} onClick={()=>toggle(p.id)} style={{...S.selectRow,...(sel.includes(p.id)?S.selectRowActive:{})}}>
              <span style={{fontSize:18}}>{sel.includes(p.id)?"✅":"⬜"}</span><span style={S.playerName}>{p.name}</span>
            </div>
          ))
        }
      </div>
      <button style={{...S.btnPrimary,width:"100%",background:"linear-gradient(135deg,#b45309,#d97706)",opacity:sel.length<2?0.5:1}} onClick={submit} disabled={sel.length<2}>{t.createGameGen(sel.length)}</button>
    </div>
  );
}

// ── Breakdown Modal ───────────────────────────────────────────────────────────
function BreakdownModal({game,players,onClose}){
  const {t}=useLang();
  const gp=game.playerIds.map(id=>players.find(p=>p.id===id)).filter(Boolean);
  const rounds=[]; let curRid=null;
  game.events.forEach(e=>{
    if(e.type==="END_GAME") return;
    if(e.type==="ADD_POINTS"){
      if(e.roundId!==curRid){curRid=e.roundId;rounds.push({roundId:e.roundId,label:`${t.roundLabel} ${rounds.length+1}`,events:[]});}
      rounds[rounds.length-1].events.push(e);
    } else if(e.type==="CUT_JUST"){
      if(!rounds.length) rounds.push({roundId:"pre",label:"Pre",events:[]});
      rounds[rounds.length-1].events.push(e);
    }
  });
  const running={}; gp.forEach(p=>running[p.id]=0);
  const enriched=rounds.map(r=>{
    const d={}; gp.forEach(p=>d[p.id]=0);
    r.events.forEach(e=>{if(e.playerId) d[e.playerId]=(d[e.playerId]||0)+e.value;});
    gp.forEach(p=>running[p.id]+=d[p.id]);
    return {...r,deltas:d,snap:{...running}};
  });
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHeader}>
          <div><p style={{margin:0,fontSize:16,fontWeight:800,color:"#f0f4f8"}}>{t.bdBreakdown}</p><p style={{margin:0,fontSize:11,color:"#7a9ab0"}}>{game.name}</p></div>
          <button style={S.modalClose} onClick={onClose}>✕</button>
        </div>
        <div style={S.modalBody}>
          <div style={S.bdHeaderRow}>
            <span style={S.bdLabelCell}>{t.roundLabel}</span>
            {gp.map(p=><span key={p.id} style={{...S.bdDataCell,color:"#a3b4c8",fontWeight:700}}>{p.name}</span>)}
          </div>
          {enriched.length===0&&<p style={{color:"#4a6070",textAlign:"center",padding:"24px 0"}}>{t.bdNoEvents}</p>}
          {enriched.map((r,ri)=>(
            <div key={r.roundId} style={{...S.bdRoundBlock,background:ri%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
              <div style={S.bdRow}>
                <span style={{...S.bdLabelCell,fontSize:12}}>{r.label}</span>
                {gp.map(p=>{
                  const av=r.events.filter(e=>e.type==="ADD_POINTS"&&e.playerId===p.id).reduce((a,e)=>a+e.value,0);
                  const hc=r.events.some(e=>e.type==="CUT_JUST"&&e.playerId===p.id);
                  return(<span key={p.id} style={S.bdDataCell}>{r.deltas[p.id]===0&&!hc?<span style={{color:"#2a3f52"}}>—</span>:<span style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>{av!==0&&<span style={{color:av>0?"#60a5fa":"#f87171",fontSize:13,fontWeight:600}}>{av>0?"+":""}{av}</span>}{hc&&<span style={{color:"#fbbf24",fontSize:11}}>✂️ −50</span>}</span>}</span>);
                })}
              </div>
              <div style={{...S.bdRow,paddingBottom:6,borderBottom:"1px solid #172030"}}>
                <span style={{...S.bdLabelCell,color:"#3a5068",fontSize:11}}>{t.bdAccum}</span>
                {gp.map(p=>{const sc=r.snap[p.id];const isOver=sc>=game.target;const pct=Math.min(100,(sc/game.target)*100);return(<span key={p.id} style={{...S.bdDataCell,flexDirection:"column",gap:3}}><span style={{fontWeight:800,fontSize:15,color:isOver?"#ef4444":pct>75?"#f59e0b":"#10b981"}}>{sc}{isOver?" 💀":""}</span><div style={{width:40,height:3,background:"#1e3448",borderRadius:99,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:isOver?"#ef4444":pct>75?"#f59e0b":"#3b82f6",borderRadius:99}}/></div></span>);})}
              </div>
            </div>
          ))}
          {enriched.length>0&&<div style={{...S.bdRow,marginTop:10,paddingTop:10,borderTop:"2px solid #1e3448"}}><span style={{...S.bdLabelCell,fontWeight:800,color:"#f0f4f8",fontSize:13}}>{t.bdFinal}</span>{gp.map(p=>{const sc=running[p.id];const isOver=sc>=game.target;return <span key={p.id} style={S.bdDataCell}><span style={{fontWeight:900,fontSize:18,color:isOver?"#ef4444":"#f0f4f8"}}>{sc}{isOver?" 💀":""}</span></span>;})}</div>}
        </div>
      </div>
    </div>
  );
}

// ── Tab Active UNO ────────────────────────────────────────────────────────────
function TabActiveUno({game,players,getScores,onAddRound,onCutJust,onUndo,onClose}){
  const {t}=useLang();
  const [inputs,setInputs]=useState({});
  const [confirmClose,setConfirmClose]=useState(false);
  const [showBreakdown,setShowBreakdown]=useState(false);
  useEffect(()=>{if(game){const init={};game.playerIds.forEach(id=>init[id]="");setInputs(init);}},[game?.id]);
  if(!game) return(<div style={S.tabContent}><h2 style={S.sectionTitle}>{t.active}</h2><div style={S.empty}>{t.noActive}</div></div>);
  const scores=getScores(game);
  const gamePlayers=game.playerIds.map(id=>players.find(p=>p.id===id)).filter(Boolean);
  const sorted=[...gamePlayers].sort((a,b)=>(scores[a.id]||0)-(scores[b.id]||0));
  const losers=gamePlayers.filter(p=>(scores[p.id]||0)>=game.target);
  const lastAddIdx=(()=>{for(let i=game.events.length-1;i>=0;i--)if(game.events[i].type==="ADD_POINTS")return i;return -1;})();
  const cutsThisRound=game.events.slice(lastAddIdx+1).filter(e=>e.type==="CUT_JUST");
  const whoCutId=cutsThisRound[0]?.playerId;
  const cutSet=new Set(cutsThisRound.map(e=>e.playerId));
  const saveRound=()=>{
    const payload={};
    game.playerIds.forEach(id=>{
      const raw=inputs[id];
      if(raw==="") return;
      const n=Number(raw);
      if(!Number.isNaN(n)) payload[id]=n;
    });
    if(Object.keys(payload).length===0) return;
    onAddRound(payload);
    const r={};game.playerIds.forEach(id=>r[id]="");setInputs(r);
  };
  const lastEvent=game.events[game.events.length-1];
  const undoLabel=lastEvent?.type==="ADD_POINTS"?t.undoRound:lastEvent?.type==="CUT_JUST"?t.undoCut:null;
  const playedRounds = new Set(game.events.filter(e=>e.roundId).map(e=>e.roundId)).size;
  const roundNum = playedRounds + 1;
  const showPodium = playedRounds > 1;
  return(
    <div style={S.tabContent}>
      <h2 style={S.sectionTitle}>{t.active}</h2>
      <div style={S.gameInfo}>
        <span style={{flex:1}}>🃏 <strong style={{color:"#f0f4f8"}}>{game.name}</strong></span>
        <span style={{background:"#1e3448",borderRadius:8,padding:"4px 12px",fontWeight:800,color:"#f0f4f8"}}>{t.roundLabel} <span style={{color:"#60a5fa"}}>{roundNum}</span></span>
        <span>{t.limitShort} <strong>{game.target} pts</strong></span>
      </div>
      {losers.length>0&&<div style={{...S.banner,background:"rgba(239,68,68,0.10)",borderColor:"#ef4444",color:"#f87171"}}>{t.losers(losers.map(p=>p.name).join(" & "),game.target)}</div>}
      <div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <p style={{...S.cardLabel,margin:0}}>{t.scoreLabel}</p>
          <button style={S.btnBreakdown} onClick={()=>setShowBreakdown(true)}>{t.breakdown}</button>
        </div>
        {sorted.map((p,i)=>{
          const sc=scores[p.id]||0;const pct=Math.min(100,(sc/game.target)*100);const isOver=sc>=game.target;
          return(<div key={p.id} style={S.scoreRow}><span style={{fontSize:20,width:32,textAlign:"center"}}>{showPodium?(i===0?"🏆":i===1?"🥈":i===2?"🥉":`#${i+1}`):`#${i+1}`}</span><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={S.playerName}>{p.name}{isOver?" 💀":""}</span><span style={{fontWeight:800,fontSize:16,color:isOver?"#ef4444":"#f0f4f8"}}>{sc}</span></div><div style={S.progressBg}><div style={{...S.progressFill,width:`${pct}%`,background:isOver?"#ef4444":pct>75?"#f59e0b":"#3b82f6"}}/></div></div></div>);
        })}
      </div>
      <div style={S.card}>
        <p style={S.cardLabel}>{t.loadRound}</p>
        <div style={S.roundGrid}>{gamePlayers.map(p=>(<div key={p.id} style={S.roundInput}><label style={S.roundLabel}>{p.name}</label><input type="number" style={S.input} value={inputs[p.id]??""} onChange={e=>setInputs(s=>({...s,[p.id]:e.target.value}))}/></div>))}</div>
        <button style={{...S.btnPrimary,width:"100%",marginTop:12}} onClick={saveRound}>{t.saveRound}</button>
      </div>
      <div style={S.card}>
        <p style={S.cardLabel}>{t.cutJust}</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {gamePlayers.map(p=>{
            const didCut=cutSet.has(p.id);const blocked=cutsThisRound.length>0&&!didCut;const disabled=didCut||blocked;
            return(<button key={p.id} style={{...S.btnCut,...(disabled?{opacity:0.3,cursor:"not-allowed"}:{})}} onClick={()=>onCutJust(p.id,disabled)} title={blocked?`${players.find(p2=>p2.id===whoCutId)?.name}`:""} >{blocked?"🔒":"✂️"} {p.name}</button>);
          })}
        </div>
        <p style={{margin:"8px 0 0",fontSize:11,color:"#4a6070"}}>{t.cutJustNote}</p>
      </div>
      <div style={{display:"flex",gap:10}}>
        {undoLabel&&<button style={{...S.btnSecondary,flex:1}} onClick={onUndo}>{undoLabel}</button>}
        <div style={{flex:2}}>
          {!confirmClose?<button style={{...S.btnClose,width:"100%"}} onClick={()=>setConfirmClose(true)}>{t.closeGame}</button>:
            <div style={{display:"flex",gap:8}}><button style={{...S.btnClose,flex:1}} onClick={onClose}>{t.confirmClose}</button><button style={{...S.btnSecondary,flex:1}} onClick={()=>setConfirmClose(false)}>{t.cancelClose}</button></div>}
        </div>
      </div>
      {showBreakdown&&<BreakdownModal game={game} players={players} onClose={()=>setShowBreakdown(false)}/>}
    </div>
  );
}

// ── Cell Modal ────────────────────────────────────────────────────────────────
function CellInputModal({combo,playerName,onSave,onClose}){
  const {t}=useLang();
  const lowerServedOptions = {
    escalera:[20,25],
    full:[30,35],
    poker:[40,45],
    generala:[50,60],
  };
  const lowerOptions = combo.sec==="lower" ? (lowerServedOptions[combo.id] || combo.fixed || [0]) : [];
  const [val,setVal]=useState(combo.sec==="upper"?0:lowerOptions[0]);
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modalBox,maxWidth:360}} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHeader}>
          <div><p style={{margin:0,fontSize:16,fontWeight:800,color:"#f0f4f8"}}>{combo.label} · {playerName}</p><p style={{margin:0,fontSize:12,color:"#7a9ab0"}}>{combo.hint}</p></div>
          <button style={S.modalClose} onClick={onClose}>✕</button>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:10}}>
          {combo.sec==="upper"?(
            <>
              <input type="number" style={{...S.input,fontSize:26,textAlign:"center",padding:14}} value={val} min={0} max={combo.max} onChange={e=>setVal(Math.min(combo.max,Math.max(0,Number(e.target.value))))} autoFocus/>
              <p style={{margin:0,fontSize:11,color:"#4a6070",textAlign:"center"}}>{t.modalRange(combo.max)}</p>
              <div style={{display:"flex",gap:8}}>
                <button style={{...S.btnPrimary,flex:2,fontSize:15,padding:14}} onClick={()=>onSave(val)}>{t.modalSave(val)}</button>
                <button style={{...S.btnDanger,flex:1,padding:12}} onClick={()=>onSave(0)}>{t.modalCross}</button>
              </div>
            </>
          ):(
            <>
              {lowerOptions.map(pts=>{
                const served = lowerOptions.length>1 && pts===Math.max(...lowerOptions);
                return(<button key={pts} style={{...S.btnPrimary,padding:16,fontSize:16,background:served?"linear-gradient(135deg,#78350f,#f59e0b)":"#2563eb"}} onClick={()=>onSave(pts)}>
                  {served?t.served:t.achieved} · <strong>{pts} pts</strong>
                </button>);
              })}
              <button style={{background:"transparent",color:"#6b7280",border:"1px solid #2a4052",borderRadius:8,padding:14,fontSize:14,cursor:"pointer"}} onClick={()=>onSave(0)}>{t.crossNo}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function renderGeneralaCell(game,p,combo,setCellModal){
  const v=game.scorecards[p.id][combo.id];
  const filled=v!==null;
  return(
    <td key={p.id} style={{...S.tdCell,cursor:"pointer"}} onClick={()=>setCellModal({playerId:p.id,comboId:combo.id,combo})}>
      {filled?<span style={{fontWeight:700,color:v===0?"#374151":"#10b981"}}>{v===0?"✗":v}</span>:<span style={{color:"#1e3448",fontSize:22}}>·</span>}
    </td>
  );
}

// ── Tab Active Generala ───────────────────────────────────────────────────────
function TabActiveGenerala({game,players,getScores,onFillCell,onUndo,onClose,GEN_COMBOS}){
  const {t}=useLang();
  const [cellModal,setCellModal]=useState(null);
  const [confirmClose,setConfirmClose]=useState(false);
  const [showBreakdown,setShowBreakdown]=useState(false);
  if(!game) return(<div style={S.tabContent}><h2 style={S.sectionTitle}>{t.active}</h2><div style={S.empty}>{t.noActive}</div></div>);
  const gp=game.playerIds.map(id=>players.find(p=>p.id===id)).filter(Boolean);
  const scores=getScores(game);
  const sorted=[...gp].sort((a,b)=>(scores[b.id]||0)-(scores[a.id]||0));
  const isComplete=gp.every(p=>GEN_COMBOS.every(c=>game.scorecards[p.id][c.id]!==null));
  const maxPossible=GEN_COMBOS.reduce((a,c)=>a+(c.sec==="upper"?c.max:Math.max(...(c.fixed||[0]))),0);
  const canUndo=game.events[game.events.length-1]?.type==="FILL_CELL";
  const filledTurns = game.events.filter(e=>e.type==="FILL_CELL").length;
  const showPodium = filledTurns > 1;
  return(
    <div style={S.tabContent}>
      <h2 style={S.sectionTitle}>{t.active}</h2>
      <div style={S.gameInfo}><span style={{flex:1}}>🎲 <strong style={{color:"#f0f4f8"}}>{game.name}</strong></span><span style={{color:"#4a6070",fontSize:12}}>{game.startedAt}</span></div>
      {isComplete&&<div style={{...S.banner,background:"rgba(245,158,11,0.10)",borderColor:"#f59e0b",color:"#fbbf24"}}>{t.completeMsg(sorted[0]?.name,scores[sorted[0]?.id])}</div>}
      <div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <p style={{...S.cardLabel,margin:0}}>{t.scoreLabelGen}</p>
          <button style={S.btnBreakdown} onClick={()=>setShowBreakdown(true)}>{t.breakdown}</button>
        </div>
        {sorted.map((p,i)=>{
          const sc=scores[p.id]||0,pct=Math.min(100,(sc/maxPossible)*100);
          const filled=GEN_COMBOS.filter(c=>game.scorecards[p.id][c.id]!==null).length;
          return(<div key={p.id} style={S.scoreRow}><span style={{fontSize:20,width:32,textAlign:"center"}}>{showPodium?(i===0?"🏆":i===1?"🥈":i===2?"🥉":`#${i+1}`):`#${i+1}`}</span><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={S.playerName}>{p.name} <span style={{color:"#4a6070",fontSize:11}}>{t.filledCount(filled,GEN_COMBOS.length)}</span></span><span style={{fontWeight:800,fontSize:16,color:"#fbbf24"}}>{sc}</span></div><div style={S.progressBg}><div style={{...S.progressFill,width:`${pct}%`,background:"linear-gradient(90deg,#b45309,#f59e0b)"}}/></div></div></div>);
        })}
      </div>
      <div style={S.card}>
        <p style={S.cardLabel}>{t.cartLabel}</p>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:110+gp.length*80}}>
            <thead><tr><th style={{...S.thCell,textAlign:"left",minWidth:110}}></th>{gp.map(p=><th key={p.id} style={{...S.thCell,minWidth:72}}>{p.name}</th>)}</tr></thead>
            <tbody>
              <tr><td colSpan={gp.length+1} style={S.secHeader}>{t.upperSec}</td></tr>
              {GEN_COMBOS.filter(c=>c.sec==="upper").map(combo=>(
                <tr key={combo.id}><td style={S.tdLabel}><span style={{fontWeight:600,color:"#d1d5db"}}>{combo.label}</span><span style={{display:"block",fontSize:10,color:"#4a6070"}}>{combo.hint}</span></td>
                  {gp.map(p=>renderGeneralaCell(game,p,combo,setCellModal))}
                </tr>
              ))}
              <tr style={{background:"rgba(255,255,255,0.015)"}}>
                <td style={{...S.tdLabel,color:"#7a9ab0",fontSize:11,fontStyle:"italic"}}>{t.subtotal}</td>
                {gp.map(p=>{const sub=GEN_COMBOS.filter(c=>c.sec==="upper").reduce((a,c)=>a+(game.scorecards[p.id][c.id]||0),0);return <td key={p.id} style={{...S.tdCell,color:"#a3b4c8",fontSize:12,fontWeight:700}}>{sub}</td>;})}
              </tr>
              <tr><td colSpan={gp.length+1} style={S.secHeader}>{t.lowerSec}</td></tr>
              {GEN_COMBOS.filter(c=>c.sec==="lower").map(combo=>(
                <tr key={combo.id}><td style={S.tdLabel}><span style={{fontWeight:600,color:"#d1d5db"}}>{combo.label}</span><span style={{display:"block",fontSize:10,color:"#4a6070"}}>{combo.hint}</span></td>
                  {gp.map(p=>renderGeneralaCell(game,p,combo,setCellModal))}
                </tr>
              ))}
              <tr style={{background:"rgba(245,158,11,0.06)"}}><td style={{...S.tdLabel,fontWeight:800,color:"#f0f4f8",fontSize:13,borderTop:"2px solid #2a3a1a"}}>{t.total}</td>{gp.map(p=><td key={p.id} style={{...S.tdCell,fontWeight:900,fontSize:17,color:"#fbbf24",borderTop:"2px solid #2a3a1a"}}>{scores[p.id]||0}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        {canUndo&&<button style={{...S.btnSecondary,flex:1}} onClick={onUndo}>{t.undoCell}</button>}
        <div style={{flex:2}}>
          {!confirmClose?<button style={{...S.btnClose,width:"100%"}} onClick={()=>setConfirmClose(true)}>{t.closeGame}</button>:
            <div style={{display:"flex",gap:8}}><button style={{...S.btnClose,flex:1}} onClick={onClose}>{t.confirmClose}</button><button style={{...S.btnSecondary,flex:1}} onClick={()=>setConfirmClose(false)}>{t.cancelClose}</button></div>}
        </div>
      </div>
      {cellModal&&<CellInputModal combo={cellModal.combo} playerName={players.find(p=>p.id===cellModal.playerId)?.name} onSave={v=>{onFillCell(cellModal.playerId,cellModal.comboId,v);setCellModal(null);}} onClose={()=>setCellModal(null)}/>}
      {showBreakdown&&<BreakdownModalGenerala game={game} players={players} GEN_COMBOS={GEN_COMBOS} onClose={()=>setShowBreakdown(false)}/>}
    </div>
  );
}



function BreakdownModalGenerala({game,players,GEN_COMBOS,onClose}){
  const {t}=useLang();
  const gp=game.playerIds.map(id=>players.find(p=>p.id===id)).filter(Boolean);
  const rows=game.events.filter(e=>e.type==="FILL_CELL");
  const running={}; gp.forEach(p=>running[p.id]=0);
  const enriched=rows.map((e,i)=>{
    const prev=e.prevValue??0; const val=e.value??0;
    running[e.playerId]=(running[e.playerId]||0)-prev+val;
    return { ...e, label:`${t.roundLabel} ${i+1}`, combo:GEN_COMBOS.find(c=>c.id===e.comboId)?.label||e.comboId, snap:{...running}, delta:val-prev };
  });
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHeader}>
          <div><p style={{margin:0,fontSize:16,fontWeight:800,color:"#f0f4f8"}}>{t.bdBreakdown}</p><p style={{margin:0,fontSize:11,color:"#7a9ab0"}}>{game.name}</p></div>
          <button style={S.modalClose} onClick={onClose}>✕</button>
        </div>
        <div style={S.modalBody}>
          {enriched.length===0&&<p style={{color:"#4a6070",textAlign:"center",padding:"24px 0"}}>{t.bdNoEvents}</p>}
          {enriched.map((r,ri)=>(
            <div key={r.id} style={{...S.bdRoundBlock,background:ri%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
              <div style={{...S.bdRow,justifyContent:"space-between"}}>
                <span style={{...S.bdLabelCell,flex:2.5}}>{r.label} · {players.find(p=>p.id===r.playerId)?.name} · {r.combo}</span>
                <span style={{fontWeight:800,color:r.delta>=0?"#10b981":"#f87171"}}>{r.delta>=0?`+${r.delta}`:r.delta}</span>
              </div>
              <div style={{...S.bdRow,paddingBottom:6,borderBottom:"1px solid #172030"}}>
                <span style={{...S.bdLabelCell,color:"#3a5068",fontSize:11}}>{t.bdAccum}</span>
                {gp.map(p=><span key={p.id} style={S.bdDataCell}><span style={{fontWeight:800,fontSize:14,color:"#fbbf24"}}>{r.snap[p.id]||0}</span></span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab History ───────────────────────────────────────────────────────────────

function TabHistory({games,players,getScores,gameType,GEN_COMBOS}){
  const {t}=useLang(); const [open,setOpen]=useState(null);
  const sorted=[...games].sort((a,b)=>b.startedAt<a.startedAt?-1:1);
  const isGen=gameType?.id==="generala";
  if(!sorted.length) return <div style={S.tabContent}><h2 style={S.sectionTitle}>{t.history}</h2><div style={S.empty}>{t.noHistory}</div></div>;
  return(
    <div style={S.tabContent}>
      <h2 style={S.sectionTitle}>{t.history}</h2>
      {sorted.map(game=>{
        const gp=game.playerIds.map(id=>players.find(p=>p.id===id)).filter(Boolean);
        const sc=getScores(game),isOpen=open===game.id;
        const sortedGp=[...gp].sort((a,b)=>gameType?.winMode==="highest"?(sc[b.id]||0)-(sc[a.id]||0):(sc[a.id]||0)-(sc[b.id]||0));
        return(
          <div key={game.id} style={S.card}>
            <div style={{display:"flex",justifyContent:"space-between",cursor:"pointer"}} onClick={()=>setOpen(isOpen?null:game.id)}>
              <div><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",marginRight:8,background:game.status==="ACTIVE"?"#10b981":"#4b5563"}}/><strong style={{color:"#f0f4f8"}}>{game.name}</strong><span style={S.meta}>{game.endedAt?` → ${game.endedAt}`:""}</span></div>
              <span style={{color:"#a3b4c8"}}>{isOpen?"▲":"▼"}</span>
            </div>
            {isOpen&&(
              <div style={{marginTop:12}}>
                <p style={S.cardLabel}>{t.result}</p>
                {sortedGp.map((p,i)=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #1e3448"}}><span style={S.playerName}>{i===0?"🏆 ":""}{p.name}</span><span style={{color:isGen?"#fbbf24":"#10b981",fontWeight:700}}>{sc[p.id]||0} pts</span></div>))}
                {isGen&&game.scorecards&&(
                  <>
                    <p style={{...S.cardLabel,marginTop:14}}>{t.finalCard}</p>
                    <div style={{overflowX:"auto"}}>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                        <thead><tr><th style={{...S.thCell,textAlign:"left",fontSize:11}}></th>{gp.map(p=><th key={p.id} style={{...S.thCell,fontSize:11}}>{p.name}</th>)}</tr></thead>
                        <tbody>{GEN_COMBOS.map(c=>(<tr key={c.id}><td style={{...S.tdLabel,fontSize:11}}>{c.label}</td>{gp.map(p=>{const v=game.scorecards[p.id]?.[c.id];return <td key={p.id} style={S.tdCell}><span style={{color:v===null?"#2a4052":v===0?"#4a6070":"#f0f4f8",fontWeight:v>0?700:400}}>{v===null?"—":v===0?"✗":v}</span></td>;})}</tr>))}</tbody>
                      </table>
                    </div>
                  </>
                )}
                {!isGen&&game.events.length>0&&(
                  <>
                    <p style={{...S.cardLabel,marginTop:14}}>{t.events}</p>
                    {game.events.map(e=>{const pl=e.playerId?players.find(p=>p.id===e.playerId):null;return(<div key={e.id} style={{display:"flex",gap:10,fontSize:12,padding:"5px 0",borderBottom:"1px solid #1a2a38",color:"#a3b4c8"}}><span style={{flex:2}}>{e.type}</span><span style={{flex:1.5,color:"#f0f4f8"}}>{pl?.name||"—"}</span><span style={{color:e.value<0?"#f87171":e.value>0?"#10b981":"#a3b4c8"}}>{e.value>0?"+":""}{e.value||"—"}</span><span style={{flex:2,textAlign:"right",color:"#4a6070"}}>{e.ts}</span></div>);})}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab Ranking ───────────────────────────────────────────────────────────────
function TabRanking({ranking,gameType}){
  const {t}=useLang(); const isH=gameType?.winMode==="highest";
  return(
    <div style={S.tabContent}>
      <h2 style={S.sectionTitle}>{t.ranking}</h2>
      {ranking.length===0?<div style={S.empty}>{t.noRanking}</div>:
        <div style={S.card}>
          <p style={{...S.cardLabel,marginBottom:4}}>{isH?t.rankingNote_high:t.rankingNote_low}</p>
          <div style={{display:"flex",gap:8,padding:"8px 12px",borderBottom:"1px solid #1e3448",fontSize:11,fontWeight:700,color:"#7a9ab0",textTransform:"uppercase"}}>
            <span style={{flex:2}}>{t.colPlayer}</span>
            {[t.colGames,t.colWins,t.colWinPct,t.colAvg].map(h=><span key={h} style={{flex:1,textAlign:"center"}}>{h}</span>)}
          </div>
          {ranking.map((r,i)=>(
            <div key={r.name} style={{display:"flex",gap:8,padding:"12px",borderBottom:"1px solid #1e3448",alignItems:"center",background:i===0?"rgba(251,191,36,0.07)":"transparent"}}>
              <span style={{flex:2,display:"flex",alignItems:"center",gap:8}}><span>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</span><span style={S.playerName}>{r.name}</span></span>
              <span style={{flex:1,textAlign:"center",color:"#a3b4c8"}}>{r.played}</span>
              <span style={{flex:1,textAlign:"center",color:"#10b981",fontWeight:700}}>{r.wins}</span>
              <span style={{flex:1,textAlign:"center",color:"#3b82f6"}}>{r.winRate}%</span>
              <span style={{flex:1,textAlign:"center",color:"#a3b4c8"}}>{r.avg}</span>
            </div>
          ))}
        </div>
      }
      {pendingDeactivate&&<div style={S.overlay} onClick={()=>setPendingDeactivate(null)}><div style={{...S.modalBox,maxWidth:460}} onClick={e=>e.stopPropagation()}><div style={S.modalHeader}><div><p style={{margin:0,fontSize:16,fontWeight:800,color:"#f0f4f8"}}>Confirmar baja</p><p style={{margin:0,fontSize:12,color:"#7a9ab0"}}>{pendingDeactivate.player.name}</p></div><button style={S.modalClose} onClick={()=>setPendingDeactivate(null)}>✕</button></div><div style={{padding:18,display:"flex",flexDirection:"column",gap:12}}><p style={{margin:0,color:"#a3b4c8",lineHeight:1.5}}>¿Seguro que querés dar de baja este jugador?</p>{pendingDeactivate.linkedGames>0&&<p style={{margin:0,color:"#fbbf24",fontSize:13,lineHeight:1.5}}>Aparece en {pendingDeactivate.linkedGames} partida{pendingDeactivate.linkedGames!==1?"s":""}. El historial y ranking se conservan.</p>}<div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button style={S.btnSecondary} onClick={()=>setPendingDeactivate(null)}>{t.cancelClose}</button><button style={S.btnClose} onClick={confirmDeactivate}>Confirmar</button></div></div></div></div>}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  app:          {minHeight:"100dvh",background:"#0d1117",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",color:"#f0f4f8",width:"100%",overflowX:"hidden"},
  loading:      {display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100dvh",background:"#0d1117",width:"100%"},
  spinner:      {width:40,height:40,border:"3px solid #1e2d3d",borderTop:"3px solid #3b82f6",borderRadius:"50%",animation:"spin 0.8s linear infinite"},
  homeHero:     {position:"relative",background:"radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%), linear-gradient(180deg,#0f1923 0%,#0d1117 100%)",padding:"48px 24px 24px",textAlign:"center",borderBottom:"1px solid #1e3448"},
  homeBadge:    {display:"inline-block",fontSize:10,fontWeight:800,letterSpacing:3,color:"#3b82f6",background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:6,padding:"4px 12px",marginBottom:16},
  homeTitle:    {margin:"0 0 12px",fontSize:34,fontWeight:900,letterSpacing:"-1px",lineHeight:1.15,color:"#f0f4f8"},
  homeSubtitle: {margin:0,fontSize:14,color:"#4a6070"},
  gameCard:     {display:"flex",alignItems:"center",gap:16,padding:"20px",borderRadius:16,border:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",textAlign:"left",animation:"fadeUp 0.4s ease both",boxShadow:"0 4px 24px rgba(0,0,0,0.3)"},
  gameCardIcon: {fontSize:44,flexShrink:0,width:64,textAlign:"center"},
  gameCardPlaceholder:{display:"flex",alignItems:"center",gap:16,padding:"16px 20px",borderRadius:12,border:"1px dashed #1e3448"},
  header:       {borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"16px 20px"},
  headerInner:  {display:"flex",alignItems:"center",gap:14,maxWidth:760,margin:"0 auto"},
  title:        {margin:0,fontSize:20,fontWeight:800,letterSpacing:"-0.5px",color:"#fff"},
  subtitle:     {margin:0,fontSize:11,color:"rgba(255,255,255,0.55)",marginTop:2},
  backBtn:      {background:"rgba(0,0,0,0.25)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,width:36,height:36,fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,lineHeight:1},
  nav:          {display:"flex",gap:2,padding:"8px 14px",background:"#10181f",borderBottom:"1px solid #1e3448",overflowX:"auto"},
  tabBtn:       {display:"flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:8,border:"none",background:"transparent",color:"#7a9ab0",cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap",position:"relative"},
  tabActive:    {background:"#1e3448",color:"#f0f4f8"},
  tabLabel:     {},
  badge:        {color:"#10b981",fontSize:9,position:"absolute",top:3,right:3},
  main:         {maxWidth:760,margin:"0 auto",padding:"18px 16px"},
  tabContent:   {display:"flex",flexDirection:"column",gap:16},
  sectionTitle: {margin:0,fontSize:20,fontWeight:700},
  card:         {background:"#10181f",border:"1px solid #1e3448",borderRadius:12,padding:18},
  cardLabel:    {margin:"0 0 12px 0",fontSize:11,fontWeight:700,color:"#7a9ab0",textTransform:"uppercase",letterSpacing:1},
  row:          {display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"},
  input:        {background:"#0d1117",border:"1px solid #1e3448",borderRadius:8,color:"#f0f4f8",padding:"10px 14px",fontSize:16,flex:1,outline:"none",minWidth:0},
  btnPrimary:   {background:"#2563eb",color:"#fff",border:"none",borderRadius:8,padding:"10px 18px",fontWeight:700,fontSize:14,cursor:"pointer"},
  btnSecondary: {background:"#1e3448",color:"#a3b4c8",border:"none",borderRadius:8,padding:"10px 18px",fontWeight:600,fontSize:14,cursor:"pointer"},
  btnDanger:    {background:"transparent",color:"#f87171",border:"1px solid #f87171",borderRadius:6,padding:"6px 12px",fontSize:12,cursor:"pointer"},
  btnCut:       {background:"#1e2d3d",color:"#fbbf24",border:"1px solid #92400e",borderRadius:8,padding:"8px 14px",fontWeight:700,fontSize:13,cursor:"pointer"},
  btnClose:     {background:"#7f1d1d",color:"#fecaca",border:"none",borderRadius:8,padding:"10px 18px",fontWeight:700,fontSize:14,cursor:"pointer"},
  btnBreakdown: {background:"transparent",color:"#a78bfa",border:"1px solid #4c1d95",borderRadius:8,padding:"6px 14px",fontWeight:700,fontSize:12,cursor:"pointer"},
  playerRow:    {display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #1e3448"},
  playerName:   {fontWeight:600,color:"#f0f4f8"},
  meta:         {fontSize:12,color:"#7a9ab0"},
  selectRow:    {display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:8,cursor:"pointer",border:"1px solid transparent",marginBottom:4},
  selectRowActive:{background:"#0f2d4a",border:"1px solid #2563eb"},
  chip:         {background:"#1e3448",color:"#a3b4c8",border:"1px solid #2a4a60",borderRadius:6,padding:"6px 12px",fontSize:13,cursor:"pointer"},
  chipActive:   {background:"#2563eb",color:"#fff",border:"1px solid #2563eb"},
  gameInfo:     {display:"flex",gap:14,flexWrap:"wrap",alignItems:"center",background:"#10181f",border:"1px solid #1e3448",borderRadius:10,padding:"12px 18px",fontSize:13,color:"#a3b4c8"},
  banner:       {borderWidth:1,borderStyle:"solid",borderRadius:10,padding:"12px 18px",fontWeight:600,fontSize:14},
  scoreRow:     {display:"flex",alignItems:"center",gap:12,padding:"8px 0"},
  progressBg:   {height:6,background:"#1e3448",borderRadius:99},
  progressFill: {height:6,borderRadius:99,transition:"width 0.4s ease"},
  roundGrid:    {display:"flex",gap:12,flexWrap:"wrap"},
  roundInput:   {display:"flex",flexDirection:"column",gap:6,flex:"1 1 110px"},
  roundLabel:   {fontSize:12,fontWeight:700,color:"#7a9ab0"},
  empty:        {background:"#10181f",border:"1px dashed #1e3448",borderRadius:12,padding:32,textAlign:"center",color:"#4a6070"},
  toast:        {position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",color:"#fff",padding:"12px 24px",borderRadius:10,fontWeight:700,fontSize:14,zIndex:999,boxShadow:"0 4px 20px rgba(0,0,0,0.4)",whiteSpace:"nowrap"},
  thCell:       {padding:"8px 10px",background:"#0d1117",color:"#7a9ab0",fontSize:12,fontWeight:700,textAlign:"center",borderBottom:"2px solid #1e3448"},
  tdLabel:      {padding:"8px 10px",borderBottom:"1px solid #1a2a38",color:"#a3b4c8",fontSize:12,minWidth:90},
  tdCell:       {padding:"8px 10px",borderBottom:"1px solid #1a2a38",textAlign:"center",fontSize:14},
  secHeader:    {padding:"10px 10px 6px",fontSize:10,fontWeight:800,color:"#3b82f6",letterSpacing:2,textTransform:"uppercase",background:"rgba(59,130,246,0.04)",borderBottom:"1px solid #1e3448"},
  overlay:      {position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16},
  modalBox:     {background:"#10181f",border:"1px solid #1e3448",borderRadius:16,width:"100%",maxWidth:700,maxHeight:"88vh",display:"flex",flexDirection:"column",overflow:"hidden"},
  modalHeader:  {display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"1px solid #1e3448",flexShrink:0},
  modalClose:   {background:"transparent",border:"none",color:"#7a9ab0",fontSize:20,cursor:"pointer"},
  modalBody:    {overflowY:"auto",padding:"16px 20px",flex:1},
  bdHeaderRow:  {display:"flex",gap:8,padding:"6px 4px 10px",borderBottom:"1px solid #1e3448",marginBottom:4},
  bdRow:        {display:"flex",gap:8,padding:"4px 4px",alignItems:"center"},
  bdLabelCell:  {flex:1.5,fontSize:12,color:"#7a9ab0"},
  bdDataCell:   {flex:1,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"},
  bdRoundBlock: {borderRadius:6,padding:"6px 2px",marginBottom:4},
};
