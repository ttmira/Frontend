import { useState } from "react";
import styles from "./TaskC.module.css";

export default function TaskC({ task, onEdit, onDel }) {
  const [isEdit, setIsEdit] = useState(false);
  const [text, setText] = useState(task.text);

  const save = () => {
    if (!text.trim()) return;
    onEdit(task.id, text);
    setIsEdit(false);
  };

  return (
    <div className={styles.tC}>
      {isEdit ? (
        <div className={styles.editForm}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && save()}
            className={styles.input}
          />
          <button onClick={save} className={styles.btn}>Save</button>
          <button onClick={() => setIsEdit(false)} className={`${styles.btn} ${styles.cancel}`}>×</button>
        </div>
      ) : (
        <>
          <p>{task.text}</p>
          <div className={styles.tActions}>
            <button onClick={() => setIsEdit(true)} className={styles.btn}>Edit</button>
            <button onClick={() => onDel(task.id)} className={styles.btn}>Del</button>
          </div>
        </>
      )}
    </div>
  );
}