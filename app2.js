const fs = require('fs');
const path = require('path');
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

/* function unir() {
  const oscar = path.resolve(mainPath, 'hola')
  console.log(oscar);
}

unir() */

/* function iterate(folderPaths) {

  folderPaths.forEach( folderPath => {
    const results = fs.readdirSync(folderPath);
    const folders = results.filter( res => fs.lstatSync(path.resolve( folderPath, res )).isDirectory() );
    const innerFolderPaths = folders.map( folder => path.resolve( folderPath, folder ));
    if( innerFolderPaths.length === 0 ) return
    innerFolderPaths.forEach(innerFolder => console.log(innerFolder));
    iterate(innerFolderPaths)
  });
} */

const iterate = (folderPath) => {
  console.log(folderPath);
  const results = fs.readdirSync(folderPath);
  console.log(results);
    results.forEach( result => {
      const innerPath = path.join( folderPath, result );
      const isDirectory = fs.lstatSync(path.resolve( folderPath, result )).isDirectory();
      if (isDirectory) {
        iterate(innerPath);
        return
      } else {
        insertAudioInDB(innerPath, result)
      }
    });
};

const insertAudioInDB = (path, nombre) => {
  const audioData = {
    path,
    nombre
  }
  dbConfig.query("INSERT INTO audios set ? ", [audioData], (err, rows) => {
    console.log(err ? "error" + err : "Audio agregado");
  });   
}



iterate(mainPath);
