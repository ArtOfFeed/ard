const path = 'https://api.myjson.com/bins/azz4s';

let promise = fetch(path)
    .then(res => {
        return res.json();
    })
    .then(data => {
        renderList(data);
    })

const renderList = (array) => {
    const wrapperList = document.querySelector('#list');
    array.forEach(element => {
        let listItem = document.createElement('li');
        listItem.textContent = element.name;
        wrapperList.appendChild(listItem);
    });
}

