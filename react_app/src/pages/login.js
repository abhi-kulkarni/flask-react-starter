import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import logo from '../logo.svg'
import {Container, Row, Col, Modal, Tab, Tabs, Button, Form, Alert} from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup'
import {connect} from 'react-redux'
import {sign_in, user_data, sign_out} from '../redux'
import '../static/css/custom.css'
import {FaEnvelopeOpen, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios'
import store from '../redux/store'


export class Login extends Component {

  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.state = {
      logged_in: false,
      active_key: "reset_email",
      reset_password_email:"",
      new_password:"",
      confirm_password:"",
      email:"",
      password:"",
      redirect:false,
      user_created_success: false,
      password_reset_modal:false,
      show_reset_password_chck_new:true,
      show_reset_password_chck_confirm:true,
      show_password:true,
      resetEmailCheck:false
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.login = this.login.bind(this);
  }


  onChange = (e) => {
    this.setState({
        [e.target.name] : e.target.value
    })
  }

  onSubmit = (e) => {
    this.login();
    e.preventDefault()
  }

  login = () => {
    let post_data = {};
    post_data["email"] = this.state.email;
    post_data["password"] = this.state.password
    axios.post('/login', {"post_data":post_data}).then(response => {
      if(response.data.ok){
          let access_token = response.data.token
          let curr_user_data = response.data.user_data;
          localStorage.setItem("userAccessToken", access_token)
          this.dispatch(user_data(curr_user_data))
          this.dispatch(sign_in(true))
          
          // this.props.history.push('/home')
          this.setState({'logged_in': true})
      }else{
          console.log("Error")
      }  
  }).catch(error => {
      console.log(error)
  })
  }

  onSubmitResetEmail = (e) => {
    console.log(this.state);
    e.preventDefault()
  }

  onSubmitResetPassword = (e) => {
    console.log(this.state);
    e.preventDefault()
  }

  setTabKey = (k) => {
    this.setState({
      active_key: k
    })
  }

  openPasswordResetModal = () => {
    this.setState({
      password_reset_modal:true,
      reset_password_email: "",
      new_password: "",
      confirm_password: ""
    })
  }

  passwordVisiblityToggle = (id, reset, type) => {
    let state = reset?type==="new"?this.state.show_reset_password_chck_new:this.state.show_reset_password_chck_confirm:this.state.show_password;
    let password = document.getElementById(id);
    if(reset){
      if(type === "new"){
        this.setState({
          show_reset_password_chck_new: !state
        })
    }else{
      this.setState({
        show_reset_password_chck_confirm: !state
      })
    }
    }else{
      this.setState({
        show_password: !state
      })
    }
    password.type = password.value && password.value.length > 0 && state?'text':'password';
  }
  
  componentDidMount = () => {
    
    localStorage.removeItem("userAccessToken")
    this.dispatch(user_data())
    this.dispatch(sign_out())
    let store_state = store.getState();
    if(store_state.session.user_created_success){
    this.setState({user_created_success:true},()=>{
      window.setTimeout(()=>{
        this.setState({user_created_success:false})
      },8000)
    });
    }
  }
   
  render(){
        const { logged_in } = this.state;
        if (logged_in) {
          return <Redirect to='/home'/>;
        }
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
                      <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <InputGroup>
                          <InputGroup.Prepend>
                              <InputGroup.Text id="email_prepend">@</InputGroup.Text>
                          </InputGroup.Prepend>
                        <Form.Control name="email" value={this.state.email} type="email" onChange={this.onChange} placeholder="Enter email" />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                        <Form.Control name="password" value={this.state.password} type="password" onChange={this.onChange} placeholder="Password" />
                        <InputGroup.Append>
                              <InputGroup.Text className="cursorPointer" onClick={() => this.passwordVisiblityToggle("password", false, "")} id="password_append">{this.state.show_password?<FaEye style={{color:"# 007BFF"}}/>:<FaEyeSlash style={{color:"#007BFF"}}/>}</InputGroup.Text>
                        </InputGroup.Append>
                        </InputGroup>
                      </Form.Group>
                      <Button style={{ marginBottom:"10px", marginTop: "30px"}} block variant="primary" type="submit">
                        Login
                      </Button>
                      <Row style={{margin:"0px", padding: "0px"}}>
                        <Col md={12} style={{marginBottom:"4%"}}>
                        <a className="cursorPointer" onClick={() => this.openPasswordResetModal()} style={{ color:"#3498DB", marginLeft:"22%", textDecoration:"none" }}>
                          Forgot your password ?
                        </a>
                        </Col>
                      </Row>
                  </Form>
                  <Modal
                    show={this.state.password_reset_modal}
                    onHide={() => this.setState({password_reset_modal:false})}
                    size="lg"
                    aria-labelledby="password_reset_modal"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title id="password_reset_modal">
                        Reset Password
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Tabs
                      id="reset_password_tabs"
                      activeKey={this.active_key}
                      onSelect={(k) => this.setTabKey(k)}
                    >
                      <Tab eventKey="reset_email" title={<FaEnvelopeOpen style={{color:"#007BFF"}}/>}>
                      <Row style={{marginTop:"2%"}}>
                        <Col>
                          <Form onSubmit={this.onSubmitResetEmail}>
                            <Form.Group controlId="reset_password_email">
                              <Form.Label>Email address</Form.Label>
                              <Form.Control name="reset_password_email" value={this.state.reset_password_email} type="email" onChange={this.onChange} placeholder="Enter email" />
                            </Form.Group>
                          </Form>
                        </Col>
                      </Row>
                      </Tab>
                      <Tab eventKey="reset_password" title={<FaCheckCircle style={{color:"green"}} />} disabled={this.state.resetEmailCheck}>
                        <Row style={{marginTop:"2%"}}>
                          <Col>
                            <Form onSubmit={this.onSubmitResetPassword}>
                              <Form.Group controlId="new_password">
                                <Form.Label>New Password</Form.Label>
                                <InputGroup>
                                <Form.Control onChange={this.onChange} name="new_password" value={this.state.new_password} type="password" placeholder="New Password" />
                                <InputGroup.Append>
                                  <InputGroup.Text className="cursorPointer" onClick={() => this.passwordVisiblityToggle("new_password", true, "new")} id="new_password_append">{this.state.show_reset_password_chck_new?<FaEye style={{color:"#007BFF"}}/>:<FaEyeSlash style={{color:"#007BFF"}}/>}</InputGroup.Text>
                                </InputGroup.Append>
                                </InputGroup>
                              </Form.Group>
                              <Form.Group controlId="confirm_password">
                                <Form.Label>Confirm Password</Form.Label>
                                <InputGroup>
                                <Form.Control onChange={this.onChange} name="confirm_password" value={this.state.confirm_password} type="password" placeholder="Confirm Password" />
                                <InputGroup.Append>
                                  <InputGroup.Text className="cursorPointer" onClick={() => this.passwordVisiblityToggle("confirm_password", true, "confirm")} id="confirm_password_append">{this.state.show_reset_password_chck_confirm?<FaEye style={{color:"#007BFF"}}/>:<FaEyeSlash style={{color:"#007BFF"}}/>}</InputGroup.Text>
                                </InputGroup.Append>
                                </InputGroup>
                              </Form.Group>
                            </Form>
                          </Col>
                        </Row>
                      </Tab>
                    </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                    {this.state.active_key === 'reset_email'?<Button variant="primary" type="submit">Submit</Button>:<Button variant="primary" type="submit">Reset Password</Button>}
                    <Button variant="danger" onClick={() => this.setState({password_reset_modal:false})}>Close</Button>
                    </Modal.Footer>
                  </Modal>
                  </Container>
                  <Container style={{marginLeft:"25%", marginTop:"5%"}}>
                    <Row style={{margin:"0px", padding: "0px"}}>
                        <Col md={12} style={{ marginTop:"2%"}}>
                          <p><span style={{marginLeft:"8%", marginRight:"4%"}}><b>New User ?</b></span></p>
                        </Col>
                        <Col md={12} style={{marginTop:"3%", marginBottom:"3%"}}>
                        <Button size="sm" block>
                          <a href="/signup" style={{ color:"white", marginLeft:"10%", textDecoration:"none" }}>
                            <b>Create your account</b>
                          </a>
                        </Button>
                        </Col>
                        <Col md={12}>
                            {this.state.user_created_success?<Alert variant="success" style={{marginTop:"3%", padding:"2% 0% 2% 13%"}}>
                            User Created Successfully
                          </Alert>:""}
                        </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
        </div>
      )
    } 
  }


export default connect()(Login)