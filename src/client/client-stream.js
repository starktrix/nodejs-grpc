import grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 } from "uuid";
import { run } from "../utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// console.log(__dirname, "--", __filename);
const STREAM_PROTOC = path.join(__dirname, "../protos/stream.proto");
// console.log("TODO_PROTOC: ", STREAM_PROTOC);
console.log("[client]: Initiating client execution");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefintion = loadSync(STREAM_PROTOC, options);
const proto =
  grpc.loadPackageDefinition(packageDefintion).proto;

const client = new proto.StreamService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

//#region client stream
const client_stream = client.clientStream((err, val) => {
  if (err) {
    console.log("client stream error");
    console.log(err);
  }
  console.log("client streaming done");
  console.log(val);
});

run((i) =>
  client_stream.write({
    id: i.toString(),
    data: v4(),
    src: "client",
    dst: "server",
  })
).finally(() => client_stream.end());
//#endregion client stream

//#region server stream
// const server_stream = client.serverStream({serverstart: "server stream started"});
// server_stream.on("status", (status) => {
//     console.log("Status")
//     console.log(status)
// })

// server_stream.on("data", (data) => {
//     console.log(" [server stream ]: from server stream")
//     console.log(data)
// })

// server_stream.on("end", () => {
//     console.log(" [server stream ]: from server stream")
//     console.log("end")

// })
// server_stream.on("error", (e) => {
//     console.log("Error handling")
//     console.log(e)
// })
//#endregion server stream

//#region bi stream
// const bi_stream = client.biStream();
// // server stream listening to write and end from server
// bi_stream.on("data", (data) => {
//   console.log(" [bi stream ]: from bi-server stream");
//   // bi_stream.write()
//   console.log(data);
// });
// bi_stream.on("end", () => {
//   console.log(" [bi stream ]: from bi-server stream end");
// //   bi_stream.end()
// });
// // // clinet stream to server
// // bi_stream.write()
// // bi_stream.end()

// run((i) => {
//   console.log(" [ bi stream ]: from bi-client stream");
//   bi_stream.write({
//     id: i.toString(),
//     data: v4(),
//     src: "bi-client",
//     dst: "bi-server",
//   });
// }, 1000).finally(() => {
//   console.log(" [bi stream ]: from bi-client stream end");
//   bi_stream.end();
// });
//#endregion bi stream
