"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Loader2, AlertCircle } from "lucide-react"
import type { Job } from "@/lib/db"

interface AddJobFormProps {
  onJobAdded: () => void
  editJob?: Job | null
  onEditComplete?: () => void
  onCancel?: () => void
}

export function AddJobForm({ onJobAdded, editJob, onEditComplete, onCancel }: AddJobFormProps) {
  const [open, setOpen] = useState(!!editJob)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: editJob?.title || "",
    company: editJob?.company || "",
    company_logo: editJob?.company_logo || "",
    location: editJob?.location || "",
    job_type: editJob?.job_type || "",
    salary_range: editJob?.salary_range || "",
    description: editJob?.description || "",
    requirements: editJob?.requirements || "",
    form_link: editJob?.form_link || "",
    portal: editJob?.portal || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = editJob ? `/api/jobs/${editJob.id}` : "/api/jobs"
      const method = editJob ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save job")
      }

      // Reset form
      setFormData({
        title: "",
        company: "",
        company_logo: "",
        location: "",
        job_type: "",
        salary_range: "",
        description: "",
        requirements: "",
        form_link: "",
        portal: "",
      })

      setOpen(false)
      onJobAdded()

      if (editJob && onEditComplete) {
        onEditComplete()
      }
    } catch (error) {
      console.error("Error saving job:", error)
      setError(error instanceof Error ? error.message : "Failed to save job. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleCancel = () => {
    setOpen(false)
    if (onCancel) {
      onCancel()
    }
    if (editJob && onEditComplete) {
      onEditComplete()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!editJob && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{editJob ? "Edit Job" : "Add New Job"}</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Job Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  disabled={loading}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">
                  Company <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="company"
                  placeholder="e.g., Google"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  required
                  disabled={loading}
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_type" className="text-sm font-medium">
                  Job Type
                </Label>
                <Select
                  value={formData.job_type}
                  onValueChange={(value) => handleInputChange("job_type", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_range" className="text-sm font-medium">
                  Salary Range
                </Label>
                <Input
                  id="salary_range"
                  placeholder="e.g., $80k - $120k"
                  value={formData.salary_range}
                  onChange={(e) => handleInputChange("salary_range", e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Job Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
                disabled={loading}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-sm font-medium">
                Requirements
              </Label>
              <Textarea
                id="requirements"
                rows={4}
                placeholder="List the key skills, experience, and qualifications needed..."
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                disabled={loading}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="form_link" className="text-sm font-medium">
                  Application Link
                </Label>
                <Input
                  id="form_link"
                  type="url"
                  placeholder="https://company.com/apply"
                  value={formData.form_link}
                  onChange={(e) => handleInputChange("form_link", e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portal" className="text-sm font-medium">
                  Source Portal
                </Label>
                <Select
                  value={formData.portal}
                  onValueChange={(value) => handleInputChange("portal", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select portal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Company Website">Company Website</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Indeed">Indeed</SelectItem>
                    <SelectItem value="AngelList">AngelList</SelectItem>
                    <SelectItem value="Glassdoor">Glassdoor</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[100px]">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editJob ? "Update Job" : "Add Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
