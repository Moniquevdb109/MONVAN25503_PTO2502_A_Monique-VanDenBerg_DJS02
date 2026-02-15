import { GenreService } from "../utils/GenreService.js";
import { DateUtils } from "../utils/DateUtils.js";

/**
 * Template containing the markup and styles for the podcast preview card.
 * Created once and cloned for each component instance to improve performance.
 * Uses Shadow DOM to encapsulate styles and prevent CSS conflicts.
 * 
 * @constant {HTMLTemplateElement}
 */
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

/**
 * PodcastPreview Web Component
 * 
 * A reusable, self-contained custom HTML element for displaying podcast preview cards.
 * Implements the Web Component standard using Shadow DOM for encapsulation.
 * 
 * @class PodcastPreview
 * @extends HTMLElement
 * 
 * @element podcast-preview
 * 
 * @fires podcast-selected - Dispatched when the user clicks on the card.
 * Event detail contains the complete podcast data object.
 * 
 * @property {Object} _podcast - Internal storage for podcast data (private)
 * @property {Object} elements - References to Shadow DOM elements for efficient updates
 * 
 */
class PodcastPreview extends HTMLElement {
  
    /**
   * Creates an instance of PodcastPreview.
   * Initializes the Shadow DOM and clones the template for style encapsulation.
   * Sets up references to key DOM elements for efficient updates.
   * 
   * @constructor
   */
  constructor() {
    super();
    // Attach a shadow root to the element and clone the template content into it
    const shadow = this.attachShadow({ mode: "open" });
    // Clone the template content and append it to the shadow root
    // cloneNode(true) creates a deep copy including all child nodes
    shadow.appendChild(template.content.cloneNode(true));

     /**
     * Object containing references to DOM elements inside the Shadow DOM.
     * Storing references improves performance by avoiding repeated querySelector calls.
     * 
     * @type {Object.<string, HTMLElement>}
     * @property {HTMLDivElement} card - The main card container
     * @property {HTMLImageElement} img - The podcast cover image
     * @property {HTMLHeadingElement} title - The podcast title heading
     * @property {HTMLParagraphElement} seasons - The seasons count paragraph
     * @property {HTMLDivElement} tags - The genre tags container
     * @property {HTMLParagraphElement} updated - The last updated date paragraph
     */
    this.elements = {
      card: shadow.querySelector(".card"),
      img: shadow.querySelector("img"),
      title: shadow.querySelector("h3"),
      seasons: shadow.querySelector(".seasons"),
      tags: shadow.querySelector(".tags"),
      updated: shadow.querySelector(".updated-text"),
    };
  }

    /**
   * Sets the podcast data and triggers UI rendering.
   * This method accepts podcast data from the parent application,
   * which may include pre-formatted genre names and dates.
   * 
   * @param {Object} podcast - The podcast data object
   * @param {string} podcast.id - Unique podcast identifier
   * @param {string} podcast.title - Podcast title
   * @param {string} podcast.image - URL to podcast cover image
   * @param {number} podcast.seasons - Number of seasons
   * @param {number[]} podcast.genres - Array of genre IDs
   * @param {string[]} [podcast.genreNames] - Pre-formatted genre names (optional)
   * @param {string} podcast.updated - ISO date string of last update
   * @param {string} [podcast.formattedDate] - Pre-formatted date string (optional)
   * 
   * });
   */

  setPodcast(podcast) {
    // Store the podcast data in a private property for later use in rendering
    this._podcast = podcast;
    // Render the podcast data into the card UI
    this.renderPodcast();
  }
  /**
   * Renders the podcast data into the Shadow DOM.
   * Updates all UI elements with current podcast information.
   * Resolves genre names and formats dates if not already provided.
   * Attaches a click event listener to dispatch a custom event.
   * 
   * @private
   * 
   * @fires podcast-selected - Custom event with podcast data in event.detail
   * 
   * @returns {void}
   */
  renderPodcast() {
    if (!this._podcast) return;

    const { image, title, seasons, genres, genreNames, updated, formattedDate } = this._podcast;
    
    const resolvedGenreNames = genreNames || GenreService.getNames(genres);
    
    const displayDate = formattedDate || DateUtils.format(updated);

    // Update the DOM elements with the podcast data
    this.elements.img.src = image;
    this.elements.img.alt = `${title} cover`;
    this.elements.title.textContent = title;
    this.elements.seasons.textContent = `${seasons} season${seasons > 1 ? "s" : ""}`;
    this.elements.tags.innerHTML = resolvedGenreNames
    // Generate genre tags HTML
    // Map each genre name to a <span> tag and join into a single string
      .map((g) => `<span class="tag">${g}</span>`)
      .join("");
      // Set the formatted date text content
    this.elements.updated.textContent = displayDate;

    /**
     * Attach click event listener to the card.
     * Dispatches a custom 'podcast-selected' event that bubbles up the DOM
     * and crosses the Shadow DOM boundary (composed: true).
     * 
     * The event detail contains the complete podcast object,
     * allowing parent components to access all podcast data.
     */
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


customElements.define("podcast-preview", PodcastPreview);

export { PodcastPreview };
