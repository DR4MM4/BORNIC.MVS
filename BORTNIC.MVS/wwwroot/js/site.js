// ===========================
// MasterService site.js — часть 1
// ===========================

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function () {
    console.log('MasterService initialized');

    initModalSystem();
    initScrollAnimations();
    initCounterAnimation();
    initScrollToTop();
    initSmoothScroll();
    initContactForm();
});

// ===========================
// Система модальных окон
// ===========================
function initModalSystem() {
    console.log('Modal system initialized');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleLogin(this);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleRegister(this);
        });
    }

    // Закрытие по ESC
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeAllModals();
    });

    // Предотвращаем закрытие при клике на модальное окно
    document.querySelectorAll('.modal-content').forEach(modalContent => {
        modalContent.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('active'), 10);
}

function openRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (!modal) return;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function closeAllModals() {
    closeLoginModal();
    closeRegisterModal();
}

function switchToRegister() {
    closeLoginModal();
    setTimeout(() => openRegisterModal(), 350);
}

function switchToLogin() {
    closeRegisterModal();
    setTimeout(() => openLoginModal(), 350);
}

// ===========================
// Система уведомлений
// ===========================
function showNotification(message, type = 'info') {
    let container = document.getElementById('notifications-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    const backgroundColor = {
        success: '#4ade80',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#4361ee'
    }[type] || '#4361ee';

    notification.style.cssText = `
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 500;
        max-width: 300px;
    `;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => notification.style.transform = 'translateX(0)', 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}
// ===========================
// LOGIN через fetch
// ===========================
async function handleLogin(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    const data = {
        Email: document.getElementById("loginEmail").value,
        Password: document.getElementById("loginPassword").value
    };

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
    submitBtn.disabled = true;

    try {
        const response = await fetch("/Account/LoginFetch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
            showNotification(result.message, "success");
            closeLoginModal();
        } else {
            showNotification(result.message, "error");
        }
    } catch (err) {
        showNotification("Ошибка сервера при входе", "error");
        console.error(err);
    }

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

// ===========================
// REGISTER через fetch
// ===========================
async function handleRegister(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    const data = {
        Name: document.getElementById("regName").value,
        Phone: document.getElementById("regPhone").value,
        Email: document.getElementById("regEmail").value,
        Password: document.getElementById("regPassword").value,
        ConfirmPassword: document.getElementById("regConfirmPassword").value
    };

    if (data.Password !== data.ConfirmPassword) {
        showNotification("Пароли не совпадают!", "error");
        return;
    }

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
    submitBtn.disabled = true;

    try {
        const response = await fetch("/Account/RegisterFetch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
            showNotification(result.message, "success");
            closeRegisterModal();
        } else {
            showNotification(result.message, "error");
        }
    } catch (err) {
        showNotification("Ошибка сервера при регистрации", "error");
        console.error(err);
    }

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

// ===========================
// Контактная форма Index.cshtml
// ===========================
function initContactForm() {
    const contactForm = document.querySelector(".contact-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            Name: document.getElementById("contactName").value,
            Phone: document.getElementById("contactPhone").value,
            Subject: document.getElementById("contactSubject").value,
            Message: document.getElementById("contactMessage").value
        };

        const btn = contactForm.querySelector("button");
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        btn.disabled = true;

        try {
            const response = await fetch("/Home/SendMessage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (result.success) {
                showNotification(result.message, "success");
                contactForm.reset();
            } else {
                showNotification(result.message, "error");
            }
        } catch (err) {
            showNotification("Ошибка сервера при отправке сообщения", "error");
            console.error(err);
        }

        btn.innerHTML = original;
        btn.disabled = false;
    });
}

// ===========================
// Плавная прокрутка к якорям
// ===========================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;

            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===========================
// Анимации при скролле
// ===========================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                if (entry.target.classList.contains('services-grid')) {
                    const cards = entry.target.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => card.classList.add('active'), index * 200);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .services-grid, .service-card').forEach(el => {
        observer.observe(el);
    });
}

// ===========================
// Анимация счетчиков
// ===========================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = +counter.parentElement.getAttribute('data-count');
        const suffix = counter.parentElement.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(counter.parentElement);
    });
}

// ===========================
// Кнопка "Наверх"
// ===========================
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Наверх');
    scrollBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) scrollBtn.classList.add('visible');
        else scrollBtn.classList.remove('visible');
    });
}

// ===========================
// Анимация хедера при скролле
// ===========================
window.addEventListener('scroll', function () {
    const header = document.querySelector('.main-header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
        header.classList.add('scrolled');
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = 'var(--shadow-lg)';
    } else {
        header.classList.remove('scrolled');
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'var(--shadow)';
    }
});

// ===========================
// Placeholder для полей ввода
// ===========================
document.querySelectorAll('.input-group input, .input-group textarea').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function () {
        if (!this.value) this.parentElement.classList.remove('focused');
    });
});
// Базовые функции
document.addEventListener('DOMContentLoaded', function () {
    console.log('MasterService loaded');
});

// Функции для модальных окон (если понадобятся позже)
function openLoginModal() {
    alert('Форма входа будет здесь');
}

function openRegisterModal() {
    alert('Форма регистрации будет здесь');
}
