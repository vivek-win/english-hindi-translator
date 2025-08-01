class TranslatorApp {
    constructor() {
        this.currentDirection = 'en-hi';
        this.initializeElements();
        this.attachEventListeners();
        this.updatePlaceholders();
    }

    initializeElements() {
        this.langButtons = document.querySelectorAll('.lang-btn');
        this.inputText = document.getElementById('input-text');
        this.outputText = document.getElementById('output-text');
        this.translateBtn = document.getElementById('translate-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('error-message');
    }

    attachEventListeners() {
        // Language direction buttons
        this.langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeDirection(e.target.dataset.direction);
            });
        });

        // Translate button
        this.translateBtn.addEventListener('click', () => {
            this.translateText();
        });

        // Clear button
        this.clearBtn.addEventListener('click', () => {
            this.clearText();
        });

        // Copy button
        this.copyBtn.addEventListener('click', () => {
            this.copyTranslation();
        });

        // Input text change
        this.inputText.addEventListener('input', () => {
            this.onInputChange();
        });

        // Enter key to translate
        this.inputText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.translateText();
            }
        });
    }

    changeDirection(direction) {
        this.currentDirection = direction;
        
        // Update active button
        this.langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.direction === direction);
        });

        // Clear previous translation
        this.outputText.value = '';
        this.copyBtn.disabled = true;
        
        // Update placeholders
        this.updatePlaceholders();
        
        // Hide error message
        this.hideError();
    }

    updatePlaceholders() {
        if (this.currentDirection === 'en-hi') {
            this.inputText.placeholder = 'Enter English text here...';
            this.outputText.placeholder = 'Hindi translation will appear here...';
        } else {
            this.inputText.placeholder = 'यहाँ हिंदी टेक्स्ट डालें...';
            this.outputText.placeholder = 'English translation will appear here...';
        }
    }

    async translateText() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showError('Please enter some text to translate.');
            return;
        }

        this.showLoading();
        this.translateBtn.disabled = true;

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    direction: this.currentDirection
                })
            });

            const data = await response.json();

            if (data.success) {
                this.outputText.value = data.translated_text;
                this.copyBtn.disabled = false;
                this.hideError();
            } else {
                this.showError(data.error || 'Translation failed');
                this.outputText.value = '';
                this.copyBtn.disabled = true;
            }
        } catch (error) {
            this.showError('Network error. Please check your connection and try again.');
            console.error('Translation error:', error);
        } finally {
            this.hideLoading();
            this.translateBtn.disabled = false;
        }
    }

    clearText() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.copyBtn.disabled = true;
        this.hideError();
        this.inputText.focus();
    }

    async copyTranslation() {
        const text = this.outputText.value;
        
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);
            
            // Visual feedback
            const originalText = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = '✅ Copied!';
            this.copyBtn.style.background = '#00b894';
            
            setTimeout(() => {
                this.copyBtn.innerHTML = originalText;
                this.copyBtn.style.background = '#4ecdc4';
            }, 2000);
            
        } catch (error) {
            // Fallback for older browsers
            this.outputText.select();
            document.execCommand('copy');
            this.showError('Text copied to clipboard!');
        }
    }

    onInputChange() {
        const hasText = this.inputText.value.trim().length > 0;
        this.translateBtn.disabled = !hasText;
        
        if (!hasText) {
            this.outputText.value = '';
            this.copyBtn.disabled = true;
        }
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.hideError();
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.hideLoading();
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TranslatorApp();
});

// Add some utility functions
window.translatorUtils = {
    // Detect if text is primarily Hindi
    isHindiText: function(text) {
        const hindiPattern = /[\u0900-\u097F]/;
        const hindiChars = (text.match(/[\u0900-\u097F]/g) || []).length;
        const totalChars = text.replace(/\s/g, '').length;
        return hindiChars / totalChars > 0.3;
    },
    
    // Auto-detect and suggest direction
    suggestDirection: function(text) {
        return this.isHindiText(text) ? 'hi-en' : 'en-hi';
    }
};
