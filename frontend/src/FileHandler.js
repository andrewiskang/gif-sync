import React, { Component } from 'react'
import axios from 'axios'

class FileHandler extends Component {
  constructor(props) {
    super(props)

    this.initialState = {
      loaded: {
        videoFile: 0,
        audioFile: 0,
      }
    }

    this.state = this.initialState
  }

  // deletes previously uploaded file (if uploaded) and sets state to new file
  handleSelectedFile = event => {
    const { loaded } = this.state
    const files = event.target.files
    const fileType = event.target.name

    /*
    if (loaded[fileType] === 100) {
      axios.delete('http://localhost:8000/delete/'+this.props.files[fileType].name)
    }
    */
    this.props.handleFileSelect(fileType, files[0])
    this.setState({
      loaded: {
        ...loaded,
        [fileType]: 0,
      }
    })
  }

  handleUpload = event => {
    const { loaded } = this.state
    const { files } = this.props
    const fileType = event.target.name

    if (files[fileType]) {
      const endpoint = `http://localhost:8000/upload/${fileType}`
      const data = new FormData()
      data.append('file', files[fileType], files[fileType].name)
      axios
        .post(endpoint, data, {
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: {
                ...loaded,
                [fileType]: (ProgressEvent.loaded / ProgressEvent.total*100),
              }
            })
          },
        })
        .then(res => {
          console.log(res.statusText)
        })
    }
  }

  handleConvert = async event => {
    const { loaded } = this.state
    const { files, handleFileSelect } = this.props

    if (loaded['videoFile'] && loaded['audioFile']) {
      const endpoint = 'http://localhost:8000/convert'
      await axios
        .get(endpoint)
        .then(res => {
          console.log(res.statusText)
        })
      handleFileSelect('convertedFile', 'loaded')
    }
  }

  render() {
    const { loaded } = this.state
    
    return (
      <div>
        <input
          type="file"
          name="videoFile"
          onChange={this.handleSelectedFile} />
        <button name="videoFile" onClick={this.handleUpload}>Upload Video</button>
        <div> {Math.round(loaded.videoFile,2) } %</div>
        
        <input
          type="file"
          name="audioFile"
          onChange={this.handleSelectedFile} />
        <button name="audioFile" onClick={this.handleUpload}>Upload Audio</button>
        <div> {Math.round(loaded.audioFile,2) } %</div>

        <button name="convert" onClick={this.handleConvert}>Convert!</button>
      </div>
    )
  }
}

export default FileHandler;