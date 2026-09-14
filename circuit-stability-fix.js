(()=>{
 if(window.__resolveCircuitStable)return;window.__resolveCircuitStable=1;
 const byId=id=>document.getElementById(id);
 const nativeShow=id=>{try{if(typeof window.show==='function'){window.show(id);return true}if(typeof show==='function'){show(id);return true}}catch(e){console.error('RESOLVÉ show',id,e)}return false};
 const goSearch=()=>{nativeShow('home');setTimeout(()=>byId('searchBox')?.scrollIntoView({behavior:'smooth',block:'start'}),60)};
 const goAccount=()=>{try{if(typeof window.goAccount==='function')return window.goAccount();if(typeof window.openAccount==='function')return window.openAccount();if(typeof openAccount==='function')return openAccount();}catch(e){console.error('RESOLVÉ cuenta',e)}nativeShow('login')};
 function chosenProfessional(){try{return typeof chosenId!=='undefined'&&!!chosenId}catch(e){return false}}
 function safeRequest(){if(!chosenProfessional()){goSearch();setTimeout(()=>alert('Primero elegí un profesional para pedirle presupuesto.'),120);return false}return nativeShow('request')}
 window.resolveGoSearch=goSearch;window.resolveGoAccount=goAccount;window.resolveSafeRequest=safeRequest;

 // Evita abrir una solicitud sin profesional asignado desde estados vacíos o CTAs genéricos.
 function fixClientEmpty(){const b=byId('resolve-request-quote');if(b&&!b.dataset.resolveSafe){b.dataset.resolveSafe='1';b.onclick=e=>{e.preventDefault();goSearch()}}}

 // Presupuesto: sólo el profesional asignado puede presupuestar una solicitud pendiente.
 // Un presupuesto ya enviado no se edita: el cliente debe aceptarlo o rechazarlo.
 const oldOpenQuote=window.openQuote;
 window.openQuote=async function(id,name){try{const u=await getUser();if(!u)return goAccount();const {data:r,error}=await sb.from('service_requests').select('id,professional_id,status').eq('id',id).maybeSingle();if(error||!r)return alert('No pudimos abrir esta solicitud.');if(r.professional_id!==u.id)return alert('Esta solicitud no pertenece a tu cuenta profesional.');if(r.status!=='pending')return alert('Este presupuesto ya fue enviado o la solicitud cambió de estado.');if(typeof oldOpenQuote==='function')return oldOpenQuote(id,name)}catch(e){console.error(e);alert('No pudimos abrir el presupuesto.')}};
 window.submitQuote=async function(){try{const u=await getUser();if(!u)return goAccount();const id=window.__quoteRequestId,amount=Number(byId('quoteAmount')?.value),msg=(byId('quoteMessage')?.value||'').trim();if(!id)return alert('No encontramos la solicitud a presupuestar.');if(!Number.isFinite(amount)||amount<=0)return alert('Ingresá un monto válido mayor a cero.');if(!msg)return alert('Escribí el detalle del presupuesto.');const {data:r,error:re}=await sb.from('service_requests').select('id,professional_id,status').eq('id',id).maybeSingle();if(re||!r)return alert('No pudimos abrir esta solicitud.');if(r.professional_id!==u.id)return alert('Esta solicitud no pertenece a tu cuenta profesional.');if(r.status!=='pending')return alert('La solicitud ya cambió de estado.');const {error}=await sb.from('service_requests').update({quote_amount:amount,quote_message:msg,status:'quoted',quoted_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',id).eq('professional_id',u.id).eq('status','pending');if(error)return alert('No pudimos enviar el presupuesto: '+error.message);byId('quoteOk')?.classList.remove('hidden');setTimeout(()=>window.loadAccount?.(),700)}catch(e){console.error(e);alert('No pudimos enviar el presupuesto.')}};

 function bindOnce(el,key,fn,capture=false){if(!el||el.dataset[key])return;el.dataset[key]='1';el.addEventListener('click',fn,capture)}
 function repair(){
  fixClientEmpty();
  bindOnce(byId('qHome'),'resolveCircuit',e=>{e.preventDefault();nativeShow('home')});
  bindOnce(byId('qJobs'),'resolveCircuit',e=>{e.preventDefault();nativeShow('jobs')});
  bindOnce(byId('qPro'),'resolveCircuit',e=>{e.preventDefault();nativeShow('professional')});
  bindOnce(byId('nHome'),'resolveCircuit',e=>{e.preventDefault();nativeShow('home')});
  bindOnce(byId('nJobs'),'resolveCircuit',e=>{e.preventDefault();nativeShow('jobs')});
  bindOnce(byId('nAccount'),'resolveCircuit',e=>{e.preventDefault();goAccount()});
  document.querySelectorAll('button,a,[role="button"]').forEach(el=>{
   if(el.dataset.resolveCircuitText)return;
   const t=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
   if(!t)return;
   if(t==='buscar'||t.includes('buscar un profesional')){el.dataset.resolveCircuitText='1';el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();goSearch()})}
   else if(t==='inicio'||t==='🏠 inicio'){el.dataset.resolveCircuitText='1';el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();nativeShow('home')})}
   else if(t.includes('bolsa de trabajo')||t.includes('bolsa de empleo')){el.dataset.resolveCircuitText='1';el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();nativeShow('jobs')})}
   else if(t==='mi cuenta'||t.includes('ingresar a mi cuenta')){el.dataset.resolveCircuitText='1';el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();goAccount()})}
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',repair);else repair();
 new MutationObserver(repair).observe(document.documentElement,{childList:true,subtree:true});
})();