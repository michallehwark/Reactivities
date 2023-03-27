import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Header } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import ActivityListItem from './ActivitListItem';

export default observer(function ActivityList() {
    const {activityStore} = useStore();
    const {gropuedActivities} = activityStore;

    return(
        <>
            {gropuedActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                            {activities.map(activity => (
                                <ActivityListItem key={activity.id} activity={activity} />
                            ))}
                </Fragment>
            ))}
        </>
    )
}) // here we can style how each of the activities is styled on the webiste