// Fotos de profesionales RESOLVÉ v3.
// Separamos claramente: 1 foto de perfil + hasta 3 fotos de trabajos realizados.
const RESOLVE_PHOTO_BUCKET='professional-work';

function resolvePublicPhotoUrl(path){
  if(!path)return '';
  if(/^https?:/i.test(path))return path;
  const u=db.storage.from(RESOLVE_PHOTO_BUCKET).getPublicUrl(path);
  return u.data?.publicUrl||'';
}

async function resolveLoadProfessionalPhotos(professionalId){
  const r=await db.from('professional_photos').select('*').eq('professional_id',professionalId).order('created_at',{ascending:false});
  if(r.error)return r;
  const rows=r.data||[];
  for(const x of rows)x.public_url=resolvePublicPhotoUrl(x.storage_path);
  return {data:rows,error:null};
}

async function resolveUploadProfilePhoto(file){
  if(!session||profile?.role!=='professional')return {error:{message:'Solo los profesionales pueden cambiar su foto de perfil.'}};
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type))return {error:{message:'Usá una imagen JPG, PNG o WEBP.'}};
  if(file.size>5*1024*1024)return {error:{message:'La imagen no puede superar 5 MB.'}};
  const ext=(file.name.split('.').pop()||'jpg').toLowerCase();
  const path=session.user.id+'/profile/profile-'+Date.now()+'.'+ext;
  const up=await db.storage.from(RESOLVE_PHOTO_BUCKET).upload(path,file,{contentType:file.type,upsert:false});
  if(up.error)return up;
  const old=profile?.profile_photo_path||null;
  const saved=await db.from('profiles').update({profile_photo_path:up.data.path,updated_at:new Date().toISOString()}).eq('id',session.user.id).select('*').single();
  if(saved.error){await db.storage.from(RESOLVE_PHOTO_BUCKET).remove([up.data.path]);return saved}
  if(old&&!/^https?:/i.test(old))await db.storage.from(RESOLVE_PHOTO_BUCKET).remove([old]);
  profile=saved.data;
  return {data:saved.data,error:null};
}

async function resolveUploadProfessionalPhoto(file,caption){
  if(!session||profile?.role!=='professional')return {error:{message:'Solo los profesionales pueden subir fotos.'}};
  const count=await db.from('professional_photos').select('id',{count:'exact',head:true}).eq('professional_id',session.user.id);
  if(count.error)return count;
  if((count.count||0)>=3)return {error:{message:'Podés subir hasta 3 fotos de trabajos realizados.'}};
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type))return {error:{message:'Usá una imagen JPG, PNG o WEBP.'}};
  if(file.size>5*1024*1024)return {error:{message:'La imagen no puede superar 5 MB.'}};
  const ext=(file.name.split('.').pop()||'jpg').toLowerCase();
  const path=session.user.id+'/work/'+Date.now()+'.'+ext;
  const up=await db.storage.from(RESOLVE_PHOTO_BUCKET).upload(path,file,{contentType:file.type,upsert:false});
  if(up.error)return up;
  const row=await db.from('professional_photos').insert({professional_id:session.user.id,storage_path:up.data.path,caption:caption||null});
  if(row.error)await db.storage.from(RESOLVE_PHOTO_BUCKET).remove([up.data.path]);
  return row;
}

async function resolveRefreshOwnPhotos(){
  const avatar=resolvePublicPhotoUrl(profile?.profile_photo_path);
  if($('ownProfilePhoto'))$('ownProfilePhoto').innerHTML=avatar?'<img src="'+safe(avatar)+'" alt="Foto de perfil" style="width:96px;height:96px;object-fit:cover;border-radius:50%">':'<div class="msg">Todavía no subiste foto de perfil.</div>';
  const r=await resolveLoadProfessionalPhotos(session.user.id);
  $('ownPhotos').innerHTML=r.data?.length?r.data.map(x=>x.public_url?'<div class="item"><img src="'+safe(x.public_url)+'" alt="Trabajo realizado" style="width:100%;max-height:260px;object-fit:cover;border-radius:14px">'+(x.caption?'<p>'+safe(x.caption)+'</p>':'')+'</div>':'').join(''):'<div class="msg">Todavía no subiste fotos de tus trabajos.</div>';
}

async function resolveUploadProfilePhotoAction(){
  const f=$('profilePhoto')?.files?.[0];
  const r=await resolveUploadProfilePhoto(f);
  msg('profilePhotoMsg',r.error?r.error.message:'✓ Foto de perfil actualizada.');
  if(!r.error){$('profilePhoto').value='';resolveRefreshOwnPhotos()}
}

async function resolveUploadPhotoAction(){
  const f=$('proPhoto').files[0];
  const r=await resolveUploadProfessionalPhoto(f,$('photoCaption').value.trim());
  msg('photoMsg',r.error?r.error.message:'✓ Foto agregada a tus trabajos realizados.');
  if(!r.error){$('proPhoto').value='';$('photoCaption').value='';resolveRefreshOwnPhotos()}
}

async function resolveRenderPublicPhotos(professionalId,profilePhotoPath){
  const avatar=resolvePublicPhotoUrl(profilePhotoPath);
  if($('professionalProfilePhoto'))$('professionalProfilePhoto').innerHTML=avatar?'<img src="'+safe(avatar)+'" alt="Foto de perfil" style="width:92px;height:92px;object-fit:cover;border-radius:50%">':'';
  const r=await resolveLoadProfessionalPhotos(professionalId);
  $('professionalPhotos').innerHTML=r.data?.length?r.data.map(x=>x.public_url?'<div class="item"><img src="'+safe(x.public_url)+'" alt="Trabajo del profesional" style="width:100%;max-height:280px;object-fit:cover;border-radius:14px">'+(x.caption?'<p>'+safe(x.caption)+'</p>':'')+'</div>':'').join(''):'<div class="msg">Este profesional todavía no cargó fotos de trabajos realizados.</div>';
}
