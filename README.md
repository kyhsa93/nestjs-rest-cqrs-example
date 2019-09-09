# Nest sample code

This is sample nestjs project.
- link: https://nestjs.com

## Getting started

This is REST api made by node.js, nest, mysql with typescript.

So you have to get node.js environment, mysql for database, know typescript syntax.

### Prerequisites

Please install node.js and I recommend to use docker for your database.

My recommand node.js version is dubnium and latest docker version.

* Install node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

* Install Docker Desktop for MAC: [https://docs.docker.com/docker-for-mac/install/](https://docs.docker.com/docker-for-mac/install/)

* Install Docker Desktop for Windows: [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)

* Install compose: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

## Create development environment

First, clone this repository into your local environment. Run followed command in your terminal.

```bash
  git clone https://github.com/kyhsa93/nestJS-sample.git
```

Second step, install package that needed in this project.

If your node.js environment is successly downloaded, you can use node package manager.

Run followed command in your terminal.

```bash
  npm install
```

Next up, generate mysql database.

If you already have mysql in your development environment, you can use that.

But if you don't have mysql database, try this process.

Install docker for your OS from link in top of this documentation.

And run followed command.

If your docker is successfully installed, you can use docker cli.

```bash
  docker run --name nest -d -p 3306:3306 -e MYSQL_DATABASE=nest -e MYSQL_ROOT_PASSWORD=test -v ~/database/nest:/var/lib/mysql mysql:5.7
```

And then, you can connect mysql in http://localhost:3306, user name 'root' and password is 'test'.

Finaly, your develop environment is created.

You can start api with followed command.

```bash
  npm start
```

And if you modify code and save, you can see the process detect code changes and restart it self.

## Start with docker

If you can use docker cli, you can build docker image.

```bash
  docker build -t nest-sample
  docker images # list up docker images
```

And then you can create and run docker container using builded image.

```bash
  docker run -d -p 5000:5000 nest-sample
  docker ps # list up running container
```

and now you can connect api through http://localhost:5000.

## Start with docker compose

Docker compose in this project is include api and mysql 5.7 for database.

Run followed command in project directory.

```bash
  docker-compose up -d # build images, create and run containers in background
```

If container is created, you can access api on http://localhost:5000.

And you can access database through http://localhost:3306.

Default database user is root and password is test.

If you want apply your modified code into the running container, you can add build option.

```bash
  docker-compose up -d --build # if source code is changed, rebuidl image, recreate and start container
```

After use compose, you have to stop and remove containers.

```bash
  docker-compose down # stop and remove container in compose
```

## Configuration

## Documantaion

Documentaion about this project is made swagger.

Start this api and connect http://localhost:5000/api in your browser.

## Scripts
```bash
  git clone https://github.com/kyhsa93/nestJS-sample.git # clone this project

  # run mysql database container
  docker run --name nest -d -p 3306:3306 -e MYSQL_DATABASE=nest -e MYSQL_ROOT_PASSWORD=test -v ~/database/nest:/var/lib/mysql mysql:5.7

  docker build -t nest-sample # build docker image named nest-sample

  docker images # list up docker images

  docker run -d -p 5000:5000 nest-sample # run docker container using image nameed nest-sample (host port 5000 is mapped container port 5000 and container run background process)

  docker ps # list up running container

  docker-compose up -d # build images, create and start containers in background

  docker-compose up -d --build # if container image's change exists, rebuild image, recreate and restart container

  docker-compose down # stop and remove container in compose

  npm install   # install packges
  npm test      # run test
  npm run build # transpile typescript
  npm start     # run sample code

  docker-compose up # use compose
```
