'use strict';

import Confidence from 'confidence';
import AppConfig from './config';

const criteria = {
  env: process.env.NODE_ENV
};

const manifest = {
  $meta: 'Our main server manifest',
  server: AppConfig.get('/server'),
  connections: [{
    host: AppConfig.get('/connection/host'),
    port: AppConfig.get('/connection/port')
  }],
  registrations: [
    { plugin: 'inert' },
    { plugin: 'vision' },
    {
      plugin: {
        register: 'good',
        options: AppConfig.get('/logging')
      }
    },
    {plugin: 'hapi-auth-jwt2'},
    {
      plugin: {
        register: './sequelize',
        options: AppConfig.get('/db/sequelize')
      }
    },
    { plugin: './common' },
    { plugin: './api/auth' },
    { plugin: './api/user' },
    { plugin: './api/post' },
    {
      plugin: {
        register: 'hapi-swagger',
        options: AppConfig.get('/api/swagger')
      }
    }
  ]
};

const store = new Confidence.Store(manifest);

export default {
  get(key) {
    return store.get(key, criteria);
  },
  meta(key) {
    return store.meta(key, criteria);
  }
}
