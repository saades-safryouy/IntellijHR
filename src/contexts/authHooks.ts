import { useContext } from 'react'
import type { Role, User, Employee } from '../types/models'
import { createContext } from 'react'

export type AuthContextType = {
  currentUser: (User & Partial<Employee>) | null
  isAuthenticated: boolean
  role: Role | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
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

