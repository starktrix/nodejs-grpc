function sleep(delay) { return new Promise((resolve) => setTimeout(resolve, delay)) }


async function run(stream, delay=200) {
    for (let i = 0; i < 10; i++) {
        await sleep(delay)
        stream(i)
        // client_stream.write({
        //     id: i.toString(),
        //     data: v4(),
        //     src: "client",
        //     dst: "server"
        // })
    }
}

export {run}