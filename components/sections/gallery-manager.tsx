"use client";

import { useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Edit, X, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

type Gallery = {
  _id?: string;
  title?: string;
  subtitle?: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
};

export function GalleryManager() {
  const queryClient = useQueryClient();
 const { data: session } = useSession();
   const token = (session?.user as { accessToken: string })?.accessToken;
     const [isLang, setIsLang] = useState<"france" | "english">("english");

  // ── Fetch current gallery ────────────────────────────────────
  const {
    data: gallery,
    isLoading,
    isError,
    error,
  } = useQuery<Gallery>({
    queryKey: ["gallery", isLang],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery?lang=${isLang}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // ← add when you implement auth
          },
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to load gallery");
      }

      const json = await res.json();
      return json.data ?? { images: [] };
    },
  });

  // ── Update gallery (title/subtitle + append images) ──────────
  const updateMutation = useMutation({
    mutationFn: async (formDataPayload: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery?lang=${isLang}`,
        {
          method: "PUT",
          body: formDataPayload,
          // Do NOT set 'Content-Type' → browser sets multipart/form-data automatically
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update gallery");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Gallery updated successfully");
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      setIsOpen(false);
      setSelectedFiles([]);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update gallery");
    },
  });

  // ── Delete single image ──────────────────────────────────────
  const deleteImageMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery/image`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imageUrl }),
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete image");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Image removed");
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to remove image");
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Gallery>>({
    title: "",
    subtitle: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleOpen = () => {
    setFormData({
      title: gallery?.title || "",
      subtitle: gallery?.subtitle || "",
    });
    setSelectedFiles([]);
    setIsOpen(true);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removePendingFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const payload = new FormData();

    // Text fields
    if (formData.title) payload.append("title", formData.title);
    if (formData.subtitle) payload.append("subtitle", formData.subtitle);

    // New files
    selectedFiles.forEach((file) => {
      payload.append("files", file);
    });

    updateMutation.mutate(payload);
  };

  const handleRemoveExistingImage = (url: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteImageMutation.mutate(url);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load gallery
        <p className="text-sm mt-2">{(error as Error)?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-end items-center mb-6">
       
        <Button onClick={handleOpen} className="gap-2 bg-[#f59e0a] text-white">
          <Edit className="h-4 w-4" />
          Edit Gallery
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
      {/* ── Current Gallery Preview ───────────────────────────────── */}
      {gallery &&
      (gallery.title || gallery.subtitle || gallery.images?.length > 0) ? (
        <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
          {(gallery.title || gallery.subtitle) && (
            <div className="text-center">
              <h3 className="text-xl font-semibold">
                {gallery.title || "Our Moments"}
              </h3>
              {gallery.subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {gallery.subtitle}
                </p>
              )}
            </div>
          )}

          {gallery.images?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.images.map((url, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-lg overflow-hidden border shadow-sm"
                >
                  <img
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveExistingImage(url)}
                    disabled={deleteImageMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
              No photos uploaded yet
            </div>
          )}
        </div>
      ) : (
        <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground bg-muted/30">
          No gallery content yet.
          <br />
          Click "Edit Gallery" to add photos and details.
        </div>
      )}

      {/* ── Edit Dialog ──────────────────────────────────────────────── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gallery</DialogTitle>
          </DialogHeader>

          <div className="space-y-8 py-6">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className='space-y-3'>
                <Label htmlFor="title">Gallery Title</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. Our Wedding Moments"
                />
              </div>
              <div className='space-y-3'>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle || ""}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, subtitle: e.target.value }))
                  }
                  placeholder="e.g. Love captured in every frame"
                />
              </div>
            </div>

            {/* Current Images */}
            {gallery?.images?.length ? (
              <div>
                <Label>Current Images</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
                  {gallery.images.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-md overflow-hidden border"
                    >
                      <img
                        src={url}
                        alt={`Current ${idx + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveExistingImage(url)}
                        disabled={deleteImageMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Upload New Images */}
            <div>
              <Label htmlFor="images">Upload New Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedFiles((prev) => [
                      ...prev,
                      ...Array.from(e.target.files!),
                    ]);
                  }
                }}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select multiple images (jpg, png, webp)
              </p>

              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">
                    Selected files ({selectedFiles.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative border rounded-md overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full aspect-square object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removePendingFile(idx)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-center mt-1 truncate px-1">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t sticky bottom-0 bg-background pb-2 z-10">
            <Button
              variant="outline"
              className="hover:text-white"
              onClick={() => setIsOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className='text-white bg-[#f59e0a]'
              onClick={handleSave}
              disabled={
                updateMutation.isPending ||
                (selectedFiles.length === 0 &&
                  !formData.title &&
                  !formData.subtitle)
              }
            >
              {updateMutation.isPending ? (
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
