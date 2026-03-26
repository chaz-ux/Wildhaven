import type { Metadata } from 'next'
import PlannerClient from './PlannerClient'

export const metadata: Metadata = {
  title: 'Find My Wild — AI Safari Planner',
  description: 'Answer 5 questions and our AI concierge builds you a personalised safari Dream Board.',
}

export default function PlannerPage() {
  return <PlannerClient />
}
