import { useState } from "react";

export default function TaskC({ task, onEdit, onDel }) {
  const [isEdit, setIsEdit] = useState(false);
  const [text, setText] = useState(task.text);

  const save = () => {
    if (!text.trim()) return;
    onEdit(task.id, text);
    setIsEdit(false);
  };

  return (
    <div className="tC">
      {isEdit ? (
        <div className="editForm">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
          <button onClick={save} className="btn">Save</button>
          <button onClick={() => setIsEdit(false)} className="btn cancel">×</button>
        </div>
      ) : (
        <>
          <p>{task.text}</p>
          <div className="tActions">
            <button onClick={() => setIsEdit(true)} className="btn">Edit</button>
            <button onClick={() => onDel(task.id)} className="btn del">Del</button>
          </div>
        </>
      )}
    </div>
  );
}