import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Dont understand why we need to listen for changes to the input when we aren't using the input until the the submit button is clicked

function PlayerPreview(props) {
  return (
    <div>
      <div className="column">
        <img
          className="avatar"
          src={props.avatar}
          alt={`Avatar for ${props.username}`}
        />
        <h2 className="username">@{props.username}</h2>
      </div>
      <button
        className="reset"
        // use bind to return a brand new function
        onClick={props.onReset.bind(null, props.id)}
      >
        Reset
      </button>
    </div>
  );
}

PlayerPreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired
};

class PlayerInput extends React.Component {
  state = {
    username: ''
  };

  handleChange = (event) => {
    const value = event.target.value;

    this.setState(() => {
      return {
        username: value
      };
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.onSubmit(this.props.id, this.state.username);
  };

  render() {
    return (
      <form className="column" onSubmit={this.handleSubmit}>
        <label className="header" htmlFor="username">
          {this.props.label}
        </label>
        <input
          id="username"
          placeholder="github"
          type="text"
          autoComplete="off"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <button
          className="button"
          type="submit"
          disabled={!this.state.username}
        >
          Submit
        </button>
      </form>
    );
  }
}

PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

class Battle extends React.Component {
  state = {
    playerOneName: '',
    playerTwoName: '',
    playerOneImage: null,
    playerTwoImage: null
  };

  // If ID is player one, then update the player one username and image, otherwise update player two's username and image
  handleSubmit = (id, username) => {
    this.setState(() => {
      let newState = {};
      newState[id + 'Name'] = username;
      newState[id + 'Image'] = `https://github.com/${username}.png?size=200`;
      return newState;
    });
  };

  handleReset = (id) => {
    this.setState(() => {
      let newState = {};
      newState[id + 'Name'] = '';
      newState[id + 'Image'] = null;
    });
  };

  render() {
    const match = this.props.match;
    const playerOneName = this.state.playerOneName;
    const playerTwoName = this.state.playerTwoName;
    const playerOneImage = this.state.playerOneImage;
    const playerTwoImage = this.state.playerTwoImage;

    return (
      <div>
        <div className="row">
          {!playerOneName && (
            <PlayerInput
              id="playerOne"
              label="Player One"
              onSubmit={this.handleSubmit}
            />
          )}

          {playerOneImage !== null && (
            <PlayerPreview
              avatar={playerOneImage}
              username={playerOneName}
              onReset={this.handleReset}
              id="playerOne"
            />
          )}

          {playerTwoImage !== null && (
            <PlayerPreview
              avatar={playerTwoImage}
              username={playerTwoName}
              onReset={this.handleReset}
              id="playerTwo"
            />
          )}

          {!playerTwoName && (
            <PlayerInput
              id="playerTwo"
              label="Player Two"
              onSubmit={this.handleSubmit}
            />
          )}
        </div>

        {playerOneImage &&
          playerTwoImage && (
            <Link
              className="button"
              to={{
                pathname: `${match.url}/results`,
                search: `?playerOneName=${playerOneName}&playerTwoName=${playerTwoName}`
              }}
            >
              Battle
            </Link>
          )}
      </div>
    );
  }
}

export default Battle;
