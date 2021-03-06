import React, { Component } from 'react'
import PropTypes from 'prop-types'

function TechItem({ tech, onDelete }) {
  return (
    <li key={tech}>
      {tech}
      <button onClick={onDelete} type="button">Remove</button>
    </li>
  );
}

TechItem.defaultProps = {};

TechItem.propTypes = {
  tech: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default TechItem;