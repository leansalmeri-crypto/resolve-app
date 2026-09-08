(()=>{
 if(window.__resolveNavLiveFix)return;window.__resolveNavLiveFix=1;
 function norm(s){return String(s||'').replace(/\s+/g,' ').trim().toLowerCase()}
 function go(target){
   try{
     if(target==='home'){
       if(typeof window.show==='function') return window.show('home');
       if(typeof show==='function') return show('home');
       window.scrollTo({top:0,behavior:'smooth'});return;
     }
     if(target==='search'){
       if(typeof window.show==='function') return window.show('search');
       if(typeof show==='function') return show('search');
       const el=document.querySelector('#search,[data-page="search"],input[placeholder*="profesional" i]');
       if(el){el.scrollIntoView({behavior:'smooth',block:'start'});el.focus?.()}return;
     }
     if(target==='jobs'){
       if(typeof window.show==='function') return window.show('jobs');
       if(typeof show==='function') return show('jobs');
     }
     if(target==='professional'){
       if(typeof window.show==='function') return window.show('professional');
       if(typeof show==='function') return show('professional');
     }
   }catch(e){console.error('RESOLVÉ navegación',e)}
 }
 function targetFor(el){
   const t=norm(el?.textContent), aria=norm(el?.getAttribute?.('aria-label')), title=norm(el?.getAttribute?.('title'));
   const s=t+' '+aria+' '+title;
   if(/mi cuenta/.test(s))return 'account';
   if(/bolsa de empleo/.test(s))return 'jobs';
   if(/buscar|necesito un profesional|buscar un profesional/.test(s))return 'search';
   if(/profesional/.test(s)&&!/necesito/.test(s))return 'professional';
   if(/inicio|volver/.test(s))return 'home';
   return null;
 }
 document.addEventListener('click',e=>{
   let el=e.target?.closest?.('button,a,[role="button"]'); if(!el)return;
   if(el.closest?.('#resolveSignupOverlay,#resolveLoginOverlay'))return;
   const a=el.closest('a[href]'), href=a?.getAttribute('href')||'';
   if(/^https?:\/\//i.test(href)||/instagram\.com|facebook\.com/i.test(href))return;
   const target=targetFor(el);if(!target||target==='account')return;
   e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();go(target);
 },true);
 window.resolveGo=go;
})();