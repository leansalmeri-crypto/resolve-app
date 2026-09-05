(()=>{
  async function goAccount(){
    try{
      const {data:{user}}=await sb.auth.getUser();
      if(!user){
        if(typeof window.openStableLogin==='function') return window.openStableLogin();
        if(typeof window.show==='function') return window.show('login');
        if(typeof show==='function') return show('login');
        return;
      }
      const {data:p}=await sb.from('profiles').select('role').eq('id',user.id).maybeSingle();
      if(p?.role==='admin'){ window.location.assign('/admin.html'); return; }
      if(typeof window.loadAccount==='function') return window.loadAccount();
      if(typeof window.show==='function') return window.show('account');
      if(typeof show==='function') return show('account');
    }catch(e){
      console.error('No se pudo abrir Mi cuenta',e);
      try{
        if(typeof window.openStableLogin==='function') return window.openStableLogin();
        if(typeof window.show==='function') window.show('login');
        else if(typeof show==='function') show('login');
      }catch(_){}
    }
  }
  window.goAccount=goAccount;
  function isExternalOrSocial(el){
    if(!el)return false;
    const a=el.closest?.('a[href]');
    if(!a)return false;
    const href=a.getAttribute('href')||'';
    return a.id==='resolve-ig'||a.id==='resolve-fb'||/^https?:\/\//i.test(href)||/instagram\.com|facebook\.com/i.test(href);
  }
  function isAccountTrigger(el){
    if(!el||isExternalOrSocial(el))return false;
    const txt=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    const aria=(el.getAttribute?.('aria-label')||'').toLowerCase();
    const title=(el.getAttribute?.('title')||'').toLowerCase();
    return (txt.includes('ingresar')&&txt.includes('cuenta')) || txt==='mi cuenta' || aria.includes('mi cuenta') || title.includes('mi cuenta');
  }
  document.addEventListener('click',e=>{
    if(isExternalOrSocial(e.target))return;
    let el=e.target;
    while(el&&el!==document.body&&!isAccountTrigger(el)) el=el.parentElement;
    if(el&&isAccountTrigger(el)){
      e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation(); goAccount();
    }
  },true);
  function wire(){
    document.querySelectorAll('button,a,[role="button"],div,span').forEach(el=>{
      if(isAccountTrigger(el)){
        el.style.cursor='pointer';
        el.setAttribute('data-account-entry','1');
        if(el.tagName==='A') el.setAttribute('href','#');
      }
    });
  }
  wire();
  new MutationObserver(wire).observe(document.documentElement,{childList:true,subtree:true});
})();