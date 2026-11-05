import { useState } from 'react';

const emptyJob = {
  title: '',
  company: '',
  companyLogo: '',
  location: '',
  type: 'Full-time',
  experience: '',
  salaryMin: '',
  salaryMax: '',
  category: '',
  description: '',
  skills: '',
  responsibilities: '',
  benefits: '',
  companyAbout: '',
  companyWebsite: '',
};

function JobForm({ initialData, onSubmit, onCancel }) {
 const [formData, setFormData] = useState(() => {
  if (!initialData) {
    return emptyJob;
  }

  return {
    title: initialData.title || '',
    company: initialData.company || '',
    companyLogo: initialData.companyLogo || '',
    location: initialData.location || '',
    type: initialData.type || 'Full-time',
    experience: initialData.experience || '',
    salaryMin: initialData.salary?.min ?? '',
    salaryMax: initialData.salary?.max ?? '',
    category: initialData.category || '',
    description: initialData.description || '',
    skills: Array.isArray(initialData.skills)
      ? initialData.skills.join(', ')
      : '',
    responsibilities: Array.isArray(initialData.responsibilities)
      ? initialData.responsibilities.join('\n')
      : '',
    benefits: Array.isArray(initialData.benefits)
      ? initialData.benefits.join('\n')
      : '',
    companyAbout: initialData.companyInfo?.about || '',
    companyWebsite: initialData.companyInfo?.website || '',
  };
});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.salaryMin) {
      newErrors.salaryMin = 'Minimum salary is required';
    } else if (Number(formData.salaryMin) <= 0) {
      newErrors.salaryMin = 'Minimum salary must be greater than 0';
    }

    if (!formData.salaryMax) {
      newErrors.salaryMax = 'Maximum salary is required';
    } else if (Number(formData.salaryMax) <= Number(formData.salaryMin)) {
      newErrors.salaryMax = 'Maximum salary must be greater than minimum';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const jobPayload = {
      title: formData.title.trim(),
      company: formData.company.trim(),
      companyLogo:
        formData.companyLogo.trim() ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.company.trim())}`,
      location: formData.location.trim(),
      type: formData.type,
      experience: formData.experience.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      skills: skillsArray,
      salary: {
        min: Number(formData.salaryMin),
        max: Number(formData.salaryMax),
        currency: 'INR',
      },
      postedDate: initialData?.postedDate || new Date().toISOString().split('T')[0],
      featured: initialData?.featured || false,
      responsibilities: formData.responsibilities
  .split('\n')
  .map((item) => item.trim())
  .filter((item) => item.length > 0),

benefits: formData.benefits
  .split('\n')
  .map((item) => item.trim())
  .filter((item) => item.length > 0),

companyInfo: {
  about: formData.companyAbout.trim(),
  website: formData.companyWebsite.trim(),
},
    };

    onSubmit(jobPayload);
  };

  return (
    <form className="job-form" onSubmit={handleSubmit} noValidate>
      <div className="job-form-row">
        <div className="job-form-field">
          <label htmlFor="title">Job Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'input-error' : ''}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="job-form-field">
          <label htmlFor="company">Company *</label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            className={errors.company ? 'input-error' : ''}
          />
          {errors.company && <span className="field-error">{errors.company}</span>}
        </div>
      </div>

      <div className="job-form-row">
        <div className="job-form-field">
          <label htmlFor="location">Location *</label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className={errors.location ? 'input-error' : ''}
          />
          {errors.location && <span className="field-error">{errors.location}</span>}
        </div>

        <div className="job-form-field">
          <label htmlFor="type">Job Type *</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange}>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      <div className="job-form-row">
        <div className="job-form-field">
          <label htmlFor="experience">Experience *</label>
          <input
            id="experience"
            name="experience"
            type="text"
            placeholder="e.g. 2-4 years"
            value={formData.experience}
            onChange={handleChange}
            className={errors.experience ? 'input-error' : ''}
          />
          {errors.experience && <span className="field-error">{errors.experience}</span>}
        </div>

        <div className="job-form-field">
          <label htmlFor="category">Category *</label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="e.g. Engineering"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'input-error' : ''}
          />
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>
      </div>

      <div className="job-form-row">
        <div className="job-form-field">
          <label htmlFor="salaryMin">Minimum Salary (₹) *</label>
          <input
            id="salaryMin"
            name="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={handleChange}
            className={errors.salaryMin ? 'input-error' : ''}
          />
          {errors.salaryMin && <span className="field-error">{errors.salaryMin}</span>}
        </div>

        <div className="job-form-field">
          <label htmlFor="salaryMax">Maximum Salary (₹) *</label>
          <input
            id="salaryMax"
            name="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={handleChange}
            className={errors.salaryMax ? 'input-error' : ''}
          />
          {errors.salaryMax && <span className="field-error">{errors.salaryMax}</span>}
        </div>
      </div>

      <div className="job-form-field">
        <label htmlFor="skills">Skills (comma-separated)</label>
        <input
          id="skills"
          name="skills"
          type="text"
          placeholder="e.g. React, JavaScript, CSS"
          value={formData.skills}
          onChange={handleChange}
        />
      </div>

      <div className="job-form-field">
        <label htmlFor="description">Description * (min. 20 characters)</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'input-error' : ''}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      {/* Job Responsibilities */}
<div className="job-form-field">
  <label htmlFor="responsibilities">
    Job Responsibilities
  </label>
  <textarea
    id="responsibilities"
    name="responsibilities"
    rows="5"
    placeholder={'Enter each responsibility on a new line:\nDevelop REST APIs\nMaintain backend services\nFix bugs and improve performance'}
    value={formData.responsibilities}
    onChange={handleChange}
  />
</div>

{/* Employee Benefits */}
<div className="job-form-field">
  <label htmlFor="benefits">
    Employee Benefits
  </label>
  <textarea
    id="benefits"
    name="benefits"
    rows="4"
    placeholder={'Enter each benefit on a new line:\nHealth insurance\nPaid leaves\nWork from home'}
    value={formData.benefits}
    onChange={handleChange}
  />
</div>

{/* Company Information */}
<div className="job-form-field">
  <label htmlFor="companyAbout">
    About Company
  </label>
  <textarea
    id="companyAbout"
    name="companyAbout"
    rows="4"
    placeholder="Write a short description about the company"
    value={formData.companyAbout}
    onChange={handleChange}
  />
</div>

<div className="job-form-field">
  <label htmlFor="companyWebsite">
    Company Website
  </label>
  <input
    id="companyWebsite"
    name="companyWebsite"
    type="url"
    placeholder="https://example.com"
    value={formData.companyWebsite}
    onChange={handleChange}
  />
</div>
      <div className="job-form-actions">
        <button type="button" className="job-form-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="job-form-submit">
          {initialData ? 'Save Changes' : 'Add Job'}
        </button>
      </div>
    </form>
  );
}

export default JobForm;