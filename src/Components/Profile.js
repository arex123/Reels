import { CircularProgress, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { database } from '../firebase'
import Navbar from './Navbar'
import './Profile.css'
import useMediaQuery from '@mui/material/useMediaQuery';
import './Posts.css'
import Likes from './Likes';
import { ChatBubble } from '@material-ui/icons';
import { Dialog } from '@material-ui/core';
import Card from '@mui/material/Card';
import Likes2 from './Likes2';
import AddComment from './AddComment';
import Comments from './Comments';
import { useTheme } from '@mui/material/styles';

export default function Profile() {
    const { id } = useParams()
    const [userData, setUserData] = useState(null)
    const [posts, setPosts] = useState(null)
    const [open, setOpen] = useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const handleClickOpen = (id) => {
        setOpen(id);
    };
    
    const handleClose = () => {
        setOpen(null);
    };

    useEffect(() => {
        database.users.doc(id).onSnapshot((snap) => {
            setUserData(snap.data())
        })
    }, [id])

    useEffect(() => {

        const loadData = async()=>{

            if (userData != null) { 
                console.log(userData.postIds.length)
                let parr = []
                for (let i = 0; i < userData.postIds.length; i++) {
                    let postData =await database.posts.doc(userData.postIds[i]).get()
                    parr.push({...postData.data(),postId:postData.id})
                }
                setPosts(parr)
            }
        }
        loadData();



    })



    return (
        <>
            {
                posts == null || userData == null ? <CircularProgress /> :
                    <>
                        <Navbar userData={userData} />
                        <div className="spacer"></div>
                        <div className="container">
                            <div className="upper-part">
                                <div className="profile-img">
                                    <img src={userData.profileUrl} />
                                </div>
                                <div className="info">
                                    <Typography variant="h5">
                                        Email:{userData.email}
                                    </Typography>
                                    <Typography variant="h6">
                                        Posts:{userData.postIds.length}
                                    </Typography>

                                </div>

                            </div>
                            <hr style={{marginTop:'3rem',marginBottom:'3rem'}}/>
                            <div className="profile-videos">
                                {
                                    posts.map((post, index) => (
                                        <React.Fragment key={index}>
                                            {/* {console.log( posts,length+" post "+ post+" hi "+index)} */}
                                            <div className='videos'>
                                                <video muted="muted" onClick={() => handleClickOpen(post.postId)}>
                                                    <source src={post.postUrl} />
                                                </video>
                                            
                                                <Dialog
                                                    fullScreen={fullScreen}
                                                    open={open == post.postId}
                                                    onClose={handleClose}
                                                    aria-labelledby="responsive-dialog-title"
                                                    fullWidth={true}
                                                    maxWidth='lg'
                                                >
                                                    <div className='modal-container'>
                                                        <div className='video-modal'>
                                                            <video autoPlay={true} muted="muted" controls>
                                                                <source src={post.postUrl} />
                                                            </video>
                                                        </div>
                                                        <div className='comment-modal'>
                                                            <Card className='card1' style={{ padding: '1rem' }}>
                                                                <Comments postData={post} />

                                                            </Card>
                                                            <Card variant='outlined' className='card2'>
                                                                <Typography style={{ padding: '0.4rem' }}>{post.postlikes.length == 0 ? 'Liked by nobody' : `Liked by ${post.postlikes.length} users`}</Typography>
                                                                <div style={{ display: 'flex' }}>
                                                                    <Likes2 userData={userData} postData={post} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                                                                    <AddComment style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} userData={userData} postData={post} />
                                                                </div>
                                                            </Card>

                                                        </div>
                                                    </div>
                                                </Dialog>
                                            </div>
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                           

                        </div>
                    </>
            }
        </>
    )
}