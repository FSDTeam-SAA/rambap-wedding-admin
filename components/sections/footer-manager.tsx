'use client';

import { useState } from 'react';
import { mockFooters } from '@/lib/mock-data';
import type { Footer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Trash2 } from 'lucide-react';

export function FooterManager() {
  const [footers, setFooters] = useState<Footer[]>(mockFooters);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Footer>>({});

  const handleOpen = (footer?: Footer) => {
    if (footer) {
      setFormData(footer);
      setEditingId(footer.id);
    } else {
      setFormData({
        partnerOne: '',
        partnerTwo: '',
        date: '',
        footerNote: '',
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setFooters(
        footers.map((f) =>
          f.id === editingId ? { ...f, ...formData } : f
        )
      );
    } else {
      setFooters([
        ...footers,
        { ...formData, id: Date.now().toString() } as Footer,
      ]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setFooters(footers.filter((f) => f.id !== id));
  };

  const handleInputChange = (
    field: keyof Footer,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Footer</h2>
          <p className="text-muted-foreground mt-1">
            Manage website footer content
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Footer
        </Button>
      </div>

      <div className="space-y-4">
        {footers.map((footer) => (
          <div
            key={footer.id}
            className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {footer.partnerOne} & {footer.partnerTwo}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {footer.date}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {footer.footerNote}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(footer)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(footer.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Footer' : 'Add Footer'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partnerOne">Partner One</Label>
                <Input
                  id="partnerOne"
                  value={formData.partnerOne || ''}
                  onChange={(e) =>
                    handleInputChange('partnerOne', e.target.value)
                  }
                  placeholder="First partner name"
                />
              </div>
              <div>
                <Label htmlFor="partnerTwo">Partner Two</Label>
                <Input
                  id="partnerTwo"
                  value={formData.partnerTwo || ''}
                  onChange={(e) =>
                    handleInputChange('partnerTwo', e.target.value)
                  }
                  placeholder="Second partner name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ''}
                onChange={(e) =>
                  handleInputChange('date', e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="footerNote">Footer Note</Label>
              <Textarea
                id="footerNote"
                value={formData.footerNote || ''}
                onChange={(e) =>
                  handleInputChange('footerNote', e.target.value)
                }
                placeholder="Footer closing message"
              />
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
