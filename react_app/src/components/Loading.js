import React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import '../static/css/custom.css'
import {spinner_overlay} from '../redux'
import {connect} from 'react-redux'
import {useDispatch} from 'react-redux'

const Loading = (props) => {
  const dispatch = useDispatch();
  const { promiseInProgress } = usePromiseTracker();
  if(!promiseInProgress){
    dispatch(spinner_overlay())
  }
  return (
      promiseInProgress &&
        <div className="loading">
            <Loader type="Bars" color="#007BFF" height="200px" width="200px" />
        </div>
  );  
}

export default connect()(Loading)