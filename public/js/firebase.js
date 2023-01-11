// db.collection("beiteområde").add(
//     {"navn": "Sør", "Fylke": "Trøndelag", "id": "23828"}
// )
// .then((docRef) => {
//     console.log("Document written with ID: ", docRef.id);
// })
// .catch((error) => {
//     console.error("Error adding document: ", error);
// });

const div = document.querySelector('#results'); //grab result tag
const searchField = document.querySelector('.input-search'); //grab our input

// ALL FUNCTIONS --------------------------------------------------------
const displayResult = function(obj) { //These template strings display HTML if our search result = true (exists)
    console.log(obj);
    if (obj.personummer) {
        let html = `
        <div id="${obj.personummer}">
            <h3>navn: ${obj.navn}</h3>
            <p><b>kontaktspråk:</b> ${obj.kontaktspråk}</p>
            <p><b>Tlf:</b> ${obj.telefonnummer}</p>
            <p><b>Personnummer:</b> ${obj.personummer}</p>
        </div>
        `;

        div.innerHTML += html;
    } else if (obj.id.length === 6) { //only flokk has an id with the length of 6
        let html = `
        <div id="${obj.id}">
            <h3>Flokknavn: ${obj.Flokknavn}</h3>
            <p><b>Eier:</b> ${obj.Eier}</p>
            <p><b>Serieinndeling:</b> ${obj.Serieinndeling}</p>
            <p><b>Buemerke:</b> ${obj.Buemerke}</p>
            <img src="${obj.img}" style="max-width: 120px; max-height: 100px;" alt="flokkBilde"></img>
        </div>
        `;

        div.innerHTML += html;
    } else if (obj.id.length === 9) { //only flokk has an id with the length of 9
        let html = `
        <div id="${obj.id}">
            <h3>navn: ${obj.Navn}</h3>
            <p><b>Fødselsdato:</b> ${obj.Fødselsdato}</p>
            <p><b>Tilhørighet:</b> ${obj.Flokk_tilhørighet}</p>
            <p><b>Serienummer:</b> ${obj.Serienummer}</p>
        </div>
        `;

        div.innerHTML += html;
    } else if (obj.id.length === 5) { //only flokk has an id with the length of 5
        let html = ` 
        <div id="${obj.Navn}">
            <h3>navn: ${obj.Navn}</h3>
            <p><b>Fylke:</b> ${obj.Fylke}</p>
        </div>
        `;

        div.innerHTML += html;
    }
}

const displayObjs = function(objs) { //gets an array of the objects, loops them and calls the displayResult
    objs.forEach(obj => {
        displayResult(obj);
    });
}

const searchProperties = function(rawInput, array) {
    if (rawInput.trim().length === 0) { // creates a raw input, removing spaces, if length is 0 (didnt write anything) show everything
        displayObjs(array);
    } else { //if there is a search input length
        let newArr = array.slice(0); // function should be non-destructive, else anything that matches with first result, will get removed, makes a local array inside the function to stop this
        const inputs = rawInput.trim().toLowerCase().split(' '); //we take our input, trim it to remove spaces and lowercase, and split it by space so input field becomes an array of values

        newArr.forEach(obj => { //looping through new local array
            obj.Relevance = 0; //we set relevance to 0, we come back to this later
            let allProps = ''; //in the current object, it will save every property value into a string, so its easier to see if current word matches our search
            for (prop in obj) { //for every property in object, we ignore id in the search, because we will get random results
                if (prop !== 'id') { //if the property name is not id, add it to the allprops string
                    allProps += obj[prop];
                }
            }

            inputs.forEach(input => { //loop through every word in the input array
                if (allProps.toLowerCase().includes(input)) { //if all props, to lower case, includes the current input word, the object relevance will increase with the length of the input
                    obj.Relevance += input.length; //so the longest word will appear first
                }
            });
        });

        newArr.sort((a, b) => b.Relevance - a.Relevance); //local array is sorted so the highest relevance will come first in the array
        let lastLoop = false; // we need this to stop the loop when it has found the result
        let i = 0; // so we can get the index of which object has the relevance of 0
        newArr.forEach(obj => { 
            if (lastLoop) { //if last loop has finished, break out
                return;
            } else { //checks if the relevance is less than 1, if so, the array will be shortened so the array will not have a object with the relevance of 0
                if (obj.Relevance < 1) {
                    newArr.length = i;
                    lastLoop = true;
                }
                i++;
            }
        });

        displayObjs(newArr); //displays relevant objects in html
    }
}

// RUN -------------------------------------------------------------------------------------

// fetch data
let dataArr = [];
db.collection('eier').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        const data = doc.data();
        dataArr.push(data);
    });
    db.collection('flokk').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            dataArr.push(data);
        });
        db.collection('reinsdyr').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                dataArr.push(data);
            });
            db.collection('beiteområde').get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    dataArr.push(data);
                });
                // display before search
                searchProperties(searchField.value, dataArr) //if you reload the page with information in the searchbar, it will automatically search for it
            });
        });
    });
});

// search field
searchField.addEventListener('input', () => {
    // clear tidligere elementer
    div.innerHTML = '';

    // search through array
    searchProperties(searchField.value, dataArr); //takes the input of the field, fetch array from database, and gives function access to them
});