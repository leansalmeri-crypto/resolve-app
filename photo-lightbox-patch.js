(function(){
  const css=document.createElement('style');
  css.textContent=`#resolvePhotoLightbox{position:fixed;inset:0;z-index:99999;background:rgba(10,18,28,.94);display:none;align-items:center;justify-content:center;padding:18px}#resolvePhotoLightbox.open{display:flex}#resolvePhotoLightbox img{max-width:96vw;max-height:88vh;object-fit:contain;border-radius:14px;box-shadow:0 12px 45px rgba(0,0,0,.45)}#resolvePhotoLightbox button{position:absolute;top:max(18px,env(safe-area-inset-top));right:18px;width:46px;height:46px;border:0;border-radius:50%;background:#fff;color:#18283b;font-size:30px;line-height:42px;font-weight:700}img[src*="professional-work"],img[data-professional-photo]{cursor:zoom-in}`;
  document.head.appendChild(css);
  const box=document.createElement('div');box.id='resolvePhotoLightbox';box.innerHTML='<button type="button" aria-label="Cerrar">×</button><img alt="Foto ampliada del trabajo">';document.body.appendChild(box);
  const big=box.querySelector('img');
  function close(){box.classList.remove('open');big.removeAttribute('src');document.body.style.overflow=''}
  function open(src,alt){if(!src)return;big.src=src;big.alt=alt||'Foto ampliada del trabajo';box.classList.add('open');document.body.style.overflow='hidden'}
  box.querySelector('button').addEventListener('click',close);box.addEventListener('click',e=>{if(e.target===box)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  document.addEventListener('click',e=>{const img=e.target.closest&&e.target.closest('img');if(!img||box.contains(img))return;const src=img.currentSrc||img.src||'';if(src.includes('professional-work')||img.hasAttribute('data-professional-photo')||img.closest('.gallery')){e.preventDefault();open(src,img.alt)}});
})();