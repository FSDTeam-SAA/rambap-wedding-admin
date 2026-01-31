'use client';

import { useState } from 'react';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Plus, Trash2 } from 'lucide-react';

export function UserManager() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpen = (user?: User) => {
    if (user) {
      setFormData(user);
      setEditingId(user.id);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setUsers(
        users.map((u) =>
          u.id === editingId ? { ...u, ...formData } : u
        )
      );
    } else {
      setUsers([
        ...users,
        { ...formData, id: Date.now().toString() } as User,
      ]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleInputChange = (
    field: keyof User,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Users</h2>
          <p className="text-muted-foreground mt-1">
            Manage admin users and accounts
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(user)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
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
              {editingId ? 'Edit User' : 'Add User'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) =>
                    handleInputChange('firstName', e.target.value)
                  }
                  placeholder="First name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) =>
                  handleInputChange('email', e.target.value)
                }
                placeholder="user@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={(e) =>
                  handleInputChange('password', e.target.value)
                }
                placeholder={editingId ? 'Leave empty to keep current' : 'Enter password'}
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
