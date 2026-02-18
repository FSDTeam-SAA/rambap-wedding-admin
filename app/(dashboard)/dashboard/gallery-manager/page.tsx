import { PageHeader } from "@/components/PageHeader";
import { GalleryManager } from "@/components/sections/gallery-manager";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHeader
        title="Gallery"
        subtitle="            Manage your wedding photos"
      />
      <GalleryManager />
    </div>
  );
};

export default page;
