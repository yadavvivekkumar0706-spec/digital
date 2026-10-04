console.log("JavaScript is connected!");

const button = document.getElementById("create-list-btn");
const form = document.getElementById("create-list-form");
const input = document.getElementById("list-name");
const saveButton = document.getElementById("save-list-btn");
const listsContainer = document.getElementById("lists-container");

let lists = JSON.parse(localStorage.getItem("digitalLists")) || [];

function saveData() {
    localStorage.setItem("digitalLists", JSON.stringify(lists));
}

function updateProgress(list, progress) {
    const total = list.items.length;

    const completed = list.items.filter(function(item) {
        return item.completed;
    }).length;

    progress.textContent = `${completed} / ${total} completed`;
}

function displayLists() {

    listsContainer.innerHTML = "";

    lists.forEach(function(list, listIndex) {

        const newList = document.createElement("div");
        newList.className = "list-card";

        newList.innerHTML = `
            <div class="list-header">
                <h3>🛒 ${list.name}</h3>
                <button class="delete-list-btn">Delete</button>
            </div>

            <div class="item-input">
                <input type="text" placeholder="Enter item">
                <button>Add</button>
            </div>

            <div class="items"></div>

            <p class="progress">0 / 0 completed</p>
        `;

        const itemInput =
            newList.querySelector(".item-input input");

        const addItemButton =
            newList.querySelector(".item-input button");

        const itemsContainer =
            newList.querySelector(".items");

        const progress =
            newList.querySelector(".progress");

        const deleteButton =
            newList.querySelector(".delete-list-btn");


        // DISPLAY ITEMS

        list.items.forEach(function(item, itemIndex) {

            const itemDiv = document.createElement("div");

            itemDiv.className = "shopping-item";

            itemDiv.innerHTML = `
                <label>
                    <input
                        type="checkbox"
                        class="item-checkbox"
                        ${item.completed ? "checked" : ""}
                    >
                    <span>${item.name}</span>
                </label>

                <button class="delete-item-btn">
                    Delete
                </button>
            `;

            const checkbox =
                itemDiv.querySelector(".item-checkbox");

            const deleteItemButton =
                itemDiv.querySelector(".delete-item-btn");


            // CHECKBOX

            if (item.completed) {
                itemDiv.style.textDecoration = "line-through";
            }

            checkbox.addEventListener("change", function() {

                item.completed = checkbox.checked;

                if (checkbox.checked) {
                    itemDiv.style.textDecoration = "line-through";
                } else {
                    itemDiv.style.textDecoration = "none";
                }

                updateProgress(list, progress);
                saveData();
            });


            // DELETE ITEM

            deleteItemButton.addEventListener("click", function() {

                list.items.splice(itemIndex, 1);

                saveData();

                displayLists();
            });


            itemsContainer.appendChild(itemDiv);
        });


        updateProgress(list, progress);


        // ADD ITEM

        addItemButton.addEventListener("click", function() {

            const itemName = itemInput.value.trim();

            if (itemName === "") {
                alert("Please enter an item!");
                return;
            }

            list.items.push({
                name: itemName,
                completed: false
            });

            saveData();

            displayLists();
        });


        // DELETE LIST

        deleteButton.addEventListener("click", function() {

            lists.splice(listIndex, 1);

            saveData();

            displayLists();
        });


        listsContainer.appendChild(newList);
    });
}


// CREATE LIST FORM

button.addEventListener("click", function() {
    form.style.display = "block";
});


// CREATE NEW LIST

saveButton.addEventListener("click", function() {

    const listName = input.value.trim();

    if (listName === "") {
        alert("Please enter a list name!");
        return;
    }

    lists.push({
        name: listName,
        items: []
    });

    saveData();

    displayLists();

    input.value = "";
});


// LOAD SAVED DATA

displayLists();
