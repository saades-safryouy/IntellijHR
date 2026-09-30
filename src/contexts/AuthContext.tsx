import { createContext, useContext, useState, useEffect } from 'react'
import type { Role, User, Employee } from '../types/models'

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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function toSessionUser(source: User | (User & Partial<Employee>)): User {
  return {
    id: source.userId ?? source.id,
    name: source.name,
    title: source.title,
    role: source.role,
    initials: source.initials,
    email: source.email,
    userId: source.userId ?? source.id,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<(User & Partial<Employee>) | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [role, setRole] = useState<Role | null>(null)

  useEffect(() => {
    const storedUser = sessionStorage.getItem('Intillegence-user')
    const storedAuth = sessionStorage.getItem('Intillegence-authenticated')

    if (storedUser && storedAuth === 'true') {
      const user = JSON.parse(storedUser) as User
      setCurrentUser(user)
      setIsAuthenticated(true)
      setRole(user.role as Role)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { demoUsers, employees } = await import('../data/mock')

    let foundUser: User | undefined = demoUsers.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    )

    if (!foundUser) {
      const employee = employees.find((emp) => emp.email.toLowerCase() === email.toLowerCase())
      if (employee) {
        foundUser = {
          id: employee.userId,
          name: `${employee.firstName} ${employee.lastName}`,
          title: employee.jobTitle,
          role: employee.role || 'Employee',
          initials: employee.initials,
          email: employee.email,
          userId: employee.userId,
        }
      }
    }

    if (foundUser && password === 'password') {
      const sessionUser = toSessionUser(foundUser)
      setCurrentUser(sessionUser)
      setIsAuthenticated(true)
      setRole(sessionUser.role)
      sessionStorage.setItem('Intillegence-user', JSON.stringify(sessionUser))
      sessionStorage.setItem('Intillegence-authenticated', 'true')
    } else {
      throw new Error('Invalid credentials')
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setRole(null)
    sessionStorage.removeItem('Intillegence-user')
    sessionStorage.removeItem('Intillegence-authenticated')
    window.location.href = '/'
  }

  const hasRole = (roleToCheck: Role) => role === roleToCheck

  const hasAnyRole = (rolesToCheck: Role[]): boolean =>
    role ? rolesToCheck.includes(role) : false

  const isHR = () => hasRole('HR Administrator') || hasRole('HR')

  const isEmployee = () => hasRole('Employee')

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        role,
        login,
        logout,
        hasRole,
        hasAnyRole,
        isHR,
        isEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
