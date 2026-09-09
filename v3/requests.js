// RESOLVÉ v3 - solicitudes y presupuestos
async function resolveClientRequests(db, userId) {
  return db.from('service_requests').select('*').eq('client_id', userId).order('created_at', { ascending: false });
}

async function resolveProfessionalRequests(db, userId) {
  return db.from('service_requests').select('*').eq('professional_id', userId).order('created_at', { ascending: false });
}

async function resolveSendQuote(db, requestId, professionalId, amount, message) {
  return db.from('service_requests').update({
    quote_amount: amount,
    quote_message: message || null,
    quoted_at: new Date().toISOString(),
    status: 'quoted',
    updated_at: new Date().toISOString()
  }).eq('id', requestId).eq('professional_id', professionalId);
}

async function resolveAcceptQuote(db, requestId, clientId) {
  return db.from('service_requests').update({ status: 'accepted', updated_at: new Date().toISOString() }).eq('id', requestId).eq('client_id', clientId);
}

async function resolveCompleteRequest(db, requestId, userId, role) {
  let query = db.from('service_requests').update({ status: 'completed', updated_at: new Date().toISOString() }).eq('id', requestId);
  query = role === 'professional' ? query.eq('professional_id', userId) : query.eq('client_id', userId);
  return query;
}
