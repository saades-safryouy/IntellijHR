import { useContext } from 'react'
import type { AuthenticatedUser, Role } from '../types/models'
import { createContext } from 'react'

export type AuthContextType = {
  currentUser: AuthenticatedUser | null
  isAuthenticated: boolean
  isLoading: boolean
  initializationError: string | null
  role: Role | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: Role) => boolean
  hasAnyRole: (roles: Role[]) => boolean
  isHR: () => boolean
  isEmployee: () => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
