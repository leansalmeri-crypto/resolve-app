// RESOLVÉ v3 - módulo de profesionales
async function resolveSearchProfessionals(db, trade, zone) {
  let query = db.from('professional_directory').select('*');
  if (trade) query = query.ilike('trade', `%${trade}%`);
  if (zone) query = query.ilike('zone', `%${zone}%`);
  return query.limit(30);
}

async function resolveSaveProfessionalProfile(db, userId, values) {
  return db.from('profiles').update({
    trade: values.trade || null,
    zone: values.zone || null,
    bio: values.bio || null,
    updated_at: new Date().toISOString()
  }).eq('id', userId);
}

async function resolveCreateServiceRequest(db, payload) {
  return db.from('service_requests').insert({
    client_id: payload.clientId,
    client_name: payload.clientName,
    client_phone: payload.clientPhone,
    client_email: payload.clientEmail,
    professional_id: payload.professionalId,
    trade: payload.trade,
    zone: payload.zone,
    description: payload.description,
    status: 'pending'
  });
}
