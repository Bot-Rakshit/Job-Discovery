-- Drop table if exists and recreate with proper structure
DROP TABLE IF EXISTS jobs;

-- Create jobs table for the job listings application
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  company_logo TEXT,
  location VARCHAR(255),
  job_type VARCHAR(100),
  salary_range VARCHAR(100),
  description TEXT NOT NULL,
  requirements TEXT,
  form_link TEXT,
  portal VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- Insert sample data
INSERT INTO jobs (title, company, company_logo, location, job_type, salary_range, description, requirements, form_link, portal) VALUES
('Senior Frontend Engineer', 'Vercel', '/placeholder.svg?height=40&width=40', 'San Francisco, CA', 'Full-time', '$120k - $180k', 'Join our team to build the future of web development. Work on cutting-edge technologies and help developers worldwide deploy better applications.', 'React, TypeScript, Next.js, 5+ years experience', 'https://vercel.com/careers', 'Company Website'),
('Product Designer', 'Linear', '/placeholder.svg?height=40&width=40', 'Remote', 'Full-time', '$100k - $150k', 'Design beautiful and functional interfaces for our project management platform. Collaborate with engineers to create pixel-perfect experiences.', 'Figma, Design Systems, 3+ years experience', 'https://linear.app/careers', 'Company Website'),
('Full Stack Developer', 'Stripe', '/placeholder.svg?height=40&width=40', 'New York, NY', 'Full-time', '$130k - $200k', 'Build and maintain payment infrastructure that powers millions of businesses worldwide. Work with modern technologies at scale.', 'Node.js, React, Python, 4+ years experience', 'https://stripe.com/jobs', 'LinkedIn'),
('DevOps Engineer', 'Railway', '/placeholder.svg?height=40&width=40', 'Remote', 'Contract', '$80k - $120k', 'Help us build the simplest cloud platform. Work on infrastructure, deployment pipelines, and developer experience.', 'Docker, Kubernetes, AWS, 3+ years experience', 'https://railway.app/careers', 'AngelList'),
('UI/UX Designer', 'Figma', '/placeholder.svg?height=40&width=40', 'San Francisco, CA', 'Full-time', '$110k - $160k', 'Shape the future of design tools used by millions of designers worldwide. Create intuitive interfaces and delightful user experiences.', 'Design Systems, Prototyping, User Research, 4+ years experience', 'https://figma.com/careers', 'Company Website'),
('Backend Engineer', 'Supabase', '/placeholder.svg?height=40&width=40', 'Remote', 'Full-time', '$100k - $150k', 'Build scalable backend infrastructure for the open source Firebase alternative. Work with PostgreSQL, real-time systems, and developer tools.', 'PostgreSQL, Node.js, Go, 3+ years experience', 'https://supabase.com/careers', 'AngelList');
