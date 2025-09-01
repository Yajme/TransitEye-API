

class User{
    constructor(username,password){
        this.username = username;
        this.password = password;
    }




    validateUsername(){
        return true;
    }

    validatePassword(){
        return true;
    }


    async fetchCredentials(connection){
        const query = "SELECT password,salt FROM  users WHERE username = $1 AND deleted_at IS NULL";
        const response = await connection.query(query,[this.username]);
        return response.rows;
    }
}



export default User;