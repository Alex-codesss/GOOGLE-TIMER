const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const point=(angle,r)=>({x:320+r*Math.sin(angle),y:320-r*Math.cos(angle)});
for(let i=0;i<60;i++){const a=i*Math.PI/30,p=point(a,i%5?246:240),q=point(a,255),line=document.createElementNS(NS,'line');for(const[k,v]of Object.entries({x1:p.x,y1:p.y,x2:q.x,y2:q.y,class:`tick ${i%5?'':'major'}`}))line.setAttribute(k,v);$('ticks').append(line);if(i%5===0){const t=document.createElementNS(NS,'text'),p=point(a,286);t.setAttribute('x',p.x);t.setAttribute('y',p.y);t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');t.textContent=i;$('numbers').append(t)}}
const isLocked=()=>window.isScreenLocked?.()===true;
let duration=25*60,remaining=duration,running=false,end=0,completed=false,audioCtx,wakeLock,dragging=false,finishAcknowledged=false;
let pomodoroMode=false,pomoPhase='focus',pomoCycle=1;
let soundType='chime';
const blinkSeconds=()=>[5,10,15,30,60].includes(Number($('blink-seconds').value))?Number($('blink-seconds').value):10;
const isBlinking=()=>completed&&$('visual').checked&&!finishAcknowledged&&Date.now()<end+blinkSeconds()*1000;
const viewOptions=['auto-lock','keep-screen','show-digits','show-dial-numbers'];
const colors=[
  {name:'클래식 코랄',accent:'#f46e58',sector:'#f47760',soft:'#f9dfd6'},
  {name:'구글 레드',accent:'#ea4335',sector:'#ea4335',soft:'#fce8e6'},
  {name:'포레스트 그린',accent:'#34a853',sector:'#34a853',soft:'#e6f4ea'},
  {name:'스카이 블루',accent:'#4285f4',sector:'#4285f4',soft:'#e8f0fe'},
  {name:'앰버 골드',accent:'#fbbc04',sector:'#fbbc04',soft:'#fef7e0'},
  {name:'미드나잇 퍼플',accent:'#9c27b0',sector:'#ab47bc',soft:'#f3e5f5'}
];
let colorIndex=0;

function getTodayStr(){const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function loadStats(){try{const s=JSON.parse(localStorage.getItem('focus-dial-stats')||'{}');const today=getTodayStr();if(s.date===today)return{date:today,minutes:Number(s.minutes)||0,count:Number(s.count)||0};return{date:today,minutes:0,count:0}}catch{return{date:getTodayStr(),minutes:0,count:0}}}
function saveStats(stats){try{localStorage.setItem('focus-dial-stats',JSON.stringify(stats))}catch{}}
function updateStatsUI(){const s=loadStats();const text=`오늘 ${s.minutes}분 집중 (${s.count}회 완료)`;$('stats-summary').textContent=text;if($('stats-detail'))$('stats-detail').textContent=text}
function recordCompletedSession(mins){if(mins<=0)return;const s=loadStats();s.minutes+=mins;s.count+=1;saveStats(s);updateStatsUI()}

function persist(){try{localStorage.setItem('focus-dial',JSON.stringify({duration,remaining,running,end,completed,task:$('task').value,sound:$('sound').checked,awake:$('awake').checked,visual:$('visual').checked,blinkSeconds:blinkSeconds(),dark:document.body.classList.contains('dark'),colorIndex,soundType,pomodoroMode,pomoPhase,pomoCycle,view:Object.fromEntries(viewOptions.map(id=>[id,$(id).checked]))}))}catch{}}
function applyColor(){const c=colors[colorIndex];document.documentElement.style.setProperty('--accent',c.accent);document.documentElement.style.setProperty('--sector',c.sector);document.documentElement.style.setProperty('--soft',document.body.classList.contains('dark')?`${c.accent}30`:c.soft);$('color-name').textContent=c.name;if($('color-picker'))$('color-picker').value=String(colorIndex)}
function render(){const seconds=Math.ceil(remaining);$('time').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;document.title=running?`${$('time').textContent} · 집중 다이얼`:'집중 다이얼';const fraction=Math.min(1,remaining/3600),a=fraction*2*Math.PI,p=point(a,258);$('sector').setAttribute('d',fraction>=.999999?'M320 62 A258 258 0 1 1 319.999 62 L320 320 Z':fraction>0?`M320 320 L320 62 A258 258 0 ${fraction>.5?1:0} 1 ${p.x} ${p.y} Z`:'');const h=point(a,238);$('hand').setAttribute('x2',h.x);$('hand').setAttribute('y2',h.y);$('dial').setAttribute('aria-valuenow',Math.round(remaining/60));$('dial').setAttribute('aria-valuetext',`${Math.floor(seconds/60)}분 ${seconds%60}초 남음`);
const isBreak=pomodoroMode&&pomoPhase==='break';document.body.classList.toggle('pomo-break',isBreak);
if(pomodoroMode){$('pomo-badge').hidden=false;$('pomo-badge').textContent=isBreak?`☕ ${pomoCycle}/4 휴식`:`🍅 ${pomoCycle}/4 집중`}else{$('pomo-badge').hidden=true}
$('start-label').textContent=running?'잠시 멈춤':completed?(pomodoroMode?(isBreak?'집중 시작':'휴식 시작'):'다시 시작'):remaining<duration?'이어서 집중':(isBreak?'휴식 시작':'집중 시작');$('play-icon').textContent=running?'Ⅱ':'▶';
$('status').textContent=running?(isBreak?'편안히 쉬어가요':'집중하고 있어요'):completed?(isBreak?'휴식이 끝났어요, 다시 시작할까요?':'잘했어요, 잠깐 쉬어가요'):remaining<duration?'잠시 쉬어가는 중':'나만의 집중 시간';
$('remaining').textContent=running?(isBreak?'마음 편히 재충전하는 시간이에요':'지금 하고 있는 일에만 집중해요'):completed?(isBreak?'새로운 집중 준비가 완료되었어요':'오늘의 작은 집중을 완성했어요'):remaining<duration?'준비되면 이어서 시작하세요':`${duration/60}분의 여유, 지금 시작해요`;
$('dial').setAttribute('aria-disabled',running);document.body.classList.toggle('running',running);document.body.classList.toggle('finished',isBlinking());document.body.classList.toggle('hide-digits',(running||completed)&&!$('show-digits').checked);document.body.classList.toggle('hide-dial-numbers',(running||completed)&&!$('show-dial-numbers').checked);document.querySelectorAll('[data-min]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.min)*60===duration));window.dispatchEvent(new CustomEvent('timerstate',{detail:{running,completed}}))}

function initAudio(){try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume().catch(()=>{})}catch{}}
function chime(){
  initAudio();if(!audioCtx)return;const now=audioCtx.currentTime;
  if(soundType==='bell'){
    [432,864,1296].forEach((f,idx)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.setValueAtTime(f,now);const vol=0.22/(idx+1);g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(vol,now+0.03);g.gain.exponentialRampToValueAtTime(0.0008,now+2.4);o.connect(g);g.connect(audioCtx.destination);o.start(now);o.stop(now+2.5)});
  }else if(soundType==='wood'){
    [0,0.22].forEach((offset,idx)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t=now+offset;o.type='triangle';o.frequency.setValueAtTime(idx===0?760:640,t);o.frequency.exponentialRampToValueAtTime(320,t+0.12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.28,t+0.008);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+0.16)});
  }else if(soundType==='digital'){
    [0,0.18].forEach(offset=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t=now+offset;o.type='square';o.frequency.setValueAtTime(1046.5,t);g.gain.setValueAtTime(0.12,t);g.gain.setValueAtTime(0,t+0.09);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+0.1)});
  }else{
    [523.25,659.25,783.99].forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t=now+i*0.22;o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.18,t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+0.8);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+0.85)});
  }
}

async function syncWake(){if((!running&&!isBlinking())||!$('awake').checked||document.hidden){if(wakeLock){await wakeLock.release().catch(()=>{});wakeLock=null}return}if(!('wakeLock'in navigator)){ $('notice').textContent='이 브라우저에서는 화면 자동 꺼짐 설정을 직접 조절해 주세요.';return}try{if(!wakeLock)wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',()=>{wakeLock=null},{once:true})}catch{$('notice').textContent='화면 켜짐 유지가 제한되어 있어요. 기기 설정을 확인해 주세요.'}}
function tick(){if(!running){if(document.body.classList.contains('finished')){render();if(!isBlinking())syncWake()}return;}remaining=Math.max(0,(end-Date.now())/1000);if(remaining<=0){running=false;completed=true;if($('sound').checked)chime();if(pomodoroMode){if(pomoPhase==='focus'){recordCompletedSession(Math.round(duration/60));pomoPhase='break';duration=5*60;remaining=duration;$('notice').textContent='집중 완료! 5분간 편안히 휴식하세요.'}else{pomoPhase='focus';pomoCycle=(pomoCycle%4)+1;duration=25*60;remaining=duration;$('notice').textContent=pomoCycle===1?'4세트 완주 축하합니다! 새로운 세션을 시작해요.':`${pomoCycle}회차 집중을 시작할 준비가 되었어요.`}}else{recordCompletedSession(Math.round(duration/60));$('notice').textContent='집중 시간이 끝났어요. 수고했어요!'}persist();syncWake()}render()}
function setMinutes(minutes){if(isLocked())return;if(running){$('notice').textContent='시간을 바꾸려면 먼저 잠시 멈춰 주세요.';return}duration=Math.max(1,Math.min(60,Math.round(minutes)))*60;remaining=duration;completed=false;finishAcknowledged=false;$('notice').textContent='';render();persist()}
$('start').onclick=()=>{if(isLocked())return;initAudio();if(running){remaining=Math.max(0,(end-Date.now())/1000);running=false}else{if(completed||remaining<=0){remaining=duration;completed=false}finishAcknowledged=false;end=Date.now()+remaining*1000;running=true}$('notice').textContent='';render();persist();syncWake()};
$('reset').onclick=()=>{if(isLocked())return;running=false;if(pomodoroMode){pomoPhase='focus';duration=25*60}remaining=duration;completed=false;finishAcknowledged=false;$('notice').textContent='처음 설정한 시간으로 돌아왔어요.';render();persist();syncWake()};
document.querySelectorAll('[data-min]').forEach(b=>b.onclick=()=>setMinutes(Number(b.dataset.min)));
function pointerMinutes(e){const rect=$('dial').getBoundingClientRect();let a=Math.atan2(e.clientX-rect.left-rect.width/2,-(e.clientY-rect.top-rect.height/2));if(a<0)a+=2*Math.PI;return Math.max(1,Math.round(a/(2*Math.PI)*60))}
$('dial').addEventListener('pointerdown',e=>{if(isLocked())return;if(running){$('notice').textContent='시간을 바꾸려면 먼저 잠시 멈춰 주세요.';return}dragging=true;$('dial').setPointerCapture(e.pointerId);setMinutes(pointerMinutes(e))});$('dial').addEventListener('pointermove',e=>{if(dragging)setMinutes(pointerMinutes(e))});for(const ev of['pointerup','pointercancel'])$('dial').addEventListener(ev,()=>dragging=false);
$('dial').addEventListener('keydown',e=>{if(isLocked())return;const steps={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1};if(e.key in steps){e.preventDefault();setMinutes(duration/60+steps[e.key])}if(e.key==='Home'){e.preventDefault();setMinutes(1)}if(e.key==='End'){e.preventDefault();setMinutes(60)}});
$('theme').onclick=()=>{document.body.classList.toggle('dark');applyColor();persist()};
$('color').onclick=()=>{colorIndex=(colorIndex+1)%colors.length;applyColor();persist()};
if($('color-picker'))$('color-picker').onchange=e=>{colorIndex=Number(e.target.value)%colors.length;applyColor();persist()};
if($('sound-type'))$('sound-type').onchange=e=>{soundType=e.target.value;persist()};
if($('pomodoro-mode'))$('pomodoro-mode').onchange=e=>{pomodoroMode=e.target.checked;if(pomodoroMode&&!running){pomoPhase='focus';duration=25*60;remaining=duration}render();persist()};
if($('reset-stats'))$('reset-stats').onclick=()=>{saveStats({date:getTodayStr(),minutes:0,count:0});updateStatsUI();$('notice').textContent='오늘의 집중 통계가 초기화되었습니다.'};
$('settings').onclick=()=>$('settings-dialog').showModal();$('test-sound').onclick=chime;
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{$('notice').textContent='이 환경에서는 전체 화면을 사용할 수 없어요.'}};

const downloadDialog=$('download-dialog');
if($('download-app')&&downloadDialog)$('download-app').onclick=()=>downloadDialog.showModal();
if($('download-close')&&downloadDialog)$('download-close').onclick=()=>downloadDialog.close();
if($('open-download-from-settings')&&downloadDialog)$('open-download-from-settings').onclick=()=>{$('settings-dialog').close();downloadDialog.showModal();};

let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;});
if($('pwa-install-btn'))$('pwa-install-btn').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();const{outcome}=await deferredPrompt.userChoice;if(outcome==='accepted')deferredPrompt=null}else{alert('브라우저 메뉴에서 [홈 화면에 추가] 또는 주소창의 설치 아이콘을 눌러주세요.')}};
if(window.NativeTimer&&$('download-app'))$('download-app').hidden=true;

for(const id of['sound','awake','visual','blink-seconds',...viewOptions])$(id).onchange=()=>{if(id==='visual')finishAcknowledged=false;persist();render();syncWake()};$('task').oninput=persist;
document.addEventListener('visibilitychange',()=>{tick();syncWake()});window.addEventListener('pagehide',persist);
try{const s=JSON.parse(localStorage.getItem('focus-dial'));if(s&&Number.isFinite(s.duration)&&s.duration>=60&&s.duration<=3600){duration=s.duration;remaining=Math.max(0,Math.min(duration,Number(s.remaining)||0));running=!!s.running&&Number.isFinite(s.end);end=s.end;completed=!!s.completed;if([5,10,15,30,60].includes(s.blinkSeconds))$('blink-seconds').value=String(s.blinkSeconds);$('task').value=s.task||'';for(const id of['sound','awake','visual'])if(typeof s[id]==='boolean')$(id).checked=s[id];for(const id of viewOptions)if(typeof s.view?.[id]==='boolean')$(id).checked=s.view[id];document.body.classList.toggle('dark',!!s.dark);colorIndex=Number.isInteger(s.colorIndex)?Math.abs(s.colorIndex)%colors.length:0;if(['chime','bell','wood','digital'].includes(s.soundType)){soundType=s.soundType;if($('sound-type'))$('sound-type').value=soundType}if(typeof s.pomodoroMode==='boolean'){pomodoroMode=s.pomodoroMode;if($('pomodoro-mode'))$('pomodoro-mode').checked=pomodoroMode}if(['focus','break'].includes(s.pomoPhase))pomoPhase=s.pomoPhase;if(Number.isInteger(s.pomoCycle))pomoCycle=Math.max(1,Math.min(4,s.pomoCycle))}}catch{}
document.addEventListener('pointerdown',()=>{if(completed&&!finishAcknowledged){finishAcknowledged=true;render()}},{capture:true});
function clock(){ $('clock').textContent=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(completed&&end?end:Date.now()))}applyColor();updateStatsUI();tick();render();clock();syncWake();setInterval(tick,200);setInterval(clock,10000);
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
