// ============================================
// MARKETING AUDIT APP - GROUPED QUESTIONS VERSION
// Questions grouped: 1-3, 4-6, 7-9
// ============================================

// Question Groups (3 questions per page)
const questionGroups = [
    // Group 1: Business Profile (Questions 1-3)
    {
        stepTitle: "Biznes profili",
        stepNumber: 1,
        questions: [
            {
                id: 'owner_status',
                title: "Siz biznes egasimisiz?",
                type: 'select',
                options: [
                    { value: 'yes', label: '<i class="fa-solid fa-crown"></i> Ha, egasiman' },
                    { value: 'no', label: '<i class="fa-solid fa-user-tie"></i> Yo\'q, menejerman' }
                ]
            },
            {
                id: 'crm_status',
                title: "Sizda CRM tizimi mavjudmi?",
                type: 'select',
                options: [
                    { value: 'yes', label: '<i class="fa-solid fa-circle-check"></i> Ha, bor' },
                    { value: 'no', label: '<i class="fa-solid fa-circle-xmark"></i> Yo\'q' }
                ]
            },
            {
                id: 'sales_dept',
                title: "Alohida sotuv bo'limi bormi?",
                type: 'select',
                options: [
                    { value: 'yes', label: '<i class="fa-solid fa-users"></i> Ha, bor' },
                    { value: 'no', label: '<i class="fa-solid fa-user"></i> Yo\'q, o\'zim' }
                ]
            }
        ]
    },
    // Group 2: Platform & Industry (Questions 4-6)
    {
        stepTitle: "Soha va platforma",
        stepNumber: 2,
        questions: [
            {
                id: 'social_status',
                title: "Ijtimoiy tarmoqlaringiz holati?",
                type: 'select',
                options: [
                    { value: 'good', label: '<i class="fa-solid fa-fire"></i> Zo\'r' },
                    { value: 'average', label: '<i class="fa-solid fa-thumbs-up"></i> O\'rtacha' },
                    { value: 'bad', label: '<i class="fa-solid fa-thumbs-down"></i> Yomon' }
                ]
            },
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
                    { value: 'instagram', label: '<i class="fa-brands fa-instagram"></i> Instagram' },
                    { value: 'telegram', label: '<i class="fa-brands fa-telegram"></i> Telegram' },
                    { value: 'facebook', label: '<i class="fa-brands fa-facebook"></i> Facebook' },
                    { value: 'other', label: '<i class="fa-solid fa-globe"></i> Boshqa' }
                ]
            }
        ]
    },
    // Group 3: Financials (Questions 7-9)
    {
        stepTitle: "Moliyaviy maqsadlar",
        stepNumber: 3,
        questions: [
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
        ]
    }
];

let currentGroupIndex = 0;
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
// NAVIGATION
// ============================================
function navigateScreen(from, to) {
    from.classList.remove('active');

    setTimeout(() => {
        from.style.display = 'none';
        to.style.display = 'block';
        void to.offsetWidth;
        setTimeout(() => {
            to.classList.add('active');
        }, 50);
    }, 300);
}

// ============================================
// RENDER GROUPED QUESTIONS
// ============================================
function renderQuestionGroup() {
    const group = questionGroups[currentGroupIndex];

    // Update title
    questionTitle.innerHTML = `<span style="color: hsl(var(--primary));">Qadam ${group.stepNumber}/3</span> — ${group.stepTitle}`;

    // Update progress bar
    const progress = ((currentGroupIndex + 1) / questionGroups.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Build HTML for all 3 questions in this group
    let html = '<div class="questions-group">';

    group.questions.forEach((q, idx) => {
        html += `<div class="question-block" style="animation-delay: ${idx * 0.1}s;">`;
        html += `<label class="question-label">${q.title}</label>`;

        if (q.type === 'select') {
            html += `<div class="options-row">`;
            q.options.forEach(opt => {
                const isSelected = answers[q.id] === opt.value ? 'selected' : '';
                html += `
                    <div class="option-card ${isSelected}" onclick="selectOption('${q.id}', '${opt.value}', this)">
                        ${opt.label}
                    </div>
                `;
            });
            html += `</div>`;
        } else {
            const val = answers[q.id] || '';
            html += `
                <input 
                    type="${q.type}" 
                    class="input-field"
                    id="input-${q.id}" 
                    value="${val}" 
                    placeholder="${q.placeholder}" 
                    oninput="saveInput('${q.id}', this.value)"
                >
            `;
        }

        html += `</div>`;
    });

    html += '</div>';
    questionContainer.innerHTML = html;

    // Button states
    prevBtn.classList.toggle('hidden', currentGroupIndex === 0);

    if (currentGroupIndex === questionGroups.length - 1) {
        nextBtn.innerHTML = '🎯 Hisoblash';
    } else {
        nextBtn.innerHTML = 'Keyingisi <i class="fa-solid fa-arrow-right"></i>';
    }
}

// Global functions
window.selectOption = function (id, value, element) {
    answers[id] = value;

    // Remove selection from siblings only
    const parent = element.parentElement;
    parent.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
}

window.saveInput = function (id, value) {
    answers[id] = value;
}

function validateCurrentGroup() {
    const group = questionGroups[currentGroupIndex];
    let isValid = true;
    let firstEmpty = null;

    group.questions.forEach(q => {
        if (!answers[q.id] || answers[q.id].toString().trim() === '') {
            isValid = false;
            if (!firstEmpty) {
                firstEmpty = q.id;
            }
        }
    });

    if (!isValid && firstEmpty) {
        // Highlight empty field
        const input = document.getElementById(`input-${firstEmpty}`);
        if (input) {
            input.style.borderColor = 'hsl(0 84% 60%)';
            input.focus();
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }

        // Shake the card
        const card = document.querySelector('.wizard-card');
        if (card) {
            card.style.animation = 'shake 0.5s';
            setTimeout(() => card.style.animation = '', 500);
        }
    }

    return isValid;
}

function handleNext() {
    if (!validateCurrentGroup()) {
        return;
    }

    if (currentGroupIndex < questionGroups.length - 1) {
        currentGroupIndex++;
        renderQuestionGroup();
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        calculateAndShowResults();
    }
}

function handlePrev() {
    if (currentGroupIndex > 0) {
        currentGroupIndex--;
        renderQuestionGroup();
    }
}

// ============================================
// CALCULATE RESULTS
// ============================================
function calculateAndShowResults() {
    const goal = parseFloat(answers.income_goal);
    const check = parseFloat(answers.avg_check);
    const conv = parseFloat(answers.conversion) / 100;

    const neededClients = Math.ceil(goal / check);
    const neededLeads = Math.ceil(neededClients / conv);

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

    const baseMinBudget = neededLeads * BENCHMARK_CPL_MIN;
    const baseOptBudget = neededLeads * BENCHMARK_CPL_MAX;

    const finalMinBudget = baseMinBudget * penaltyMultiplier;
    const finalOptBudget = baseOptBudget * penaltyMultiplier;

    // Determine risk level text with color coding
    let riskText = "Past";
    let riskClass = "risk-low";
    let badgeClass = "success";
    let iconClass = "risk-low-icon";

    if (penalties.length >= 2) {
        riskText = "Yuqori";
        riskClass = "risk-high";
        badgeClass = "danger";
        iconClass = "risk-high-icon";
    } else if (penalties.length === 1) {
        riskText = "O'rtacha";
        riskClass = "risk-medium";
        badgeClass = "warning";
        iconClass = "risk-medium-icon";
    }

    // Update risk level elements
    const riskElement = document.getElementById('risk-level');
    const riskBadge = document.getElementById('risk-badge');
    const riskDot = document.getElementById('risk-dot');
    const riskIcon = document.getElementById('risk-icon');

    riskElement.innerText = riskText;
    riskElement.className = riskClass;

    if (riskBadge) riskBadge.className = `status-badge ${badgeClass}`;
    if (riskDot) riskDot.className = `fa-solid fa-circle ${riskClass}`;
    if (riskIcon) riskIcon.className = `status-icon-circle ${iconClass}`;
    document.getElementById('goal-amount').innerText = `$${goal.toLocaleString()}`;

    animateNumber('needed-clients', neededClients);
    animateNumber('needed-leads', neededLeads);

    const revenueGoal = document.getElementById('revenue-goal');
    if (revenueGoal) revenueGoal.innerText = `$${goal.toLocaleString()}`;

    const minBudget = document.getElementById('min-budget');
    if (minBudget) minBudget.innerText = `$${Math.round(finalMinBudget).toLocaleString()}`;

    document.getElementById('opt-budget').innerText = `$${Math.round(finalOptBudget).toLocaleString()}`;

    // Penalties
    const penaltyList = document.getElementById('penalties-list');
    const penaltyBox = document.getElementById('penalties-box');
    if (penaltyList && penaltyBox) {
        penaltyList.innerHTML = '';
        if (penalties.length > 0) {
            penalties.forEach(p => {
                const li = document.createElement('li');
                li.innerText = p;
                penaltyList.appendChild(li);
            });
            penaltyBox.style.display = 'block';
        } else {
            penaltyBox.style.display = 'none';
        }
    }

    // Recommendations
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
}

// ============================================
// ANIMATE NUMBERS
// ============================================
function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
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
// AI-POWERED SMART RECOMMENDATIONS
// ============================================
function generateRecommendations(data) {
    const recommendations = [];
    const industry = answers.industry?.toLowerCase() || '';

    // =========================================
    // 1. MUAMMOLARNI ANIQLASH VA HAL QILISH
    // =========================================

    // CRM yo'q - zamonaviy yechimlar
    if (data.crm === 'no') {
        recommendations.push({
            priority: 'high',
            icon: 'fa-robot',
            iconClass: 'danger',
            title: '🤖 AI-Powered CRM O\'rnating',
            description: `Zamonaviy CRM tizimlari sun'iy intellekt bilan ishlaydi. <strong>HubSpot</strong> (bepul), <strong>Bitrix24</strong> yoki <strong>AmoCRM</strong> - bular mijozlarni avtomatik segmentlaydi, follow-up eslatmalar yuboradi va sotuvlarni prognoz qiladi.`,
            benefit: 'Sotuvlar +40%, vaqt tejash 5 soat/hafta',
            tools: ['HubSpot CRM', 'Notion', 'Bitrix24']
        });
    }

    // Sotuv bo'limi yo'q - AI chatbot yechimi
    if (data.salesDept === 'no') {
        recommendations.push({
            priority: 'high',
            icon: 'fa-comments',
            iconClass: 'danger',
            title: '💬 AI Chatbot Sotuv Assistenti',
            description: `Sotuv bo'limi yo'qmi? <strong>AI Chatbot</strong> 24/7 ishlaydi! <strong>ManyChat</strong>, <strong>Tidio</strong> yoki <strong>ChatGPT API</strong> orqali mijozlar savollariga javob beradi, lid yig'adi va hatto sotuvni yopadi.`,
            benefit: 'Lidlarni 70% avtomatik qayta ishlash',
            tools: ['ManyChat', 'Tidio', 'Intercom']
        });
    }

    // Ijtimoiy tarmoq yomon
    if (data.socialStatus === 'bad') {
        recommendations.push({
            priority: 'high',
            icon: 'fa-wand-magic-sparkles',
            iconClass: 'warning',
            title: '✨ AI Kontent Generator',
            description: `Kontent yaratish qiyin? <strong>Canva AI</strong>, <strong>ChatGPT</strong> va <strong>Midjourney</strong> sizga professional darajadagi postlar, reels va stories yaratishda yordam beradi. Haftada 1 soatda 30+ kontent!`,
            benefit: 'Engagement +200%, vaqt tejash 80%',
            tools: ['Canva Pro', 'ChatGPT', 'CapCut']
        });
    } else if (data.socialStatus === 'average') {
        recommendations.push({
            priority: 'medium',
            icon: 'fa-calendar-check',
            iconClass: 'warning',
            title: '📅 Kontent Rejalashtirish',
            description: `<strong>Later</strong>, <strong>Buffer</strong> yoki <strong>Meta Business Suite</strong> orqali postlarni oldindan rejalashtiring. AI analytics bilan eng yaxshi vaqtni aniqlang.`,
            benefit: 'Posting izchilligi +100%',
            tools: ['Later', 'Buffer', 'Hootsuite']
        });
    }

    // =========================================
    // 2. SOHA BO'YICHA MAXSUS YECHIMLAR
    // =========================================

    const industryKeywords = {
        education: ['o\'quv', 'kurs', 'ta\'lim', 'markaz', 'akademiya', 'maktab', 'universitet', 'coaching'],
        ecommerce: ['do\'kon', 'shop', 'savdo', 'magazin', 'online', 'sotish'],
        restaurant: ['restoran', 'kafe', 'oshxona', 'food', 'ovqat', 'yemak'],
        beauty: ['salon', 'go\'zallik', 'sartaroshxona', 'spa', 'kosmetika', 'beauty'],
        medical: ['klinika', 'shifokor', 'tibbiyot', 'stomatolog', 'doctor', 'med'],
        realestate: ['ko\'chmas', 'kvartira', 'uy', 'arenda', 'ijara', 'mulk'],
        fitness: ['sport', 'gym', 'fitness', 'yoga', 'trener'],
        it: ['it', 'dastur', 'texnolog', 'kompyuter', 'web', 'mobil', 'sayt']
    };

    let detectedIndustry = null;
    for (const [ind, keywords] of Object.entries(industryKeywords)) {
        if (keywords.some(kw => industry.includes(kw))) {
            detectedIndustry = ind;
            break;
        }
    }

    const industryRecommendations = {
        education: {
            icon: 'fa-graduation-cap',
            title: '🎓 Ta\'lim Sohasi uchun AI Yechimlar',
            description: `<strong>Teachable</strong> yoki <strong>Thinkific</strong> da online kurs yarating. <strong>Zoom AI</strong> bilan darslarni avtomatik yozib oling. <strong>Notion AI</strong> da o'quv materiallarini yarating. Telegram bot orqali avtomatik ro'yxatga olish.`,
            benefit: 'Passive income +300%',
            tools: ['Teachable', 'Notion AI', 'Zoom']
        },
        ecommerce: {
            icon: 'fa-cart-shopping',
            title: '🛒 E-Commerce AI Avtomatizatsiya',
            description: `<strong>Shopify</strong> + AI inventory management. <strong>Klaviyo</strong> bilan email marketing avtomatlashtiruvi. <strong>ChatGPT</strong> orqali mahsulot tavsiflarini yozing. <strong>Dynamic pricing</strong> AI bilan narxlarni optimallashtiring.`,
            benefit: 'AOV +25%, Conversion +35%',
            tools: ['Shopify', 'Klaviyo', 'Oberlo']
        },
        restaurant: {
            icon: 'fa-utensils',
            title: '🍽️ Restoran AI Yechimlari',
            description: `<strong>Poster POS</strong> yoki <strong>iiko</strong> bilan buyurtmalarni boshqaring. <strong>UberEats/Yandex</strong> integratsiyasi. <strong>AI Chatbot</strong> orqali buyurtma qabul qilish. Google Business profil optimizatsiyasi.`,
            benefit: 'Buyurtmalar +40%',
            tools: ['Poster', 'Yandex Eda', 'Google Business']
        },
        beauty: {
            icon: 'fa-spa',
            title: '💅 Beauty Salon AI Strategiyasi',
            description: `<strong>YCLIENTS</strong> yoki <strong>Booksy</strong> bilan online band qilish. Instagram Reels + TikTok da transformatsiya videolar. <strong>WhatsApp Business</strong> avtomatik eslatmalar. Referral dasturi yarating.`,
            benefit: 'Qayta tashriflar +50%',
            tools: ['YCLIENTS', 'Booksy', 'WhatsApp Business']
        },
        medical: {
            icon: 'fa-stethoscope',
            title: '🏥 Tibbiyot uchun Digital Marketing',
            description: `<strong>DocDoc</strong> yoki <strong>ProDoctorov</strong> da profil yarating. Google My Business reviews yig'ish. <strong>Telegram bot</strong> qabul qilish. Video konsultatsiya platformasi (<strong>Zoom Healthcare</strong>).`,
            benefit: 'Yangi bemorlar +60%',
            tools: ['Google Business', 'Telegram Bot', 'Zoom']
        },
        realestate: {
            icon: 'fa-building',
            title: '🏠 Ko\'chmas Mulk AI Marketing',
            description: `<strong>3D virtual tourlar</strong> yarating (<strong>Matterport</strong>). AI bilan potentsial mijozlarni aniqlang. <strong>Facebook Lead Ads</strong> + CRM integratsiya. <strong>WhatsApp automation</strong> orqali follow-up.`,
            benefit: 'Lead quality +45%',
            tools: ['Matterport', 'Facebook Ads', 'WhatsApp']
        },
        fitness: {
            icon: 'fa-dumbbell',
            title: '💪 Fitness AI Marketing',
            description: `<strong>Trainerize</strong> yoki <strong>TrueCoach</strong> da online mashg'ulotlar. Instagram Reels transformatsiyalar. <strong>Telegram subscription bot</strong>. <strong>Stripe</strong> bilan avtomatik to'lov.`,
            benefit: 'Online daromad +200%',
            tools: ['Trainerize', 'Stripe', 'Telegram']
        },
        it: {
            icon: 'fa-code',
            title: '💻 IT/Tech Marketing AI',
            description: `<strong>LinkedIn Ads</strong> B2B uchun. <strong>GitHub</strong> portfolio. <strong>Clutch/Upwork</strong> profil optimizatsiyasi. <strong>AI code review</strong> xizmatlarini taklif qiling. Content marketing blog.`,
            benefit: 'B2B leads +80%',
            tools: ['LinkedIn', 'Clutch', 'Upwork']
        }
    };

    if (detectedIndustry && industryRecommendations[detectedIndustry]) {
        const indRec = industryRecommendations[detectedIndustry];
        recommendations.push({
            priority: 'high',
            icon: indRec.icon,
            iconClass: 'success',
            title: indRec.title,
            description: indRec.description,
            benefit: indRec.benefit,
            tools: indRec.tools
        });
    }

    // =========================================
    // 3. PLATFORMA BO'YICHA ZAMONAVIY STRATEGIYALAR
    // =========================================

    const platformAdvice = {
        instagram: {
            icon: 'fa-instagram',
            title: '📸 Instagram 2024 Strategiyasi',
            description: `<strong>Reels</strong> - eng yuqori reach. <strong>AI Caption Generator</strong> (ChatGPT) ishlating. <strong>Hashtag strategiyasi</strong>: 5 katta + 10 niche + 5 branded. <strong>Carousel posts</strong> save rate ni 3x oshiradi. <strong>Collab posts</strong> bilan auditoriya almashing.`,
            benefit: 'Reach +300%, CPL -50%',
            tools: ['Later', 'Canva', 'ChatGPT']
        },
        telegram: {
            icon: 'fa-telegram',
            title: '✈️ Telegram Marketing Pro',
            description: `<strong>Kanal + Guruh + Bot</strong> uchligini yarating. <strong>Mini App</strong> bilan buyurtma qabul qiling. <strong>Invite link tracking</strong> qayerdan kelayotganini aniqlaydi. <strong>Premium emoji</strong> va <strong>reactions</strong> engagement oshiradi.`,
            benefit: 'Konversiya +60%',
            tools: ['BotFather', 'Teletype', 'TGStat']
        },
        facebook: {
            icon: 'fa-facebook',
            title: '📘 Facebook Ads Advanced',
            description: `<strong>Advantage+ Shopping</strong> AI kampaniyalar. <strong>Lookalike 1%</strong> audience eng sifatli. <strong>CAPI (Conversions API)</strong> o'rnating iOS tracking uchun. <strong>Dynamic Creative Testing</strong> avtomatik A/B test.`,
            benefit: 'ROAS +45%',
            tools: ['Meta Business Suite', 'Triple Whale']
        }
    };

    if (platformAdvice[data.platform]) {
        const advice = platformAdvice[data.platform];
        recommendations.push({
            priority: 'medium',
            icon: advice.icon,
            iconClass: 'primary',
            title: advice.title,
            description: advice.description,
            benefit: advice.benefit,
            tools: advice.tools
        });
    }

    // =========================================
    // 4. UMUMIY AI YECHIMLAR (Hamma uchun foydali)
    // =========================================

    // Konversiya past bo'lsa
    if (data.conversion < 20) {
        recommendations.push({
            priority: 'high',
            icon: 'fa-bullseye',
            iconClass: 'danger',
            title: '🎯 Konversiya Oshirish AI',
            description: `<strong>Hotjar</strong> bilan foydalanuvchi xatti-harakatlarini kuzating. <strong>A/B testing</strong> (Google Optimize). <strong>AI chatbot</strong> tez javob beradi (5 daqiqa ichida konversiya 21x yuqori!). <strong>Exit-intent popup</strong> qo'shing.`,
            benefit: 'Konversiya x2-3',
            tools: ['Hotjar', 'Optimizely', 'Tidio']
        });
    }

    // Byudjet katta bo'lsa
    if (data.minBudget > 500) {
        recommendations.push({
            priority: 'medium',
            icon: 'fa-chart-pie',
            iconClass: 'warning',
            title: '📊 Smart Budget Allocation',
            description: `70-20-10 qoidasi: <strong>70%</strong> ishlayotgan kanallarga, <strong>20%</strong> yangi test kanallarga, <strong>10%</strong> eksperimental. <strong>Triple Whale</strong> yoki <strong>Hyros</strong> bilan ROASni real-time kuzating.`,
            benefit: 'Byudjet samaradorligi +30%',
            tools: ['Triple Whale', 'Google Analytics 4']
        });
    }

    // Hamma uchun foydali
    recommendations.push({
        priority: 'low',
        icon: 'fa-brain',
        iconClass: 'success',
        title: '🧠 AI Marketing Stack 2024',
        description: `Zamonaviy marketingning asosiy vositalari: <strong>ChatGPT</strong> (kontent), <strong>Canva AI</strong> (dizayn), <strong>Zapier</strong> (avtomatizatsiya), <strong>Notion AI</strong> (rejalashtirish). Bu to'rtlik sizning virtual marketing jamoangiz!`,
        benefit: 'Samaradorlik +500%',
        tools: ['ChatGPT', 'Canva', 'Zapier', 'Notion']
    });

    renderRecommendations(recommendations);
}

function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendations-list');
    if (!container) return;

    container.innerHTML = '';

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    recommendations.forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = `recommendation-card priority-${rec.priority}`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';

        const priorityLabels = { high: '🔴 Muhim', medium: '🟡 Tavsiya', low: '🟢 Foydali' };

        // Tools badges
        let toolsHtml = '';
        if (rec.tools && rec.tools.length > 0) {
            toolsHtml = `<div class="rec-tools">${rec.tools.map(t => `<span class="tool-badge">${t}</span>`).join('')}</div>`;
        }

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
                ${toolsHtml}
                <span class="rec-benefit">
                    <i class="fa-solid fa-rocket"></i>
                    ${rec.benefit}
                </span>
            </div>
        `;

        container.appendChild(card);

        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
}

// ============================================
// EVENT LISTENERS
// ============================================
startBtn.addEventListener('click', () => {
    navigateScreen(welcomeScreen, wizardScreen);
    setTimeout(() => renderQuestionGroup(), 400);
});

restartBtn.addEventListener('click', () => {
    currentGroupIndex = 0;
    answers = {};
    navigateScreen(resultsScreen, welcomeScreen);
});

nextBtn.addEventListener('click', handleNext);
prevBtn.addEventListener('click', handlePrev);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (wizardScreen.classList.contains('active')) {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'INPUT') {
            handleNext();
        }
    }
});

// Shake animation
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
    welcomeScreen.style.display = 'block';
    wizardScreen.style.display = 'none';
    resultsScreen.style.display = 'none';
});
