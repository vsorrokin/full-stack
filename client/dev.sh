#!/usr/bin/env bash

if [ $# -gt 0 ]; then
  if [ "$1" = "up" ]; then
    shift 1
    mut

    mutagen sync terminate my-app-code
    mutagen sync create --name=my-app-code $(pwd) docker://front/usr/src/app/

    dev
  elif [ "$1" = "down" ]; then
    mutagen sync terminate my-app-code
    mut_rm
  fi
fi
