import React from "react";
import { Link } from "react-router-dom";

function BoardC({ board, onDel, canDelete }) {
  return (
    <div className="bC">
      <h3>{board.title}</h3>
      <Link to={`/board/${board.id}`} className="vBtn">View</Link>
      {canDelete && (
        <button onClick={onDel} className="delBtn">Del</button>
      )}
    </div>
  );
}

export default React.memo(BoardC);