#!/usr/bin/env bash

# load env vars
# if [ -f .envvars ]; then
#   source .envvars
# else
#   echo "Could not find a .envvars file. Make sure you copy the correct one from the envs directory"
#   exit 1
# fi

# If no ENV is set, die
if [ -z $ENV ]; then
  echo "Your .envvars file must declare a ENV var"
  exit 1
fi

# Wait till Postgres is available before continuing
if [ "$ENV" == "local" ]; then
  while true; do
      psql -c "select pg_postmaster_start_time()" >/dev/null 2>&1
      if [ $? -eq 0 ]; then
          break
      fi
      echo "Waiting to connect to Postgres..."
      sleep 1
  done
fi

if [ "$ENV" == "local" ]; then
  if psql -lqt | cut -d \| -f 1 | grep -w $NODE_PROJECT_DB_NAME; then
    echo "$NODE_PROJECT_DB_NAME database already exists...moving on"
  else
    echo "$NODE_PROJECT_DB_NAME database does not exist"
    echo "...create MAIN user $NODE_PROJECT_DB_USER with password $NODE_PROJECT_DB_PASS"
    psql -c "create user \"$NODE_PROJECT_DB_USER\" with password '$NODE_PROJECT_DB_PASS'"

    echo "...create MAIN database $NODE_PROJECT_DB_NAME with owner $NODE_PROJECT_DB_USER encoding='utf8' template template0"
    psql -c "create database \"$NODE_PROJECT_DB_NAME\" with owner \"$NODE_PROJECT_DB_USER\" encoding='utf8' template template0"
  fi
fi

if [ "$ENV" == "local" ]; then
  echo "Running migrations..."
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
