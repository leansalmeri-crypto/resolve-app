(()=>{
 if(window.__resolveModalCloseFix)return;window.__resolveModalCloseFix=1;
 function closeLogin(){
   const overlay=document.getElementById('resolveLoginOverlay');
   if(overlay){overlay.classList.remove('show');overlay.style.display='none';setTimeout(()=>{overlay.style.display=''},0)}
   try{document.activeElement?.blur?.()}catch(e){}
 }
 window.resolveCloseLogin=closeLogin;
 function isClose(el){
   if(!el)return false;
   const btn=el.closest?.('button,[role="button"]');
   if(!btn)return false;
   const aria=(btn.getAttribute('aria-label')||'').trim().toLowerCase();
   const text=(btn.textContent||'').trim();
   return btn.classList.contains('resolveClose')||aria==='cerrar'||text==='×'||text==='✕'||text==='x';
 }
 window.addEventListener('pointerup',e=>{if(!isClose(e.target))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();closeLogin()},true);
 window.addEventListener('click',e=>{if(!isClose(e.target))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();closeLogin()},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLogin()});
})();