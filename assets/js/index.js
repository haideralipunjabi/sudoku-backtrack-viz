
let allInputs = document.querySelectorAll(".cell>input");
let stepCounter = document.getElementById("stepCounter");
let speed = 1000;
let running = false;
let solver;

// Allow Only 1-9 in the Inputs
allInputs.forEach((inp) => {
  inp.addEventListener("keydown", (e) => {
    if (
      e.getModifierState("Meta") ||
      e.getModifierState("Control") ||
      e.getModifierState("Alt")
    )
      return;
    if (e.key.length !== 1 || e.key === "\x00") return;
    if (e.key < "1" || e.key > "9") e.preventDefault();
  });
});


document.getElementById("btnStart").addEventListener("click", (e) => {
    running = true;
    document.getElementById("btnPause").removeAttribute("disabled");
    allInputs.forEach((inp) => {
      if (inp.value) {
        inp.setAttribute("disabled", true);
      }
    });
    solver = new SudokuSolver(allInputs);
    let steps = 0;
    let timeout = setTimeout(to = ()=>{
        if(running){
          steps++;
          stepCounter.textContent = steps;
          let sol = solver.solve();
          if(!sol) setTimeout(to,speed); 
        }
    },speed)
});

document.getElementById("instantSolve").addEventListener("click",e=>{
  allInputs.forEach((inp) => {
    if (inp.value) {
      inp.setAttribute("disabled", true);
    }
  });
  solver = new SudokuSolver(allInputs);
  let steps = 0;
  let sol = false;
  while(!sol){
    steps++;
    sol = solver.solve();
  }
  stepCounter.textContent = steps;
})

document.getElementById("btnPause").addEventListener("click",(e)=>{
    if(running){
      running = false;
      e.target.textContent = "Play";
    }
    else {
      running = true;
      e.target.textContent = "Pause";
    }
})

document.getElementById("btnReset").addEventListener("click",e=>{
  running = false;
  stepCounter.textContent = "0";
  document.getElementById("btnPause").textContent = "Pause";
  document.getElementById("btnPause").setAttribute("disabled",true);
  allInputs.forEach(input=>{
    input.value="";
    input.removeAttribute("disabled");
  })
  if(solver){
    solver.clearHighlights();
    solver = null;
  }
})

document.getElementById("inputSpeed").addEventListener("change",e=>{
  speed = 1001 - e.target.value;
})

const testArray = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];
const arrayToInputs = (arr) =>{
  if(arr.length !== 9 || arr[0].length !== 9) return;
  for(let i = 0; i<9; i++){
    for(let j=0; j<9; j++) {
      allInputs[map2D(i,j)].value = arr[i][j] || "";
    }
  }
}