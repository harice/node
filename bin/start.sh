#!/usr/bin/env bash

# load env vars
if [ -f .envvars ]; then
  source .envvars
else
  echo "Could not find a .envvars file. Make sure you copy the correct one from the envs directory"
  exit 1
fi

# If no DOCKER_ENV is set, die
if [ -z $DOCKER_ENV ]; then
  echo "Your .envvars file must declare a DOCKER_ENV var"
  exit 1
fi

if [ "$DOCKER_ENV" == "local" ] || [ "$DOCKER_ENV" == "development" ]; then
  if psql -lqt | cut -d \| -f 1 | grep -w $GENESIS_PROJECT_DB_NAME; then
    echo "$GENESIS_PROJECT_DB_NAME database already exists...moving on"
  else
    echo "$GENESIS_PROJECT_DB_NAME database does not exist"
    echo "...create MAIN user $GENESIS_PROJECT_DB_USER with password $GENESIS_PROJECT_DB_PASS"
    psql -c "create user \"$GENESIS_PROJECT_DB_USER\" with password '$GENESIS_PROJECT_DB_PASS'"

    echo "...create MAIN database $GENESIS_PROJECT_DB_NAME with owner $GENESIS_PROJECT_DB_USER encoding='utf8' template template0"
    psql -c "create database \"$GENESIS_PROJECT_DB_NAME\" with owner \"$GENESIS_PROJECT_DB_USER\" encoding='utf8' template template0"
  fi
fi

if [ "$DOCKER_ENV" == "local" ] || [ "$DOCKER_ENV" == "development" ]; then
  echo "Run migrations..."
  sequelize db:migrate
fi

if [ "$DEBUGGER" = true ]; then
  # start app (with debugging)
  echo "Starting app with debugging"
  if [ "$DEBUG_BRK" = false ]; then
    exec nodemon \
        -V \
        --web-host 0.0.0.0 \
        --debug-port 5995 \
        --web-port 8787 \
        --debug-brk false \
        --preload false \
        --exec node-debug index.js
  else
    exec nodemon \
        -V \
        --web-host 0.0.0.0 \
        --debug-port 5995 \
        --web-port 8787 \
        --preload false \
        --exec node-debug index.js
  fi
else
  # start app (no debugging)
  echo "Starting app"
  exec nodemon -V index.js
fi
