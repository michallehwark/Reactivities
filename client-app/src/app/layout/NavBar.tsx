import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react'

export default function NavBar(){
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '20px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to={'/activities'} name="Activities"/>
                <Menu.Item as={NavLink} to={'/errors'} name="Errors"/>
                <Menu.Item>
                    <Button as={NavLink} to={'/createActivity'}  positive content="Create Activiity" />
                </Menu.Item>
            </Container>
        </Menu>
    )
}