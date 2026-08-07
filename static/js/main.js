/**
 * Google Cloud Tech Summit 2026 - Main JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const speakerSelect = document.getElementById('speakerSelect');
    const categoryTabs = document.querySelectorAll('.tab-btn');
    const talksContainer = document.getElementById('talksContainer');
    const resultsCountEl = document.getElementById('resultsCount');
    const viewButtons = document.querySelectorAll('.view-btn');
    const modalOverlay = document.getElementById('talkModal');
    const modalCloseBtn = document.getElementById('modalClose');

    // Global State
    let currentCategory = 'all';
    let currentSearch = '';
    let currentSpeaker = '';

    // Apply dynamic avatar backgrounds if specified in dataset
    document.querySelectorAll('.speaker-avatar[data-avatar-bg]').forEach(el => {
        if (el.dataset.avatarBg) {
            el.style.background = el.dataset.avatarBg;
        }
    });

    // Initialize listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            filterTalks();
        });
    }

    if (speakerSelect) {
        speakerSelect.addEventListener('change', (e) => {
            currentSpeaker = e.target.value;
            filterTalks();
        });
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.getAttribute('data-category');
            filterTalks();
        });
    });

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const viewMode = btn.getAttribute('data-view');
            if (viewMode === 'grid') {
                talksContainer.classList.remove('timeline-container');
                talksContainer.classList.add('grid-container');
            } else {
                talksContainer.classList.remove('grid-container');
                talksContainer.classList.add('timeline-container');
            }
        });
    });

    // Delegate talk card clicks to open detail modal
    if (talksContainer) {
        talksContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.talk-card');
            if (card && !e.target.closest('a')) {
                const talkId = card.getAttribute('data-talk-id');
                if (talkId) {
                    openTalkModal(talkId);
                }
            }
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Core Filtering Logic
    function filterTalks() {
        const cards = document.querySelectorAll('.talk-card-wrapper');
        let visibleCount = 0;

        cards.forEach(wrapper => {
            const talkCard = wrapper.querySelector('.talk-card');
            if (!talkCard) return;

            const categoryId = talkCard.getAttribute('data-category-id');
            const title = (talkCard.getAttribute('data-title') || '').toLowerCase();
            const desc = (talkCard.getAttribute('data-desc') || '').toLowerCase();
            const speakersStr = (talkCard.getAttribute('data-speakers') || '').toLowerCase();

            // 1. Category check
            let catMatch = (currentCategory === 'all' || categoryId === currentCategory);

            // 2. Speaker check
            let speakerMatch = true;
            if (currentSpeaker) {
                speakerMatch = speakersStr.includes(currentSpeaker.toLowerCase());
            }

            // 3. Search query check
            let textMatch = true;
            if (currentSearch) {
                textMatch = title.includes(currentSearch) || 
                            desc.includes(currentSearch) || 
                            speakersStr.includes(currentSearch);
            }

            if (catMatch && speakerMatch && textMatch) {
                wrapper.style.display = '';
                visibleCount++;
            } else {
                wrapper.style.display = 'none';
            }
        });

        // Update results counter
        if (resultsCountEl) {
            resultsCountEl.textContent = `${visibleCount} Session${visibleCount === 1 ? '' : 's'}`;
        }

        // Show/hide no results banner
        const noResultsBanner = document.getElementById('noResultsBanner');
        if (noResultsBanner) {
            noResultsBanner.style.display = (visibleCount === 0) ? 'block' : 'none';
        }
    }

    // Modal Details Fetching & Rendering
    async function openTalkModal(talkId) {
        try {
            const response = await fetch(`/api/talk/${talkId}`);
            const data = await response.json();

            if (data.status === 'success' && data.talk) {
                const talk = data.talk;
                
                document.getElementById('modalTimeSlot').textContent = talk.time_slot;
                document.getElementById('modalCategory').textContent = talk.category_name;
                document.getElementById('modalCategory').className = `category-tag cat-${talk.category_id}`;
                document.getElementById('modalTitle').textContent = talk.title;
                document.getElementById('modalDescription').textContent = talk.description;

                const speakersContainer = document.getElementById('modalSpeakers');
                speakersContainer.innerHTML = '';

                talk.speakers.forEach(spk => {
                    const initials = `${spk.first_name[0]}${spk.last_name[0]}`;
                    const spkCard = document.createElement('div');
                    spkCard.className = 'speaker-card-detailed';
                    spkCard.innerHTML = `
                        <div class="speaker-avatar-lg" style="background: ${spk.avatar_bg || 'var(--g-blue)'}">
                            ${initials}
                        </div>
                        <div class="speaker-meta-lg">
                            <h4>
                                ${spk.first_name} ${spk.last_name}
                                <span class="comp">• ${spk.company}</span>
                            </h4>
                            <div class="speaker-role">${spk.role}</div>
                            <p>${spk.bio}</p>
                            <a href="${spk.linkedin}" target="_blank" rel="noopener noreferrer" class="linkedin-btn">
                                <i class="fab fa-linkedin"></i> LinkedIn Profile
                            </a>
                        </div>
                    `;
                    speakersContainer.appendChild(spkCard);
                });

                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } catch (err) {
            console.error('Error fetching talk details:', err);
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
