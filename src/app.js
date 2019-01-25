const url = 'https://api.myjson.com/bins/azz4s';
const templates = [];

let promise = (url) => {
    fetch(url)
        .then(res => {
            return res.json();
        })
        .then(data => {
            renderTable(data)
        })
        .catch(err => {
            console.error('Something goes wrong ', err)
        });
}

const container = document.querySelector("#container");

function renderTable(templates) {
    const data = templates
        .map(({ id, name, modified }) => ({
            id,
            name,
            modified: new Date(modified).toISOString()
        }));

    container.innerHTML = tableTmpl(data);
}

function tableTmpl(data) {
    const tbody = data.map(({ id, name, modified }) => `
        <tr>
          <td><a href="/${id}">${id}</a></td>
          <td>${name}</td>
          <td>${modified}</td>
        </tr>`)
        .join('');

    return `<table id="templates">
      <thead>
      <tr class="line">
        <th>ID</th>
        <th>Name</th>
        <th>Modified</th>
      </tr>
      </thead>
      <tbody>${tbody}</tbody>
    </table>`;
}

function renderTemplate(tid) {
    const template = templates.find(({ id }) => id === tid);
    if (template) {
        container.innerHTML = templateTmpl(template);
    } else {
        container.innerHTML = `<p>Unknown template</p>`;
    }
}

function templateTmpl(data) {
    return `<form>
    ${Object.keys(data).map((key) => {
        const val = data[key];
        return `<p>
        <label>${key}</label>
        <textarea name="${key}">${val}</textarea>
      </p>`
    }).join('')}
    <button type="submit">Save</button>
    </form>`;
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
    promise(url);
}

render("/");

window.onpopstate = function () {
    render(document.location.pathname);
};

document.addEventListener('click', (e) => {
    if (e.target.tagName === "A") {
        e.preventDefault();

        const href = e.target.getAttribute('href');
        render(href);
    }
});

document.addEventListener('submit', (e) => {
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
})
