export default class Bus {
  constructor(bus_id, arg2, arg3, arg4) {
    if (typeof arg2 === "object" && arg2 !== null) {
      // Case 1: new Bus(bus_id, connection)
      this.bus_id = bus_id;
      this.connection = arg2;
    } else {
      // Case 2: new Bus(bus_id, geolocation, timestamp, passenger_count)
      this.bus_id = bus_id;
      this.geolocation = arg2;
      this.timestamp = arg3;
      this.passenger_count = arg4;
    }
  }

  async fetchCurrentStatus() {
    const query =
      "SELECT * FROM bus_status WHERE bus_number = $1 ORDER BY created_at DESC LIMIT 1";
    const response = await this.connection.query(query, [this.bus_id]);
    return response.rows;
  }

  async insertData(connection) {
    const query =
      "INSERT INTO bus_status (bus_number,latitude,longtitude,passenger_count) VALUES ($1,$2,$3,$4)";
    await connection.query(query, [
      this.bus_id,
      this.geolocation.latitude,
      this.geolocation.longtitude,
      this.passenger_count,
    ]);
  }
  
  static createWithObject(bus) {
    return new Bus(
      bus.bus_id,
      bus.geolocation,
      bus.timestamp,
      bus.passenger_count
    );
  }
}
