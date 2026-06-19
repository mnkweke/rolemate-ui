"use client";

import { cn, getUserInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/AuthContext";

interface UserAvatarProps {
  className?: string;
  fallbackClass?: string;
}

export function UserAvatar({ className, fallbackClass }: UserAvatarProps) {
  const { user } = useAuth();
  const initials = getUserInitials(user?.name);

  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarFallback className={cn("bg-primary/10 text-primary text-xs font-medium", fallbackClass)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
