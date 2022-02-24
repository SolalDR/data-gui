import { BaseController } from ".."
export const controllers: (typeof BaseController)[] = []

export const registerController = (controller: typeof BaseController) => {
  if (!controller) throw new Error('Controller cannot be registered');
  if (controllers.indexOf(controller) === -1) {
    controllers.unshift(controller)
  }
}

export const getControllerConstructor = (value: unknown, property: string, params: any) => {
  const Controller = controllers.find(controller => {
    return controller.isCompatible(value, property, params)
  })
  return Controller
}