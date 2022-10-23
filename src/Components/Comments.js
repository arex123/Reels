import { Avatar, CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { database } from "../firebase";
export default function Comments({postData}){
    const [comments,setComments] = useState(null)

    // console.log("postdata :"+JSON.stringify(postData))
    useEffect(()=>{

        (async()=>{

            let arr=[]
            for(let i=0;i<postData.postcomments.length;i++){
                let data = await database.comments.doc(postData.postcomments[i]).get()
                arr.push(data.data())
            }
            setComments(arr)

        })();

    },[postData])


    return (
        <div>
            {
                comments==null? <CircularProgress/>:
                <>{
                    comments.map((comment,index)=>(
                        <div style={{display:'flex'}}>
                            <Avatar src={comment.uProfileImage}/>
                            <p>&nbsp;&nbsp;<span style={{fontWeight:'bold'}}>{comment.uName}</span>&nbsp;&nbsp;{comment.text}</p>
                        </div>
                    ))}
                </>
            }

        </div>
    )
}