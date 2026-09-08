(()=>{
 function addClientActions(){
   try{
     const identity=document.getElementById('accountIdentity');
     const activity=document.getElementById('activity');
     if(!identity||!activity)return;
     const txt=(identity.textContent||'').toLowerCase();
     if(!txt.includes('cliente'))return;
     const empty=(activity.textContent||'').toLowerCase().includes('todavía no tenés actividad');
     if(!empty||document.getElementById('resolve-client-start'))return;
     const box=document.createElement('div');box.id='resolve-client-start';box.className='info';
     box.style.cssText='margin-top:14px;padding:16px;border-radius:18px;text-align:center';
     box.innerHTML='<b>¿Qué necesitás resolver?</b><div class="mini" style="margin:8px 0 14px">Buscá profesionales o publicá una solicitud para recibir presupuestos.</div><button class="primary" id="resolve-find-pro">🔎 BUSCAR UN PROFESIONAL</button><button class="green" id="resolve-request-quote" style="margin-top:10px">📝 PEDIR PRESUPUESTO</button>';
     activity.innerHTML='';activity.appendChild(box);
     box.querySelector('#resolve-find-pro').onclick=()=>window.resolveGo?.('search')||(typeof show==='function'&&show('search'));
     box.querySelector('#resolve-request-quote').onclick=()=>{ if(typeof window.show==='function')window.show('request'); else if(typeof show==='function')show('request'); else window.resolveGo?.('search'); };
   }catch(e){console.error('RESOLVÉ cuenta cliente',e)}
 }
 const obs=new MutationObserver(addClientActions);obs.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
 document.addEventListener('DOMContentLoaded',addClientActions);setTimeout(addClientActions,800);
})();