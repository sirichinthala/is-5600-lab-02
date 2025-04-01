document.addEventListener('DOMContentLoaded', () => {
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);
    
    generateUserList(userData, stocksData);

    document.querySelector('#btnDelete').addEventListener('click', (event) => {
        event.preventDefault();
        const userId = document.querySelector('#userID').value;
        const userIndex = userData.findIndex(user => user.id == userId);
        
        if (userIndex !== -1) {
            userData.splice(userIndex, 1);
            generateUserList(userData, stocksData);
        }
    });

    document.querySelector('#btnSave').addEventListener('click', (event) => {
        event.preventDefault();
        const id = document.querySelector('#userID').value;
        const user = userData.find(user => user.id == id);
        
        if (user) {
            const fields = ['firstname', 'lastname', 'address', 'city', 'email'];
            fields.forEach(field => {
                user.user[field] = document.querySelector(`#${field}`).value;
            });
            generateUserList(userData, stocksData);
        }
    });
});

function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = '';

    users.forEach(({ user, id }) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${user.lastname}, ${user.firstname}`;
        listItem.setAttribute('id', id);
        userList.appendChild(listItem);
    });

    userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
}

function handleUserListClick(event, users, stocks) {
    const userId = event.target.id;
    const user = users.find(user => user.id == userId);
    
    if (user) {
        populateForm(user);
        renderPortfolio(user, stocks);
    }
}

function populateForm({ user, id }) {
    const fields = ['firstname', 'lastname', 'address', 'city', 'email'];
    document.querySelector('#userID').value = id;
    
    fields.forEach(field => {
        document.querySelector(`#${field}`).value = user[field];
    });
}

function renderPortfolio(user, stocks) {
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = '';
    
    user.portfolio.forEach(({ symbol, owned }) => {
        const symbolEl = document.createElement('p');
        const sharesEl = document.createElement('p');
        const actionEl = document.createElement('button');
        
        symbolEl.innerText = symbol;
        sharesEl.innerText = owned;
        actionEl.innerText = 'View';
        actionEl.setAttribute('id', symbol);
        
        portfolioDetails.append(symbolEl, sharesEl, actionEl);
    });

    portfolioDetails.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            viewStock(event.target.id, stocks);
        }
    });
}

function viewStock(symbol, stocks) {
    const stock = stocks.find(s => s.symbol == symbol);
    if (stock) {
        const stockArea = document.querySelector('.stock-form');
        if (stockArea) {
            document.querySelector('#stockName').textContent = stock.name;
            document.querySelector('#stockSector').textContent = stock.sector;
            document.querySelector('#stockIndustry').textContent = stock.subIndustry;
            document.querySelector('#stockAddress').textContent = stock.address;
            document.querySelector('#logo').src = `logos/${symbol}.svg`;
            document.querySelector('#logo').alt = `${symbol} stock image`;
        }
    }
}
