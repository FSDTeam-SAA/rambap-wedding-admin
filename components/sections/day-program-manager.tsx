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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Edit, X, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const PROGRAM_ENDPOINT = `${API_BASE}/details/program`;

type DayProgramItem = {
  time: string;
  title: string;
  description: string;
  icon?: string;
  mapUrl?: string;
};

type DayProgram = {
  _id?: string;
  title?: string;

  subtitle?: string;
  items: DayProgramItem[];
  printUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function DayProgramManager() {
    const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  const queryClient = useQueryClient();
 const [isLang, setIsLang] = useState<"france" | "english">("english");

  // Fetch current day program
  const { data: program, isLoading, isError, error } = useQuery<DayProgram>({
    queryKey: ['dayProgram',isLang],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/details/program?lang=${isLang}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to load day program');
      }

      const json = await res.json();
      return json.data ?? { items: [] };
    },
  });

  // Update mutation (text + icons)
  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/details/program?lang=${isLang}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update day program');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Day program updated successfully');
      queryClient.invalidateQueries({ queryKey: ['dayProgram'] });
      setIsOpen(false);
      setNewIcons({});
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update day program');
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<DayProgram>>({ items: [] });
  const [newIcons, setNewIcons] = useState<Record<number, File>>({});

  const handleOpen = () => {
    setFormData({
      title: program?.title || '',
      subtitle: program?.subtitle || '',
      items: program?.items || [],
      printUrl: program?.printUrl || '',
    });
    setNewIcons({});
    setIsOpen(true);
  };

  // ── Helpers ──────────────────────────────────────────────────
  const updateField = (field: keyof DayProgram, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), { time: '', title: '', description: '' }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
    // Clean up any pending icon for this index
    setNewIcons((prev) => {
      const { [index]: _, ...rest } = prev;
      return rest;
    });
  };

  const updateItem = (index: number, field: keyof DayProgramItem, value: string) => {
    setFormData((prev) => {
      const items = [...(prev.items || [])];
      if (items[index]) {
        items[index] = { ...items[index], [field]: value };
      }
      return { ...prev, items };
    });
  };

  const handleIconChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewIcons((prev) => ({ ...prev, [index]: e.target.files![0] }));
    }
  };

  const handleSave = () => {
    if (!formData.title?.trim()) {
      toast.error('Program title is required');
      return;
    }
    if (formData.items?.length === 0) {
      toast.error('Add at least one timeline item');
      return;
    }

    const payload = new FormData();

    // Text fields
    if (formData.title) payload.append('title', formData.title);
    if (formData.subtitle) payload.append('subtitle', formData.subtitle);
    if (formData.printUrl) payload.append('printUrl', formData.printUrl);

    // Items array as JSON string — without icon fields
    payload.append('items', JSON.stringify(formData.items));

    // Icons as separate files with correct naming
    Object.entries(newIcons).forEach(([indexStr, file]) => {
      const index = Number(indexStr);
      payload.append(`items[${index}][icon]`, file);
    });

    updateMutation.mutate(payload);
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
        Failed to load day program
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
          Edit Schedule
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

      {/* Preview */}
      {program && (program.title || program.items?.length > 0) ? (
        <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
          {(program.title || program.subtitle) && (
            <div className="text-center pb-4 border-b">
              <h3 className="text-2xl font-semibold">{program.title || 'Our Wedding Day'}</h3>
              {program.subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{program.subtitle}</p>
              )}
              {program.printUrl && (
                <a
                  href={program.printUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  View Printable Schedule →
                </a>
              )}
            </div>
          )}

          {program.items?.length > 0 ? (
            <div className="space-y-6">
              {program.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-5 p-5 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-4 sm:w-32 shrink-0">
                    {item.icon && (
                      <img
                        src={item.icon}
                        alt=""
                        className="w-12 h-12 object-contain rounded-full"
                      />
                    )}
                    <div className="font-medium text-xl whitespace-nowrap">
                      {item.time}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                    {item.mapUrl && (
                      <a
                        href={item.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-3 inline-block"
                      >
                        View Location →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
              No events scheduled yet
            </div>
          )}

          {program.updatedAt && (
            <p className="text-xs text-muted-foreground text-center pt-4 border-t">
              Last updated: {new Date(program.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      ) : (
        <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground bg-muted/30">
          No day program configured yet.<br />
          Click "Edit Schedule" to build the timeline.
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Edit Wedding Day Program</DialogTitle>
          </DialogHeader>

          <div className="space-y-8 py-6">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className='space-y-3'>
                <Label htmlFor="title">Program Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g. Our Perfect Day"
                />
              </div>
              <div className='space-y-3'>
                <Label htmlFor="subtitle">Subtitle (optional)</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  placeholder="e.g. From vows to celebration"
                />
              </div>
            </div>

            {/* Timeline Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Timeline Events *</Label>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>

              <div className="space-y-6">
                {(formData.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-5 bg-muted/30 space-y-5 relative"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 text-destructive hover:text-destructive/80"
                      onClick={() => removeItem(idx)}
                    >
                      <X className="h-5 w-5" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div >
                        <Label className="text-sm">Time *</Label>
                        <Input
                          type="time"
                          value={item.time}
                          onChange={(e) => updateItem(idx, 'time', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Label className="text-sm">Event Title *</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => updateItem(idx, 'title', e.target.value)}
                          placeholder="Ceremony begins"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Description</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        placeholder="Details about the event..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Icon (optional)</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleIconChange(idx, e)}
                        />
                        {newIcons[idx] && (
                          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[180px]">
                            Selected: {newIcons[idx].name}
                          </p>
                        )}
                        {!newIcons[idx] && item.icon && (
                          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[180px]">
                            Current: {item.icon.split('/').pop()}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm">Map URL (optional)</Label>
                        <Input
                          value={item.mapUrl || ''}
                          onChange={(e) => updateItem(idx, 'mapUrl', e.target.value)}
                          placeholder="https://maps.app.goo.gl/..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-6 border-t sticky bottom-0 bg-background z-10">
            <Button
              variant="outline"
              className="hover:text-white"
              onClick={() => setIsOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className='text-white bg-[#f59e0a]'
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Schedule'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}