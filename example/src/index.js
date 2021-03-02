import GUI from "./../../dist/index.esm.js";

const a = new GUI({
  // name: 'Parameter'
});

const target = {
  a: 12,
  test: "Hello",
  color: "rgba(232, 93, 93, 0.5)",
  color2: "#FF23FE21",
  color3: { h: 1, s: 0.5, l: 0.3 },
  testBool: false,
  method: (a, b) => {
    console.log(a, b)
  }
}

const testDiv = document.querySelector('#test');

const update = () => {
  testDiv.innerHTML = JSON.stringify(target);
}

a.add('a', target).on('input', update);
a.add('testBool', target).addEventListener('change', update);
a.add('test', target, {
  choices: ['Hello', 'Bruh', 'Bam', { label: 'Test', value: 'bruh'}]
}).addEventListener('change', update);

a.add('a', target, {
  min: -1,
  max: 1000,
  range: false,
  listen: true
}).on('input', update);

a.add('a', target, {
  min: -1,
  max: 1000,
  listen: true
}).on('input', update);

a.action(() => {
  console.log('hello')
})

a.action(() => {
  console.log('hello')
})

a.add('test', target, {
  min: -1,
  max: 1000,
}).on('input', update);

a.add('color', target, {
  min: -1,
  max: 1000,
}).on('input', update);

const g = a.group({
  name: 'testGroup',
})

g.add('color2', target, {
  min: -1,
  max: 1000,
}).on('input', update);

g.add('color3', target, {
  min: -1,
  max: 1000,
}).on('input', update);



const g2 = g.group({
  name: 'innerGroup'
})

g2.add('a', target, {
  min: 300,
  max: 1000,
  listen: true,
}).on('input', update);

g2.add('a', target, {
  min: -100,
  max: 900,
  listen: true,
  name: 'v'
}).on('input', update);

window.GUI = a;