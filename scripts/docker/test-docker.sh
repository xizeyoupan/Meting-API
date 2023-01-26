#!/bin/bash

MAX_RETRIES=10

# Try running the docker and get the output
# then try getting /api

docker run -d -p 3000:3000 meting-api:${TAG}

if [[ $? -ne 0 ]]
then
    echo "Fail to run docker"
    exit 1
fi

RETRY=1

HTTP_CODE=$(curl -m 10 localhost:3000/api -w "%{http_code}" -o /dev/null)
while [[ $? -ne 0 || "$HTTP_CODE" -ne 200 ]] && [[ $RETRY -lt $MAX_RETRIES ]]; do
    echo "HTTP_CODE: ${HTTP_CODE}"
    sleep 5
    ((RETRY++))
    echo "RETRY: ${RETRY}"
    HTTP_CODE=$(curl -m 10 localhost:3000/api -w "%{http_code}" -o /dev/null)
done

if [[ $RETRY -gt $MAX_RETRIES ]]; then
    echo "Unable to run, aborted"
    exit 1
else
    if [[ $HTTP_CODE -ne 200 ]]; then
        echo "Api error"
        exit 1
    else
        echo "Successfully acquire /api, passing"
    fi
fi
