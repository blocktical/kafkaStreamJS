config = {
    "noptions": {
        "metadata.broker.list": "localhost:9092",
        "group.id": "kafka-streams-test-native",
        "client.id": "kafka-streams-test-name-native",
        "event_cb": true,
        "compression.codec": "snappy",
        "api.version.request": true,
        "socket.keepalive.enable": true,
        "socket.blocking.max.ms": 100,
        "enable.auto.commit": false,
        "auto.commit.interval.ms": 100,
        "heartbeat.interval.ms": 250,
        "retry.backoff.ms": 250,
        "fetch.min.bytes": 100,
        "fetch.message.max.bytes": 2 * 1024 * 1024,
        "queued.min.messages": 100,
        "fetch.error.backoff.ms": 100,
        "queued.max.messages.kbytes": 50,
        "fetch.wait.max.ms": 1000,
        "queue.buffering.max.ms": 1000,
        "batch.num.messages": 10000
    },
    "tconf": {
        "auto.offset.reset": "earliest",
        "request.required.acks": 1
    },
    "batchOptions": {
        "batchSize": 5,
        "commitEveryNBatch": 1,
        "concurrency": 1,
        "commitSync": false,
        "noBatchCommits": false
    }
}

const {KafkaStreams} = require("kafka-streams");

const kafkaStreams = new KafkaStreams(config);
kafkaStreams.on("error", (error) => console.error(error));
console.log("kafkaStreams:  ",kafkaStreams);

const kafkaTopicName = "my-topic";

const stream = kafkaStreams.getKStream(kafkaTopicName);
stream.forEach(message => console.log(message));
stream.start().then(() => {
    console.log("stream started, as kafka consumer is ready.");
}, error => {
    console.log("streamed failed to start: " + error);
});