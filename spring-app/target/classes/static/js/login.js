/* ==========================================================================
   Sistema de Agendamento - SEE/PB
   Login Scripts
   ========================================================================== */

(function() {
    'use strict';

    /* --------------------------------------------------------------------------
       Configuration
       -------------------------------------------------------------------------- */
    const CONFIG = {
        apiBaseUrl: '', // Deixe vazio para usar caminhos relativos
        loginEndpoint: '/api/login',
        dashboardUrl: '/dashboard',
        govBrAuthUrl: '/auth/govbr',
        errorTimeout: 5000
    };

    /* --------------------------------------------------------------------------
       DOM Elements
       -------------------------------------------------------------------------- */
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    const eyeIcon = document.getElementById('eyeIcon');
    const btnLogin = document.querySelector('.btn-login');

    /* --------------------------------------------------------------------------
       Icons SVG
       -------------------------------------------------------------------------- */
    const icons = {
        eyeOpen: `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        `,
        eyeClosed: `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        `
    };

    /* --------------------------------------------------------------------------
       Password Toggle
       -------------------------------------------------------------------------- */
    function togglePassword() {
        const isPassword = passwordInput.type === 'password';
        const toggle = document.querySelector('.password-toggle');

        passwordInput.type = isPassword ? 'text' : 'password';
        eyeIcon.innerHTML = isPassword ? icons.eyeClosed : icons.eyeOpen;

        // Update aria-label
        toggle.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
        toggle.setAttribute('data-visible', isPassword ? 'true' : 'false');
    }

    /* --------------------------------------------------------------------------
       Form Validation
       -------------------------------------------------------------------------- */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cpfRegex = /^\d{11}$/;
        const cpfFormatted = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

        return emailRegex.test(email) || cpfRegex.test(email) || cpfFormatted.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function clearFieldError(field) {
        field.classList.remove('input-error');
        const wrapper = field.closest('.form-group');
        const errorMsg = wrapper.querySelector('.field-error');
        if (errorMsg) errorMsg.remove();
    }

    function showFieldError(field, message) {
        field.classList.add('input-error');
        const wrapper = field.closest('.form-group');

        // Remove erro anterior
        const existingError = wrapper.querySelector('.field-error');
        if (existingError) existingError.remove();

        const errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        errorSpan.textContent = message;
        errorSpan.style.cssText = 'color: #dc2626; font-size: 12px; margin-top: 4px; display: block;';
        wrapper.appendChild(errorSpan);
    }

    /* --------------------------------------------------------------------------
       Loading State
       -------------------------------------------------------------------------- */
    function setLoading(isLoading) {
        if (btnLogin) {
            btnLogin.classList.toggle('loading', isLoading);
            btnLogin.disabled = isLoading;
            btnLogin.textContent = isLoading ? 'Entrando...' : 'Entrar no Sistema';
        }
    }

    /* --------------------------------------------------------------------------
       Form Submit Handler
       -------------------------------------------------------------------------- */
    function handleSubmit(event) {
        event.preventDefault();

        const emailField = document.getElementById('email');
        const email = emailField.value.trim();
        const password = passwordInput.value;
        const remember = document.querySelector('input[name="remember"]').checked;

        // Limpa erros anteriores
        clearFieldError(emailField);
        clearFieldError(passwordInput);

        // Validação
        let hasError = false;

        if (!email) {
            showFieldError(emailField, 'Campo obrigatório');
            hasError = true;
        } else if (!validateEmail(email)) {
            showFieldError(emailField, 'E-mail ou CPF inválido');
            hasError = true;
        }

        if (!password) {
            showFieldError(passwordInput, 'Campo obrigatório');
            hasError = true;
        } else if (!validatePassword(password)) {
            showFieldError(passwordInput, 'Mínimo 6 caracteres');
            hasError = true;
        }

        if (hasError) return;

        // Dados para enviar
        const formData = {
            email: email,
            password: password,
            remember: remember
        };

        // Envia para o servidor
        submitLogin(formData);
    }

    /* --------------------------------------------------------------------------
       API Integration
       -------------------------------------------------------------------------- */
    async function submitLogin(data) {
        setLoading(true);

        try {
            const response = await fetch(CONFIG.apiBaseUrl + CONFIG.loginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Salva token se retornado
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                }

                // Redireciona para dashboard
                showSuccess('Login realizado com sucesso!');
                setTimeout(() => {
                    window.location.href = result.redirect || CONFIG.dashboardUrl;
                }, 500);
            } else {
                showError(result.message || 'Credenciais inválidas.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Erro ao conectar com o servidor. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    /* --------------------------------------------------------------------------
       Messages Display
       -------------------------------------------------------------------------- */
    function showError(message) {
        showMessage(message, 'error');
    }

    function showSuccess(message) {
        showMessage(message, 'success');
    }

    function showMessage(message, type) {
        // Remove mensagem anterior se existir
        const existingMsg = document.querySelector('.alert-message');
        if (existingMsg) {
            existingMsg.remove();
        }

        const isError = type === 'error';
        const msgDiv = document.createElement('div');
        msgDiv.className = `alert-message alert-${type}`;
        msgDiv.style.cssText = `
            background: ${isError ? '#fef2f2' : '#f0fdf4'};
            border: 1px solid ${isError ? '#fecaca' : '#bbf7d0'};
            color: ${isError ? '#dc2626' : '#16a34a'};
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease;
        `;

        const iconPath = isError
            ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
            : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>';

        msgDiv.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${iconPath}
            </svg>
            <span>${message}</span>
        `;

        // Insere antes do formulário
        const container = loginForm.closest('.login-container') || loginForm.parentNode;
        container.insertBefore(msgDiv, loginForm);

        // Remove após timeout
        if (type === 'error') {
            setTimeout(() => {
                msgDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => msgDiv.remove(), 300);
            }, CONFIG.errorTimeout);
        }
    }

    /* --------------------------------------------------------------------------
       Gov.br Button Handler
       -------------------------------------------------------------------------- */
    function handleGovBrLogin() {
        // Redireciona para autenticação Gov.br
        window.location.href = CONFIG.govBrAuthUrl;
    }

    /* --------------------------------------------------------------------------
       Keyboard Navigation
       -------------------------------------------------------------------------- */
    function handleKeyboard(event) {
        // Enter em qualquer input submete o form
        if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
            handleSubmit(event);
        }
    }

    /* --------------------------------------------------------------------------
       Input Masks (CPF)
       -------------------------------------------------------------------------- */
    function handleEmailInput(event) {
        const value = event.target.value;

        // Se começar com número, aplica máscara de CPF
        if (/^\d/.test(value)) {
            const numbers = value.replace(/\D/g, '').slice(0, 11);
            let formatted = numbers;

            if (numbers.length > 3) {
                formatted = numbers.slice(0, 3) + '.' + numbers.slice(3);
            }
            if (numbers.length > 6) {
                formatted = formatted.slice(0, 7) + '.' + numbers.slice(6);
            }
            if (numbers.length > 9) {
                formatted = formatted.slice(0, 11) + '-' + numbers.slice(9);
            }

            event.target.value = formatted;
        }
    }

    /* --------------------------------------------------------------------------
       CSS Animations (inject once)
       -------------------------------------------------------------------------- */
    function injectStyles() {
        if (document.getElementById('login-js-styles')) return;

        const style = document.createElement('style');
        style.id = 'login-js-styles';
        style.textContent = `
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
            .input-error {
                border-color: #dc2626 !important;
            }
        `;
        document.head.appendChild(style);
    }

    /* --------------------------------------------------------------------------
       Event Listeners
       -------------------------------------------------------------------------- */
    function init() {
        // Inject styles
        injectStyles();

        // Password toggle
        if (passwordToggle) {
            passwordToggle.addEventListener('click', togglePassword);
        }

        // Form submit
        if (loginForm) {
            loginForm.addEventListener('submit', handleSubmit);
        }

        // Gov.br button
        const govBtn = document.querySelector('.btn-gov');
        if (govBtn) {
            govBtn.addEventListener('click', handleGovBrLogin);
        }

        // Email/CPF input mask
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', handleEmailInput);
            emailInput.addEventListener('focus', () => clearFieldError(emailInput));
        }

        // Password field clear error on focus
        if (passwordInput) {
            passwordInput.addEventListener('focus', () => clearFieldError(passwordInput));
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
