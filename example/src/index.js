import GUI from "./../../dist/index.js";

var config = {
  scene: {
    fov: 23
  }
}

var gui = new GUI({
  element: document.body
});

gui.addEntry(config.scene, 'fov', {
  max: 1,
  onChange: (value)=>{
    console.log('change');
  },
  onInput: ()=>{
    console.log('input')
  }
})

// gui.add({
//   type: 'folder',
//   name: 'GUI',
//   slug: 'root',
//   entries: [
//     {
//       type: 'folder',
//       name: 'Scene',
//       slug: 'scene',
//       entries: []
//     },
//   ]
// })
