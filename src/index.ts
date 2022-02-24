import { GUI, GUIConstructor } from '@/components/gui'
import { Group, GroupConstructor } from '@/components/group'
import raf from '@solaldr/raf'
import * as Controllers from './controllers'
import { BaseGroup, BaseGroupConstructor } from '@/core/group'
import { BaseController, ControllerConstructor } from '@/core/controller'

raf.start()

GUI.register(Controllers.BooleanController)
GUI.register(Controllers.ActionController)
GUI.register(Controllers.TextController)
GUI.register(Controllers.NumberController)
GUI.register(Controllers.ImageController)
GUI.register(Controllers.SelectController)

export {
  Group,
  BaseController,
  BaseGroup,
  GUI,
  ControllerConstructor,
  BaseGroupConstructor,
  GroupConstructor,
  GUIConstructor
}

export * from './controllers'

/**
 * @ignore
 */
export default GUI