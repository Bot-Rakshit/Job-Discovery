import { type NextRequest, NextResponse } from "next/server"
import { getJobs, createJob, type JobFilters } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: JobFilters = {
      location: searchParams.get("location") || undefined,
      job_type: searchParams.get("job_type") || undefined,
      company: searchParams.get("company") || undefined,
      search: searchParams.get("search") || undefined,
    }

    const jobs = await getJobs(filters)
    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      title,
      company,
      company_logo,
      location,
      job_type,
      salary_range,
      description,
      requirements,
      form_link,
      portal,
    } = body

    if (!title || !company || !description) {
      return NextResponse.json({ error: "Title, company, and description are required" }, { status: 400 })
    }

    const job = await createJob({
      title,
      company,
      company_logo,
      location,
      job_type,
      salary_range,
      description,
      requirements,
      form_link,
      portal,
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
