(()=>{
  function safeToggle(btn){
    const wrap=btn.closest('.field,.inputWrap,.password-wrap,.passwordField,.resolvePassWrap,form,div');
    let input=null;
    const targetId=btn.dataset.target||btn.getAttribute('aria-controls');
    if(targetId) input=document.getElementById(targetId);
    if(!input&&wrap) input=wrap.querySelector('input[type="password"],input[data-password],input[type="text"][data-was-password="1"]');
    if(!input)return;
    const show=input.type==='password';
    input.type=show?'text':'password';
    input.dataset.wasPassword='1';
    btn.textContent=show?'🙈':'👁️';
    btn.setAttribute('aria-label',show?'Ocultar contraseña':'Mostrar contraseña');
    try{input.focus({preventScroll:true})}catch(_){input.focus()}
  }

  function patchInput(input){
    if(input.dataset.mobilePasswordReady==='1')return;
    input.dataset.mobilePasswordReady='1';
    input.style.fontSize='16px';
    input.style.minHeight='48px';
    input.style.pointerEvents='auto';
    input.style.touchAction='manipulation';
    input.style.webkitUserSelect='text';
    input.style.userSelect='text';
    input.style.opacity='1';
    input.readOnly=false;
    input.disabled=false;
    const context=(input.id+' '+input.name+' '+input.placeholder+' '+(input.closest('form,section,div')?.textContent||'')).toLowerCase();
    input.setAttribute('autocomplete',/crear|registr|repet|confirm|nueva|new/.test(context)?'new-password':'current-password');
    input.addEventListener('touchstart',()=>{}, {passive:true});
  }

  function patch(){
    document.querySelectorAll('input[type="password"],input[data-was-password="1"]').forEach(patchInput);

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

    document.querySelectorAll('#login,#signup,#register,[data-view="login"],[data-view="signup"],.login,.loginCard,.resolveLoginOverlay').forEach(section=>{
      section.querySelectorAll('input,button').forEach(el=>{el.style.touchAction='manipulation';el.style.pointerEvents='auto'});
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);else patch();
  new MutationObserver(()=>patch()).observe(document.documentElement,{subtree:true,childList:true});
})();