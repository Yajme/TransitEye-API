//create a class for inserting data to the database
//
export class Bus { 
    constructor(bus_id,geolocation,timestamp,passenger_count){
        this.bus_id = bus_id;
        this.geolocation = geolocation;
        this.timestamp = timestamp;
        this.passenger_count = passenger_count;
    }

    async InsertData(connection) {
        const query = "INSERT INTO bus_status (bus_number,latitude,longtitude,passenger_count)  VALUES ($1,$2,$3,$4)";
        await connection.query(query,
          [
            this.bus_id,
            this.geolocation.latitude,
            this.geolocation.longtitude,
            this.passenger_count
          ]);
    }

  static createWithObject(bus){
    return new Bus(
        bus.bus_id,
        bus.geolocation,
        bus.timestamp,
        bus.passenger_count
    );
  }
}


//export Bus;
