'use client';

import { useState } from 'react';
import { mockDayPrograms } from '@/lib/mock-data';
import type { DayProgram, DayProgramItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Trash2, X } from 'lucide-react';

export function DayProgramManager() {
  const [programs, setPrograms] = useState<DayProgram[]>(mockDayPrograms);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DayProgram>>({});

  const handleOpen = (program?: DayProgram) => {
    if (program) {
      setFormData(program);
      setEditingId(program.id);
    } else {
      setFormData({
        title: '',
        subtitle: '',
        items: [],
        printUrl: '',
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setPrograms(
        programs.map((p) =>
          p.id === editingId ? { ...p, ...formData } : p
        )
      );
    } else {
      setPrograms([
        ...programs,
        { ...formData, id: Date.now().toString() } as DayProgram,
      ]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setPrograms(programs.filter((p) => p.id !== id));
  };

  const handleInputChange = (
    field: keyof DayProgram,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    const items = formData.items || [];
    handleInputChange('items', [
      ...items,
      { time: '', title: '', description: '', icon: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const items = formData.items || [];
    handleInputChange('items', items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof DayProgramItem,
    value: string
  ) => {
    const items = formData.items || [];
    items[index] = { ...items[index], [field]: value };
    handleInputChange('items', [...items]);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Day Program</h2>
          <p className="text-muted-foreground mt-1">
            Manage wedding day schedule
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </Button>
      </div>

      <div className="space-y-4">
        {programs.map((program) => (
          <div
            key={program.id}
            className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{program.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {program.subtitle}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {program.items.length} events
                </p>
                <div className="mt-2 space-y-1">
                  {program.items.slice(0, 3).map((item, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground">
                      {item.time} - {item.title}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(program)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(program.id)}
                  className="gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Program' : 'Add Program'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Program Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) =>
                  handleInputChange('title', e.target.value)
                }
                placeholder="Wedding Day Schedule"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle || ''}
                onChange={(e) =>
                  handleInputChange('subtitle', e.target.value)
                }
                placeholder="Schedule subtitle"
              />
            </div>

            <div>
              <Label htmlFor="printUrl">Print URL</Label>
              <Input
                id="printUrl"
                value={formData.printUrl || ''}
                onChange={(e) =>
                  handleInputChange('printUrl', e.target.value)
                }
                placeholder="https://example.com/schedule.pdf"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Timeline Items</Label>
                <Button
                  size="sm"
                  onClick={handleAddItem}
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {(formData.items || []).map((item, idx) => (
                  <div key={idx} className="border border-border rounded p-3 space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label className="text-xs">Time</Label>
                        <Input
                          value={item.time}
                          onChange={(e) =>
                            handleItemChange(idx, 'time', e.target.value)
                          }
                          placeholder="14:00"
                          type="time"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          handleItemChange(idx, 'title', e.target.value)
                        }
                        placeholder="Event title"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(idx, 'description', e.target.value)
                        }
                        placeholder="Event description"
                        className="h-20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Icon</Label>
                        <Input
                          value={item.icon}
                          onChange={(e) =>
                            handleItemChange(idx, 'icon', e.target.value)
                          }
                          placeholder="Icon name"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Map URL</Label>
                        <Input
                          value={item.mapUrl || ''}
                          onChange={(e) =>
                            handleItemChange(idx, 'mapUrl', e.target.value)
                          }
                          placeholder="Map link (optional)"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
