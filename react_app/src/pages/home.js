import React from 'react'
import {Redirect} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

function Home(){

    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.session.isLoggedIn);

    if(!isLoggedIn){
        return <Redirect to="/login"/>
      }else{
            return (
                <div>
                    <h1>Welcome Home</h1>
                </div>
            )
      }
}

export default Home