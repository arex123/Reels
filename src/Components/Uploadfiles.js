import React, { useState } from 'react'
import Alert from '@mui/material/Alert';
import { Button, LinearProgress } from '@mui/material';
import MovieIcon from '@material-ui/icons/Movie';
import {v4 as uuidv4} from 'uuid'
import { database, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable,getDownloadURL } from "firebase/storage";

export default function Uploadfiles(props) {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleChange=async(file)=>{
        console.log("file "+file)
        if(file==null){
            console.log('file not found')
            setError("Please select a file first")
            setError(()=>{
                setError('')
            },2000)
            return;
        }

        if(file.size/(1024*1024)>100){
            console.log('file is big')
            setError('This video is very big');
            setTimeout(()=>{
                setError('')
            },2000);
            return;
        }

        //now we will upload the selected reel/video from user
        setLoading(true)
        
        let uid = uuidv4()
        const storage = getStorage();
        const storateRef = ref(storage,'posts/'+uid+'/'+file.name)

        // const uploadTask = storage.ref(`/posts/${uid}/${file.name}`).put(file);
        const uploadTask = uploadBytesResumable(storateRef,file)
        console.log("uploadtask: "+uploadTask)
        uploadTask.on('state_changed',next,Error,complete);
        function next(snapshot){
            
            let progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            console.log(`Upload is ${progress} done.`)
        }

        function Error(error){
            console.log('inside fn2 error')
            setError(error)
            setTimeout(()=>{
                setError('')
            },2000);
            setLoading(false)
            return;
        }

        function complete(){
            console.log('inside fn3')
            getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
                console.log("url: "+url)
                let obj = {
                    postlikes:[],
                    postcomments:[],
                    postId:uid,
                    postUrl:url,
                    userName:props.user.fullname,
                    userProfile:props.user.profileUrl,
                    userId:props.user.userId,
                    createdAt:database.getTimeStamp()
                }

                database.posts.add(obj).then(async(ref)=>{
                    console.log('79')
                    let res = await database.users.doc(props.user.userId).update({
                        postIds: props.user.postIds!=null? [...props.user.postIds,ref.id]:[ref.id]
                    })
                }).then(()=>{
                    console.log('80')

                    setLoading(false)
                }).catch((err)=>{
                    console.log('81')

                    setError(err)
                    setTimeout(()=>{
                        setError('')
                    },2000)
                    setLoading(false)
                })




            })
            
        }



    }

    return (
        <div style={{marginTop:'5rem', marginBottom:'1rem'}}>
            {
                error != '' ? <Alert severity="warning">{error}</Alert> :
                    <>
                        <input type='file' accept="video/*" onChange={(e)=>handleChange(e.target.files[0])} id="upload-input" style={{ display: 'none' }} />

                        <label htmlFor='upload-input' >
                            <Button variant='outlined' color='secondary' component='span' disabled={loading}>
                                <MovieIcon />&nbsp;Upload Video
                            </Button>
                        </label>

                        {loading && <LinearProgress color="secondary" style={{ marginTop: '3%' }} />}
                    </>
            }
        </div>
    )
}