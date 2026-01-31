import type {
  Hero,
  Event,
  Footer,
  GuestInfo,
  Gallery,
  Rsvp,
  WeddingMenu,
  DayProgram,
  User,
} from './types';

export const mockHeroes: Hero[] = [
  {
    id: '1',
    topMessage: 'Together Forever',
    partnerOne: 'Sarah Johnson',
    partnerTwo: 'Michael Chen',
    weddingDate: '2024-06-15',
    bottomMessage: 'Join us for our special day',
    videoUrl: 'https://example.com/video.mp4',
    countdownTitle: 'Our Wedding',
    countdownSubtitle: "Let's celebrate our love",
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Wedding Ceremony',
    subtitle: 'The beginning of forever',
    venueName: 'Grand Ballroom',
    ceremonyTime: '14:00',
    banquetTime: '18:00',
    address: '123 Main Street, New York, NY',
    mapEmbedUrl: 'https://maps.example.com/embed',
    mapLocationLink: 'https://maps.example.com/location',
    transportationTitle: 'Getting There',
    transportationInfo: 'Complimentary shuttle service available',
  },
];

export const mockFooters: Footer[] = [
  {
    id: '1',
    partnerOne: 'Sarah Johnson',
    partnerTwo: 'Michael Chen',
    date: '2024-06-15',
    footerNote: 'Thank you for celebrating with us!',
  },
];

export const mockGuestInfo: GuestInfo[] = [
  {
    id: '1',
    accommodation: {
      title: 'Where to Stay',
      subtitle: 'Recommended hotels nearby',
      items: [
        {
          title: 'The Grand Hotel',
          icon: 'hotel',
          linkUrl: 'https://example.com/hotel',
          description: 'Luxury 5-star accommodation',
        },
      ],
    },
    carRental: {
      title: 'Rent a Car',
      subtitle: 'Transportation options',
      items: [
        {
          title: 'Budget Rentals',
          icon: 'car',
          linkUrl: 'https://example.com/rental',
          description: 'Affordable car rentals',
        },
      ],
    },
    dressCode: {
      title: 'Dress Code',
      items: [
        {
          title: 'Formal',
          description: 'Black tie preferred',
          icon: 'dress',
        },
      ],
      footerNote: 'Let us celebrate in style',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What time should we arrive?',
          answer: 'Please arrive 30 minutes before the ceremony',
        },
      ],
    },
    gifts: {
      title: 'Gifts',
      subtitle: 'Your generosity means the world',
      description: 'Registries available at major retailers',
    },
  },
];

export const mockGalleries: Gallery[] = [
  {
    id: '1',
    title: 'Wedding Moments',
    subtitle: 'Memories of our special day',
    images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
  },
];

export const mockRsvps: Rsvp[] = [
  {
    id: '1',
    guestName: 'John Smith',
    attendance: 'attending',
    guestNumber: 2,
    mealPreference: 'Vegetarian',
    message: 'Cant wait to celebrate!',
  },
  {
    id: '2',
    guestName: 'Jane Doe',
    attendance: 'pending',
    guestNumber: 1,
    mealPreference: 'Standard',
    message: '',
  },
];

export const mockMenus: WeddingMenu[] = [
  {
    id: '1',
    title: 'Wedding Menu',
    menuSections: [
      {
        categoryName: 'Appetizers',
        items: ['Shrimp Canapés', 'Cheese Board', 'Bruschetta'],
      },
      {
        categoryName: 'Main Course',
        items: ['Filet Mignon', 'Chicken Cordon Bleu', 'Vegetable Medley'],
      },
      {
        categoryName: 'Dessert',
        items: ['Wedding Cake', 'Chocolate Mousse', 'Fruit Tart'],
      },
    ],
    printMenuUrl: 'https://example.com/menu.pdf',
  },
];

export const mockDayPrograms: DayProgram[] = [
  {
    id: '1',
    title: 'Wedding Day Schedule',
    subtitle: 'Hour by hour',
    items: [
      {
        time: '13:00',
        title: 'Guest Arrival',
        description: 'Welcome guests at the venue',
        icon: 'clock',
        mapUrl: 'https://maps.example.com',
      },
      {
        time: '14:00',
        title: 'Ceremony',
        description: 'The main event',
        icon: 'ring',
      },
      {
        time: '18:00',
        title: 'Reception',
        description: 'Dinner and dancing',
        icon: 'celebration',
      },
    ],
    printUrl: 'https://example.com/schedule.pdf',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael@example.com',
  },
];
