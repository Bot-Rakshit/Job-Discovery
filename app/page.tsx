"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import type { Job } from "@/lib/db"
import { JobCard } from "@/components/job-card"
import { JobFilters } from "@/components/job-filters"
import { Button } from "@/components/ui/button"
import { Loader2, Briefcase, Shield, Search } from "lucide-react"

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<{
    search?: string
    location?: string
    job_type?: string
    company?: string
  }>({})

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/jobs?${params}`)
      if (!response.ok) {
        if (response.status === 500) {
          console.log("[v0] Database table doesn't exist yet, showing empty state")
          setJobs([])
          return
        }
        throw new Error("Failed to fetch jobs")
      }

      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              
              <div>
                <h1 className="font-bold font-mono text-4xl text-primary">Job Listings</h1>
                
              </div>
            </div>
            
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} found`}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <JobFilters onFiltersChange={setFilters} />
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/50 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              {Object.values(filters).some(Boolean)
                ? "Try adjusting your filters or search terms to find more opportunities"
                : "Check back soon for new job listings"}
            </p>
            {Object.values(filters).some(Boolean) && (
              <Button variant="outline" onClick={() => setFilters({})}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} showActions={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
