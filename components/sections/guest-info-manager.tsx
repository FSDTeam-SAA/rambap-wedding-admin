'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Edit, Loader2, X, Plus } from 'lucide-react';

/* ---------------- TYPES ---------------- */

type LinkItem = {
  _id?: string;
  title: string;
  linkUrl: string;
  description?: string;
};

type DressCodeItem = {
  _id?: string;
  title: string;
  description: string;
};

type FaqItem = {
  _id?: string;
  question: string;
  answer: string;
};

type GuestInfo = {
  _id?: string;
  accommodation?: {
    title?: string;
    subtitle?: string;
    items?: LinkItem[];
  };
  carRental?: {
    title?: string;
    subtitle?: string;
    items?: LinkItem[];
  };
  dressCode?: {
    title?: string;
    items?: DressCodeItem[];
    footerNote?: string;
  };
  faq?: {
    title?: string;
    items?: FaqItem[];
  };
  gifts?: {
    title?: string;
    subtitle?: string;
    description?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

/* ---------------- CONFIG ---------------- */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const GUEST_INFO_ENDPOINT = `${API_BASE}/guestInfo`;

/* ---------------- COMPONENT ---------------- */

export function GuestInfoManager() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GuestInfo>>({});
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2UwMjRmZmU2Mzg5ZmUxN2ZlOGY3NCIsImVtYWlsIjoiZmFyYWJpc3Vubnk1QGdtYWlsLmNvbSIsImlhdCI6MTc3MDAzMDIwOSwiZXhwIjoxNzcwNjM1MDA5fQ.sQNtfmrBUvFL2smeBVsUc7E9AE119xHC3TUjzEvOUZU'

  /* ---------- FETCH ---------- */
  const { data: guestInfo, isLoading, isError, error } = useQuery<GuestInfo>({
    queryKey: ['guestInfo'],
    queryFn: async () => {
      const res = await fetch(GUEST_INFO_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to load guest info');
      }

      const json = await res.json();
      return json.data ?? {};
    },
  });

  /* ---------- MUTATION ---------- */
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: Partial<GuestInfo>) => {
      const res = await fetch(GUEST_INFO_ENDPOINT, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to save');
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success('Guest information saved successfully');
      queryClient.invalidateQueries({ queryKey: ['guestInfo'] });
      setIsOpen(false);
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to save guest information');
    },
  });

  /* ---------- HELPERS ---------- */
  const updateField = (path: string, value: any) => {
    setFormData((prev) => {
      const data = structuredClone(prev || {});
      const keys = path.split('.');
      let obj: any = data;

      keys.slice(0, -1).forEach((k) => {
        obj[k] = obj[k] || {};
        obj = obj[k];
      });

      obj[keys[keys.length - 1]] = value;
      return data;
    });
  };

  const addItem = (path: string, item: any) => {
    setFormData((prev) => {
      const data = structuredClone(prev || {});
      const keys = path.split('.');
      let obj: any = data;

      keys.forEach((k, i) => {
        if (i === keys.length - 1) {
          obj[k] = [...(obj[k] || []), item];
        } else {
          obj[k] = obj[k] || {};
          obj = obj[k];
        }
      });

      return data;
    });
  };

  const updateItem = (path: string, index: number, field: string, value: string) => {
    setFormData((prev) => {
      const data = structuredClone(prev || {});
      const arr = path.split('.').reduce((a: any, b) => a?.[b], data);
      if (arr?.[index]) arr[index][field] = value;
      return data;
    });
  };

  const removeItem = (path: string, index: number) => {
    setFormData((prev) => {
      const data = structuredClone(prev || {});
      const arr = path.split('.').reduce((a: any, b) => a?.[b], data);
      if (Array.isArray(arr)) arr.splice(index, 1);
      return data;
    });
  };

  const openEditor = () => {
    setFormData(structuredClone(guestInfo || {}));
    setIsOpen(true);
  };

  /* ---------------- UI ---------------- */
  if (isLoading) {
    return (
      <div className="h-96 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load guest information
        <p className="text-sm mt-2">{(error as Error)?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Guest Information</h2>
          <p className="text-muted-foreground">Manage accommodation, dress code, FAQ, gifts and more</p>
        </div>

        <Button onClick={openEditor}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* PREVIEW */}
      <div className="grid md:grid-cols-2 gap-6">
        {guestInfo?.accommodation && <PreviewCard section={guestInfo.accommodation} />}
        {guestInfo?.carRental && <PreviewCard section={guestInfo.carRental} />}
        {guestInfo?.dressCode && <PreviewSimple section={guestInfo.dressCode} />}
        {guestInfo?.faq && <PreviewFAQ section={guestInfo.faq} />}
        {guestInfo?.gifts && <PreviewGifts section={guestInfo.gifts} />}
      </div>

      {/* EDIT DIALOG - FIXED VERSION */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-4xl p-0 overflow-hidden">

          {/* Fixed Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-background sticky top-0 z-20">
            <DialogTitle className="text-2xl">Edit Guest Information</DialogTitle>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="max-h-[80dvh] overflow-y-auto overscroll-y-contain px-6 py-6">
            <Tabs defaultValue="accommodation" className="w-full">
              <TabsList className="grid w-full grid-cols-5 sticky top-0 bg-background z-10 border-b mb-6">
                <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
                <TabsTrigger value="carRental">Car Rental</TabsTrigger>
                <TabsTrigger value="dressCode">Dress Code</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="gifts">Gifts</TabsTrigger>
              </TabsList>

              {/* ACCOMMODATION */}
              <TabsContent value="accommodation" className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="Where to Stay"
                      value={formData.accommodation?.title || ''}
                      onChange={(e) => updateField('accommodation.title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      placeholder="Recommended hotels nearby"
                      value={formData.accommodation?.subtitle || ''}
                      onChange={(e) => updateField('accommodation.subtitle', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 mt-6">
                    <Label>Accommodation Options</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addItem('accommodation.items', { title: '', linkUrl: '', description: '' })}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(formData.accommodation?.items || []).map((item, idx) => (
                      <div key={item._id || idx} className="border p-4 rounded-lg space-y-3 relative">
                        <Input
                          placeholder="Hotel / Resort name"
                          value={item.title}
                          onChange={(e) => updateItem('accommodation.items', idx, 'title', e.target.value)}
                        />
                        <Input
                          placeholder="Booking / info link"
                          value={item.linkUrl}
                          onChange={(e) => updateItem('accommodation.items', idx, 'linkUrl', e.target.value)}
                        />
                        <Textarea
                          placeholder="Description, distance, price range..."
                          value={item.description || ''}
                          onChange={(e) => updateItem('accommodation.items', idx, 'description', e.target.value)}
                          rows={2}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                          onClick={() => removeItem('accommodation.items', idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* CAR RENTAL */}
              <TabsContent value="carRental" className="space-y-6 pt-2">
                {/* ... same structure as accommodation ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="Getting Around"
                      value={formData.carRental?.title || ''}
                      onChange={(e) => updateField('carRental.title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      placeholder="Trusted rental partners"
                      value={formData.carRental?.subtitle || ''}
                      onChange={(e) => updateField('carRental.subtitle', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 mt-6">
                    <Label>Car Rental Options</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addItem('carRental.items', { title: '', linkUrl: '', description: '' })}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(formData.carRental?.items || []).map((item, idx) => (
                      <div key={item._id || idx} className="border p-4 rounded-lg space-y-3 relative">
                        <Input
                          placeholder="Rental company name"
                          value={item.title}
                          onChange={(e) => updateItem('carRental.items', idx, 'title', e.target.value)}
                        />
                        <Input
                          placeholder="Booking / info link"
                          value={item.linkUrl}
                          onChange={(e) => updateItem('carRental.items', idx, 'linkUrl', e.target.value)}
                        />
                        <Textarea
                          placeholder="Vehicle types, price, pickup location..."
                          value={item.description || ''}
                          onChange={(e) => updateItem('carRental.items', idx, 'description', e.target.value)}
                          rows={2}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                          onClick={() => removeItem('carRental.items', idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* DRESS CODE */}
              <TabsContent value="dressCode" className="space-y-6 pt-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Dress Code"
                    value={formData.dressCode?.title || ''}
                    onChange={(e) => updateField('dressCode.title', e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 mt-6">
                    <Label>Dress Code Suggestions</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addItem('dressCode.items', { title: '', description: '' })}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Suggestion
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(formData.dressCode?.items || []).map((item, idx) => (
                      <div key={item._id || idx} className="border p-4 rounded-lg space-y-3 relative">
                        <Input
                          placeholder="e.g. Semi-Formal"
                          value={item.title}
                          onChange={(e) => updateItem('dressCode.items', idx, 'title', e.target.value)}
                        />
                        <Textarea
                          placeholder="Suggested attire, colors to avoid..."
                          value={item.description}
                          onChange={(e) => updateItem('dressCode.items', idx, 'description', e.target.value)}
                          rows={2}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                          onClick={() => removeItem('dressCode.items', idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Label>Footer Note</Label>
                  <Textarea
                    placeholder="e.g. Comfort is key – choose footwear accordingly"
                    value={formData.dressCode?.footerNote || ''}
                    onChange={(e) => updateField('dressCode.footerNote', e.target.value)}
                    rows={2}
                  />
                </div>
              </TabsContent>

              {/* FAQ */}
              <TabsContent value="faq" className="space-y-6 pt-2">
                <div>
                  <Label>Section Title</Label>
                  <Input
                    placeholder="Frequently Asked Questions"
                    value={formData.faq?.title || ''}
                    onChange={(e) => updateField('faq.title', e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 mt-6">
                    <Label>Questions & Answers</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addItem('faq.items', { question: '', answer: '' })}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add FAQ
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(formData.faq?.items || []).map((item, idx) => (
                      <div key={item._id || idx} className="border p-4 rounded-lg space-y-3 relative">
                        <Input
                          placeholder="Question"
                          value={item.question}
                          onChange={(e) => updateItem('faq.items', idx, 'question', e.target.value)}
                        />
                        <Textarea
                          placeholder="Answer"
                          value={item.answer}
                          onChange={(e) => updateItem('faq.items', idx, 'answer', e.target.value)}
                          rows={3}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                          onClick={() => removeItem('faq.items', idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* GIFTS */}
              <TabsContent value="gifts" className="space-y-6 pt-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Gifts & Registry"
                    value={formData.gifts?.title || ''}
                    onChange={(e) => updateField('gifts.title', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    placeholder="Your presence is the greatest gift"
                    value={formData.gifts?.subtitle || ''}
                    onChange={(e) => updateField('gifts.subtitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Your message about gifts, registry link, charity suggestion..."
                    value={formData.gifts?.description || ''}
                    onChange={(e) => updateField('gifts.description', e.target.value)}
                    rows={4}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Fixed Footer */}
          <div className="
            flex justify-end gap-4 
            px-6 py-4 
            border-t 
            bg-background 
            sticky bottom-0 z-20
          ">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)} 
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => mutate(formData)} 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save All Changes'
              )}
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- PREVIEW COMPONENTS ---------- */
// (unchanged - keeping your original preview components)

function PreviewCard({ section }: { section: any }) {
  return (
    <div className="border rounded-xl p-5 bg-card">
      <h3 className="font-semibold text-lg">{section.title}</h3>
      {section.subtitle && <p className="text-sm text-muted-foreground mt-1">{section.subtitle}</p>}
      <div className="mt-4 space-y-3">
        {section.items?.map((item: any) => (
          <div key={item._id} className="border rounded-lg p-4">
            <p className="font-medium">{item.title}</p>
            {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
            <a
              href={item.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm hover:underline mt-2 inline-block"
            >
              Visit link →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewSimple({ section }: { section: any }) {
  return (
    <div className="border rounded-xl p-5 bg-card">
      <h3 className="font-semibold text-lg">{section.title}</h3>
      <div className="mt-4 space-y-3">
        {section.items?.map((item: any) => (
          <div key={item._id} className="border rounded-lg p-4">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          </div>
        ))}
      </div>
      {section.footerNote && (
        <p className="mt-4 italic text-sm text-muted-foreground border-t pt-3">
          {section.footerNote}
        </p>
      )}
    </div>
  );
}

function PreviewFAQ({ section }: { section: any }) {
  return (
    <div className="border rounded-xl p-5 bg-card">
      <h3 className="font-semibold text-lg">{section.title || 'Frequently Asked Questions'}</h3>
      <div className="mt-4 space-y-4">
        {section.items?.map((item: any) => (
          <div key={item._id} className="border rounded-lg p-4">
            <p className="font-medium">{item.question}</p>
            <p className="text-sm text-muted-foreground mt-2">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewGifts({ section }: { section: any }) {
  return (
    <div className="border rounded-xl p-5 bg-card md:col-span-2">
      <h3 className="font-semibold text-lg">{section.title}</h3>
      {section.subtitle && <p className="text-sm text-muted-foreground mt-1">{section.subtitle}</p>}
      {section.description && <p className="mt-4 whitespace-pre-line">{section.description}</p>}
    </div>
  );
}