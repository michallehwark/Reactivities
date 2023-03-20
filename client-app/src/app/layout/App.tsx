import { Factory, useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from './models/activity';
import NavBar from './NavBar';
import Activitydashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined); // adding new states, useState can be of type Activity or undefined, its init state is undefined
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities') // this returns a promies()response, we need to specify what we want to do with this response data
    .then(response => { //.then takes as an argument callback function
      setActivities(response.data);
    }) // without dependencies useEffect will loop indefinitely
  }, [])

  function handelSelectActivity(id: string){
    setSelectedActivity(activities.find(x => x.id === id)) //find method calls once for every item in x.id to find id matching to ===id
  }

  function handleCancelSelectedActivity(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handelSelectActivity(id) : handleCancelSelectedActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }
  
  function handleCreateOrEditActivity(activity: Activity) {
    activity.id 
      ? setActivities([...activities.filter(x => x.id !== activity.id), activity]) // in this case we are editing an existing activity 
      : setActivities([...activities, {...activity, id: uuid()}]) // in this case we are creating the new activity, we are adding this new activit after the ,(coma) to the array of
    setEditMode(false);
    setSelectedActivity(activity); // after new activity has been created/edite we display the details
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)])
  }

  return (
    <>
        <NavBar openForm={handleFormOpen}/>
        <Container style={{marginTop: '7em'}}> 
          <Activitydashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handelSelectActivity} 
          cancelSelectActivity={handleCancelSelectedActivity} 
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          /> 
        </Container>
    </>
  );
}// Here we need to specify the interface for the properties that we are passing App.tsx to dashboard

export default App;
