import React from 'react';

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={!!task.isChecked}
        onClick={() => onCheckboxClick(task)}//Passed callback function
        readOnly

      />
      <span>{task.text}</span>

      <button onClick={() => onDeleteClick(task)}>&times;</button>
      {/* &times equal x mark*/}
    </li>
  );
};