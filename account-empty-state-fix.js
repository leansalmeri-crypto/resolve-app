(()=>{
 function openByCandidates(cands){
   for(const id of cands){const el=document.getElementById(id);if(el){document.querySelectorAll('section').forEach(s=>s.classList.add('hidden'));el.classList.remove('hidden');window.scrollTo(0,0);return true}}
   return false;
 }
 function goSearch(){
   try{if(openByCandidates(['search','find','professionals','client']))return;if(typeof window.show==='function'){for(const x of ['search','find','client']){try{window.show(x);const e=document.getElementById(x);if(e&&!e.classList.contains('hidden'))return}catch(_){}}}const nav=[...document.querySelectorAll('button,a,[role="button"]')].find(e=>/buscar/i.test(e.textContent||'')&&!/resolve-find-pro/.test(e.id||''));nav?.click()}catch(e){console.error(e)}
 }
 function goRequest(){
   try{if(openByCandidates(['request','quoteRequest','cotiza','form']))return;if(typeof window.show==='function'){for(const x of ['request','cotiza','form','home']){try{window.show(x);const e=document.getElementById(x);if(e&&!e.classList.contains('hidden'))return}catch(_){}}}goSearch()}catch(e){console.error(e)}
 }
 function addClientActions(){
   const identity=document.getElementById('accountIdentity'),activity=document.getElementById('activity');if(!identity||!activity||!/(cliente)/i.test(identity.textContent||''))return;
   const empty=/todavía no tenés actividad/i.test(activity.textContent||'');if(!empty||document.getElementById('resolve-client-start'))return;
   activity.innerHTML='<div id="resolve-client-start" class="info" style="margin-top:14px;padding:16px;border-radius:18px;text-align:center"><b>¿Qué necesitás resolver?</b><div class="mini" style="margin:8px 0 14px">Buscá profesionales o publicá una solicitud para recibir presupuestos.</div><button type="button" class="primary" id="resolve-find-pro">🔎 BUSCAR UN PROFESIONAL</button><button type="button" class="green" id="resolve-request-quote" style="margin-top:10px">📝 PEDIR PRESUPUESTO</button></div>';
   document.getElementById('resolve-find-pro').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();goSearch()});
   document.getElementById('resolve-request-quote').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();goRequest()});
 }
 new MutationObserver(addClientActions).observe(document.documentElement,{childList:true,subtree:true,characterData:true});document.addEventListener('DOMContentLoaded',addClientActions);setTimeout(addClientActions,500);setTimeout(addClientActions,1500);
 window.resolveClientSearch=goSearch;window.resolveClientRequest=goRequest;
})();