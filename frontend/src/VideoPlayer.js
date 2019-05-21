import React, { Component } from 'react'

class VideoPlayer extends Component {
  constructor(props) {
    super(props)

    this.initialState = {
      
    }

    this.state = this.initialState
  }

  handleChange = event => {
    const { name, value } = event.target

    this.setState({
      [name]: value,
    })
  }
  
  submitForm = () => {
    this.props.handleSubmit(this.state)
    this.setState(this.initialState)
  }

  render() {
    const { files } = this.state

    return (
      <video width="1280" height="720" controls >
        <source src={files.videoFile} type="video/mp4">
        <source src={files.convertedFile} type="video/webm">
        Sorry, your browser doesn't support HTML5 video.
      </video>
    )
  }
}

export default VideoPlayer;