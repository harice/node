'use strict';

import Glue from 'glue';
import Manifest from './manifest';

const composeOptions = {
  relativeTo: __dirname
};

const composer = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);

if (process.env.NODE_ENV != 'test') {
  composer((err, server) => {
    if (err) throw err;
    server.start(() => {
      server.log(['server', 'info'], 'Server started at ' + server.info.uri);
    });
  });
}

export default composer;
