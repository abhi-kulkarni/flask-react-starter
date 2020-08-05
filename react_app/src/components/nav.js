import React, {useState, useEffect} from 'react';
import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem, Dropdown, DropdownButton } from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { sign_out, user_data } from '../redux';
import '../static/css/custom.css'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

function NavBar(){

    const dispatch = useDispatch();
    const history = useHistory();
    const user_data = useSelector(state => state.session.user_data)

    useEffect(() => {
      if(user_data){
        console.log('nav')
      }
    }, [])
    const logout = async () => {
        const response = await axios.get("/logout/")
        if(response.data.ok){
          localStorage.removeItem("userAccessToken");
          dispatch(sign_out());
          dispatch(user_data({}))
          history.push('/login')
        }else{
          console.log("Error")
        }   
  }

    return(
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand>React-Practice</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/shop">Shop</Nav.Link>
          </Nav>
          <DropdownButton
            alignRight
            title={<img style={{margin:"0px 5px 0px 0px", width:"40px", height:"40px", borderRadius:"50%"}} src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg"></img>}
            id="dropdown-menu-align-right"
          >
            <Dropdown.Item href="/#">Action</Dropdown.Item>
            <Dropdown.Item href="/#">Another action</Dropdown.Item>
            <Dropdown.Item href="/#">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/login" onClick={() => logout()}>Logout</Dropdown.Item>
          </DropdownButton>
        </Navbar.Collapse>
      </Navbar>
    )
}

export default NavBar