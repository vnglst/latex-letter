# Latex letters

Generating beautiful PDF letters with LaTeX and Node.

## Clone repo

````
clone https://github.com/vnglst/latex-letter.git
cd latex-letter
````

## Build Docker image

Building the Docker images from the Dockerfile might take a while (downloading the images it's based on and verifying those). After the first built is goes faster.

````
docker build -t vnglst/latex-letter .
````

Find the Docker image id by typing:
````
docker images
````

## Start developing
Start the Docker container and forward port 8080 to 8080 on your localhost.
````
docker run  -v $(pwd) -p 8080:8080 -d <put the image id here>
````
Open the web app on http://localhost:8080. You can now make changes to the source code and the application automatically restarts on changes.

## Push the image to Docker

````
docker push vnglst/latex-letter

````

It's also possible to add your Github repo to Docker Hub and let them do the building for you. That way you don't have to upload the rather large Docker image (of almost 6 Gig).

## Deploy on a server
Create a server, for instance a 512 Mb Droplet on Digital Ocean. If you use the CoreOS droplet you get an optimized Docker server without any doing any extra work.

````
docker pull vnglst/latex-letter
docker run -p 8080:8080 -d <put the image id here>

````
You're own LaTeX letter app is now deployed. You can find it on port 8080 on your IP address. For instance: 188.166.141.4:8080

That's all! Feel free to contact me if you have any questions!

