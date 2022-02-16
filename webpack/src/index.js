import "lodash";
import { alert } from "@pnotify/core";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/core/dist/PNotify.css";
import "./styles.css";

class CountryInfo {
  constructor(uri, refs) {
    this.uri = uri;
    this.refs = refs;
  }

  createTable(data) {
    let table = document.createElement("table");
    table.classList.add("table");

    let tableBody = document.createElement("tbody");
    tableBody.classList.add("table__body");

    let row1 = document.createElement("tr");
    row1.innerHTML += `<td>Country:</td>`;
    row1.innerHTML += `<td><b>${data.name.common}</b></td>`;
    tableBody.append(row1);

    let row1a = document.createElement("tr");
    row1a.innerHTML += `<td>Official name:</td>`;
    row1a.innerHTML += `<td>${data.name.official}</td>`;
    tableBody.append(row1a);

    let row2 = document.createElement("tr");
    row2.innerHTML += `<td>Capital:</td>`;
    row2.innerHTML += `<td>${data.capital[0]}</td>`;
    tableBody.append(row2);

    let row3 = document.createElement("tr");
    row3.innerHTML += `<td>Population:</td>`;
    row3.innerHTML += `<td>${data.population}</td>`;
    tableBody.append(row3);

    let row4 = document.createElement("tr");
    row4.innerHTML += `<td>Languages:</td>`;
    let langArray = Object.values(data.languages);
    if (langArray.length === 1) {
      row4.innerHTML += `<td>${langArray[0]}</td>`;
    } else {
      let str = langArray.map((language) => language);
      row4.innerHTML += `<td>${str}</td>`;
    }

    tableBody.append(row4);

    let row5 = document.createElement("tr");
    row5.innerHTML += `<td>Flag:</td>`;
    row5.innerHTML += `<td><img src=${data.flags.png} alt="Flag image"</td>`;
    tableBody.append(row5);

    let row6 = document.createElement("tr");
    row6.innerHTML += `<td>Coat of Arms:</td>`;
    row6.innerHTML += `<td><img src=${data.coatOfArms.png} alt="Flag image"</td>`;
    tableBody.append(row6);

    table.append(tableBody);

    return table;
  }

  createList(dataArr) {
    let ul = document.createElement("ul");
    let dataItems = dataArr.map(({ name }) => {
      let li = document.createElement("li");
      let a = document.createElement("a");
      let h2 = document.createElement("h2");

      a.href = "";
      h2.textContent = name.common;
      a.append(h2);
      li.append(a);

      return li;
    });

    ul.append(...dataItems);

    return ul;
  }

  // название, столица, население, языки и флаг.
  renderInfo = (infoArr) => {
    this.refs.dataRef.innerHTML = "";
    let infoArrLength = infoArr.length;

    if (infoArrLength > 10) {
      alert({
        text: "Укажите более точное название страны.",
        type: "notice",
      });
    } else {
      this.refs.dataRef.append(
        infoArrLength > 2
          ? this.createList(infoArr)
          : this.createTable(infoArr[0])
      );
    }
  };

  fetchCountryInfo = (inputValue) => {
    fetch(this.uri + inputValue)
      .then((res) => {
        if (!res.ok) {
          alert({
            title: `Status: ${res.status}`,
            text: `Country ${res.statusText}`,
            type: "notice",
          });
        }
        return res.json();
      })
      .then((data) => {
        this.renderInfo(data);
      })
      .catch((err) => {
        alert({
          title: "Error",
          text: `${err}`,
          type: "notice",
        });
      });
  };

  onInputCountryName = (event) => {
    if (event.target.value) {
      this.fetchCountryInfo(event.target.value);
    }
  };

  onRefClick = (event) => {
    event.preventDefault();
    if (event.target.nodeName !== "H2") {
      return;
    }
    this.fetchCountryInfo(event.target.innerHTML);
  };

  loadListeners() {
    this.refs.inputSearchByName.addEventListener(
      "input",
      _.debounce(this.onInputCountryName, 500)
    );
    this.refs.dataRef.addEventListener("click", this.onRefClick);
  }

  init = () => {
    this.loadListeners();
  };
}

const uri = "https://restcountries.com/v3.1/name/";

let refs = {
  inputSearchByName: document.querySelector('input[type="text"]'),
  dataRef: document.querySelector(".data"),
};

let countryInfo = new CountryInfo(uri, refs);
countryInfo.init();
