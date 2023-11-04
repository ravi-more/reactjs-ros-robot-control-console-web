import React, { Component } from 'react';
import Config from '../data/config';


class VideoStreamView extends Component {
    state = {
        connected: false,
        ros: null,
    }

    
    render() { 
        return ( <div>
            <h3>Robot Camera</h3>
            <div id='mjpeg'>
            <img id="my_image" src={`${Config.VIDEO_STREAM_URL}`} style={{height: '100%', width: '100%', objectfit: 'contain'}} alt="loading..." ></img>
            </div>
        </div> );
    }
}
 
export default VideoStreamView;