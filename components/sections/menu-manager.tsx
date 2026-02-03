// 'use client';

// import { useState } from 'react';
// import { mockMenus } from '@/lib/mock-data';
// import type { WeddingMenu } from '@/lib/types';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Edit, Plus, Trash2, X } from 'lucide-react';

// export function MenuManager() {
//   const [menus, setMenus] = useState<WeddingMenu[]>(mockMenus);
//   const [isOpen, setIsOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [formData, setFormData] = useState<Partial<WeddingMenu>>({});

//   const handleOpen = (menu?: WeddingMenu) => {
//     if (menu) {
//       setFormData(menu);
//       setEditingId(menu.id);
//     } else {
//       setFormData({
//         title: '',
//         menuSections: [],
//         printMenuUrl: '',
//       });
//       setEditingId(null);
//     }
//     setIsOpen(true);
//   };

//   const handleSave = () => {
//     if (editingId) {
//       setMenus(
//         menus.map((m) =>
//           m.id === editingId ? { ...m, ...formData } : m
//         )
//       );
//     } else {
//       setMenus([
//         ...menus,
//         { ...formData, id: Date.now().toString() } as WeddingMenu,
//       ]);
//     }
//     setIsOpen(false);
//   };

//   const handleDelete = (id: string) => {
//     setMenus(menus.filter((m) => m.id !== id));
//   };

//   const handleInputChange = (
//     field: keyof WeddingMenu,
//     value: any
//   ) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAddSection = () => {
//     const sections = formData.menuSections || [];
//     handleInputChange('menuSections', [
//       ...sections,
//       { categoryName: '', items: [] },
//     ]);
//   };

//   const handleRemoveSection = (index: number) => {
//     const sections = formData.menuSections || [];
//     handleInputChange('menuSections', sections.filter((_, i) => i !== index));
//   };

//   const handleSectionNameChange = (index: number, value: string) => {
//     const sections = formData.menuSections || [];
//     sections[index].categoryName = value;
//     handleInputChange('menuSections', [...sections]);
//   };

//   const handleAddItem = (sectionIndex: number, item: string) => {
//     const sections = formData.menuSections || [];
//     if (item.trim()) {
//       if (!sections[sectionIndex].items) {
//         sections[sectionIndex].items = [];
//       }
//       sections[sectionIndex].items.push(item);
//       handleInputChange('menuSections', [...sections]);
//     }
//   };

//   const handleRemoveItem = (sectionIndex: number, itemIndex: number) => {
//     const sections = formData.menuSections || [];
//     sections[sectionIndex].items = sections[sectionIndex].items.filter(
//       (_, i) => i !== itemIndex
//     );
//     handleInputChange('menuSections', [...sections]);
//   };

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Wedding Menu</h2>
//           <p className="text-muted-foreground mt-1">
//             Manage menu sections and items
//           </p>
//         </div>
//         <Button
//           onClick={() => handleOpen()}
//           className="gap-2"
//         >
//           <Plus className="w-4 h-4" />
//           Add Menu
//         </Button>
//       </div>

//       <div className="space-y-4">
//         {menus.map((menu) => (
//           <div
//             key={menu.id}
//             className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
//           >
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <h3 className="font-semibold text-foreground">{menu.title}</h3>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   {menu.menuSections.length} sections
//                 </p>
//                 <div className="mt-2 space-y-1">
//                   {menu.menuSections.map((section, idx) => (
//                     <p key={idx} className="text-xs text-muted-foreground">
//                       • {section.categoryName} ({section.items.length} items)
//                     </p>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleOpen(menu)}
//                   className="gap-1"
//                 >
//                   <Edit className="w-4 h-4" />
//                   Edit
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleDelete(menu.id)}
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
//         <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {editingId ? 'Edit Menu' : 'Add Menu'}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="title">Menu Title</Label>
//               <Input
//                 id="title"
//                 value={formData.title || ''}
//                 onChange={(e) =>
//                   handleInputChange('title', e.target.value)
//                 }
//                 placeholder="Wedding Menu"
//               />
//             </div>

//             <div>
//               <Label htmlFor="printMenuUrl">Print Menu URL</Label>
//               <Input
//                 id="printMenuUrl"
//                 value={formData.printMenuUrl || ''}
//                 onChange={(e) =>
//                   handleInputChange('printMenuUrl', e.target.value)
//                 }
//                 placeholder="https://example.com/menu.pdf"
//               />
//             </div>

//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <Label>Menu Sections</Label>
//                 <Button
//                   size="sm"
//                   onClick={handleAddSection}
//                   className="gap-1"
//                 >
//                   <Plus className="w-3 h-3" />
//                   Add Section
//                 </Button>
//               </div>

//               <div className="space-y-4">
//                 {(formData.menuSections || []).map((section, sectionIdx) => (
//                   <div
//                     key={sectionIdx}
//                     className="border border-border rounded p-3 space-y-2"
//                   >
//                     <div className="flex gap-2">
//                       <Input
//                         value={section.categoryName}
//                         onChange={(e) =>
//                           handleSectionNameChange(sectionIdx, e.target.value)
//                         }
//                         placeholder="Category name"
//                       />
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleRemoveSection(sectionIdx)}
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>

//                     <div className="space-y-2">
//                       {section.items.map((item, itemIdx) => (
//                         <div
//                           key={itemIdx}
//                           className="flex items-center gap-2 p-2 bg-accent/5 rounded"
//                         >
//                           <span className="flex-1 text-sm">{item}</span>
//                           <button
//                             onClick={() =>
//                               handleRemoveItem(sectionIdx, itemIdx)
//                             }
//                             className="p-1 hover:bg-accent rounded"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Add menu item"
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter') {
//                             handleAddItem(
//                               sectionIdx,
//                               e.currentTarget.value
//                             );
//                             e.currentTarget.value = '';
//                           }
//                         }}
//                       />
//                       <Button
//                         size="sm"
//                         onClick={(e) => {
//                           const input = (
//                             e.currentTarget.previousElementSibling as HTMLInputElement
//                           );
//                           handleAddItem(sectionIdx, input.value);
//                           input.value = '';
//                         }}
//                       >
//                         Add
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
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

import { useState, ChangeEvent } from 'react';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Edit, X, Plus } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const MENU_ENDPOINT = `${API_BASE}/details/menu`;

type MenuCategory = {
  categoryName: string;
  items: string[];
};

type WeddingMenu = {
  _id?: string;
  title?: string;
  menuSections: MenuCategory[];
  printMenuUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function MenuManager() {
  const queryClient = useQueryClient();
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2UwMjRmZmU2Mzg5ZmUxN2ZlOGY3NCIsImVtYWlsIjoiZmFyYWJpc3Vubnk1QGdtYWlsLmNvbSIsImlhdCI6MTc3MDAzMDIwOSwiZXhwIjoxNzcwNjM1MDA5fQ.sQNtfmrBUvFL2smeBVsUc7E9AE119xHC3TUjzEvOUZU'

  // ── Fetch current menu (single document) ─────────────────────
  const { data: menu, isLoading, isError, error } = useQuery<WeddingMenu>({
    queryKey: ['menu'],
    queryFn: async () => {
      const res = await fetch(MENU_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ← add when auth is ready
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load menu');
      }

      const json = await res.json();
      return json.data ?? { menuSections: [] };
    },
  });

  // ── Update menu (upsert) ─────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<WeddingMenu>) => {
      const res = await fetch(MENU_ENDPOINT, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update menu');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Menu updated successfully');
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setIsOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update menu');
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<WeddingMenu>>({});

  const handleOpen = () => {
    setFormData({
      title: menu?.title || '',
      menuSections: menu?.menuSections || [],

    });
    setIsOpen(true);
  };

  // ── Helpers for nested menu sections ─────────────────────────
  const updateField = (field: keyof WeddingMenu, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      menuSections: [...(prev.menuSections || []), { categoryName: '', items: [] }],
    }));
  };

  const removeSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      menuSections: (prev.menuSections || []).filter((_, i) => i !== index),
    }));
  };

  const updateSectionName = (index: number, name: string) => {
    setFormData((prev) => {
      const sections = [...(prev.menuSections || [])];
      sections[index] = { ...sections[index], categoryName: name };
      return { ...prev, menuSections: sections };
    });
  };

  const addItemToSection = (sectionIndex: number, item: string) => {
    if (!item.trim()) return;
    setFormData((prev) => {
      const sections = [...(prev.menuSections || [])];
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items: [...(sections[sectionIndex].items || []), item.trim()],
      };
      return { ...prev, menuSections: sections };
    });
  };

  const removeItemFromSection = (sectionIndex: number, itemIndex: number) => {
    setFormData((prev) => {
      const sections = [...(prev.menuSections || [])];
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items: sections[sectionIndex].items.filter((_, i) => i !== itemIndex),
      };
      return { ...prev, menuSections: sections };
    });
  };

  const handleSave = () => {
    if (!formData.title?.trim()) {
      toast.error('Menu title is required');
      return;
    }
    if (formData.menuSections?.length === 0) {
      toast.error('Add at least one menu section');
      return;
    }

    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load menu
        <p className="text-sm mt-2">{(error as Error)?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Wedding Menu</h2>
          <p className="text-muted-foreground">Manage menu sections and items</p>
        </div>
        <Button onClick={handleOpen} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Menu
        </Button>
      </div>

      {/* Current Menu Preview */}
      {menu && (menu.title || menu.menuSections?.length > 0) ? (
        <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
          {menu.title && (
            <div className="text-center">
              <h3 className="text-xl font-semibold">{menu.title}</h3>
              {/* {menu.printMenuUrl && (
                <a
                  href={menu.printMenuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  View Printable Menu →
                </a>
              )} */}
            </div>
          )}

          <div className="space-y-6">
            {menu.menuSections?.map((section, idx) => (
              <div key={idx} className="border rounded-lg p-5">
                <h4 className="font-semibold text-lg mb-3">{section.categoryName}</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm py-1 px-3 bg-muted/40 rounded">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {menu.updatedAt && (
            <p className="text-xs text-muted-foreground text-center">
              Last updated: {new Date(menu.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : (
        <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground bg-muted/30">
          No menu configured yet.<br />
          Click "Edit Menu" to add title, sections and items.
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Wedding Menu</DialogTitle>
          </DialogHeader>

          <div className="space-y-8 py-6">
            {/* Title & Print URL */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <Label htmlFor="title">Menu Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g. Our Wedding Menu"
                />
              </div>
              {/* <div>
                <Label htmlFor="printMenuUrl">Printable Menu URL (optional)</Label>
                <Input
                  id="printMenuUrl"
                  value={formData.printMenuUrl || ''}
                  onChange={(e) => updateField('printMenuUrl', e.target.value)}
                  placeholder="https://example.com/menu.pdf"
                />
              </div> */}
            </div>

            {/* Menu Sections */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Menu Sections</Label>
                <Button variant="outline" size="sm" onClick={addSection}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>

              <div className="space-y-6">
                {(formData.menuSections || []).map((section, sectionIdx) => (
                  <div
                    key={sectionIdx}
                    className="border rounded-lg p-5 bg-muted/30 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <Input
                        value={section.categoryName}
                        onChange={(e) => updateSectionName(sectionIdx, e.target.value)}
                        placeholder="e.g. Appetizers, Main Course, Desserts"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => removeSection(sectionIdx)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm">Items</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Add new item..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addItemToSection(sectionIdx, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                            className="w-64"
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addItemToSection(sectionIdx, input.value);
                              input.value = '';
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {section.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex items-center justify-between bg-background border rounded px-3 py-2 text-sm"
                          >
                            <span>{item}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive/80"
                              onClick={() => removeItemFromSection(sectionIdx, itemIdx)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-6 border-t sticky bottom-0 bg-background">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Menu'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}