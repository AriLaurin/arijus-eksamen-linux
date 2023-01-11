db.collection("reinsdyr").add(
    {"Navn": "Guovdageainnut", "Flokk_tilhørighet": "Guovdageainnu", "Fødselsdato": "18. november, 2019", "Serienummer": "G1-2019", "id": "181119567"}
)
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});