#!/bin/sh
# Render inyecta $PORT en tiempo de ejecución. nginx no interpola variables,
# así que generamos su config con envsubst (solo $PORT; las demás $var son de
# nginx y deben quedarse literales) y arrancamos supervisord.
set -e

export PORT="${PORT:-10000}"

envsubst '${PORT}' \
  < /etc/nginx/nginx.render.conf.template \
  > /etc/nginx/http.d/default.conf

exec supervisord -c /etc/supervisord.conf
