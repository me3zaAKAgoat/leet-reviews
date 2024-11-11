"use client";

import { SVGProps, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Search } from "lucide-react";

export default function Reviews() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars //
  const [reviews, setReviews] = useState([
    {
      id: 1,
      company: "Acme Inc",
      position: "Software Engineer Intern",
      rating: 4.8,
      title: "Fantastic Internship Experience",
      description:
        "I had an amazing time interning at Acme Inc. The team was incredibly welcoming and supportive, and I was able to work on challenging projects that really pushed me to grow as a developer. The company culture is fantastic, and I would highly recommend this internship to anyone looking to gain real-world experience.",
      date: "2023-05-01",
    },
    {
      id: 2,
      company: "Globex Corporation",
      position: "Marketing Intern",
      rating: 3.9,
      title: "Decent Internship, Could Be Better",
      description:
        "My internship at Globex Corporation was overall a decent experience. The work was interesting, and I was able to learn a lot about the marketing industry. However, the management could have been more organized, and there were times when I felt like I wasn't being challenged enough. The company culture also felt a bit stiff and formal.",
      date: "2022-09-15",
    },
    {
      id: 3,
      company: "Stark Industries",
      position: "Mechanical Engineering Intern",
      rating: 4.5,
      title: "Innovative and Exciting Internship",
      description:
        "Interning at Stark Industries was an incredible experience. The company is at the forefront of innovation, and I was able to work on cutting-edge projects that were both challenging and rewarding. The mentorship and support from the engineering team were top-notch, and I felt like my contributions were truly valued. I would highly recommend this internship to anyone interested in mechanical engineering.",
      date: "2023-03-01",
    },
    {
      id: 4,
      company: "Stark Industries",
      position: "Data Science Intern",
      rating: 4.2,
      title: "Engaging and Informative Internship",
      description:
        "I had a great time interning in the data science department at Stark Industries. The work was engaging and I was able to learn a lot about the latest techniques and technologies in the field. The team was very supportive and I felt like my ideas and contributions were valued. The only downside was that the work-life balance could have been a bit better, but overall it was a fantastic experience.",
      date: "2022-11-01",
    },
    {
      id: 5,
      company: "Globex Corporation",
      position: "Business Analyst Intern",
      rating: 3.6,
      title: "Average Internship Experience",
      description:
        "My internship at Globex Corporation was a fairly average experience. The work was somewhat interesting, but I felt like I wasn't being challenged enough and wasn't given enough responsibility. The company culture also felt a bit stale and bureaucratic. While I did learn some valuable skills, I don't think this internship was a great fit for me personally.",
      date: "2022-06-01",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredReviews = reviews.filter(
    (review) =>
      review.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Student Internship Reviews</h1>
        <Button>Add Revieew</Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">{review.company}</h3>
                  <p className="text-muted-foreground">{review.position}</p>
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <span className="font-bold">{review.rating.toFixed(1)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="text-xl font-bold mb-2">{review.title}</h4>
              <p className="text-muted-foreground">{review.description}</p>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                {format(new Date(review.date), "MMM d, yyyy")}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
