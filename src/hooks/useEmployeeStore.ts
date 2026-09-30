import { useEffect, useState } from 'react'
import { subscribeEmployeeStore } from '../data/employeeStore'

export function useEmployeeStore(): number {
  const [version, setVersion] = useState(0)
  useEffect(() => subscribeEmployeeStore(() => setVersion((value) => value + 1)), [])
  return version
}
