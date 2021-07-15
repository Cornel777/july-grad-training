import * as _ from "lodash";

window.addEventListener("load", () => {
    const header = document.createElement("h1");
    header.innerText = "Front End HTML and CSS Assignment"
    const body = document.querySelector("body");
    body.appendChild(header);
    const fe = [{id: 0, name: "html"}, {id: 1, name: "css"}]
    const element = document.createElement("h2")
    element.innerText = _.find(fe, {id: 1})?.name;
    body.appendChild(element);
});