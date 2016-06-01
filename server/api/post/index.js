'use strict';

import createNewPost from './routes/createNewPost';
import fetchPosts from './routes/fetchPosts';
import updatePost from './routes/updatePost';
import deletePost from './routes/deletePost';
import likePost from './routes/likePost';

import uploadAvatarImage from './routes/uploadAvatarImage';

exports.register = (server, options, next) => {
  server.route(createNewPost);
  server.route(fetchPosts);
  server.route(likePost);
  server.route(updatePost);
  server.route(deletePost);

  server.route(uploadAvatarImage);

  next();
}

exports.register.attributes = {
  name: 'post',
}
