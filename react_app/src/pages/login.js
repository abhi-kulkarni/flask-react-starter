import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import logo from '../logo.svg'
import Button from 'react-bootstrap/Button'
import {Container, Row, Col} from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import {connect} from 'react-redux'
import {sign_in} from '../redux'
import { SocialIcon } from 'react-social-icons';


export class Login extends Component {

  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.state = {
      email:"",
      password:"",
      redirect:false
    }
  }

  handleEmailChange = (e) => {
    this.setState({
      email:e.target.value
    })
  }

  handlePasswordChange = (e) => {
    this.setState({
      password:e.target.value
    })
  }

  handleSubmit = (e) => {
    console.log(this.state);
    this.setState({
        redirect:true
    });
    this.dispatch(sign_in())
    e.preventDefault()
  }

  render(){
    const redirect = this.state.redirect;
        if(redirect){
          return <Redirect to="/home"/>
        }else{
            return (
              <div>
                  <Row style={{margin:"0px", padding: "0px"}}>
                    <Col md={4} style={{marginTop:"7%", marginLeft:"15%"}}>
                      <img src={logo} alt="logo"></img>
                    </Col>
                    <Col style={{ marginTop: "7%"}} md={{ span: 3, offset: 2 }}>
                      <Container style={{marginLeft:"25%", borderRadius: "10px", border: "1px solid #D3D3D3"}}>
                      <div style={{marginTop:"4%",marginBottom:"5%"}}><h5><b>Login</b></h5></div>
                        <Form onSubmit={this.handleSubmit}>
                          <Form.Group controlId="Email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control value={this.state.email} type="email" onChange={this.handleEmailChange} placeholder="Enter email" />
                          </Form.Group>
          
                          <Form.Group controlId="Password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={this.state.password} type="password" onChange={this.handlePasswordChange} placeholder="Password" />
                          </Form.Group>
          
                          <Button style={{ marginBottom:"10px", marginTop: "30px"}} block variant="primary" type="submit">
                            Login
                          </Button>
                          <SocialIcon style={{marginTop:"5%", marginBottom:"5%", marginLeft:"15%", marginRight:"5%"}} url="http://facebook.com/" />
                          <SocialIcon style={{margin:"5%"}} url="http://google.com/" />
                          <SocialIcon style={{margin:"5%"}} url="http://twitter.com/"  />
                          <div style={{marginTop:"4%",marginBottom:"5%"}}>
                            <span style={{marginLeft:"35%"}}><b>New User ?</b></span>
                            <a href="/signup" style={{ color:"#3498DB", marginTop:"3%", marginLeft:"25%"}} block variant="primary" type="submit">
                            Create your account
                          </a>
                          </div>
                      </Form>
                      </Container>
                    </Col>
                  </Row> 
            </div>
      )
    } 
  }
}


export default connect()(Login)