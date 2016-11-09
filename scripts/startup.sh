ulimit -n 8192
sudo nohup caddy >> logs/caddy.log &
cat logs/caddy.log
docker info
docker pull vnglst/letter-api
docker run -p 1844:3000 -d "$_"
