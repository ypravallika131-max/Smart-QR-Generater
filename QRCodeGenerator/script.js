class QRCodeGenerator {
    constructor() {
        this.currentCodeType = 'qrcode';
        this.qrcode = null;
        this.history = [];
        this.maxHistoryItems = 6;
        this.totalCodesGenerated = 0;
        
        this.init();
    }

    init() {
        console.log('Initializing QR Code Generator...');
        this.initializeLoadingScreen();
        this.setupEventListeners();
        this.loadHistory();
        this.generateInitialCode();
        this.animateOnLoad();
        this.updateStatsCounter();
        this.initializeOptions();
    }

    initializeLoadingScreen() {
        // Generate QR dots for loading screen
        const qrGrid = document.getElementById('qr-grid-loading');
        if (qrGrid) {
            qrGrid.innerHTML = Array(64).fill().map((_, i) => {
                const isActive = Math.random() > 0.3;
                const delay = Math.random() * 2;
                return `<div class="qr-dot" style="animation-delay: ${delay}s; opacity: ${isActive ? '1' : '0.1'}"></div>`;
            }).join('');
        }

        // Animate QR dots
        const dots = qrGrid?.querySelectorAll('.qr-dot');
        if (dots) {
            dots.forEach((dot, index) => {
                setInterval(() => {
                    const isActive = Math.random() > 0.5;
                    dot.style.opacity = isActive ? '1' : '0.1';
                }, 1000 + (index * 100));
            });
        }

        // Hide loading screen after 3 seconds
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 3000);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        if (mainContent) {
            mainContent.style.transition = 'opacity 0.5s ease-in';
            mainContent.style.opacity = '1';
        }
    }

    initializeOptions() {
        // Set initial active states
        const qrOptions = document.getElementById('qrcode-options');
        const barcodeOptions = document.getElementById('barcode-options');
        const qrContainer = document.getElementById('qrcode-container');
        const barcodeContainer = document.getElementById('barcode-container');
        
        if (qrOptions) qrOptions.classList.add('active');
        if (barcodeOptions) barcodeOptions.classList.remove('active');
        if (qrContainer) qrContainer.classList.add('active');
        if (barcodeContainer) barcodeContainer.classList.remove('active');
    }

    animateOnLoad() {
        // Animate hero section
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            setTimeout(() => {
                heroContent.style.transition = 'all 0.8s ease-out';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }

        // Animate feature pills
        const pills = document.querySelectorAll('.pill');
        pills.forEach((pill, index) => {
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(20px)';
            setTimeout(() => {
                pill.style.transition = 'all 0.5s ease-out';
                pill.style.opacity = '1';
                pill.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });

        // Animate generator sections
        const generator = document.querySelector('.modern-generator');
        if (generator) {
            generator.style.opacity = '0';
            generator.style.transform = 'translateY(50px)';
            setTimeout(() => {
                generator.style.transition = 'all 1s ease-out';
                generator.style.opacity = '1';
                generator.style.transform = 'translateY(0)';
            }, 400);
        }
    }

    updateStatsCounter() {
        const counter = document.getElementById('total-codes');
        if (counter) {
            const target = this.totalCodesGenerated;
            let current = 0;
            const increment = Math.ceil(target / 50);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current;
            }, 30);
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Code type selector
        document.querySelectorAll('.code-type-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const radio = card.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    this.switchCodeType(radio.value);
                    this.updateCodeTypeCards(radio.value);
                }
            });
        });

        // Generate button
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            console.log('Generate button found, adding event listener...');
            generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Generate button clicked!');
                this.addRippleEffect(e);
                this.generateCode();
            });
        } else {
            console.error('Generate button not found!');
        }

        // Paste button
        const pasteBtn = document.getElementById('paste-btn');
        if (pasteBtn) {
            pasteBtn.addEventListener('click', () => {
                this.pasteFromClipboard();
            });
        }

        // Clear input button
        const clearInputBtn = document.getElementById('clear-input-btn');
        if (clearInputBtn) {
            clearInputBtn.addEventListener('click', () => {
                this.clearInput();
            });
        }

        // Reset all button
        const resetAllBtn = document.getElementById('reset-all');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                this.resetAll();
            });
        }

        // Export options
        const exportQuality = document.getElementById('export-quality');
        if (exportQuality) {
            exportQuality.addEventListener('input', (e) => {
                const sliderValue = exportQuality.nextElementSibling;
                if (sliderValue && sliderValue.classList.contains('slider-value')) {
                    sliderValue.textContent = e.target.value;
                }
            });
        }

        // Download button
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadCode();
            });
        }

        // Copy button
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyToClipboard();
            });
        }

        // Clear history button
        const clearHistoryBtn = document.getElementById('clear-history-btn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.clearHistory();
            });
        }

        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const templateType = e.target.closest('.template-card').dataset.type;
                
                if (action === 'use') {
                    this.useTemplate(templateType);
                } else if (action === 'preview') {
                    this.openTemplatePreview(templateType);
                }
            });
        });

        // Expand/Collapse templates
        const expandBtn = document.getElementById('expand-templates');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                this.toggleTemplates();
            });
        }

        // Template modal controls
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeTemplatePreview();
            });
        }

        const modalBackdrop = document.getElementById('modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', () => {
                this.closeTemplatePreview();
            });
        }

        const applyTemplate = document.getElementById('apply-template');
        if (applyTemplate) {
            applyTemplate.addEventListener('click', () => {
                this.applyTemplateFromPreview();
            });
        }

        const cancelTemplate = document.getElementById('cancel-template');
        if (cancelTemplate) {
            cancelTemplate.addEventListener('click', () => {
                this.closeTemplatePreview();
            });
        }

        // Keyboard shortcuts for modal
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('template-form-modal');
            if (modal && modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeTemplatePreview();
                } else if (e.key === 'Enter' && e.ctrlKey) {
                    this.applyTemplateFromPreview();
                }
            }
        });

        // Modal controls
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const modalCancel = document.getElementById('modal-cancel');
        if (modalCancel) {
            modalCancel.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const modalGenerate = document.getElementById('modal-generate');
        if (modalGenerate) {
            modalGenerate.addEventListener('click', () => {
                this.generateFromTemplate();
            });
        }

        // Close modal on outside click
        const modal = document.getElementById('template-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Barcode format change handler
        const barcodeFormat = document.getElementById('barcode-format');
        if (barcodeFormat) {
            barcodeFormat.addEventListener('change', (e) => {
                this.updateFormatDescription(e.target.value);
                // Auto-generate if real-time generation is enabled
                if (document.getElementById('real-time-generation')?.checked) {
                    const inputText = document.getElementById('input-text')?.value;
                    if (inputText) {
                        this.generateCode(false);
                    }
                }
            });
            // Initialize description
            this.updateFormatDescription(barcodeFormat.value);
        }

        // Color input updates
        document.querySelectorAll('input[type="color"]').forEach(colorInput => {
            colorInput.addEventListener('input', (e) => {
                const colorValue = e.target.nextElementSibling;
                if (colorValue && colorValue.classList.contains('color-value')) {
                    colorValue.textContent = e.target.value;
                }
            });
        });

        // Advanced toggle
        const toggleAdvanced = document.getElementById('toggle-advanced');
        if (toggleAdvanced) {
            toggleAdvanced.addEventListener('click', () => {
                this.toggleAdvancedOptions();
            });
        }
    }

    updateCodeTypeCards(selectedType) {
        document.querySelectorAll('.code-type-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const selectedCard = document.querySelector(`.code-type-card[data-type="${selectedType}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }
    }

    updateCharCounter() {
        const inputText = document.getElementById('input-text');
        const charCount = document.getElementById('char-count');
        if (inputText && charCount) {
            charCount.textContent = inputText.value.length;
        }
    }

    addRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = button.querySelector('.btn-ripple');
        if (ripple) {
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.animation = 'none';
            
            setTimeout(() => {
                ripple.style.animation = 'ripple 0.6s ease-out';
            }, 10);
        }
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            const inputText = document.getElementById('input-text');
            if (inputText) {
                inputText.value = text;
                this.updateCharCounter();
                this.generateCode(false);
                this.showMessage('Text pasted successfully!', 'success');
            }
        } catch (error) {
            this.showMessage('Failed to paste from clipboard', 'error');
        }
    }

    resetAll() {
        // Reset all inputs to default values
        const inputText = document.getElementById('input-text');
        if (inputText) {
            inputText.value = 'https://example.com';
        }
        
        // Reset QR options
        const qrSize = document.getElementById('qr-size');
        if (qrSize) qrSize.value = '256';
        
        const qrErrorCorrection = document.getElementById('qr-error-correction');
        if (qrErrorCorrection) qrErrorCorrection.value = 'M';
        
        const qrDarkColor = document.getElementById('qr-dark-color');
        if (qrDarkColor) {
            qrDarkColor.value = '#000000';
            const colorValue = qrDarkColor.nextElementSibling;
            if (colorValue) colorValue.textContent = '#000000';
        }
        
        const qrLightColor = document.getElementById('qr-light-color');
        if (qrLightColor) {
            qrLightColor.value = '#ffffff';
            const colorValue = qrLightColor.nextElementSibling;
            if (colorValue) colorValue.textContent = '#ffffff';
        }
        
        this.updateCharCounter();
        this.generateCode(false);
        this.showMessage('All settings reset to default', 'success');
    }

    toggleAdvancedOptions() {
        const toggleBtn = document.getElementById('toggle-advanced');
        const options = document.querySelectorAll('.options-content');
        
        options.forEach(option => {
            option.classList.toggle('active');
        });
        
        if (toggleBtn) {
            toggleBtn.textContent = options[0].classList.contains('active') ? 'Simple' : 'Advanced';
        }
    }

    switchCodeType(type) {
        this.currentCodeType = type;
        
        // Show/hide appropriate options with animation
        const qrOptions = document.getElementById('qrcode-options');
        const barcodeOptions = document.getElementById('barcode-options');
        
        if (qrOptions && barcodeOptions) {
            if (type === 'qrcode') {
                qrOptions.classList.add('active');
                barcodeOptions.classList.remove('active');
            } else {
                barcodeOptions.classList.add('active');
                qrOptions.classList.remove('active');
            }
        }
        
        // Show/hide appropriate display containers with animation
        const qrContainer = document.getElementById('qrcode-container');
        const barcodeContainer = document.getElementById('barcode-container');
        
        if (qrContainer && barcodeContainer) {
            if (type === 'qrcode') {
                qrContainer.classList.add('active');
                barcodeContainer.classList.remove('active');
            } else {
                barcodeContainer.classList.add('active');
                qrContainer.classList.remove('active');
            }
        }
        
        // Update export format options
        const exportFormat = document.getElementById('export-format');
        if (exportFormat) {
            if (type === 'barcode') {
                exportFormat.innerHTML = '<option value="png">PNG</option><option value="jpeg">JPEG</option><option value="svg">SVG</option>';
            } else {
                exportFormat.innerHTML = '<option value="png">PNG</option><option value="jpeg">JPEG</option>';
            }
        }
        
        // Generate code if there's input
        const inputText = document.getElementById('input-text');
        if (inputText && inputText.value.trim()) {
            this.generateCode(false);
        }
    }

    generateCode(addToHistory = true) {
        const inputText = document.getElementById('input-text').value.trim();
        
        if (!inputText) {
            this.showMessage('Please enter text or data to encode', 'error');
            return;
        }

        // Add loading animation
        this.addLoadingAnimation();

        // Generate code with slight delay for animation effect
        setTimeout(() => {
            if (this.currentCodeType === 'qrcode') {
                this.generateQRCode(inputText);
            } else {
                this.generateBarcode(inputText);
            }

            if (addToHistory) {
                this.addToHistory(inputText);
                this.totalCodesGenerated++;
                this.updateStatsCounter();
            }

            this.removeLoadingAnimation();
            this.addSuccessAnimation();
        }, 300);
    }

    addLoadingAnimation() {
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.classList.add('loading');
            generateBtn.disabled = true;
        }
    }

    removeLoadingAnimation() {
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
        }
    }

    addSuccessAnimation() {
        const codeFrame = document.querySelector('.code-frame');
        if (codeFrame) {
            codeFrame.classList.add('success');
            setTimeout(() => {
                codeFrame.classList.remove('success');
            }, 500);
        }
    }

    generateQRCode(text) {
        const container = document.getElementById('qrcode');
        if (!container) {
            console.error('QR Code container not found');
            this.showMessage('QR Code container not found', 'error');
            return;
        }
        
        container.innerHTML = ''; // Clear previous QR code

        // Check if QRCode library is loaded
        if (typeof QRCode === 'undefined') {
            this.showMessage('QR Code library not loaded. Please refresh the page.', 'error');
            return;
        }

        // Get QR options with proper error handling
        const sizeElement = document.getElementById('qr-size');
        const darkColorElement = document.getElementById('qr-dark-color');
        const lightColorElement = document.getElementById('qr-light-color');
        const errorCorrectionElement = document.getElementById('qr-error-correction');

        const options = {
            text: text,
            width: sizeElement ? parseInt(sizeElement.value) : 256,
            height: sizeElement ? parseInt(sizeElement.value) : 256,
            colorDark: darkColorElement ? darkColorElement.value : '#000000',
            colorLight: lightColorElement ? lightColorElement.value : '#ffffff',
            correctLevel: QRCode.CorrectLevel[errorCorrectionElement ? errorCorrectionElement.value : 'M']
        };

        console.log('Generating QR code with options:', options);

        try {
            this.qrcode = new QRCode(container, options);
            this.showMessage('QR Code generated successfully!', 'success');
        } catch (error) {
            console.error('QR Code generation error:', error);
            this.showMessage('Error generating QR code: ' + error.message, 'error');
        }
    }

    generateBarcode(text) {
        const container = document.getElementById('barcode');
        if (!container) {
            console.error('Barcode container not found');
            this.showMessage('Barcode container not found', 'error');
            return;
        }
        
        container.innerHTML = ''; // Clear previous barcode

        // Check if JsBarcode library is loaded
        if (typeof JsBarcode === 'undefined') {
            this.showMessage('Barcode library not loaded. Please refresh the page.', 'error');
            return;
        }

        // Get barcode options with proper error handling
        const formatElement = document.getElementById('barcode-format');
        const widthElement = document.getElementById('barcode-width');
        const heightElement = document.getElementById('barcode-height');
        const displayValueElement = document.getElementById('barcode-display-value');
        const fontColorElement = document.getElementById('barcode-font-color');
        const backgroundColorElement = document.getElementById('barcode-background-color');

        const format = formatElement ? formatElement.value : 'CODE128';
        
        // Validate and format input based on barcode type
        const validatedText = this.validateBarcodeInput(text, format);
        if (!validatedText) {
            return; // Error message already shown in validation
        }

        const options = {
            format: format,
            width: widthElement ? parseInt(widthElement.value) : 2,
            height: heightElement ? parseInt(heightElement.value) : 100,
            displayValue: displayValueElement ? displayValueElement.checked : true,
            fontSize: 16,
            lineColor: fontColorElement ? fontColorElement.value : '#000000',
            background: backgroundColorElement ? backgroundColorElement.value : '#ffffff',
            margin: 10
        };

        // Add format-specific options
        this.addFormatSpecificOptions(options, format);

        console.log('Generating barcode with options:', options);
        console.log('Validated text:', validatedText);

        try {
            JsBarcode(container, validatedText, options);
            this.showMessage(`${format} barcode generated successfully!`, 'success');
        } catch (error) {
            console.error('Barcode generation error:', error);
            this.showMessage(`Error generating ${format} barcode: ${error.message}`, 'error');
        }
    }

    validateBarcodeInput(text, format) {
        if (!text || text.trim() === '') {
            this.showMessage('Please enter text for barcode generation', 'error');
            return null;
        }

        const cleanText = text.trim().toUpperCase();

        switch (format) {
            case 'CODE128':
                // CODE128 accepts all ASCII characters, no validation needed
                return text;
            
            case 'CODE39':
                // CODE39 supports: A-Z, 0-9, space, and symbols: - . $ / + %
                const code39Pattern = /^[A-Z0-9\s\-\.\$\/\+\%]+$/;
                if (!code39Pattern.test(cleanText)) {
                    this.showMessage('CODE39 supports only: A-Z, 0-9, space, and symbols: - . $ / + %', 'error');
                    return null;
                }
                return cleanText;
            
            case 'EAN13':
                // EAN13 requires exactly 12 digits (checksum will be calculated)
                const ean13Pattern = /^\d{12}$/;
                if (!ean13Pattern.test(cleanText)) {
                    this.showMessage('EAN13 requires exactly 12 digits (checksum will be calculated automatically)', 'error');
                    return null;
                }
                return cleanText;
            
            case 'EAN8':
                // EAN8 requires exactly 7 digits (checksum will be calculated)
                const ean8Pattern = /^\d{7}$/;
                if (!ean8Pattern.test(cleanText)) {
                    this.showMessage('EAN8 requires exactly 7 digits (checksum will be calculated automatically)', 'error');
                    return null;
                }
                return cleanText;
            
            case 'UPC':
                // UPC requires exactly 11 digits (checksum will be calculated)
                const upcPattern = /^\d{11}$/;
                if (!upcPattern.test(cleanText)) {
                    this.showMessage('UPC requires exactly 11 digits (checksum will be calculated automatically)', 'error');
                    return null;
                }
                return cleanText;
            
            case 'ITF14':
                // ITF14 requires exactly 13 digits and must be even number of digits
                const itf14Pattern = /^\d{13}$/;
                if (!itf14Pattern.test(cleanText)) {
                    this.showMessage('ITF14 requires exactly 13 digits', 'error');
                    return null;
                }
                return cleanText;
            
            case 'MSI':
                // MSI supports only digits
                const msiPattern = /^\d+$/;
                if (!msiPattern.test(cleanText)) {
                    this.showMessage('MSI supports only numeric digits (0-9)', 'error');
                    return null;
                }
                return cleanText;
            
            case 'pharmacode':
                // Pharmacode supports numbers from 3 to 131070
                const num = parseInt(cleanText);
                if (isNaN(num) || num < 3 || num > 131070) {
                    this.showMessage('Pharmacode requires numbers between 3 and 131070', 'error');
                    return null;
                }
                return num.toString();
            
            default:
                return text;
        }
    }

    addFormatSpecificOptions(options, format) {
        switch (format) {
            case 'CODE39':
                options.mod43 = true; // Add Modulo 43 checksum
                break;
            
            case 'EAN13':
            case 'EAN8':
            case 'UPC':
                options.flat = true; // Remove guard bars for cleaner look
                options.ean13 = format === 'EAN13';
                options.ean8 = format === 'EAN8';
                options.upc = format === 'UPC';
                break;
            
            case 'ITF14':
                options.quietZone = 10; // Add quiet zone for ITF14
                options.quietZoneLeft = 10;
                options.quietZoneRight = 10;
                break;
            
            case 'MSI':
                options.mod11 = true; // Add Modulo 11 checksum
                options.mod10 = true; // Add Modulo 10 checksum
                break;
            
            case 'pharmacode':
                options.width = 0.4; // Thinner bars for pharmacode
                options.height = 20; // Standard pharmacode height
                break;
        }
    }

    updateFormatDescription(format) {
        const descriptionElement = document.getElementById('format-description');
        if (!descriptionElement) return;

        const descriptions = {
            'CODE128': 'CODE128: Supports all ASCII characters, most versatile format',
            'CODE39': 'CODE39: Supports A-Z, 0-9, and symbols -.$/+% (uppercase only)',
            'EAN13': 'EAN-13: 12 digits required for retail products (13th digit is checksum)',
            'EAN8': 'EAN-8: 7 digits required for small products (8th digit is checksum)',
            'UPC': 'UPC: 11 digits required for North American retail (12th digit is checksum)',
            'ITF14': 'ITF-14: 13 digits required for shipping cartons and logistics',
            'MSI': 'MSI: Numeric digits only, used in inventory and warehouse systems',
            'pharmacode': 'Pharmacode: Numbers 3-131070 for pharmaceutical packaging'
        };

        descriptionElement.textContent = descriptions[format] || descriptions['CODE128'];
    }

    downloadCode() {
        const format = document.getElementById('export-format').value;
        const quality = parseFloat(document.getElementById('export-quality').value);
        
        if (this.currentCodeType === 'qrcode') {
            this.downloadQRCode(format, quality);
        } else {
            this.downloadBarcode(format, quality);
        }
    }

    downloadQRCode(format, quality) {
        const canvas = document.querySelector('#qrcode canvas');
        if (!canvas) {
            this.showMessage('Please generate a QR code first', 'error');
            return;
        }

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        
        if (format === 'png') {
            link.download = `qrcode-${timestamp}.png`;
            link.href = canvas.toDataURL('image/png');
        } else if (format === 'jpeg') {
            link.download = `qrcode-${timestamp}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', quality);
        }
        
        link.click();
        this.showMessage('QR code downloaded successfully!', 'success');
    }

    downloadBarcode(format, quality) {
        const svg = document.querySelector('#barcode svg');
        if (!svg) {
            this.showMessage('Please generate a barcode first', 'error');
            return;
        }

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        
        if (format === 'svg') {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.download = `barcode-${timestamp}.svg`;
            link.href = url;
            link.click();
            
            URL.revokeObjectURL(url);
        } else {
            // Convert SVG to canvas for PNG/JPEG
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const link = document.createElement('a');
                const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                const extension = format === 'png' ? 'png' : 'jpg';
                
                link.download = `barcode-${timestamp}.${extension}`;
                link.href = canvas.toDataURL(mimeType, quality);
                link.click();
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
        
        this.showMessage('Barcode downloaded successfully!', 'success');
    }

    copyToClipboard() {
        const canvas = this.currentCodeType === 'qrcode' 
            ? document.querySelector('#qrcode canvas')
            : document.querySelector('#barcode svg');
            
        if (!canvas) {
            this.showMessage('Please generate a code first', 'error');
            return;
        }

        if (this.currentCodeType === 'qrcode') {
            canvas.toBlob((blob) => {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]).then(() => {
                    this.showMessage('QR code copied to clipboard!', 'success');
                }).catch(() => {
                    this.showMessage('Failed to copy to clipboard', 'error');
                });
            });
        } else {
            // For SVG, convert to canvas first
            const svgData = new XMLSerializer().serializeToString(canvas);
            const img = new Image();
            const tempCanvas = document.createElement('canvas');
            const ctx = tempCanvas.getContext('2d');
            
            img.onload = () => {
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                tempCanvas.toBlob((blob) => {
                    const item = new ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item]).then(() => {
                        this.showMessage('Barcode copied to clipboard!', 'success');
                    }).catch(() => {
                        this.showMessage('Failed to copy to clipboard', 'error');
                    });
                });
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    }

    addToHistory(text) {
        const historyItem = {
            type: this.currentCodeType,
            text: text,
            timestamp: new Date().toISOString(),
            imageData: this.getCodeImageData()
        };

        this.history.unshift(historyItem);
        
        if (this.history.length > this.maxHistoryItems) {
            this.history = this.history.slice(0, this.maxHistoryItems);
        }

        this.saveHistory();
        this.renderHistory();
    }

    getCodeImageData() {
        if (this.currentCodeType === 'qrcode') {
            const canvas = document.querySelector('#qrcode canvas');
            return canvas ? canvas.toDataURL('image/png') : null;
        } else {
            const svg = document.querySelector('#barcode svg');
            if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg);
                return 'data:image/svg+xml;base64,' + btoa(svgData);
            }
            return null;
        }
    }

    renderHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';

        this.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <img src="${item.imageData}" alt="${item.type}">
            `;
            
            historyItem.addEventListener('click', () => {
                this.loadFromHistory(index);
            });
            
            historyList.appendChild(historyItem);
        });
    }

    loadFromHistory(index) {
        const item = this.history[index];
        document.getElementById('input-text').value = item.text;
        
        // Switch to the correct code type
        const radio = document.querySelector(`input[name="codeType"][value="${item.type}"]`);
        if (radio) {
            radio.checked = true;
            this.switchCodeType(item.type);
        }
        
        this.generateCode(false);
        this.showMessage('Loaded from history', 'success');
    }

    saveHistory() {
        try {
            localStorage.setItem('qrcode-history', JSON.stringify(this.history));
        } catch (error) {
            console.warn('Failed to save history:', error);
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('qrcode-history');
            if (saved) {
                this.history = JSON.parse(saved);
                this.renderHistory();
            }
        } catch (error) {
            console.warn('Failed to load history:', error);
        }
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
        this.showMessage('History cleared', 'success');
    }

    clearInput() {
        const inputText = document.getElementById('input-text');
        if (inputText) {
            inputText.value = '';
            this.updateCharCounter();
        }
        
        const qrcode = document.getElementById('qrcode');
        if (qrcode) {
            qrcode.innerHTML = '';
        }
        
        const barcode = document.getElementById('barcode');
        if (barcode) {
            barcode.innerHTML = '';
        }
        
        this.showMessage('Input cleared', 'success');
    }

    useTemplate(templateType) {
        const templates = {
            url: 'https://example.com',
            wifi: 'WIFI:T:WPA;S:MyNetwork;P:password123;;',
            contact: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD',
            email: 'mailto:example@email.com?subject=Hello&body=Message',
            phone: 'tel:+1234567890',
            sms: 'sms:+1234567890?body=Hello there!'
        };

        const templateData = templates[templateType];
        if (templateData) {
            const inputText = document.getElementById('input-text');
            if (inputText) {
                inputText.value = templateData;
                this.updateCharCounter();
                this.generateCode(false);
                this.showMessage(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template applied!`, 'success');
                
                // Add animation to the template card
                const card = document.querySelector(`[data-type="${templateType}"]`);
                if (card) {
                    card.classList.add('success');
                    setTimeout(() => {
                        card.classList.remove('success');
                    }, 1000);
                }
            }
        }
    }

    openTemplatePreview(templateType) {
        const modal = document.getElementById('template-form-modal');
        const modalIcon = document.getElementById('modal-icon');
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');
        const formContent = document.getElementById('form-content');
        const progressSteps = document.getElementById('progress-steps');
        
        const templates = {
            url: {
                title: 'Website URL',
                subtitle: 'Create a QR code for any website',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
                fields: [
                    { 
                        name: 'url', 
                        label: 'Website URL', 
                        type: 'url', 
                        placeholder: 'https://example.com', 
                        required: true, 
                        description: 'Enter the full URL including https:// or http://',
                        validation: (value) => {
                            try {
                                new URL(value);
                                return null;
                            } catch {
                                return 'Please enter a valid URL';
                            }
                        }
                    }
                ]
            },
            wifi: {
                title: 'WiFi Network',
                subtitle: 'Share WiFi credentials securely',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
                fields: [
                    { 
                        name: 'ssid', 
                        label: 'Network Name (SSID)', 
                        type: 'text', 
                        placeholder: 'MyWiFiNetwork', 
                        required: true, 
                        description: 'The name of your WiFi network as it appears to devices',
                        validation: (value) => value.length < 1 ? 'Network name is required' : null
                    },
                    { 
                        name: 'password', 
                        label: 'Password', 
                        type: 'password', 
                        placeholder: 'Enter password', 
                        required: false, 
                        description: 'Leave empty for open networks. Minimum 8 characters recommended.',
                        validation: (value) => value.length > 0 && value.length < 8 ? 'Password should be at least 8 characters' : null
                    },
                    { 
                        name: 'security', 
                        label: 'Security Type', 
                        type: 'select', 
                        options: [
                            { value: 'WPA', label: 'WPA/WPA2 (Recommended)' },
                            { value: 'WEP', label: 'WEP (Less secure)' },
                            { value: 'nopass', label: 'Open Network (No password)' }
                        ], 
                        required: true, 
                        description: 'Choose the security type of your network',
                        validation: (value) => !value ? 'Security type is required' : null
                    }
                ]
            },
            contact: {
                title: 'Contact Card',
                subtitle: 'Create a digital business card',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
                fields: [
                    { 
                        name: 'name', 
                        label: 'Full Name', 
                        type: 'text', 
                        placeholder: 'John Doe', 
                        required: true, 
                        description: 'Contact person\'s full name',
                        validation: (value) => value.length < 2 ? 'Name must be at least 2 characters' : null
                    },
                    { 
                        name: 'phone', 
                        label: 'Phone Number', 
                        type: 'tel', 
                        placeholder: '+1234567890', 
                        required: false, 
                        description: 'Include country code for international numbers',
                        validation: (value) => value && !/^\+?[\d\s\-\(\)]+$/.test(value) ? 'Please enter a valid phone number' : null
                    },
                    { 
                        name: 'email', 
                        label: 'Email Address', 
                        type: 'email', 
                        placeholder: 'john@example.com', 
                        required: false, 
                        description: 'Professional email address',
                        validation: (value) => value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : null
                    },
                    { 
                        name: 'company', 
                        label: 'Company', 
                        type: 'text', 
                        placeholder: 'ACME Corp', 
                        required: false, 
                        description: 'Company or organization name',
                        validation: (value) => value && value.length < 2 ? 'Company name must be at least 2 characters' : null
                    }
                ]
            },
            email: {
                title: 'Email Message',
                subtitle: 'Create a pre-filled email QR code',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
                fields: [
                    { 
                        name: 'to', 
                        label: 'To Email', 
                        type: 'email', 
                        placeholder: 'recipient@example.com', 
                        required: true, 
                        description: 'Recipient email address',
                        validation: (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : null
                    },
                    { 
                        name: 'subject', 
                        label: 'Subject', 
                        type: 'text', 
                        placeholder: 'Hello World', 
                        required: true, 
                        description: 'Email subject line',
                        validation: (value) => value.length < 1 ? 'Subject is required' : null
                    },
                    { 
                        name: 'body', 
                        label: 'Message Body', 
                        type: 'textarea', 
                        placeholder: 'Your message here...', 
                        required: false, 
                        description: 'Email message content (optional)',
                        validation: (value) => value && value.length > 500 ? 'Message should be less than 500 characters' : null
                    }
                ]
            },
            phone: {
                title: 'Phone Call',
                subtitle: 'Create a clickable phone number QR code',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
                fields: [
                    { 
                        name: 'phone', 
                        label: 'Phone Number', 
                        type: 'tel', 
                        placeholder: '+1234567890', 
                        required: true, 
                        description: 'Include country code for international calls',
                        validation: (value) => {
                            if (!value) return 'Phone number is required';
                            if (!/^\+?[\d\s\-\(\)]+$/.test(value)) return 'Please enter a valid phone number';
                            if (!value.includes('+')) return 'Include country code (e.g., +1 for US)';
                            return null;
                        }
                    }
                ]
            },
            sms: {
                title: 'SMS Message',
                subtitle: 'Create a pre-filled SMS message QR code',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
                fields: [
                    { 
                        name: 'phone', 
                        label: 'Phone Number', 
                        type: 'tel', 
                        placeholder: '+1234567890', 
                        required: true, 
                        description: 'Recipient phone number with country code',
                        validation: (value) => {
                            if (!value) return 'Phone number is required';
                            if (!/^\+?[\d\s\-\(\)]+$/.test(value)) return 'Please enter a valid phone number';
                            if (!value.includes('+')) return 'Include country code (e.g., +1 for US)';
                            return null;
                        }
                    },
                    { 
                        name: 'message', 
                        label: 'Message', 
                        type: 'textarea', 
                        placeholder: 'Your SMS message here...', 
                        required: false, 
                        description: 'SMS message content (character limits apply)',
                        validation: (value) => value && value.length > 160 ? 'SMS messages should be less than 160 characters' : null
                    }
                ]
            }
        };

        const template = templates[templateType];
        if (!template) return;

        // Update modal content
        modalIcon.innerHTML = template.icon;
        modalTitle.textContent = template.title;
        modalSubtitle.textContent = template.subtitle;

        // Generate progress steps
        progressSteps.innerHTML = '';
        template.fields.forEach((field, index) => {
            const step = document.createElement('div');
            step.className = 'progress-step';
            step.innerHTML = `
                <div class="progress-step-number">${index + 1}</div>
                <div class="progress-step-label">${field.label}</div>
            `;
            progressSteps.appendChild(step);
        });

        // Generate form fields
        formContent.innerHTML = '';
        template.fields.forEach((field, index) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            formGroup.style.animationDelay = `${index * 0.1}s`;
            
            const label = document.createElement('label');
            label.className = 'form-label';
            if (field.required) label.classList.add('required');
            label.textContent = field.label;
            
            let input;
            if (field.type === 'select') {
                input = document.createElement('select');
                input.className = 'form-select';
                field.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value || option;
                    optionElement.textContent = option.label || option;
                    input.appendChild(optionElement);
                });
            } else if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.className = 'form-textarea';
                input.rows = 3;
            } else {
                input = document.createElement('input');
                input.className = 'form-input';
                input.type = field.type;
            }
            
            input.id = `form-${field.name}`;
            input.name = field.name;
            input.placeholder = field.placeholder;
            if (field.required) input.required = true;
            
            // Add validation
            input.addEventListener('blur', () => this.validateField(input, field));
            input.addEventListener('input', () => {
                input.classList.remove('error');
                this.updateValidationMessage();
                this.updateProgress();
            });
            
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            
            if (field.description) {
                const help = document.createElement('div');
                help.className = 'form-help';
                help.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <span>${field.description}</span>
                `;
                formGroup.appendChild(help);
            }
            
            formContent.appendChild(formGroup);
        });

        // Show modal with animation
        modal.classList.add('active');
        this.currentTemplateType = templateType;
        this.currentTemplateData = template;
        
        // Initialize progress
        this.updateProgress();
        
        // Focus first input
        const firstInput = formContent.querySelector('.form-input, .form-select, .form-textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }

    closeTemplatePreview() {
        const modal = document.getElementById('template-form-modal');
        if (modal) {
            modal.classList.remove('active');
            this.currentTemplateType = null;
            this.currentTemplateData = null;
        }
    }

    validateField(input, field) {
        const value = input.value.trim();
        let error = null;

        if (field.required && !value) {
            error = `${field.label} is required`;
        } else if (value && field.validation) {
            error = field.validation(value);
        }

        if (error) {
            input.classList.add('error');
            this.showValidationMessage(error, 'error');
            return false;
        } else {
            input.classList.remove('error');
            this.updateValidationMessage();
            return true;
        }
    }

    updateProgress() {
        if (!this.currentTemplateData) return;

        const totalFields = this.currentTemplateData.fields.length;
        const filledFields = this.currentTemplateData.fields.filter(field => {
            const input = document.getElementById(`form-${field.name}`);
            return input && input.value.trim() !== '';
        }).length;

        const progress = (filledFields / totalFields) * 100;
        const progressBar = document.getElementById('progress-bar-fill');
        const progressSteps = document.querySelectorAll('.progress-step');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        progressSteps.forEach((step, index) => {
            const field = this.currentTemplateData.fields[index];
            const input = document.getElementById(`form-${field.name}`);
            const isFilled = input && input.value.trim() !== '';
            
            step.classList.remove('active', 'completed');
            if (isFilled) {
                step.classList.add('completed');
            } else if (index === filledFields) {
                step.classList.add('active');
            }
        });
    }

    updateValidationMessage(message = null, type = 'info') {
        const validationMessage = document.getElementById('validation-message');
        if (!validationMessage) return;

        if (message) {
            validationMessage.querySelector('span').textContent = message;
            validationMessage.className = `validation-message show ${type}`;
        } else {
            validationMessage.classList.remove('show');
        }
    }

    showValidationMessage(message, type) {
        this.updateValidationMessage(message, type);
    }

    applyTemplateFromPreview() {
        if (!this.currentTemplateData) return;

        // Validate all fields first
        let isValid = true;
        const formData = {};

        for (const field of this.currentTemplateData.fields) {
            const input = document.getElementById(`form-${field.name}`);
            if (input) {
                const value = input.value.trim();
                
                if (field.required && !value) {
                    this.validateField(input, field);
                    isValid = false;
                } else if (value && field.validation) {
                    const error = field.validation(value);
                    if (error) {
                        input.classList.add('error');
                        this.showValidationMessage(error, 'error');
                        isValid = false;
                    } else {
                        formData[field.name] = value;
                    }
                } else if (value) {
                    formData[field.name] = value;
                }
            }
        }

        if (!isValid) {
            this.showValidationMessage('Please correct the errors before generating', 'error');
            return;
        }

        // Generate template data based on type
        let templateData = '';
        const templateType = this.currentTemplateType;

        switch (templateType) {
            case 'url':
                templateData = formData.url || '';
                break;
            case 'wifi':
                const ssid = formData.ssid || '';
                const password = formData.password || '';
                const security = formData.security || 'WPA';
                if (ssid) {
                    templateData = `WIFI:T:${security};S:${ssid};`;
                    if (password) templateData += `P:${password};`;
                    templateData += ';';
                }
                break;
            case 'contact':
                const name = formData.name || '';
                const phone = formData.phone || '';
                const email = formData.email || '';
                const company = formData.company || '';
                if (name) {
                    templateData = 'BEGIN:VCARD\nVERSION:3.0\nFN:' + name;
                    if (phone) templateData += '\nTEL:' + phone;
                    if (email) templateData += '\nEMAIL:' + email;
                    if (company) templateData += '\nORG:' + company;
                    templateData += '\nEND:VCARD';
                }
                break;
            case 'email':
                const to = formData.to || '';
                const subject = formData.subject || '';
                const body = formData.body || '';
                if (to) {
                    templateData = 'mailto:' + to;
                    if (subject) templateData += '?subject=' + encodeURIComponent(subject);
                    if (body) templateData += '&body=' + encodeURIComponent(body);
                }
                break;
            case 'phone':
                const phoneNumber = formData.phone || '';
                if (phoneNumber) templateData = 'tel:' + phoneNumber;
                break;
            case 'sms':
                const smsPhone = formData.phone || '';
                const message = formData.message || '';
                if (smsPhone) {
                    templateData = 'sms:' + smsPhone;
                    if (message) templateData += '?body=' + encodeURIComponent(message);
                }
                break;
        }

        if (templateData) {
            const inputText = document.getElementById('input-text');
            if (inputText) {
                inputText.value = templateData;
                this.updateCharCounter();
                this.generateCode(false);
                this.showMessage('Template applied successfully!', 'success');
                this.closeTemplatePreview();
                
                // Add success animation to the template card
                const card = document.querySelector(`[data-type="${templateType}"]`);
                if (card) {
                    card.classList.add('success');
                    setTimeout(() => {
                        card.classList.remove('success');
                    }, 1000);
                }
            }
        } else {
            this.showValidationMessage('Unable to generate template data', 'error');
        }
    }

    toggleTemplates() {
        const templateGrid = document.getElementById('template-grid');
        const expandBtn = document.getElementById('expand-templates');
        
        if (templateGrid) {
            templateGrid.classList.toggle('expanded');
            
            if (expandBtn) {
                const svg = expandBtn.querySelector('svg');
                if (svg) {
                    if (templateGrid.classList.contains('expanded')) {
                        svg.style.transform = 'rotate(180deg)';
                    } else {
                        svg.style.transform = 'rotate(0deg)';
                    }
                }
            }
        }
    }

    openTemplateModal(templateType) {
        // Legacy modal method - redirect to preview
        this.openTemplatePreview(templateType);
    }

    closeModal() {
        document.getElementById('template-modal').style.display = 'none';
    }

    generateFromTemplate() {
        const modalForm = document.getElementById('modal-form');
        const templateType = modalForm.dataset.templateType;
        
        let encodedText = '';

        switch (templateType) {
            case 'url':
                encodedText = document.getElementById('url').value;
                break;
            case 'wifi':
                const ssid = document.getElementById('ssid').value;
                const password = document.getElementById('password').value;
                const security = document.getElementById('security').value;
                encodedText = `WIFI:T:${security};S:${ssid};P:${password};;`;
                break;
            case 'contact':
                const name = document.getElementById('name').value;
                const phone = document.getElementById('phone').value;
                const email = document.getElementById('email').value;
                const company = document.getElementById('company').value;
                encodedText = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${company}\nEND:VCARD`;
                break;
            case 'email':
                const emailAddress = document.getElementById('email').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                encodedText = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
                break;
            case 'phone':
                encodedText = `tel:${document.getElementById('phone').value}`;
                break;
            case 'sms':
                const smsPhone = document.getElementById('phone').value;
                const smsMessage = document.getElementById('message').value;
                encodedText = `sms:${smsPhone}?body=${encodeURIComponent(smsMessage)}`;
                break;
        }

        if (encodedText) {
            document.getElementById('input-text').value = encodedText;
            this.generateCode();
            this.closeModal();
        }
    }

    generateInitialCode() {
        // Generate an initial QR code for demonstration
        document.getElementById('input-text').value = 'https://example.com';
        this.generateCode(false);
    }

    showMessage(message, type) {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Remove any existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        });
        
        // Create new toast notification
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Add to DOM
        document.body.appendChild(toast);
        
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
});
