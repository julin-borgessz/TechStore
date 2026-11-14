document.addEventListener('DOMContentLoaded', () => {
    /* ======================================================================
       1. ALTERNÂNCIA DE TEMA (LIGHT / DARK MODE)
       ====================================================================== */
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');

    const savedTheme = localStorage.getItem('techstore_dict_theme') || 'light';
    applyTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
        localStorage.setItem('techstore_dict_theme', nextTheme);
    });

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeLabel.textContent = 'Light Mode';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeLabel.textContent = 'Dark Mode';
        }
    }

    /* ======================================================================
       2. SIDEBAR RESPONSIVA E DESTAQUE DE ÂNCORA ATIVA
       ====================================================================== */
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    /* ======================================================================
       3. PESQUISA REAL-TIME NO DICIONÁRIO DE DADOS
       ====================================================================== */
    const searchInput = document.getElementById('dictionarySearch');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const dictSections = document.querySelectorAll('.dict-section');
    const filterCounter = document.getElementById('filterCounter');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const totalTables = dictSections.length;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';
        filterDictionary(query);
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        filterDictionary('');
        searchInput.focus();
    });

    function filterDictionary(query) {
        let visibleTablesCount = 0;

        dictSections.forEach(section => {
            const tableName = section.getAttribute('data-table-name').toLowerCase();
            const tableMatches = tableName.includes(query);
            const rows = section.querySelectorAll('tbody tr');
            let visibleRowsInTable = 0;

            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                if (query === '' || tableMatches || rowText.includes(query)) {
                    row.style.display = '';
                    visibleRowsInTable++;
                } else {
                    row.style.display = 'none';
                }
            });

            if (visibleRowsInTable > 0) {
                section.style.display = '';
                visibleTablesCount++;
            } else {
                section.style.display = 'none';
            }
        });

        filterCounter.textContent = `Exibindo ${visibleTablesCount} de ${totalTables} tabelas`;
        noResultsMessage.style.display = visibleTablesCount === 0 ? 'block' : 'none';
    }

    /* ======================================================================
       4. MODAL VISUALIZADOR DO DER COM PANZOOM.JS
       ====================================================================== */
    const derModal = document.getElementById('derModal');
    const openDerModalBtn = document.getElementById('openDerModalBtn');
    const closeDerModalBtn = document.getElementById('closeDerModalBtn');
    const panzoomContainer = document.getElementById('panzoomContainer');
    const panzoomElement = document.getElementById('panzoomElement');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');

    let panzoomInstance = null;

    if (typeof Panzoom !== 'undefined' && panzoomElement) {
        panzoomInstance = Panzoom(panzoomElement, {
            maxScale: 5,
            minScale: 0.5,
            contain: 'outside',
            step: 0.3
        });

        panzoomContainer.addEventListener('wheel', (event) => {
            event.preventDefault();
            panzoomInstance.zoomWithWheel(event);
        }, { passive: false });

        zoomInBtn.addEventListener('click', () => {
            panzoomInstance.zoomIn();
        });

        zoomOutBtn.addEventListener('click', () => {
            panzoomInstance.zoomOut();
        });

        zoomResetBtn.addEventListener('click', () => {
            panzoomInstance.reset();
        });
    }

    openDerModalBtn.addEventListener('click', () => {
        derModal.classList.add('open');
        derModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (panzoomInstance) {
            panzoomInstance.reset();
        }
    });

    function closeDerModal() {
        derModal.classList.remove('open');
        derModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    closeDerModalBtn.addEventListener('click', closeDerModal);

    derModal.addEventListener('click', (event) => {
        if (event.target === derModal) {
            closeDerModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && derModal.classList.contains('open')) {
            closeDerModal();
        }
    });
});