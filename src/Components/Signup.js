import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./Signup.css";
import insta from "../Assets/insta.jpg";
// import { makeStyles } from "@mui/styles";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import CloudUploadIcons from "@material-ui/icons/CloudUpload";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { database, storage } from "../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const useStyles = makeStyles({
  text1: {
    color: "grey",
    textAlign: "center"
  },
  cards2: {
    height: "5vh",
    marginTop: "2%"
  }
});

export default function Signup() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const { signup } = useContext(AuthContext);

  const handleClick = async () => {
    if (file == null) {
      setError("Please upload profile picture");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    try {
      // 
      setError("");
      setLoading(true);
      let userObj = await signup(email, password);
      let uid = userObj.user.uid;
      console.log('user is created: ' + uid)


      //uploading file/picture to firebase 'storage' and then storing this pic url to 'firebase storage'

      const storage = getStorage();

      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: 'image/jpeg'
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, 'images/' + uid+file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {

          console.log("f2 error "+error);

          setError("Error while uploading Task/Something went wrong");
          setTimeout(() => {
            setError("");
          }, 2000);
          setLoading(false);
          return;

          // // A full list of error codes is available at
          // // https://firebase.google.com/docs/storage/web/handle-errors
          // switch (error.code) {
          //   case 'storage/unauthorized':
          //     // User doesn't have permission to access the object
          //     break;
          //   case 'storage/canceled':
          //     // User canceled the upload
          //     break;

          //   // ...

          //   case 'storage/unknown':
          //     // Unknown error occurred, inspect error.serverResponse
          //     break;
          // }
        },
        () => {
          console.log("f3-success");
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            console.log(downloadURL);
            database.users.doc(uid).set({
              email: email,
              userId: uid,
              fullname: name,
              profileUrl: downloadURL,
              createdAt: database.getTimeStamp()
            });
          });

        setLoading(false);
        console.log("done1");
        navigate("/");
        console.log("done2");
        
        }
      );





      // const uploadTask = storage.ref(`/users/${uid}/ProfileImage`).put(file);
      // const uploadTask = storage.child(`/users/${uid}/ProfileImage`).put(file, metadata);

      // console.log("uploadtask: " + uploadTask)
      // uploadTask.on("state_changed", fn1, fn2, fn3);

      // function fn1(snapshot) {
      //   console.log("f1 ");
      //   let progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
      //   console.log(`Upload is ${progress} done.`);

      //   switch (snapshot.state) {
      //     case 'paused': // or 'paused'
      //       console.log('Upload is paused');
      //       break;
      //     case 'running': // or 'running'
      //       console.log('Upload is running');
      //       break;
      //       default:
      //         console.log('default f1')
      //   }
      //   console.log('end of fn1')
      //   console.log(`Upload is ${progress} done.`);


      // }

      // function fn2(error) {
      //   console.log("f2 error");

      //   // setError(error);
      //   // setTimeout(() => {
      //   //   setError("");
      //   // }, 2000);
      //   // setLoading(false);
      //   // return;
      //   switch (error.code) {
      //     case 'storage/unauthorized':
      //       // User doesn't have permission to access the object
      //       console.log("// User doesn't have permission to access the object")
      //       break;

      //     case 'storage/canceled':
      //       // User canceled the upload
      //       console.log("// User canceled the upload")
      //       break;

      //     case 'storage/unknown':
      //       // Unknown error occurred, inspect error.serverResponse
      //       console.log('Unknown error occurred, inspect error.serverResponse')
      //       break;
      //   }
      // }

      // function fn3() {
      //   console.log("f3-success");
      //   // uploadTask.snapshot.ref.getDownloadURL().then((url) => {
      //   uploadTask.snapshot.downloadURL().then((url) => {
      //     console.log(url);
      //     database.users.doc(uid).set({
      //       email: email,
      //       userId: uid,
      //       fullname: name,
      //       profileUrl: url,
      //       createdAt: database.getTimeStamp()
      //     });
      //   });
      //   setLoading(false);
      //   console.log("done");
      //   history.put("/");
      // }
    } catch (err) {
      console.log("error inside catch block ")
      setError(err);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <div className="signupWrapper">
      <div className="signupCard">
        <Card variant="outlined">
          <div className="insta-logo">
            <img src={insta} alt="" />
          </div>
          <CardContent>
            <Typography className={classes.text1} variant="subtitle1">
              Sign up to see photos and videos of your friends
            </Typography>

            {error != "" && <Alert severity="warning">{error}</Alert>}

            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              fullWidth={true}
              size="small"
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              fullWidth={true}
              size="small"
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Full Name"
              variant="outlined"
              fullWidth={true}
              size="small"
              margin="dense"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              fullWidth={true}
              margin="dense"
              variant="outlined"
              size="small"
              startIcon={<CloudUploadIcons />}
              component="label"
            >
              Upload Profile Picture
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant="contained"
              fullWidth={true}
              disabled={loading}
              onClick={handleClick}
            >
              Sign up
            </Button>
          </CardActions>
          <CardContent>
            <Typography className={classes.text1} variant="subtitle1">
              By signing in you agree with terms and conditions
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" className={classes.card2}>
          <CardContent>
            <Typography className={classes.text1} variant="subtitle1">
              Having an Account ?
              <Link to="/login" style={{ textDecoration: "none" }}>
                Sign In
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
