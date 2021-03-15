const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository")

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    //salting password
    async create(attributes) {
        attributes.id = this.randomId();

        const salt = crypto.randomBytes(8).toString("hex");
        const buffer = await scrypt(attributes.password, salt, 64)

        const records = await this.getAll();
        const record = {
            ...attributes,
            password: `${buffer.toString("hex")}.${salt}`
        }
        records.push(record);

        await this.writeAll(records);

        return attributes;
    }
    
    async comparePasswords(saved, supplied) {
        //saved -> password saved in our database. "hashed.salt"
        // supplied -> password given to us by an user trying to sign in
        const result = saved.split(".")
        const hashed = result[0]
        const salt = result[1]
        //same as above
        /* const [hashed, salt] = saved.split("."); */

        const hashedSuppliedbuff = await scrypt(supplied, salt, 64);
        const trueHash = hashedSuppliedbuff.toString("hex");
        
        return hashed === trueHash;

       
    }
};

module.exports = new UsersRepository("users.json");