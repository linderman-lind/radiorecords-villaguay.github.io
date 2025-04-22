// News Section - Using RSS Feed from Clarín
const newsCategories = [
    { id: 'national', name: 'Nacionales', url: 'politica' },
    { id: 'world', name: 'Mundo', url: 'mundo' },
    { id: 'politics', name: 'Política', url: 'politica' },
    { id: 'economy', name: 'Economía', url: 'economia' },
    { id: 'sports', name: 'Deportes', url: 'deportes' },
    { id: 'entertainment', name: 'Espectáculos', url: 'espectaculos' },
    { id: 'technology', name: 'Tecnología', url: 'tecnologia' },
    { id: 'society', name: 'Sociedad', url: 'sociedad' }
];
const newsContainer = document.getElementById('newsContainer');

async function fetchNews(category) {
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const url = `${corsProxy}${encodeURIComponent(`https://www.clarin.com/rss/${category}/`)}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const items = xml.querySelectorAll('item');
        
        return Array.from(items).slice(0, 8).map(item => ({
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent,
            url: item.querySelector('link').textContent
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Leer más</a>
        `;
        newsContainer.appendChild(newsItem);
    });
}

function createNewsButtons() {
    const newsToggle = document.querySelector('.news-toggle');
    newsToggle.innerHTML = '';
    
    newsCategories.forEach(category => {
        const button = document.createElement('button');
        button.id = category.id;
        button.textContent = category.name;
        button.addEventListener('click', async () => {
            document.querySelectorAll('.news-toggle button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const news = await fetchNews(category.url);
            displayNews(news);
        });
        newsToggle.appendChild(button);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    createNewsButtons();
    document.querySelector('.news-toggle button').click();
});