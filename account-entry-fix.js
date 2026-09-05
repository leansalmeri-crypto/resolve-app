(()=>{
  async function goAccount(){
    try{
      const {data:{user}}=await sb.auth.getUser();
      if(!user){ if(typeof show==='function') return show('login'); return; }
      const {data:p}=await sb.from('profiles').select('role').eq('id',user.id).maybeSingle();
      if(p?.role==='admin'){ location.href='/admin.html'; return; }
      if(typeof window.loadAccount==='function') return window.loadAccount();
      if(typeof show==='function') return show('account');
    }catch(e){ console.error('No se pudo abrir Mi cuenta',e); if(typeof show==='function') show('login'); }
  }
  window.goAccount=goAccount;
  document.addEventListener('click',e=>{
    const t=e.target.closest('button,a'); if(!t)return;
    const txt=(t.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(txt==='ingresar a mi cuenta'||txt==='mi cuenta'){
      e.preventDefault(); e.stopPropagation(); goAccount();
    }
  },true);
  setTimeout(()=>{
    [...document.querySelectorAll('button,a')].forEach(el=>{
      const txt=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      if(txt==='ingresar a mi cuenta'||txt==='mi cuenta'){
        el.style.cursor='pointer';
        el.setAttribute('data-account-entry','1');
      }
    });
  },300);
})();