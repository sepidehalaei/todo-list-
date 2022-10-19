// This module designed to add, edit, check, and remove an item from the todo list
// You can change the title

// Select elements from the html file(index.html):
const item_form = document.getElementById('item-form');
const new_item = document.getElementById('new-item');
const items_list = document.getElementById('items-list');
const notification = document.querySelector('.notification');

// Variables:
// The items variable is empty list for the first time running and data from the local storage for the next times
let items = JSON.parse(localStorage.getItem('items')) || [];
let edited_item_id = -1

// First time render to present stuff from the local storage 
renderItems();

// A submit of the item_form 
item_form.addEventListener('submit', function(event) {
    event.preventDefault();  //prevent from refreshing our page
    saveItem();
    renderItems();
    localStorage.setItem('items', JSON.stringify(items));
});

// Save item
function saveItem() {
    const item_value = new_item.value 

    // Check if the item is empty and user clicked on the plus icon
    const empty = item_value === '';

    // Check for duplicate items
    const duplicate = 
    items.some((item) => item.value.toUpperCase() === item_value.toUpperCase());

    if(empty) {
        showNotification('Nothing to add!');
    } else if(duplicate) {
        showNotification('Item already exists!');
    } else {
        if(edited_item_id >= 0) {
            // update the edited item
            items = items.map((item, item_index) => {
              return {
                  ...item,
                  value: item_index === edited_item_id ? item_value : item.value,
                }
            });
            edited_item_id = -1;
        } else {
            const item = {
                value: item_value,
                checked: false
            };
            items.push(item);
        } 
        new_item.value = '';
    }  
}

// Render items
function renderItems() {
    if(items.length === 0) {
        items_list.innerHTML = '<center> Add your first item :) </center>';
        return;
    }
    // Clear element before a re-render
    items_list.innerHTML = '';

    items.forEach((item, item_index) => {
        items_list.innerHTML += `
        <div class="item" id=${item_index}>
            <i class="bi ${item.checked ? 'bi-check-square-fill' : 'bi-square'}"
            data-action="check"></i>
            <p class="${item.checked ? 'checked' : ''}" data-action="check">${item.value}</p>
            <i class="bi bi-pencil-square" data-action="edit"></i>
            <i class="bi bi-trash" data-action="delete"></i>
        </div>`;
    });
}

// Click event listener for all the items
items_list.addEventListener('click', (event) => {
    const target = event.target;
    const parent_element = target.parentNode;
    if(parent_element.className !== 'item') return;

    // Get item id
    const item = parent_element;
    const item_id = Number(item.id);

    // Get target action
    const action = target.dataset.action;
    
    action === 'check' && checkItem(item_id);
    action === 'edit' && editItem(item_id);
    action === 'delete' && deleteItem(item_id);
})

// Action: check an item
function checkItem(item_id) {
    items = items.map((item, item_index) => {
        return {
            ...item,
            checked: item_index === item_id ? !item.checked : item.checked
        }
    });
    renderItems();
    localStorage.setItem('items', JSON.stringify(items));
}

// Action: edit an item
function editItem(item_id) {
    new_item.value = items[item_id].value;
    edited_item_id = item_id
}

// Action: delete an item 
function deleteItem(item_id) {
    items = items.filter((item, item_index) => item_index !== item_id);
    edited_item_id = -1;

    // Do re-render
    renderItems();
    localStorage.setItem('items', JSON.stringify(items));
}

function showNotification(msg) {
    // Change the message
    notification.innerHTML = msg;

    // Notification display
    notification.classList.add('notif-enter');

    // Notification leave
    setTimeout(() => {
        notification.classList.remove('notif-enter')
    }, 1000)
}
