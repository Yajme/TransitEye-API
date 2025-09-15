import mqttClient from '#src/configs/mqtt';


// Topic handlers
export const handleBusLocation = async (message) => {
    try {
        console.log('Received bus location:', message);
        // Handle bus location updates
        //insert to location

        // e.g., update database, notify clients, etc.
    } catch (error) {
        console.error('Error handling bus location:', error);
    }
};

export const handleBusStatus = async (message) => {
    try {
        console.log('Received bus status:', message);
        //Insert bus status

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