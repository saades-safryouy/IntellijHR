import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { Role } from '../../types/models'

interface RoleRouteProps {
  children: React.ReactNode
  roles: Role | Role[]
}

export function RoleRoute({ children, roles }: RoleRouteProps) {
  const { isAuthenticated, hasAnyRole, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  
  if (!hasAnyRole(allowedRoles)) {
    // Redirect based on user's actual role
    if (role === 'Employee') {
      return <Navigate to="/employee/dashboard" replace />
    } else {
      // HR and Manager roles go to HR dashboard
      return <Navigate to="/app/dashboard" replace />
    }
  }

  return <>{children}</>
}

