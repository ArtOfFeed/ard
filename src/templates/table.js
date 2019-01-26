function tableTmpl(data) {
    const tbody = data.map(({ id, name, modified }) => `
        <tr>
          <td><a href="/${id}">${id}</a></td>
          <td>${name}</td>
          <td>${modified}</td>
        </tr>`
    ).join("");

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

export default tableTmpl;