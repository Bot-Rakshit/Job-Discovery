import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Job {
  id: number
  title: string
  company: string
  company_logo?: string
  location?: string
  job_type?: string
  salary_range?: string
  description: string
  requirements?: string
  form_link?: string
  portal?: string
  created_at: string
  updated_at: string
}

export interface JobFilters {
  location?: string
  job_type?: string
  company?: string
  search?: string
}

export async function getJobs(filters?: JobFilters): Promise<Job[]> {
  try {
    if (!filters || Object.keys(filters).length === 0) {
      const result = await sql`SELECT * FROM jobs ORDER BY created_at DESC`
      return result as Job[]
    }

    // Build dynamic query with proper tagged template syntax
    if (filters.search && filters.location && filters.job_type && filters.company) {
      const result = await sql`
        SELECT * FROM jobs 
        WHERE (title ILIKE ${"%" + filters.search + "%"} OR description ILIKE ${"%" + filters.search + "%"} OR company ILIKE ${"%" + filters.search + "%"})
        AND location ILIKE ${"%" + filters.location + "%"}
        AND job_type = ${filters.job_type}
        AND company ILIKE ${"%" + filters.company + "%"}
        ORDER BY created_at DESC
      `
      return result as Job[]
    } else if (filters.search && filters.location && filters.job_type) {
      const result = await sql`
        SELECT * FROM jobs 
        WHERE (title ILIKE ${"%" + filters.search + "%"} OR description ILIKE ${"%" + filters.search + "%"} OR company ILIKE ${"%" + filters.search + "%"})
        AND location ILIKE ${"%" + filters.location + "%"}
        AND job_type = ${filters.job_type}
        ORDER BY created_at DESC
      `
      return result as Job[]
    } else if (filters.search && filters.location) {
      const result = await sql`
        SELECT * FROM jobs 
        WHERE (title ILIKE ${"%" + filters.search + "%"} OR description ILIKE ${"%" + filters.search + "%"} OR company ILIKE ${"%" + filters.search + "%"})
        AND location ILIKE ${"%" + filters.location + "%"}
        ORDER BY created_at DESC
      `
      return result as Job[]
    } else if (filters.search && filters.job_type) {
      const result = await sql`
        SELECT * FROM jobs 
        WHERE (title ILIKE ${"%" + filters.search + "%"} OR description ILIKE ${"%" + filters.search + "%"} OR company ILIKE ${"%" + filters.search + "%"})
        AND job_type = ${filters.job_type}
        ORDER BY created_at DESC
      `
      return result as Job[]
    } else if (filters.location && filters.job_type) {
      const result = await sql`
        SELECT * FROM jobs 
        WHERE location ILIKE ${"%" + filters.location + "%"}
        AND job_type = ${filters.job_type}
        ORDER BY created_at DESC
      `
      return result as Job[]
    } else if (filters.search) {
      const result = await sql`
        SELECT * FROM jobs 
        WHERE title ILIKE ${"%" + filters.search + "%"} 
        OR description ILIKE ${"%" + filters.search + "%"} 
        OR company ILIKE ${"%" + filters.search + "%"}
        ORDER BY created_at DESC
      `
      return result as Job[]
    } else if (filters.location) {
      const result = await sql`
        SELECT * FROM jobs 
        WHERE location ILIKE ${"%" + filters.location + "%"}
        ORDER BY created_at DESC
      `
      return result as Job[]
    } else if (filters.job_type) {
      const result = await sql`
        SELECT * FROM jobs 
        WHERE job_type = ${filters.job_type}
        ORDER BY created_at DESC
      `
      return result as Job[]
    } else if (filters.company) {
      const result = await sql`
        SELECT * FROM jobs 
        WHERE company ILIKE ${"%" + filters.company + "%"}
        ORDER BY created_at DESC
      `
      return result as Job[]
    }

    const result = await sql`SELECT * FROM jobs ORDER BY created_at DESC`
    return result as Job[]
  } catch (error) {
    console.error("Error in getJobs:", error)
    return []
  }
}

export async function getJobById(id: number): Promise<Job | null> {
  try {
    const result = await sql`SELECT * FROM jobs WHERE id = ${id}`
    return (result[0] as Job) || null
  } catch (error) {
    console.error("Error in getJobById:", error)
    return null
  }
}

export async function createJob(job: Omit<Job, "id" | "created_at" | "updated_at">): Promise<Job> {
  const result = await sql`
    INSERT INTO jobs (title, company, company_logo, location, job_type, salary_range, description, requirements, form_link, portal)
    VALUES (${job.title}, ${job.company}, ${job.company_logo || null}, ${job.location || null}, ${job.job_type || null}, ${job.salary_range || null}, ${job.description}, ${job.requirements || null}, ${job.form_link || null}, ${job.portal || null})
    RETURNING *
  `
  return result[0] as Job
}

export async function updateJob(
  id: number,
  job: Partial<Omit<Job, "id" | "created_at" | "updated_at">>,
): Promise<Job | null> {
  try {
    const result = await sql`
      UPDATE jobs 
      SET 
        title = COALESCE(${job.title}, title),
        company = COALESCE(${job.company}, company),
        company_logo = COALESCE(${job.company_logo}, company_logo),
        location = COALESCE(${job.location}, location),
        job_type = COALESCE(${job.job_type}, job_type),
        salary_range = COALESCE(${job.salary_range}, salary_range),
        description = COALESCE(${job.description}, description),
        requirements = COALESCE(${job.requirements}, requirements),
        form_link = COALESCE(${job.form_link}, form_link),
        portal = COALESCE(${job.portal}, portal),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return (result[0] as Job) || null
  } catch (error) {
    console.error("Error in updateJob:", error)
    return null
  }
}

export async function deleteJob(id: number): Promise<boolean> {
  try {
    const result = await sql`DELETE FROM jobs WHERE id = ${id} RETURNING id`
    return result.length > 0
  } catch (error) {
    console.error("Error in deleteJob:", error)
    return false
  }
}

export async function getUniqueLocations(): Promise<string[]> {
  try {
    const result = await sql`SELECT DISTINCT location FROM jobs WHERE location IS NOT NULL ORDER BY location`
    return result.map((row: any) => row.location)
  } catch (error) {
    console.error("Error in getUniqueLocations:", error)
    return []
  }
}

export async function getUniqueJobTypes(): Promise<string[]> {
  try {
    const result = await sql`SELECT DISTINCT job_type FROM jobs WHERE job_type IS NOT NULL ORDER BY job_type`
    return result.map((row: any) => row.job_type)
  } catch (error) {
    console.error("Error in getUniqueJobTypes:", error)
    return []
  }
}

export async function getUniqueCompanies(): Promise<string[]> {
  try {
    const result = await sql`SELECT DISTINCT company FROM jobs ORDER BY company`
    return result.map((row: any) => row.company)
  } catch (error) {
    console.error("Error in getUniqueCompanies:", error)
    return []
  }
}
