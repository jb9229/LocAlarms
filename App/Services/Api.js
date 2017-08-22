import apisauce from 'apisauce'

const create = (baseURL = 'https://api.github.com/') => {
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  });

  const getRoot = () => api.get('');
  const getRate = () => api.get('rate_limit');
  const getUser = (username) => api.get('search/users', {q: username});

  return {
    getRoot,
    getRate,
    getUser
  }
};
export const API = create();
