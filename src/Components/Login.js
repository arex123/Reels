import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./Login.css";
import insta from "../Assets/insta.jpg";
// import { makeStyles } from "@mui/styles";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import CloudUploadIcons from "@material-ui/icons/CloudUpload";
import { Link } from "react-router-dom";
import carbg from "../Assets/carbg.jpg";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  Image
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import bg1 from "../Assets/bg1.jpg";
import bg2 from "../Assets/bg2.jpg";
import bg3 from "../Assets/bg3.jpg";
import {useContext} from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";



const useStyles = makeStyles({
  text1: {
    color: "grey",
    textAlign: "center"
  },
  text2: {
    textAlign: "center"
  },
  cards2: {
    height: "5vh",
    marginTop: "2%"
  }
});
export default function Login() {

  const store = useContext(AuthContext)
  console.log(store)

  const classes = useStyles();

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const {login} = useContext(AuthContext)

  const handleClick = async()=>{

    try{
      setError('')
      setLoading(true)
      let res = await login(email,password)
      setLoading(false)
      navigate('/')

    }catch(err){

      setError(err)
      setTimeout(()=>{
        setError('');
      },4000);
      setLoading(false)

    }

  }


  return (
    <div className="loginWrapper">
      <div
        className="imgCar"
        style={{
          backgroundImage: "url(" + carbg + ")",
          backgroundSize: "cover"
        }}
      >
        <div className="car">
          <CarouselProvider
            visibleSlides={1}
            totalSlides={3}
            naturalSlideWidth={238}
            naturalSlideHeight={423}
            hasMasterSpinner
            isPlaying={true}
            infinite={true}
            dragEnabled={false}
            touchEnabled={false}
          >
            <Slider>
              <Slide index={0}>
                <Image src={bg1} />
              </Slide>
              <Slide index={1}>
                <Image src={bg2} />
              </Slide>
              <Slide index={2}>
                <Image src={bg3} />
              </Slide>
            </Slider>
          </CarouselProvider>
        </div>
      </div>
      <div className="loginCard">
        <Card variant="outlined">
          <div className="insta-logo">
            <img src={insta} alt="" />
          </div>
          <CardContent>
            {error!='' && (
              <Alert severity="warning">
                {error}
              </Alert>
            )}

            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              fullWidth={true}
              size="small"
              margin="dense"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              fullWidth={true}
              size="small"
              margin="dense"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Typography
              className={classes.text2}
              color="primary"
              variant="subtitle1"
            >
              Forget Password?
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="contained" fullWidth={true} onClick={handleClick}>
              Log in
            </Button>
          </CardActions>
        </Card>

        <Card variant="outlined" className={classes.card2}>
          <CardContent>
            <Typography className={classes.text1} variant="subtitle1">
              Don't Have Account ?
              <Link to="/signup" style={{ textDecoration: "none" }}>
                Sign Up
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
