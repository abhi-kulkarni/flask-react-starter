import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import '../static/css/custom.css'
import img_avatar_male from '../static/images/img_avatar_male.png'
import img_avatar_female from '../static/images/img_avatar_female.png'
import profile_photo_default from '../static/images/profile_photo_default.png'
import {FaArrowLeft, FaTimes } from 'react-icons/fa';
import Button from 'react-bootstrap/Button'
import {Container, Row, Col, Tooltip, OverlayTrigger} from 'react-bootstrap'
import axios from 'axios'
import Form from 'react-bootstrap/Form'

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
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    renderTooltip() {
        return (
          <Tooltip id="button-tooltip">
            Remove Image
          </Tooltip>
        );
      }

    handleProfileImageChange = (e) => {
        e.preventDefault()
        let reader = new FileReader();
        console.log(reader)
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
        this.setState({
            redirect:true
        });
        console.log(this.state)
        e.preventDefault()
    }

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
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

        const redirect = this.state.redirect;
        let imagePreviewUrl = this.state.imagePreviewUrl;
        let imagePreview = (<img style={{width:"60px", borderRadius:"50%"}} src={profile_photo_default} />);
        if(this.state.gender === 'Male'){
            imagePreview = (<img style={{width:"60px", borderRadius:"50%"}} src={img_avatar_male} />);
        }else if(this.state.gender === 'Female'){
            imagePreview = (<img style={{width:"60px", borderRadius:"50%"}}  src={img_avatar_female} />);
        }    
        if (imagePreviewUrl) {
            imagePreview = (<img style={{width:"60px", borderRadius:"50%"}} src={imagePreviewUrl} />);
        }
        if(redirect){
            return <Redirect to="/login" />
        }else{        
            return (
                <div>
                    <Row style={{margin:"0px", padding:"0px"}}>
                        <Col style={{marginTop:"2%", marginRight:"5%"}} md={{ span: 4, offset: 3 }}>
                            <Container style={{marginLeft:"25%", borderRadius: "10px", border: "1px solid #D3D3D3"}}>
                                <Row style={{marginTop:"4%",marginBottom:"5%"}}>
                                    <Col md={4} style={{marginTop:this.state.show_profile_photo_rm_button?"2%":"", marginLeft:"2%"}}><h5><b>Sign Up</b></h5></Col>
                                    <Col md={{span:4, offset:3}}>
                                        <div style={{marginLeft:this.state.show_profile_photo_rm_button?"16%":"60%"}}>{imagePreview}
                                        {this.state.show_profile_photo_rm_button?<OverlayTrigger placement="top"
                                        delay={{ show: 250, hide: 400 }} overlay={this.renderTooltip()}><Button size="sm" style={{marginBottom:"20%",border:"none"}} variant="outline-danger" onClick={() => this.removeProfilePhoto()}><FaTimes/></Button></OverlayTrigger>:''}
                                         </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form onSubmit={this.onSubmit}>
                                            <Form.Group controlId="username">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control name="username" value={this.state.username} type="input" onChange={this.onChange} placeholder="Enter username" />
                                            </Form.Group>    
                                            <Form.Group controlId="email">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control name="email" value={this.state.email} type="email" onChange={this.onChange} placeholder="Enter email" />
                                            </Form.Group>
                                            <Form.Group controlId="country" placeholder="Select Country">
                                            <Form.Label>Country</Form.Label>
                                                <Form.Control as="select" name="country" value={this.state.country} onChange={this.onChange}>
                                                    <option value="0" disabled>Select Country</option>
                                                    {this.state.country_list.map(item => {
                                                        return <option key={item.id} value={item.id}>{item.name}</option>
                                                    })}
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="gender" placeholder="Select Gender">
                                            <Form.Label>Gender</Form.Label>
                                                <Form.Control name="gender" as="select" value={this.state.gender} onChange={this.onChange}>
                                                    <option value='0' disabled>Select Gender</option>
                                                    <option value='Male'>Male</option>
                                                    <option value='Female'>Female</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="profilephoto">
                                                <Form.File ref={ref=> this.profilePhotoInput = ref} id="profile_photo" label="Profile Image" onChange={this.handleProfileImageChange} />   
                                            </Form.Group>
                                            <Form.Group controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control name="password" value={this.state.password} type="password" onChange={this.onChange} placeholder="Enter Password" />
                                            </Form.Group>
                                            <Form.Group controlId="confirm_password">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control name="confirm_password" value={this.state.confirm_password} type="password" onChange={this.onChange} placeholder="Confirm Password" />
                                            </Form.Group>
                                            <Button style={{ marginBottom:"10px", marginTop: "30px"}} block variant="primary" type="submit">
                                                Sign Up
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col md={{ span: 2, offset: 2 }}>
                            <Button onClick={() => this.props.history.push("/")} style={{ marginTop: "10%"}} size="sm" variant="primary">
                                <span>Back to Login</span> <FaArrowLeft style={{paddingLeft:"2px", marginBottom:"2px"}}/>
                            </Button>
                        </Col>
                    </Row>
                </div>
            )
     }
  }
}

export default SignUp