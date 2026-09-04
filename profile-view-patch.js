(function(){
  function photoUrl(path){try{return sb.storage.from('professional-work').getPublicUrl(path).data.publicUrl}catch(e){return ''}}
  function escAttr(s){return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function photoButton(url){const u=escAttr(url);return `<button type="button" data-resolve-photo-button="1" data-src="${u}" data-alt="Trabajo realizado" aria-label="Ampliar foto"><img src="${u}" alt="Trabajo realizado" style="width:100%;height:150px;object-fit:cover;border-radius:14px;display:block"></button>`}

  const oldOpenProfile=window.openProfile;
  window.openProfile=async function(id){
    if(typeof oldOpenProfile==='function') await oldOpenProfile(id);
    const gallery=document.getElementById('profileGallery');
    if(!gallery)return;
    const {data:photos}=await sb.from('professional_photos').select('id,storage_path,caption,created_at').eq('professional_id',id).order('created_at',{ascending:false});
    gallery.innerHTML=(photos||[]).map(p=>{const u=photoUrl(p.storage_path);return u?photoButton(u):''}).join('')||'<div class="sub">Este profesional todavía no cargó fotos.</div>';
  };

  const oldLoadAccount=window.loadAccount;
  window.loadAccount=async function(){
    await oldLoadAccount();
    const u=await getUser(); if(!u)return;
    const {data:p}=await sb.from('profiles').select('id,role,full_name,trade,zone,phone,bio').eq('id',u.id).maybeSingle();
    if(!p||p.role!=='professional')return;
    const {data:photos}=await sb.from('professional_photos').select('id,storage_path,caption,created_at').eq('professional_id',u.id).order('created_at',{ascending:false});
    const activity=document.getElementById('activity'); if(!activity)return;
    const old=document.getElementById('myProfessionalProfileCard'); if(old)old.remove();
    const gallery=(photos||[]).map(p=>{const url=photoUrl(p.storage_path);return url?photoButton(url):''}).join('');
    const card=document.createElement('div'); card.id='myProfessionalProfileCard'; card.className='proCard'; card.style.marginBottom='18px';
    card.innerHTML=`<h3 style="margin-top:0">Mi perfil profesional</h3><div class="mini"><b>${esc(p.full_name||'Profesional')}</b><br>${p.trade?esc(p.trade)+'<br>':''}${p.zone?esc(p.zone)+'<br>':''}${p.phone?'📱 '+esc(p.phone)+'<br>':''}${p.bio?'<br>'+esc(p.bio):''}</div><h4>Mis fotos</h4><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">${gallery||'<div class="sub">Todavía no cargaste fotos.</div>'}</div><button class="secondary" style="margin-top:12px" onclick="show('professional')">EDITAR MI PERFIL</button>`;
    activity.prepend(card);
  };
})();