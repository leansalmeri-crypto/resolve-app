// RESOLVÉ v3 - Bolsa de trabajo
async function resolveListJobs(db) {
  return db.from('job_posts').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(50);
}

async function resolveCreateJob(db, payload) {
  return db.from('job_posts').insert({
    employer_id: payload.employerId,
    title: payload.title,
    description: payload.description,
    trade: payload.trade || null,
    zone: payload.zone || null,
    is_active: true
  });
}

async function resolveApplyToJob(db, payload) {
  return db.from('job_applications').insert({
    applicant_id: payload.applicantId,
    applicant_name: payload.applicantName,
    applicant_phone: payload.applicantPhone,
    job_id: payload.jobId,
    message: payload.message || null,
    status: 'pending'
  });
}

async function resolveMyJobPosts(db, employerId) {
  return db.from('job_posts').select('*').eq('employer_id', employerId).order('created_at', { ascending: false });
}
