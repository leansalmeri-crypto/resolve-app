(()=>{
  const css=document.createElement('style');
  css.textContent=`
  .resolveLoginOverlay{position:fixed;inset:0;background:rgba(10,18,30,.62);z-index:99999;display:none;align-items:center;justify-content:center;padding:18px}
  .resolveLoginOverlay.show{display:flex}
  .resolveLoginCard{width:min(100%,430px);background:#fff;border-radius:24px;padding:22px;box-shadow:0 24px 80px rgba(0,0,0,.28);position:relative}
  .resolveLoginCard h2{margin:0 0 6px;color:#24324a}.resolveLoginCard p{margin:0 0 16px;color:#6b7788}
  .resolveField{width:100%;padding:14px;border:1px solid #d7dee8;border-radius:15px;font-size:16px;background:#fff;margin:6px 0 10px}
  .resolvePassWrap{position:relative}.resolvePassWrap .resolveField{padding-right:54px;margin-bottom:0}.resolveEye{position:absolute;right:7px;top:7px;width:42px;height:42px;border:0;border-radius:12px;background:#f3f5f8;font-size:19px;cursor:pointer}
  .resolveLoginBtn{width:100%;border:0;border-radius:15px;padding:14px;background:#24324a;color:#fff;font-weight:900;font-size:16px;margin-top:14px}
  .resolveClose{position:absolute;right:14px;top:12px;border:0;background:#f3f5f8;border-radius:999px;width:36px;height:36px;font-size:20px}
  .resolveLoginMsg{min-height:22px;margin-top:10px;font-size:14px;color:#9b2c2c}
  .homeFeed{margin:14px 0}.homeFeed h2{margin:0 0 4px}.homeFeed .subcopy{color:#6b7788;margin-bottom:12px}.feedCard{border:1px solid #e4e9ef;border-radius:18px;padding:14px;margin:10px 0;background:linear-gradient(180deg,#fff,#fffdf9)}.feedCard b{font-size:17px;color:#24324a}.feedMeta{font-size:13px;color:#718096;margin-top:5px}.feedDesc{font-size:14px;color:#46556a;margin-top:8px;line-height:1.45}
  `;
  document.head.appendChild(css);

  const overlay=document.createElement('div');
  overlay.className='resolveLoginOverlay';
  overlay.id='resolveLoginOverlay';
  overlay.innerHTML=`<div class="resolveLoginCard"><button class="resolveClose" type="button" aria-label="Cerrar">×</button><h2>Ingresar a mi cuenta</h2><p>Accedé como cliente, profesional o administrador.</p><input class="resolveField" id="resolveLoginEmail" type="email" autocomplete="username" placeholder="Email"><div class="resolvePassWrap"><input class="resolveField" id="resolveLoginPassword" type="password" autocomplete="current-password" placeholder="Contraseña"><button class="resolveEye" id="resolveEye" type="button" aria-label="Mostrar contraseña">👁️</button></div><button class="resolveLoginBtn" id="resolveLoginBtn" type="button">INGRESAR</button><div class="resolveLoginMsg" id="resolveLoginMsg"></div></div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('.resolveClose').onclick=()=>overlay.classList.remove('show');
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('show')});
  document.getElementById('resolveEye').onclick=()=>{const i=document.getElementById('resolveLoginPassword');i.type=i.type==='password'?'text':'password';document.getElementById('resolveEye').textContent=i.type==='password'?'👁️':'🙈'};

  async function openStableLogin(){
    try{
      const {data:{user}}=await sb.auth.getUser();
      if(user){
        const {data:p}=await sb.from('profiles').select('role').eq('id',user.id).maybeSingle();
        if(p?.role==='admin'){location.href='/admin.html';return}
        if(typeof window.loadAccount==='function'){await window.loadAccount();return}
      }
    }catch(e){}
    overlay.classList.add('show');
    setTimeout(()=>document.getElementById('resolveLoginEmail').focus({preventScroll:true}),30);
  }
  window.openStableLogin=openStableLogin;

  document.getElementById('resolveLoginBtn').onclick=async()=>{
    const msg=document.getElementById('resolveLoginMsg');
    const email=document.getElementById('resolveLoginEmail').value.trim();
    const password=document.getElementById('resolveLoginPassword').value;
    if(!email||!password){msg.textContent='Completá email y contraseña.';return}
    msg.textContent='Ingresando…';
    try{
      const {error}=await sb.auth.signInWithPassword({email,password});
      if(error)throw error;
      const {data:{user}}=await sb.auth.getUser();
      const {data:p}=await sb.from('profiles').select('role').eq('id',user.id).maybeSingle();
      overlay.classList.remove('show');
      if(p?.role==='admin'){location.href='/admin.html';return}
      if(typeof window.loadAccount==='function'){await window.loadAccount();return}
      if(typeof show==='function')show('account');
    }catch(e){msg.textContent='No se pudo ingresar. Revisá el email y la contraseña.'}
  };
  document.getElementById('resolveLoginPassword').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('resolveLoginBtn').click()});

  document.addEventListener('click',e=>{
    const t=e.target.closest('button,a'); if(!t)return;
    const txt=(t.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(txt.includes('ingresar a mi cuenta')||txt==='mi cuenta'){
      e.preventDefault();e.stopImmediatePropagation();openStableLogin();
    }
  },true);

  function repairPasswordEyes(){
    document.querySelectorAll('input[type="password"]').forEach(inp=>{
      if(inp.id==='resolveLoginPassword')return;
      if(inp.dataset.eyeFixed)return;inp.dataset.eyeFixed='1';
      let parent=inp.parentElement;
      if(!parent)return;
      if(getComputedStyle(parent).position==='static')parent.style.position='relative';
      const b=document.createElement('button');b.type='button';b.textContent='👁️';b.setAttribute('aria-label','Mostrar contraseña');
      b.style.cssText='position:absolute;right:8px;top:50%;transform:translateY(-50%);width:40px;height:40px;border:0;border-radius:10px;background:#f2f4f7;font-size:18px;z-index:5';
      b.onclick=ev=>{ev.preventDefault();ev.stopPropagation();inp.type=inp.type==='password'?'text':'password';b.textContent=inp.type==='password'?'👁️':'🙈';inp.focus({preventScroll:true})};
      inp.style.paddingRight='52px';parent.appendChild(b);
    });
  }
  new MutationObserver(repairPasswordEyes).observe(document.body,{childList:true,subtree:true});repairPasswordEyes();

  async function loadHomeFeed(){
    const home=document.getElementById('home');if(!home||document.getElementById('homeFeed'))return;
    const holder=document.createElement('div');holder.id='homeFeed';holder.className='card homeFeed';holder.innerHTML='<h2>💼 Últimas oportunidades</h2><div class="subcopy">Los avisos nuevos van a aparecer automáticamente acá.</div><div id="homeFeedList">Cargando avisos…</div>';
    const cards=home.querySelectorAll('.card');
    if(cards.length>1)home.insertBefore(holder,cards[1]);else home.appendChild(holder);
    try{
      const {data,error}=await sb.from('job_posts').select('id,title,trade,zone,description,created_at,is_active').eq('is_active',true).order('created_at',{ascending:false}).limit(6);
      if(error)throw error;
      const list=document.getElementById('homeFeedList');
      if(!data?.length){list.innerHTML='<div class="sub">Todavía no hay avisos publicados. Cuando se publique el primero, va a aparecer acá.</div>';return}
      list.innerHTML=data.map(j=>`<div class="feedCard"><b>${esc(j.title||'Oportunidad laboral')}</b><div class="feedMeta">${esc(j.trade||'General')}${j.zone?' · '+esc(j.zone):''} · ${new Date(j.created_at).toLocaleDateString('es-AR')}</div>${j.description?`<div class="feedDesc">${esc(String(j.description).slice(0,180))}${String(j.description).length>180?'…':''}</div>`:''}</div>`).join('');
    }catch(e){document.getElementById('homeFeedList').innerHTML='<div class="sub">No pudimos cargar los avisos en este momento.</div>'}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(loadHomeFeed,150));else setTimeout(loadHomeFeed,150);
})();