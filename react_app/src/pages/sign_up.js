import React, {Component} from 'react'
import Loading from '../components/Loading'
import {Redirect} from 'react-router-dom'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import '../static/css/custom.css'
import img_avatar_male from '../static/images/img_avatar_male.png'
import img_avatar_female from '../static/images/img_avatar_female.png'
import profile_photo_default from '../static/images/profile_photo_default.png'
import {FaArrowLeft, FaTimes, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import {Alert, Button, Container, Row, Col, Tooltip, OverlayTrigger, Spinner} from 'react-bootstrap'
import axios from 'axios'
import { SocialIcon } from 'react-social-icons';
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import {user_created_success, spinner_overlay} from '../redux'
import {connect} from 'react-redux'
import { trackPromise } from 'react-promise-tracker';
import store from '../redux/store'

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
        this.dispatch = this.props.dispatch;
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
            user_created_alert:false,
            show_password_new:true,
            show_password_confirm:true,
            overlay:false,
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
        this.signup = this.signup.bind(this);
    }

    signup(res, provider) {
        let random_str = this.randomId(5);
        let store_overlay = store.getState().session.spinner_overlay;
        this.setState({
            overlay:store_overlay
        })
        if(this.state.overlay){
            document.getElementById("overlay").style.display = "block";
        }
        let post_data = {};
        if(provider === "Google"){
            post_data = {
                username: (res.profileObj.givenName+res.profileObj.familyName).toLowerCase()+random_str,
                email: res.profileObj.email,
                profile_picture_url: res.profileObj.imageUrl,
                ProviderId: "Google",
                sso:true
            }
        }else{
            post_data = {
                email:res.email,
                username:res.name.split(" ").join("").toLowerCase()+random_str,
                gender:res.gender,
                profile_picture_url:res.picture.data.url,
                country:res.location.location.country,
                ProviderId: "Facebook",
                sso:true
            }
        }
        trackPromise(
        axios.post('/signup', {"post_data":post_data}).then(response => {
            if(response.data.ok){
                let msg = response.data.msg;
                this.setState({
                    overlay:false
                })
                this.dispatch(spinner_overlay(false))
                this.dispatch(user_created_success())
                this.props.history.push('/')
            }else{
                console.log("Error")
            }  
        }).catch(error => {
            console.log(error)
        }));
    };

    randomId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
     
    renderTooltip() {
        return (
          <Tooltip id="button-tooltip">
            Remove Profile Image
          </Tooltip>
        );
      }
    
    passwordVisiblityToggle = (id, type) => {
        let password = document.getElementById(id);
        let state = type === "new"?this.state.show_password_new:this.state.show_password_confirm;
        if(type === "new"){
            this.setState({
                show_password_new: !state
            })
        }else{
            this.setState({
                show_password_confirm: !state
            })
        }
        password.type =  password.value && password.value.length > 0 && state?'text':'password';
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
        let store_overlay = store.getState().session.spinner_overlay;
        this.setState({
            overlay:store_overlay
        })
        if(this.state.overlay){
            document.getElementById("overlay").style.display = "block";
        }
        trackPromise(
            axios.get('https://restcountries.eu/rest/v2/all').then(response => {
            let country_data = [];
            response.data.map((item, i) => {
                country_data.push({"id":i, "name":item.name})
            })
            this.setState({
                country_list:country_data,
                overlay:false
            })
            this.dispatch(spinner_overlay(false))

        }).catch(error => {
            console.log(error)
        }));
    }

    render(){
        const responseGoogle = (response) => {             
            console.log("Google")      
            this.signup(response, "Google");
        }
        const responseFacebook = (response) => {
            console.log("FB")
            this.signup(response, "FaceBook");
          }
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
                    <div id="overlay">
                        <Loading/>
                    </div>
                    <Row style={{margin:"0px", padding:"0px"}}>
                        <Col md={{ span: 5, offset: 4 }}>
                        <div style={{marginTop:"3%", marginLeft:"18%"}}>    
                            <GoogleLogin
                                scope='https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.gender.read'
                                clientId={process.env.REACT_APP_GOOGLE_ID}
                                buttonText={<span style={{marginRight: "15px"}}>Signup with Google</span>}
                                className="googleLogin"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}>
                            </GoogleLogin>
                        </div>
                        </Col>   
                        <Col md={{ span: 3 }}>
                            <Button onClick={() => this.props.history.push("/")} style={{ marginTop: "5%", "marginLeft":"60%"}} size="sm" variant="primary">
                                <span>Back to Login</span> <FaArrowLeft style={{paddingLeft:"2px", marginBottom:"2px"}}/>
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{margin:"5px 0px 0px 0px", padding:"0px"}}>
                        <Col className="fbLogin" md={{ span: 7, offset: 3 }}>
                            <div style={{marginLeft:"27%"}}>
                            <FacebookLogin
                                size="small"
                                textButton={<span style={{marginLeft: "12px"}}>Signup with Facebook</span>}
                                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                                fields="name,email,gender,picture,hometown,location{location}"
                                callback={responseFacebook}     
                                icon={<FaFacebook style={{float:"left", padding:"0px",margin:"3px 0px 4px 5px"}}/>}
                            />
                            </div>
                        </Col>   
                    </Row>
                    <div style={{marginLeft:"10%", marginRight:"10%", marginTop:"3%"}}>
                    <h2 className="separator"><span style={{ marginRight:"3%", border:"1px solid #D3D3D3", borderRadius:"80px"}}>OR</span></h2>
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
                                                <Col md={5}>
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
                                                                    <InputGroup.Text id="email_prepend">@</InputGroup.Text>
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
                                                                    return <option key={item.id} value={item.name}>{item.name}</option>
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
                                                                <option value='male'>Male</option>
                                                                <option value='female'>Female</option>
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
                                                            <InputGroup>
                                                            <Form.Control className={formErrors.password.length > 0 ? "error" : null} noValidate required  name="password" value={this.state.password} type="password" onChange={this.onChange} placeholder="Enter Password" />
                                                            <InputGroup.Append>
                                                                <InputGroup.Text className="cursorPointer" onClick={() => this.passwordVisiblityToggle("password", "new")} id="confirm_password_append">{this.state.show_password_new?<FaEye style={{color:"#007BFF"}}/>:<FaEyeSlash style={{color:"#007BFF"}}/>}</InputGroup.Text>
                                                            </InputGroup.Append>
                                                            </InputGroup>
                                                            {formErrors.password.length > 0 && (
                                                                <span className="errorMessage">{formErrors.password}</span>
                                                            )}
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group controlId="confirm_password">
                                                        <Form.Label>Confirm Password</Form.Label>
                                                            <InputGroup>
                                                            <Form.Control required  name="confirm_password" value={this.state.confirm_password} type="password" onChange={this.onChange} placeholder="Confirm Password" />
                                                            <InputGroup.Append>
                                                                <InputGroup.Text className="cursorPointer" onClick={() => this.passwordVisiblityToggle("confirm_password", "confirm")} id="confirm_password_append">{this.state.show_password_confirm?<FaEye style={{color:"#007BFF"}}/>:<FaEyeSlash style={{color:"#007BFF"}}/>}</InputGroup.Text>
                                                            </InputGroup.Append>
                                                            </InputGroup>
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

export default connect()(SignUp)