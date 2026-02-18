import { PageHeader } from '@/components/PageHeader'
import { RsvpManager } from '@/components/sections/rsvp-manager'
import React from 'react'

const page = () => {
  return (
    <div>
        <PageHeader
              title="RSVP Management"
              subtitle="View and update guest responses"
            />
        <RsvpManager/>
    </div>
  )
}

export default page