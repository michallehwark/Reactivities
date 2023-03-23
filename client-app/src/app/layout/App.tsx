import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import Activitydashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponents';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {

  const {activityStore} = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]) // in [] we pass the dependencies

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

  return (
    <>
        <NavBar />
        <Container style={{marginTop: '7em'}}>
          <Activitydashboard />  
        </Container>
    </>
  );
}// Here we need to specify the interface for the properties that we are passing App.tsx to dashboard

export default observer(App);
