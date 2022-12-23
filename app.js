const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const mysql = require ('mysql') ; 

const mainPath = "C:/laragon/www/Grabaciones/";

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

const iterate = async (folderPath) => {
  const results = fs.readdirSync(folderPath);
  for (const result of results) {
    const innerPath = path.join( folderPath, result );
    const isDirectory = fs.lstatSync(path.resolve( folderPath, result )).isDirectory();
    if (isDirectory) {
      console.log('Carpeta encontrada');
      iterate(innerPath);
    } else {
      console.log('audio encontrado');
      await insertAudioInDB(innerPath, result)
        .then( msg => console.log(msg))
        .catch(msg => console.log(msg))
    }
  }
};

const insertAudioInDB = (path, nombre) => {
  return new Promise((resolve, reject) => {
    const audioData = {
      path,
      nombre
    }

    dbConfig.query("INSERT INTO audios set ? ", [audioData], (err, rows) => {
      if (err) {
        reject('El audio ya se encuentra en la base de datos')
      } else {
        resolve('Audio agregado');
      }
    });   
  })
}


cron.schedule('00 00 06 * * *', () => {
  iterate(mainPath);
});
