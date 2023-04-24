import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Label, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponents';
import { Activity, ActivityFormValues } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import {v4 as uuid} from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from './MyTextArea';
import MySelectInput from './MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';

export default observer(function ActivityForm() { //:selectedActivity is changing the name of the activity vairable passed from Props

    const {activityStore} = useStore();
    const {createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues);

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required.'),
        description: Yup.string().required('The activity description is required.'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required()
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)));
    }, [id, loadActivity])

    function handleFormSubmit(activity: ActivityFormValues) {
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }


    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik enableReinitialize
                    validationSchema={validationSchema} 
                    initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (            
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput placeholder='Title' name='title' />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput 
                            placeholderText='Date' 
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal' />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue'  name='venue' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid} 
                            loading={isSubmitting} floated='right' positive type='submit' content='Submit' />
                        <Button as={Link} to='/activities' floated='right' positive type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})