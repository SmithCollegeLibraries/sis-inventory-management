const electron = window.require('electron');
const fs = window.require('fs');

class Updates {
    
    writeToFile = (location, data) => {
        fs.writeFile(location, JSON.stringify(data), (err) => {
            if (err) throw err;
            console.log('done');
      })
    }
}


const contentUpdates = new Updates()
export default contentUpdates