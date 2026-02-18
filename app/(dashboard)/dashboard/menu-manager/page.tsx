import { PageHeader } from '@/components/PageHeader'
import { MenuManager } from '@/components/sections/menu-manager'
import React from 'react'

const page = () => {
  return (
    <div>
        <PageHeader
                    title="Wedding Menu"
                    subtitle="Manage menu sections and items"
                  />
        <MenuManager/>
    </div>
  )
}

export default page