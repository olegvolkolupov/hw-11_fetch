import "lodash";
import { alert } from "@pnotify/core";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/core/dist/PNotify.css";
import { xor } from "lodash";

class CountryInfo {
  constructor(uri, refs) {
    this.uri = uri;
    this.refs = refs;
  }

  // название, столица, население, языки и флаг.
  renderInfo = (info) => {
    let data = info[0];

    this.refs.dataRef.innerHTML = "";
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
