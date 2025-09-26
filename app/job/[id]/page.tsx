import { notFound } from "next/navigation"
import Link from "next/link"
import { getJobById } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Clock,
  DollarSign,
  ExternalLink,
  Building2,
  ArrowLeft,
  Calendar,
  FileText,
  CheckCircle,
} from "lucide-react"

interface JobPageProps {
  params: {
    id: string
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const jobId = Number.parseInt(params.id)

  if (isNaN(jobId)) {
    notFound()
  }

  const job = await getJobById(jobId)

  if (!job) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatRequirements = (requirements: string) => {
    return requirements
      .split("\n")
      .filter((req) => req.trim())
      .map((req) => req.trim())
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>

        <div className="mb-12">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/10">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold text-foreground mb-3 leading-tight">{job.title}</h1>
              <p className="text-2xl text-muted-foreground font-medium mb-6">{job.company}</p>

              <div className="flex flex-wrap gap-3 mb-6">
                {job.location && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </Badge>
                )}
                {job.job_type && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {job.job_type}
                  </Badge>
                )}
                {job.salary_range && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    {job.salary_range}
                  </Badge>
                )}
                {job.portal && (
                  <Badge variant="outline" className="px-4 py-2 text-sm">
                    {job.portal}
                  </Badge>
                )}
              </div>

              {job.form_link && (
                <Button asChild size="lg" className="px-8 py-3 text-base">
                  <a href={job.form_link} target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ExternalLink className="h-5 w-5 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Job Description */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">About this role</h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                {job.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-6 last:mb-0 text-base leading-7">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Requirements */}
            {job.requirements && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">What we're looking for</h2>
                </div>
                <div className="space-y-4">
                  {formatRequirements(job.requirements).map((requirement, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
                      <p className="text-muted-foreground leading-7 text-base">{requirement}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {/* Job Details */}
            <section className="bg-muted/30 rounded-2xl p-6 border border-border/50">
              <h3 className="font-semibold text-lg mb-6 text-foreground">Job Details</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-foreground mb-1">Posted</p>
                    <p className="text-muted-foreground text-sm">{formatDate(job.created_at)}</p>
                  </div>
                </div>

                {job.updated_at !== job.created_at && (
                  <div className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-foreground mb-1">Updated</p>
                      <p className="text-muted-foreground text-sm">{formatDate(job.updated_at)}</p>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-sm mb-2 text-foreground">Company</p>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>

                  {job.location && (
                    <div>
                      <p className="font-medium text-sm mb-2 text-foreground">Location</p>
                      <p className="text-muted-foreground">{job.location}</p>
                    </div>
                  )}

                  {job.job_type && (
                    <div>
                      <p className="font-medium text-sm mb-2 text-foreground">Job Type</p>
                      <p className="text-muted-foreground">{job.job_type}</p>
                    </div>
                  )}

                  {job.salary_range && (
                    <div>
                      <p className="font-medium text-sm mb-2 text-foreground">Salary Range</p>
                      <p className="text-muted-foreground">{job.salary_range}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Apply Section */}
            {job.form_link && (
              <section className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Ready to Apply?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Take the next step in your career journey
                    </p>
                  </div>
                  <Button asChild className="w-full" size="lg">
                    <a href={job.form_link} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
