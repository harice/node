'use strict';

import createNewPost from './routes/createNewPost';
import fetchPosts from './routes/fetchPosts';
import updatePost from './routes/updatePost';
import deletePost from './routes/deletePost';


exports.register = (server, options, next) => {
  server.route(createNewPost);
  server.route(fetchPosts);
  server.route(updatePost);
  server.route(deletePost);

  next();
}

exports.register.attributes = {
  name: 'post',
}
