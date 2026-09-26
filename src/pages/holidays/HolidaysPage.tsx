import { ModulePage } from '../../components/common/ModulePage'
import { holidays } from '../../data/mock'

export function HolidaysPage() {
  return <ModulePage title="Holidays" data={holidays} />
}
