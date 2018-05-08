const axios = require('axios');

module.exports = {
  fetchPopularRepos: function(language) {
    const encodedURI = window.encodeURI(
      `https://api.github.com/search/repositories?q=stars:>1+language: ${language} &sort=stars&order=desc&type=Repositories`
    );

    return axios.get(encodedURI).then((response) => {
      return response.data.items;
    });
  }
};