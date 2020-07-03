import React from 'react';
import Button from 'react-bootstrap/Button'
import {useSelector, useDispatch} from 'react-redux'
import {increment, decrement, sign_in, sign_out} from '../redux'

function About(){
    const counter = useSelector(state => state.counter.counter);
    const isLoggedIn = useSelector(state => state.session.isLoggedIn)
    const dispatch = useDispatch();
    return (
        <div>
            <h1>About page</h1>
            <div className="mb-2">
                <Button variant="primary" size="lg">
                Large button
                </Button>{' '}
                <Button variant="secondary" size="lg">
                Large button
                </Button>
            </div>
            <div>
            <Button variant="primary" size="sm">
            Small button
                </Button>{' '}
            <Button variant="secondary" size="sm">
            Small button
            </Button>
            </div>
            <h3>Counter - {counter}</h3>
            <Button onClick={() => dispatch(increment())}>+</Button><br/><br/>
            <Button variant="success" onClick={() => dispatch(decrement())}>-</Button>
            <h3>Logged in - {JSON.stringify(isLoggedIn)}</h3>
    <Button size="sm" variant="primary" onClick={() => dispatch(sign_in())}>{isLoggedIn?'Sign Out':'Sign In'}</Button>
        </div>
    )
}

export default About