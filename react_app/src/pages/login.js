import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import logo from '../logo.svg'
import Button from 'react-bootstrap/Button'
import {Container, Row, Col} from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import {connect} from 'react-redux'
import {sign_in} from '../redux'

export class Login extends Component {

  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.state = {
      email:"",
      password:"",
      redirect:false
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = (e) => {
    this.setState({
        [e.target.name] : e.target.value
    })
  }

  onSubmit = (e) => {
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
                    <Col md={4} style={{marginTop:"10%", marginLeft:"15%"}}>
                      <img src={logo} alt="logo"></img>
                    </Col>
                    <Col style={{ marginTop: "7%"}} md={{ span: 3, offset: 2 }}>
                      <Container style={{marginLeft:"25%", borderRadius: "10px", border: "1px solid #D3D3D3"}}>
                      <div style={{marginTop:"4%",marginBottom:"5%"}}><h5><b>Login</b></h5></div>
                        <Form onSubmit={this.onSubmit}>
                          <Form.Group controlId="Email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control name="email" value={this.state.email} type="email" onChange={this.onChange} placeholder="Enter email" />
                          </Form.Group>
          
                          <Form.Group controlId="Password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="password" value={this.state.password} type="password" onChange={this.onChange} placeholder="Password" />
                          </Form.Group>
          
                          <Button style={{ marginBottom:"10px", marginTop: "30px"}} block variant="primary" type="submit">
                            Login
                          </Button>
                          <Row style={{margin:"0px", padding: "0px"}}>
                          <Col md={12} style={{marginLeft:"32%", marginTop:"2%"}}>
                            <b>New User ?</b>
                          </Col>
                          <Col md={12} style={{marginTop:"3%", marginBottom:"3%"}}>
                          <a href="/signup" style={{ color:"#3498DB", marginLeft:"24%", textDecoration:"none" }}>
                             <b>Create your account</b>
                          </a>
                          </Col>
                          </Row>
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