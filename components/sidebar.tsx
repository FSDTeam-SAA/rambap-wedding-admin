"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FolderOpen,
  ImageIcon,
  LogOut,
  User2,
  Award,
  ClipboardList,
  LayoutPanelLeft,
  Settings,
  CircleFadingArrowUp,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Hero", href: "/dashboard", icon: LayoutPanelLeft },
  { name: "Event", href: "/dashboard/event-manager", icon: User2 },
  { name: "Footer", href: "/dashboard/footer-manager", icon: Award },
  { name: "Guest Info", href: "/dashboard/guestInfo-manager", icon: ClipboardList },
  { name: "Gallery", href: "/dashboard/gallery-manager", icon: FolderOpen },
  { name: "RSVP", href: "/dashboard/rsvp-manager", icon: ImageIcon },
  { name: "Menu", href: "/dashboard/menu-manager", icon: CircleFadingArrowUp },
  { name: "Day Program", href: "/dashboard/day-program-manager", icon: CircleFadingArrowUp },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    // Example: if using NextAuth
    signOut({ callbackUrl: "/" });
    console.log("User logged out");
  };

  return (
    <div className="flex flex-col w-[280px] bg-[#f59e0a] border-r border-border  h-screen">
      <div className="mt-10">
        <Link href="/" className="flex-shrink-0  py-2 pt-10">
          <h5
            className="
                text-3xl 
                font-extrabold 
                text-center
                select-none
                text-white
              "
          >
          Wedding
          </h5>
        </Link>
      </div>

      {/* <div className="flex items-center justify-center mb-10">
        <Image
          src="/profile.jpg"
          alt="Profile"
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div> */}

      <nav className="flex-1 scrollbar-none px-4 mt-10 space-y-[24px] overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-3 text-[16px] font-medium rounded-md transition-colors",
                isActive
                  ? "bg-[#8a5d10e8] text-white"
                  : "text-white hover:text-white hover:bg-[#8a5d10e8]"
              )}
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center px-3 py-2 m-4 text-sm font-medium rounded-md text-[#E5102E] hover:text-[#E5102E] hover:bg-muted transition-colors"
        type="button"
      >
        <LogOut className="mr-3 h-4 w-4" />
        Logout
      </button>

      {/* Logout confirmation modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to log out? You’ll need to log in again to access your dashboard.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" className="hover:text-white" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}