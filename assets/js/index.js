
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