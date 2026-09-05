(()=>{
  if(window.__resolveStableSignup)return;window.__resolveStableSignup=1;
  const style=document.createElement('style');
  style.textContent=`
  #resolveSignupOverlay{position:fixed;inset:0;background:rgba(10,18,30,.64);z-index:100000;display:none;align-items:center;justify-content:center;padding:18px}
  #resolveSignupOverlay.show{display:flex}
  #resolveSignupCard{width:min(100%,430px);max-height:92vh;overflow:auto;background:#fff;border-radius:24px;padding:22px;box-shadow:0 24px 80px rgba(0,0,0,.28);position:relative;font-family:system-ui;color:#24324a}
  #resolveSignupCard h2{margin:0 0 6px;font-size:25px}#resolveSignupCard p{margin:0 0 14px;color:#6b7788}
  .rsField{display:block;width:100%;box-sizing:border-box;padding:14px;border:1px solid #d7dee8;border-radius:15px;font-size:16px;background:#fff;margin:8px 0;pointer-events:auto!important;touch-action:manipulation!important;-webkit-user-select:text!important;user-select:text!important;opacity:1!important}
  .rsBtn{width:100%;border:0;border-radius:15px;padding:14px;background:#24324a;color:#fff;font-weight:900;font-size:16px;margin-top:12px;touch-action:manipulation}
  .rsClose{position:absolute;right:14px;top:12px;border:0;background:#f3f5f8;border-radius:999px;width:36px;height:36px;font-size:20px}
  .rsShow{display:flex;gap:8px;align-items:center;margin:10px 0 2px;color:#52657a;font-size:14px}.rsShow input{width:18px;height:18px}
  #rsMsg{min-height:22px;margin-top:10px;font-size:14px;color:#9b2c2c}
  `;
  document.head.appendChild(style);
  const o=document.createElement('div');o.id='resolveSignupOverlay';
  o.innerHTML=`<div id="resolveSignupCard"><button class="rsClose" type="button" aria-label="Cerrar">×</button><h2>Crear mi cuenta</h2><p>Registrate gratis para usar RESOLVÉ.</p><input class="rsField" id="rsName" type="text" autocomplete="name" placeholder="Nombre y apellido"><input class="rsField" id="rsEmail" type="email" inputmode="email" autocomplete="email" placeholder="Email"><input class="rsField" id="rsPass1" type="password" autocomplete="new-password" placeholder="Contraseña"><input class="rsField" id="rsPass2" type="password" autocomplete="new-password" placeholder="Repetir contraseña"><label class="rsShow"><input id="rsShowPass" type="checkbox"> Mostrar contraseñas</label><button class="rsBtn" id="rsCreate" type="button">CREAR MI CUENTA GRATIS</button><div id="rsMsg"></div></div>`;
  document.body.appendChild(o);
  const q=id=>document.getElementById(id);
  q('resolveSignupCard').addEventListener('click',e=>e.stopPropagation());
  o.querySelector('.rsClose').onclick=()=>o.classList.remove('show');
  o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('show')});
  q('rsShowPass').onchange=e=>{const t=e.target.checked?'text':'password';q('rsPass1').type=t;q('rsPass2').type=t};
  function openSignup(){
    document.getElementById('resolveLoginOverlay')?.classList.remove('show');
    o.classList.add('show');
    setTimeout(()=>{const el=q('rsName');try{el.focus({preventScroll:true})}catch(_){el.focus()}},40);
  }
  window.openStableSignup=openSignup;
  q('rsCreate').onclick=async()=>{
    const msg=q('rsMsg'),full_name=q('rsName').value.trim(),email=q('rsEmail').value.trim(),p1=q('rsPass1').value,p2=q('rsPass2').value;
    if(!full_name||!email||!p1||!p2){msg.textContent='Completá nombre, email, contraseña y repetir contraseña.';return}
    if(p1.length<6){msg.textContent='La contraseña debe tener al menos 6 caracteres.';return}
    if(p1!==p2){msg.textContent='Las contraseñas no coinciden.';return}
    msg.textContent='Creando cuenta…';
    try{
      const {data,error}=await sb.auth.signUp({email,password:p1,options:{data:{role:'client',full_name}}});
      if(error)throw error;
      if(window.resolveTrack)window.resolveTrack('signup_complete',{role:'client'});
      if(data?.session){
        msg.style.color='#247a42';msg.textContent='¡Listo! Tu cuenta fue creada.';
        setTimeout(async()=>{o.classList.remove('show');if(typeof window.loadAccount==='function')await window.loadAccount();else if(typeof show==='function')show('account')},700);
      }else{
        msg.style.color='#247a42';msg.textContent='¡Listo! Revisá tu email para confirmar la cuenta.';
      }
    }catch(e){
      msg.style.color='#9b2c2c';
      const m=(e?.message||'').toLowerCase();
      msg.textContent=m.includes('already')||m.includes('registered')?'Ese email ya está registrado. Probá con “Ingresar a mi cuenta”.':'No se pudo crear la cuenta. Revisá los datos e intentá nuevamente.';
    }
  };
  document.addEventListener('click',e=>{
    const t=e.target.closest('button,a,[role="button"]');if(!t)return;
    const txt=(t.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(/crear mi cuenta|crear cuenta|crear usuario|registrarme|registrate gratis/.test(txt)){
      if(t.id==='rsCreate')return;
      e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();openSignup();
    }
  },true);
})();