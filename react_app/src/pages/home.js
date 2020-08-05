import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import Nav from '../components/nav'
import axios from 'axios'
import {sign_in, user_data, sign_out} from '../redux'
import {Button} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'

function Home(){

    const dispatch = useDispatch();
    const history = useHistory();
    const user_data = useSelector(state => state.session.user_data);
    const user_id = user_data["userId"];

    useEffect(() => {
        const token = localStorage.getItem('userAccessToken');
        console.log("home js")
        if(user_id){
            axios.get("/get_user_data/"+user_id+"/", {
                headers: {
                    'x-access-token': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if(response.data.ok){
                    let curr_user_data = response.data.user;
                    console.log(curr_user_data)
                }else{
                    console.log("Error")
                }  
            }).catch(error => {
                console.log(error)
            })
        }
    }, [])

    return (
        <div>
            <h1>Welcome Home</h1>
        </div>
    )
      
}

export default Home