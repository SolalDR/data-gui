import { NumberField } from '@/components/number-field'
import { TextField } from '@/components/text-field'
import { ColorField } from '@/components/color-field'
import { FunctionField } from '@/components/function-field'

export default (value: unknown) => {
  if (NumberField.isCompatible(value)) return NumberField
  if (ColorField.isCompatible(value)) return ColorField
  if (TextField.isCompatible(value)) return TextField
  if (FunctionField.isCompatible(value)) return FunctionField
}
