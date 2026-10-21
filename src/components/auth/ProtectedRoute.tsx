import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authHooks'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, initializationError } = useAuth()

  if (isLoading) {
    return <div role="status" className="page">Restoring secure session…</div>
  }

  if (initializationError) {
    return (
      <div role="alert" className="page">
        <p>{initializationError}</p>
        <button className="button secondary" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
