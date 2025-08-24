//create a class for inserting data to the database
//
class Device { 
    constructor(bus_id,geolocation,timestamp,passenger_count){
        this.bus_id = bus_id;
        this.geolocation = geolocation;
        this.timestamp = timestamp;
        this.passenger_count = passenger_count;
    }

    async InsertData(connection) {
        
    }
}