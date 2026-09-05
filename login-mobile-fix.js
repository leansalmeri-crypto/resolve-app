(()=>{
  function safeToggle(btn){
    const wrap=btn.closest('.field,.inputWrap,.password-wrap,.passwordField,form,div');
    let input=null;
    const targetId=btn.dataset.target||btn.getAttribute('aria-controls');
    if(targetId) input=document.getElementById(targetId);
    if(!input&&wrap) input=wrap.querySelector('input[type="password"],input[data-password],input[type="text"][data-was-password="1"]');
    if(!input){
      const all=[...document.querySelectorAll('input[type="password"],input[data-was-password="1"]')];
      input=all.find(i=>i.getBoundingClientRect().top<=btn.getBoundingClientRect().bottom+40&&i.getBoundingClientRect().bottom>=btn.getBoundingClientRect().top-40)||all[0];
    }
    if(!input)return;
    const show=input.type==='password';
    input.type=show?'text':'password';
    input.dataset.wasPassword='1';
    btn.textContent=show?'🙈':'👁️';
    btn.setAttribute('aria-label',show?'Ocultar contraseña':'Mostrar contraseña');
    input.focus({preventScroll:true});
  }

  function patch(){
    document.querySelectorAll('input[type="password"],input[data-was-password="1"]').forEach(input=>{
      input.style.fontSize='16px';
      input.style.minHeight='48px';
      input.setAttribute('autocomplete',input.id&&/repeat|confirm/i.test(input.id)?'new-password':'current-password');
      input.addEventListener('focus',()=>{
        setTimeout(()=>{
          const r=input.getBoundingClientRect();
          const vh=window.visualViewport?.height||window.innerHeight;
          if(r.bottom>vh-20||r.top<80) input.scrollIntoView({block:'center',behavior:'smooth'});
        },250);
      },{passive:true});
    });

    [...document.querySelectorAll('button,a')].forEach(btn=>{
      const txt=(btn.textContent||'').trim();
      const cls=(btn.className||'').toString();
      const looksEye=/👁|🙈|eye|password/i.test(txt+' '+cls+' '+(btn.getAttribute('aria-label')||''));
      if(!looksEye)return;
      if(btn.tagName==='BUTTON')btn.type='button';
      if(btn.dataset.loginEyeFixed==='1')return;
      btn.dataset.loginEyeFixed='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();safeToggle(btn)},true);
      btn.style.touchAction='manipulation';
      btn.style.minWidth='44px';
      btn.style.minHeight='44px';
    });

    const loginSection=document.getElementById('login')||document.querySelector('[data-view="login"],.login,.loginCard');
    if(loginSection){
      loginSection.querySelectorAll('input,button').forEach(el=>{el.style.touchAction='manipulation'});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);else patch();
  new MutationObserver(()=>patch()).observe(document.documentElement,{subtree:true,childList:true});
})();