import table from './templates/table';
import form from './templates/form'

const url = 'https://api.myjson.com/bins/azz4s';
const container = document.querySelector("#container");
let templates = [];

fetch(url)
    .then(res => {
        return res.json();
    })
    .then(data => {
        templates = data;
        render(document.location.pathname);
    })
    .catch(err => {
        console.error('Something goes wrong ', err)
    });

function renderTable() {
    const data = templates.map(({ id, name, modified }) => ({
        id,
        name,
        modified: new Date(modified).toLocaleDateString() + ' ' + new Date(modified).toLocaleTimeString()
    }));

    container.innerHTML = table(data);
}

function renderTemplate(tid) {
    const template = templates.find(({ id }) => id === tid);
    if (template) {
        container.innerHTML = form(template);
    } else {
        container.innerHTML = `<p>Unknown template</p>`;
    }
}



function updateTemplate(data) {
    let template = templates.find(({ id }) => id === data.id);
    if (template) {
        const index = templates.indexOf(template);
        template = Object.assign(template, data);
        templates = templates.slice(0, index).concat(template, templates.slice(index + 1));
    } else {
        templates = templates.concat(data);
    }
}

function render(path) {
    window.history.pushState({}, `Page ${path}`, path);

    const id = path.substring(1);
    const tid = parseInt(id, 10);
    if (!isNaN(tid)) {
        renderTemplate(tid);
        return;
    }
    renderTable();
}

window.onpopstate = function () {
    render(document.location.pathname);
};

document.addEventListener("click", e => {
    if (e.target.tagName === "A") {
        e.preventDefault();

        const href = e.target.getAttribute("href");
        render(href);
    }
});

document.addEventListener("submit", e => {
    e.preventDefault();

    let data = Object.keys(e.target.elements).reduce((acc, i) => {
        const el = e.target.elements[i];
        if (el.name) {
            acc[el.name] = el.value;
        }
        return acc;
    }, {});

    data.id = parseInt(data.id, 10);
    data.modified = Date.now();

    if (!isNaN(data.id)) {
        updateTemplate(data);
        renderTemplate(data.id);

        render("/");
    }
});