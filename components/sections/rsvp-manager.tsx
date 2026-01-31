'use client';

import { useState } from 'react';
import { mockRsvps } from '@/lib/mock-data';
import type { Rsvp } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Plus, Trash2 } from 'lucide-react';

export function RsvpManager() {
  const [rsvps, setRsvps] = useState<Rsvp[]>(mockRsvps);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Rsvp>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpen = (rsvp?: Rsvp) => {
    if (rsvp) {
      setFormData(rsvp);
      setEditingId(rsvp.id);
    } else {
      setFormData({
        guestName: '',
        attendance: 'pending',
        guestNumber: 1,
        mealPreference: '',
        message: '',
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setRsvps(
        rsvps.map((r) =>
          r.id === editingId ? { ...r, ...formData } : r
        )
      );
    } else {
      setRsvps([
        ...rsvps,
        { ...formData, id: Date.now().toString() } as Rsvp,
      ]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setRsvps(rsvps.filter((r) => r.id !== id));
  };

  const handleInputChange = (
    field: keyof Rsvp,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredRsvps = rsvps.filter((r) =>
    r.guestName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const attendingCount = rsvps.filter((r) => r.attendance === 'attending').length;
  const declinedCount = rsvps.filter((r) => r.attendance === 'not-attending').length;
  const pendingCount = rsvps.filter((r) => r.attendance === 'pending').length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">RSVPs</h2>
          <p className="text-muted-foreground mt-1">
            Manage guest responses
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add RSVP
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border border-border rounded-lg p-4 bg-accent/5">
          <p className="text-sm text-muted-foreground">Attending</p>
          <p className="text-2xl font-bold text-foreground">{attendingCount}</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-accent/5">
          <p className="text-sm text-muted-foreground">Not Attending</p>
          <p className="text-2xl font-bold text-foreground">{declinedCount}</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-accent/5">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
        </div>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search guests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredRsvps.map((rsvp) => (
          <div
            key={rsvp.id}
            className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{rsvp.guestName}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      rsvp.attendance === 'attending'
                        ? 'bg-green-100 text-green-800'
                        : rsvp.attendance === 'not-attending'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {rsvp.attendance}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Guests: {rsvp.guestNumber} • Meal: {rsvp.mealPreference}
                </p>
                {rsvp.message && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    "{rsvp.message}"
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(rsvp)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(rsvp.id)}
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
              {editingId ? 'Edit RSVP' : 'Add RSVP'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="guestName">Guest Name</Label>
              <Input
                id="guestName"
                value={formData.guestName || ''}
                onChange={(e) =>
                  handleInputChange('guestName', e.target.value)
                }
                placeholder="Full name"
              />
            </div>

            <div>
              <Label htmlFor="attendance">Attendance</Label>
              <Select
                value={formData.attendance || 'pending'}
                onValueChange={(value: any) =>
                  handleInputChange('attendance', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attending">Attending</SelectItem>
                  <SelectItem value="not-attending">Not Attending</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="guestNumber">Number of Guests</Label>
              <Input
                id="guestNumber"
                type="number"
                min="1"
                value={formData.guestNumber || 1}
                onChange={(e) =>
                  handleInputChange('guestNumber', parseInt(e.target.value))
                }
              />
            </div>

            <div>
              <Label htmlFor="mealPreference">Meal Preference</Label>
              <Input
                id="mealPreference"
                value={formData.mealPreference || ''}
                onChange={(e) =>
                  handleInputChange('mealPreference', e.target.value)
                }
                placeholder="e.g., Vegetarian, Gluten-free"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message || ''}
                onChange={(e) =>
                  handleInputChange('message', e.target.value)
                }
                placeholder="Guest message"
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
