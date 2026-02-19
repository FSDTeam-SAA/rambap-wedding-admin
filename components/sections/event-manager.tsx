"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type Event = {
  _id?: string;
  title?: string;
  subtitle?: string;
  venueName: string;
  ceremonyTime: string;
  ceremonyTitle?: string;
  receptionTitle?: string;
  banquetTime: string;
  weddingTime: string;
  weddingTitle?: string;
  address: string;
  mapLocationTitle?: string;
  mapEmbedUrl: string;
  mapLocationLink: string;
  transportationTitle?: string;
  transportationInfo?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function EventManager() {
  const queryClient = useQueryClient();
   const { data: session } = useSession();
     const token = (session?.user as { accessToken: string })?.accessToken;

  const [isLang, setIsLang] = useState<"france" | "english">("english");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({});

  // ── Fetch Event ─────────────────────────────────────
  const {
    data: event,
    isLoading,
    isError,
  } = useQuery<Event>({
    queryKey: ["event", isLang],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/event?lang=${isLang}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        let msg = "Failed to load event details";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      const json = await res.json();
      return json.data ?? ({} as Event);
    },
  });

  useEffect(() => {
    if (event && isOpen) {
      setFormData(event);
    }
  }, [event, isLang, isOpen]);

  // ── Update Event ─────────────────────────────────
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: Partial<Event>) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/event?lang=${isLang}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        let msg = "Failed to update event";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Event details updated successfully!", {
        id: "event-update-toast",
      });
      queryClient.invalidateQueries({ queryKey: ["event", isLang] });
      setIsOpen(false);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Could not save event details", {
        id: "event-update-toast",
      });
    },
  });

  const handleOpen = () => {
    setFormData(event ?? {});
    setIsOpen(true);
  };

  const handleInputChange = (field: keyof Event, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (
      !formData.venueName?.trim() ||
      !formData.address?.trim() ||
      !formData.ceremonyTime?.trim() ||
      !formData.receptionTitle?.trim() ||
      !formData.ceremonyTitle?.trim() ||
      !formData.banquetTime?.trim() ||
      !formData.mapEmbedUrl?.trim() ||
      !formData.mapLocationLink?.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load event details. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-end items-center mb-6">
        <Button onClick={handleOpen} className="gap-2 bg-[#f59e0a] text-white">
          <Edit className="h-4 w-4" />
          Edit Event
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
      {event && Object.keys(event).length > 0 ? (
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {event.title && (
                <h3 className="text-xl font-semibold">{event.title}</h3>
              )}
              {event.subtitle && (
                <p className="text-muted-foreground">{event.subtitle}</p>
              )}

              <div className="space-y-2">
                <p className="font-medium">{event.venueName}</p>
                <p className="text-sm">{event.address}</p>

                <div className="space-y-2 text-sm text-muted-foreground mt-3">
                  {event.ceremonyTitle && (
                    <div>
                      <span className="font-medium">
                        {event.ceremonyTitle}:
                      </span>{" "}
                      {event.ceremonyTime}
                    </div>
                  )}

                  {event.receptionTitle && (
                    <div>
                      <span className="font-medium">
                        {event.receptionTitle}:
                      </span>{" "}
                      {event.banquetTime}
                    </div>
                  )}

                  {event.weddingTitle && (
                    <div>
                      <span className="font-medium">{event.weddingTitle}:</span>{" "}
                      {event.weddingTime}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {event.mapEmbedUrl && (
                <div>
                  <p className="text-sm font-medium mb-2">Map Preview</p>
                  <div className="aspect-video rounded-md overflow-hidden border">
                    <iframe
                      src={event.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}

              {event.mapLocationLink && (
                <div>
                  <a
                    href={event.mapLocationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              )}

              {(event.transportationTitle || event.transportationInfo) && (
                <div className="mt-4">
                  {event.transportationTitle && (
                    <p className="font-medium">{event.transportationTitle}</p>
                  )}
                  {event.transportationInfo && (
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                      {event.transportationInfo}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-12 text-center text-muted-foreground">
          No event details configured yet.
          <br />
          Click "Edit Event" to add ceremony & reception information.
        </div>
      )}

      {/* ── Edit Dialog ──────────────────────────────────────────────── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-10 py-4">
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title ?? ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g. Our Wedding Day"
                />
              </div>
              <div className="space-y-2"> 
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle ?? ""}
                  onChange={(e) =>
                    handleInputChange("subtitle", e.target.value)
                  }
                  placeholder="e.g. A Celebration of Love"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-2">
                <Label htmlFor="venueName">Venue Name *</Label>
                <Input
                  id="venueName"
                  value={formData.venueName ?? ""}
                  onChange={(e) =>
                    handleInputChange("venueName", e.target.value)
                  }
                  placeholder="e.g. Grand Palace Hall"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address ?? ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="e.g. 123 Love Street, Dhaka"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-2">
                <Label htmlFor="ceremonyTitle">Ceremony Title *</Label>
                <Input
                  id="ceremonyTitle"
                  type="text"
                  value={formData?.ceremonyTitle ?? ""}
                  onChange={(e) =>
                    handleInputChange("ceremonyTitle", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ceremonyTime">Ceremony Time *</Label>
                <Input
                  id="ceremonyTime"
                  type="time"
                  value={formData.ceremonyTime ?? ""}
                  onChange={(e) =>
                    handleInputChange("ceremonyTime", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receptionTitle">Reception Title *</Label>
                <Input
                  id="receptionTitle"
                  type="text"
                  value={formData?.receptionTitle ?? ""}
                  onChange={(e) =>
                    handleInputChange("receptionTitle", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banquetTime">Reception Time *</Label>
                <Input
                  id="banquetTime"
                  type="time"
                  value={formData.banquetTime ?? ""}
                  onChange={(e) =>
                    handleInputChange("banquetTime", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingTitle">Wedding Title *</Label>
                <Input
                  id="weddingTitle"
                  type="text"
                  value={formData?.weddingTitle ?? ""}
                  onChange={(e) =>
                    handleInputChange("weddingTitle", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingTime">Wedding Time *</Label>
                <Input
                  id="weddingTime"
                  type="time"
                  value={formData.weddingTime ?? ""}
                  onChange={(e) =>
                    handleInputChange("weddingTime", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mapEmbedUrl">Map Embed URL *</Label>
              <Input
                id="mapEmbedUrl"
                value={formData.mapEmbedUrl ?? ""}
                onChange={(e) =>
                  handleInputChange("mapEmbedUrl", e.target.value)
                }
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste the embed code from Google Maps
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapLocationTitle">Map Location Title *</Label>
              <Input
                id="mapLocationTitle"
                value={formData.mapLocationTitle ?? ""}
                onChange={(e) =>
                  handleInputChange("mapLocationTitle", e.target.value)
                }
                placeholder="e.g. Venue Location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mapLocationLink">Map Location Link *</Label>
              <Input
                id="mapLocationLink"
                value={formData.mapLocationLink ?? ""}
                onChange={(e) =>
                  handleInputChange("mapLocationLink", e.target.value)
                }
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportationTitle">Transportation Title</Label>
              <Input
                id="transportationTitle"
                value={formData.transportationTitle ?? ""}
                onChange={(e) =>
                  handleInputChange("transportationTitle", e.target.value)
                }
                placeholder="e.g. Getting Here"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportationInfo">Transportation Info</Label>
              <Textarea
                id="transportationInfo"
                value={formData.transportationInfo ?? ""}
                onChange={(e) =>
                  handleInputChange("transportationInfo", e.target.value)
                }
                placeholder="Parking info, shuttle service, nearest metro station, etc."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="hover:text-white"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending} className='text-white bg-[#f59e0a]'>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
