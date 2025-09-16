export type ExperienceItem = { company?: string; date?: string };
export type EducationItem = { name?: string; date?: string };
export type CertificationItem = { name?: string; date?: string };
export type LanguageItem = { name?: string; level?: number };

export type FormValues = {
  fullname: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  certifications: CertificationItem[]
  languages: LanguageItem[]
}