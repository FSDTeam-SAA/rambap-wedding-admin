import { PageHeader } from '@/components/PageHeader'
import { FooterManager } from '@/components/sections/footer-manager'
import React from 'react'

const page = () => {
  return (
    <div>
         <PageHeader
                    title="Footer"
                    subtitle="Manage the website footer content"
                  />
        <FooterManager/>
    </div>
  )
}

export default page