"use client"

import { useState, useEffect, useCallback } from "react"
import type { Job } from "@/lib/db"
import { JobCard } from "@/components/job-card"
import { JobFilters } from "@/components/job-filters"
import { AddJobForm } from "@/components/add-job-form"
import { AdminLogin } from "@/components/admin-login"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Briefcase, LogOut, Plus, Users, Building2 } from "lucide-react"

interface Admin {
  id: number
  username: string
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [filters, setFilters] = useState<{
    search?: string
    location?: string
    job_type?: string
    company?: string
  }>({})

  // Check authentication
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setAdmin(data.admin)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchJobs = useCallback(async () => {
    setJobsLoading(true)
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
      setJobsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    if (admin) {
      fetchJobs()
    }
  }, [admin, fetchJobs])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setAdmin(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleDeleteJob = async (id: number) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete job")

      fetchJobs()
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
  }

  const handleEditComplete = () => {
    setEditingJob(null)
    fetchJobs()
  }

  const handleJobAdded = () => {
    setShowAddForm(false)
    fetchJobs()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!admin) {
    return <AdminLogin onLogin={checkAuth} />
  }

  // Get stats
  const totalJobs = jobs.length
  const uniqueCompanies = new Set(jobs.map((job) => job.company)).size
  const jobTypes = jobs.reduce(
    (acc, job) => {
      acc[job.job_type || "Other"] = (acc[job.job_type || "Other"] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

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
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {admin.username}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalJobs}</div>
                <p className="text-xs text-muted-foreground">Active job listings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Companies</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueCompanies}</div>
                <p className="text-xs text-muted-foreground">Unique companies</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Types</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(jobTypes).map(([type, count]) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {jobsLoading ? "Loading..." : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} found`}
            </div>
            <AddJobForm onJobAdded={handleJobAdded} />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <JobFilters onFiltersChange={setFilters} />
        </div>

        {/* Job Listings */}
        {jobsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/50 rounded-lg inline-block mb-4">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              {Object.values(filters).some(Boolean)
                ? "Try adjusting your filters or search terms"
                : "Start by adding your first job listing"}
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onEdit={handleEditJob} onDelete={handleDeleteJob} showActions={true} />
            ))}
          </div>
        )}

        {/* Add Job Modal */}

        {/* Edit Job Modal */}
        {editingJob && <AddJobForm editJob={editingJob} onJobAdded={fetchJobs} onEditComplete={handleEditComplete} />}
      </div>
    </div>
  )
}
