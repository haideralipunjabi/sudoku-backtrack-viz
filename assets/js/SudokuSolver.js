const HIGHLIGHTS = [
    "greenHighlight",
    "subGreenHighlight",
    "redHighlight",
    "subRedHighlight",
  ];


const getEmptyGrid = () => {
  let grid = [];
  for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
      grid[i][j] = 0;
    }
  }
  return grid;
};
const map2D = (x, y) => x * 9 + y;
const reverse2D = idx => [Math.floor(idx/9), idx%9];

const getBoxIndexes = (idx) => {
  let idxs = [];
  let [row,col] = reverse2D(idx);
  let rowBase = Math.floor(row / 3) * 3;
  let colBase = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (map2D(rowBase + i, colBase + j) === idx) continue;
      idxs.push(map2D(rowBase + i, colBase + j));
    }
  }
  return idxs;
};
const getRowIndexes = (idx) => {
  let idxs = [];
  let [row,_] = reverse2D(idx);
  for (let i = 0; i < 9; i++) {
    if (map2D(row, i) === idx) continue;
    idxs.push(map2D(row, i));
  }
  return idxs;
};
const getColIndexes = (idx) => {
  let idxs = [];
  let [_,col] = reverse2D(idx);
  for (let i = 0; i < 9; i++) {
    if (map2D(i, col) === idx) continue;
    idxs.push(map2D(i, col));
  }
  return idxs;
};

class SudokuSolver {
  constructor(inputs) {
    this.inputs = inputs;
    this.currentIdx = 0;
    this.direction = 1;
  }
  getEmptyLocation = () => {
    for(let i = 0; i < 9; i++){
      for(let j = 0; j < 9; j++){
        if(this.grid[i][j] === 0) return [i,j];
      }
    }
    return false;
  }
  getGrid = () => {
    let grid = getEmptyGrid();
    this.inputs.forEach((inp, idx) => {
      let row = Math.floor(idx / 9);
      let col = idx % 9;
      grid[row][col] = parseInt(inp.value) || 0;
    });
    return grid;
  };
  check = (idx,value) => {
    let boxIndexes = getBoxIndexes(idx);
    let colIndexes = getColIndexes(idx);
    let rowIndexes = getRowIndexes(idx);
    let flag = true;
    boxIndexes.forEach(index => {
        if(parseInt(this.inputs[index].value) === value){
            flag = false;
            this.highlight(idx,boxIndexes,"redHighlight","subRedHighlight");
        }
    });
    colIndexes.forEach(index => {
        if(parseInt(this.inputs[index].value) === value){
            flag = false;
            this.highlight(idx,colIndexes,"redHighlight","subRedHighlight");
        }
    });
    rowIndexes.forEach(index => {
        if(parseInt(this.inputs[index].value) === value){
            flag = false;
            this.highlight(idx,rowIndexes,"redHighlight","subRedHighlight");
        }
    });
    if(flag) this.highlight(idx,[...boxIndexes,...colIndexes,...rowIndexes],"greenHighlight","subGreenHighlight");
    return flag;
  };
  clearHighlights = () => {
    this.inputs.forEach((inp) => {
      HIGHLIGHTS.forEach((highlight) => {
        inp.parentElement.classList.remove(highlight);
      });
    });
  };
  highlight = (idx,idxs,highlight,subHighlight) => {
    this.inputs[idx].parentElement.classList.add(highlight);
      idxs.forEach(i=>{
        this.inputs[i].parentElement.classList.add(subHighlight);
      })
  }
  printGrid = () => {
    console.table(this.getGrid());
  };
  solve = () => {
        this.clearHighlights();
        // while(this.currentIdx<81) {
        let idx = this.currentIdx;
        if(idx === 81) 
            return true;
        if(this.inputs[idx].getAttribute("disabled")){
            this.currentIdx += 1 * this.direction;
            return false;
        }
        this.direction = 1;
        let value = parseInt(this.inputs[idx].value) || 0;
        if(value===9){
            this.currentIdx--;
            this.direction = -1;
            this.inputs[idx].value = "";
            return false;
        }
        this.inputs[idx].value = value + 1;
        if(this.check(idx,value+1)){
            this.currentIdx++;
        }
        
    }
}
