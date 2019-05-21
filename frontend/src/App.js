import React, { Component } from 'react'
import FileHandler from './FileHandler'
import Converter from './Converter'
import { Player } from 'video-react'


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

  render() {
    const { files } = this.state
    return (
      <div className="App">
        <FileHandler files={files} handleFileSelect={this.handleFileSelect} />
        <Converter files={files} handleFileSelect={this.handleFileSelect} />
        <Player playsInline
          poster="/assets/poster.png"
          src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
      </div>
    )
  }
}


export default App