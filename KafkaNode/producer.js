const Kafka = require('node-rdkafka');

var producer = new Kafka.Producer({
    // 'debug' : 'all',
    'client.id':'noderd-kafka',
    'bootstrap.servers': 'localhost:9092',
    'broker.version.fallback':'0.10.2.0',
    'heartbeat.interval.ms':3000,
    'compression.codec': 'none',
    'request.required.acks':1,
    'api.version.request':false,
    'retry.backoff.ms': 200,
    'message.send.max.retries': 10,
    'socket.keepalive.enable': true,
    'queue.buffering.max.messages': 10000,
    'queue.buffering.max.ms': 1000,
    'batch.num.messages': 10000,
    'dr_cb': true
},{
    'message.timeout.ms':300000,
    'produce.offset.report':true,
    'acks':1,
    'offset.store.sync.interval.ms':10
});
  
  // Connect to the broker manually
  try{
    producer.connect();
  }catch( error ){
    console.log( error );
  }
  
  // Wait for the ready event before proceeding
  producer.on('ready', function() {
    try {
        console.log("Producing Something!")  
        producer.produce(
            // Topic to send the message to
            'my-topic',
            // optionally we can manually specify a partition for the message
            // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
            null,
            // Message to send. Must be a buffer
            Buffer.from('Awesome message'),
            // for keyed messages, we also specify the key - note that this field is optional
            'Stormwind',
            // you can send a timestamp here. If your broker version supports it,
            // it will get added. Otherwise, we default to 0
            Date.now(),
            // you can send an opaque token here, which gets passed along
            // to your delivery reports
        );
    } catch (err) {
      console.error('A problem occurred when sending our message');
      console.error(err);
    }
  });
  
  // Any errors we encounter, including connection errors
  producer.on('event.error', function(err) {
    console.error('Error from producer');
    console.error(err);
  })
  
  // We must either call .poll() manually after sending messages
  // or set the producer to poll on an interval (.setPollInterval).
  // Without this, we do not get delivery events and the queue
  // will eventually fill up.
  producer.setPollInterval(1000);