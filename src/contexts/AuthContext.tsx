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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<(User & Partial<Employee>) | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [role, setRole] = useState<Role | null>(null)

  // Check auth state on load
  useEffect(() => {
    const storedUser = sessionStorage.getItem('Intillegence-user')
    const storedAuth = sessionStorage.getItem('Intillegence-authenticated')
    
    if (storedUser && storedAuth === 'true') {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)
      setIsAuthenticated(true)
      setRole(user.role as Role)
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication - in real app this would call an API
    const { demoUsers, employees } = await import('../data/mock')

    // First check demo users (HR, Managers)
    let foundUser = demoUsers.find(user => user.email.toLowerCase() === email.toLowerCase())
    
    // If not found in demo users, check employees list
    if (!foundUser) {
      const employee = employees.find(emp => emp.email.toLowerCase() === email.toLowerCase())
      if (employee) {
        // Merge User data with Employee data
        foundUser = {
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          title: employee.jobTitle,
          role: employee.role || 'Employee',
          initials: `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`,
          email: employee.email,
          firstName: employee.firstName,
          lastName: employee.lastName,
          jobTitle: employee.jobTitle,
          department: employee.department,
          manager: employee.manager,
          employmentType: employee.employmentType,
          status: employee.status,
          location: employee.location,
          joined: employee.joined,
          userId: employee.userId,
          gender: employee.gender,
          maritalStatus: employee.maritalStatus,
          numberOfChildren: employee.numberOfChildren,
          nationalId: employee.nationalId,
          nationalityId: employee.nationalityId,
          passportNumber: employee.passportNumber,
          passportValidityDate: employee.passportValidityDate,
          personalPhone: employee.personalPhone,
          professionalPhone: employee.professionalPhone,
          personalInfoCompletedAt: employee.personalInfoCompletedAt,
          personalInfoDismissedUntil: employee.personalInfoDismissedUntil
        }
      }
    }

    // Simple password check for demo (all users use 'password')
    if (foundUser && password === 'password') {
      setCurrentUser(foundUser as User & Partial<Employee>)
      setIsAuthenticated(true)
      setRole(foundUser.role as Role)
      
      // Store in sessionStorage
      sessionStorage.setItem('Intillegence-user', JSON.stringify(foundUser))
      sessionStorage.setItem('Intillegence-authenticated', 'true')
      
      // No redirect here - let the LoginPage handle it based on role
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

  const hasRole = (roleToCheck: Role) => {
    return role === roleToCheck
  }

  const hasAnyRole = (rolesToCheck: Role[]): boolean => {
    return role ? rolesToCheck.includes(role as Role) : false
  }

  const isHR = () => {
    return hasRole('HR Administrator') || hasRole('HR')
  }

  const isEmployee = () => {
    return hasRole('Employee')
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      role,
      login,
      logout,
      hasRole,
      hasAnyRole,
      isHR,
      isEmployee
    }}>
      {children}
    </AuthContext.Provider>
  )
}
