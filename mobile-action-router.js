(()=>{
 if(window.__resolveMobileRouter)return;window.__resolveMobileRouter=1;
 const ids=['home','results','profile','request','professional','jobs','jobInterest','jobCreate','login','account','review','quote'];
 const showSafe=id=>{try{if(typeof window.show==='function'){window.show(id);return true}if(typeof show==='function'){show(id);return true}}catch(e){console.error('RESOLVÉ navegación',e)}return false};
 const current=()=>ids.find(id=>{const el=document.getElementById(id);return el&&!el.classList.contains('hidden')&&getComputedStyle(el).display!=='none'})||'home';
 const goSearch=()=>{showSafe('home');setTimeout(()=>document.getElementById('searchBox')?.scrollIntoView({behavior:'smooth',block:'start'}),80)};
 const goBack=()=>{const from=current();const map={account:'home',results:'home',profile:'results',request:'profile',professional:'home',jobs:'home',jobInterest:'jobs',jobCreate:'jobs',login:'home',review:'account',quote:'account'};const to=map[from]||'home';if(to==='account'&&typeof window.loadAccount==='function')window.loadAccount();else if(to==='results'&&!document.getElementById('results'))goSearch();else showSafe(to)};
 const logout=async()=>{try{await sb.auth.signOut()}catch(e){console.error('RESOLVÉ cerrar sesión',e)}try{document.getElementById('resolveLoginOverlay')?.classList.remove('show')}catch(e){}showSafe('home');setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),30)};
 const textOf=el=>(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
 const actionable=target=>target?.closest?.('button,a,[role="button"]');
 window.addEventListener('click',e=>{
   const el=actionable(e.target);if(!el)return;const t=textOf(el);if(!t)return;
   let action=null;
   if(t.includes('buscar un profesional')||t==='buscar'||t==='🔎 buscar un profesional')action=goSearch;
   else if(t.includes('pedir presupuesto'))action=()=>{goSearch();setTimeout(()=>alert('Elegí un profesional y desde su perfil tocá PEDIR PRESUPUESTO.'),180)};
   else if(t==='volver'||t==='← volver'||/^←\s*volver/.test(t))action=goBack;
   else if(t.includes('cerrar sesión')||t.includes('cerrar sesion'))action=logout;
   if(!action)return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();action();
 },true);
})();