function world() {
  return new Promise(resolve => {
      resolve('hello world');
  });
}

async function hello() {
  const msg = await world();
  console.log('Message:', msg);
}

hello();
