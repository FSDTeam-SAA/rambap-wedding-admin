'use client';

import { useState } from 'react';
import { mockGalleries } from '@/lib/mock-data';
import type { Gallery } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Trash2, X } from 'lucide-react';

export function GalleryManager() {
  const [galleries, setGalleries] = useState<Gallery[]>(mockGalleries);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Gallery>>({});

  const handleOpen = (gallery?: Gallery) => {
    if (gallery) {
      setFormData(gallery);
      setEditingId(gallery.id);
    } else {
      setFormData({
        title: '',
        subtitle: '',
        images: [],
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setGalleries(
        galleries.map((g) =>
          g.id === editingId ? { ...g, ...formData } : g
        )
      );
    } else {
      setGalleries([
        ...galleries,
        { ...formData, id: Date.now().toString() } as Gallery,
      ]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setGalleries(galleries.filter((g) => g.id !== id));
  };

  const handleInputChange = (
    field: keyof Gallery,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = (url: string) => {
    const images = formData.images || [];
    if (url.trim()) {
      handleInputChange('images', [...images, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const images = formData.images || [];
    handleInputChange('images', images.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gallery</h2>
          <p className="text-muted-foreground mt-1">
            Manage wedding photo galleries
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Gallery
        </Button>
      </div>

      <div className="space-y-4">
        {galleries.map((gallery) => (
          <div
            key={gallery.id}
            className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{gallery.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {gallery.subtitle}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {gallery.images.length} images
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(gallery)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(gallery.id)}
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
              {editingId ? 'Edit Gallery' : 'Add Gallery'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Gallery Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) =>
                  handleInputChange('title', e.target.value)
                }
                placeholder="Gallery title"
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
                placeholder="Gallery subtitle"
              />
            </div>

            <div>
              <Label>Images</Label>
              <div className="space-y-2">
                {(formData.images || []).map((img, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-accent/5 rounded">
                    <span className="flex-1 text-sm truncate">{img}</span>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 hover:bg-accent rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="imageUrl">Add Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddImage(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    handleAddImage(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
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
