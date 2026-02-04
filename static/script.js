// ============================================
// MARKETING AUDIT APP - PRO VERSION
// Modern UI with Particles, Confetti, Animations
// ============================================

const questions = [
    // Step 1: Business Profile
    {
        id: 'owner_status',
        title: "Siz biznes egasimisiz?",
        type: 'select',
        options: [
            { value: 'yes', label: '✅ Ha, egasiman' },
            { value: 'no', label: '👔 Yo\'q, menejerman' }
        ]
    },
    {
        id: 'crm_status',
        title: "Sizda CRM tizimi mavjudmi?",
        type: 'select',
        options: [
            { value: 'yes', label: '✅ Ha, bor' },
            { value: 'no', label: '❌ Yo\'q' }
        ]
    },
    {
        id: 'sales_dept',
        title: "Alohida sotuv bo'limi bormi?",
        type: 'select',
        options: [
            { value: 'yes', label: '👥 Ha, bor' },
            { value: 'no', label: '🙋 Yo\'q, o\'zim' }
        ]
    },
    {
        id: 'social_status',
        title: "Ijtimoiy tarmoqlaringiz holati?",
        type: 'select',
        options: [
            { value: 'good', label: '🔥 Zo\'r' },
            { value: 'average', label: '👌 O\'rtacha' },
            { value: 'bad', label: '😔 Yomon' }
        ]
    },
    // Step 2: Financials
    {
        id: 'industry',
        title: "Biznesingiz qaysi sohada?",
        type: 'text',
        placeholder: "Masalan: O'quv markazi, Kiyim do'koni..."
    },
    {
        id: 'platform',
        title: "Asosiy reklama platformangiz?",
        type: 'select',
        options: [
            { value: 'instagram', label: '📸 Instagram' },
            { value: 'telegram', label: '✈️ Telegram' },
            { value: 'facebook', label: '📘 Facebook' },
            { value: 'other', label: '🌐 Boshqa' }
        ]
    },
    {
        id: 'income_goal',
        title: "Oylik daromad maqsadingiz?",
        type: 'number',
        placeholder: "$ da kiriting, masalan: 10000"
    },
    {
        id: 'avg_check',
        title: "O'rtacha chek qancha?",
        type: 'number',
        placeholder: "$ da kiriting, masalan: 60"
    },
    {
        id: 'conversion',
        title: "Sotuv konversiyasi necha %?",
        type: 'number',
        placeholder: "Masalan: 30"
    }
];

let currentStep = 0;
let answers = {};
const BENCHMARK_CPL_MIN = 0.8;
const BENCHMARK_CPL_MAX = 1.5;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const wizardScreen = document.getElementById('wizard-screen');
const resultsScreen = document.getElementById('results-screen');
const questionContainer = document.getElementById('question-container');
const questionTitle = document.getElementById('question-title');
const progressBar = document.getElementById('progress-bar');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// ============================================
// PARTICLES SYSTEM
// ============================================
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#a5b4fc'];

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particle.style.boxShadow = `0 0 ${10 + Math.random() * 10}px currentColor`;
        particlesContainer.appendChild(particle);
    }
}

// ============================================
// CONFETTI SYSTEM
// ============================================
function createConfetti() {
    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    const shapes = ['square', 'circle'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (5 + Math.random() * 10) + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '2px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            document.body.appendChild(confetti);

            // Animate
            const animation = confetti.animate([
                {
                    top: '-10px',
                    opacity: 1,
                    transform: `translateX(0) rotate(0deg)`
                },
                {
                    top: '100vh',
                    opacity: 0,
                    transform: `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 720}deg)`
                }
            ], {
                duration: 2000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            animation.onfinish = () => confetti.remove();
        }, i * 30);
    }
}

// ============================================
// TYPING EFFECT
// ============================================
function typeText(element, text, speed = 30) {
    return new Promise((resolve) => {
        element.innerHTML = '';
        element.classList.add('typing-text');
        let i = 0;

        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing-text');
                resolve();
            }
        };
        type();
    });
}

// ============================================
// NAVIGATION
// ============================================
function navigateScreen(from, to) {
    from.classList.remove('active');

    setTimeout(() => {
        from.style.display = 'none';
        to.style.display = 'block';

        // Force reflow
        void to.offsetWidth;

        setTimeout(() => {
            to.classList.add('active');
        }, 50);
    }, 300);
}

// ============================================
// RENDER QUESTION
// ============================================
function renderQuestion() {
    const q = questions[currentStep];
    questionTitle.innerText = `Savol ${currentStep + 1}/${questions.length}`;

    // Update progress bar with smooth animation
    const progress = ((currentStep + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Render Input
    let html = '';
    if (q.type === 'select') {
        html = `<h3 class="question-text" id="q-text"></h3>`;
        html += `<div class="options-grid">`;
        q.options.forEach(opt => {
            const isSelected = answers[q.id] === opt.value ? 'selected' : '';
            html += `
                <div class="option-card ${isSelected}" onclick="selectOption('${q.id}', '${opt.value}')">
                    ${opt.label}
                </div>
            `;
        });
        html += `</div>`;
    } else {
        const val = answers[q.id] || '';
        html = `
            <div class="input-group">
                <label id="q-text"></label>
                <input type="${q.type}" id="input-${q.id}" value="${val}" placeholder="${q.placeholder}" oninput="saveInput('${q.id}', this.value)">
            </div>
        `;
    }

    questionContainer.innerHTML = html;

    // Apply typing effect
    const textElement = document.getElementById('q-text');
    if (textElement) {
        typeText(textElement, q.title, 25);
    }

    // Button states
    prevBtn.classList.toggle('hidden', currentStep === 0);

    if (currentStep === questions.length - 1) {
        nextBtn.innerHTML = '🎯 Hisoblash';
    } else {
        nextBtn.innerHTML = 'Keyingisi <i class="fa-solid fa-arrow-right"></i>';
    }
}

// Global functions for inline onclick handlers
window.selectOption = function (id, value) {
    answers[id] = value;

    // Add selection animation
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    // Auto-advance after short delay
    setTimeout(() => {
        if (currentStep < questions.length - 1) {
            handleNext();
        }
    }, 400);
}

window.saveInput = function (id, value) {
    answers[id] = value;
}

function handleNext() {
    const q = questions[currentStep];

    // Validation
    if (!answers[q.id]) {
        // Shake animation
        const container = document.querySelector('.glass-card');
        container.style.animation = 'shake 0.5s';
        setTimeout(() => container.style.animation = '', 500);
        return;
    }

    if (currentStep < questions.length - 1) {
        currentStep++;
        renderQuestion();
    } else {
        calculateAndShowResults();
    }
}

function handlePrev() {
    if (currentStep > 0) {
        currentStep--;
        renderQuestion();
    }
}

// ============================================
// CALCULATE RESULTS
// ============================================
function calculateAndShowResults() {
    // 1. Core Financials
    const goal = parseFloat(answers.income_goal);
    const check = parseFloat(answers.avg_check);
    const conv = parseFloat(answers.conversion) / 100;

    const neededClients = Math.ceil(goal / check);
    const neededLeads = Math.ceil(neededClients / conv);

    // 2. Penalties
    let penaltyMultiplier = 1.0;
    const penalties = [];

    if (answers.crm_status === 'no') {
        penaltyMultiplier += 0.2;
        penalties.push("CRM tizimi yo'q (+20% xarajat)");
    }
    if (answers.sales_dept === 'no') {
        penaltyMultiplier += 0.2;
        penalties.push("Sotuv bo'limi yo'q (+20% xarajat)");
    }

    // 3. Budgets
    const baseMinBudget = neededLeads * BENCHMARK_CPL_MIN;
    const baseOptBudget = neededLeads * BENCHMARK_CPL_MAX;

    const finalMinBudget = baseMinBudget * penaltyMultiplier;
    const finalOptBudget = baseOptBudget * penaltyMultiplier;

    // 4. Update UI with animations
    const riskLevel = penalties.length >= 2 ? "🔴 Yuqori" : (penalties.length === 1 ? "🟡 O'rtacha" : "🟢 Past");

    document.getElementById('risk-level').innerText = riskLevel;
    document.getElementById('goal-amount').innerText = `$${goal.toLocaleString()}`;

    // Animate numbers
    animateNumber('needed-clients', neededClients);
    animateNumber('needed-leads', neededLeads);
    document.getElementById('revenue-goal').innerText = `$${goal.toLocaleString()}`;

    document.getElementById('min-budget').innerText = `$${Math.round(finalMinBudget).toLocaleString()}`;
    document.getElementById('opt-budget').innerText = `$${Math.round(finalOptBudget).toLocaleString()}`;

    // Render Penalties
    const penaltyList = document.getElementById('penalties-list');
    penaltyList.innerHTML = '';
    if (penalties.length > 0) {
        penalties.forEach(p => {
            const li = document.createElement('li');
            li.innerText = p;
            penaltyList.appendChild(li);
        });
        document.getElementById('penalties-box').style.display = 'block';
    } else {
        document.getElementById('penalties-box').style.display = 'none';
    }

    // ============================================
    // GENERATE SMART RECOMMENDATIONS
    // ============================================
    generateRecommendations({
        crm: answers.crm_status,
        salesDept: answers.sales_dept,
        socialStatus: answers.social_status,
        platform: answers.platform,
        goal: goal,
        check: check,
        conversion: conv * 100,
        neededLeads: neededLeads,
        minBudget: finalMinBudget
    });

    navigateScreen(wizardScreen, resultsScreen);

    // Trigger confetti!
    setTimeout(() => createConfetti(), 500);
}

// ============================================
// ANIMATE NUMBERS
// ============================================
function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * easeOut);

        element.innerText = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ============================================
// GENERATE RECOMMENDATIONS
// ============================================
function generateRecommendations(data) {
    const recommendations = [];

    // 1. CRM Recommendation
    if (data.crm === 'no') {
        recommendations.push({
            priority: 'high',
            icon: 'fa-database',
            iconClass: 'danger',
            title: 'CRM Tizimini O\'rnating',
            description: 'CRM tizimi (AmoCRM, Bitrix24, yoki boshqa) mijozlar bazasini boshqarish, sotuvlarni kuzatish va takroriy sotuvlarni oshirishda muhim rol o\'ynaydi. CRM yo\'qligi sababli siz mijozlarning 30-40% ini yo\'qotishingiz mumkin.',
            benefit: 'Byudjetni 20% tejash'
        });
    }

    // 2. Sales Team Recommendation
    if (data.salesDept === 'no') {
        recommendations.push({
            priority: 'high',
            icon: 'fa-user-tie',
            iconClass: 'danger',
            title: 'Sotuv Menejerini Yollang',
            description: `Oyiga ${data.neededLeads} ta lidni o'zingiz qayta ishlashingiz qiyin. Professional sotuv menejeri konversiyani 30-50% ga oshirishi va sizning vaqtingizni tejashi mumkin.`,
            benefit: 'Konversiya +30%'
        });
    }

    // 3. Social Media Recommendation
    if (data.socialStatus === 'bad') {
        recommendations.push({
            priority: 'high',
            icon: 'fa-palette',
            iconClass: 'warning',
            title: 'Ijtimoiy Tarmoqlarni Yaxshilang',
            description: 'Yomon upakovka bilan reklama samaradorligi 50% ga tushadi. Professional kontent, highlights, va bio optimizatsiyasi qiling. Brend kitobchasi yarating.',
            benefit: 'CTR +40%'
        });
    } else if (data.socialStatus === 'average') {
        recommendations.push({
            priority: 'medium',
            icon: 'fa-wand-magic-sparkles',
            iconClass: 'warning',
            title: 'Kontentni Kuchaytiring',
            description: 'Reels, Stories va interaktiv kontent qo\'shing. Haftalik kontent rejasini tuzing. UGC (mijozlar kontenti) ni ko\'proq ishlating.',
            benefit: 'Engagement +25%'
        });
    }

    // 4. Platform-specific advice
    const platformAdvice = {
        instagram: {
            icon: 'fa-instagram',
            title: 'Instagram Strategiyasi',
            description: 'Reels reklama eng arzon lidlarni beradi ($0.3-0.8). Carousel postlar engagement ni 3x oshiradi. Stories\'da poll va quiz ishlating.',
            benefit: 'CPL -40%'
        },
        telegram: {
            icon: 'fa-telegram',
            title: 'Telegram Strategiyasi',
            description: 'Kanal + Bot kombinatsiyasi eng yaxshi natija beradi. Mini-App yarating. Avtomatik funnel (bot orqali) o\'rnating.',
            benefit: 'Avtomatizatsiya +50%'
        },
        facebook: {
            icon: 'fa-facebook',
            title: 'Facebook Strategiyasi',
            description: 'Lookalike audience ishlating. Retargeting pikselini o\'rnating. Video reklamalar 2x samarali.',
            benefit: 'ROAS +35%'
        }
    };

    if (platformAdvice[data.platform]) {
        const advice = platformAdvice[data.platform];
        recommendations.push({
            priority: 'medium',
            icon: advice.icon,
            iconClass: 'success',
            title: advice.title,
            description: advice.description,
            benefit: advice.benefit
        });
    }

    // 5. Conversion Rate Advice
    if (data.conversion < 20) {
        recommendations.push({
            priority: 'high',
            icon: 'fa-funnel-dollar',
            iconClass: 'danger',
            title: 'Konversiyani Oshiring',
            description: `${data.conversion}% konversiya past. Skript yozing, taklifni kuchaytiring, va lead magnet (bepul bonus) qo\'shing. Tezkor javob berish (5 daqiqa ichida) konversiyani 2x oshiradi.`,
            benefit: 'Konversiya x2'
        });
    } else if (data.conversion >= 20 && data.conversion < 40) {
        recommendations.push({
            priority: 'low',
            icon: 'fa-chart-line',
            iconClass: 'success',
            title: 'Konversiyani Optimallashtiring',
            description: 'Yaxshi konversiya! Endi upsell va cross-sell strategiyalarini qo\'shing. O\'rtacha chekni oshirish uchun premium paketlar yarating.',
            benefit: 'AOV +20%'
        });
    }

    // 6. Budget Advice
    if (data.minBudget > 1000) {
        recommendations.push({
            priority: 'medium',
            icon: 'fa-piggy-bank',
            iconClass: 'warning',
            title: 'Test Byudjet Bilan Boshlang',
            description: `$${Math.round(data.minBudget)} katta summa. Avval $100-200 bilan 3-5 kun test qiling. CPL ni aniqlang, keyin scale qiling. A/B test o'tkazing.`,
            benefit: 'Xavfni kamaytirish'
        });
    }

    // 7. General Best Practice
    recommendations.push({
        priority: 'low',
        icon: 'fa-lightbulb',
        iconClass: 'success',
        title: 'Tracking va Analytics',
        description: 'UTM teglarini ishlating. Google Analytics va Facebook Pixel o\'rnating. Haftalik hisobot yuritish orasidagi eng yaxshi kreativlarni aniqlaydi.',
        benefit: 'ROI +15%'
    });

    // Render recommendations
    renderRecommendations(recommendations);
}

function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendations-list');
    container.innerHTML = '';

    // Sort by priority
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    recommendations.forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = `recommendation-card priority-${rec.priority}`;
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';

        const priorityLabels = {
            high: 'Muhim',
            medium: 'Tavsiya',
            low: 'Foydali'
        };

        card.innerHTML = `
            <div class="rec-icon ${rec.iconClass}">
                <i class="fa-solid ${rec.icon}"></i>
            </div>
            <div class="rec-content">
                <div class="rec-title">
                    ${rec.title}
                    <span class="priority-badge ${rec.priority}">${priorityLabels[rec.priority]}</span>
                </div>
                <p class="rec-description">${rec.description}</p>
                <span class="rec-benefit">
                    <i class="fa-solid fa-arrow-trend-up"></i>
                    ${rec.benefit}
                </span>
            </div>
        `;

        container.appendChild(card);

        // Animate in
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, 100 * (index + 1));
    });
}

// ============================================
// EVENT LISTENERS
// ============================================
startBtn.addEventListener('click', () => {
    navigateScreen(welcomeScreen, wizardScreen);
    setTimeout(() => renderQuestion(), 400);
});

restartBtn.addEventListener('click', () => {
    currentStep = 0;
    answers = {};
    navigateScreen(resultsScreen, welcomeScreen);
});

nextBtn.addEventListener('click', handleNext);
prevBtn.addEventListener('click', handlePrev);

// ============================================
// SAVE FUNCTIONALITY
// ============================================
const saveBtn = document.getElementById('save-btn');
if (saveBtn) {
    saveBtn.addEventListener('click', saveAudit);
}

function saveAudit() {
    const data = {
        answers: answers,
        results: {
            neededClients: document.getElementById('needed-clients').innerText,
            neededLeads: document.getElementById('needed-leads').innerText,
            minBudget: document.getElementById('min-budget').innerText,
            optBudget: document.getElementById('opt-budget').innerText,
            penalties: document.getElementById('penalties-list').innerText.split('\n')
        }
    };

    // Show loading state
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saqlanmoqda...';
    saveBtn.disabled = true;

    fetch('/api/save-audit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                saveBtn.innerHTML = '✅ Saqlandi!';
                saveBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            saveBtn.innerHTML = '❌ Xatolik';
            saveBtn.disabled = false;
            setTimeout(() => {
                saveBtn.innerHTML = 'Auditni Saqlash <i class="fa-solid fa-save"></i>';
            }, 2000);
        });
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    if (wizardScreen.classList.contains('active')) {
        if (e.key === 'Enter') {
            handleNext();
        } else if (e.key === 'Backspace' && document.activeElement.tagName !== 'INPUT') {
            handlePrev();
        }
    }
});

// ============================================
// SHAKE ANIMATION
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();

    // Set initial display states
    welcomeScreen.style.display = 'block';
    wizardScreen.style.display = 'none';
    resultsScreen.style.display = 'none';
});
