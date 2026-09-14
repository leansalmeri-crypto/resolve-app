// Blindaje de autenticación/perfil para RESOLVÉ v3
let resolveRecoveryMode=false;
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
function resolveShowPasswordRecovery(){
 resolveRecoveryMode=true;go('guest');
 let card=document.getElementById('passwordRecoveryCard');
 if(!card){card=document.createElement('div');card.id='passwordRecoveryCard';card.className='card';card.innerHTML='<span class="badge">RECUPERAR CUENTA</span><h2>Elegí una nueva contraseña</h2><input id="newPassword" type="password" placeholder="Nueva contraseña"><input id="newPassword2" type="password" placeholder="Repetir nueva contraseña"><button onclick="resolveUpdatePassword()">Guardar nueva contraseña</button><div id="recoveryMsg"></div>';document.getElementById('guest').prepend(card)}
 card.classList.remove('hidden');
}
async function resolveUpdatePassword(){const p=document.getElementById('newPassword').value,p2=document.getElementById('newPassword2').value;if(p.length<6)return msg('recoveryMsg','La contraseña debe tener al menos 6 caracteres.');if(p!==p2)return msg('recoveryMsg','Las contraseñas no coinciden.');const r=await db.auth.updateUser({password:p});if(r.error)return msg('recoveryMsg','No pudimos actualizar la contraseña. Pedí un nuevo enlace e intentá otra vez.');resolveRecoveryMode=false;msg('recoveryMsg','✓ Contraseña actualizada correctamente.');setTimeout(()=>boot(),700)}
async function resolveBootSafe(){
 session=(await db.auth.getSession()).data.session;
 if(resolveRecoveryMode)return resolveShowPasswordRecovery();
 if(!session){profile=null;return go('guest')}
 await resolveEnsureProfile();
 go('home');
}
function resolveInstallRecoveryListener(){if(!window.db)return setTimeout(resolveInstallRecoveryListener,50);db.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY')resolveShowPasswordRecovery()})}
setTimeout(resolveInstallRecoveryListener,0);
