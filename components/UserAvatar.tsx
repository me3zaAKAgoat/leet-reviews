import React from "react";
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommentWithUser } from "@/lib/types";

const UserAvatar = ({ comment }: { comment: CommentWithUser }) => {
  // Handle anonymous comments
  if (comment.anonymous) {
    return (
      <Avatar className="w-12 h-12 border-2 border-primary">
        <AvatarFallback>
          <User className="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
    );
  }

  // Handle logged-in users
  if (comment.user) {
    return (
      <Avatar className="w-12 h-12 border-2 border-primary">
        <AvatarImage
          src={comment.user.image || "/default-avatar.png"}
          alt={`${comment.user.name || "User"}'s profile picture`}
        />
        <AvatarFallback>
          {comment.user.name?.charAt(0)?.toUpperCase() || (
            <User className="w-6 h-6" />
          )}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Fallback for edge cases
  return (
    <Avatar className="w-12 h-12 border-2 border-primary">
      <AvatarFallback>
        <User className="w-6 h-6" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
