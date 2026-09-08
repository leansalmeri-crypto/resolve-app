(()=>{
 if(window.__resolveNavStable)return;window.__resolveNavStable=1;
 const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
 function visible(id){const e=document.getElementById(id);return !!(e&&!e.classList.contains('hidden'))}
 function callShow(candidates){
   if(typeof window.show!=='function')return false;
   for(const id of candidates){try{if(!document.getElementById(id))continue;window.show(id);if(visible(id))return true}catch(_){}}
   return false;
 }
 function clickNative(re,exclude){
   const els=[...document.querySelectorAll('button,a,[role="button"]')];
   const el=els.find(x=>re.test(norm(x.textContent))&&!(exclude&&exclude.test(x.id||''))&&x.offsetParent!==null);
   if(el){el.click();return true}return false;
 }
 function go(target){
   try{
     if(target==='home') return callShow(['home','inicio'])||clickNative(/^inicio$/i,/resolve/i)||false;
     if(target==='search') return callShow(['search','buscar','client','professionals'])||clickNative(/buscar|necesito un profesional/i,/resolve-find-pro/i)||false;
     if(target==='jobs') return callShow(['jobs','empleos','jobBoard'])||clickNative(/bolsa de empleo/i)||false;
     if(target==='professional') return callShow(['professional','pro','profesional'])||clickNative(/^profesional$/i)||false;
     return false;
   }catch(e){console.error('RESOLVÉ navegación estable',e);return false}
 }
 // No interceptamos clicks globalmente: los handlers originales de la app tienen prioridad.
 // Solo reparamos controles que no tengan acción propia.
 function repair(){
   document.querySelectorAll('button,a,[role="button"]').forEach(el=>{
     if(el.dataset.resolveNavBound)return;
     const t=norm(el.textContent);let target=null;
     if(t==='inicio')target='home';else if(t==='buscar')target='search';else if(t==='bolsa de empleo')target='jobs';
     if(!target)return;
     el.dataset.resolveNavBound='1';
     el.addEventListener('click',()=>setTimeout(()=>{
       // fallback únicamente si el handler original no cambió de pantalla
       const account=document.getElementById('account');
       if(account&&!account.classList.contains('hidden'))go(target);
     },40));
   });
 }
 new MutationObserver(repair).observe(document.documentElement,{childList:true,subtree:true});
 document.addEventListener('DOMContentLoaded',repair);setTimeout(repair,500);
 window.resolveGo=go;
})();