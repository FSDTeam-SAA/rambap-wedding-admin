'use client';

import { useState } from 'react';
import { mockGuestInfo } from '@/lib/mock-data';
import type { GuestInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Plus, Trash2, X } from 'lucide-react';

export function GuestInfoManager() {
  const [infos, setInfos] = useState<GuestInfo[]>(mockGuestInfo);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GuestInfo>>({});

  const handleOpen = (info?: GuestInfo) => {
    if (info) {
      setFormData(info);
      setEditingId(info.id);
    } else {
      setFormData({
        accommodation: {
          title: '',
          subtitle: '',
          items: [],
        },
        carRental: {
          title: '',
          subtitle: '',
          items: [],
        },
        dressCode: {
          title: '',
          items: [],
          footerNote: '',
        },
        faq: {
          title: '',
          items: [],
        },
        gifts: {
          title: '',
          subtitle: '',
          description: '',
        },
      });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setInfos(
        infos.map((i) =>
          i.id === editingId ? { ...i, ...formData } : i
        )
      );
    } else {
      setInfos([
        ...infos,
        { ...formData, id: Date.now().toString() } as GuestInfo,
      ]);
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setInfos(infos.filter((i) => i.id !== id));
  };

  const handleInputChange = (path: string, value: any) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Guest Information</h2>
          <p className="text-muted-foreground mt-1">
            Manage accommodation, FAQ, dress code, and more
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Info
        </Button>
      </div>

      <div className="space-y-4">
        {infos.map((info) => (
          <div
            key={info.id}
            className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {info.accommodation.title || 'Guest Information'}
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <p>• Accommodation section configured</p>
                  <p>• Car rental section configured</p>
                  <p>• Dress code configured</p>
                  <p>• FAQ with {info.faq.items.length} items</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(info)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(info.id)}
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
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Guest Info' : 'Add Guest Info'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="accommodation" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
              <TabsTrigger value="carRental">Car Rental</TabsTrigger>
              <TabsTrigger value="dressCode">Dress Code</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="gifts">Gifts</TabsTrigger>
            </TabsList>

            <TabsContent value="accommodation" className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.accommodation?.title || ''}
                  onChange={(e) =>
                    handleInputChange('accommodation.title', e.target.value)
                  }
                  placeholder="Section title"
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={formData.accommodation?.subtitle || ''}
                  onChange={(e) =>
                    handleInputChange('accommodation.subtitle', e.target.value)
                  }
                  placeholder="Section subtitle"
                />
              </div>
              <div>
                <Label>Items</Label>
                <div className="space-y-2">
                  {(formData.accommodation?.items || []).map((item, idx) => (
                    <div key={idx} className="p-2 border border-border rounded space-y-2">
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const items = formData.accommodation?.items || [];
                          items[idx].title = e.target.value;
                          handleInputChange('accommodation.items', items);
                        }}
                        placeholder="Item title"
                      />
                      <Input
                        value={item.icon}
                        onChange={(e) => {
                          const items = formData.accommodation?.items || [];
                          items[idx].icon = e.target.value;
                          handleInputChange('accommodation.items', items);
                        }}
                        placeholder="Icon name"
                      />
                      <Input
                        value={item.linkUrl}
                        onChange={(e) => {
                          const items = formData.accommodation?.items || [];
                          items[idx].linkUrl = e.target.value;
                          handleInputChange('accommodation.items', items);
                        }}
                        placeholder="URL"
                      />
                      <Input
                        value={item.description}
                        onChange={(e) => {
                          const items = formData.accommodation?.items || [];
                          items[idx].description = e.target.value;
                          handleInputChange('accommodation.items', items);
                        }}
                        placeholder="Description"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const items = (formData.accommodation?.items || []).filter(
                            (_, i) => i !== idx
                          );
                          handleInputChange('accommodation.items', items);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    onClick={() => {
                      const items = formData.accommodation?.items || [];
                      items.push({
                        title: '',
                        icon: '',
                        linkUrl: '',
                        description: '',
                      });
                      handleInputChange('accommodation.items', items);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="carRental" className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.carRental?.title || ''}
                  onChange={(e) =>
                    handleInputChange('carRental.title', e.target.value)
                  }
                  placeholder="Section title"
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={formData.carRental?.subtitle || ''}
                  onChange={(e) =>
                    handleInputChange('carRental.subtitle', e.target.value)
                  }
                  placeholder="Section subtitle"
                />
              </div>
              <div>
                <Label>Items</Label>
                <div className="space-y-2">
                  {(formData.carRental?.items || []).map((item, idx) => (
                    <div key={idx} className="p-2 border border-border rounded space-y-2">
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const items = formData.carRental?.items || [];
                          items[idx].title = e.target.value;
                          handleInputChange('carRental.items', items);
                        }}
                        placeholder="Item title"
                      />
                      <Input
                        value={item.icon}
                        onChange={(e) => {
                          const items = formData.carRental?.items || [];
                          items[idx].icon = e.target.value;
                          handleInputChange('carRental.items', items);
                        }}
                        placeholder="Icon name"
                      />
                      <Input
                        value={item.linkUrl}
                        onChange={(e) => {
                          const items = formData.carRental?.items || [];
                          items[idx].linkUrl = e.target.value;
                          handleInputChange('carRental.items', items);
                        }}
                        placeholder="URL"
                      />
                      <Input
                        value={item.description}
                        onChange={(e) => {
                          const items = formData.carRental?.items || [];
                          items[idx].description = e.target.value;
                          handleInputChange('carRental.items', items);
                        }}
                        placeholder="Description"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const items = (formData.carRental?.items || []).filter(
                            (_, i) => i !== idx
                          );
                          handleInputChange('carRental.items', items);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    onClick={() => {
                      const items = formData.carRental?.items || [];
                      items.push({
                        title: '',
                        icon: '',
                        linkUrl: '',
                        description: '',
                      });
                      handleInputChange('carRental.items', items);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dressCode" className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.dressCode?.title || ''}
                  onChange={(e) =>
                    handleInputChange('dressCode.title', e.target.value)
                  }
                  placeholder="Dress Code"
                />
              </div>
              <div>
                <Label>Items</Label>
                <div className="space-y-2">
                  {(formData.dressCode?.items || []).map((item, idx) => (
                    <div key={idx} className="p-2 border border-border rounded space-y-2">
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const items = formData.dressCode?.items || [];
                          items[idx].title = e.target.value;
                          handleInputChange('dressCode.items', items);
                        }}
                        placeholder="Dress code option"
                      />
                      <Input
                        value={item.icon}
                        onChange={(e) => {
                          const items = formData.dressCode?.items || [];
                          items[idx].icon = e.target.value;
                          handleInputChange('dressCode.items', items);
                        }}
                        placeholder="Icon name"
                      />
                      <Textarea
                        value={item.description}
                        onChange={(e) => {
                          const items = formData.dressCode?.items || [];
                          items[idx].description = e.target.value;
                          handleInputChange('dressCode.items', items);
                        }}
                        placeholder="Description"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const items = (formData.dressCode?.items || []).filter(
                            (_, i) => i !== idx
                          );
                          handleInputChange('dressCode.items', items);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    onClick={() => {
                      const items = formData.dressCode?.items || [];
                      items.push({
                        title: '',
                        icon: '',
                        description: '',
                      });
                      handleInputChange('dressCode.items', items);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>
              <div>
                <Label>Footer Note</Label>
                <Textarea
                  value={formData.dressCode?.footerNote || ''}
                  onChange={(e) =>
                    handleInputChange('dressCode.footerNote', e.target.value)
                  }
                  placeholder="Footer message"
                />
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.faq?.title || ''}
                  onChange={(e) =>
                    handleInputChange('faq.title', e.target.value)
                  }
                  placeholder="Frequently Asked Questions"
                />
              </div>
              <div>
                <Label>FAQs</Label>
                <div className="space-y-2">
                  {(formData.faq?.items || []).map((item, idx) => (
                    <div key={idx} className="p-2 border border-border rounded space-y-2">
                      <Input
                        value={item.question}
                        onChange={(e) => {
                          const items = formData.faq?.items || [];
                          items[idx].question = e.target.value;
                          handleInputChange('faq.items', items);
                        }}
                        placeholder="Question"
                      />
                      <Textarea
                        value={item.answer}
                        onChange={(e) => {
                          const items = formData.faq?.items || [];
                          items[idx].answer = e.target.value;
                          handleInputChange('faq.items', items);
                        }}
                        placeholder="Answer"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const items = (formData.faq?.items || []).filter(
                            (_, i) => i !== idx
                          );
                          handleInputChange('faq.items', items);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    onClick={() => {
                      const items = formData.faq?.items || [];
                      items.push({ question: '', answer: '' });
                      handleInputChange('faq.items', items);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add FAQ
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gifts" className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.gifts?.title || ''}
                  onChange={(e) =>
                    handleInputChange('gifts.title', e.target.value)
                  }
                  placeholder="Gifts"
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={formData.gifts?.subtitle || ''}
                  onChange={(e) =>
                    handleInputChange('gifts.subtitle', e.target.value)
                  }
                  placeholder="Subtitle"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.gifts?.description || ''}
                  onChange={(e) =>
                    handleInputChange('gifts.description', e.target.value)
                  }
                  placeholder="Gift information"
                />
              </div>
            </TabsContent>

            <div className="flex justify-end gap-2 pt-6 mt-4 border-t">
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
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
