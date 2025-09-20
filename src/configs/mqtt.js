import mqtt from "mqtt";

import dotenv from 'dotenv';
dotenv.config();

// MQTT Configuration
const MQTT_BROKER_URL = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const MQTT_OPTIONS = {
    protocol : process.env.MQTT_PROTOCOL || 'mqtt',
    clientId: `transitEye_${Math.random().toString(16).slice(3)}`,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    keepalive: 60,
    qos: 0,
    rejectUnauthorized: false,
     // Add credentials if they exist
    ...(process.env.MQTT_USERNAME && {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD
    })
};

class MQTTClient {
    constructor() {
         this.client = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    
    }

    connect() {
        return new Promise((resolve, reject) => {
            console.log('Connecting to MQTT broker:', MQTT_BROKER_URL);
            this.client = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);

            this.client.on('connect', () => {
                console.log('Successfully connected to MQTT broker');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                resolve(this.client);
            });

            this.client.on('error', (error) => {
                console.error('MQTT connection error:', error.message);
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    reject(new Error(`Failed to connect after ${this.maxReconnectAttempts} attempts`));
                }
                this.reconnectAttempts++;
            });

            this.client.on('close', () => {
                console.log('MQTT connection closed');
                this.isConnected = false;
            });

            // Add connection timeout
            setTimeout(() => {
                if (!this.isConnected) {
                    reject(new Error('Connection timeout'));
                }
            }, MQTT_OPTIONS.connectTimeout);
        });
    }
    publish(topic, message) {
        if (!this.isConnected) {
            throw new Error('MQTT client not connected');
        }
        return new Promise((resolve, reject) => {
            const payload = typeof message === 'object' ? JSON.stringify(message) : message;
            
            this.client.publish(topic, payload, (error) => {
                if (error) {
                    console.error(`Error publishing to ${topic}:`, error);
                    reject(error);
                } else {
                    console.log(`Published to ${topic}:`, payload);
                    resolve();
                }
            });
        });
    }
    subscribe(topic, callback) {
        if (!this.isConnected) {
            throw new Error('MQTT client not connected');
        }
        this.client.subscribe(topic, (error) => {
            if (error) {
                console.error(`Error subscribing to ${topic}:`, error);
                return;
            }
            console.log(`Subscribed to ${topic}`);
        });

        this.client.on('message', (receivedTopic, message) => {
            if (topic === receivedTopic) {
                try {
                    const parsedMessage = JSON.parse(message.toString());
                    callback(parsedMessage);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            }
        });
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            this.isConnected = false;
        }
    }
}

// Create singleton instance
const mqttClient = new MQTTClient();

export default mqttClient;