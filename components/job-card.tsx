"use client"

import type { Job } from "@/lib/db"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MapPin, Clock, DollarSign, ExternalLink, Edit, Trash2, Building2 } from "lucide-react"

interface JobCardProps {
  job: Job
  onEdit?: (job: Job) => void
  onDelete?: (id: number) => void
  showActions?: boolean
}

export function JobCard({ job, onEdit, onDelete, showActions = true }: JobCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-muted-foreground font-medium">{job.company}</p>
            </div>
          </div>
          {showActions && (onEdit || onDelete) && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(job)} className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Job Listing</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{job.title}" at {job.company}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(job.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {job.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </Badge>
          )}
          {job.job_type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {job.job_type}
            </Badge>
          )}
          {job.salary_range && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {job.salary_range}
            </Badge>
          )}
          {job.portal && <Badge variant="outline">{job.portal}</Badge>}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{job.description}</p>

        {job.requirements && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Requirements:</h4>
            <p className="text-muted-foreground text-sm line-clamp-2">{job.requirements}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">Posted {formatDate(job.created_at)}</span>
          {job.form_link && (
            <Button asChild size="sm">
              <a href={job.form_link} target="_blank" rel="noopener noreferrer">
                Apply Now
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
