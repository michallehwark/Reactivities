import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from './models/activity';
import NavBar from './NavBar';
import Activitydashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from './API/Agent';
import LoadingComponent from './LoadingComponents';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined); // adding new states, useState can be of type Activity or undefined, its init state is undefined
  const [editMode, setEditMode] = useState(false);
  const [laoding, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => { //.then takes as an argument callback function
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(activities);
      setLoading(false);
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
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
    else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
  }

  if (laoding) return <LoadingComponent content='Loading app'/>

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
          submitting={submitting}
          /> 
        </Container>
    </>
  );
}// Here we need to specify the interface for the properties that we are passing App.tsx to dashboard

export default App;
