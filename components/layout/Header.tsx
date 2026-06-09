"use client";

import { usePathname } from "next/navigation";
import { Menu, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const pageName = pathname === "/" ? "Home" : pathname.split("/")[1];
  const displayName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      {onMenuClick && (
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary md:hidden" />
        <h1 className="text-lg font-semibold">{displayName}</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            RM
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
