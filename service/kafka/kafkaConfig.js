const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId : 'pending-server',
    brokers : ['localhost:9092']
});

const kafkaConf = {
    "bootstrap.servers" : "localhost:9092",
    "key.serializer" : "org.apache.kafka.common.serialization.StringSerializer",
    "value.serializer" : "org.apache.kafka.common.serialization.StringSerializer",
};
const kafkaProducer = kafka.producer();
const kafkaConsumer = kafka.consumer({groupId:'pending-group'});
const initKafka = async () => {
    await kafkaProducer.connect();
    await kafkaConsumer.connect();
}
initKafka();

module.exports = {kafkaProducer, kafkaConsumer};

