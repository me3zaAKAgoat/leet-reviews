"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Star } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

// Define the form schema using Zod
const reviewSchema = z
  .object({
    jobTitle: z.string().min(1, "Job title is required"),
    companyId: z.string().min(1, "Company is required"),
    contractType: z.enum(["INTERNSHIP", "CDI", "CDD", "FREELANCE", "OTHER"]),
    jobSource: z.enum([
      "FRIEND_REFERRAL",
      "LINKEDIN",
      "COMPANY_WEBSITE",
      "JOB_BOARD",
      "CAREER_FAIR",
      "OTHER",
    ]),
    startDate: z.date(),
    endDate: z.date().optional(),
    salaryType: z.enum(["EXACT", "RANGE"]),
    salary: z.number().positive().optional(),
    salaryMin: z.number().positive().optional(),
    salaryMax: z.number().positive().optional(),
    location: z.string().min(1, "Location is required"),
    rating: z.number().min(1, "Rating is required").max(5),
    recommend: z.boolean(),
    anonymous: z.boolean(),
    interviewDifficulty: z.number().min(1).max(5),
    applicationDate: z.date().optional(),
    interviewProcess: z.string().optional(),
    description: z.string().min(1, "Review description is required"),
  })
  .refine(
    (data) => {
      if (data.salaryType === "EXACT") {
        return data.salary != null;
      }
      return data.salaryMin != null && data.salaryMax != null;
    },
    {
      message: "Please provide salary information",
      path: ["salary"],
    },
  )
  .refine(
    (data) => {
      if (data.salaryType === "RANGE") {
        return (data.salaryMin || 0) < (data.salaryMax || 0);
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than minimum salary",
      path: ["salaryMax"],
    },
  );

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewModalComponent() {
  // const [startDate, setStartDate] = useState<Date>()
  // const [endDate, setEndDate] = useState<Date>()
  // const [applicationDate, setApplicationDate] = useState<Date>()
  // const [rating, setRating] = useState(0)
  // const [salaryType, setSalaryType] = useState<'EXACT' | 'RANGE'>('EXACT')
  // const [interviewDifficulty, setInterviewDifficulty] = useState(3)

  // new
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      recommend: false,
      anonymous: false,
      interviewDifficulty: 3,
      salaryType: "EXACT",
    },
  });

  const salaryType = watch("salaryType");

  const onSubmit = (data: ReviewFormValues) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <DialogContent className="w-full max-w-4xl h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Submit Your Review</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 py-4 md:grid-cols-2"
      >
        <div className="grid gap-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            {...register("jobTitle")}
            className={cn(errors.jobTitle && "border-red-500")}
          />
          {errors.jobTitle && (
            <span className="text-sm text-red-500">
              {errors.jobTitle.message}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="companyId">Company</Label>
          <Input
            id="companyId"
            {...register("companyId")}
            className={cn(errors.companyId && "border-red-500")}
          />
          {errors.companyId && (
            <span className="text-sm text-red-500">
              {errors.companyId.message}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <Controller
            name="contractType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="FREELANCE">Freelance</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.contractType && (
            <span className="text-sm text-red-500">
              {errors.contractType.message}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="jobSource">Job Source</Label>
          <Controller
            name="jobSource"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FRIEND_REFERRAL">
                    Friend Referral
                  </SelectItem>
                  <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                  <SelectItem value="COMPANY_WEBSITE">
                    Company Website
                  </SelectItem>
                  <SelectItem value="JOB_BOARD">Job Board</SelectItem>
                  <SelectItem value="CAREER_FAIR">Career Fair</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      errors.startDate && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.startDate && (
            <span className="text-sm text-red-500">
              {errors.startDate.message}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="endDate">End Date</Label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="salaryType">Salary Type</Label>
          <Controller
            name="salaryType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select salary type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXACT">Exact</SelectItem>
                  <SelectItem value="RANGE">Range</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {salaryType === "EXACT" ? (
          <div className="grid gap-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              {...register("salary", { valueAsNumber: true })}
              className={cn(errors.salary && "border-red-500")}
              placeholder="Enter exact salary"
            />
            {errors.salary && (
              <span className="text-sm text-red-500">
                {errors.salary.message}
              </span>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              <Label htmlFor="salaryMin">Minimum Salary</Label>
              <Input
                id="salaryMin"
                type="number"
                {...register("salaryMin", { valueAsNumber: true })}
                className={cn(errors.salaryMin && "border-red-500")}
                placeholder="Enter minimum salary"
              />
              {errors.salaryMin && (
                <span className="text-sm text-red-500">
                  {errors.salaryMin.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salaryMax">Maximum Salary</Label>
              <Input
                id="salaryMax"
                type="number"
                {...register("salaryMax", { valueAsNumber: true })}
                className={cn(errors.salaryMax && "border-red-500")}
                placeholder="Enter maximum salary"
              />
              {errors.salaryMax && (
                <span className="text-sm text-red-500">
                  {errors.salaryMax.message}
                </span>
              )}
            </div>
          </>
        )}

        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            className={cn(errors.location && "border-red-500")}
            placeholder="Office location/city"
          />
          {errors.location && (
            <span className="text-sm text-red-500">
              {errors.location.message}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="rating">Rating</Label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${
                      star <= field.value
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => field.onChange(star)}
                  />
                ))}
              </div>
            )}
          />
          {errors.rating && (
            <span className="text-sm text-red-500">
              {errors.rating.message}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="recommend">Do you Recommend it?</Label>
          <Controller
            name="recommend"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="anonymous">Anonymous</Label>
          <Controller
            name="anonymous"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="interviewDifficulty">Interview Difficulty</Label>
          <Controller
            name="interviewDifficulty"
            control={control}
            render={({ field }) => (
              <Slider
                min={1}
                max={5}
                step={1}
                value={[field.value]}
                onValueChange={(value) => field.onChange(value[0])}
              />
            )}
          />
          <div className="flex justify-between text-xs">
            <span>Very Easy</span>
            <span>Average</span>
            <span>Very Difficult</span>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="applicationDate">Application Date</Label>
          <Controller
            name="applicationDate"
            control={control}
            render={({ field }) => (
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      errors.applicationDate && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.applicationDate && (
            <span className="text-sm text-red-500">
              {errors.applicationDate.message}
            </span>
          )}
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="interviewProcess">Interview Process</Label>
          <Textarea
            id="interviewProcess"
            {...register("interviewProcess")}
            className={cn(errors.interviewProcess && "border-red-500")}
            placeholder="Describe the interview process"
          />
          {errors.interviewProcess && (
            <span className="text-sm text-red-500">
              {errors.interviewProcess.message}
            </span>
          )}
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="description">Review</Label>
          <Textarea
            id="description"
            {...register("description")}
            className={cn(errors.description && "border-red-500")}
            placeholder="Write your review here"
          />
          {errors.description && (
            <span className="text-sm text-red-500">
              {errors.description.message}
            </span>
          )}
        </div>

        <Button type="submit" className="md:col-span-2">
          Submit Review
        </Button>
      </form>
    </DialogContent>
  );
}
