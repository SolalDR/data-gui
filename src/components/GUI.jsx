import * as hyperapp from "hyperapp"
import Entry from "./Entry.jsx";

export default class GUI {
	constructor() {
		this.state = {
			entries: []
		}
		
		this.actions = {
			down: value => state => ({ count: state.count - value }),
			up: value => state => ({ count: state.count + value })
		}
		
		this.view = (state, actions) => (
			<div class='gui'>
				<h1>{state.count}</h1>
        {state.entries.map(({object, key, config}) => (
          <Entry object={object} key={key} config={config}/>
        ))} 
				<button onclick={() => actions.down(1)}>-</button>
				<button onclick={() => actions.up(1)}>+</button>
			</div>
		)
		
		hyperapp.app(this.state, this.actions, this.view, document.body)
  }
  
  addEntry(object, key, config = {}) {
    this.state.entries.push({
      object, key, config
    })
  }
}
