import { ModulePage } from '../../components/common/ModulePage'
import { onboardingRequests } from '../../data/mock'

export function OnboardingPage() {
  return <ModulePage title="Onboarding" data={onboardingRequests} />
}
