interface Job {
    id: number;
    title: string;
    company: string;
    salary: string;
    location: string;
    role: string;
}

const jobs: Job[] = [
    { id: 1, title: "Frontend Engineer", company: "Google", salary: "$120k", location: "Remote", role: "Engineering" },
    { id: 2, title: "UI Designer", company: "Apple", salary: "$110k", location: "Cupertino", role: "Design" },
    { id: 3, title: "Backend Dev", company: "Amazon", salary: "$130k", location: "Seattle", role: "Engineering" },
    { id: 4, title: "Product Manager", company: "Google", salary: "$140k", location: "New York", role: "Product" },
    { id: 5, title: "Data Scientist", company: "Meta", salary: "$150k", location: "Menlo Park", role: "Data" }
];

let savedJobs: Job[] = [];

// DOM Elements
const jobGrid = document.getElementById('jobGrid') as HTMLDivElement;
const savedList = document.getElementById('savedList') as HTMLDivElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const companyFilter = document.getElementById('companyFilter') as HTMLSelectElement;
const roleFilter = document.getElementById('roleFilter') as HTMLSelectElement;
const savedCount = document.getElementById('savedCount') as HTMLSpanElement;

// Initialize Filters
const initFilters = () => {
    const companies = [...new Set(jobs.map(j => j.company))];
    const roles = [...new Set(jobs.map(j => j.role))];
    
    companies.forEach(c => companyFilter.innerHTML += `<option value="${c}">${c}</option>`);
    roles.forEach(r => roleFilter.innerHTML += `<option value="${r}">${r}</option>`);
};

// Render Jobs
const renderJobs = (filteredJobs: Job[]) => {
    jobGrid.innerHTML = '';
    filteredJobs.forEach(job => {
        const isSaved = savedJobs.some(s => s.id === job.id);
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="logo-placeholder">${job.company.charAt(0)}</div>
            <h3>${job.title}</h3>
            <p><strong>${job.company}</strong> • ${job.location}</p>
            <p class="salary">${job.salary}</p>
            <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(${job.id})">
                ${isSaved ? 'Unsave' : 'Save Job'}
            </button>
        `;
        jobGrid.appendChild(card);
    });
};

// Toggle Save/Unsave
(window as any).toggleSave = (id: number) => {
    const jobIndex = savedJobs.findIndex(j => j.id === id);
    if (jobIndex > -1) {
        savedJobs.splice(jobIndex, 1);
    } else {
        const job = jobs.find(j => j.id === id);
        if (job) savedJobs.push(job);
    }
    updateUI();
};

const updateUI = () => {
    filterJobs();
    renderSaved();
    savedCount.innerText = savedJobs.length.toString();
};

const renderSaved = () => {
    savedList.innerHTML = '';
    savedJobs.forEach(job => {
        const item = document.createElement('div');
        item.className = 'saved-item';
        item.innerHTML = `<strong>${job.title}</strong><br><small>${job.company}</small>`;
        savedList.appendChild(item);
    });
};

const filterJobs = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const company = companyFilter.value;
    const role = roleFilter.value;

    const filtered = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm);
        const matchesCompany = company === 'all' || job.company === company;
        const matchesRole = role === 'all' || job.role === role;
        return matchesSearch && matchesCompany && matchesRole;
    });

    renderJobs(filtered);
};

// Listeners
searchInput.addEventListener('input', filterJobs);
companyFilter.addEventListener('change', filterJobs);
roleFilter.addEventListener('change', filterJobs);

// Initial Load
initFilters();
renderJobs(jobs);
