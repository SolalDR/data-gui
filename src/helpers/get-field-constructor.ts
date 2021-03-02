import { NumberField } from '@/components/number-field'
import { TextField } from '@/components/text-field'
import { ColorField } from '@/components/color-field'
import { FunctionField } from '@/components/function-field'
import { BooleanField } from '@/components/boolean-field'
import { SelectField } from '@/components/select-field'

export default (value: unknown, property: string, params: any) => {
  if (SelectField.isCompatible(value, property, params)) return SelectField
  if (NumberField.isCompatible(value)) return NumberField
  if (ColorField.isCompatible(value)) return ColorField
  if (TextField.isCompatible(value)) return TextField
  if (FunctionField.isCompatible(value)) return FunctionField
  if (BooleanField.isCompatible(value)) return BooleanField
}