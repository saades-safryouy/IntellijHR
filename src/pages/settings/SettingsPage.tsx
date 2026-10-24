import { ChevronRight } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { useAuth } from '../../contexts/authHooks'

export function SettingsPage() {
  const { currentUser } = useAuth()
  return (
    <div className="page">
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Settings"
        subtitle="Shape IntillegenceHR around the way your organization works."
      />

      <div className="settings-layout">
        <aside className="settings-menu">
          {[
            'Profile',
            'Account',
            'Users',
            'Roles & Permissions',
            'Leave Types',
            'Leave Policies',
            'Onboarding Checklists',
            'Offboarding Checklists',
            'Equipment',
            'Applications',
            'Notifications',
            'Languages',
            'Appearance',
            'Audit Logs',
          ].map((item, index) => (
            <button className={index === 0 ? 'active' : ''} key={item}>
              {item}
              <ChevronRight size={15} />
            </button>
          ))}
        </aside>

        <section className="panel settings-content">
          <span className="eyebrow">PROFILE</span>

          <h2>Profile details</h2>

          <p>
            Manage the identity and contact details attached to your workspace account.
          </p>

          <div className="settings-avatar">
            <div className="profile-avatar avatar">{currentUser?.initials ?? '??'}</div>

            <div>
              <strong>{currentUser?.name ?? '—'}</strong>
              <span>{currentUser?.title ?? ''}</span>
            </div>

            <button className="button secondary">Change photo</button>
          </div>

          <div className="settings-fields">
            <label>
              Full name
              <input value={currentUser?.name ?? ''} readOnly />
            </label>

            <label>
              Role
              <input value={currentUser?.title ?? ''} readOnly />
            </label>

            <label>
              Email
              <input value={currentUser?.email ?? ''} readOnly />
            </label>

            <label>
              Language
              <select defaultValue="English">
                <option>English</option>
                <option>Français</option>
                <option>العربية</option>
              </select>
            </label>
          </div>

          <button className="button primary">Save changes</button>
        </section>
      </div>
    </div>
  )
}
