export interface RewardOption {
  id: string
  type: 'cash' | 'giftcard'
  name: string
  description: string
  pointsRequired: number
  cashValue: number
  icon: string
  available: boolean
}

export const rewards: RewardOption[] = [
  // Cash payouts
  {
    id: 'paypal-5',
    type: 'cash',
    name: 'PayPal Cash',
    description: 'Direct transfer to your verified PayPal account',
    pointsRequired: 5000,
    cashValue: 5,
    icon: '💸',
    available: true,
  },
  {
    id: 'paypal-10',
    type: 'cash',
    name: 'PayPal Cash',
    description: 'Direct transfer to your verified PayPal account',
    pointsRequired: 10000,
    cashValue: 10,
    icon: '💸',
    available: true,
  },
  {
    id: 'paypal-25',
    type: 'cash',
    name: 'PayPal Cash',
    description: 'Direct transfer to your verified PayPal account',
    pointsRequired: 25000,
    cashValue: 25,
    icon: '💸',
    available: true,
  },
  // Gift cards
  {
    id: 'amazon-5',
    type: 'giftcard',
    name: 'Amazon',
    description: '$5 Amazon Gift Card code emailed instantly',
    pointsRequired: 5000,
    cashValue: 5,
    icon: '🛒',
    available: true,
  },
  {
    id: 'amazon-10',
    type: 'giftcard',
    name: 'Amazon',
    description: '$10 Amazon Gift Card code emailed instantly',
    pointsRequired: 10000,
    cashValue: 10,
    icon: '🛒',
    available: true,
  },
  {
    id: 'google-play-5',
    type: 'giftcard',
    name: 'Google Play',
    description: '$5 Google Play Gift Card for apps, games & more',
    pointsRequired: 5000,
    cashValue: 5,
    icon: '🎮',
    available: true,
  },
  {
    id: 'steam-5',
    type: 'giftcard',
    name: 'Steam',
    description: '$5 Steam Wallet Code for PC games',
    pointsRequired: 5000,
    cashValue: 5,
    icon: '🎮',
    available: true,
  },
  {
    id: 'netflix-10',
    type: 'giftcard',
    name: 'Netflix',
    description: '$10 Netflix Gift Card for streaming',
    pointsRequired: 10000,
    cashValue: 10,
    icon: '🎬',
    available: true,
  },
]
