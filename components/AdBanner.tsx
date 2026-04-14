/**
 * AdBanner — Google AdSense placeholder.
 *
 * To activate AdSense:
 * 1. Replace the placeholder <div> below with the real <ins> AdSense tag.
 * 2. Add your publisher ID to .env.local as NEXT_PUBLIC_ADSENSE_PUBLISHER_ID.
 * 3. Add the AdSense <Script> to app/layout.tsx.
 *
 * Example AdSense tag:
 *   <ins className="adsbygoogle block"
 *        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *        data-ad-slot="XXXXXXXXXX"
 *        data-ad-format="horizontal"
 *        data-full-width-responsive="true" />
 */

interface AdBannerProps {
  slot?: string
  className?: string
}

export default function AdBanner({ slot = 'banner-001', className = '' }: AdBannerProps) {
  return (
    <div className={`py-3 px-4 ${className}`}>
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs text-slate-400 mb-1 uppercase tracking-wide">
          Advertisement
        </p>
        <div className="flex items-center justify-center min-h-[90px] bg-slate-100 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs font-medium">
          {/* Replace this div with your AdSense <ins> tag — slot: {slot} */}
          Ad Placeholder
        </div>
      </div>
    </div>
  )
}
