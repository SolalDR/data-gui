import { LitElement } from 'lit-element'
import { Emitter } from '@/helpers/emitter-mixin'

export class WebComponent extends Emitter(LitElement) {}
