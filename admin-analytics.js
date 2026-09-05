import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const sbA=createClient('https://birlzgiwoswenizlsmqu.supabase.co','sb_publishable_XXkcnb6fngBwyyh0NW7gbg_JX5fxRuL');
const escA=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const startOfToday=()=>{const d=new Date();d.setHours(0,0,0,0);return d.toISOString()};
async function renderAnalytics(){
  try{
    const {data:{user}}=await sbA.auth.getUser();if(!user)return;
    const {data:p}=await sbA.from('profiles').select('role').eq('id',user.id).maybeSingle();if(p?.role!=='admin')return;
    let host=document.getElementById('analyticsAdminCard');
    if(!host){host=document.createElement('div');host.id='analyticsAdminCard';host.className='card';host.innerHTML='<h2>📊 Visitas y conversiones</h2><div id="analyticsAdminBody" class="sub">Cargando métricas…</div>';const panel=document.getElementById('panel');const kpis=document.getElementById('kpis');panel.insertBefore(host,kpis?.nextSibling||panel.firstChild)}
    const since7=new Date(Date.now()-7*86400000).toISOString();
    const since30=new Date(Date.now()-30*86400000).toISOString();
    const [ev7,ev30,prof,req,jobs]=await Promise.all([
      sbA.from('analytics_events').select('event_name,session_id,source,created_at').gte('created_at',since7).limit(10000),
      sbA.from('analytics_events').select('event_name,session_id,source,created_at').gte('created_at',since30).limit(10000),
      sbA.from('profiles').select('id,role,created_at').neq('role','admin'),
      sbA.from('service_requests').select('id,created_at'),
      sbA.from('job_posts').select('id,created_at')
    ]);
    const err=[ev7,ev30,prof,req,jobs].find(x=>x.error)?.error;if(err)throw err;
    const page7=(ev7.data||[]).filter(x=>x.event_name==='page_view');const page30=(ev30.data||[]).filter(x=>x.event_name==='page_view');
    const unique=a=>new Set(a.map(x=>x.session_id).filter(Boolean)).size;
    const todayIso=startOfToday();const today=page30.filter(x=>x.created_at>=todayIso);
    const ig7=page7.filter(x=>x.source==='instagram');
    const regs=(prof.data||[]).length,requests=(req.data||[]).length,jobCount=(jobs.data||[]).length;
    const conv=unique(page30)?((regs/unique(page30))*100).toFixed(1):'0.0';
    const body=document.getElementById('analyticsAdminBody');
    body.innerHTML=`<div class="grid"><div class="card kpi"><b>${unique(today)}</b><span>Visitas hoy</span></div><div class="card kpi"><b>${unique(page7)}</b><span>Visitas 7 días</span></div><div class="card kpi"><b>${unique(page30)}</b><span>Visitas 30 días</span></div><div class="card kpi"><b>${unique(ig7)}</b><span>Desde Instagram · 7 días</span></div><div class="card kpi"><b>${regs}</b><span>Registros reales</span></div><div class="card kpi"><b>${requests}</b><span>Solicitudes reales</span></div><div class="card kpi"><b>${jobCount}</b><span>Avisos publicados</span></div><div class="card kpi"><b>${conv}%</b><span>Visita → registro · 30 días</span></div></div><p class="sub">La medición de visitas empezó desde que activamos este sistema. Los registros, solicitudes y avisos se toman directamente de la base real.</p>`;
  }catch(e){const b=document.getElementById('analyticsAdminBody');if(b)b.innerHTML='<span class="bad">No pudimos cargar las métricas: '+escA(e?.message||e)+'</span>'}
}
setInterval(()=>{if(!document.getElementById('panel')?.classList.contains('hidden'))renderAnalytics()},15000);
setTimeout(renderAnalytics,900);
document.getElementById('refresh')?.addEventListener('click',()=>setTimeout(renderAnalytics,250));