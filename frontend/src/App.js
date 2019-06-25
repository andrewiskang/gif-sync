import React, { Component } from 'react'
import FileHandler from './FileHandler'
import { Player } from 'video-react'
import axios from 'axios'


class App extends Component {
  state = {
    files: {
      videoFile: null,
      audioFile: null,
      convertedFile: null,
    },
  }

  handleFileSelect = (fileType, file) => {
    this.setState({
      files: {
        ...this.state.files,
        [fileType]: file,
      }
    })
  }

  componentWillMount() {
    axios.delete('http://localhost:8000/refresh')
  }

  render() {
    const { files } = this.state
    return (
      <div className="App">
        <FileHandler files={files} handleFileSelect={this.handleFileSelect} />
        { files.convertedFile && <Player playsInline loop
          src="http://localhost:8000/video" type="video/mp4"/>
        }
      </div>
    )
  }
}


export default App