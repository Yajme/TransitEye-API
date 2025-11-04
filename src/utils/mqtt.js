import mqttClient from '#src/configs/mqtt';
import Bus from '#src/models/bus';
import db from '#src/configs/db';
import { getCurrentDate } from '#src/utils/date';
import { log } from '#src/utils/logger';
import wss from '#src/utils/websocket';
// Topic handlers
export const handleBusLocation = async (message) => {
    try {
        message.timestamp = getCurrentDate().toISOString();
        console.log('[MQTT] Received bus location:', message);
        // Handle bus location updates
            //Transmit to websocket
            console.log('[WebSockets]: sending to clients...');
            
            wss.clients.forEach((client)=>{
                
                client.send(JSON.stringify(message));
            })
        
    } catch (error) {
        console.error('Error handling bus location:', error);
    }
};

export const handleBusStatus = async (message) => {
    try {
        console.log('[MQTT] Received bus status:', message);
        //Insert bus status
           const bus_id = message.bus_id ;
           const latitude = message.lat || message.latitude;
           const longitude = message.lon || message.longitude;
           const timestamp = getCurrentDate().toISOString();
           //insert to passenger event
           const passenger_in = message.passenger_in || 0;
           const passenger_out = message.passenger_out || 0;

           const passenger_count = message.passenger_count || 0;
           const bus = new Bus(bus_id,latitude,longitude,timestamp,passenger_count);
          
        
          await bus.insertData(db.connection);
          await bus.insertPassengerEvent(passenger_in,passenger_out,db.connection);
          log('[MQTT]: Bus status updated!');
        // Handle bus status updates
    } catch (error) {
        console.error('Error handling bus status:', error);
    }
};

// Topic subscriber setup
export const setupMQTTSubscriptions = async () => {
    try {
        await mqttClient.connect();

        // Subscribe to topics
        mqttClient.subscribe('bus/location', handleBusLocation);
        mqttClient.subscribe('bus/status', handleBusStatus);

        console.log('MQTT subscriptions setup complete');
    } catch (error) {
        console.error('Failed to setup MQTT subscriptions:', error);
        throw error;
    }
};

// Publisher functions
export const publishBusLocation = async (busId, location) => {
    try {
        await mqttClient.publish('bus/location', {
            busId,
            location,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Failed to publish bus location:', error);
        throw error;
    }
};

export default {
    setupMQTTSubscriptions,
    publishBusLocation,
    setupMQTTSubscriptions
};
