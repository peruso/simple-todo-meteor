import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';

export const TaskForm = () => {//erased {user} from the parameter because we get the userId in the server 
  const [text, setText] = useState("");

  const handleSubmit = e => {
    e.preventDefault();//to prevent the default behavior of the form

    if (!text) return;

    Meteor.call('tasks.insert', text);//to insert the task into the database using the method defined in the server/main.js instead of using the TasksCollection.insert() method because we want to insert the task into the database from the server instead of the client

    // TasksCollection.insert({
    //   text: text.trim(),//to remove any whitespace from the beginning or end of the text
    //   createdAt: new Date(),
    //   userId: user._id
    // });

    setText("");//to clear the input field
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type to add new tasks"
        value={text}//this is not necessary but it is used to clear the input field after the user submits the form
        onChange={(e) => setText(e.target.value)}//to update the text state when the user types in the input field
      />

      <button type="submit">Add Task</button>
    </form>
  );
};