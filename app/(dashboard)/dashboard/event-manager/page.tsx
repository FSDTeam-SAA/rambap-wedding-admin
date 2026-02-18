import { PageHeader } from '@/components/PageHeader'
import { EventManager } from '@/components/sections/event-manager'
import React from 'react'

const page = () => {
  return (
    <div>
       <PageHeader
              title="Event Details"
              subtitle="Manage wedding ceremony and reception information"
            />

      <EventManager/>
      </div>
  )
}

export default page