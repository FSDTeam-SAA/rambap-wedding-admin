'use client';

import {
  LayoutGrid,
  ImageIcon,
  Users,
  Calendar,
  FileText,
  Menu,
  UtensilsCrossed,
  Clock,
  User,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const navItems = [
    { id: 'hero', label: 'Hero Section', icon: LayoutGrid },
    { id: 'event', label: 'Event Details', icon: Calendar },
    { id: 'footer', label: 'Footer', icon: FileText },
    { id: 'guest-info', label: 'Guest Info', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'rsvp', label: 'RSVPs', icon: Menu },
    { id: 'menu', label: 'Wedding Menu', icon: UtensilsCrossed },
    { id: 'day-program', label: 'Day Program', icon: Clock },
    { id: 'user', label: 'Users', icon: User },
  ];

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          Wedding Admin
        </h1>
        <p className="text-sm text-sidebar-foreground/60 mt-1">
          Content Management
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
