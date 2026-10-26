(() => {
  const fit=()=>document.documentElement.style.setProperty('--phone-scale',String(innerWidth/366));fit();addEventListener('resize',fit);
  // Device shortcuts stay in this browser demonstration.
  const original=appAction;appAction=name=>{if(['Phone','Messages','Browser'].includes(name)){if(!document.getElementById('appDrawer').hidden)closeApps();document.getElementById('shortcutKicker').textContent='BROWSER EXAMPLE';document.getElementById('shortcutTitle').textContent=name;const body=document.getElementById('shortcutBody');body.replaceChildren();const p=document.createElement('p');p.className='modal-note';p.textContent='On your phone, this shortcut opens your chosen '+name.toLowerCase()+' app. This example stays in your browser.';body.append(p);document.getElementById('shortcutDialog').showModal();return;}original(name);};
})();
