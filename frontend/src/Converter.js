import React, { Component } from 'react'

class Converter extends Component {
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
    const { name, job } = this.state;

    return (
      <button>Convert!</button>
    );
  }
}

export default Converter;