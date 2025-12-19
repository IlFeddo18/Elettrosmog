const sections = [
    { id: 'introduzione', title: 'Introduzione', pages: ['introduzione/motivo', 'introduzione/definizione', 'introduzione/componenti'] },
    { id: 'spettro', title: 'Spettro ed Effetti', pages: ['spettro/caratteristiche', 'spettro/spettro', 'spettro/radiazioni', 'spettro/elettrosmog'] },
    { id: 'sorgenti', title: 'Sorgenti e Reti', pages: ['sorgenti/sorgenti', 'sorgenti/rete', 'sorgenti/telefonia', 'sorgenti/5G'] },
    { id: 'misure', title: 'Misurazione e Norme', pages: ['misurazione/misurazione', 'misurazione/normative', 'misurazione/esposizione'] },
    { id: 'prevenzione', title: 'Istituzioni e Prevenzione', pages: ['istituzioni/consigli', 'istituzioni/fonti', 'istituzioni/ARPA'] }
];

let currentIndex = 0;
let currentPagePath = ""; // Per gestire l'evidenziazione

// Sostituiamo la vecchia logica di inizializzazione
function openSection(index) {
    currentIndex = index;
    const wrapper = document.getElementById('mainWrapper');
    const subNavContainer = document.getElementById('sub-navigation-container');
    
    wrapper.classList.add('nav-up');

    // Highlight bottone sezione principale
    const buttons = document.querySelectorAll('.node-btn');
    buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    subNavContainer.classList.remove('hidden-content');
    subNavContainer.classList.add('show-content');

    const subGroups = document.querySelectorAll('.sub-group');
    subGroups.forEach((group, i) => {
        group.classList.toggle('active', i === index);
    });

    updateArrows(index);
    
    // Novità: Apre automaticamente la prima sottosezione della sezione cliccata
    const firstPage = sections[index].pages[0];
    mostraPagina(firstPage);
}

// Funzione per mostrare la pagina e gestire la navigazione interna
async function mostraPagina(path) {
    currentPagePath = path;
    const contentArea = document.getElementById('content-area');
    
    contentArea.classList.remove('hidden-content');
    contentArea.classList.add('show-content');

    try {
        const response = await fetch(`pages/${path}.html`);
        if (!response.ok) throw new Error("Pagina non trovata");
        const html = await response.text();

        // Inseriamo il contenuto + le frecce di navigazione in alto
        contentArea.innerHTML = `
            <div class="content-nav-top">
                <button class="mini-arrow" id="page-prev" onclick="navigaPagine(-1)">❮ Precedente</button>
                <button class="mini-arrow" id="page-next" onclick="navigaPagine(1)">Successiva ❯</button>
            </div>
            <div class="page-body">${html}</div>
        `;

        // Gestione Highlight nell'indice
        const miniRiquadri = document.querySelectorAll('.riquadro-mini');
        miniRiquadri.forEach(rq => {
            // Controlla se l'onclick del riquadro contiene il path attuale
            if (rq.getAttribute('onclick').includes(path)) {
                rq.classList.add('active-sub');
            } else {
                rq.classList.remove('active-sub');
            }
        });

        // Aggiorna visibilità frecce interne
        aggiornaFrecceInterne();

        // Animazione
        contentArea.style.animation = 'none';
        contentArea.offsetHeight; 
        contentArea.style.animation = 'slideIn 0.5s ease forwards';

    } catch (error) {
        contentArea.innerHTML = `<p class="glassBox">Errore nel caricamento: ${path}</p>`;
    }
}

// Navigazione tra pagine (anche tra diverse sezioni)
function navigaPagine(direzione) {
    // 1. Troviamo tutte le pagine in un unico array piatto
    const allPages = sections.flatMap(s => s.pages);
    const currentIndexPage = allPages.indexOf(currentPagePath);
    const nextIndex = currentIndexPage + direzione;

    if (nextIndex >= 0 && nextIndex < allPages.length) {
        const nextPath = allPages[nextIndex];
        
        // Se la prossima pagina appartiene a una sezione diversa, aggiorniamo l'indice
        const newSectionIndex = sections.findIndex(s => s.pages.includes(nextPath));
        if (newSectionIndex !== currentIndex) {
            openSection(newSectionIndex); // Questo cambierà anche le frecce grandi
        }
        
        mostraPagina(nextPath);
    }
}

function aggiornaFrecceInterne() {
    const allPages = sections.flatMap(s => s.pages);
    const idx = allPages.indexOf(currentPagePath);
    
    document.getElementById('page-prev').style.visibility = (idx === 0) ? 'hidden' : 'visible';
    document.getElementById('page-next').style.visibility = (idx === allPages.length - 1) ? 'hidden' : 'visible';
}

// Funzioni per le frecce dell'indice (già presenti, rimangono invariate)
function updateArrows(index) {
    const prev = document.getElementById('prev-arrow');
    const next = document.getElementById('next-arrow');
    index === 0 ? prev.classList.add('hidden') : prev.classList.remove('hidden');
    index === sections.length - 1 ? next.classList.add('hidden') : next.classList.remove('hidden');
}

function changeSection(direction) {
    let newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < sections.length) {
        openSection(newIndex);
    }
}