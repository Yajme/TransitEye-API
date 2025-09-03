

class User{
    constructor(username,password){
        this.username = username;
        this.password = password;
    }

    async fetchCredentials(connection){
        const query = "SELECT id,password,salt FROM  users WHERE username = $1 AND deleted_at IS NULL";
        const response = await connection.query(query,[this.username]);
        this.credentials = response.rows;
        return response.rows;
    }
}



export default User;