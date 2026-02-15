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
     * Renders a list of podcast cards into the grid.
     * @param {Object[]} podcastList - Array of podcast objects.
     */
    render(podcastList) {
      container.innerHTML = "";
      podcastList.forEach((podcast) => {
        const podcastPreview = document.createElement("podcast-preview");
        

        podcastPreview.setPodcast({
          ...podcast,
          genreNames: GenreService.getNames(podcast.genres),
          formattedDate: DateUtils.format(podcast.updated)
        });

        podcastPreview.addEventListener("podcast-selected", (e) => {
          createModal.open(e.detail.podcast);
        });

        container.appendChild(podcastPreview);
      });
    },
  };      
}