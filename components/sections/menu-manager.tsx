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
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2UwMjRmZmU2Mzg5ZmUxN2ZlOGY3NCIsImVtYWlsIjoiZmFyYWJpc3Vubnk1QGdtYWlsLmNvbSIsImlhdCI6MTc3MTMzNDU5NywiZXhwIjoxNzcxOTM5Mzk3fQ.mAD9YpgWT3X0IktWFaT4sgKSvhKlOEDqTsMgI5qKyfE";
 const [isLang, setIsLang] = useState<"france" | "english">("english");

  // ── Fetch current menu (single document) ─────────────────────
  const { data: menu, isLoading, isError, error } = useQuery<WeddingMenu>({
    queryKey: ['menu',isLang],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/details/menu?lang=${isLang}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/details/menu?lang=${isLang}`, {
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
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
    
        <Button onClick={handleOpen} className="gap-2 bg-[#f59e0a] text-white">
          <Edit className="h-4 w-4" />
          Edit Menu
        </Button>
      </div>
   <div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 mb-4 hover:text-white"
          onClick={() =>
            setIsLang((prev) => (prev === "english" ? "france" : "english"))
          }
        >
          Switch to {isLang === "english" ? "French" : "English"} Version
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
        <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Wedding Menu</DialogTitle>
          </DialogHeader>

          <div className="space-y-8 py-6">
            {/* Title & Print URL */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className='space-y-3'>
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
              className="hover:text-white"
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className='text-white bg-[#f59e0a]'
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