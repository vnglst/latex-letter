sudo apt-get update && sudo apt-get upgrade
echo "Install docker"
sudo curl -sSL https://get.docker.com/ | sh
sudo usermod -aG docker ubuntu
curl https://getcaddy.com | bash
sudo reboot
