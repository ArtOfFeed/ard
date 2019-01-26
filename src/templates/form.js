function templateTmpl(data) {
    return `<form>
    ${Object.keys(data).map(key => {
        const val = data[key];
        return `<div class="text_field">
            <textarea class="${key}" name="${key}" required>${val}</textarea>
            <hr>
            <label>${key}</label>
        </div>`;
    }).join("")}
    <button type="submit">Save</button>
    </form>`;
}

export default templateTmpl;