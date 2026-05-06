import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

const sections = [
  { title: 'Information We Collect', content: 'We collect information you provide directly — your name, email, phone number, and safari preferences when you submit an enquiry or use our trip planner. We also collect standard usage data via anonymised analytics to improve our service.' },
  { title: 'How We Use Your Information', content: 'Your information is used solely to respond to your safari enquiry, personalise our recommendations, and occasionally send relevant offers if you opt in. We never share, rent, or sell your personal data to third parties.' },
  { title: 'Data Storage', content: 'Your data is stored securely on Supabase infrastructure. We use row-level security and encryption at rest. Enquiry data is retained for 3 years for operational purposes, then permanently deleted.' },
  { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. Email hello@zazusafaris.co.ke with the subject "Data Request" and we will respond within 48 hours.' },
  { title: 'Cookies', content: 'We use only essential cookies for site functionality. No advertising cookies, no third-party tracking pixels. Our analytics are anonymised.' },
]

export default function PrivacyPage() {
  return (
    <section className="pt-36 pb-24 px-6 bg-charcoal min-h-screen">
      <div className="max-w-[800px] mx-auto">
        <Link href="/" className="text-[0.65rem] tracking-wide text-gold/60 hover:text-gold transition-colors mb-8 inline-block">← Back to Wildhaven</Link>
        <h1 className="text-5xl text-ivory mb-3" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300 }}>Privacy Policy</h1>
        <p className="text-sm text-ivory/35 mb-16 font-light">Last updated: January 2025</p>
        <div className="space-y-12">
          {sections.map(s => (
            <div key={s.title} className="border-t border-white/6 pt-10">
              <h2 className="text-xl text-ivory mb-4" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400 }}>{s.title}</h2>
              <p className="text-sm text-ivory/45 leading-relaxed font-light">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
