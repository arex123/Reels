import React from 'react'
import './Videos.css'
import ReactDOM from 'react-dom';
function Videos(props){

    const handleClick=(e)=>{
        e.preventDefault();
        e.target.muted = !e.target.muted;
    }

    const handleAutoScroll=(e)=>{
        let nextvideo = ReactDOM.findDOMNode(e.target).parentNode.nextSibling
        if(nextvideo){
            nextvideo.scrollIntoView()
            e.target.muted = true
        }
    }

    return (
        <video src={props.src} onEnded={handleAutoScroll} className='videos-styling' muted="muted" onClick={handleClick} >

        </video>
    )

}

export default Videos;
