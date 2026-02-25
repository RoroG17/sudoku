import { useState, useEffect, createRef } from "react";

function Square({ isVerify, square, onClick, isEdit }) {
  
  const statusClass =
  isVerify === true
    ? "bg-green"
    : isVerify === false
    ? "bg-red"
    : "bg-white";

  return (
    <button className={`square ${statusClass} ${isEdit ? "selected" : ""}`} onClick={onClick}>
      {square}
    </button>
  );
}

function Grid({ isVerify, base, grid, isEditable, value, onGridChange }) {
  const [localGrid, setGrid] = useState(grid);
  const [selectedIndex, setSelectedIndex] = useState(isEditable);

  useEffect(() => setGrid(grid), [grid]);
  useEffect(() => setSelectedIndex(isEditable), [isEditable]);

  function handleClick(i) {
    const nextGrid = localGrid.slice();

    if (base[i] != null || (nextGrid[i] != value && nextGrid[i] !== null)) return;

    if (nextGrid[i] !== null) {
      nextGrid[i] = null;
    } else {
      nextGrid[i] = value;
      const newEdit = selectedIndex.slice();
      newEdit[i] = true;
      setSelectedIndex(newEdit);
    }

    setGrid(nextGrid);
    onGridChange(nextGrid);
  }

  return (
    <div className="grid">
      <div className="board-row">
        <Square isVerify={isVerify[0]} square={localGrid[0]} onClick={() => handleClick(0)} isEdit={selectedIndex[0]} />
        <Square isVerify={isVerify[1]} square={localGrid[1]} onClick={() => handleClick(1)} isEdit={selectedIndex[1]} />
        <Square isVerify={isVerify[2]} square={localGrid[2]} onClick={() => handleClick(2)} isEdit={selectedIndex[2]} />
      </div>

      <div className="board-row">
        <Square isVerify={isVerify[3]} square={localGrid[3]} onClick={() => handleClick(3)} isEdit={selectedIndex[3]} />
        <Square isVerify={isVerify[4]} square={localGrid[4]} onClick={() => handleClick(4)} isEdit={selectedIndex[4]} />
        <Square isVerify={isVerify[5]} square={localGrid[5]} onClick={() => handleClick(5)} isEdit={selectedIndex[5]} />
      </div>

      <div className="board-row">
        <Square isVerify={isVerify[6]} square={localGrid[6]} onClick={() => handleClick(6)} isEdit={selectedIndex[6]} />
        <Square isVerify={isVerify[7]} square={localGrid[7]} onClick={() => handleClick(7)} isEdit={selectedIndex[7]} />
        <Square isVerify={isVerify[8]} square={localGrid[8]} onClick={() => handleClick(8)} isEdit={selectedIndex[8]} />
      </div>
    </div>
  );
}

export default function Board() {
  const [value, setValue] = useState(null);
  const [grids, setGrid] = useState(Array(9).fill(Array(9).fill(null)));
  const [verify, setVerify] = useState(Array(9).fill(Array(9).fill(null)));
  const [gridsBase, setGridBase] = useState(Array(9).fill(Array(9).fill(null)));
  const [isEditable, setIsEditable] = useState(
    Array(9).fill(Array(9).fill(false))
  );

  const [numberInit, setNumberInit] = useState(15);

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
    resetValidation()
    const editable = Array.from({ length: 9 }, () => Array(9).fill(false));
    setIsEditable(editable);
    const emptyGrid = Array.from({ length: 9 }, () => Array(9).fill(null));
    let toInsert = numberInit;

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

  function check(i, j) {
    if (grids[i][j] == null) return false;
    // Vérification case
    const box = grids[i];
    let countBox = 0;
    box.forEach((element) => {
      if (element == grids[i][j]) countBox++;
    });

    if (countBox != 1) return false;

    // Verification ligne
    const rowArray = getColumnArray(i);
    const rowLine = getRowArray(j);
    let countRow = 0;
    for (const grille of rowArray) {
      for (const position of rowLine) {
        if (grids[grille][position] === grids[i][j]) {
          countRow++;
        }
      }
    }
    if (countRow != 1) return false;

    // Verification Colonne
    const colArray = getColumnArray(i);
    const colLine = getRowArray(j);
    let countCol = 0;
    for (const grille of colArray) {
      for (const position of colLine) {
        if (grids[grille][position] === grids[i][j]) {
          countCol++;
        }
      }
    }
    if (countCol != 1) return false;

    return true;
  }

  const [status, setStatus] = useState(null);
  function validate() {
    let newStatus = "Grille Valide";
    const nextVerify = verify.map(row => [...row]);
    for (let i = 0; i < grids.length; i++) {
      for (let j = 0; j < grids[i].length; j++) {
        if (!check(i, j)) {
          newStatus = "Grille Fausses";
          setStatus(newStatus);
          nextVerify[i][j] = false
        } else {
          nextVerify[i][j] = true
        }
      }
    }
    setVerify(nextVerify)
    setStatus(newStatus);
  }

  function resetValidation() {
    const reset = Array(9).fill(Array(9).fill(null));
    setVerify(reset)
  }

  const onKeyPress = (e) => {
    switch (e.code) {
      case "Digit1":
        setValue(1);
        break;

      case "Digit2":
        setValue(2);
        break;

      case "Digit3":
        setValue(3);
        break;

      case "Digit4":
        setValue(4);
        break;

      case "Digit5":
        setValue(5);
        break;

      case "Digit6":
        setValue(6);
        break;

      case "Digit7":
        setValue(7);
        break;

      case "Digit8":
        setValue(8);
        break;

      case "Digit9":
        setValue(9);
        break;
    }
  };

  const ref = createRef();

  useEffect(() => {
    ref.current.focus();
  }, [ref]);
  return (
    <>
      <div tabIndex={1} onKeyPress={onKeyPress} ref={ref}>
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
            isVerify={verify[0]}
            base={gridsBase[0]}
            grid={grids[0]}
            isEditable={isEditable[0]}
            value={value}
            onGridChange={(newGrid) => {
              const updated = [...grids];
              updated[0] = newGrid;
              setGrid(updated);
              resetValidation();
            }}
          />
          <Grid
          isVerify={verify[1]}
            base={gridsBase[1]}
            grid={grids[1]}
            isEditable={isEditable[1]}
            value={value}
            onGridChange={(newGrid) => {
              const updated = [...grids];
              updated[1] = newGrid;
              setGrid(updated);
              resetValidation();
            }}
          />
          <Grid
          isVerify={verify[2]}
            base={gridsBase[2]}
            grid={grids[2]}
            isEditable={isEditable[2]}
            value={value}
            onGridChange={(newGrid) => {
              const updated = [...grids];
              updated[2] = newGrid;
              setGrid(updated);
              resetValidation();
            }}
          />
        </div>
        <div className="grid-row">
          <Grid
            isVerify={verify[3]}
            base={gridsBase[3]}
            grid={grids[3]}
            isEditable={isEditable[3]}
            value={value}
            onGridChange={(newGrid) => {
              const updated = [...grids];
              updated[3] = newGrid;
              setGrid(updated);
              resetValidation();
            }}
          />
          <Grid
            isVerify={verify[4]}
            base={gridsBase[4]}
            grid={grids[4]}
            isEditable={isEditable[4]}
            value={value}
            onGridChange={(newGrid) => {
              const updated = [...grids];
              updated[4] = newGrid;
              setGrid(updated);
              resetValidation();
            }}
          />
          <Grid
            isVerify={verify[5]}
            base={gridsBase[5]}
            grid={grids[5]}
            isEditable={isEditable[5]}
            value={value}
            onGridChange={(newGrid) => {
              const updated = [...grids];
              updated[5] = newGrid;
              setGrid(updated);
              resetValidation();
            }}
          />
        </div>
        <div className="grid-row">
          <Grid
            isVerify={verify[6]}
            base={gridsBase[6]}
            grid={grids[6]}
            isEditable={isEditable[6]}
            value={value}
            onGridChange={(newGrid) => {
              const updated = [...grids];
              updated[6] = newGrid;
              setGrid(updated);
              resetValidation();
            }}
          />
          <Grid
            isVerify={verify[7]}
            base={gridsBase[7]}
            grid={grids[7]}
            isEditable={isEditable[7]}
            value={value}
            onGridChange={(newGrid) => {
              const updated = [...grids];
              updated[7] = newGrid;
              setGrid(updated);
              resetValidation();
            }}
          />
          <Grid
            isVerify={verify[8]}
            base={gridsBase[8]}
            grid={grids[8]}
            isEditable={isEditable[8]}
            value={value}
            onGridChange={(newGrid) => {
              const updated = [...grids];
              updated[8] = newGrid;
              setGrid(updated);
              resetValidation();
            }}
          />
        </div>
      </div>

      <div>
        <p>Nombre de chiffre sur la grille (0 - 30) : </p>
        <input
          type="range"
          value={numberInit}
          min={0}
          max={30}
          onChange={(e) => setNumberInit(e.target.value)}
        />
        <input
          type="number"
          value={numberInit}
          min={0}
          max={30}
          onChange={(e) => setNumberInit(e.target.value)}
        />
      </div>

      <div className="section-button">
        <button onClick={newGrid}>Nouvelle grille</button>
        <button onClick={validate}>Valider</button>
      </div>
      <div className="status">{status}</div>
    </>
  );
}
