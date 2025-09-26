"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

interface JobFiltersProps {
  onFiltersChange: (filters: {
    search?: string
    location?: string
    job_type?: string
    company?: string
  }) => void
}

interface FilterOptions {
  locations: string[]
  jobTypes: string[]
  companies: string[]
}

export function JobFilters({ onFiltersChange }: JobFiltersProps) {
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [company, setCompany] = useState("")
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    locations: [],
    jobTypes: [],
    companies: [],
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch("/api/jobs/filters")
        if (!response.ok) {
          console.log("[v0] Filter options API failed, using empty options")
          return
        }
        const data = await response.json()
        setFilterOptions(data)
      } catch (error) {
        console.error("Error fetching filter options:", error)
        // Keep empty filter options if API fails
      }
    }

    fetchFilterOptions()
  }, [])

  useEffect(() => {
    const filters = {
      search: search || undefined,
      location: location === "all" ? undefined : location || undefined,
      job_type: jobType === "all" ? undefined : jobType || undefined,
      company: company === "all" ? undefined : company || undefined,
    }
    onFiltersChange(filters)
  }, [search, location, jobType, company, onFiltersChange])

  const clearFilters = () => {
    setSearch("")
    setLocation("")
    setJobType("")
    setCompany("")
  }

  const activeFilters = [
    search && { label: `Search: ${search}`, clear: () => setSearch("") },
    location && location !== "all" && { label: `Location: ${location}`, clear: () => setLocation("") },
    jobType && jobType !== "all" && { label: `Type: ${jobType}`, clear: () => setJobType("") },
    company && company !== "all" && { label: `Company: ${company}`, clear: () => setCompany("") },
  ].filter(Boolean)

  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs, companies, or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-2 border-border"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-popover-foreground text-background">
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {filter.label}
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent" onClick={filter.clear}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6">
            Clear all
          </Button>
        </div>
      )}

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {filterOptions.locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Job Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Job Types</SelectItem>
                  {filterOptions.jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={company} onValueChange={setCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {filterOptions.companies.map((comp) => (
                    <SelectItem key={comp} value={comp}>
                      {comp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
