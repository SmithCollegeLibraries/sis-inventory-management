const electron = window.require('electron');
const fs = window.require('fs');

class Load {

    loadFromFile = (location) => {
        const items = fs.readFileSync(location, 'utf8')
        let result
        try {
           result = JSON.parse(items);
         } catch(error) {
           result = {};
         }
        return result 
    }

}
const load = new Load()
export default load
