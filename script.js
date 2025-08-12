         class FilePreviewApp {
            constructor() {
                this.history = JSON.parse(localStorage.getItem('filePreviewHistory')) || [];
                this.currentFile = null;
                this.isDarkMode = localStorage.getItem('darkMode') === 'true';
                
                this.initializeElements();
                this.attachEventListeners();
                this.applyTheme();
                this.renderHistory();
            }

            initializeElements() {
                this.fileInput = document.getElementById('fileInput');
                this.uploadArea = document.getElementById('uploadArea');
                this.fileContent = document.getElementById('fileContent');
                this.fileStats = document.getElementById('fileStats');
                this.copyBtn = document.getElementById('copyBtn');
                this.historyPanel = document.getElementById('historyPanel');
                this.historyContent = document.getElementById('historyContent');
                this.themeToggle = document.getElementById('themeToggle');
                this.menuToggle = document.getElementById('menuToggle');
                this.dropdownMenu = document.getElementById('dropdownMenu');
            }

            attachEventListeners() {
                // File input
                this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
                
                // Drag and drop
                this.uploadArea.addEventListener('click', () => this.fileInput.click());
                this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
                this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
                this.uploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));
                
                // Copy button
                this.copyBtn.addEventListener('click', () => this.copyCode());
                
                // Theme toggle
                this.themeToggle.addEventListener('click', () => this.toggleTheme());
                
                // History toggle
                document.getElementById('historyToggle').addEventListener('click', () => this.toggleHistory());
                document.getElementById('closeHistory').addEventListener('click', () => this.closeHistory());
                
                // Dropdown menu
                this.menuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.dropdownMenu.parentElement.classList.toggle('active');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', () => {
                    this.dropdownMenu.parentElement.classList.remove('active');
                });
                
                // Dropdown items
                document.getElementById('copyCodeBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.copyCode();
                    this.dropdownMenu.parentElement.classList.remove('active');
                });
                document.getElementById('showHistoryBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleHistory();
                    this.dropdownMenu.parentElement.classList.remove('active');
                });
                document.getElementById('toggleThemeBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleTheme();
                    this.dropdownMenu.parentElement.classList.remove('active');
                });
            }

            handleDragOver(e) {
                e.preventDefault();
                this.uploadArea.classList.add('drag-over');
            }

            handleDragLeave(e) {
                e.preventDefault();
                this.uploadArea.classList.remove('drag-over');
            }

            handleFileDrop(e) {
                e.preventDefault();
                this.uploadArea.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.previewFile(files[0]);
                }
            }

            handleFileSelect(e) {
                const file = e.target.files[0];
                if (file) {
                    this.previewFile(file);
                }
            }

            previewFile(file) {
                this.currentFile = file;
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    const content = e.target.result;
                    const fileType = this.getFileType(file.name);
                    const stats = this.getFileStats(file);
                    
                    // Calculate content stats
                    stats.lines = content.split('\n').length;
                    stats.characters = content.length.toLocaleString();
                    stats.lastOpened = new Date().toLocaleString();
                    
                    this.displayFileContent(content, fileType);
                    this.renderFileStats(stats);
                    this.addToHistory(file.name, fileType, content, stats);
                    this.copyBtn.style.display = 'flex';
                };
                
                reader.readAsText(file);
            }

            getFileType(fileName) {
                const extension = fileName.split('.').pop().toLowerCase();
                const types = {
                    'js': 'JavaScript',
                    'html': 'HTML',
                    'htm': 'HTML',
                    'css': 'CSS',
                    'json': 'JSON',
                    'xml': 'XML',
                    'txt': 'TEXT',
                    'md': 'Markdown',
                    'py': 'Python',
                    'php': 'PHP',
                    'yml': 'YAML',
                    'toml': 'TOML',
                    'pdf': 'PDF',
                    'tsx': 'TypeScript',
                    'jsx': 'React',
                    'map': 'MAP',
                    'svg': 'SVG+XML',
                    'ts': 'TypeScript',
                    'c': 'C',
                    'cpp': 'C++',
                    'h': 'C#',
                    'vue': 'Vue.JS',
                    'java': 'Java',
                    'png': 'PNG',
                    'zip': 'ZIP',
                    '7z': '7-Zip'
                };
                return types[extension] || 'Text';
            }

            getFileStats(file) {
                return {
                    name: file.name,
                    size: this.formatFileSize(file.size),
                    type: this.getFileType(file.name),
                    lastModified: new Date(file.lastModified).toLocaleString(),
                    lastOpened: new Date().toLocaleString(),
                    lines: 0,
                    characters: '0'
                };
            }

            displayFileStats(stats) {
                // Calculate lines and characters from current file if available
                if (this.currentFile && stats.name === this.currentFile.name) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const content = e.target.result;
                        const lines = content.split('\n').length;
                        const characters = content.length;
                        stats.lines = lines;
                        stats.characters = characters.toLocaleString();
                        this.renderFileStats(stats);
                    };
                    reader.readAsText(this.currentFile);
                } else {
                    this.renderFileStats(stats);
                }
            }

            renderFileStats(stats) {

                this.fileStats.innerHTML = `
                    <div class="stat-item animate-slide-right">
                        <div class="stat-label">File Name</div>
                        <div class="stat-value">${stats.name}</div>
                    </div>
                    <div class="stat-item animate-slide-right" style="animation-delay: 0.1s;">
                        <div class="stat-label">File Size</div>
                        <div class="stat-value">${stats.size}</div>
                    </div>
                    <div class="stat-item animate-slide-right" style="animation-delay: 0.2s;">
                        <div class="stat-label">File Type</div>
                        <div class="stat-value">${stats.type}</div>
                    </div>
                    <div class="stat-item animate-slide-right" style="animation-delay: 0.3s;">
                        <div class="stat-label">Last Opened</div>
                        <div class="stat-value">${stats.lastOpened}</div>
                    </div>
                    <div class="stat-item animate-slide-right" style="animation-delay: 0.4s;">
                        <div class="stat-label">Lines</div>
                        <div class="stat-value">${stats.lines}</div>
                    </div>
                    <div class="stat-item animate-slide-right" style="animation-delay: 0.5s;">
                        <div class="stat-label">Characters</div>
                        <div class="stat-value">${stats.characters}</div>
                    </div>
                `;
                this.fileStats.style.display = 'grid';
            }

            displayFileContent(content, fileType) {
                let highlightedContent = this.highlightSyntax(content, fileType);
                this.fileContent.innerHTML = `<pre>${highlightedContent}</pre>`;
            }

            highlightSyntax(content, fileType) {
                // Escape HTML first
                content = content
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');

                switch(fileType) {
                    case 'HTML':
                        return this.highlightHTML(content);
                    case 'JavaScript':
                        return this.highlightJS(content);
                    case 'CSS':
                        return this.highlightCSS(content);
                    default:
                        return content;
                }
            }

            highlightHTML(content) {
                // First highlight comments
                content = content.replace(/&lt;!--[\s\S]*?--&gt;/g, '<span class="syntax-html-comment">$&</span>');
                
                // Highlight attribute values
                content = content.replace(/=("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '=<span class="syntax-html-value">$1</span>');
                
                // Highlight attributes
                content = content.replace(/\s([a-zA-Z\-]+)(?==)/g, ' <span class="syntax-html-attr">$1</span>');
                
                // Highlight tag names
                content = content.replace(/&lt;\/?([a-zA-Z][a-zA-Z0-9]*)/g, '&lt;<span class="syntax-html-tag">$1</span>');
                
                return content;
            }

            highlightJS(content) {
                const keywords = ['function', 'if', 'else', 'for', 'while', 'do', 'switch', 
                                'case', 'break', 'continue', 'return', 'var', 'let', 'const', 
                                'new', 'delete', 'typeof', 'instanceof', 'true', 'false', 
                                'null', 'undefined', 'try', 'catch', 'finally', 'throw', 'class', 'extends'];

                // First highlight comments (to avoid conflicts)
                content = content.replace(/\/\/.*?$/gm, '<span class="syntax-js-comment">$&</span>');
                content = content.replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-js-comment">$&</span>');

                // Highlight strings (including template literals)
                content = content.replace(/`(?:[^`\\]|\\.)*`/g, '<span class="syntax-js-string">$&</span>');
                content = content.replace(/"(?:[^"\\]|\\.)*"/g, '<span class="syntax-js-string">$&</span>');
                content = content.replace(/'(?:[^'\\]|\\.)*'/g, '<span class="syntax-js-string">$&</span>');

                // Highlight numbers
                content = content.replace(/\b(\d+\.?\d*)\b/g, '<span class="syntax-js-number">$1</span>');

                // Highlight keywords (avoid replacing inside strings/comments)
                keywords.forEach(keyword => {
                    const regex = new RegExp(`\\b(${keyword})\\b(?![^<]*>)(?![^<]*<\/span>)`, 'g');
                    content = content.replace(regex, '<span class="syntax-js-keyword">$1</span>');
                });

                return content;
            }

            highlightCSS(content) {
                // First highlight comments
                content = content.replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-js-comment">$&</span>');
                
                // Highlight property values
                content = content.replace(/:\s*([^;}]+)/g, ': <span class="syntax-css-value">$1</span>');
                
                // Highlight properties
                content = content.replace(/([a-z\-]+)\s*:/g, '<span class="syntax-css-property">$1</span>:');
                
                // Highlight selectors (basic approach)
                content = content.replace(/^([^{]*){/gm, '<span class="syntax-css-selector">$1</span>{');
                
                return content;
            }

            formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }

            addToHistory(fileName, fileType, content, stats) {
                // Remove existing entry if it exists
                const existingIndex = this.history.findIndex(item => item.name === fileName);
                if (existingIndex !== -1) {
                    this.history.splice(existingIndex, 1);
                }

                // Add new entry at the beginning
                this.history.unshift({
                    name: fileName,
                    type: fileType,
                    content: content,
                    stats: stats,
                    timestamp: Date.now()
                });

                // Keep only the last 20 items
                if (this.history.length > 50) {
                    this.history = this.history.slice(0, 50);
                }

                // Save to localStorage
                localStorage.setItem('filePreviewHistory', JSON.stringify(this.history));
                this.renderHistory();
            }

            renderHistory() {
                if (this.history.length === 0) {
                    this.historyContent.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <h4>No history yet</h4>
                            <p>Files you preview will appear here</p>
                        </div>
                    `;
                    return;
                }

                const historyHTML = this.history.map((item, index) => `
                    <div class="history-item animate-slide-right" style="animation-delay: ${index * 0.1}s;" onclick="app.loadFromHistory('${item.name}')">
                        <div class="file-icon">${this.getFileIcon(item.type)}</div>
                        <div class="history-item-info">
                            <div class="history-item-name">${item.name}</div>
                            <div class="history-item-time">${this.formatTimeAgo(item.timestamp)}</div>
                        </div>
                    </div>
                `).join('');

                this.historyContent.innerHTML = historyHTML;
            }

            loadFromHistory(fileName) {
                const item = this.history.find(h => h.name === fileName);
                if (!item) return;

                // Update last opened time
                item.stats.lastOpened = new Date().toLocaleString();
                
                this.renderFileStats(item.stats);
                this.displayFileContent(item.content, item.type);
                this.copyBtn.style.display = 'flex';
                this.closeHistory();
                
                // Update history with new timestamp
                const historyIndex = this.history.findIndex(h => h.name === fileName);
                if (historyIndex !== -1) {
                    this.history[historyIndex].timestamp = Date.now();
                    localStorage.setItem('filePreviewHistory', JSON.stringify(this.history));
                    this.renderHistory();
                }
            }

            getFileIcon(fileType) {
                const icons = {
                    'SVG+XML': '<img src="SVG_logo.svg" alt="svg">',
                    'JavaScript': '<i class="fab fa-js-square" style="color: #f7df1e;"></i>',
                    'HTML': '<i class="fab fa-html5" style="color: #e34c26;"></i>',
                    'CSS': '<i class="fab fa-css3-alt" style="color: #1572b6;"></i>',
                    'JSON': '<i class="fas fa-code" style="color: #6c757d;"></i>',
                    'Python': '<i class="fab fa-python" style="color: #3776ab;"></i>',
                    'PHP': '<i class="fab fa-php" style="color: #777bb4;"></i>',
                    'Markdown': '<i class="fab fa-markdown" style="color: #000;"></i>',
                    'XML': '<i class="fas fa-file-code" style="color: #ff6600;"></i>',
                    'Text': '<i class="far fa-file-alt" style="color:#6c757d;"></i>',
                    'TypeScript': '<img src="TS.webp" width="30" height="30">',
                    'PDF': '<img src="PDF.webp" width="30" height="30">',
                    'YAML': '<img src="Yaml.webp" width="30" height="30">',
                    'Vue.JS': '<img src="Vue.js.webp" width="30" height="30">',
                    'PNG': '<img src="PNG.webp" width="30" height="30">',
                    '7-Zip': '<img src="7-Zip.webp" width="30" height="30">',
                    'ZIP': '<img src="Zip.webp" width="30" height="30">'
                };
                return icons[fileType] || '<i class="far fa-file-alt" style="color: #6c757d;"></i>';
            }

            formatTimeAgo(timestamp) {
                const now = Date.now();
                const diff = now - timestamp;
                
                const minutes = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                
                if (minutes < 1) return 'Just now';
                if (minutes < 60) return `${minutes}m ago`;
                if (hours < 24) return `${hours}h ago`;
                return `${days}d ago`;
            }

            copyCode() {
                const preElement = this.fileContent.querySelector('pre');
                if (!preElement) {
                    // Show error notification if no content
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed;
                        top: 80px;
                        right: 20px;
                        background: #ff4757;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        z-index: 1000;
                        animation: slideInRight 0.3s ease;
                    `;
                    notification.innerHTML = '<i class="fas fa-exclamation-circle"></i> No content to copy';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 3000);
                    return;
                }

                const textToCopy = preElement.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalHTML = this.copyBtn.innerHTML;
                    this.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    this.copyBtn.classList.add('copied');
                    
                    // Success notification
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed;
                        top: 80px;
                        right: 20px;
                        background: #2ed573;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        z-index: 1000;
                        animation: slideInRight 0.3s ease;
                        box-shadow: var(--shadow-medium);
                    `;
                    notification.innerHTML = '<i class="fas fa-check-circle"></i> Code copied to clipboard!';
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        this.copyBtn.innerHTML = originalHTML;
                        this.copyBtn.classList.remove('copied');
                        notification.remove();
                    }, 2000);
                }).catch(() => {
                    // Error notification
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed;
                        top: 80px;
                        right: 20px;
                        background: #ff4757;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        z-index: 1000;
                        animation: slideInRight 0.3s ease;
                    `;
                    notification.innerHTML = '<i class="fas fa-times-circle"></i> Failed to copy';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 3000);
                });
            }

            toggleTheme() {
                this.isDarkMode = !this.isDarkMode;
                localStorage.setItem('darkMode', this.isDarkMode);
                this.applyTheme();
            }

            applyTheme() {
                if (this.isDarkMode) {
                    document.body.setAttribute('data-theme', 'dark');
                    this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                    this.themeToggle.setAttribute('title', 'Switch to Light Mode');
                } else {
                    document.body.removeAttribute('data-theme');
                    this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                    this.themeToggle.setAttribute('title', 'Switch to Dark Mode');
                }
            }

            toggleHistory() {
                this.historyPanel.classList.toggle('open');
            }

            closeHistory() {
                this.historyPanel.classList.remove('open');
            }
        }

        // Initialize the app
        const app = new FilePreviewApp();

        // Add some extra animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.upload-section, .preview-section').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });

        // Add ripple effect to buttons
        document.querySelectorAll('button, .dropdown-item').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation CSS
        const rippleCSS = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        const style = document.createElement('style');
        style.textContent = rippleCSS;
        document.head.appendChild(style);