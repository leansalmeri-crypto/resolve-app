(()=>{
 if(window.__resolveEarlyUiGuard)return;window.__resolveEarlyUiGuard=1;
 const closeVisibleModal=()=>{
   let closed=false;
   const login=document.getElementById('resolveLoginOverlay');
   if(login&&login.classList.contains('show')){login.classList.remove('show');closed=true;}
   const signup=document.getElementById('resolveSignupOverlay');
   if(signup&&signup.classList.contains('show')){signup.classList.remove('show');closed=true;}
   if(closed){try{document.activeElement?.blur?.()}catch(e){};try{window.scrollTo({top:window.scrollY})}catch(e){}}
   return closed;
 };
 const isCloseTarget=t=>{
   if(!t)return false;
   const el=t.closest?.('.resolveClose,.rsClose,[aria-label="Cerrar"],[data-resolve-close]');
   if(el)return true;
   const txt=(t.textContent||'').trim();
   return txt==='×' || txt==='✕' || txt==='✖';
 };
 const handler=e=>{
   const path=e.composedPath?.()||[];
   const target=path.find(isCloseTarget)||e.target;
   if(isCloseTarget(target)){
     closeVisibleModal();
     e.preventDefault();
     e.stopPropagation();
     e.stopImmediatePropagation?.();
   }
 };
 window.addEventListener('pointerdown',handler,true);
 window.addEventListener('touchstart',handler,{capture:true,passive:false});
 window.addEventListener('click',handler,true);
 window.resolveCloseVisibleModal=closeVisibleModal;
})();