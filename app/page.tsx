'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { HeroManager } from '@/components/sections/hero-manager';
import { EventManager } from '@/components/sections/event-manager';
import { FooterManager } from '@/components/sections/footer-manager';
import { GuestInfoManager } from '@/components/sections/guest-info-manager';
import { GalleryManager } from '@/components/sections/gallery-manager';
import { RsvpManager } from '@/components/sections/rsvp-manager';
import { MenuManager } from '@/components/sections/menu-manager';
import { DayProgramManager } from '@/components/sections/day-program-manager';
import { UserManager } from '@/components/sections/user-manager';

type Section =
  | 'hero'
  | 'event'
  | 'footer'
  | 'guest-info'
  | 'gallery'
  | 'rsvp'
  | 'menu'
  | 'day-program'
  | 'user';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>('hero');

  const renderSection = () => {
    switch (activeSection) {
      case 'hero':
        return <HeroManager />;
      case 'event':
        return <EventManager />;
      case 'footer':
        return <FooterManager />;
      case 'guest-info':
        return <GuestInfoManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'rsvp':
        return <RsvpManager />;
      case 'menu':
        return <MenuManager />;
      case 'day-program':
        return <DayProgramManager />;
      case 'user':
        return <UserManager />;
      default:
        return <HeroManager />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        {renderSection()}
      </main>
    </div>
  );
}
