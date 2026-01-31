'use client';

import { useState } from 'react';
import { mockHeroes } from '@/lib/mock-data';
import type { Hero } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Trash2 } from 'lucide-react';

export function HeroManager() {
  const [heroes, setHeroes] = useState<Hero[]>(mockHeroes);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Hero>>({});

  const handleOpen = (hero?: Hero) => {
    if (hero) {
      setFormData(hero);
      setEditingId(hero.id);
    } else {
      setFormData({
        topMessage: '',
        partnerOne: '',
        partnerTwo: '',
        weddingDate: '',
        bottomMessage: '',
        videoUrl: '',
        countdownTitle: '',
        countdownSubtitle: '',
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setHeroes(
        heroes.map((h) =>
          h.id === editingId ? { ...h, ...formData } : h
        )
      );
    } else {
      setHeroes([
        ...heroes,
        { ...formData, id: Date.now().toString() } as Hero,
      ]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setHeroes(heroes.filter((h) => h.id !== id));
  };

  const handleInputChange = (
    field: keyof Hero,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Hero Section</h2>
          <p className="text-muted-foreground mt-1">
            Manage your wedding website hero content
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Hero
        </Button>
      </div>

      <div className="space-y-4">
        {heroes.map((hero) => (
          <div
            key={hero.id}
            className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {hero.partnerOne} & {hero.partnerTwo}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {hero.weddingDate}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {hero.topMessage}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(hero)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(hero.id)}
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
              {editingId ? 'Edit Hero Section' : 'Add Hero Section'}
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
              <Label htmlFor="weddingDate">Wedding Date</Label>
              <Input
                id="weddingDate"
                type="date"
                value={formData.weddingDate || ''}
                onChange={(e) =>
                  handleInputChange('weddingDate', e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="topMessage">Top Message</Label>
              <Textarea
                id="topMessage"
                value={formData.topMessage || ''}
                onChange={(e) =>
                  handleInputChange('topMessage', e.target.value)
                }
                placeholder="Welcome message"
              />
            </div>

            <div>
              <Label htmlFor="bottomMessage">Bottom Message</Label>
              <Textarea
                id="bottomMessage"
                value={formData.bottomMessage || ''}
                onChange={(e) =>
                  handleInputChange('bottomMessage', e.target.value)
                }
                placeholder="Call to action"
              />
            </div>

            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl || ''}
                onChange={(e) =>
                  handleInputChange('videoUrl', e.target.value)
                }
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="countdownTitle">Countdown Title</Label>
                <Input
                  id="countdownTitle"
                  value={formData.countdownTitle || ''}
                  onChange={(e) =>
                    handleInputChange('countdownTitle', e.target.value)
                  }
                  placeholder="Countdown title"
                />
              </div>
              <div>
                <Label htmlFor="countdownSubtitle">Countdown Subtitle</Label>
                <Input
                  id="countdownSubtitle"
                  value={formData.countdownSubtitle || ''}
                  onChange={(e) =>
                    handleInputChange('countdownSubtitle', e.target.value)
                  }
                  placeholder="Countdown subtitle"
                />
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
