#!/bin/bash

if [ "$#" -lt 3 ]; then
    echo "Need the container name, port number exposed to localhost, and postgres password"
    exit 1
fi

docker run --name $1 -p $2:5432 -e POSTGRES_PASSWORD=$3 -e POSTGRES_DB=match -v ./init.sql:/docker-entrypoint-initdb.d/init.sql -d postgres
