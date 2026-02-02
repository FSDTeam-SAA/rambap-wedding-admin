// 'use client';

// import { useState } from 'react';
// import { mockFooters } from '@/lib/mock-data';
// import type { Footer } from '@/lib/types';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { Edit, Plus, Trash2 } from 'lucide-react';

// export function FooterManager() {
//   const [footers, setFooters] = useState<Footer[]>(mockFooters);
//   const [isOpen, setIsOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [formData, setFormData] = useState<Partial<Footer>>({});

//   const handleOpen = (footer?: Footer) => {
//     if (footer) {
//       setFormData(footer);
//       setEditingId(footer.id);
//     } else {
//       setFormData({
//         partnerOne: '',
//         partnerTwo: '',
//         date: '',
//         footerNote: '',
//       });
//       setEditingId(null);
//     }
//     setIsOpen(true);
//   };

//   const handleSave = () => {
//     if (editingId) {
//       setFooters(
//         footers.map((f) =>
//           f.id === editingId ? { ...f, ...formData } : f
//         )
//       );
//     } else {
//       setFooters([
//         ...footers,
//         { ...formData, id: Date.now().toString() } as Footer,
//       ]);
//     }
//     setIsOpen(false);
//   };

//   const handleDelete = (id: string) => {
//     setFooters(footers.filter((f) => f.id !== id));
//   };

//   const handleInputChange = (
//     field: keyof Footer,
//     value: string
//   ) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Footer</h2>
//           <p className="text-muted-foreground mt-1">
//             Manage website footer content
//           </p>
//         </div>
//         <Button
//           onClick={() => handleOpen()}
//           className="gap-2"
//         >
//           <Plus className="w-4 h-4" />
//           Add Footer
//         </Button>
//       </div>

//       <div className="space-y-4">
//         {footers.map((footer) => (
//           <div
//             key={footer.id}
//             className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
//           >
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <h3 className="font-semibold text-foreground">
//                   {footer.partnerOne} & {footer.partnerTwo}
//                 </h3>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   {footer.date}
//                 </p>
//                 <p className="text-sm text-muted-foreground mt-2">
//                   {footer.footerNote}
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleOpen(footer)}
//                   className="gap-1"
//                 >
//                   <Edit className="w-4 h-4" />
//                   Edit
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleDelete(footer.id)}
//                   className="gap-1 text-destructive hover:text-destructive"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>
//               {editingId ? 'Edit Footer' : 'Add Footer'}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="partnerOne">Partner One</Label>
//                 <Input
//                   id="partnerOne"
//                   value={formData.partnerOne || ''}
//                   onChange={(e) =>
//                     handleInputChange('partnerOne', e.target.value)
//                   }
//                   placeholder="First partner name"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="partnerTwo">Partner Two</Label>
//                 <Input
//                   id="partnerTwo"
//                   value={formData.partnerTwo || ''}
//                   onChange={(e) =>
//                     handleInputChange('partnerTwo', e.target.value)
//                   }
//                   placeholder="Second partner name"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="date">Date</Label>
//               <Input
//                 id="date"
//                 type="date"
//                 value={formData.date || ''}
//                 onChange={(e) =>
//                   handleInputChange('date', e.target.value)
//                 }
//               />
//             </div>

//             <div>
//               <Label htmlFor="footerNote">Footer Note</Label>
//               <Textarea
//                 id="footerNote"
//                 value={formData.footerNote || ''}
//                 onChange={(e) =>
//                   handleInputChange('footerNote', e.target.value)
//                 }
//                 placeholder="Footer closing message"
//               />
//             </div>

//             <div className="flex justify-end gap-2 pt-4">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleSave}>
//                 {editingId ? 'Update' : 'Create'}
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const FOOTER_ENDPOINT = `${API_BASE}/footer`; // matches your route: GET/PUT /footer

type Footer = {
  _id?: string;
  partnerOne: string;
  partnerTwo: string;
  date: string;
  footerNote?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function FooterManager() {
  const queryClient = useQueryClient();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2UwMjRmZmU2Mzg5ZmUxN2ZlOGY3NCIsImVtYWlsIjoiZmFyYWJpc3Vubnk1QGdtYWlsLmNvbSIsImlhdCI6MTc3MDAzMDIwOSwiZXhwIjoxNzcwNjM1MDA5fQ.sQNtfmrBUvFL2smeBVsUc7E9AE119xHC3TUjzEvOUZU'

  // ── Fetch current Footer ─────────────────────────────────────
  const { data: footer, isLoading, isError } = useQuery<Footer>({
    queryKey: ['footer'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/footer`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,   // ← uncomment if route is protected
        },
      });

      if (!res.ok) {
        let msg = 'Failed to load footer content';
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch { }
        throw new Error(msg);
      }

      const json = await res.json();
      // Adjust based on your response shape → usually { success: true, data: {...} }
      return json.data ?? ({} as Footer);
    },
  });

  // ── Update Footer (upsert) ───────────────────────────────────
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: Partial<Footer>) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/footer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = 'Failed to update footer';
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch { }
        throw new Error(msg);
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success('Footer updated successfully!', {
        id: 'footer-update-toast',
      });
      queryClient.invalidateQueries({ queryKey: ['footer'] });
      setIsOpen(false);
    },

    onError: (err: Error) => {
      toast.error(err.message || 'Could not save footer content', {
        id: 'footer-update-toast',
      });
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Footer>>({});

  const handleOpen = () => {
    setFormData(footer ?? {});
    setIsOpen(true);
  };

  const handleInputChange = (field: keyof Footer, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Basic required fields check (matches your schema)
    if (
      !formData.partnerOne?.trim() ||
      !formData.partnerTwo?.trim() ||
      !formData.date?.trim()
    ) {
      toast.error('Partner names and date are required');
      return;
    }

    mutate(formData);
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
        Failed to load footer content. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Footer</h2>
          <p className="text-muted-foreground mt-1">
            Manage the website footer content
          </p>
        </div>

        <Button onClick={handleOpen} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Footer
        </Button>
      </div>

      {footer && Object.keys(footer).length > 0 ? (
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3 className="text-xl font-semibold">
              {footer.partnerOne} <span className="text-muted-foreground">&</span> {footer.partnerTwo}
            </h3>

            <p className="text-muted-foreground">
              {footer.date}
            </p>

            {footer.footerNote && (
              <p className="text-sm text-muted-foreground mt-4">
                {footer.footerNote}
              </p>
            )}

            {footer.updatedAt && (
              <p className="text-xs text-muted-foreground/70 mt-6">
                Last updated: {new Date(footer.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-12 text-center text-muted-foreground">
          No footer content set yet.<br />
          Click "Edit Footer" to add partner names, date and note.
        </div>
      )}

      {/* ── Edit Dialog ─────────────────────────────────────────────── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Footer Content</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partnerOne">Partner One *</Label>
                <Input
                  id="partnerOne"
                  value={formData.partnerOne ?? ''}
                  onChange={(e) => handleInputChange('partnerOne', e.target.value)}
                  placeholder="e.g. Sarah"
                />
              </div>
              <div>
                <Label htmlFor="partnerTwo">Partner Two *</Label>
                <Input
                  id="partnerTwo"
                  value={formData.partnerTwo ?? ''}
                  onChange={(e) => handleInputChange('partnerTwo', e.target.value)}
                  placeholder="e.g. James"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date">Wedding Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date ?? ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="footerNote">Footer Note</Label>
              <Textarea
                id="footerNote"
                value={formData.footerNote ?? ''}
                onChange={(e) => handleInputChange('footerNote', e.target.value)}
                placeholder="e.g. With love, forever and always..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Footer'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}