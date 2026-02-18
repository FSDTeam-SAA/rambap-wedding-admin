import { PageHeader } from '@/components/PageHeader'
import { DayProgramManager } from '@/components/sections/day-program-manager'
import React from 'react'

const page = () => {
  return (
    <div>
      <PageHeader
        title="Wedding Day Program"
        subtitle="Manage the full-day timeline"
      />
      <DayProgramManager />
    </div>
  )
}

export default page