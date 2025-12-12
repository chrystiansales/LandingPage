/* ==========================================================================
   Sistema de Agendamento - SEE/PB
   Login Scripts
   ========================================================================== */

(function() {
    'use strict';

    /* --------------------------------------------------------------------------
       DOM Elements
       -------------------------------------------------------------------------- */
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    const eyeIcon = document.getElementById('eyeIcon');

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

        passwordInput.type = isPassword ? 'text' : 'password';
        eyeIcon.innerHTML = isPassword ? icons.eyeClosed : icons.eyeOpen;
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

    /* --------------------------------------------------------------------------
       Form Submit Handler
       -------------------------------------------------------------------------- */
    function handleSubmit(event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value;
        const remember = document.querySelector('input[name="remember"]').checked;

        // Validação
        if (!validateEmail(email)) {
            showError('Por favor, insira um e-mail ou CPF válido.');
            return;
        }

        if (!validatePassword(password)) {
            showError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // Dados para enviar ao Laravel
        const formData = {
            email: email,
            password: password,
            remember: remember
        };

        // Aqui você integra com o Laravel via fetch ou axios
        console.log('Login data:', formData);

        // Exemplo de integração com Laravel:
        // submitLogin(formData);
    }

    /* --------------------------------------------------------------------------
       Laravel Integration (Template)
       -------------------------------------------------------------------------- */
    async function submitLogin(data) {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Redirecionar para dashboard
                window.location.href = result.redirect || '/dashboard';
            } else {
                showError(result.message || 'Credenciais inválidas.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Erro ao conectar com o servidor.');
        }
    }

    /* --------------------------------------------------------------------------
       Error Display
       -------------------------------------------------------------------------- */
    function showError(message) {
        // Remove erro anterior se existir
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Cria elemento de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        errorDiv.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            ${message}
        `;

        // Insere antes do formulário
        loginForm.parentNode.insertBefore(errorDiv, loginForm);

        // Remove após 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /* --------------------------------------------------------------------------
       Gov.br Button Handler
       -------------------------------------------------------------------------- */
    function handleGovBrLogin() {
        // Redirecionar para autenticação Gov.br
        // window.location.href = '/auth/govbr';
        console.log('Redirecionando para Gov.br...');
    }

    /* --------------------------------------------------------------------------
       Event Listeners
       -------------------------------------------------------------------------- */
    function init() {
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
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
