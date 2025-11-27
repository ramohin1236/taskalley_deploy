import React, { Suspense } from 'react'
import SuccessCard from '@/components/ui/SuccessCard'

const Loading = () => (
  <div className="project_container py-10 px-4">
    <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-md bg-card/50 dark:bg-card animate-pulse" role="status" aria-live="polite">
      <div className="h-40 md:h-48 bg-background/10 dark:bg-background/20 rounded" />
    </div>
  </div>
)

const page = () => {
  return (
    <main>
      <Suspense fallback={<Loading/>}>
        <SuccessCard />
      </Suspense>
    </main>
  )
}

export default page