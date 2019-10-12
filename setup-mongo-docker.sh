#!/bin/bash

mongo ${MONGO_DATABASE} \
        --port ${MONGO_PORT} \
        -u ${MONGO_ROOT_USERNAME} \
        --authenticationDatabase "admin" \
        -p ${MONGO_ROOT_PASSWORD} \
        --eval "db.createUser({ user: '${MONGO_USER_USERNAME}', pwd: '${MONGO_USER_PASSWORD}', roles:[ { role:'readWrite', db: '${MONGO_DATABASE}' } ] } );"