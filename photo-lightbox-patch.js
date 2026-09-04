(function(){
  const old=document.getElementById('resolvePhotoLightbox'); if(old)old.remove();
  const css=document.createElement('style');
  css.textContent=`#resolvePhotoLightbox{position:fixed;inset:0;z-index:2147483647;background:rgba(10,18,28,.95);display:none;align-items:center;justify-content:center;padding:18px;box-sizing:border-box}#resolvePhotoLightbox.open{display:flex}#resolvePhotoLightbox img{display:block;max-width:94vw;max-height:86vh;width:auto!important;height:auto!important;object-fit:contain!important;border-radius:14px;box-shadow:0 12px 45px rgba(0,0,0,.45)}#resolvePhotoLightbox button{position:absolute;top:max(18px,env(safe-area-inset-top));right:18px;width:46px;height:46px;border:0;border-radius:50%;background:#fff;color:#18283b;font-size:30px;line-height:42px;font-weight:700;z-index:2}[data-resolve-photo-button]{display:block;width:100%;padding:0;border:0;background:transparent;cursor:zoom-in}`;
  document.head.appendChild(css);
  const box=document.createElement('div'); box.id='resolvePhotoLightbox'; box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true'); box.innerHTML='<button type="button" aria-label="Cerrar">×</button><img alt="Foto ampliada">'; document.body.appendChild(box);
  const big=box.querySelector('img');
  function close(){box.classList.remove('open');big.removeAttribute('src');document.body.style.overflow=''}
  function open(src,alt){if(!src)return;big.src=src;big.alt=alt||'Foto ampliada';box.classList.add('open');document.body.style.overflow='hidden'}
  window.openResolvePhoto=open;
  window.closeResolvePhoto=close;
  box.querySelector('button').addEventListener('click',function(e){e.preventDefault();e.stopPropagation();close()});
  box.addEventListener('click',function(e){if(e.target===box){e.preventDefault();e.stopPropagation();close()}});
  document.addEventListener('click',function(e){
    const btn=e.target && e.target.closest ? e.target.closest('[data-resolve-photo-button]') : null;
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    open(btn.getAttribute('data-src'),btn.getAttribute('data-alt')||'Foto ampliada');
    return false;
  },true);
})();