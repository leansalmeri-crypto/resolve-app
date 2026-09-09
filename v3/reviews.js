// RESOLVÉ v3 - valoraciones
async function resolveCreateReview(db, payload) {
  if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
    return { error: { message: 'La valoración debe ser de 1 a 5 estrellas.' } };
  }
  return db.from('reviews').insert({
    client_id: payload.clientId,
    professional_id: payload.professionalId,
    service_request_id: payload.requestId,
    rating: payload.rating,
    comment: payload.comment || null
  });
}

async function resolveProfessionalReviews(db, professionalId) {
  return db.from('reviews').select('rating,comment,created_at').eq('professional_id', professionalId).order('created_at', { ascending: false });
}
