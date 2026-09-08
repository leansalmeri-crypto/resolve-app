(()=>{
 function goHomeSearch(){
   try{
     if(typeof window.show==='function') window.show('home'); else if(typeof show==='function') show('home');
     setTimeout(()=>document.getElementById('searchBox')?.scrollIntoView({behavior:'smooth',block:'start'}),50);
   }catch(e){console.error('RESOLVÉ búsqueda',e)}
 }
 function goRequest(){
   try{
     if(typeof window.show==='function') window.show('request'); else if(typeof show==='function') show('request');
   }catch(e){console.error('RESOLVÉ solicitud',e)}
 }
 function addClientActions(){
   const identity=document.getElementById('accountIdentity'),activity=document.getElementById('activity');
   if(!identity||!activity||!/cliente/i.test(identity.textContent||''))return;
   if(!/todavía no tenés actividad/i.test(activity.textContent||'')||document.getElementById('resolve-client-start'))return;
   activity.innerHTML='<div id="resolve-client-start" class="info" style="margin-top:14px;padding:16px;border-radius:18px;text-align:center"><b>¿Qué necesitás resolver?</b><div class="mini" style="margin:8px 0 14px">Buscá profesionales o publicá una solicitud para recibir presupuestos.</div><button type="button" class="primary" id="resolve-find-pro">🔎 BUSCAR UN PROFESIONAL</button><button type="button" class="green" id="resolve-request-quote" style="margin-top:10px">📝 PEDIR PRESUPUESTO</button></div>';
   document.getElementById('resolve-find-pro').onclick=e=>{e.preventDefault();goHomeSearch()};
   document.getElementById('resolve-request-quote').onclick=e=>{e.preventDefault();goRequest()};
 }
 new MutationObserver(addClientActions).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
 document.addEventListener('DOMContentLoaded',addClientActions);setTimeout(addClientActions,500);setTimeout(addClientActions,1500);
 window.resolveClientSearch=goHomeSearch;window.resolveClientRequest=goRequest;
})();