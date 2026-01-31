'use client';

import { useState } from 'react';
import { mockEvents } from '@/lib/mock-data';
import type { Event } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Trash2 } from 'lucide-react';

export function EventManager() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({});

  const handleOpen = (event?: Event) => {
    if (event) {
      setFormData(event);
      setEditingId(event.id);
    } else {
      setFormData({
        title: '',
        subtitle: '',
        venueName: '',
        ceremonyTime: '',
        banquetTime: '',
        address: '',
        mapEmbedUrl: '',
        mapLocationLink: '',
        transportationTitle: '',
        transportationInfo: '',
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setEvents(
        events.map((e) =>
          e.id === editingId ? { ...e, ...formData } : e
        )
      );
    } else {
      setEvents([
        ...events,
        { ...formData, id: Date.now().toString() } as Event,
      ]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleInputChange = (
    field: keyof Event,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Event Details</h2>
          <p className="text-muted-foreground mt-1">
            Manage wedding ceremony and reception details
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{event.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.subtitle}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {event.venueName} • {event.address}
                </p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Ceremony: {event.ceremonyTime}</span>
                  <span>Reception: {event.banquetTime}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(event)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
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
              {editingId ? 'Edit Event' : 'Add Event'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) =>
                    handleInputChange('title', e.target.value)
                  }
                  placeholder="Event title"
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
                  placeholder="Event subtitle"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="venueName">Venue Name</Label>
                <Input
                  id="venueName"
                  value={formData.venueName || ''}
                  onChange={(e) =>
                    handleInputChange('venueName', e.target.value)
                  }
                  placeholder="Venue name"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) =>
                    handleInputChange('address', e.target.value)
                  }
                  placeholder="Full address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ceremonyTime">Ceremony Time</Label>
                <Input
                  id="ceremonyTime"
                  type="time"
                  value={formData.ceremonyTime || ''}
                  onChange={(e) =>
                    handleInputChange('ceremonyTime', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="banquetTime">Banquet Time</Label>
                <Input
                  id="banquetTime"
                  type="time"
                  value={formData.banquetTime || ''}
                  onChange={(e) =>
                    handleInputChange('banquetTime', e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mapEmbedUrl">Map Embed URL</Label>
              <Input
                id="mapEmbedUrl"
                value={formData.mapEmbedUrl || ''}
                onChange={(e) =>
                  handleInputChange('mapEmbedUrl', e.target.value)
                }
                placeholder="Map embed URL"
              />
            </div>

            <div>
              <Label htmlFor="mapLocationLink">Map Location Link</Label>
              <Input
                id="mapLocationLink"
                value={formData.mapLocationLink || ''}
                onChange={(e) =>
                  handleInputChange('mapLocationLink', e.target.value)
                }
                placeholder="Map location link"
              />
            </div>

            <div>
              <Label htmlFor="transportationTitle">Transportation Title</Label>
              <Input
                id="transportationTitle"
                value={formData.transportationTitle || ''}
                onChange={(e) =>
                  handleInputChange('transportationTitle', e.target.value)
                }
                placeholder="Transportation title"
              />
            </div>

            <div>
              <Label htmlFor="transportationInfo">Transportation Info</Label>
              <Textarea
                id="transportationInfo"
                value={formData.transportationInfo || ''}
                onChange={(e) =>
                  handleInputChange('transportationInfo', e.target.value)
                }
                placeholder="Transportation information"
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
