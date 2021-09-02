import { GUI } from '@/components/gui'

export default (value: unknown, property: string, params: any) => {
  const Controller = GUI.controllers.find(controller => {
    return controller.isCompatible(value, property, params)
  })
  return Controller
}