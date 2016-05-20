#!/usr/bin/env bash

source 'envs/.envvars.test'

function run {
  "$@"
  local status=$?
  if [ $status -ne 0 ]; then
    # cleanupDB
    exit 1
  fi
  return $status
}

if [ "$NODE_ENV" == "test" ]; then
  if psql -lqt | cut -d \| -f 1 | grep -w ${GENESIS_PROJECT_DB_NAME}; then
    echo "${GENESIS_PROJECT_DB_NAME} database already exists...moving on"
  else
    echo "${GENESIS_PROJECT_DB_NAME} database does not exist"
    echo "...create TEST user $GENESIS_PROJECT_DB_USER with password $GENESIS_PROJECT_DB_PASS"
    psql -c "create user \"$GENESIS_PROJECT_DB_USER\" with password '$GENESIS_PROJECT_DB_PASS'"

    echo "...create TEST database $GENESIS_PROJECT_DB_NAME with owner $GENESIS_PROJECT_DB_USER encoding='utf8' template template0"
    psql -c "create database \"$GENESIS_PROJECT_DB_NAME\" with owner \"$GENESIS_PROJECT_DB_USER\" encoding='utf8' template template0"
  fi
fi

#run npm run gulp lint

run lab \
  --verbose \
  --transform 'test/_helpers/transformer.js' \
  --sourcemaps \
  --ignore __core-js_shared__,core,Reflect,_babelPolyfill,regeneratorRuntime
