import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import Nav from '../components/nav'
import axios from 'axios'


function About(){

    const isLoggedIn = useSelector(state => state.session.isLoggedIn)
    const access = localStorage.getItem("userAccessToken")
    const dispatch = useDispatch();
    const user_data = useSelector(state => state.session.user_data);
    const user_id = user_data["userId"];

    return (
        <div>
            <h3>This is About Page </h3>
        </div>
    )
}

export default About