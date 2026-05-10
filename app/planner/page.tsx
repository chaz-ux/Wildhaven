import type { Metadata } from 'next'
import CustomSafariForm from './CustomSafariForm'

export const metadata: Metadata = {
  title: 'Custom Safari Request',
  description: "Can't find exactly what you're looking for? Tell us your vision and we'll build a safari around you.",
}

export default function PlannerPage() {
  return <CustomSafariForm />
}