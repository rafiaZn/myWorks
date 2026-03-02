const textArea = document.getElementById('textArea');
const clockDisplay = document.getElementById('clock');
const timerDisplay = document.getElementById('timer');
const wpsDisplay = document.getElementById('wps');
const cpsDisplay = document.getElementById('cps');
const spmDisplay = document.getElementById('spm');
const resetButton = document.getElementById('resetButton');

let timer = 0;
let interval = null;

function updateClock(){
  const now = new Date();
  clockDisplay.textContent = now.toLocaleTimeString();
}
setInterval(updateClock,1000);
updateClock();

textArea.addEventListener("focus", () =>{
  if(!interval){
    interval = setInterval(()=>{
      timer++;
      timerDisplay.textContent = timer;
    },1000)
  }
});
textArea.addEventListener("blur",() =>{
  clearInterval(interval);
  interval= null;
  calculateStats();
});

function calculateStats() {
  const text = textArea.value;
  
  const words = text.trim().split(/\s+/).filter(word=>word.length);
  const chars = text.length;
  const sentences = text.split(/[.!?]+/).filter(sentence=>sentence.length);
  
  if (timer > 0) {
    wpsDisplay.textContent = (words.length / timer);
    cpsDisplay.textContent = (chars / timer);
    spmDisplay.textContent = ((sentences.length / timer) / 60);
  }
}

resetButton.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  timer = 0;
  
  textArea.value = " ";
  timerDisplay.textContent = 0;
  wpsDisplay.textContent = 0;
  cpsDisplay.textContent = 0;
  spmDisplay.textContent = 0;
});

// function showTime() {
//  document.getElementById('clock').innerHTML = new Date().toUTCString();
// }
// showTime();
// setInterval(function () {
//  showTime();
// }, 1000);