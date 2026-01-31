'use client';

import { useState } from 'react';
import { mockMenus } from '@/lib/mock-data';
import type { WeddingMenu } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Plus, Trash2, X } from 'lucide-react';

export function MenuManager() {
  const [menus, setMenus] = useState<WeddingMenu[]>(mockMenus);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WeddingMenu>>({});

  const handleOpen = (menu?: WeddingMenu) => {
    if (menu) {
      setFormData(menu);
      setEditingId(menu.id);
    } else {
      setFormData({
        title: '',
        menuSections: [],
        printMenuUrl: '',
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setMenus(
        menus.map((m) =>
          m.id === editingId ? { ...m, ...formData } : m
        )
      );
    } else {
      setMenus([
        ...menus,
        { ...formData, id: Date.now().toString() } as WeddingMenu,
      ]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setMenus(menus.filter((m) => m.id !== id));
  };

  const handleInputChange = (
    field: keyof WeddingMenu,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSection = () => {
    const sections = formData.menuSections || [];
    handleInputChange('menuSections', [
      ...sections,
      { categoryName: '', items: [] },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    const sections = formData.menuSections || [];
    handleInputChange('menuSections', sections.filter((_, i) => i !== index));
  };

  const handleSectionNameChange = (index: number, value: string) => {
    const sections = formData.menuSections || [];
    sections[index].categoryName = value;
    handleInputChange('menuSections', [...sections]);
  };

  const handleAddItem = (sectionIndex: number, item: string) => {
    const sections = formData.menuSections || [];
    if (item.trim()) {
      if (!sections[sectionIndex].items) {
        sections[sectionIndex].items = [];
      }
      sections[sectionIndex].items.push(item);
      handleInputChange('menuSections', [...sections]);
    }
  };

  const handleRemoveItem = (sectionIndex: number, itemIndex: number) => {
    const sections = formData.menuSections || [];
    sections[sectionIndex].items = sections[sectionIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    handleInputChange('menuSections', [...sections]);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Wedding Menu</h2>
          <p className="text-muted-foreground mt-1">
            Manage menu sections and items
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Menu
        </Button>
      </div>

      <div className="space-y-4">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{menu.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {menu.menuSections.length} sections
                </p>
                <div className="mt-2 space-y-1">
                  {menu.menuSections.map((section, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground">
                      • {section.categoryName} ({section.items.length} items)
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(menu)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(menu.id)}
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
              {editingId ? 'Edit Menu' : 'Add Menu'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Menu Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) =>
                  handleInputChange('title', e.target.value)
                }
                placeholder="Wedding Menu"
              />
            </div>

            <div>
              <Label htmlFor="printMenuUrl">Print Menu URL</Label>
              <Input
                id="printMenuUrl"
                value={formData.printMenuUrl || ''}
                onChange={(e) =>
                  handleInputChange('printMenuUrl', e.target.value)
                }
                placeholder="https://example.com/menu.pdf"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Menu Sections</Label>
                <Button
                  size="sm"
                  onClick={handleAddSection}
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Section
                </Button>
              </div>

              <div className="space-y-4">
                {(formData.menuSections || []).map((section, sectionIdx) => (
                  <div
                    key={sectionIdx}
                    className="border border-border rounded p-3 space-y-2"
                  >
                    <div className="flex gap-2">
                      <Input
                        value={section.categoryName}
                        onChange={(e) =>
                          handleSectionNameChange(sectionIdx, e.target.value)
                        }
                        placeholder="Category name"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveSection(sectionIdx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {section.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex items-center gap-2 p-2 bg-accent/5 rounded"
                        >
                          <span className="flex-1 text-sm">{item}</span>
                          <button
                            onClick={() =>
                              handleRemoveItem(sectionIdx, itemIdx)
                            }
                            className="p-1 hover:bg-accent rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add menu item"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddItem(
                              sectionIdx,
                              e.currentTarget.value
                            );
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={(e) => {
                          const input = (
                            e.currentTarget.previousElementSibling as HTMLInputElement
                          );
                          handleAddItem(sectionIdx, input.value);
                          input.value = '';
                        }}
                      >
                        Add
                      </Button>
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
