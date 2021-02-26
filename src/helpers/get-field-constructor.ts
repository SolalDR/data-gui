import { NumberField } from '@/components/number-field'
import { TextField } from '@/components/text-field'
import { ColorField } from '@/components/color-field'

export default (value: unknown) => {
  if (NumberField.isCompatible(value)) return NumberField
  if (ColorField.isCompatible(value)) return ColorField
  if (TextField.isCompatible(value)) return TextField
}
