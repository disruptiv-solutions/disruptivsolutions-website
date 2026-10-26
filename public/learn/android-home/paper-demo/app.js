const $=id=>document.getElementById(id);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
let storageWarning=false;
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{storageWarning=true;toast('Storage is full. This change could not be saved.');return false}}
const initialDue=new Date();initialDue.setHours(16,30,0,0);
let task=read('lesson-paper-ink-task',{title:'',due:null,done:false});
let captures=read('lesson-paper-ink-captures',[]), minutes=581,playing=false,live=false,last=performance.now(),lastPaint=0;
let recorder=null,stream=null,chunks=[],voiceData=null,recording=false,recordTimer=null,recordStart=0;
const fmt=t=>`${String(Math.floor(t/60)%24).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3200)}
function referenceTime(){const d=new Date();if(!live)d.setHours(Math.floor(minutes/60),Math.floor(minutes%60),0,0);return d}
function renderTime(){
 const d=referenceTime(),t=live?d.getHours()*60+d.getMinutes():minutes;
 $('clock').textContent=fmt(t);$('statusTime').textContent=fmt(t);$('previewTime').textContent=fmt(t);$('timeRange').value=Math.floor(t);
 $('date').textContent=d.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'}).replace(',','').replace(/ (\w+) (\d+)$/,', $1 $2').toUpperCase();
 const night=t<360||t>=1140;$('screen').classList.toggle('night',night);
 $('greeting').textContent=`${t<360?'Rest easy':t<720?'Morning':t<1020?'Afternoon':t<1260?'Evening':'Rest easy'}, Ian.`;
 const phase=night?((t+300)%1440)/600:(t-360)/780;
 // The orbital path stays in the illustrated right-hand sky, away from the clock.
 const x=-48+104*Math.min(1,Math.max(0,phase)),y=70-100*Math.sin(Math.PI*Math.min(1,Math.max(0,phase)));
 $('orb').style.transform=`translate(${x}px, ${y}px)`;
 const due=task.due?new Date(task.due):null,urgent=due&&!task.done&&due-d<3*3600000&&due-d>=0;
 $('orb').style.background=night?'':urgent?'#a92e21':'';
 renderDeadline(d);
}
function renderDeadline(now=referenceTime()){
 if(!task.title){$('deadline').textContent='';return}
 if(task.done){$('deadline').textContent='FINISHED. MAKE A LITTLE ROOM.';return}
 if(!task.due){$('deadline').textContent='NO DEADLINE. JUST INTENTION.';return}
 const due=new Date(task.due),diff=due-now;
 const today=due.toDateString()===now.toDateString();
 const day=today?'TODAY':due.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}).toUpperCase();
 const time=due.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
 const amount=Math.abs(diff),hours=Math.floor(amount/3600000),mins=Math.max(1,Math.ceil(amount/60000));
 const remaining=hours>=24?`${Math.floor(hours/24)}d ${hours%24}h`:hours>=1?`${hours}h ${Math.floor(amount/60000)%60}m`:`${mins}m`;
 $('deadline').textContent=`${day} · ${time} · ${remaining} ${diff<0?'OVERDUE':'LEFT'}`;
}
function renderTask(){
 $('taskTitle').textContent=task.title||'A little room\nto breathe.';
 $('taskCard').classList.toggle('done',!!task.done&&!!task.title);
 $('complete').hidden=!!task.done;
 $('undo').hidden=!task.done;
 $('complete').querySelector('span').textContent=task.title?'Mark complete':'Choose a focus';
 $('complete').querySelector('use').setAttribute('href',task.title?'#check':'#arrow');
 $('dailyLine').textContent=task.done?'Enough, for this moment.':'One thing at a time.';
 $('captureCount').textContent=captures.length;renderDeadline();
}
function reveal(){const el=$('greeting');el.classList.remove('reveal');void el.offsetWidth;el.classList.add('reveal')}
function openTask(){playing=false;syncButtons();$('taskInput').value=task.title||'';if(task.due){const d=new Date(task.due);$('dueInput').value=new Date(d-d.getTimezoneOffset()*60000).toISOString().slice(0,16)}else $('dueInput').value='';$('taskDialog').showModal();$('taskInput').focus()}
function syncButtons(){$('play').textContent=playing?'Pause day':'Play day';$('live').classList.toggle('selected',live);$('modeNote').textContent=live?'Real time · follows your device clock':playing?'Day preview · one day in 90 seconds':'Day preview · paused';}
$('taskForm').onsubmit=e=>{e.preventDefault();const next={title:$('taskInput').value.trim(),due:$('dueInput').value?new Date($('dueInput').value).toISOString():null,done:false};if(!next.title){$('taskInput').setCustomValidity('Add one clear action.');$('taskInput').reportValidity();return}if(!save('lesson-paper-ink-task',next))return;task=next;renderTask();renderTime();$('taskDialog').close();reveal();toast('Your one thing is set.')};
$('taskInput').oninput=()=> $('taskInput').setCustomValidity('');
$('clearTask').onclick=()=>{const next={title:'',due:null,done:false};if(!save('lesson-paper-ink-task',next))return;task=next;renderTask();$('taskDialog').close()};
$('complete').onclick=()=>{if(!task.title)return openTask();const next={...task,done:true};if(!save('lesson-paper-ink-task',next))return;task=next;renderTask();$('stamp').classList.remove('strike');void $('stamp').offsetWidth;$('stamp').classList.add('strike');navigator.vibrate?.([45,25,18]);toast('One thing done. Take a breath.')};
$('undo').onclick=()=>{const next={...task,done:false};if(!save('lesson-paper-ink-task',next))return;task=next;renderTask();toast('Completion undone.')};
for(const id of ['editTask','editOutside'])$(id).onclick=openTask;
$('timeRange').oninput=e=>{live=false;playing=false;minutes=+e.target.value;syncButtons();renderTime()};
$('play').onclick=()=>{if(live){const n=new Date();minutes=n.getHours()*60+n.getMinutes();live=false}playing=!playing;last=performance.now();syncButtons()};
$('live').onclick=()=>{live=true;playing=false;syncButtons();renderTime()};
$('reveal').onclick=reveal;
function openCapture(){voiceData=null;$('captureText').value='';$('audioPreview').hidden=true;$('audioPreview').removeAttribute('src');$('recordStatus').textContent='Or type your thought above.';$('capture').classList.remove('ripple');void $('capture').offsetWidth;$('capture').classList.add('ripple');$('captureDialog').showModal();$('captureText').focus()}
for(const id of ['capture','captureOutside'])$(id).onclick=openCapture;
function releaseStream(){stream?.getTracks().forEach(t=>t.stop());stream=null;clearInterval(recordTimer)}
$('record').onclick=async()=>{
 if(recording){recorder.stop();return}
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){$('recordStatus').textContent='Voice recording unavailable here. Type your thought instead.';return}
 try{stream=await navigator.mediaDevices.getUserMedia({audio:true});if(!$('captureDialog').open){releaseStream();return}chunks=[];voiceData=null;recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
 recorder.onerror=()=>{releaseStream();recording=false;$('recordStatus').textContent='Recording failed. You can still save a typed note.';resetRecordButton()};
 recorder.onstop=()=>{recording=false;releaseStream();resetRecordButton();const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});const reader=new FileReader();reader.onload=()=>{voiceData=reader.result;$('audioPreview').src=voiceData;$('audioPreview').hidden=false;$('recordStatus').textContent='Voice note ready. Save it below.';$('saveCapture').disabled=false};reader.readAsDataURL(blob);};
 recorder.start();recording=true;recordStart=Date.now();$('record').textContent='■ Stop recording';$('recordStatus').textContent='Recording · 0:00';$('saveCapture').disabled=true;
 recordTimer=setInterval(()=>{const s=Math.floor((Date.now()-recordStart)/1000);$('recordStatus').textContent=`Recording · ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;if(s>=60)recorder.stop()},500);
 }catch{releaseStream();$('recordStatus').textContent='Microphone unavailable or permission declined. Type your thought instead.';resetRecordButton()}
};
function resetRecordButton(){$('record').replaceChildren();const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');const use=document.createElementNS(icon.namespaceURI,'use');use.setAttribute('href','#mic');icon.append(use);$('record').append(icon,document.createTextNode(' Record voice'));$('saveCapture').disabled=false}
$('captureDialog').addEventListener('close',()=>{if(recording)recorder.stop();else releaseStream();$('audioPreview').pause()});
$('captureForm').onsubmit=e=>{e.preventDefault();if(recording)return;const text=$('captureText').value.trim();if(!text&&!voiceData){toast('Add a thought or record a voice note first.');$('captureText').focus();return}const next=[{id:Date.now().toString(36),text,audio:voiceData,created:new Date().toISOString()},...captures];if(!save('lesson-paper-ink-captures',next))return;captures=next;$('captureCount').textContent=captures.length;$('captureDialog').close();toast('Thought captured. You can let it go.')};
function openInbox(){const list=$('captureList');list.replaceChildren();if(!captures.length){const p=document.createElement('p');p.className='modal-note';p.textContent='Nothing waiting here. Use the red microphone to capture a thought.';list.append(p)}captures.forEach(c=>{const row=document.createElement('article');row.className='capture-entry';const time=document.createElement('small');time.textContent=new Date(c.created).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});const p=document.createElement('p');p.textContent=c.text||'A voice note.';row.append(time,p);if(c.audio){const a=document.createElement('audio');a.controls=true;a.src=c.audio;row.append(a)}const del=document.createElement('button');del.textContent='Let this one go';del.onclick=()=>{const next=captures.filter(x=>x.id!==c.id);if(!save('lesson-paper-ink-captures',next))return;captures=next;row.querySelector('audio')?.pause();$('captureCount').textContent=captures.length;openInboxContents();};row.append(del);list.append(row)});if(!$('inboxDialog').open)$('inboxDialog').showModal()}
function openInboxContents(){openInbox()}
$('inboxButton').onclick=openInbox;
$('inboxDialog').addEventListener('close',()=> $('captureList').querySelectorAll('audio').forEach(a=>a.pause()));
document.querySelectorAll('.close-modal').forEach(b=>b.onclick=()=>b.closest('dialog').close());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}));
const apps=['Browser','Calendar','Captures','Timer','Messages','Notes','Phone','Settings','Your focus'];
const appIcons={Browser:'globe',Calendar:'sunicon',Captures:'mic',Timer:'sunicon',Messages:'chat',Notes:'chat',Phone:'phone',Settings:'sunicon','Your focus':'check'};
function appAction(name){
 if(!$('appDrawer').hidden)closeApps();
 if(name==='Captures')return openInbox();
 if(name==='Your focus'||name==='Calendar')return openTask();
 if(name==='Notes')return openCapture();
 openShortcut(name);
}
function filterApps(){const list=$('appList');list.replaceChildren();const matches=apps.filter(n=>n.toLowerCase().includes($('appSearch').value.toLowerCase()));matches.forEach(n=>{const b=document.createElement('button');const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');const use=document.createElementNS(icon.namespaceURI,'use');use.setAttribute('href','#'+appIcons[n]);icon.append(use);b.append(icon,document.createTextNode(n));b.onclick=()=>appAction(n);list.append(b)});if(!matches.length){const p=document.createElement('p');p.textContent='No matching shortcuts.';p.style.fontSize='12px';list.append(p)}}
function openApps(){$('appDrawer').hidden=false;$('appSearch').value='';filterApps();$('appSearch').focus()}
function closeApps(){$('appDrawer').hidden=true;$('apps').focus()}
$('apps').onclick=openApps;$('closeApps').onclick=closeApps;$('appSearch').oninput=filterApps;
$('appSearch').onkeydown=e=>{if(e.key==='Escape')closeApps()};
document.querySelectorAll('[data-app]').forEach(b=>b.onclick=()=>appAction(b.dataset.app));
let touchStart=null;$('screen').addEventListener('touchstart',e=>{if(e.target.closest('button,input,.app-drawer'))return;touchStart=e.touches[0].clientY},{passive:true});$('screen').addEventListener('touchend',e=>{if(touchStart!==null&&touchStart-e.changedTouches[0].clientY>65)openApps();touchStart=null},{passive:true});
let hostVisible=true;function tick(now){if(!hostVisible){last=now;requestAnimationFrame(tick);return;}const dt=Math.min(now-last,100);last=now;if(playing&&!document.hidden)minutes=(minutes+dt*1440/90000)%1440;if(now-lastPaint>150){renderTime();lastPaint=now}requestAnimationFrame(tick)}
document.addEventListener('visibilitychange',()=>{last=performance.now();if(!document.hidden)reveal()});
renderTask();renderTime();syncButtons();reveal();requestAnimationFrame(tick);

// A small motion vocabulary: press, ink spread, release. Every control uses it.
document.addEventListener('pointerdown',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;
 b.classList.add('is-pressed');
 const ring=document.createElement('span'),r=b.getBoundingClientRect();
 ring.className='tap-ink';ring.style.left=e.clientX-r.left+'px';ring.style.top=e.clientY-r.top+'px';
 b.append(ring);setTimeout(()=>ring.remove(),650);
 navigator.vibrate?.(8);
});
function releasePress(){document.querySelectorAll('.is-pressed').forEach(b=>b.classList.remove('is-pressed'))}
document.addEventListener('pointerup',releasePress);document.addEventListener('pointercancel',releasePress);
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;
 b.classList.remove('tap-bounce');void b.offsetWidth;b.classList.add('tap-bounce');
 setTimeout(()=>b.classList.remove('tap-bounce'),450);
});
const iconLabels={Phone:'Call',Messages:'Message',capture:'Capture',Browser:'Explore',apps:'All apps'};
document.querySelectorAll('.dock button').forEach(b=>{b.dataset.tip=iconLabels[b.dataset.app||b.id]||''});
$('taskCard').addEventListener('pointermove',e=>{
 if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const r=$('taskCard').getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
 $('taskCard').style.transform=`perspective(700px) rotateX(${-y*3}deg) rotateY(${x*3}deg)`;
 $('taskCard').style.setProperty('--glow-x',((x+.5)*100)+'%');$('taskCard').style.setProperty('--glow-y',((y+.5)*100)+'%');
});
$('taskCard').addEventListener('pointerleave',()=>{$('taskCard').style.transform=''});
// The illustration has one optional, deliberate touch interaction.
$('orb').setAttribute('role','button');$('orb').setAttribute('tabindex','0');$('orb').setAttribute('aria-label','Switch between day and night preview');
$('landscape')?.removeAttribute('aria-hidden');
document.querySelector('.landscape').removeAttribute('aria-hidden');
function flipSky(){live=false;playing=false;minutes=$('screen').classList.contains('night')?581:1305;syncButtons();renderTime();reveal();navigator.vibrate?.(12)}
$('orb').onclick=flipSky;$('orb').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flipSky()}};

let timerEnds=0,timerRemaining=25*60,timerTick=null;
function openShortcut(name){
 $('shortcutTitle').textContent=name==='Phone'?'Make a call.':name==='Messages'?'A few words.':name==='Browser'?'Follow your curiosity.':name==='Timer'?'Make a little space.':'Make it yours.';
 $('shortcutKicker').textContent=name==='Timer'?'ONE THING. YOUR FULL ATTENTION.':'PAPER & INK / '+name.toUpperCase();
 const body=$('shortcutBody');body.replaceChildren();
 if(name==='Phone'){
  body.innerHTML='<form id="dialForm"><label>A NUMBER TO REACH<input id="dialNumber" type="tel" placeholder="Phone number" autocomplete="tel" required></label><div class="dial-pad" id="dialPad"></div><button class="primary" type="submit">Open phone dialer <svg><use href="#phone"/></svg></button><p class="modal-note">Hands this number to your device’s calling app. You place the call there.</p></form>';
  for(const digit of ['1','2','3','4','5','6','7','8','9','*','0','#']){const b=document.createElement('button');b.type='button';b.textContent=digit;b.onclick=()=>{$('dialNumber').value+=digit};$('dialPad').append(b)}
  const erase=document.createElement('button');erase.type='button';erase.className='text-button';erase.textContent='⌫ Delete last digit';erase.onclick=()=>{$('dialNumber').value=$('dialNumber').value.slice(0,-1)};$('dialPad').after(erase);
  $('dialForm').onsubmit=e=>{e.preventDefault();const number=$('dialNumber').value.replace(/[^\d+*#]/g,'');if(!number)return;window.location.href='tel:'+encodeURIComponent(number)};
 }else if(name==='Messages'){
  body.innerHTML='<form id="messageForm"><label>TO<input id="messageTo" type="tel" placeholder="Phone number" autocomplete="tel" required></label><label>YOUR MESSAGE<textarea id="messageBody" rows="3" placeholder="What would you like to say?" required></textarea></label><button class="primary" type="submit">Open message draft <svg><use href="#chat"/></svg></button><p class="modal-note">Opens your device’s messaging app with a draft. Nothing is sent here.</p></form>';
  $('messageForm').onsubmit=e=>{e.preventDefault();const number=$('messageTo').value.replace(/[^\d+]/g,'');if(!number)return;const sep=/iPhone|iPad/.test(navigator.userAgent)?'&':'?';window.location.href='sms:'+encodeURIComponent(number)+sep+'body='+encodeURIComponent($('messageBody').value)};
 }else if(name==='Browser'){
  body.innerHTML='<form id="browseForm"><label>SEARCH THE WEB<input id="webQuery" type="search" placeholder="A question, an idea, anywhere…" required></label><button type="submit" class="primary">Explore <svg><use href="#arrow"/></svg></button></form><div class="quick-searches"><button type="button">Japanese woodblock prints</button><button type="button">Weather today</button><button type="button">A moment of inspiration</button></div><p class="modal-note">Search opens Google in a new tab.</p>';
  function search(q){window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank','noopener,noreferrer')}
  $('browseForm').onsubmit=e=>{e.preventDefault();if($('webQuery').value.trim())search($('webQuery').value.trim())};body.querySelectorAll('.quick-searches button').forEach(b=>b.onclick=()=>search(b.textContent));
 }else if(name==='Timer'){
  body.innerHTML='<div class="focus-timer" id="timerDisplay" role="timer">25:00</div><div class="timer-presets"><button data-min="5">5 min</button><button data-min="15">15 min</button><button data-min="25">25 min</button></div><button class="primary" id="timerToggle">Begin focus</button><button class="text-button" id="timerReset">Reset timer</button><p class="modal-note">The timer keeps its place while you explore this screen. Keep this page open.</p>';
  body.querySelectorAll('[data-min]').forEach(b=>b.onclick=()=>{timerEnds=0;timerRemaining=+b.dataset.min*60;paintTimer()});
  $('timerToggle').onclick=()=>{if(timerEnds){timerRemaining=Math.max(0,Math.ceil((timerEnds-Date.now())/1000));timerEnds=0}else timerEnds=Date.now()+timerRemaining*1000;paintTimer()};
  $('timerReset').onclick=()=>{timerEnds=0;timerRemaining=1500;paintTimer()};paintTimer();
 }else{
  body.innerHTML='<div class="settings-choices"><button id="panelLive">Follow the real clock <span>↗</span></button><button id="panelDay">Morning light <span>☀</span></button><button id="panelNight">After dark <span>☾</span></button></div><p class="modal-note">These controls change this prototype’s sky.</p>';
  $('panelLive').onclick=()=>{$('live').click();$('shortcutDialog').close()};
  $('panelDay').onclick=()=>{live=false;playing=false;minutes=581;syncButtons();renderTime();$('shortcutDialog').close()};
  $('panelNight').onclick=()=>{live=false;playing=false;minutes=1305;syncButtons();renderTime();$('shortcutDialog').close()};
 }
 $('shortcutDialog').showModal();
}
function paintTimer(){const left=timerEnds?Math.max(0,Math.ceil((timerEnds-Date.now())/1000)):timerRemaining;if($('timerDisplay'))$('timerDisplay').textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');if($('timerToggle'))$('timerToggle').textContent=timerEnds?'Pause focus':left?'Begin focus':'Begin again';}
timerTick=setInterval(()=>{if(timerEnds&&Date.now()>=timerEnds){timerEnds=0;timerRemaining=1500;toast('Your focus session is complete. Take a breath.');navigator.vibrate?.([60,70,60])}if($('timerDisplay'))paintTimer()},250);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('appDrawer').hidden)closeApps()});

window.paperInkPreview={setVisible(visible){hostVisible=visible;if(visible){last=performance.now();renderTime();}}};
