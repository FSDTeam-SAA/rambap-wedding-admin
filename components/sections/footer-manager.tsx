"use client";

import { useState } from "react";
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

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const FOOTER_ENDPOINT = `${API_BASE}/footer`; // matches your route: GET/PUT /footer

type Footer = {
  _id?: string;
  partnerOne: string;
  partnerTwo: string;
  date: string;
  footerNote?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function FooterManager() {
  const queryClient = useQueryClient();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2UwMjRmZmU2Mzg5ZmUxN2ZlOGY3NCIsImVtYWlsIjoiZmFyYWJpc3Vubnk1QGdtYWlsLmNvbSIsImlhdCI6MTc3MTMzNDU5NywiZXhwIjoxNzcxOTM5Mzk3fQ.mAD9YpgWT3X0IktWFaT4sgKSvhKlOEDqTsMgI5qKyfE";
  const [isLang, setIsLang] = useState<"france" | "english">("english");

  // ── Fetch current Footer ─────────────────────────────────────
  const {
    data: footer,
    isLoading,
    isError,
  } = useQuery<Footer>({
    queryKey: ["footer", isLang],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/footer?lang=${isLang}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        let msg = "Failed to load footer content";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      const json = await res.json();
      // Adjust based on your response shape → usually { success: true, data: {...} }
      return json.data ?? ({} as Footer);
    },
  });

  // ── Update Footer (upsert) ───────────────────────────────────
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: Partial<Footer>) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/footer?lang=${isLang}`,
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
        let msg = "Failed to update footer";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Footer updated successfully!", {
        id: "footer-update-toast",
      });
      queryClient.invalidateQueries({ queryKey: ["footer"] });
      setIsOpen(false);
    },

    onError: (err: Error) => {
      toast.error(err.message || "Could not save footer content", {
        id: "footer-update-toast",
      });
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Footer>>({});

  const handleOpen = () => {
    setFormData(footer ?? {});
    setIsOpen(true);
  };

  const handleInputChange = (field: keyof Footer, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Basic required fields check (matches your schema)
    if (
      !formData.partnerOne?.trim() ||
      !formData.partnerTwo?.trim() ||
      !formData.date?.trim()
    ) {
      toast.error("Partner names and date are required");
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
        Failed to load footer content. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-end items-center mb-6">

        <Button onClick={handleOpen} className="gap-2 bg-[#f59e0a] text-white">
          <Edit className="h-4 w-4" />
          Edit Footer
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            setIsLang((prev) => (prev === "english" ? "france" : "english"));
          }}
          variant="outline"
          size="sm"
          className="gap-2 mb-4 hover:text-white"
        >
          Switch to {isLang === "english" ? "French" : "English"} Version
        </Button>
      </div>
      {footer && Object.keys(footer).length > 0 ? (
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3 className="text-xl font-semibold">
              {footer.partnerOne}{" "}
              <span className="text-muted-foreground">&</span>{" "}
              {footer.partnerTwo}
            </h3>

            <p className="text-muted-foreground">{footer.date}</p>

            {footer.footerNote && (
              <p className="text-sm text-muted-foreground mt-4">
                {footer.footerNote}
              </p>
            )}

            {footer.updatedAt && (
              <p className="text-xs text-muted-foreground/70 mt-6">
                Last updated: {new Date(footer.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-12 text-center text-muted-foreground">
          No footer content set yet.
          <br />
          Click "Edit Footer" to add partner names, date and note.
        </div>
      )}

      {/* ── Edit Dialog ─────────────────────────────────────────────── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Footer Content</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partnerOne">Partner One *</Label>
                <Input
                  id="partnerOne"
                  value={formData.partnerOne ?? ""}
                  onChange={(e) =>
                    handleInputChange("partnerOne", e.target.value)
                  }
                  placeholder="e.g. Sarah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerTwo">Partner Two *</Label>
                <Input
                  id="partnerTwo"
                  value={formData.partnerTwo ?? ""}
                  onChange={(e) =>
                    handleInputChange("partnerTwo", e.target.value)
                  }
                  placeholder="e.g. James"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Wedding Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date ?? ""}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="footerNote">Footer Note</Label>
              <Textarea
                id="footerNote"
                value={formData.footerNote ?? ""}
                onChange={(e) =>
                  handleInputChange("footerNote", e.target.value)
                }
                placeholder="e.g. With love, forever and always..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}   className='text-white bg-[#f59e0a]' disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Footer"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
