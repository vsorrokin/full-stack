#!/bin/bash

# Register shutdown handler
function gracefulShutdown ()
{
	mutagen project terminate
	mut_rm
    exit 2
}
trap "gracefulShutdown" 2

# Start file sync
mut_rm
mutagen project start || mutagen project terminate
mutagen project run logs
