"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import Image from "next/image";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      {onMenuClick && (
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <div className="flex items-center gap-3">
        <Image
          src="/assets/irla-logo.jpeg"
          alt="Irla"
          width={28}
          height={28}
          className="rounded-md object-cover"
        />
        <span className="text-lg font-semibold">Rolemate</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <UserAvatar />
      </div>
    </header>
  );
}
