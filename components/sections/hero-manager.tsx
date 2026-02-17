// 'use client';

// import { useState, ChangeEvent } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { Edit, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';


// type Hero = {
//   _id?: string;
//   topMessage?: string;
//   partnerOne: string;
//   partnerTwo: string;
//   weddingDate?: string;
//   bottomMessage?: string;
//   videoUrl?: string;
//   countdownTitle?: string;
//   countdownSubtitle?: string;
//   createdAt?: string;
//   updatedAt?: string;
// };

// export function HeroManager() {
//   const queryClient = useQueryClient();
//   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2UwMjRmZmU2Mzg5ZmUxN2ZlOGY3NCIsImVtYWlsIjoiZmFyYWJpc3Vubnk1QGdtYWlsLmNvbSIsImlhdCI6MTc3MDAzMDIwOSwiZXhwIjoxNzcwNjM1MDA5fQ.sQNtfmrBUvFL2smeBVsUc7E9AE119xHC3TUjzEvOUZU'
//   const [isLang, setIsLang] = useState<'france' | 'english'>('english');

//   // ── Fetch current Hero ───────────────────────────────────────
//   const { data: hero, isLoading, isError } = useQuery<Hero>({
//     queryKey: ['hero', isLang],
//     queryFn: async () => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hero?lang=${isLang}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           // Authorization: `Bearer ${yourTokenHere}`, // ← add if route is protected
//         },
//       });

//       if (!res.ok) {
//         let errorMsg = 'Failed to load hero section';
//         try {
//           const err = await res.json();
//           errorMsg = err.message || errorMsg;
//         } catch { }
//         throw new Error(errorMsg);
//       }

//       const json = await res.json();
//       // Adjust based on your sendResponse shape → usually { success: true, data: {...} }
//       return json.data ?? ({} as Hero);
//     },
//   });

//   // ── Update / Create Hero (upsert) ────────────────────────────
//   const { mutate, isPending } = useMutation({
//     mutationFn: async (formDataPayload: FormData) => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hero?lang=${isLang}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataPayload,
//       });

//       if (!res.ok) {
//         let errorMsg = 'Failed to save hero section';
//         try {
//           const err = await res.json();
//           errorMsg = err.message || errorMsg;
//         } catch { }
//         throw new Error(errorMsg);
//       }

//       return res.json();
//     },

//     onSuccess: () => {
//       toast.success('Hero section updated successfully!', {
//         id: 'hero-toast',
//       });
//       queryClient.invalidateQueries({ queryKey: ['hero'] });
//       setIsOpen(false);
//       setFile(null);
//     },

//     onError: (err: Error) => {
//       toast.error(err.message || 'Could not update hero section', {
//         id: 'hero-toast',
//       });
//     },
//   });

//   const [isOpen, setIsOpen] = useState(false);
//   const [formData, setFormData] = useState<Partial<Hero>>({});
//   const [file, setFile] = useState<File | null>(null);

//   const handleOpen = () => {
//     setFormData(hero ?? {});
//     setFile(null);
//     setIsOpen(true);
//   };

//   const handleInputChange = (field: keyof Hero, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleSave = () => {
//     if (!formData.partnerOne?.trim() || !formData.partnerTwo?.trim()) {
//       toast.error('Partner One and Partner Two are required');
//       return;
//     }

//     const payload = new FormData();

//     // Only send fields that have values (backend merges via $set)
//     if (formData.topMessage !== undefined) payload.append('topMessage', formData.topMessage);
//     if (formData.partnerOne) payload.append('partnerOne', formData.partnerOne);
//     if (formData.partnerTwo) payload.append('partnerTwo', formData.partnerTwo);
//     if (formData.weddingDate !== undefined) payload.append('weddingDate', formData.weddingDate);
//     if (formData.bottomMessage !== undefined) payload.append('bottomMessage', formData.bottomMessage);
//     if (formData.countdownTitle !== undefined) payload.append('countdownTitle', formData.countdownTitle);
//     if (formData.countdownSubtitle !== undefined) payload.append('countdownSubtitle', formData.countdownSubtitle);

//     if (file) {
//       payload.append('file', file);
//     }

//     mutate(payload);
//   };

//   if (isLoading) {
//     return (
//       <div className="p-8 flex justify-center items-center min-h-[50vh]">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-8 text-center text-destructive">
//         Failed to load hero section. Please try again later.
//       </div>
//     );
//   }

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold">Hero Section</h2>
//           <p className="text-muted-foreground mt-1">
//             Manage the main banner / hero content for your wedding site
//           </p>
//         </div>

//         <Button onClick={handleOpen} className="gap-2">
//           <Edit className="h-4 w-4" />
//           Edit Hero
//         </Button>
//       </div>

//       {hero && Object.keys(hero).length > 0 ? (
//         <div className="border rounded-lg p-6 bg-card shadow-sm">
//           <div className="grid md:grid-cols-2 gap-8">
//             <div className="space-y-4">
//               <h3 className="text-xl font-semibold">
//                 {hero.partnerOne} <span className="text-muted-foreground">&</span> {hero.partnerTwo}
//               </h3>

//               {hero.weddingDate && (
//                 <p className="text-sm text-muted-foreground">
//                   Wedding Date: <span className="font-medium">{hero.weddingDate}</span>
//                 </p>
//               )}

//               {hero.topMessage && <p className="mt-4">{hero.topMessage}</p>}

//               {hero.bottomMessage && (
//                 <p className="mt-6 italic text-muted-foreground">{hero.bottomMessage}</p>
//               )}
//             </div>

//             <div className="space-y-6">
//               {hero.videoUrl && (
//                 <div>
//                   <p className="text-sm font-medium mb-1">Background Video</p>
//                   <a
//                     href={hero.videoUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-primary hover:underline text-sm break-all block"
//                   >
//                     {hero.videoUrl}
//                   </a>
//                 </div>
//               )}

//               {(hero.countdownTitle || hero.countdownSubtitle) && (
//                 <div>
//                   <p className="text-sm font-medium mb-1">Countdown Section</p>
//                   {hero.countdownTitle && <p>{hero.countdownTitle}</p>}
//                   {hero.countdownSubtitle && (
//                     <p className="text-sm text-muted-foreground">{hero.countdownSubtitle}</p>
//                   )}
//                 </div>
//               )}
//             </div>Common Questions
//           </div>
//         </div>
//       ) : (
//         <div className="border border-dashed rounded-lg p-12 text-center text-muted-foreground">
//           No hero content found yet.<br />Click "Edit Hero" to set it up.
//         </div>
//       )}


//       {/* ── Edit Hero Dialog ───────────────────────────────── */}
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="max-w-4xl p-0 overflow-hidden">

//           {/* Header */}
//           <div className="px-6 py-5 border-b bg-background">
//             <DialogTitle className="text-2xl font-semibold tracking-tight">
//               Edit Hero Section
//             </DialogTitle>
//             <p className="text-sm text-muted-foreground mt-1">
//               Manage hero content, date and background video
//             </p>
//           </div>

//           {/* Body */}
//           <div className="p-6 space-y-7 bg-muted/20 max-h-[70vh] overflow-y-auto">

//             {/* Couple Names */}
//             <section className="bg-background rounded-2xl border p-6 space-y-4 shadow-sm">
//               <div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="gap-2"
//                   onClick={() => {
//                     setIsLang((prev) => (prev === 'english' ? 'france' : 'english'));
//                   }}
//                 >
//                   Switch to {isLang === 'english' ? 'French' : 'English'} Version
//                 </Button>
//               </div>
//               <h3 className="font-semibold">Couple Names</h3>

//               <div className="grid md:grid-cols-2 gap-5">
//                 <div className="space-y-2">
//                   <Label>Partner One *</Label>
//                   <Input
//                     value={formData.partnerOne ?? ""}
//                     onChange={(e) =>
//                       handleInputChange("partnerOne", e.target.value)
//                     }
//                     placeholder="Sarah"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Partner Two *</Label>
//                   <Input
//                     value={formData.partnerTwo ?? ""}
//                     onChange={(e) =>
//                       handleInputChange("partnerTwo", e.target.value)
//                     }
//                     placeholder="James"
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* Wedding Date */}
//             <section className="bg-background rounded-2xl border p-6 space-y-3 shadow-sm">
//               <h3 className="font-semibold">Wedding Date</h3>

//               <Input
//                 type="date"
//                 value={formData.weddingDate ?? ""}
//                 onChange={(e) =>
//                   handleInputChange("weddingDate", e.target.value)
//                 }
//               />
//             </section>

//             {/* Messages */}
//             <section className="bg-background rounded-2xl border p-6 space-y-4 shadow-sm">
//               <h3 className="font-semibold">Hero Messages</h3>

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>Top Message</Label>
//                   <Textarea
//                     rows={2}
//                     value={formData.topMessage ?? ""}
//                     onChange={(e) =>
//                       handleInputChange("topMessage", e.target.value)
//                     }
//                     placeholder="We're getting married!"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Bottom Message</Label>
//                   <Textarea
//                     rows={2}
//                     value={formData.bottomMessage ?? ""}
//                     onChange={(e) =>
//                       handleInputChange("bottomMessage", e.target.value)
//                     }
//                     placeholder="Join us on our special day"
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* Countdown */}
//             <section className="bg-background rounded-2xl border p-6 space-y-4 shadow-sm">
//               <h3 className="font-semibold">Countdown Text</h3>

//               <div className="grid md:grid-cols-2 gap-5">
//                 <div className="space-y-2">
//                   <Label>Title</Label>
//                   <Input
//                     value={formData.countdownTitle ?? ""}
//                     onChange={(e) =>
//                       handleInputChange("countdownTitle", e.target.value)
//                     }
//                     placeholder="Forever starts in"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Subtitle</Label>
//                   <Input
//                     value={formData.countdownSubtitle ?? ""}
//                     onChange={(e) =>
//                       handleInputChange("countdownSubtitle", e.target.value)
//                     }
//                     placeholder="Our Big Day"
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* Background Video */}
//             <section className="bg-background rounded-2xl border p-6 space-y-4 shadow-sm">
//               <h3 className="font-semibold">Background Video</h3>

//               <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-muted/40 transition">
//                 <Input
//                   type="file"
//                   accept="video/mp4,video/webm,video/ogg"
//                   onChange={handleFileChange}
//                   className="cursor-pointer"
//                 />

//                 <p className="text-xs text-muted-foreground mt-2">
//                   MP4, WebM or OGG • Max recommended 50MB
//                 </p>
//               </div>

//               {file && (
//                 <p className="text-sm">
//                   🎬 {file.name} • {(file.size / 1024 / 1024).toFixed(1)} MB
//                 </p>
//               )}
//             </section>
//           </div>

//           {/* Footer */}
//           <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex justify-end gap-3">
//             <Button
//               variant="outline"
//               onClick={() => setIsOpen(false)}
//               disabled={isPending}
//             >
//               Cancel
//             </Button>

//             <Button
//               onClick={handleSave}
//               disabled={
//                 isPending ||
//                 !formData.partnerOne?.trim() ||
//                 !formData.partnerTwo?.trim()
//               }
//             >
//               {isPending ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save Changes"
//               )}
//             </Button>
//           </div>

//         </DialogContent>
//       </Dialog>


//     </div>
//   );
// }




'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Hero = {
  _id?: string;
  topMessage?: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate?: string;
  bottomMessage?: string;
  videoUrl?: string;
  countdownTitle?: string;
  countdownSubtitle?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function HeroManager() {
  const queryClient = useQueryClient();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2UwMjRmZmU2Mzg5ZmUxN2ZlOGY3NCIsImVtYWlsIjoiZmFyYWJpc3Vubnk1QGdtYWlsLmNvbSIsImlhdCI6MTc3MTMzNDU5NywiZXhwIjoxNzcxOTM5Mzk3fQ.mAD9YpgWT3X0IktWFaT4sgKSvhKlOEDqTsMgI5qKyfE';

  const [isLang, setIsLang] = useState<'france' | 'english'>('english');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Hero>>({});
  const [file, setFile] = useState<File | null>(null);

  // ── Fetch current Hero ───────────────────────────────────────
  const { data: hero, isLoading, isError } = useQuery<Hero>({
    queryKey: ['hero', isLang],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/hero?lang=${isLang}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        let errorMsg = 'Failed to load hero section';
        try {
          const err = await res.json();
          errorMsg = err.message || errorMsg;
        } catch { }
        throw new Error(errorMsg);
      }

      const json = await res.json();
      return json.data ?? ({} as Hero);
    },
  });

  // ✅ IMPORTANT — sync form when hero or language changes
  useEffect(() => {
    if (hero && isOpen) {
      setFormData(hero);
    }
  }, [hero, isLang, isOpen]);

  // ── Update / Create Hero ────────────────────────────
  const { mutate, isPending } = useMutation({
    mutationFn: async (formDataPayload: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/hero?lang=${isLang}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataPayload,
        }
      );

      if (!res.ok) {
        let errorMsg = 'Failed to save hero section';
        try {
          const err = await res.json();
          errorMsg = err.message || errorMsg;
        } catch { }
        throw new Error(errorMsg);
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success('Hero section updated successfully!', {
        id: 'hero-toast',
      });

      // ✅ language-aware invalidation
      queryClient.invalidateQueries({
        queryKey: ['hero', isLang],
      });

      setIsOpen(false);
      setFile(null);
    },

    onError: (err: Error) => {
      toast.error(err.message || 'Could not update hero section', {
        id: 'hero-toast',
      });
    },
  });

  const handleOpen = () => {
    setFormData(hero ?? {});
    setFile(null);
    setIsOpen(true);
  };

  const handleInputChange = (field: keyof Hero, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!formData.partnerOne?.trim() || !formData.partnerTwo?.trim()) {
      toast.error('Partner One and Partner Two are required');
      return;
    }

    const payload = new FormData();

    if (formData.topMessage !== undefined)
      payload.append('topMessage', formData.topMessage);
    if (formData.partnerOne)
      payload.append('partnerOne', formData.partnerOne);
    if (formData.partnerTwo)
      payload.append('partnerTwo', formData.partnerTwo);
    if (formData.weddingDate !== undefined)
      payload.append('weddingDate', formData.weddingDate);
    if (formData.bottomMessage !== undefined)
      payload.append('bottomMessage', formData.bottomMessage);
    if (formData.countdownTitle !== undefined)
      payload.append('countdownTitle', formData.countdownTitle);
    if (formData.countdownSubtitle !== undefined)
      payload.append('countdownSubtitle', formData.countdownSubtitle);

    if (file) {
      payload.append('file', file);
    }

    mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load hero section. Please try again later.
      </div>
    );
  }

  // ── JSX ─────────────────────────────────────────────────────
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Hero Section</h2>
          <p className="text-muted-foreground mt-1">
            Manage the main banner / hero content for your wedding site
          </p>
        </div>

        <Button onClick={handleOpen} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Hero
        </Button>
      </div>

      {hero && Object.keys(hero).length > 0 ? (
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <div>
            <Button
              onClick={() => {
                setIsLang((prev) => (prev === 'english' ? 'france' : 'english'));
              }}
              variant="outline"
              size="sm"
              className="gap-2 mb-4"
            >

              Switch to {isLang === 'english' ? 'French' : 'English'} Version
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                {hero.partnerOne} <span className="text-muted-foreground">&</span> {hero.partnerTwo}
              </h3>

              {hero.weddingDate && (
                <p className="text-sm text-muted-foreground">
                  Wedding Date: <span className="font-medium">{hero.weddingDate}</span>
                </p>
              )}

              {hero.topMessage && <p className="mt-4">{hero.topMessage}</p>}

              {hero.bottomMessage && (
                <p className="mt-6 italic text-muted-foreground">{hero.bottomMessage}</p>
              )}
            </div>

            <div className="space-y-6">
              {hero.videoUrl && (
                <div>
                  <p className="text-sm font-medium mb-1">Background Image</p>
                  <a
                    href={hero.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all block"
                  >
                    {hero.videoUrl}
                  </a>
                </div>
              )}

              {(hero.countdownTitle || hero.countdownSubtitle) && (
                <div>
                  <p className="text-sm font-medium mb-1">Countdown Section</p>
                  {hero.countdownTitle && <p>{hero.countdownTitle}</p>}
                  {hero.countdownSubtitle && (
                    <p className="text-sm text-muted-foreground">{hero.countdownSubtitle}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-12 text-center text-muted-foreground">
          No hero content found yet.<br />Click "Edit Hero" to set it up.
        </div>
      )}


      {/* ── Edit Hero Dialog ───────────────────────────────── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b bg-background">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Edit Hero Section
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage hero content, date and background video
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-7 bg-muted/20 max-h-[70vh] overflow-y-auto">

            {/* Couple Names */}
            <section className="bg-background rounded-2xl border p-6 space-y-4 shadow-sm">
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setIsLang((prev) => (prev === 'english' ? 'france' : 'english'));
                  }}
                >
                  Switch to {isLang === 'english' ? 'French' : 'English'} Version
                </Button>
              </div>
              <h3 className="font-semibold">Couple Names</h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Partner One *</Label>
                  <Input
                    value={formData.partnerOne ?? ""}
                    onChange={(e) =>
                      handleInputChange("partnerOne", e.target.value)
                    }
                    placeholder="Sarah"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Partner Two *</Label>
                  <Input
                    value={formData.partnerTwo ?? ""}
                    onChange={(e) =>
                      handleInputChange("partnerTwo", e.target.value)
                    }
                    placeholder="James"
                  />
                </div>
              </div>
            </section>

            {/* Wedding Date */}
            <section className="bg-background rounded-2xl border p-6 space-y-3 shadow-sm">
              <h3 className="font-semibold">Wedding Date</h3>

              <Input
                type="date"
                value={formData.weddingDate ?? ""}
                onChange={(e) =>
                  handleInputChange("weddingDate", e.target.value)
                }
              />
            </section>

            {/* Messages */}
            <section className="bg-background rounded-2xl border p-6 space-y-4 shadow-sm">
              <h3 className="font-semibold">Hero Messages</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Top Message</Label>
                  <Textarea
                    rows={2}
                    value={formData.topMessage ?? ""}
                    onChange={(e) =>
                      handleInputChange("topMessage", e.target.value)
                    }
                    placeholder="We're getting married!"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bottom Message</Label>
                  <Textarea
                    rows={2}
                    value={formData.bottomMessage ?? ""}
                    onChange={(e) =>
                      handleInputChange("bottomMessage", e.target.value)
                    }
                    placeholder="Join us on our special day"
                  />
                </div>
              </div>
            </section>

            {/* Countdown */}
            <section className="bg-background rounded-2xl border p-6 space-y-4 shadow-sm">
              <h3 className="font-semibold">Countdown Text</h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.countdownTitle ?? ""}
                    onChange={(e) =>
                      handleInputChange("countdownTitle", e.target.value)
                    }
                    placeholder="Forever starts in"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={formData.countdownSubtitle ?? ""}
                    onChange={(e) =>
                      handleInputChange("countdownSubtitle", e.target.value)
                    }
                    placeholder="Our Big Day"
                  />
                </div>
              </div>
            </section>

            {/* Background Image */}
            <section className="bg-background rounded-2xl border p-6 space-y-4 shadow-sm">
              <h3 className="font-semibold">Background Image</h3>

              <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-muted/40 transition">
                <Input
                  type="file"
                  accept='image/*'
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />

                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF • Max recommended 10MB
                </p>
              </div>

              {file && (
                <p className="text-sm">
                  {file.name} • {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              )}
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={
                isPending ||
                !formData.partnerOne?.trim() ||
                !formData.partnerTwo?.trim()
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>

        </DialogContent>
      </Dialog>


    </div>
  );
}