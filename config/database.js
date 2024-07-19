const mongoose = require('mongoose');

const databaseConnection = () => {
    mongoose.connect(process.env.DB_URI).then((conn)=>{
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    })
    .catch((error)=>{
        console.log(`Error : ${error}`);
        process.exit(1); // for exit node application 
    });
    }

module.exports = databaseConnection;    