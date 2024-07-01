import grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { v4 } from "uuid";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { run } from "../utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const TODO_PROTOC = "src/protos/todo.proto"
const STREAM_PROTOC = path.join(__dirname, "../protos/stream.proto");
console.log("TODO_PROTOC: ", STREAM_PROTOC);

console.log("[server]: Initiating server execution");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefintion = loadSync(STREAM_PROTOC, options);
const streamProto = grpc.loadPackageDefinition(packageDefintion).proto;

const server = new grpc.Server();

server.addService(streamProto.StreamService.service, {
  //#region client stream service
  clientStream: (call, callback) => {
    console.log("server client stream");
    // console.log(call) // ServerDuplexStreamImpl
    call.on("data", (data) => {
      console.log(" [client stream ]: from client stream");
      console.log(data);
    });
    // the callback gets executed on client
    call.on("end", () => {
      callback(null, { clientend: "done" });
    });
  },
  //#endregion client stream service

  //#region server stream service
  serverStream: (call) => {
    // console.log(call); //ServerWritableStreamImpl
    console.log("server server stream");
    console.log(call.request.serverstart);

    run((i) => {
      //   throw new Error("lousy error"); // caught in error but as another error
      // end eventually gets called by design, causes server to crash
      call.write({
        id: i.toString(),
        data: v4(),
        src: "server",
        dst: "client",
      });
    }, 200).finally(() => call.end());
  },
  //#endregion server stream service

  //#region bi stream service
  biStream: (call) => {
    // clientstream
    let client_closed = false;
    call.on("data", (data) => {
      console.log(" [ bi-client stream ]: from bi-client stream");
      console.log(data);
    });
    call.on("end", () => {
      console.log(" [ bi-client stream ]: from bi-client stream end");
      client_closed = true;
      // call.end()
    });
    // server stream
    // call.write()
    // call.end()
    run((i) => {
      console.log(" [ bi-server stream ]: from bi-server stream");
      call.write({
        id: i.toString(),
        data: v4(),
        src: "server",
        dst: "client",
      });
    }, 200).finally(() => {
      console.log(" [ bi-server stream ]: from bi-server stream end");
      //   the momment server calls this, the call.on("data", () =>{}) no longree accepts data
        // call.end();
        // this prevents the server from closing until the client is close
        reschedule()
      function reschedule() {
          let id = setInterval(() => {
            clearInterval(id)
            if (client_closed) {
                call.end();
                return
            }
            reschedule()
        }, 2500);
      }
    });
  },
  //#endregion bi stream service
});

server.bindAsync(
  "127.0.0.1:50052",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) throw error;
    console.log("[server]: started on port ", port);
  }
);
