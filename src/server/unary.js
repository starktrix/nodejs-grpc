import grpc from "@grpc/grpc-js"
import { loadSync } from "@grpc/proto-loader";
import { v4 as uuid, v4 } from "uuid"
import path, { dirname } from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// const TODO_PROTOC = "src/protos/todo.proto"
const TODO_PROTOC = path.join(__dirname, "../protos/todo.proto")
console.log("TODO_PROTOC: ", TODO_PROTOC)

console.log("[server]: Initiating server execution")

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
}

const packageDefintion = loadSync(TODO_PROTOC, options)
// add .proto so it can work with golang client
const todoProto = grpc.loadPackageDefinition(packageDefintion).proto

const server = new grpc.Server()

let todos = [
    {
        id: "1",
        title: "first post",
        body: "lengthy post of the first post todo"
    },
    {
        id: "2",
        title: "second post",
        body: "lengthy post of the second post todo"
    }
]

server.addService(todoProto.TodoService.service, {
    getTodo: (call, callback) => {
        // console.log("todo: ", todos[0])
        console.log("message: ", call.request.message)
        callback(null, todos[0])
    },
    getAll: (_, callback) => {
        const todoList = {
            todos: todos.map(todo => ({ id: todo.id, title: todo.title, body: todo.body })),
        };
        // callback(null, todoList);
        callback(null, {todos})
    },
    edit: (call, callback) => {
        // console.log("call: ", call) // ServerWritateStreamImpl
        const call_id = call.request.id;
        let todo = todos.find(({ id }) => id == call_id )
        todo["title"] = "edited second post"
        console.log("Edited post")
        console.log(todo)
        callback(null, {message: "edited"})   
    },
    add: (call, callback) => {
        const req = call.request
        let todo = {}
        todo["id"] = req.id //"3"
        todo["title"] = req.title //"third post"
        todo["body"] = req.body //"lengthy third post"
        console.log("Added post")
        todos.push(todo)
        console.log(todos)
        callback(null, {message: "added"})
    }

})

// throws this error when bound to 127.0.0.1
// E No address added out of total 1 resolved

server.bindAsync("127.0.0.1:50052",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) throw error
        console.log("[server]: started on port ", port)
    })
