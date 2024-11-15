"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LoaderIcon, ThumbsUp, User } from "lucide-react";
import { CommentWithUser } from "@/lib/types";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

const LoadingSpinner = ({ size = 36, className, ...props }: ISVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export default function CommentSection({
  reviewId,
  reviewComments,
}: {
  reviewId: string;
  reviewComments: CommentWithUser[];
}) {
  const { data: session } = useSession();
  console.log(session);
  const [comments, setComments] = useState<CommentWithUser[]>(reviewComments);
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setLoading(true);
      // oone day , ill try to use the new hook useOptimistic here .that day will never come
      const comment: CommentWithUser = {
        // this is ugly , lets keep it a secret
        userId: "1", // we do alittle bit of trolling
        reviewId: reviewId, // also here
        user: {
          name: session?.user?.name || "Current User",
          image: session?.user?.image || "image",
        },
        comment: newComment.trim(),
        id: String(comments.length + 1),
        createdAt: new Date(),
        anonymous: isAnonymous,
        likes: 0,
      };
      const res = await fetch("/api/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: newComment,
          reviewId: reviewId,
          anonymous: isAnonymous,
        }),
      });
      if (!res.ok) {
        console.error("Failed to add comment:", res.statusText);
        setLoading(false);
        return;
      }
      setComments([comment, ...comments]);
      setNewComment("");
      setLoading(false);
    }
  };

  const handleLike = (id: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment,
      ),
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-background rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center">Comments</h2>
      <form onSubmit={handleSubmit} className="mb-10">
        <Textarea
          placeholder="What are your thoughts?"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full mb-4 p-4 border-2 border-primary/20 rounded-lg focus:border-primary transition-colors"
          rows={4}
        />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous-mode"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous-mode">Post anonymously</Label>
          </div>
          <Button
            type="submit"
            className={`px-3 py-2 text-md font-semibold rounded-lg relative ${
              isLoading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {/* {isLoading ? <LoadingSpinner /> : "Post Comment"} */}
            <span className={isLoading ? "invisible" : ""}>Post Comment</span>
            {isLoading && (
              <span className="absolute inset-0 grid place-items-center ">
                <LoadingSpinner />
                {/* <LoaderIcon className="animate-spin size-10" /> */}
              </span>
            )}
          </Button>
        </div>
      </form>
      <ScrollArea className="h-[600px] pr-4">
        {comments.map((comment, index) => (
          <div key={comment.id}>
            <div className="flex items-start space-x-4 mb-4">
              {comment.user ? (
                <Avatar className="w-12 h-12 border-2 border-primary">
                  {/* //fix this later */}
                  <AvatarImage
                    src={comment.user.image || "default url"}
                    alt={comment.user.name || "Profile Pic"}
                  />
                  <AvatarFallback>
                    {comment.user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="w-12 h-12 border-2 border-primary">
                  <AvatarFallback>
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {comment.user ? comment.user.name : "Anonymous User"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {timeAgo.format(comment.createdAt)}
                  </p>
                </div>
                <p className="text-base text-foreground">{comment.comment}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => handleLike(comment.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  <span>{comment.likes}</span>
                </Button>
              </div>
            </div>
            {index < comments.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
