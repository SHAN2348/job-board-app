export function mapJobFromAPI(job) {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    companyLogo: job.company_logo,
    location: job.location,
    type: job.job_type,
    experience: job.experience,

    salary: {
      min: Number(job.salary_min),
      max: Number(job.salary_max),
      currency: job.salary_currency,
    },

    postedDate: job.posted_date,
    category: job.category,
    featured: job.featured,
    description: job.description,
    responsibilities: job.responsibilities,
    skills: job.skills,
    benefits: job.benefits,
    companyInfo: job.company_info,
  };
}


export function mapJobToAPI(job) {
  return {
    title: job.title,
    company: job.company,
    company_logo: job.companyLogo,
    location: job.location,
    job_type: job.type,
    experience: job.experience,
    salary_min: job.salary.min,
    salary_max: job.salary.max,
    salary_currency: job.salary.currency,
    posted_date: job.postedDate,
    category: job.category,
    featured: job.featured,
    description: job.description,
    responsibilities: job.responsibilities,
    skills: job.skills,
    benefits: job.benefits,
    company_info: job.companyInfo,
  };
}
