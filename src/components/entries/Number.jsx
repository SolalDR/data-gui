import * as hyperapp from "hyperapp"
export default ({object, key, config, onChange, onInput}, actions) => {
  var onChangeCallback = (event) => {
    object[key] = event.target.value;
    onChange(object[key]);
  }

  return (
    <div>
      {
        !isNaN(config.min) && !isNaN(config.max)
        ? <input type="range" value={object[key]} oninput={onChangeCallback}/>
        : <input type="number" value={object[key]} onchange={onChangeCallback}/>
      }
    </div>
  )
}