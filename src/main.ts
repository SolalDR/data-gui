import { GUI } from '@/components/gui'
import { Group } from '@/components/group'
import raf from '@solaldr/raf'
import { BooleanController } from './controllers/boolean-controller'
import { ColorController } from './controllers/color-controller'
import { ImageController } from './controllers/image-controller'
import { NumberController } from './controllers/number-controller'
import { SelectController } from './controllers/select-controller'
import { ActionController } from './controllers/action-controller-v2'
import { TextController } from './controllers/text-controller'
import { BaseGroup } from './group'
import { BaseController, ControllerConstructor } from './controller'

raf.start()

GUI.register(BooleanController)
GUI.register(ActionController)
GUI.register(TextController)
GUI.register(ColorController)
GUI.register(NumberController)
GUI.register(ImageController)
GUI.register(SelectController)

/**
 * @ignore
 */
export {
  BooleanController,
  ActionController,
  TextController,
  ColorController,
  NumberController,
  ImageController,
  SelectController,
  Group,
  BaseController,
  BaseGroup,
  GUI,
  ControllerConstructor
}

/**
 * @ignore
 */
export default GUI
