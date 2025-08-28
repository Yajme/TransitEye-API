import { UserError } from "#src/module/userException";

class User{
    constructor(username,password){
        this.username = username;
        this.password = password;
    }




    validateUsername(){

    }

    validatePassword(){

    }


    async fetchCredentials(connection){
        const query = "SELECT password,salt FROM  users WHERE username = $1 AND deleted_at IS NULL";
        const response = await connection.query(query,[this.username]);
        if(response.rowCount < 1){
            throw new UserError('Invalid username or password',401,{username : this.username, password : this.password});
        }

        return response.rows;
    }
}



export default User;