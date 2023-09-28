import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';

import { ServiceConfiguration } from 'meteor/service-configuration';


const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });
const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';


Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(taskText => insertTask(taskText, user));
  }
});

ServiceConfiguration.configurations.upsert(
  { service: 'github' },
  {
    $set: {
      loginStyle: 'popup',
      clientId: 'fc3dd5cd1a2374ffa6ff', // insert your clientId here
      secret: '6c33f0de6e6a7ffb6709d7c79859cf4bc89c5ccb', // insert your secret here
    },
  }
);