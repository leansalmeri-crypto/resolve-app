(()=>{
 if(window.__resolveMobileRouter)return;window.__resolveMobileRouter=1;
 const ids=['home','results','profile','request','professional','jobs','jobInterest','jobCreate','login','account','review','quote'];
 const showSafe=id=>{try{if(typeof window.show==='function'){window.show(id);return true}if(typeof show==='function'){show(id);return true}}catch(e){console.error('RESOLVÉ navegación',e)}return false};
 const current=()=>ids.find(id=>{const el=document.getElementById(id);return el&&!el.classList.contains('hidden')&&getComputedStyle(el).display!=='none'})||'home';
 const goHome=()=>{showSafe('home');setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),30)};
 const goSearch=()=>{showSafe('home');setTimeout(()=>document.getElementById('searchBox')?.scrollIntoView({behavior:'smooth',block:'start'}),80)};
 const goJobs=()=>showSafe('jobs');
 const goAccount=()=>{try{if(typeof window.goAccount==='function')return window.goAccount();if(typeof window.openAccount==='function')return window.openAccount();if(typeof openAccount==='function')return openAccount()}catch(e){console.error('RESOLVÉ cuenta',e)}showSafe('login')};
 const goBack=()=>{const from=current();const map={account:'home',results:'home',profile:'results',request:'profile',professional:'home',jobs:'home',jobInterest:'jobs',jobCreate:'jobs',login:'home',review:'account',quote:'account'};const to=map[from]||'home';if(to==='account'&&typeof window.loadAccount==='function')window.loadAccount();else if(to==='results'&&!document.getElementById('results'))goSearch();else showSafe(to)};
 const logout=async()=>{try{await sb.auth.signOut()}catch(e){console.error('RESOLVÉ cerrar sesión',e)}try{document.getElementById('resolveLoginOverlay')?.classList.remove('show')}catch(e){}goHome()};
 const textOf=el=>(el?.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
 const actionable=target=>target?.closest?.('button,a,[role="button"]');
 function actionFor(el){
   const t=textOf(el);if(!t)return null;
   const inBottom=!!el.closest?.('nav');
   if(inBottom){
     if(t==='inicio'||t.includes('inicio'))return goHome;
     if(t==='buscar'||t.includes('buscar'))return goSearch;
     if(t.includes('bolsa de empleo')||t.includes('bolsa de trabajo'))return goJobs;
     if(t.includes('mi cuenta'))return goAccount;
   }
   if(t.includes('buscar un profesional')||t==='buscar'||t==='🔎 buscar un profesional')return goSearch;
   if(t.includes('pedir presupuesto'))return ()=>{goSearch();setTimeout(()=>alert('Elegí un profesional y desde su perfil tocá PEDIR PRESUPUESTO.'),180)};
   if(t==='volver'||t==='← volver'||/^←\s*volver/.test(t))return goBack;
   if(t.includes('cerrar sesión')||t.includes('cerrar sesion'))return logout;
   return null;
 }
 window.addEventListener('click',e=>{
   const el=actionable(e.target);if(!el)return;const action=actionFor(el);if(!action)return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();action();
 },true);
 function harden(){
   document.querySelectorAll('nav').forEach(nav=>{nav.style.pointerEvents='auto';nav.style.zIndex='1000';nav.querySelectorAll('button,a,[role="button"]').forEach(el=>{el.style.pointerEvents='auto';el.style.cursor='pointer'})});
 }
 harden();new MutationObserver(harden).observe(document.documentElement,{childList:true,subtree:true});
})();