import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/db/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';

const toggleChecked = ({ _id, isChecked }) => {
  // TasksCollection.update(_id, {
  //   $set: {
  //     isChecked: !isChecked //initially it is false because isChecked is not defined in the TaskForm.jsx. So, it is undefined. So, !undefined is true
  //   }
  // })
  Meteor.call('tasks.setIsChecked', _id, !isChecked);
};

// const deleteTask = ({ _id }) => TasksCollection.remove(_id);
const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);

export const App = () => {
  const user = useTracker(() => Meteor.user());//Method to get the current logged in user. if no user is logged in, it returns null
  const [hideCompleted, setHideCompleted] = useState(false);//this state is used to hide the completed tasks in the useTracker hook
  const hideCompletedFilter = { isChecked: { $ne: true } }; //this is an object that is used to filter in find() method.
  const userFilter = user ? { userId: user._id } : {};
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  // const tasks = useTracker(() => {
  //   if (!user) {
  //     return [];
  //   }

  //   return TasksCollection.find(//these filters enable to show only the tasks of the logged in user from all the tasks including the tasks of other users
  //     hideCompleted ? pendingOnlyFilter : userFilter,
  //     {
  //       sort: { createdAt: -1 },
  //     }
  //   ).fetch();
  // });

  // const pendingTasksCount = useTracker(() => {
  //   if (!user) {
  //     return 0;
  //   }

  //   return TasksCollection.find(pendingOnlyFilter).count();
  // });
  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('tasks');

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
  });

  const pendingTasksTitle = `${pendingTasksCount ? ` (${pendingTasksCount})` : ''
    }`;

  const logout = () => Meteor.logout();


  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>📝️ To Do List
              {pendingTasksTitle}

            </h1>
          </div>
        </div>
      </header>

      <div className="main">
        {user ? (
          <Fragment>
            <div className="user" onClick={logout}>
              {user.username || user.profile.name} 🚪
            </div>
            <TaskForm user={user} />

            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>

            {isLoading && <div className="loading">loading...</div>}

            <ul className="tasks">
              {tasks.map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
            </ul>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};
