const io = require("socket.io-client");
const ioClient = io.connect("http://localhost:4000");
const MIL_SEC = 1000;
const RESATRT_SEC = 1;


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


let main = () => new Promise((resolve) => {
  ioClient.emit("kanji", getRandomInt(10));
  resolve('end');
});


async function batch() {
  while (true) {
    ret = await main();
    if(ret == 'end'){
      console.log('end')
    }
    await sleep(MIL_SEC * RESATRT_SEC);
  }
}


batch();
