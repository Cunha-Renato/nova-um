/** biome-ignore-all lint/performance/noImgElement: <Not using NextJs> */
import { useClerk, useUser } from '@clerk/react'

export function SettingsPopup({ dark, toggle, onClose }: { dark: boolean, toggle: () => void, onClose: () => void }) {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`

  return (
    <>
      <button type="button" className="fixed inset-0 z-10" aria-label="Close" tabIndex={0} onClick={onClose} />
      <div className="absolute bottom-11 left-0 z-20 overflow-hidden rounded-xl border border-gray-200 bg-background" style={{ width: 272, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>

        {/* User info */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="h-11 w-11 rounded-full overflow-hidden shrink-0">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt={user.fullName ?? ''} className="h-full w-full object-cover" />
              : <span className="flex h-full w-full items-center justify-center bg-blue-100 text-sm font-medium text-blue-700 ">{initials}</span>
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        <div className="p-2">
          <div className="flex items-center justify-between px-2.5 py-2 rounded-md">
            <span className="text-sm font-medium text-gray-700">Dark mode</span>
            <button type="button" onClick={toggle} className={`relative w-9 h-5 rounded-full transition-colors ${dark ? 'bg-gray-700' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${dark ? 'translate-x-4' : ''}`} />
            </button>
          </div>

          <div className="my-1 h-px bg-gray-100" />

          <button
            type="button"
            onClick={() => { openUserProfile(); }}
            className="flex w-full items-center gap-2.5 px-2.5 py-2 text-sm font-medium text-gray-700  rounded-md hover:bg-background-hover-sidebar"
          >
            Manage account
          </button>

          <div className="my-1 h-px bg-gray-100" />

          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center gap-2.5 px-2.5 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
          >
            Sign out
          </button>
        </div>

      </div>
    </>
  )
}