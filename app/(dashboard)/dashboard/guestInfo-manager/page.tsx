import { PageHeader } from '@/components/PageHeader'
import { GuestInfoManager } from '@/components/sections/guest-info-manager'
import React from 'react'

const page = () => {
  return (
    <div>
          <PageHeader
              title="Guest Information"
              subtitle="Manage accommodation, dress code, FAQ, gifts and more"
            />
        <GuestInfoManager/>
    </div>
  )
}

export default page