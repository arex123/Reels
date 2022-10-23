import React, { useEffect, useState } from 'react'
import { Avatar, CircularProgress } from '@mui/material'
import { database } from '../firebase'
import Videos from './Videos';
import './Posts.css'
import Likes from './Likes';
import { ChatBubble } from '@material-ui/icons';
import { Dialog } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Likes2 from './Likes2';
import AddComment from './AddComment';
import Comments from './Comments';

export default function Posts({ userData }) {
    const [posts, setPosts] = useState(null);

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
        let postArr = []
        const unsub = database.posts.orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
            postArr = []
            querySnapshot.forEach((doc) => {
                let data = { ...doc.data(), postId: doc.id }
                postArr.push(data)
            })
            setPosts(postArr)
        })
        return unsub;
    }, [])

    return (
        <div>
            {
                posts == null || userData == null ? <CircularProgress /> :
                    <div className='video-container'>
                        {
                            posts.map((post, index) => (
                                <React.Fragment key={index}>
                                    <div className='videos'>
                                        <Videos src={post.postUrl} />
                                        <div className='fa' style={{ display: 'flex' }}>

                                            <Avatar src={userData.profileUrl} />
                                            <h4>{userData.fullname}</h4>

                                        </div>
                                        <Likes userData={userData} postData={post} />

                                        <ChatBubble className="comment-icon" onClick={() => handleClickOpen(post.postId)} />
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
                                                    <Card className='card1' style={{padding:'1rem'}}>
                                                        <Comments postData={post}/>
                                                        
                                                    </Card>
                                                    <Card variant='outlined' className='card2'>
                                                        <Typography  style={{padding:'0.4rem'}}>{post.postlikes.length==0?'Liked by nobody':`Liked by ${post.postlikes.length} users`}</Typography>                                                       
                                                        <div style={{display:'flex'}}>
                                                            <Likes2 userData={userData} postData={post} style={{display:'flex', alignItems:'center', justifyContent:'center' }} />  
                                                            <AddComment style={{display:'flex', alignItems:'center', justifyContent:'center' }} userData={userData} postData={post} />                                                         
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
            }
        </div>
    )
}