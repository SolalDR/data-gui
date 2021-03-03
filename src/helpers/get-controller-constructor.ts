import { NumberController } from '@/controllers/number-controller'
import { TextController } from '@/controllers/text-controller'
import { ColorController } from '@/controllers/color-controller'
import { ActionController } from '@/controllers/action-controller'
import { BooleanController } from '@/controllers/boolean-controller'
import { SelectController } from '@/controllers/select-controller'
import { ImageController } from '@/controllers/image-controller'

export default (value: unknown, property: string, params: any) => {
  if (SelectController.isCompatible(value, property, params))
    return SelectController
  if (ImageController.isCompatible(value, property, params))
    return ImageController
  if (NumberController.isCompatible(value, property, params))
    return NumberController
  if (ColorController.isCompatible(value, property, params))
    return ColorController
  if (TextController.isCompatible(value, property, params))
    return TextController
  if (ActionController.isCompatible(value, property, params))
    return ActionController
  if (BooleanController.isCompatible(value, property, params))
    return BooleanController
}
