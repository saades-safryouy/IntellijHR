import { ModulePage } from '../../components/common/ModulePage'
import { offboardingRequests } from '../../data/mock'

export function OffboardingPage() {
  return <ModulePage title="Offboarding" data={offboardingRequests} />
}
