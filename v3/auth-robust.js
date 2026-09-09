// Blindaje de autenticación/perfil para RESOLVÉ v3
async function resolveEnsureProfile(){
 if(!session)return null;
 let r=await db.from('profiles').select('*').eq('id',session.user.id).maybeSingle();
 if(r.error){console.error('profile read',r.error);return null}
 if(r.data){profile=r.data;return profile}
 const m=session.user.user_metadata||{};
 const payload={id:session.user.id,full_name:m.full_name||session.user.email||'Usuario',role:m.role==='professional'?'professional':'client',phone:m.phone||null};
 let u=await db.from('profiles').insert(payload).select('*').single();
 if(u.error){console.error('profile create',u.error);return null}
 profile=u.data;return profile;
}
async function resolveBootSafe(){
 session=(await db.auth.getSession()).data.session;
 if(!session){profile=null;return go('guest')}
 await resolveEnsureProfile();
 go('home');
}
