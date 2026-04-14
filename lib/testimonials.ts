export interface Testimonial {
  id: string
  name: string
  location: string
  avatar: string
  avatarColor: string
  earned: string
  quote: string
  rating: number
  joinedMonthsAgo: number
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah K.',
    location: 'Texas, USA',
    avatar: 'SK',
    avatarColor: 'bg-pink-500',
    earned: '$47.50',
    quote:
      "I was skeptical at first, but FreeBucks actually pays! I've redeemed $47 to PayPal over the past 3 months. The video ads are quick and the points add up faster than I expected.",
    rating: 5,
    joinedMonthsAgo: 3,
  },
  {
    id: '2',
    name: 'Marcus T.',
    location: 'Florida, USA',
    avatar: 'MT',
    avatarColor: 'bg-blue-500',
    earned: '$120.00',
    quote:
      "Finally a rewards site that doesn't waste your time. I do the daily check-in every morning and watch a couple videos during lunch. Cashed out $120 to Amazon gift cards this year.",
    rating: 5,
    joinedMonthsAgo: 8,
  },
  {
    id: '3',
    name: 'Priya M.',
    location: 'California, USA',
    avatar: 'PM',
    avatarColor: 'bg-purple-500',
    earned: '$28.00',
    quote:
      "Great for earning a little extra on the side. The interface is clean and nothing feels shady. Got my first $5 PayPal payout within a week of signing up!",
    rating: 4,
    joinedMonthsAgo: 2,
  },
  {
    id: '4',
    name: 'Jake R.',
    location: 'New York, USA',
    avatar: 'JR',
    avatarColor: 'bg-green-500',
    earned: '$65.00',
    quote:
      'The app install offers are the real money-makers. Installed a budgeting app for 350 points — small, but it adds up fast. Cashed out $65 total and still going strong.',
    rating: 5,
    joinedMonthsAgo: 5,
  },
  {
    id: '5',
    name: 'Aisha L.',
    location: 'Georgia, USA',
    avatar: 'AL',
    avatarColor: 'bg-orange-500',
    earned: '$15.00',
    quote:
      "Just got started last month. Already earned $15 without any real effort. Love that I can cash out as low as $5 — no waiting forever to reach some huge minimum balance.",
    rating: 4,
    joinedMonthsAgo: 1,
  },
]
