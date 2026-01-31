export interface Hero {
  id: string;
  topMessage: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  bottomMessage: string;
  videoUrl: string;
  countdownTitle: string;
  countdownSubtitle: string;
}

export interface Event {
  id: string;
  title: string;
  subtitle: string;
  venueName: string;
  ceremonyTime: string;
  banquetTime: string;
  address: string;
  mapEmbedUrl: string;
  mapLocationLink: string;
  transportationTitle: string;
  transportationInfo: string;
}

export interface Footer {
  id: string;
  partnerOne: string;
  partnerTwo: string;
  date: string;
  footerNote: string;
}

export interface GuestInfoItem {
  title: string;
  icon: string;
  linkUrl: string;
  description: string;
}

export interface GuestInfo {
  id: string;
  accommodation: {
    title: string;
    subtitle: string;
    items: GuestInfoItem[];
  };
  carRental: {
    title: string;
    subtitle: string;
    items: GuestInfoItem[];
  };
  dressCode: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    footerNote: string;
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  gifts: {
    title: string;
    subtitle: string;
    description: string;
  };
}

export interface Gallery {
  id: string;
  title: string;
  subtitle: string;
  images: string[];
}

export interface Rsvp {
  id: string;
  guestName: string;
  attendance: 'attending' | 'not-attending' | 'pending';
  guestNumber: number;
  mealPreference: string;
  message: string;
}

export interface MenuItem {
  name: string;
  items: string[];
}

export interface WeddingMenu {
  id: string;
  title: string;
  menuSections: Array<{
    categoryName: string;
    items: string[];
  }>;
  printMenuUrl: string;
}

export interface DayProgramItem {
  time: string;
  title: string;
  description: string;
  icon: string;
  mapUrl?: string;
}

export interface DayProgram {
  id: string;
  title: string;
  subtitle: string;
  items: DayProgramItem[];
  printUrl: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  otp?: string;
  otpExpires?: string;
}
