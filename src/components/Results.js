import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import PlayerPreview from './PlayerPreview';
import Loading from './Loading';

function Profile(props) {
  const info = props.info;

  return (
    <PlayerPreview avatar={info.avatar_url} username={info.login}>
      <ul className="space-list-items">
        {/* show their name IF info.name is truthy */}
        {info.name && <li>{info.name}</li>}
        {info.location && <li>{info.location}</li>}
        {info.company && <li>{info.company}</li>}
        <li>Followers: {info.followers}</li>
        <li>Following: {info.following}</li>
        <li>Public Repos: {info.public_repos}</li>
        {info.blog && (
          <li>
            <a href={info.blog}>{info.blog}</a>
          </li>
        )}
      </ul>
    </PlayerPreview>
  );
}

Profile.propTypes = {
  info: PropTypes.object.isRequired
};

function Player(props) {
  return (
    <div>
      <h1 className="header">{props.label}</h1>
      <h3 style={{ textAlign: 'center' }}>Score: {props.score}</h3>
      <Profile info={props.profile} />
    </div>
  );
}

Player.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired
};

class Results extends React.Component {
  state = {
    winner: null,
    loser: null,
    error: null,
    loading: true
  };

  componentDidMount() {
    const players = queryString.parse(this.props.location.search);
    api
      .battle([
        players.playerOneName,
        players.playerTwoName
        // returns an array with the first player as the winner and the second as the loser
      ])
      .then((results) => {
        if (results === null) {
          return this.setState(() => {
            return {
              error:
                'Looks like there was an error. Check that both users exist on Github',
              loading: false
            };
          });
        }

        // if results came back clean
        this.setState(() => {
          return {
            error: null,
            winner: results[0],
            loser: results[1],
            loading: false
          };
        });
        // add a bind?????
      });
  }
  render() {
    const { error, winner, loser, loading } = this.state;

    if (loading === true) {
      return <Loading />;
    }

    if (error) {
      return (
        <div>
          <p>{error}</p>
          <Link to="/battle">Reset</Link>
        </div>
      );
    }

    return (
      <div className="row">
        <Player label="Winner" score={winner.score} profile={winner.profile} />
        <Player label="Loser" score={loser.score} profile={loser.profile} />
      </div>
    );
  }
}

export default Results;
