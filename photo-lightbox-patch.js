(function(){
  const css=document.createElement('style');
  css.textContent=`#resolvePhotoLightbox{position:fixed;inset:0;z-index:99999;background:rgba(10,18,28,.94);display:none;align-items:center;justify-content:center;padding:18px}#resolvePhotoLightbox.open{display:flex}#resolvePhotoLightbox img{max-width:96vw;max-height:88vh;object-fit:contain;border-radius:14px;box-shadow:0 12px 45px rgba(0,0,0,.45)}#resolvePhotoLightbox button{position:absolute;top:max(18px,env(safe-area-inset-top));right:18px;width:46px;height:46px;border:0;border-radius:50%;background:#fff;color:#18283b;font-size:30px;line-height:42px;font-weight:700}#profileGallery img{cursor:zoom-in!important}`;
  document.head.appendChild(css);

  const box=document.createElement('div');
  box.id='resolvePhotoLightbox';
  box.innerHTML='<button type="button" aria-label="Cerrar">×</button><img alt="Foto ampliada del trabajo">';
  document.body.appendChild(box);
  const big=box.querySelector('img');

  function closeLightbox(){box.classList.remove('open');big.removeAttribute('src');document.body.style.overflow=''}
  function openLightbox(src,alt){if(!src)return;big.src=src;big.alt=alt||'Foto ampliada del trabajo';box.classList.add('open');document.body.style.overflow='hidden'}
  window.openResolvePhoto=openLightbox;
  window.closeResolvePhoto=closeLightbox;

  box.querySelector('button').onclick=closeLightbox;
  box.onclick=function(e){if(e.target===box)closeLightbox()};

  document.addEventListener('click',function(e){
    const img=e.target;
    if(!img || img.tagName!=='IMG' || box.contains(img)) return;
    const gallery=document.getElementById('profileGallery');
    if(gallery && gallery.contains(img)){
      e.preventDefault();
      e.stopPropagation();
      openLightbox(img.currentSrc||img.src,img.alt);
    }
  },true);

  const oldOpenProfile=window.openProfile;
  if(typeof oldOpenProfile==='function'){
    window.openProfile=async function(id){
      await oldOpenProfile(id);
      const gallery=document.getElementById('profileGallery');
      if(gallery){
        gallery.querySelectorAll('img').forEach(function(img){
          img.setAttribute('data-professional-photo','1');
          img.onclick=function(ev){ev.preventDefault();ev.stopPropagation();openLightbox(img.currentSrc||img.src,img.alt)};
        });
      }
    };
  }
})();