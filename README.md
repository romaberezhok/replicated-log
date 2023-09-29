# Replicated Log

This project implements a replicated log system.

## Architecture Overview

### Master Server

The Master server provides the following API:

- `POST /api/messages`: Appends a message to the in-memory list. This operation ensures that the message is replicated on all Secondaries before completion. The Master will wait for ACKs from all Secondaries before responding to the client.

- `GET /api/messages`: Retrieves all messages from the in-memory list.

### Secondary Servers

Each Secondary server provides the following API:

- `POST /api/messages`: Appends a message to the in-memory list.

- `GET /api/messages`: Retrieves all replicated messages from the  in-memory list.

### Web Client

The Web Client serves as a user-friendly interface for interacting with the Master Server. It provides a more convenient and intuitive way to test and manage the replicated log system. Through the Web Client, users can easily send requests to the Master Server, view responses, and monitor the log's status.

The Web Client can be accessed via a web browser by reaching `http://localhost:8000`.

### Discovery Service

This service enables dynamic discovery of Secondary nodes and their respective URLs, allowing the system to adapt to changes in the cluster's configuration.

## Properties and Assumptions

- After each successful `POST` request to the Master, the message is replicated on every Secondary server.

- The Master server guarantees that Secondaries have received a message by waiting for ACKs from all Secondaries before responding to the client. This approach is blocking.

- To demonstrate blocking replication, any Secondary servers can be paused.

- REST is used for communication between the Master and Secondaries.

- Both the Master and Secondaries are designed to run in Docker containers, making deployment and scaling easy.

## Getting Started

### Prerequisites

Before running the system, make sure you have the following prerequisites installed:

- Docker
- Docker Compose

### Building and Running

1. Clone this repository to your local machine.

2. Start the cluster:

    ```shell
    docker-compose up
    ```

This will start the Master server and a specified number of Secondary servers (you can configure the number of Secondaries in the `compose.yaml` file).

## Testing

### Web Client

1. To test the system using the Web Client, open any web browser and enter `http://localhost:8000` into the address bar. This action will bring up a page featuring an input field.

2. You can now input any message into the provided field and either press the `Submit` button or simply hit `Enter`.

3. Upon submission, a new notification, or "toast," will appear in the top-right corner of the page, indicating the result of your request.

    - Initially, every message is in a "Pending" state and is denoted by a gray rectangle within the toast itself.

   ![img_3](https://github.com/romaberezhok/replicated-log/assets/50613629/a777b5ea-9ade-4935-9b4a-a78cbef33acb)

    - After the message has been successfully replicated to all Secondary nodes, the rectangle will turn green, and a corresponding status message will be displayed.

   ![img_2](https://github.com/romaberezhok/replicated-log/assets/50613629/8b57c48d-85df-4121-b9da-48e5c108d7c6)


    - In the event of a failure to replicate the message, the rectangle will turn red, accompanied by an error message.

   ![img_4](https://github.com/romaberezhok/replicated-log/assets/50613629/dbff1b50-3d7e-444b-947c-3eea44db995a)


4. To emulate a scenario where responses are received after the message is replicated on every Secondary server, follow these steps:

    1. Pause one of the Secondary containers:

       ```shell
       docker pause replicated-log_secondary-server_2
       ```

    2. Send a few messages. You will notice that there are several toasts, all displaying a "Pending" state as the result.

       ![img_5](https://github.com/romaberezhok/replicated-log/assets/50613629/4f6bd355-cfa8-45da-b201-d5364e2af00c)


    3. Unpause the previously paused container:

       ```shell
       docker unpause replicated-log_secondary-server_2
       ```

    4. Observe that all messages are now marked as green.

       ![img_6](https://github.com/romaberezhok/replicated-log/assets/50613629/d6fdac02-c57e-48f5-9039-e27360fd4e76)

### HTTP Requests

To check the list of messages you can make direct HTTP requests to the Master and Secondary servers. Here are some examples using `curl`:

- Retrieve all messages from the Master:

    ```shell
    curl http://localhost:3000/api/messages
    ```

- Retrieve all messages from a Secondary server (adjust the port to reach different Secondaries; by default, they are on ports :3001 and :3002):

    ```shell
    curl http://localhost:3001/api/messages
    curl http://localhost:3002/api/messages
    ```

These HTTP requests allow you to programmatically interact with the system and retrieve log data directly from the servers.
