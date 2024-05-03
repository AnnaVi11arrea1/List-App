import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Make sure html script type="module" !

const appSettings = {
    databaseURL: "https://list-app-8b827-default-rtdb.firebaseio.com/" // location of database
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsInDB = ref(database, "list") // reference database, give it a name "list"


const addbtn = document.getElementById("add-button")
const inpt = document.getElementById("input-field")
const listEl = document.getElementById("list")

const instructions = document.getElementById("instructions")
    
function today(){
    let today = new Date()
    
    instructions.innerHTML = `<em><span id="quotes">" </span> Lets get organized!
    Today is ${today.toLocaleDateString("en-US")}. 
    <h4>Delete an item by tapping on it.
    <span id=quotes>"</quotes>
    </h4></em>` 
}

today()

addbtn.addEventListener("click", function() {
    let inptValue = inpt.value

    push(itemsInDB, inptValue) // push is a firebase function that puts the data into database

    clearInput()
})


onValue(itemsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        console.log(snapshot.val())
        clearListEL()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            placeInput(currentItem)  
        } 
       
    } else { 
        listEl.textContent = "No items here... yet" // Show nothing when there is nothing
    }})


function clearListEL() {
    listEl.innerHTML = ""
}

function clearInput() {
    inpt.value = ""
}

function placeInput(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    newEl.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `list/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    listEl.append(newEl)
}