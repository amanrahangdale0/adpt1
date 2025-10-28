const CHAT_KEY = "adpt_chat_v1";
const GOALS_KEY = "adpt_goals_v1";
const SCHEDULE_KEY = "adpt_schedule_v1";

export function saveChatLocal(messages){ try{ localStorage.setItem(CHAT_KEY, JSON.stringify(messages)); }catch{} }
export function loadChatLocal(){ try{ return JSON.parse(localStorage.getItem(CHAT_KEY) || "[]"); }catch{ return []; } }

export function saveGoalsLocal(goals){ try{ localStorage.setItem(GOALS_KEY, JSON.stringify(goals)); }catch{} }
export function loadGoalsLocal(){ try{ return JSON.parse(localStorage.getItem(GOALS_KEY) || "[]"); }catch{ return []; } }

export function saveScheduleLocal(schedule){ try{ localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule)); }catch{} }
export function loadScheduleLocal(){ try{ return JSON.parse(localStorage.getItem(SCHEDULE_KEY) || "[]"); }catch{ return []; } }
