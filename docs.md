[Tutorial 1](https://daily.dev/blog/build-a-grpc-service-in-nodejs)

[Tutorial 2](https://blog.logrocket.com/creating-a-crud-api-with-node-express-and-grpc/)

[grpc](https://grpc.io/docs/languages/)


[AI Prompt](https://www.phind.com/search?cache=zkak2i9q9polcxqtz320ieki)

1. The bind Port is not binding to port 50051, I had to change this to 50052. I think this has to be that it is initaited on 50051 by default.

```js
E No address added out of total 1 resolved
C:\Users\Stark\Desktop\tutorials\js\grpc\node_modules\@grpc\grpc-js\build\src\server.js:449
                    throw new Error(`${errorString} errors: [${bindResult.errors.join(',')}]`);
                          ^

Error: No address added out of total 1 resolved errors: [listen EADDRINUSE: address already in use 127.0.0.1:50051]
    at Server.bindAddressList (C:\Users\Stark\Desktop\tutorials\js\grpc\node_modules\@grpc\grpc-js\build\src\server.js:449:27)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Server.bindPort (C:\Users\Stark\Desktop\tutorials\js\grpc\node_modules\@grpc\grpc-js\build\src\server.js:479:36)
```

2. Protos repeated is an object
```proto
message To {
    repeated string Do do = 1;
}
```
is same as

```js
{do: doss}
where doss is an array containing do
```

3. for bistreaming, using the run function with timeout 600 on server and 1000 on client, after the server sends it data completed, of which it terminates, the clinet is unable to send further data but vice-versa, if I set the timeout on server to be 1000 and 600 on client, both receiver complete data

conclusion is if server stream calls end, client cannot write anymore

// the momment server calls this, the call.on("data", () =>{}) no longree accepts data

if the clinet close its stream, server can still write to it
if the server close its stream, client can not write to it


solved by putting the end in each other respectively but the client does not end as done in other streams

the tricky thing is server has to be the one to close last


cross platform class from node client to golang server
edited the node clinet to include `package proto` which was contained in here
```
[AI Prompt](https://www.phind.com/search?cache=jgei95zcty0b7uqm49ik3yaf)
