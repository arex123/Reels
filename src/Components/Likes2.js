import React, { useEffect,useState } from 'react'
import { Favorite } from '@material-ui/icons'
import { database } from '../firebase';

export default function Likes({userData,postData}){
    const [like,setLike] = useState(null)
    useEffect(()=>{
        let check = postData.postlikes.includes(userData.userId)?true:false;
        setLike(check)
        console.log("check "+check)
    },[postData])

    const handleLike=()=>{
        console.log("inside handle like "+like)
        if(like==true){
            //we need to change like to false, so remove user from this posts like array

            let narr = postData.postlikes.filter((element)=>element!=userData.userId)
            database.posts.doc(postData.postId).update({
                postlikes:narr
            })

        }else{
            let narr = [...postData.postlikes,userData.userId]
            database.posts.doc(postData.postId).update({
                postlikes:narr
            })

        }
    }

    return ( 
        <div>
            {
                like!=null?
                <>
                {
                    like==true?<Favorite style={{padding:"1rem", paddingTop:"0.5rem"}} className={`like`} onClick={handleLike}/>:<Favorite className={`unlike2`} style={{padding:"1rem", paddingTop:"0.5rem"}} onClick={handleLike}/>
                }
                </>:
                <></>
            }
        </div>
    )
  
}