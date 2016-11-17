ulimit -n 8192
sudo nohup caddy >> logs/caddy.log &
cat logs/caddy.log
docker info
docker pull vnglst/latex-letter
docker run --restart=always -p 80:8080 -d 4c297c28c876

# To restart Caddy use
sudo kill -USR1 10228