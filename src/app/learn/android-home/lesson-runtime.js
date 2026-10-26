// Preserve the tested workshop interactions inside the site shell.
export function mountAndroidLesson(root) {
 const originalBodyOverflow = document.body.style.overflow;
 const abort = new AbortController();
 const timers = new Set();
 const observers = [];
 const byId = id => root.querySelector('#'+id);
 const listen = (target, type, listener) => target.addEventListener(type, listener, {signal:abort.signal});
 const later = (callback, delay) => { const id=window.setTimeout(()=>{timers.delete(id);callback();},delay); timers.add(id); return id; };
 const makeObserver = (...args) => {const observer=new IntersectionObserver(...args);observers.push(observer);return observer;};
(() => {
  const chapters=['setup','design','build','daily','next'],routes=['overview',...chapters,'tools','downloads'];
  const $=id=>byId(id),key='android-home-lesson-v1';let state={done:[],notes:{},checks:[]},storage=true,current='overview';
  try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved&&Array.isArray(saved.done)&&saved.notes&&Array.isArray(saved.checks))state=saved;}catch{storage=false;}
  const persist=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{storage=false;paint();}};
  function paint(){
    const done=chapters.filter(id=>state.done.includes(id));$('progressText').textContent=done.length+' / 5';$('progressBar').style.width=done.length*20+'%';root.querySelector('.progress-track').setAttribute('aria-valuenow',String(done.length));
    root.querySelectorAll('[data-nav]').forEach(link=>{const id=link.dataset.nav;link.classList.toggle('active',id===current);link.classList.toggle('done',done.includes(id));if(id===current)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');const number=link.querySelector('[data-number]');if(number)number.textContent=done.includes(id)?'✓':String(chapters.indexOf(id)+1).padStart(2,'0');});
    $('completeButton').setAttribute('aria-pressed',String(done.includes(current)));$('completeButton').textContent=done.includes(current)?'Completed':'Mark complete';
    if(!storage){$('storageStatus').textContent='Progress is not being saved here.';if($('save-status'))$('save-status').textContent='Browser storage is unavailable; copy your notes before leaving.';}
  }
  function menu(open){const mobile=matchMedia('(max-width:950px)').matches;open=Boolean(open&&mobile);$('sidebar').classList.toggle('open',open);$('sidebar').inert=mobile&&!open;$('shade').classList.toggle('open',open);$('shade').hidden=!open;root.classList.toggle('menu-open',open);document.body.style.overflow=open?'hidden':originalBodyOverflow;$('android-main').inert=open;$('menuToggle').setAttribute('aria-expanded',String(open));$('menuToggle').setAttribute('aria-label',open?'Close contents':'Open contents');}
  function route(focus=false){let id=location.hash.slice(1);if(!routes.includes(id))id='overview';current=id;root.querySelectorAll('[data-page]').forEach(page=>page.hidden=page.dataset.page!==id);const index=chapters.indexOf(id);$('lessonFooter').hidden=index<0;if(index>=0){$('footerChapter').textContent='Lesson '+(index+1)+' checkpoint';const next=index===chapters.length-1?'downloads':chapters[index+1];$('nextLesson').href='#'+next;const title=$('title-'+next).textContent.replace(/\.$/,'');$('nextLesson').textContent=next==='downloads'?'Get the kit →':'Next: '+title+' →';}menu(false);paint();window.scrollTo(0,0);root.querySelectorAll('video').forEach(video=>video.pause());if(focus)$('title-'+id)?.focus({preventScroll:true});}
  listen(window,'hashchange',()=>route(true));listen(window,'resize',()=>menu(false));$('menuToggle').onclick=()=>{const open=!$('sidebar').classList.contains('open');menu(open);if(open)$('sidebar').querySelector('[aria-current=page]')?.focus();};$('shade').onclick=()=>menu(false);listen(document,'keydown',event=>{if(!$('sidebar').classList.contains('open'))return;if(event.key==='Escape'){menu(false);$('menuToggle').focus();}if(event.key==='Tab'){const links=[$('menuToggle'),...$('sidebar').querySelectorAll('a[href]')];const index=links.indexOf(document.activeElement);if(event.shiftKey&&index<=0){event.preventDefault();links.at(-1).focus();}else if(!event.shiftKey&&(index<0||index===links.length-1)){event.preventDefault();links[0].focus();}}});
  $('completeButton').onclick=()=>{if(!chapters.includes(current))return;state.done=state.done.includes(current)?state.done.filter(id=>id!==current):[...state.done,current];persist();paint();const completed=state.done.includes(current);$('completeButton').classList.toggle('complete-pop',completed);if(completed)toast('Lesson '+(chapters.indexOf(current)+1)+' complete.');window.dispatchEvent(new CustomEvent('lessonprogress'));};
  root.querySelectorAll('[data-note]').forEach(field=>{field.value=state.notes[field.dataset.note]||'';listen(field,'input',()=>{state.notes[field.dataset.note]=field.value;persist();});});
  root.querySelectorAll('[data-check]').forEach(field=>{field.checked=state.checks.includes(field.dataset.check);field.onchange=()=>{state.checks=field.checked?[...new Set([...state.checks,field.dataset.check])]:state.checks.filter(id=>id!==field.dataset.check);persist();};});
  let toastTimer;function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=later(()=>$('toast').hidden=true,2500);}
  root.querySelectorAll('[data-copy]').forEach(button=>{const label=button.innerHTML;let reset;button.onclick=async()=>{const text=$(button.dataset.copy).textContent;try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(text);toast('Full prompt copied.');clearTimeout(reset);button.innerHTML='Copied <span aria-hidden="true">✓</span>';button.classList.add('copied');reset=later(()=>{button.innerHTML=label;button.classList.remove('copied');},1800);}catch{$('fallbackText').value=text;$('copyFallback').showModal();$('fallbackText').focus();$('fallbackText').select();}};});
  $('closeCopy').onclick=()=>$('copyFallback').close();route();
})();

(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const hero=byId('heroPhone');
  const paper=byId('paperPhone');
  const finished=byId('lessonFinished');
  let heroVisible=false,heroPlayed=false,freezeTimer,currentView='disruptiv';
  const preview=()=>{try{return hero.contentWindow?.launcherPreview;}catch{return null;}};
  const paperPreview=()=>{try{return paper.contentWindow?.paperInkPreview;}catch{return null;}};
  function pauseHero(){clearTimeout(freezeTimer);const api=preview();if(api)api.visible=false;api?.setVisible?.(false);paperPreview()?.setVisible(false);}
  function initialHeroMotion(){if(!heroVisible||document.hidden)return;paperPreview()?.setVisible(currentView==='paper');if(currentView!=='disruptiv'||heroPlayed||reduced.matches)return;const api=preview();if(!api?.setVisible)return;heroPlayed=true;api.setVisible(true);freezeTimer=later(()=>api.setVisible(false),5000);}
  function selectView(view){pauseHero();currentView=view;hero.hidden=view!=='disruptiv';paper.hidden=view!=='paper';root.querySelectorAll('[data-home-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.homeView===view)));const other=byId('swapPhone');other.setAttribute('aria-label',view==='paper'?'Switch to Disruptiv':'Switch to Paper & Ink');const image=other.querySelector('img');image.src=view==='paper'?'/learn/android-home/assets/disruptiv-s25-browser.png':'/learn/android-home/assets/paper-ink-s24.png';image.alt=view==='paper'?'Disruptiv home screen':'Paper and Ink on Ian’s S24';initialHeroMotion();}
  root.querySelectorAll('[data-home-view]').forEach(button=>button.onclick=()=>selectView(button.dataset.homeView));byId('swapPhone').onclick=()=>selectView(currentView==='paper'?'disruptiv':'paper');
  const heroObserver=makeObserver(([entry])=>{heroVisible=entry.isIntersecting;if(heroVisible)initialHeroMotion();else pauseHero();},{threshold:.25});heroObserver.observe(hero.parentElement);
  listen(paper,'load',()=>paperPreview()?.setVisible(currentView==='paper'&&heroVisible&&!document.hidden));
  listen(hero,'load',()=>{const api=preview();if(api)api.visible=false;api?.setVisible?.(false);const control=hero.contentDocument?.getElementById('motion-control');if(control)control.style.display='none';initialHeroMotion();later(()=>{if(!heroPlayed)initialHeroMotion();},300);});
  const active=new Map();
  function still(img){clearTimeout(active.get(img));active.delete(img);img.src=img.dataset.still;}
  const sceneObserver=makeObserver(entries=>{for(const {target:img,isIntersecting} of entries){if(!isIntersecting){if(active.has(img))still(img);continue;}if(reduced.matches||document.hidden||img.dataset.played)continue;img.dataset.played='true';img.src=img.dataset.animation;active.set(img,later(()=>still(img),4000));}},{threshold:.35});
  root.querySelectorAll('[data-animation]').forEach(img=>sceneObserver.observe(img));
  function updateFinished(){const count=Number(root.querySelector('.progress-track').getAttribute('aria-valuenow'));finished.hidden=count!==5||location.hash!=='#next';}
  listen(window,'lessonprogress',updateFinished);listen(window,'hashchange',()=>{pauseHero();byId('completeButton').classList.remove('complete-pop');updateFinished();});
  function reduceMotion(){pauseHero();active.forEach((_,img)=>still(img));}
  listen(reduced,'change',reduceMotion);listen(document,'visibilitychange',()=>{if(document.hidden)reduceMotion();});
  updateFinished();
})();

 return () => {
  document.body.style.overflow=originalBodyOverflow;
  abort.abort();
  timers.forEach(id=>window.clearTimeout(id));
  observers.forEach(observer=>observer.disconnect());
  for(const id of ['heroPhone','paperPhone']) {
   const frame=byId(id);
   try { frame?.contentWindow?.launcherPreview?.setVisible?.(false); frame?.contentWindow?.paperInkPreview?.setVisible?.(false); } catch {}
  }
 };
}
