import { state } from '../app.js';
import { StateView } from '../utility/state-view.js';
import { fetchResources, FILTER_OPTIONS } from '../network/api.js';
import { renderFeaturedCard, renderResourceCard } from '../components/resource-card.js';
import { renderFacultyChips, renderNewsList } from '../components/home-sections.js';
import { openSheet } from '../utility/sheet.js';
import { renderResourceDetail } from '../components/resource-detail.js';
import { fetchResourceById } from '../network/api.js';

export function initHome() {
  const container = document.querySelector('[data-state="home-content"]');
  if (!container) return;
  
  const stateView = new StateView(container);
  
  async function loadHome() {
    stateView.setLoading();
    try {
      const resources = await fetchResources();
      
      if (resources.length === 0) {
        stateView.setEmpty();
        return;
      }
      
      const dataContainer = stateView.getDataContainer();
      dataContainer.innerHTML = '';
      
      // Featured Section
      const featured = resources.slice(0, 3);
      if (featured.length > 0) {
        const section = document.createElement('div');
        section.className = 'section';
        section.innerHTML = `<div class="section-head"><h2 class="section-title">Start here</h2></div>`;
        const scrollRow = document.createElement('div');
        scrollRow.className = 'scroll-row';
        featured.forEach(r => scrollRow.appendChild(renderFeaturedCard(r)));
        section.appendChild(scrollRow);
        dataContainer.appendChild(section);
      }
      
      // Recently Added
      const recent = resources.slice(3, 11);
      if (recent.length > 0) {
        const section = document.createElement('div');
        section.className = 'section';
        section.innerHTML = `<div class="section-head"><h2 class="section-title">Recently added</h2><a href="#explore" class="section-link">See all</a></div>`;
        const scrollStrip = document.createElement('div');
        scrollStrip.className = 'scroll-strip';
        recent.forEach(r => scrollStrip.appendChild(renderResourceCard(r)));
        section.appendChild(scrollStrip);
        dataContainer.appendChild(section);
      }
      
      // Faculty Shortcuts
      const facultySection = document.createElement('div');
      facultySection.className = 'section';
      facultySection.innerHTML = `<div class="section-head"><h2 class="section-title">Browse by faculty</h2></div>`;
      facultySection.appendChild(renderFacultyChips(FILTER_OPTIONS.faculty));
      dataContainer.appendChild(facultySection);
      
      // News
      const newsItems = [
        { icon: 'ri-megaphone-line', title: 'Second semester exam timetable now available', time: '2 hours ago' },
        { icon: 'ri-file-add-line', title: '12 new past questions uploaded for MTH and CSC', time: 'Yesterday' }
      ];
      const newsSection = document.createElement('div');
      newsSection.className = 'section';
      newsSection.innerHTML = `<div class="section-head"><h2 class="section-title">Campus news</h2></div>`;
      newsSection.appendChild(renderNewsList(newsItems));
      dataContainer.appendChild(newsSection);
      
      stateView.setData();
      
      // Wire up clicks
      dataContainer.querySelectorAll('[data-resource-id]').forEach(card => {
        card.addEventListener('click', () => {
          const id = parseInt(card.dataset.resourceId);
          openSheet(id, card, async (resourceId) => {
            const resource = await fetchResourceById(resourceId);
            return renderResourceDetail(resource, {
              isSaved: state.savedResources.includes(resource.id),
              showOpenPageLink: true
            });
          });
        });
      });
      
    } catch (err) {
      console.error(err);
      stateView.setError();
    }
  }
  
  // Wire Search
  const searchInput = document.getElementById('home-search');
  if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (e.target.value.trim()) {
          window.location.hash = `explore?q=${encodeURIComponent(e.target.value)}`;
        }
      }, 500);
    });
  }
  
  // Wire Retry
  const retryBtn = container.querySelector('[data-retry]');
  if (retryBtn) retryBtn.addEventListener('click', loadHome);
  
  loadHome();
}