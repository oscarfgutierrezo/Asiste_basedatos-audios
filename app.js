const glob = require("glob");
const cron = require('node-cron');
const mysql = require ('mysql') ; 

const directoryPath = "C:/laragon/www/Grabaciones/";


const dbConfig = mysql.createConnection ({
    host: 'localhost',
    user: "baq",
    password: "Asiste.2021",
    database: "audios",
});

dbConfig.connect((err) => {
    if (err) {
      console.log("Error occurred", err);
    } else {
      console.log("Connected to MySQL Server");
    }
});

const getFilesNames = (path) => {
  glob(path + '**/*.WAV', (err, res) => {
    try {
        res.forEach( file => {
          console.log(file);
            const fileArray = file.split('/');
            const fileData = {
                nombre: `${fileArray.at(-1)}`,
                path: `${file}`
            };            

            dbConfig.query("INSERT INTO audios set ? ", [fileData], (err, rows) => {
                console.log(err ? "error" + err : "Audio agregado");
              });
        });
    } catch (error) {
        console.log(err);
    }
  })
}


cron.schedule('*/5 * * * * *', () => {
    getFilesNames(directoryPath);
});

// Ejecutar a las 6am y a las 6pm
//cron.schedule('0 0 6,18 * * *', () => {
//getFilesNames(directoryPath);
//});



