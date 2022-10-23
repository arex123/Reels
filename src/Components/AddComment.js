import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { database } from "../firebase";

export default function AddComment({userData,postData}){
    const [text,setText] = useState("")

    const handleClick = () => {
        let obj = {
            text: text,
            uProfileImage: userData.profileUrl,
            uName: userData.fullname
        }
      
        database.comments.add(obj).then((doc)=>{
        database.posts.doc(postData.postId).update({
            postcomments:[...postData.postcomments,doc.id]
        })
       })
       setText('')

    }

    return (
        <div style={{width:'100%'}}>
            <TextField id='outlined-basic' label="Comment" variant="outlined" size="small"  style={{width:'70%'}} value={text} onChange={(e)=>setText(e.target.value)} />
            <Button variant="contained" onClick={handleClick}>Post</Button>
        </div>
    )
}