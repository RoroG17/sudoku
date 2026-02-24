import { useState, useEffect } from "react";

function Square({ square, onClick, isEdit }) {
  return (
    <button className={`square ${isEdit ? "selected" : ""}`} onClick={onClick}>
      {square}
    </button>
  );
}

function Grid({ base, grid, isEditable, value }) {
  const [localGrid, setGrid] = useState(grid);
  const [selectedIndex, setSelectedIndex] = useState(isEditable);
  useEffect(() => {
    setGrid(grid);
  }, [grid]);

  useEffect(() => {
    setSelectedIndex(isEditable);
  }, [isEditable]);

  function handleClick(i) {
    const nextGrid = localGrid.slice();
    if (base[i] != null) return;
    else if (nextGrid[i] !== null) {
      nextGrid[i] = null;
    } else {
      nextGrid[i] = value;
      const newEdit = selectedIndex.slice();
      newEdit[i] = true;
      setSelectedIndex(newEdit);
    }
    setGrid(nextGrid);
  }
  return (
    <>
      <div className="grid">
        <div className="board-row">
          <Square
            square={localGrid[0]}
            onClick={() => handleClick(0)}
            isEdit={selectedIndex[0]}
          />
          <Square
            square={localGrid[1]}
            onClick={() => handleClick(1)}
            isEdit={selectedIndex[1]}
          />
          <Square
            square={localGrid[2]}
            onClick={() => handleClick(2)}
            isEdit={selectedIndex[2]}
          />
        </div>
        <div className="board-row">
          <Square
            square={localGrid[3]}
            onClick={() => handleClick(3)}
            isEdit={selectedIndex[3]}
          />
          <Square
            square={localGrid[4]}
            onClick={() => handleClick(4)}
            isEdit={selectedIndex[4]}
          />
          <Square
            square={localGrid[5]}
            onClick={() => handleClick(5)}
            isEdit={selectedIndex[5]}
          />
        </div>
        <div className="board-row">
          <Square
            square={localGrid[6]}
            onClick={() => handleClick(6)}
            isEdit={selectedIndex[6]}
          />
          <Square
            square={localGrid[7]}
            onClick={() => handleClick(7)}
            isEdit={selectedIndex[7]}
          />
          <Square
            square={localGrid[8]}
            onClick={() => handleClick(8)}
            isEdit={selectedIndex[8]}
          />
        </div>
      </div>
    </>
  );
}

export default function Board() {
  const [value, setValue] = useState(null);
  const [grids, setGrid] = useState(Array(9).fill(Array(9).fill(null)));
  const [gridsBase, setGridBase] = useState(Array(9).fill(Array(9).fill(null)));
  const [isEditable, setIsEditable] = useState(
    Array(9).fill(Array(9).fill(false))
  );

  function changeValue(value) {
    setValue(value);
  }

  function isValid(grid, gridNumber, pos, num) {
    // Verification case
    if (grid[gridNumber].includes(num)) return false;

    // Verification ligne
    const rowArray = getColumnArray(gridNumber);
    const rowLine = getRowArray(pos);
    for (const grille of rowArray) {
      for (const position of rowLine) {
        if (grid[grille][position] === num) {
          return false;
        }
      }
    }

    // Verification Colonne
    const columnArray = getRowArray(gridNumber);
    const columnLine = getColumnArray(pos);
    for (const grille of columnArray) {
      for (const position of columnLine) {
        if (grid[grille][position] === num) {
          return false;
        }
      }
    }

    return true;
  }

  function getColumnArray(val) {
    if ([0, 3, 6].includes(val)) {
      return [0, 3, 6];
    } else if ([1, 4, 7].includes(val)) {
      return [1, 4, 7];
    } else if ([2, 5, 8].includes(val)) {
      return [2, 5, 8];
    }
  }

  function getRowArray(val) {
    if ([0, 1, 2].includes(val)) {
      return [0, 1, 2];
    } else if ([3, 4, 5].includes(val)) {
      return [3, 4, 5];
    } else if ([6, 7, 8].includes(val)) {
      return [6, 7, 8];
    }
  }

  function newGrid() {
    setValue(null);
    const editable = Array.from({ length: 9 }, () => Array(9).fill(false));
    setIsEditable(editable);
    const emptyGrid = Array.from({ length: 9 }, () => Array(9).fill(null));
    let toInsert = 20;

    while (toInsert > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (emptyGrid[row][col] !== null) continue;

      const num = Math.floor(Math.random() * 9) + 1;

      if (isValid(emptyGrid, row, col, num)) {
        emptyGrid[row][col] = num;
        toInsert--;
      }
    }

    setGridBase(emptyGrid);
    setGrid(emptyGrid);
  }

  const [status, setStatus] = useState(null);
  function validate() {
    let newStatus = "Grille Valide";

    for (let i = 0; i < grids.length; i++) {
      for (let j = 0; j < grids[i].length; j++) {
        if (!isValid(grids, i, j, grids[i][j]) || grids[i][j] == null) {
          newStatus = "Grille Fausses";
          setStatus(newStatus);
          return;
        }
      }
    }
  }

  return (
    <>
      <div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
          <button
            key={v}
            className={`btn ${value === v ? "btn-active" : ""}`}
            onClick={() => changeValue(v)}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="sudoku">
        <div className="grid-row">
          <Grid
            base={gridsBase[0]}
            grid={grids[0]}
            isEditable={isEditable[0]}
            value={value}
          />
          <Grid
            base={gridsBase[1]}
            grid={grids[1]}
            isEditable={isEditable[1]}
            value={value}
          />
          <Grid
            base={gridsBase[2]}
            grid={grids[2]}
            isEditable={isEditable[2]}
            value={value}
          />
        </div>
        <div className="grid-row">
          <Grid
            base={gridsBase[3]}
            grid={grids[3]}
            isEditable={isEditable[3]}
            value={value}
          />
          <Grid
            base={gridsBase[4]}
            grid={grids[4]}
            isEditable={isEditable[4]}
            value={value}
          />
          <Grid
            base={gridsBase[5]}
            grid={grids[5]}
            isEditable={isEditable[5]}
            value={value}
          />
        </div>
        <div className="grid-row">
          <Grid
            base={gridsBase[6]}
            grid={grids[6]}
            isEditable={isEditable[6]}
            value={value}
          />
          <Grid
            base={gridsBase[7]}
            grid={grids[7]}
            isEditable={isEditable[7]}
            value={value}
          />
          <Grid
            base={gridsBase[8]}
            grid={grids[8]}
            isEditable={isEditable[8]}
            value={value}
          />
        </div>
      </div>

      <div>
        <button onClick={newGrid}>Nouvelle grille</button>
        <button onClick={validate}>Valider</button>
      </div>

      <div className="status">{status}</div>
    </>
  );
}
