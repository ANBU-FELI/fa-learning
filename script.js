// Comprehensive tech mastery learning tasks organized by category
const techMasteryTasks = {
    'Coding Foundations': [
        'Python Basics',
        'Functions',
        'OOP',
        'Error Handling',
        'Git/GitHub',
        'Mini Project 1',
        'Mini Project 2'
    ],
    'DSA': [
        'Arrays',
        'Strings',
        'HashMaps',
        'Linked Lists',
        'Stacks',
        'Queues',
        'Recursion',
        'Trees',
        'Graphs',
        'DP Basics'
    ],
    'System Design': [
        'Load Balancing',
        'Caching',
        'Databases (SQL/NoSQL)',
        'Message Queues',
        'Microservices',
        'Rate Limiter Project',
        'URL Shortener Project'
    ],
    'ML Foundations': [
        'Pandas',
        'NumPy',
        'Visualization',
        'Regression',
        'Classification',
        'Feature Engineering',
        'ML Project 1',
        'ML Project 2'
    ],
    'Agentic AI': [
        'Prompt Engineering',
        'LangChain Basics',
        'LlamaIndex',
        'Vector DB (FAISS/Weaviate)',
        'RAG Pipeline',
        'QA Automation Agent',
        'AWS Ops Agent'
    ],
    'Capstone Project': [
        'Architecture Defined',
        'UI Built',
        'Backend API',
        'Agents Integrated',
        'RAG Added',
        'Deployment',
        'Documentation',
        'GitHub Release'
    ],
    'Interview Prep': [
        'System Design Mock',
        'ML Interview Prep',
        'Agents Interview Prep',
        'Resume Updated',
        'LinkedIn Updated',
        'Portfolio Completed'
    ]
};

// Initialize user data with all tasks
let userData = {
    felicita: { tasks: [], categories: {} },
    anbarasan: { tasks: [], categories: {} }
};

// Chart instances
let charts = {};

// Generate tasks for both users
function initializeUserData() {
    ['felicita', 'anbarasan'].forEach(user => {
        let taskId = 0;
        userData[user].tasks = [];
        userData[user].categories = {};

        Object.keys(techMasteryTasks).forEach(category => {
            userData[user].categories[category] = [];
            
            techMasteryTasks[category].forEach(task => {
                const taskObj = {
                    id: `${user}-${taskId++}`,
                    text: task,
                    category: category,
                    completed: false
                };
                userData[user].tasks.push(taskObj);
                userData[user].categories[category].push(taskObj);
            });
        });
    });
}

// Load data from localStorage if available
function loadData() {
    const savedData = localStorage.getItem('techMasteryDashboardData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        // Merge with current structure to handle new tasks
        ['felicita', 'anbarasan'].forEach(user => {
            if (parsed[user] && parsed[user].tasks) {
                userData[user].tasks.forEach(task => {
                    const savedTask = parsed[user].tasks.find(t => t.text === task.text && t.category === task.category);
                    if (savedTask) {
                        task.completed = savedTask.completed;
                    }
                });
            }
        });
    }
}

// Initialize the dashboard
function initDashboard() {
    initializeUserData();
    loadData();
    renderTasks('felicita');
    renderTasks('anbarasan');
    createCharts();
    updateAllStats();
    renderCategoryProgress();
}

// Render tasks for a user with categories
function renderTasks(user) {
    const container = document.getElementById(`${user}-tasks`);
    container.innerHTML = '';

    Object.keys(userData[user].categories).forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <span>${category}</span>
            <span class="category-toggle">−</span>
        `;
        categoryHeader.onclick = () => toggleCategory(user, category);

        const categoryTasks = document.createElement('div');
        categoryTasks.className = 'category-tasks';
        categoryTasks.id = `${user}-${category.replace(/\s+/g, '-')}`;

        userData[user].categories[category].forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <input type="checkbox" class="task-checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask('${user}', '${task.id}')">
                <span class="task-text">${task.text}</span>
            `;
            categoryTasks.appendChild(taskElement);
        });

        categorySection.appendChild(categoryHeader);
        categorySection.appendChild(categoryTasks);
        container.appendChild(categorySection);
    });
}

// Toggle category visibility
function toggleCategory(user, category) {
    const categoryId = `${user}-${category.replace(/\s+/g, '-')}`;
    const categoryTasks = document.getElementById(categoryId);
    const toggle = categoryTasks.previousElementSibling.querySelector('.category-toggle');
    
    if (categoryTasks.classList.contains('collapsed')) {
        categoryTasks.classList.remove('collapsed');
        toggle.textContent = '−';
    } else {
        categoryTasks.classList.add('collapsed');
        toggle.textContent = '+';
    }
}

// Toggle task completion
function toggleTask(user, taskId) {
    const task = userData[user].tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveData();
        renderTasks(user);
        updateAllStats();
        updateCharts();
        renderCategoryProgress();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('techMasteryDashboardData', JSON.stringify(userData));
}

// Calculate user stats
function getUserStats(user) {
    const tasks = userData[user].tasks;
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
}

// Calculate category stats for a user
function getCategoryStats(user, category) {
    const tasks = userData[user].categories[category];
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
}

// Update all statistics
function updateAllStats() {
    ['felicita', 'anbarasan'].forEach(user => {
        const stats = getUserStats(user);
        document.getElementById(`${user}-completed`).textContent = stats.completed;
        document.getElementById(`${user}-total`).textContent = stats.total;
        document.getElementById(`${user}-percentage`).textContent = `${stats.percentage}%`;
    });
}

// Render category progress cards
function renderCategoryProgress() {
    const container = document.getElementById('categoryProgress');
    container.innerHTML = '';

    Object.keys(techMasteryTasks).forEach(category => {
        const felicitaStats = getCategoryStats('felicita', category);
        const anbarasanStats = getCategoryStats('anbarasan', category);

        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-name">${category}</div>
            <div class="category-stats">
                <div>Felicita: ${felicitaStats.completed}/${felicitaStats.total} (${felicitaStats.percentage}%)</div>
                <div>Anbarasan: ${anbarasanStats.completed}/${anbarasanStats.total} (${anbarasanStats.percentage}%)</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Create all charts
function createCharts() {
    createUserChart('felicita');
    createUserChart('anbarasan');
    createComparisonChart();
    createCategoryChart();
    createOverallChart();
}

// Create individual user chart
function createUserChart(user) {
    const ctx = document.getElementById(`${user}Chart`).getContext('2d');
    const stats = getUserStats(user);
    
    charts[user] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [stats.completed, stats.total - stats.completed],
                backgroundColor: ['#28a745', '#e9ecef'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: `${user.charAt(0).toUpperCase() + user.slice(1)} Progress`
                }
            }
        }
    });
}

// Create comparison chart
function createComparisonChart() {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    const felicitaStats = getUserStats('felicita');
    const anbarasanStats = getUserStats('anbarasan');
    
    charts.comparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Felicita', 'Anbarasan'],
            datasets: [{
                label: 'Completed Tasks',
                data: [felicitaStats.completed, anbarasanStats.completed],
                backgroundColor: ['#667eea', '#764ba2']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Completed Tasks Comparison'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create category breakdown chart
function createCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const categories = Object.keys(techMasteryTasks);
    const felicitaData = categories.map(cat => getCategoryStats('felicita', cat).completed);
    const anbarasanData = categories.map(cat => getCategoryStats('anbarasan', cat).completed);
    
    charts.category = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Felicita',
                data: felicitaData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                pointBackgroundColor: '#667eea'
            }, {
                label: 'Anbarasan',
                data: anbarasanData,
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.2)',
                pointBackgroundColor: '#764ba2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Category Progress Comparison'
                }
            },
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create overall progress chart
function createOverallChart() {
    const ctx = document.getElementById('overallChart').getContext('2d');
    const felicitaStats = getUserStats('felicita');
    const anbarasanStats = getUserStats('anbarasan');
    
    charts.overall = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Felicita', 'Anbarasan'],
            datasets: [{
                label: 'Progress %',
                data: [felicitaStats.percentage, anbarasanStats.percentage],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Overall Progress Percentage'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Update all charts
function updateCharts() {
    // Update user charts
    ['felicita', 'anbarasan'].forEach(user => {
        const stats = getUserStats(user);
        charts[user].data.datasets[0].data = [stats.completed, stats.total - stats.completed];
        charts[user].update();
    });

    // Update comparison chart
    const felicitaStats = getUserStats('felicita');
    const anbarasanStats = getUserStats('anbarasan');
    charts.comparison.data.datasets[0].data = [felicitaStats.completed, anbarasanStats.completed];
    charts.comparison.update();

    // Update category chart
    const categories = Object.keys(techMasteryTasks);
    const felicitaData = categories.map(cat => getCategoryStats('felicita', cat).completed);
    const anbarasanData = categories.map(cat => getCategoryStats('anbarasan', cat).completed);
    charts.category.data.datasets[0].data = felicitaData;
    charts.category.data.datasets[1].data = anbarasanData;
    charts.category.update();

    // Update overall chart
    charts.overall.data.datasets[0].data = [felicitaStats.percentage, anbarasanStats.percentage];
    charts.overall.update();
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initDashboard);
