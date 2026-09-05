(()=>{
  if(window.__resolveAnalyticsLoaded)return;window.__resolveAnalyticsLoaded=true;
  const getSource=()=>{
    const q=new URLSearchParams(location.search);if(q.get('utm_source'))return q.get('utm_source').toLowerCase();
    try{const h=document.referrer?new URL(document.referrer).hostname.toLowerCase():'';if(h.includes('instagram'))return 'instagram';if(h.includes('facebook'))return 'facebook';if(h)return h}catch(e){}
    return 'direct';
  };
  const sid=(()=>{try{let v=sessionStorage.getItem('resolve_session_id');if(!v){v=(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2));sessionStorage.setItem('resolve_session_id',v)}return v}catch(e){return Date.now()+'-'+Math.random().toString(36).slice(2)}})();
  const vid=(()=>{try{let v=localStorage.getItem('resolve_visitor_id');if(!v){v=(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2));localStorage.setItem('resolve_visitor_id',v)}return v}catch(e){return null}})();
  const source=getSource();
  async function track(event_name,metadata={}){
    try{
      if(!window.sb?.from)return;
      let uid=null;try{const {data:{user}}=await sb.auth.getUser();uid=user?.id||null}catch(e){}
      await sb.from('analytics_events').insert({event_name,session_id:sid,user_id:uid,source,path:location.pathname,metadata:{visitor_id:vid,referrer:document.referrer||null,...metadata}});
    }catch(e){console.debug('analytics skip',e?.message||e)}
  }
  window.resolveTrack=track;
  track('page_view',{title:document.title});
  document.addEventListener('click',e=>{
    const t=e.target.closest('button,a');if(!t)return;const tx=(t.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(tx.includes('ingresar a mi cuenta')||tx==='mi cuenta')track('login_open');
    else if(tx.includes('crear una cuenta')||tx.includes('crear cuenta'))track('signup_open');
    else if(tx.includes('necesito un profesional'))track('service_intent');
    else if(tx.includes('soy profesional'))track('professional_intent');
    else if(tx.includes('bolsa de empleo')||tx.includes('oportunidades'))track('jobs_view');
    else if(tx.includes('publicar'))track('publish_intent');
  },true);
  try{sb.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN')track('login_success',{user_id:session?.user?.id||null});if(event==='SIGNED_OUT')track('logout')})}catch(e){}
})();