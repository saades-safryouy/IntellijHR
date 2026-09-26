import { ModulePage } from '../../components/common/ModulePage'
import { leaveRequests } from '../../data/mock'

export function LeavePage() {
  return <ModulePage title="Leave management" data={leaveRequests} />
}
