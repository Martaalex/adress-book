const localStorageKey = "contacts";
let contacts = [];
let search = '';

const select = selector => document.querySelector(selector);
const createEl = (tag, properties) => {
    const el = document.createElement(tag);

    if (properties) {
    Object.entries(properties).forEach(keyValuePair =>{
        el[keyValuePair[0]] = keyValuePair[1];
    });
}
  
   return el;
}

const update = () => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(contacts));
    render();
};

const render = () => {
    console.log('search is', search);
    const constDiv = select('#contacts');
    constDiv.innerHTML = null;

    contacts.filter(contact => {
        return (contact.name.includes(search) || contact.email.includes(search) || contact.phone.includes(search));
    }).forEach((contact, index) => {

        const fieldContainer = contact.isEditing ? 'input' : 'div';
        const container = createEl('div');
        const name = createEl(fieldContainer, {
          [contact.isEditing ? 'value' : 'textContent'] : contact.name  
        });

        const email = createEl(fieldContainer, {
            [contact.isEditing ? 'value' : 'textContent'] : contact.email
        });
        const phone = createEl(fieldContainer, {
            [contact.isEditing ? 'value' : 'textContent'] : contact.phone
        });
        const deleteButton = createEl('button', {textContent: "X"});
        const editButton = createEl('button', {textContent: contact.isEditing ? 'save' : '🖋 Edit'});
        const favorite = createEl('button', {textContent: contact.isFavorite ? 'remove' : '❤️ add'});

        if (!contact.isEditing) {
          
            email.textContent = `📧:${contact.email}`;
            phone.textContent = `📱:${contact.phone}`;
        }
      
       

        container.appendChild(name);
        container.appendChild(phone);
        container.appendChild(email);
        container.appendChild(deleteButton);
        container.appendChild(editButton);
        container.appendChild(favorite);

        editButton.addEventListener('click', () => {

            if (contact.isEditing) {
                contacts[index].name = name.value;
                contacts[index].email = email.value;
                contacts[index].phone = phone.value;
            }
            contacts[index].isEditing = !contact.isEditing;

            update();
        });

        deleteButton.addEventListener('click', () => {
            contacts.splice(index, 1);
            update();
        });

        favorite.addEventListener('click', () => {
            contacts[index].isFavorite = !contact.isFavorite;
            update();
        });

        constDiv.appendChild(container);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    contacts = JSON.parse(window.localStorage.getItem(localStorageKey)) || [];
    render();
});

select('.search input[name="search"]')
    .addEventListener('input', e => {
        search = e.target.value;
        render();
    });

select('#new-contact button[name="add-contact"]')
    .addEventListener('click', e => {
        const newContact = {
            name: select('#new-contact input[name="name"]').value,
            email: select('#new-contact input[name="email"]').value,
            phone: select('#new-contact input[name="phone"]').value,
            isFavorite: false,
            isEditing: false
        };

        contacts.push(newContact);
        update();
    });
