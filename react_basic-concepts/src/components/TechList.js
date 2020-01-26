import React, { Component } from 'react'
import TechItem from './TechItem'

class TechList extends Component {
  static defaultProps = {};

  state = {
    newTech: '',
    techs: []
  };

  // Executes when component appears on the screen
  componentDidMount() {
    const techs = localStorage.getItem('techs');
    if(techs) {
      this.setState({ techs: JSON.parse(techs) });
    }
  }
  // Executes everytime the props or states are updated
  componentDidUpdate(prevProps, prevState) {
    if(prevState.techs !== this.state.techs) {
      localStorage.setItem('techs', JSON.stringify(this.state.techs));
    }
  }
  // Executes when the component stop existing
  componentWillUnmount() {}

  handleInputChange = e => {
    this.setState({ newTech: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      techs: [...this.state.techs, this.state.newTech],
      newTech: '',
    });
  }

  handleDelete = (tech) => {
    this.setState({
      techs: this.state.techs.filter(t => t != tech),
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <ul>
          { this.state.techs.map(tech => (
            <TechItem
              key={tech}
              tech={tech}
              onDelete={() => this.handleDelete(tech)} 
            />
          )) }
        </ul>
        <input
          type="text"
          onChange={this.handleInputChange}
          value={this.state.newTech}
        />
        <button type="submit">Send</button>
      </form>
    );
  }
}

export default TechList;