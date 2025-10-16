#!/bin/bash
source eternalzord_env/bin/activate
uvicorn eternal_zord:app --host 0.0.0.0 --port 7011 --log-level debug
