import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import '../static/css/custom.css'
import img_avatar_male from '../static/images/img_avatar_male.png'
import img_avatar_female from '../static/images/img_avatar_female.png'
import profile_photo_default from '../static/images/profile_photo_default.png'
import {FaArrowLeft, FaTimes } from 'react-icons/fa';
import {Alert, Button, Container, Row, Col, Tooltip, OverlayTrigger} from 'react-bootstrap'
import axios from 'axios'
import { SocialIcon } from 'react-social-icons';
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

    const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

    // Minimum six and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character:

    const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/)
  
    const formValid = ({ formErrors, ...rest }) => {
        let valid = true;
        
        // validate form errors being empty
        Object.values(formErrors).forEach(val => {
            val.length > 0 && (valid = false);
        });
    
        // validate the form was filled out
        Object.values(rest).forEach(val => {
            val === null && (valid = false);
        });
    
        return valid;
    };

export class SignUp extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            username:"",
            email:"",
            gender:"0",
            country:"0",
            profile_photo:null,
            password:"",
            confirm_password:"",
            redirect:false,
            imagePreviewUrl:"",
            show_profile_photo_rm_button:false,
            country_list:[],
            isValid:true,
            formErrors: {
                username: "",
                email: "",
                gender: "",
                country: "",
                password: "",
                confirm_password_msg:"",
            }
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    renderTooltip() {
        return (
          <Tooltip id="button-tooltip">
            Remove Profile Image
          </Tooltip>
        );
      }

    handleProfileImageChange = (e) => {
        e.preventDefault()
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                profile_photo: file,
                imagePreviewUrl: reader.result,
                show_profile_photo_rm_button:true
            });
        }
        reader.readAsDataURL(file)
    } 

    removeProfilePhoto = () => {
        this.profilePhotoInput.value = ""
        this.setState({
            profile_photo: null,
            imagePreviewUrl: "",
            show_profile_photo_rm_button:false
        })
    }

    onSubmit = (e) => {
        
        if (formValid(this.state)) {
            this.setState({
                isValid:true,
                redirect:true
            });
            console.log(`
              --SUBMITTING--
              Username: ${this.state.username}
              Email: ${this.state.email}
              Country: ${this.state.country}
              Gender: ${this.state.gender}
              Password: ${this.state.password}
              Confirm Password: ${this.state.confirm_password}
              `);
          } else {
            this.setState({
                isValid:false
            }) 
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
          }
        
        e.preventDefault()
    }

    onChange = (e) => {

        let formErrors = { ...this.state.formErrors };
        const { name, value } = e.target;
        let password = this.state.password;
        this.validate(name, value, formErrors, password)
        this.setState({
            formErrors,
            [e.target.name] : e.target.value
        })
    }

    validate(name, value, formErrors, password){
        switch (name) {
            case "username":
                formErrors.username =
                value.length > 0 && value.length < 3 ? "minimum 3 characaters required" : "";
                break;
            case "email":
                formErrors.email = value.length > 0 && emailRegex.test(value)
                ? ""
                : "invalid email address";
                break;
            case "gender":
                formErrors.gender =
                value.length <= 0 ? "please select gender" : "";
                break;
            case "country":
                formErrors.country =
                value.length <= 0 ? "please select country" : "";
                break;    
            case "password":
                formErrors.password =
                passwordRegex.test(value) ? "" : value.length > 0 ? "minimum 6 characaters, maximum 10 characters, one uppercase, one lowercase and one special character required" : "";
                break;
            case "confirm_password":
                formErrors.confirm_password_msg =
                value.length > 0 && password !== value ?"password and confirm password should be the same":"";
                break
            default:
                break;
            }
    }
    
    componentDidMount = () => {
        axios.get('https://restcountries.eu/rest/v2/all').then(response => {
            let country_data = [];
            response.data.map((item, i) => {
                country_data.push({"id":i, "name":item.name})
            })
            this.setState({
                country_list:country_data
            })
        }).catch(error => {
            console.log(error)
        })
    }

    render(){
        
        const { formErrors } = this.state;
        const redirect = this.state.redirect;
        let imagePreviewUrl = this.state.imagePreviewUrl;
        let imagePreview = (<img style={{width:"60px", borderRadius:"50%"}} src={profile_photo_default} />);
        if(this.state.gender === 'Male'){
            imagePreview = (<img style={{width:"60px", borderRadius:"50%"}} src={img_avatar_male} />);
        }else if(this.state.gender === 'Female'){
            imagePreview = (<img style={{width:"60px", borderRadius:"50%"}}  src={img_avatar_female} />);
        }    
        if (imagePreviewUrl) {
            imagePreview = (<img style={{width:"80px", height:"80px", borderRadius:"80%"}} src={imagePreviewUrl} />);
        }
        if(redirect){
            return <Redirect to="/login" />
        }else{        
            return (
                <div>
                    <Row style={{margin:"0px", padding:"0px"}}>
                        <Col md={{ span: 6, offset: 3 }}>
                            <div style={{marginLeft:"15%", marginTop:"2%"}}><h3><b>Sign Up using your social account</b></h3></div>
                        </Col>
                        <Col md={{ span: 3 }}>
                            <Button onClick={() => this.props.history.push("/")} style={{ marginTop: "5%", "marginLeft":"60%"}} size="sm" variant="primary">
                                <span>Back to Login</span> <FaArrowLeft style={{paddingLeft:"2px", marginBottom:"2px"}}/>
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{margin:"0px", padding:"0px"}}>
                        <Col md={{ span: 5, offset: 4 }}>
                            <SocialIcon style={{marginTop:"5%", marginBottom:"5%", marginLeft:"18%"}} url="http://facebook.com/" />
                            <SocialIcon style={{marginTop:"5%", marginBottom:"5%", marginLeft:"5%"}} url="http://google.com/" />
                            <SocialIcon style={{marginTop:"5%", marginBottom:"5%", marginLeft:"5%"}} url="http://twitter.com/"  />
                        </Col>
                    </Row>
                    <div style={{marginLeft:"10%", marginRight:"10%", marginTop:"2%"}}>
                    <h2 className="separator"><span style={{ marginRight:"3%", border:"1px solid #D3D3D3", borderRadius:"80px" }}>OR</span></h2>
                    </div>
                    <Row style={{margin:"0px", padding:"0px"}}>
                        <Col style={{marginTop:"2%", marginLeft:"10%", marginRight:"5%", marginBottom:"3%"}} md={{ span: 6, offset: 1 }}>
                            <Container style={{marginLeft:"31%", borderRadius: "10px", border: "1px solid #D3D3D3"}}>
                                <Row style={{marginTop:"2%",marginBottom:"5%"}}>
                                    <Col md={{span:6, offset:3}}>
                                        <div style={{marginLeft:this.state.show_profile_photo_rm_button?"30%":"35%"}}>{imagePreview}
                                        {this.state.show_profile_photo_rm_button?<OverlayTrigger placement="top"
                                        delay={{ show: 250, hide: 400 }} overlay={this.renderTooltip()}><Button size="sm" style={{marginBottom:"31%",marginLeft:"2%",border:"none"}} variant="outline-danger" onClick={() => this.removeProfilePhoto()}><FaTimes/></Button></OverlayTrigger>:''}
                                         </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form onSubmit={this.onSubmit}>
                                            <Row style={{margin:"0px", padding: "0px"}}>
                                                <Col>
                                                    <Form.Group controlId="username">
                                                        <Form.Label>Username</Form.Label>
                                                            <Form.Control noValidate className={formErrors.username.length > 0 ? "error" : null} required  name="username" value={this.state.username} type="input" onChange={this.onChange} placeholder="Enter username" />
                                                            {formErrors.username.length > 0 && (
                                                                <span className="errorMessage">{formErrors.username}</span>
                                                            )}
                                                    </Form.Group>  
                                                </Col>
                                                <Col>
                                                    <Form.Group controlId="email">
                                                        <Form.Label>Email address</Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Prepend>
                                                                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                                                </InputGroup.Prepend>
                                                                    <Form.Control className={formErrors.email.length > 0 ? "error" : null} noValidate required name="email" value={this.state.email} type="email" onChange={this.onChange} placeholder="Enter email" />
                                                            </InputGroup>
                                                            {formErrors.email.length > 0 && (
                                                                        <span className="errorMessage">{formErrors.email}</span>
                                                            )}
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row style={{margin:"0px", padding: "0px"}}>
                                                <Col>
                                                    <Form.Group controlId="country" placeholder="Select Country">
                                                        <Form.Label>Country</Form.Label>
                                                            <Form.Control as="select" name="country" value={this.state.country} onChange={this.onChange}>
                                                                <option value="0" disabled>Select Country</option>
                                                                {this.state.country_list.map(item => {
                                                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                                                })}
                                                                {formErrors.email.length > 0 && (
                                                                    <span className="errorMessage">{formErrors.email}</span>
                                                                )}
                                                            </Form.Control>   
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group controlId="gender" placeholder="Select Gender">
                                                        <Form.Label>Gender</Form.Label>
                                                            <Form.Control name="gender" as="select" value={this.state.gender} onChange={this.onChange}>
                                                                <option value='0' disabled>Select Gender</option>
                                                                <option value='Male'>Male</option>
                                                                <option value='Female'>Female</option>
                                                            </Form.Control>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row style={{margin:"0px", padding:"0px"}}>
                                                <Col>
                                                    <Form.Group controlId="profilephoto">
                                                            <Form.File ref={ref=> this.profilePhotoInput = ref} id="profile_photo" label="Profile Image" onChange={this.handleProfileImageChange} />   
                                                        </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Form.Group controlId="password">
                                                        <Form.Label>Password</Form.Label>
                                                            <Form.Control className={formErrors.password.length > 0 ? "error" : null} noValidate required  name="password" value={this.state.password} type="password" onChange={this.onChange} placeholder="Enter Password" />
                                                            {formErrors.password.length > 0 && (
                                                                <span className="errorMessage">{formErrors.password}</span>
                                                            )}
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group controlId="confirm_password">
                                                        <Form.Label>Confirm Password</Form.Label>
                                                            <Form.Control required  name="confirm_password" value={this.state.confirm_password} type="password" onChange={this.onChange} placeholder="Confirm Password" />
                                                            {formErrors.confirm_password_msg.length > 0 && (
                                                                <span className="errorMessage">{formErrors.confirm_password_msg}</span>
                                                            )}
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row style={{margin:"0px", padding:"0px"}}>
                                                <Button style={{ marginBottom:this.state.isValid?"25px":"4px", marginTop: "20px"}} disabled={this.state.submit_disable} block variant="primary" type="submit">
                                                    Sign Up
                                                </Button>                                                   
                                            </Row>
                                            {this.state.isValid?'':<Row style={{margin:"0px", padding:"0px"}}>
                                                <Col style={{marginTop:"3%", padding:"0px"}}>
                                                <Alert  variant="danger" style={{padding:"1% 1% 1% 20%"}}>
                                                    Some of your fields are incorrect.
                                                </Alert>
                                                </Col>
                                            </Row>}      
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </div>
            )
     }
  }
}

export default SignUp