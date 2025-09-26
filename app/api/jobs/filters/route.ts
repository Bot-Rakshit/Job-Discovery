import { NextResponse } from "next/server"
import { getUniqueLocations, getUniqueJobTypes, getUniqueCompanies } from "@/lib/db"

export async function GET() {
  try {
    const [locations, jobTypes, companies] = await Promise.all([
      getUniqueLocations(),
      getUniqueJobTypes(),
      getUniqueCompanies(),
    ])

    return NextResponse.json({
      locations,
      jobTypes,
      companies,
    })
  } catch (error) {
    console.error("Error fetching filter options:", error)
    return NextResponse.json({ error: "Failed to fetch filter options" }, { status: 500 })
  }
}
