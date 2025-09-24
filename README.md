# Microservices

This is the repo for exercise 1 of DevOps Course COMP.SE.140

## How to test the system

The course staff can test the system with the following steps (on Linux):

### 1. Clone the repository (exercise1 branch)
git clone -b exercise1 <the git url you gave>
cd microservices-ex1

### 2. Build and start the services
docker-compose up --build

### 3. Wait for ~10 seconds until all services start

### 4. Test the system
curl localhost:8199/status
curl localhost:8199/log

### 5. Shut down the system
docker-compose down

## How to clean the persistent storage
There are two types of persistent storage in this system:

### vStorage (bind mount to host)

Logs are written into the local folder ./vstorage/log.txt.

To clean:

rm -f ./vstorage/log.txt

### storage-data (named Docker volume)

Used by the Storage service for logs.

To clean:

docker volume rm microservices-ex1_storage-data

### To remove all containers + volumes at once:

docker-compose down -v
