import { createModal } from "../components/createModal.js";
import { GenreService } from "../utils/GenreService.js";
import { DateUtils } from "../utils/DateUtils.js";

/**
 * Grid Renderer - Responsible for rendering the grid of podcast cards.
 *
 * @principle SRP - Manages layout and rendering only; delegates card creation and modal logic elsewhere.
 */
export const createGrid = () => {
  const container = document.getElementById("podcastGrid");

  return {
     /**
     * Renders a list of podcast cards into the grid using Web Components.
     * Clears the container, creates a podcast-preview element for each podcast,
     * enriches the data with formatted genre names and dates, and sets up
     * event listeners to open the modal when a card is clicked.
     * 
     * @param {Object[]} podcastList - Array of podcast objects to render
     * @param {string} podcastList[].id - Unique podcast identifier
     * @param {string} podcastList[].title - Podcast title
     * @param {string} podcastList[].description - Podcast description
     * @param {string} podcastList[].image - URL to podcast cover image
     * @param {number} podcastList[].seasons - Number of seasons
     * @param {number[]} podcastList[].genres - Array of genre IDs
     * @param {string} podcastList[].updated - ISO date string of last update
     * 
     * @fires podcast-selected - Custom event dispatched by podcast-preview when clicked
     * 
     */
    render(podcastList) {
      // Clear existing content
      container.innerHTML = "";
      podcastList.forEach((podcast) => {
        // Create a new podcast-preview element for each podcast
        const podcastPreview = document.createElement("podcast-preview");
        
        // Set the podcast data on the preview component, enriching it with genre names and formatted date
        podcastPreview.setPodcast({
          ...podcast,
          genreNames: GenreService.getNames(podcast.genres),
          formattedDate: DateUtils.format(podcast.updated)
        });

        // Listen for the custom 'podcast-selected' event
        // Event is dispatched when user clicks the card
        // Opens modal with detailed podcast information
        podcastPreview.addEventListener("podcast-selected", (e) => {
          createModal.open(e.detail.podcast);
        });

        // Append the podcast preview card to the grid container
        container.appendChild(podcastPreview);
      });
    },
  };      
}