import { PageHeader } from '@/components/PageHeader'
import { HeroManager } from '@/components/sections/hero-manager'
import React from 'react'

const page = () => {
  return (
    <div>
      <PageHeader
        title="Hero Section"
        subtitle="Manage the main banner / hero content for your wedding site"
      />

      <HeroManager />
    </div>
  )
}

export default page