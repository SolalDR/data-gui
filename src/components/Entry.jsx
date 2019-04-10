import * as hyperapp from "hyperapp"
import * as entries from "./entries/index"

export default ({ object, key, config }) => {
  var Element = entries.number;

  var onChangeCallback = (event)=>{
    if (config.onChange && config.onChange instanceof Function) {
      config.onChange(event);
    }
  }


  return (
    <div class="gui__entry">
      <Element 
        object={object} 
        key={key} 
        config={config} 
        onChange={onChangeCallback} />
    </div>
  )
}