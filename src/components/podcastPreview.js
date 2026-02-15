import { GenreService } from "../utils/GenreService.js";
import { DateUtils } from "../utils/DateUtils.js";

// template for the podcast preview card
const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    .card {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.2s;
    }

    .card:hover {
      transform: scale(1.02);
    }

    .card img {
      width: 100%;
      border-radius: 6px;
    }

    .card h3 {
      margin: 0.5rem 0;
    }

    .card p {
      margin: 0px;
      font-size: 0.8rem;
      color: #555;
    }

    .tags {
      margin: 0.5rem 0;
    }

    .tag {
      background: #eee;
      padding: 0.3rem 0.6rem;
      margin-right: 0.5rem;
      margin-top: 0.5rem;
      border-radius: 4px;
      display: inline-block;
      font-size: 0.8rem;
    }

    .updated-text {
      font-size: 0.8rem;
      color: #555;
    }

    @media (max-width: 480px) {
      .card h3 {
        font-size: 1rem;
      }
    }
  </style>
  <div class="card">
    <img />
    <h3></h3>
    <p class="seasons"></p>
    <div class="tags"></div>
    <p class="updated-text"></p>
  </div>
`;

// PodcastPreview Web Component
class PodcastPreview extends HTMLElement {
  
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    // object to hold references to key elements for easy updates
    this.elements = {
      card: shadow.querySelector(".card"),
      img: shadow.querySelector("img"),
      title: shadow.querySelector("h3"),
      seasons: shadow.querySelector(".seasons"),
      tags: shadow.querySelector(".tags"),
      updated: shadow.querySelector(".updated-text"),
    };
  }

  // method to set the podcast data and trigger rendering
  setPodcast(podcast) {
    this._podcast = podcast;
    this.renderPodcast();
  }

 // method to render the podcast data into the card
  renderPodcast() {
    if (!this._podcast) return;

    const { image, title, seasons, genres, genreNames, updated, formattedDate } = this._podcast;
    
    const resolvedGenreNames = genreNames || GenreService.getNames(genres);
    
    const displayDate = formattedDate || DateUtils.format(updated);

    this.elements.img.src = image;
    this.elements.img.alt = `${title} cover`;
    this.elements.title.textContent = title;
    this.elements.seasons.textContent = `${seasons} season${seasons > 1 ? "s" : ""}`;
    this.elements.tags.innerHTML = resolvedGenreNames
      .map((g) => `<span class="tag">${g}</span>`)
      .join("");
    this.elements.updated.textContent = displayDate;

    // add click event listener to dispatch a custom event when the card is clicked
    this.elements.card.onclick = () => {
      this.dispatchEvent(
        new CustomEvent("podcast-selected", {
          detail: { podcast: this._podcast },
          bubbles: true,
          composed: true,
        })
      );
    };
  }
}

// register the custom element so it can be used in HTML as <podcast-preview>
customElements.define("podcast-preview", PodcastPreview);

export { PodcastPreview };
