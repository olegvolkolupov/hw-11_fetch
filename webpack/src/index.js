import "lodash";
import { alert } from "@pnotify/core";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/core/dist/PNotify.css";
import "./styles.css"

class CountryInfo {
  constructor(uri, refs) {
    this.uri = uri;
    this.refs = refs;
  }

  createTable(data) {
    let table = document.createElement('table');
    table.classList.add("table");

    let tableBody = document.createElement('tbody');
    tableBody.classList.add("table__body");
  
      let row1 = document.createElement('tr');
      row1.innerHTML += `<td>Country:</td>`;
      row1.innerHTML += `<td>${data.name.official}</td>`;
      tableBody.append(row1);

      let row2 = document.createElement('tr');
      row2.innerHTML += `<td>Capital:</td>`;
      row2.innerHTML += `<td>${data.capital[0]}</td>`;
      tableBody.append(row2);

      let row3 = document.createElement('tr');
      row3.innerHTML += `<td>Population:</td>`;
      row3.innerHTML += `<td>${data.population}</td>`;
      tableBody.append(row3);

      let row4 = document.createElement('tr');
      row4.innerHTML += `<td>Languages:</td>`;
      let langArray = Object.values(data.languages);
      if(langArray.length === 1){
        row4.innerHTML += `<td>${langArray[0]}</td>`;
      } else {
        let str = langArray.map(language =>language);
        row4.innerHTML += `<td>${str}</td>`;
      }

      tableBody.append(row4);

      let row5 = document.createElement('tr');
      row5.innerHTML += `<td>Flag:</td>`;
      row5.innerHTML += `<td><img src=${data.flags.png} alt="Flag image"</td>`;
      tableBody.append(row5);

      let row6 = document.createElement('tr');
      row6.innerHTML += `<td>Coat of Arms:</td>`;
      row6.innerHTML += `<td><img src=${data.coatOfArms.png} alt="Flag image"</td>`;
      tableBody.append(row6);

      table.append(tableBody);

      this.refs.dataRef.append(table);
     }

  // название, столица, население, языки и флаг.
  renderInfo = (info) => {
    // let data = info[0];
    this.refs.dataRef.innerHTML = "";

    this.createTable(info[0]);
/*
    // название страны
    let contryName = document.createElement("h1");
    contryName.textContent = data.name.official;
    this.refs.dataRef.append(contryName);

    // столица
    let capital = document.createElement("h2");
    capital.textContent = "Capital: " + data.capital[0]; 
    this.refs.dataRef.append(capital);

    // население
    let population = document.createElement("h3");
    population.textContent = "Population: " + data.population; 
    this.refs.dataRef.append(population);

    // языки languages
    let languages = document.createElement("p");
    let langArray = Object.values(data.languages);
    let h3Ref = document.createElement("h3");
    h3Ref.textContent = "Languages:"
    languages.append(h3Ref);
    langArray.forEach(elem => languages.append(elem));
    this.refs.dataRef.append(languages);

    // флаг
    let flagImg = document.createElement("img");
    flagImg.src = data.flags.png;
    flagImg.alt = "Flag image";
    this.refs.dataRef.append(flagImg);

    // герб
    let coatOfArmsImg = document.createElement("img");
    coatOfArmsImg.src = data.coatOfArms.png;
    coatOfArmsImg.alt = "Coat of arms image";
    this.refs.dataRef.append(coatOfArmsImg);
*/
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
        let dataLength = data.length;
        if (dataLength > 10) {
          alert({
            text: "Укажите более точное название страны.",
            type: "notice",
          });
          return null;
        } else if (dataLength > 2) {
          this.refs.dataRef.innerHTML = "";
          data.forEach( elem => {
            let name = document.createElement("h2")
            name.textContent = elem.name.official;
            this.refs.dataRef.append(name);
          });
        } else {
          this.renderInfo(data);
        }
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

  loadListeners() {
    this.refs.inputSearchByName.addEventListener(
      "input",
      _.debounce(this.onInputCountryName, 500)
    );
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
