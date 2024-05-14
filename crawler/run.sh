#!/bin/bash

CHUNK_SIZE=10
WAIT_DURATION=10
PAUSE_DURATION=30

TOTAL_URLS=3284
let TOTAL_CHUNKS=($TOTAL_URLS+$CHUNK_SIZE-1)/$CHUNK_SIZE

local_arg=""

for ((i=1; i<=$#; i++)); do
    if [ "${!i}" == "--local" ]; then
        echo "Running in local mode"
        let next_index=i+1
        local_arg="${!next_index}"
        break
    fi
done

for (( i=0; i<$TOTAL_CHUNKS; i++ ))
do
    let START=$i*$CHUNK_SIZE
    let END=($i+1)*$CHUNK_SIZE-1

    konsole --new-tab -e "bash -c 'node index.js $START $END $local_arg'" &
    while [ ! -f "complete.txt" ]; do sleep $WAIT_DURATION; done

    echo "done found"
    
    rm complete.txt

    sleep $PAUSE_DURATION
done
