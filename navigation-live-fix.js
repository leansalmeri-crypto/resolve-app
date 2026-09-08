(()=>{
 if(window.__resolveNavStable)return;window.__resolveNavStable=1;
 function nativeShow(id){
   try{if(typeof window.show==='function'){window.show(id);return true}if(typeof show==='function'){show(id);return true}}catch(e){console.error('RESOLVÉ navegación',e)}return false;
 }
 function go(target){
   if(target==='home')return nativeShow('home');
   if(target==='search'){const ok=nativeShow('home');setTimeout(()=>document.getElementById('searchBox')?.scrollIntoView({behavior:'smooth',block:'start'}),50);return ok}
   if(target==='jobs')return nativeShow('jobs');
   if(target==='professional')return nativeShow('professional');
   if(target==='request')return nativeShow('request');
   if(target==='account'){try{if(typeof window.openAccount==='function'){window.openAccount();return true}if(typeof openAccount==='function'){openAccount();return true}}catch(e){console.error(e)}return false}
   return false;
 }
 // La app original ya define los botones. No interceptamos eventos globales.
 // Este objeto queda como API de respaldo para los controles agregados por los parches.
 window.resolveGo=go;
})();