// RESOLVÉ v3 - solicitudes y presupuestos
async function resolveClientRequests(db,userId){return db.from('service_requests').select('*').eq('client_id',userId).order('created_at',{ascending:false})}
async function resolveProfessionalRequests(db,userId){return db.from('service_requests').select('*').eq('professional_id',userId).order('created_at',{ascending:false})}
async function resolveSendQuote(db,requestId,professionalId,amount,message){
  const value=Number(amount);
  if(!Number.isFinite(value)||value<=0)return{data:null,error:{message:'Ingresá un importe válido para el presupuesto.'}};
  return db.from('service_requests').update({quote_amount:value,quote_message:(message||'').trim()||null,quoted_at:new Date().toISOString(),status:'quoted',updated_at:new Date().toISOString()}).eq('id',requestId).eq('professional_id',professionalId).eq('status','pending').select('*').maybeSingle()
}
async function resolveAcceptQuote(db,requestId,clientId){return db.from('service_requests').update({status:'accepted',updated_at:new Date().toISOString()}).eq('id',requestId).eq('client_id',clientId).eq('status','quoted').select('*').maybeSingle()}
async function resolveRejectQuote(db,requestId,clientId){return db.from('service_requests').update({status:'cancelled',updated_at:new Date().toISOString()}).eq('id',requestId).eq('client_id',clientId).eq('status','quoted').select('*').maybeSingle()}
async function resolveCompleteRequest(db,requestId,userId,role){let q=db.from('service_requests').update({status:'completed',updated_at:new Date().toISOString()}).eq('id',requestId).eq('status','accepted');q=role==='professional'?q.eq('professional_id',userId):q.eq('client_id',userId);return q.select('*').maybeSingle()}
