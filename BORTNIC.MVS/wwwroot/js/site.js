document.addEventListener("DOMContentLoaded", () => {

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });

    // Модальные окна
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    // Открытие
    document.getElementById("openLogin").addEventListener("click", () => {
        loginModal.style.display = "flex";
    });
    document.getElementById("openRegister").addEventListener("click", () => {
        registerModal.style.display = "flex";
    });

    // Переключение между окнами
    document.getElementById("switchToRegister").addEventListener("click", e => {
        e.preventDefault();
        loginModal.style.display = "none";
        registerModal.style.display = "flex";
    });
    document.getElementById("switchToLogin").addEventListener("click", e => {
        e.preventDefault();
        registerModal.style.display = "none";
        loginModal.style.display = "flex";
    });

    // Закрытие
    document.querySelectorAll(".close").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById(btn.dataset.close).style.display = "none";
        });
    });

    // Закрытие при клике вне окна
    window.addEventListener("click", e => {
        if (e.target.classList.contains("modal")) {
            e.target.style.display = "none";
        }
    });

    // Отправка форм
    document.querySelectorAll(".auth-form").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();
            alert("✅ Успешно!");
            form.reset();
            loginModal.style.display = "none";
            registerModal.style.display = "none";
        });
    });

    // Сообщение (форма “Написать сообщение”)
    const messageForm = document.getElementById("messageForm");
    if (messageForm) {
        messageForm.addEventListener("submit", e => {
            e.preventDefault();
            alert("✅ Ваше сообщение отправлено!");
            messageForm.reset();
        });
    }
});
