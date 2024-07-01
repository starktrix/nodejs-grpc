import grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// console.log(__dirname, "--", __filename);
const TODO_PROTOC = path.join(__dirname, "../protos/todo.proto");
// console.log("TODO_PROTOC: ", TODO_PROTOC);
console.log("[client]: Initiating client execution");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefintion = loadSync(TODO_PROTOC, options);
// const TodoService = grpc.loadPackageDefinition(packageDefintion).TodoService;

// cross platform call to golang server
const srv = grpc.loadPackageDefinition(packageDefintion).proto;

const client = new srv.TodoService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

client.getTodo({ message: "qwerty" }, (err, todo) => {
  if (err) throw err;
  console.log("[client]: get Todo ======");
  console.log(todo);
});

client.getAll({}, (err, todos) => {
  if (err) throw err;
  console.log("[client]: getAll ========");
  console.log(todos);
});
client.edit({id: "2"}, (err, todos) => {
  if (err) throw err;
  console.log("[client]: edit ============");
  console.log(todos);
});
client.add(
  { id: "3", title: "3rd post", body: "lengthy post" },
  (err, todos) => {
  if (err) throw err;
  console.log("[client]: add =========");
  console.log(todos);
});
