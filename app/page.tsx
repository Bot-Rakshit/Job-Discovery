"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import type { Job } from "@/lib/db"
import { JobCard } from "@/components/job-card"
import { JobFilters } from "@/components/job-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Briefcase, Shield, Search, MapPin, Building2 } from "lucide-react"

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

  // Get stats for display
  const totalJobs = jobs.length
  const uniqueCompanies = new Set(jobs.map((job) => job.company)).size
  const uniqueLocations = new Set(jobs.map((job) => job.location).filter(Boolean)).size

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Job Listings</h1>
                <p className="text-muted-foreground">Discover opportunities from various portals and companies</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>

          {/* Stats Overview */}
          {totalJobs > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalJobs}</div>
                  <p className="text-xs text-muted-foreground">Open positions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{uniqueCompanies}</div>
                  <p className="text-xs text-muted-foreground">Hiring companies</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Locations</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{uniqueLocations}</div>
                  <p className="text-xs text-muted-foreground">Different locations</p>
                </CardContent>
              </Card>
            </div>
          )}

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
