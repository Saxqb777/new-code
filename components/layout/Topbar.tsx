import { auth } from '@/lib/auth/auth'
import { signOut } from '@/lib/auth/auth'
import { getInitials } from '@/lib/utils'

export default async function Topbar() {
  const session = await auth()
  const name = session?.user?.name ?? ''
  const email = session?.user?.email ?? ''

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-end px-6 gap-3 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
          {getInitials(name)}
        </div>
        <div className="text-sm">
          <div className="font-medium text-slate-900 leading-none">{name}</div>
          <div className="text-slate-500 text-xs leading-none mt-0.5">{email}</div>
        </div>
      </div>
      <form
        action={async () => {
          'use server'
          await signOut({ redirectTo: '/login' })
        }}
      >
        <button
          type="submit"
          className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
        >
          Sign out
        </button>
      </form>
    </header>
  )
}
