(function(){
  const old=document.getElementById('resolvePhotoLightbox'); if(old)old.remove();
  const css=document.createElement('style');
  css.textContent=`#resolvePhotoLightbox{position:fixed;inset:0;z-index:99999;background:rgba(10,18,28,.94);display:none;align-items:center;justify-content:center;padding:18px}#resolvePhotoLightbox.open{display:flex}#resolvePhotoLightbox img{max-width:96vw;max-height:88vh;width:auto;height:auto;object-fit:contain;border-radius:14px;box-shadow:0 12px 45px rgba(0,0,0,.45)}#resolvePhotoLightbox button{position:absolute;top:max(18px,env(safe-area-inset-top));right:18px;width:46px;height:46px;border:0;border-radius:50%;background:#fff;color:#18283b;font-size:30px;line-height:42px;font-weight:700}`;
  document.head.appendChild(css);
  const box=document.createElement('div'); box.id='resolvePhotoLightbox'; box.innerHTML='<button type="button" aria-label="Cerrar">×</button><img alt="Foto ampliada">'; document.body.appendChild(box);
  const big=box.querySelector('img');
  function close(){box.classList.remove('open');big.removeAttribute('src');document.body.style.overflow=''}
  window.openResolvePhoto=function(src,alt){if(!src)return;big.src=src;big.alt=alt||'Foto ampliada';box.classList.add('open');document.body.style.overflow='hidden'};
  window.closeResolvePhoto=close;
  box.querySelector('button').onclick=close; box.onclick=e=>{if(e.target===box)close()};
})();