import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, ArrowBigUp, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/data/dummyData";
import { UserEssentials } from "@/types/responses/data/user/UserEssentials";
import { getCustomAvatar } from "@/lib/utils";

interface PostHeaderProps {
  createdAt: Date;
  amplifiedCount?: number;
  isProject?: boolean;
  isAggregator?: boolean;
  aggregatorSource?: string;
  user?: UserEssentials; // Added user property
}

const PostHeader: React.FC<PostHeaderProps> = ({
  createdAt,
  amplifiedCount = 0,
  isProject,
  isAggregator,
  aggregatorSource,
  user,
}) => {
  const fullName = user.firstName + " " + user.lastName;
  const avatarFallBack = user.firstName[0] + " " + user.lastName[0];

  return (
    <div className="flex items-start gap-3">
      <Link to={`/profile/${user.username}`}>
        <Avatar>
          <AvatarImage
            src={
              user.avatarUrl || getCustomAvatar(user.firstName, user.lastName)
            }
            alt={fullName}
          />
        </Avatar>
      </Link>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${user.username}`}
                className="font-medium hover:underline"
              >
                {fullName}
              </Link>

              {isAggregator && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-500/10 border-blue-500/20 text-blue-500"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  News Bot
                </Badge>
              )}

              {isProject && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30"
                >
                  Project
                </Badge>
              )}

              {amplifiedCount > 0 && (
                <span className="text-xs text-muted-foreground flex items-center">
                  <ArrowBigUp className="w-3 h-3 mr-1" />
                  {amplifiedCount}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(createdAt)}
              {isAggregator && aggregatorSource && (
                <>
                  {" "}
                  · Source:{" "}
                  <span className="text-primary/80">{aggregatorSource}</span>
                </>
              )}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Post options</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
