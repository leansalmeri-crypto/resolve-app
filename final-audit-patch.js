(function(){
  const style=document.createElement('style');
  style.textContent=`
    #reviewStars button{color:#f6c400!important;font-size:34px!important;line-height:1;background:transparent;border:0;padding:2px 4px}
    #profileStars,.ratingStars{color:#f6c400!important}
    .auditBadge{display:inline-block;padding:4px 8px;border-radius:999px;background:#eef7ff;color:#245c8a;font-size:12px;font-weight:800;margin-top:6px}
  `;
  document.head.appendChild(style);

  window.setRating=function(n){
    currentRating=n;
    [...$('reviewStars').querySelectorAll('button')].forEach((b,i)=>{
      b.textContent=i<n?'★':'☆';
      b.style.color='#f6c400';
    });
  };

  window.acceptQuote=async function(id){
    const u=await requireUser(); if(!u)return;
    const {data:r,error:readErr}=await sb.from('service_requests').select('id,client_id,status').eq('id',id).maybeSingle();
    if(readErr||!r)return alert('No pudimos abrir este presupuesto.');
    if(r.client_id!==u.id)return alert('Este presupuesto no pertenece a tu cuenta.');
    if(r.status!=='quoted')return alert('Este presupuesto ya cambió de estado.');
    const {error}=await sb.from('service_requests').update({status:'accepted',updated_at:new Date().toISOString()}).eq('id',id).eq('client_id',u.id);
    if(error)return alert('No pudimos aceptar el presupuesto: '+error.message);
    await loadAccount();
  };

  window.markCompleted=async function(id){
    const u=await requireUser(); if(!u)return;
    const {data:r,error:readErr}=await sb.from('service_requests').select('id,professional_id,status').eq('id',id).maybeSingle();
    if(readErr||!r)return alert('No pudimos abrir este trabajo.');
    if(r.professional_id!==u.id)return alert('Este trabajo no pertenece a tu cuenta profesional.');
    if(r.status!=='accepted')return alert('Primero el cliente tiene que aceptar el presupuesto.');
    const {error}=await sb.from('service_requests').update({status:'completed',updated_at:new Date().toISOString()}).eq('id',id).eq('professional_id',u.id);
    if(error)return alert('No pudimos marcar el trabajo como completado: '+error.message);
    await loadAccount();
  };

  window.loadAccount=async function(){
    const u=await getUser(); if(!u)return show('login');
    const {data:p}=await sb.from('profiles').select('id,role,full_name,zone,trade').eq('id',u.id).maybeSingle();
    $('accountIdentity').textContent=(p?.full_name||u.email)+' · '+(p?.role==='professional'?'Profesional':p?.role==='admin'?'Administrador':'Cliente');

    let html='';
    const {data:reviews}=await sb.from('reviews').select('service_request_id,rating,comment,created_at').eq('client_id',u.id);
    const reviewed=new Map((reviews||[]).map(x=>[x.service_request_id,x]));

    const {data:reqs,error:reqErr}=await sb.from('service_requests')
      .select('id,trade,zone,description,status,professional_id,client_id,client_name,client_phone,client_email,quote_amount,quote_message,quoted_at,created_at')
      .order('created_at',{ascending:false});
    if(reqErr)html+='<div class="status err">No pudimos cargar tus solicitudes.</div>';

    if(reqs?.length){
      const statusEs={pending:'Pendiente',quoted:'Presupuestado',accepted:'Presupuesto aceptado',completed:'Completado',cancelled:'Cancelado'};
      html+='<h3>Solicitudes y trabajos</h3>'+reqs.map(r=>{
        const isPro=r.professional_id===u.id;
        const isClient=r.client_id===u.id;
        const phone=String(r.client_phone||'').replace(/\D/g,'');
        const rev=reviewed.get(r.id);
        let actions='';
        if(isPro&&r.status==='pending') actions+=`<button class="primary" onclick="openQuote('${r.id}','${esc(r.client_name||'Cliente')}')">ENVIAR PRESUPUESTO</button>`;
        if(isPro&&r.status==='quoted') actions+=`<button class="primary" onclick="openQuote('${r.id}','${esc(r.client_name||'Cliente')}')">ACTUALIZAR PRESUPUESTO</button><div class="info">Esperando aceptación del cliente.</div>`;
        if(isPro&&r.status==='accepted') actions+=`<button class="green" onclick="markCompleted('${r.id}')">MARCAR TRABAJO COMPLETADO</button>`;
        if(isClient&&r.status==='quoted') actions+=`<button class="green" onclick="acceptQuote('${r.id}')">ACEPTAR PRESUPUESTO</button>`;
        if(isClient&&r.status==='accepted') actions+=`<div class="ok">✅ Aceptaste este presupuesto. El profesional ya puede realizar el trabajo.</div>`;
        if(isClient&&r.status==='completed'&&!rev) actions+=`<button class="green" onclick="openReview('${r.id}','${r.professional_id}')">VALORAR PROFESIONAL</button>`;
        if(isClient&&rev) actions+=`<div class="ok"><b>Tu valoración:</b> <span style="color:#f6c400">${'★'.repeat(Number(rev.rating||0))}${'☆'.repeat(5-Number(rev.rating||0))}</span>${rev.comment?'<br>'+esc(rev.comment):''}</div>`;
        return `<div class="proCard">
          <b>${esc(r.trade)} · ${esc(r.zone)}</b>
          <div class="meta">Estado: ${esc(statusEs[r.status]||r.status)} · ${new Date(r.created_at).toLocaleDateString('es-AR')}</div>
          <div class="mini">${esc(r.description)}</div>
          ${r.quote_amount?`<div class="info" style="margin-top:10px"><b>Presupuesto:</b> $ ${Number(r.quote_amount).toLocaleString('es-AR')}<br>${r.quote_message?esc(r.quote_message):''}</div>`:''}
          ${isPro?`<div class="mini" style="margin-top:10px"><b>Cliente:</b> ${esc(r.client_name||'Sin nombre')}<br>📱 ${esc(r.client_phone||'Sin WhatsApp')}<br>✉️ ${esc(r.client_email||'Sin email')}</div>${phone?`<a class="green" style="display:block;text-align:center;text-decoration:none;margin-top:10px" target="_blank" rel="noopener" href="https://wa.me/54${phone}">CONTACTAR POR WHATSAPP</a>`:''}`:''}
          ${actions}
        </div>`;
      }).join('');
    }

    const {data:apps}=await sb.from('job_applications').select('id,job_id,status,message,created_at').eq('applicant_id',u.id).order('created_at',{ascending:false});
    if(apps?.length){
      const jobIds=[...new Set(apps.map(a=>a.job_id))];
      const {data:jobsForApps}=await sb.from('job_posts').select('id,title,trade,zone').in('id',jobIds);
      const jm=new Map((jobsForApps||[]).map(j=>[j.id,j]));
      html+='<h3>Mis postulaciones</h3>'+apps.map(a=>{const j=jm.get(a.job_id)||{};const se={pending:'Pendiente',accepted:'Aceptada',rejected:'No seleccionada'};return `<div class="proCard"><b>${esc(j.title||'Postulación')}</b><div class="meta">${esc(j.trade||'')} ${j.zone?'· '+esc(j.zone):''}</div><div class="meta">Estado: ${esc(se[a.status]||a.status)} · ${new Date(a.created_at).toLocaleDateString('es-AR')}</div>${a.message?`<div class="mini">${esc(a.message)}</div>`:''}</div>`}).join('');
    }

    const {data:myJobs}=await sb.from('job_posts').select('id,title,trade,zone,is_active,created_at').eq('employer_id',u.id).order('created_at',{ascending:false});
    if(myJobs?.length){
      html+='<h3>Mis publicaciones en Bolsa de empleo</h3>';
      for(const j of myJobs){
        const {data:received}=await sb.from('job_applications').select('id,applicant_name,applicant_phone,message,status,created_at').eq('job_id',j.id).order('created_at',{ascending:false});
        html+=`<div class="proCard"><b>${esc(j.title)}</b><div class="meta">${esc(j.trade||'General')} · ${esc(j.zone||'Sin zona')} · ${j.is_active?'Publicada':'Cerrada'} · ${new Date(j.created_at).toLocaleDateString('es-AR')}</div>${received?.length?`<div class="auditBadge">${received.length} postulacion${received.length===1?'':'es'}</div>`+received.map(a=>`<div class="info"><b>${esc(a.applicant_name||'Postulante')}</b><br>📱 ${esc(a.applicant_phone||'Sin WhatsApp')}<br>${a.message?esc(a.message):''}</div>`).join(''):'<div class="mini">Todavía no hay postulaciones.</div>'}</div>`;
      }
    }

    if(p?.role==='professional')html+='<button class="secondary" onclick="show(\'professional\')">EDITAR MI PERFIL PROFESIONAL</button>';
    if(p?.role==='admin')html+='<div class="info">Tu cuenta tiene permisos de administración.</div>';
    $('activity').innerHTML=html||'<div class="sub">Todavía no tenés actividad registrada.</div>';
    show('account');
  };

  const originalSubmitReview=window.submitReview;
  window.submitReview=async function(){
    await originalSubmitReview();
    try{
      if(!$('reviewOk').classList.contains('hidden')) setTimeout(()=>loadAccount(),900);
    }catch(e){}
  };
})();