"use client";

import { memo, useCallback, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LoaderCircle, ThumbsUp, User } from "lucide-react";
import { CommentWithUser } from "@/lib/types";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useSession } from "next-auth/react";
import { cn, generateAnonymousId } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import cuid from "cuid";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type Session } from "next-auth";

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

const CommentList = memo(
  ({
    comments,
    handleLike,
    loadingLikes,
    session,
  }: {
    comments: CommentWithUser[];
    handleLike: (id: string) => void;
    loadingLikes: Set<string>;
    session: Session | null;
  }) => {
    const [animationParent] = useAutoAnimate({ duration: 500 });

    console.log("inside Memo");

    return (
      <div className="h-[600px] pr-4" ref={animationParent}>
        {comments.map((comment, index) => {
          const hasLiked = comment.commentLikes.length > 0;
          return (
            <div key={comment.id}>
              <div className="flex items-start space-x-4 mb-4">
                {comment.user ? (
                  <UserAvatar comment={comment} />
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
                      {!comment.anonymous
                        ? comment.user.name
                        : generateAnonymousId(session?.user?.id)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {timeAgo.format(comment.createdAt)}
                    </p>
                  </div>
                  <p className="text-base text-foreground ">
                    {comment.comment}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    cursor-not-allowed
                    className={`text-muted-foreground hover:text-primary`}
                    disabled={loadingLikes.has(comment.id) || hasLiked}
                    onClick={() => handleLike(comment.id)}
                  >
                    {loadingLikes.has(comment.id) ? (
                      <LoaderCircle className={`animate-spin w-4 h-4 mr-1 `} />
                    ) : (
                      <ThumbsUp
                        className={`w-4 h-4 mr-1 ${loadingLikes.has(comment.id) || hasLiked ? "text-primary" : ""}`}
                      />
                    )}
                    <span>{comment.likes}</span>
                  </Button>
                </div>
              </div>
              {index < comments.length - 1 && <Separator className="my-6" />}
            </div>
          );
        })}
      </div>
    );
  },
);

export default function CommentSection({
  reviewId,
  reviewComments,
}: {
  reviewId: string;
  reviewComments: CommentWithUser[];
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentWithUser[]>(reviewComments);
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const new_cuid = cuid();
      console.log(new_cuid);
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
        id: new_cuid,
        createdAt: new Date(),
        anonymous: isAnonymous,
        likes: 0,
        commentLikes: [],
      };
      const res = await fetch("/api/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: new_cuid,
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

  const handleLike = useCallback(async (id: string) => {
    setLoadingLikes((prev) => new Set(prev).add(id));
    try {
      const res = await fetch("/api/updateComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId: id,
          action: "LIKE",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to like comment:", error.error);
        setLoadingLikes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }

      setComments((prevComments) => {
        return prevComments.map((comment) => {
          if (comment.id === id) {
            return {
              ...comment,
              likes: comment.likes + 1,
              commentLikes: [...comment.commentLikes, { commentId: id }],
            };
          }
          return comment;
        });
      });
    } catch (err) {
      console.log("error while liking comment", err);
    } finally {
      setLoadingLikes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, []);
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
            <span className={isLoading ? "invisible" : ""}>Post Comment</span>
            {isLoading && (
              <span className="absolute inset-0 grid place-items-center ">
                <LoadingSpinner />
              </span>
            )}
          </Button>
        </div>
      </form>
      <CommentList
        comments={comments}
        handleLike={handleLike}
        loadingLikes={loadingLikes}
        session={session}
      />
    </div>
  );
}

CommentList.displayName = "CommentList";
