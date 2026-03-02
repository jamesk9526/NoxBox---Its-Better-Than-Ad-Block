export class OnboardingFlow {
  private element!: HTMLElement;
  private currentStep = 0;
  private totalSteps = 4;

  constructor() {
    this.createOnboardingElements();
    this.setupEventListeners();
  }

  private createOnboardingElements(): void {
    // Create main onboarding container
    const onboarding = document.createElement('div');
    onboarding.id = 'onboarding-flow';
    onboarding.className = 'onboarding-flow';
    
    onboarding.innerHTML = `
      <div class="onboarding-backdrop">
        <div class="backdrop-gradient"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
        </div>
      </div>
      <div class="onboarding-container">
        <div class="onboarding-scrollable">
        
        <!-- Step 1: Welcome -->
        <div class="onboarding-step" data-step="0">
          <div class="step-animation-wrapper">
            <div class="onboarding-header">
              <div class="header-icon-container">
                <div class="header-icon floating">🦊</div>
              </div>
              <h2 class="zoom-in">Welcome to NoxBox</h2>
              <p class="onboarding-subtitle fade-in">Your privacy-focused browsing companion</p>
              <div class="inspirational-saying">
                <p class="saying-text">"Take control of your digital world – browse with intention, not distraction."</p>
              </div>
            </div>
            <div class="onboarding-content">
              <div class="feature-grid">
                <div class="feature-card card-1">
                  <div class="card-glow"></div>
                  <div class="feature-icon">👁️</div>
                  <h3>Smart Media Blur</h3>
                  <p>Automatically blur images and videos for distraction-free browsing</p>
                  <div class="card-highlight"></div>
                </div>
                <div class="feature-card card-2">
                  <div class="card-glow"></div>
                  <div class="feature-icon">🎯</div>
                  <h3>Selective Control</h3>
                  <p>Click to reveal only the content you want to see</p>
                  <div class="card-highlight"></div>
                </div>
                <div class="feature-card card-3">
                  <div class="card-glow"></div>
                  <div class="feature-icon">🛡️</div>
                  <h3>Privacy First</h3>
                  <p>Browse without distractions or unwanted content</p>
                  <div class="card-highlight"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: How It Works -->
        <div class="onboarding-step" data-step="1">
          <div class="step-animation-wrapper">
            <div class="onboarding-header">
              <div class="header-icon-container">
                <div class="header-icon floating">🔧</div>
              </div>
              <h2 class="slide-in-left">How NoxBox Works</h2>
              <p class="onboarding-subtitle slide-in-right">Understanding the blur system By default. All images and videos are automatically blurred.</p>
            </div>
            <div class="onboarding-content">
              <div class="demo-browser morphing-demo">
                <div class="demo-bar">
                  <div class="demo-controls">
                    <span class="demo-dot red pulsing"></span>
                    <span class="demo-dot yellow pulsing delay-1"></span>
                    <span class="demo-dot green pulsing delay-2"></span>
                  </div>
                  <div class="demo-address typing-address">
                    <span class="typing-text">noxbox-demo.com</span>
                    <span class="cursor">|</span>
                  </div>
                </div>
                <div class="demo-content scrolling-content">
                  <div class="demo-text loading-text">Website Content</div>
                  <div class="demo-image blurred morphing-blur">
                    <div class="blur-overlay"></div>
                    <span class="blur-label floating-label">🔒 Blurred Image</span>
                    <div class="blur-particles">
                      <div class="particle"></div>
                      <div class="particle"></div>
                      <div class="particle"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="explanation fade-in-up">
                <div class="explanation-highlight">
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Unblur Mode -->
        <div class="onboarding-step" data-step="2">
          <div class="step-animation-wrapper">
            <div class="onboarding-header">
              <div class="header-icon-container">
                <div class="header-icon rotating-eye">👁️</div>
              </div>
              <h2 class="zoom-in">Selective Unblur</h2>
              <p class="onboarding-subtitle fade-in">Control what you see</p>
            </div>
            <div class="onboarding-content">
              <div class="demo-sequence animated-sequence">
                <div class="demo-step step-1">
                  <div class="step-content">
                    <div class="demo-button interactive-button">
                      <span class="button-icon">👁️</span>
                      <div class="button-ripple"></div>
                      <div class="button-glow"></div>
                    </div>
                    <p class="step-text">Click the eye button to enter <strong>Unblur Mode</strong></p>
                  </div>
                </div>
                <div class="demo-arrow animated-arrow">
                  <div class="arrow-line"></div>
                  <div class="arrow-head">→</div>
                </div>
                <div class="demo-step step-2">
                  <div class="step-content">
                    <div class="demo-image-small clickable interactive-media">
                      <div class="media-blur-effect"></div>
                      <span class="click-indicator bouncing">Click!</span>
                    </div>
                    <p class="step-text">Click blurred media to reveal it ✨</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Get Started -->
        <div class="onboarding-step" data-step="3">
          <div class="step-animation-wrapper">
            <div class="onboarding-header">
              <div class="header-icon-container">
                <div class="header-icon launching-rocket">🚀</div>
              </div>
              <h2 class="scale-in">Ready to Browse!</h2>
              <p class="onboarding-subtitle wave-text">You're all set to enjoy distraction-free browsing</p>
            </div>
            <div class="onboarding-content">
              <div class="ready-content">
                <div class="ready-features staggered-animation">
                  <div class="ready-item floating-card item-1">
                    <div class="card-background"></div>
                    <div class="ready-icon rotating-gear">⚙️</div>
                    <div class="item-content">
                      <h4>Customize Settings</h4>
                      <p>Adjust blur intensity, themes, and more in Settings</p>
                    </div>
                    <div class="item-glow"></div>
                  </div>
                  <div class="ready-item floating-card item-2">
                    <div class="card-background"></div>
                    <div class="ready-icon pulsing-search">🔍</div>
                    <div class="item-content">
                      <h4>Start Browsing</h4>
                      <p>Use the address bar to navigate to any website</p>
                    </div>
                    <div class="item-glow"></div>
                  </div>
                  <div class="ready-item floating-card item-3">
                    <div class="card-background"></div>
                    <div class="ready-icon glowing-bulb">💡</div>
                    <div class="item-content">
                      <h4>Pro Tip</h4>
                      <p>Hover over blurred content for a quick preview</p>
                    </div>
                    <div class="item-glow"></div>
                  </div>
                </div>
                <div class="celebration-animation">
                  <div class="confetti-piece"></div>
                  <div class="confetti-piece"></div>
                  <div class="confetti-piece"></div>
                  <div class="confetti-piece"></div>
                  <div class="confetti-piece"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div> <!-- Close onboarding-scrollable -->

        <!-- Navigation -->
        <div class="onboarding-navigation glass-morphism">
          <div class="onboarding-progress">
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill animated-progress"></div>
                <div class="progress-glow"></div>
              </div>
              <div class="progress-dots">
                <div class="progress-dot active" data-step="0"></div>
                <div class="progress-dot" data-step="1"></div>
                <div class="progress-dot" data-step="2"></div>
                <div class="progress-dot" data-step="3"></div>
              </div>
            </div>
            <span class="progress-text">Step <span id="current-step">1</span> of ${this.totalSteps}</span>
          </div>
          <div class="onboarding-buttons">
            <button id="onboarding-skip" class="onboarding-btn secondary glass-btn">Skip</button>
            <button id="onboarding-back" class="onboarding-btn secondary glass-btn" style="display: none;">Back</button>
            <button id="onboarding-next" class="onboarding-btn primary gradient-btn">
              <span class="btn-text">Next</span>
              <div class="btn-glow"></div>
            </button>
            <button id="onboarding-finish" class="onboarding-btn primary gradient-btn celebration-btn" style="display: none;">
              <span class="btn-text">Get Started!</span>
              <div class="btn-glow"></div>
              <div class="btn-sparkles">
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;

    // Add onboarding styles
    const styles = document.createElement('style');
    styles.id = 'onboarding-styles';
    styles.textContent = this.getOnboardingStyles();
    
    document.head.appendChild(styles);
    document.body.appendChild(onboarding);
    this.element = onboarding;
  }

  private getOnboardingStyles(): string {
    return `
      .onboarding-flow {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        animation: fadeIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        overflow: hidden;
      }

      .onboarding-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
        background-size: 400% 400%;
        animation: gradientShift 8s ease infinite;
      }

      .backdrop-gradient {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(120, 219, 226, 0.3) 0%, transparent 50%);
        animation: float 6s ease-in-out infinite;
      }

      .floating-shapes {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
      }

      .shape {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        animation: floatShapes 15s infinite linear;
      }

      .shape-1 {
        width: 80px;
        height: 80px;
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }

      .shape-2 {
        width: 120px;
        height: 120px;
        top: 50%;
        right: 15%;
        animation-delay: -3s;
      }

      .shape-3 {
        width: 60px;
        height: 60px;
        bottom: 30%;
        left: 20%;
        animation-delay: -6s;
      }

      .shape-4 {
        width: 100px;
        height: 100px;
        top: 80%;
        right: 30%;
        animation-delay: -9s;
      }

      .shape-5 {
        width: 40px;
        height: 40px;
        top: 10%;
        right: 40%;
        animation-delay: -12s;
      }

      .onboarding-container {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(40px) saturate(1.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 28px;
        box-shadow: 
          0 32px 64px rgba(0, 0, 0, 0.15),
          0 8px 32px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.7);
        max-width: 900px;
        width: 95%;
        max-height: 90vh;
        min-height: 500px;
        height: auto;
        display: flex;
        flex-direction: column;
        position: relative;
        animation: slideUpApple 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
        transform-origin: center bottom;
        will-change: transform, opacity;
      }

      .onboarding-step {
        display: none;
        padding: 0;
        text-align: center;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .onboarding-step.active {
        display: flex;
        flex-direction: column;
        animation: floatUp 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .onboarding-step-content {
        padding: 40px;
        flex: 1;
        overflow-y: auto;
        min-height: 0;
        max-height: calc(90vh - 280px);
      }

      .onboarding-step-content::-webkit-scrollbar {
        width: 8px;
      }

      .onboarding-step-content::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      .onboarding-step-content::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 4px;
      }

      .onboarding-step-content::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      }

      .onboarding-header {
        padding: 32px 40px 24px;
        text-align: center;
        background: linear-gradient(135deg, 
          rgba(255, 255, 255, 0.9) 0%, 
          rgba(255, 255, 255, 0.7) 100%);
        backdrop-filter: blur(20px) saturate(1.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        flex-shrink: 0;
        overflow: hidden;
      }

      .onboarding-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(102, 126, 234, 0.3), 
          rgba(118, 75, 162, 0.3), 
          transparent);
      }

      .header-icon-container {
        margin-bottom: 16px;
        animation: floatUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .header-icon {
        font-size: 3.5em;
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.3));
        animation: softGlow 3s ease-in-out infinite;
      }

      .onboarding-header h1 {
        font-size: 2.8em;
        margin: 16px 0 8px 0;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
        letter-spacing: -0.02em;
        animation: floatUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
      }

      .onboarding-header h2 {
        font-size: 2.4em;
        margin: 0 0 8px 0;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 600;
        letter-spacing: -0.01em;
        animation: floatUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
      }

      .onboarding-subtitle {
        font-size: 1.3em;
        color: #666;
        margin-bottom: 0;
        font-weight: 400;
        opacity: 0.8;
        animation: floatUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
      }

      .inspirational-saying {
        margin-top: 20px;
        padding: 16px 24px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border-radius: 12px;
        border: 1px solid rgba(102, 126, 234, 0.2);
        animation: floatUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
      }

      .saying-text {
        font-size: 1.1em;
        color: #4a5568;
        font-style: italic;
        font-weight: 500;
        margin: 0;
        text-align: center;
        line-height: 1.5;
        position: relative;
      }

      .saying-text::before {
        content: '"';
        position: absolute;
        left: -12px;
        top: -8px;
        font-size: 2em;
        color: rgba(102, 126, 234, 0.3);
        font-family: serif;
      }

      .saying-text::after {
        content: '"';
        position: absolute;
        right: -12px;
        bottom: -16px;
        font-size: 2em;
        color: rgba(102, 126, 234, 0.3);
        font-family: serif;
      }

      .logo-icon {
        font-size: 4em;
        margin-bottom: 16px;
        animation: bounce 2s infinite;
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;
        margin-top: 40px;
      }

      .feature-card {
        background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
        padding: 24px;
        border-radius: 16px;
        border: 1px solid #e1e8ff;
      }

      .feature-icon {
        font-size: 2.5em;
        margin-bottom: 16px;
      }

      .feature-card h3 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 1.1em;
        font-weight: 600;
      }

      .feature-card p {
        margin: 0;
        color: #666;
        line-height: 1.5;
      }

      .demo-browser {
        background: #f5f5f5;
        border-radius: 12px;
        overflow: hidden;
        margin: 0 auto 24px;
        max-width: 500px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }

      .demo-bar {
        background: #ddd;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .demo-controls {
        display: flex;
        gap: 10px;
      }

      .demo-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      .demo-dot.red { background: #ff5f57; }
      .demo-dot.yellow { background: #ffbd2e; }
      .demo-dot.green { background: #28ca42; }

      .demo-address {
        background: white;
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 0.9em;
        color: #666;
        flex: 1;
      }

      .demo-content {
        padding: 24px;
        background: white;
      }

      .demo-text {
        height: 16px;
        background: #eee;
        border-radius: 4px;
        margin: 8px 0;
      }

      .demo-image, .demo-video {
        height: 120px;
        background: #f0f0f0;
        border-radius: 8px;
        margin: 16px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .demo-image.blurred, .demo-video.blurred {
        filter: blur(10px);
      }

      .blur-label {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 10px;
        font-size: 0.9em;
        font-weight: 500;
      }

      .demo-sequence {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
        margin: 40px 0;
        flex-wrap: wrap;
      }

      .demo-step {
        text-align: center;
        flex: 1;
        min-width: 180px;
      }

      .step-number {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin: 0 auto 16px;
      }

      .demo-button {
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        color: white;
        padding: 14px 24px;
        border: none;
        border-radius: 12px;
        font-size: 1.2em;
        font-weight: 600;
        margin: 0 auto 12px;
        width: fit-content;
        cursor: pointer;
        box-shadow: 
          0 8px 24px rgba(0, 123, 255, 0.3),
          0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        animation: softGlow 3s ease-in-out infinite;
        position: relative;
        overflow: hidden;
      }

      .demo-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(255, 255, 255, 0.3), 
          transparent);
        transition: left 0.6s ease;
      }

      .demo-button:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
          0 12px 32px rgba(0, 123, 255, 0.4),
          0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .demo-button:hover::before {
        left: 100%;
      }

      .demo-button:active {
        transform: translateY(0) scale(0.98);
        transition-duration: 0.1s;
      }

      .demo-image-small {
        width: 80px;
        height: 60px;
        background: #ddd;
        border-radius: 10px;
        margin: 0 auto 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        filter: blur(4px);
      }

      .demo-image-small.clickable {
        cursor: pointer;
        animation: pulse 1.5s infinite;
      }

      .demo-image-small.unblurred {
        filter: none;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 1.5em;
      }

      .click-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8em;
        font-weight: 600;
        animation: bounce 1s infinite;
      }

      .demo-arrow {
        font-size: 1.5em;
        color: #667eea;
        font-weight: bold;
      }

      .ready-features {
        display: flex;
        flex-direction: column;
        gap: 24px;
        max-width: 500px;
        margin: 0 auto;
        text-align: left;
      }

      .ready-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 20px;
        background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
        border-radius: 12px;
        border: 1px solid #e1e8ff;
      }

      .ready-icon {
        font-size: 1.8em;
        flex-shrink: 0;
      }

      .ready-item h4 {
        margin: 0 0 4px 0;
        color: #333;
        font-size: 1.1em;
        font-weight: 600;
      }

      .ready-item p {
        margin: 0;
        color: #666;
        line-height: 1.4;
      }

      .onboarding-navigation {
        background: linear-gradient(135deg, 
          rgba(255, 255, 255, 0.95) 0%, 
          rgba(248, 250, 252, 0.9) 100%);
        backdrop-filter: blur(30px) saturate(1.2);
        padding: 28px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgba(255, 255, 255, 0.3);
        position: relative;
        flex-shrink: 0;
        min-height: 100px;
        box-shadow: 
          0 -8px 32px rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.6);
      }

      .onboarding-navigation::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(102, 126, 234, 0.2), 
          rgba(118, 75, 162, 0.2), 
          transparent);
      }

      .onboarding-progress {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .progress-bar {
        width: 220px;
        height: 8px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
        position: relative;
      }

      .progress-bar::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
          rgba(255, 255, 255, 0.8), 
          rgba(255, 255, 255, 0.4));
        border-radius: 10px 10px 0 0;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(135deg, 
          #667eea 0%, 
          #764ba2 50%, 
          #667eea 100%);
        border-radius: 10px;
        box-shadow: 
          0 0 12px rgba(102, 126, 234, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
        position: relative;
        overflow: hidden;
      }

      .progress-fill::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(255, 255, 255, 0.4), 
          transparent);
        animation: shimmer 2s ease-in-out infinite;
      }

      @keyframes shimmer {
        0% { left: -100%; }
        50% { left: 100%; }
        100% { left: 100%; }
      }
        transition: width 0.3s ease;
        width: 25%;
      }

      .progress-text {
        color: #666;
        font-size: 0.9em;
        font-weight: 500;
      }

      .onboarding-buttons {
        display: flex;
        gap: 12px;
      }

      .onboarding-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1em;
      }

      .onboarding-btn.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 
          0 10px 20px rgba(102, 126, 234, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
      }

      .onboarding-btn.primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
        pointer-events: none;
        transition: opacity 0.3s ease;
        opacity: 0;
      }

      .onboarding-btn.primary:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
          0 12px 32px rgba(102, 126, 234, 0.4),
          0 4px 16px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .onboarding-btn.primary:hover::before {
        opacity: 1;
      }

      .onboarding-btn.primary:active {
        transform: translateY(0) scale(0.98);
        transition-duration: 0.1s;
        box-shadow: 
          0 4px 12px rgba(102, 126, 234, 0.3),
          inset 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .onboarding-btn.secondary {
        background: transparent;
        color: #666;
        border: 1px solid #ddd;
      }

      .onboarding-btn.secondary:hover {
        background: #f5f5f5;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      @keyframes slideInRight {
        from { transform: translateX(20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }

      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      /* Apple-style animations */
      @keyframes slideUpApple {
        0% { 
          transform: translateY(40px) scale(0.95); 
          opacity: 0; 
          filter: blur(8px);
        }
        50% {
          transform: translateY(20px) scale(0.98);
          opacity: 0.8;
          filter: blur(4px);
        }
        100% { 
          transform: translateY(0) scale(1); 
          opacity: 1; 
          filter: blur(0px);
        }
      }

      @keyframes floatUp {
        0% { 
          transform: translateY(100px) scale(0.8); 
          opacity: 0; 
        }
        60% { 
          transform: translateY(-10px) scale(1.05); 
          opacity: 1; 
        }
        100% { 
          transform: translateY(0) scale(1); 
          opacity: 1; 
        }
      }

      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-15px) rotate(1deg); }
        66% { transform: translateY(-8px) rotate(-1deg); }
      }

      @keyframes softGlow {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
          transform: scale(1);
        }
        50% { 
          box-shadow: 0 0 40px rgba(118, 75, 162, 0.5);
          transform: scale(1.02);
        }
      }

      /* Enhanced floating shapes animation */
      .floating-shape {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }

      .floating-shape:nth-child(odd) {
        animation-name: gentleFloat;
        animation-duration: 8s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
      }

      .floating-shape:nth-child(even) {
        animation-name: gentleFloat;
        animation-duration: 12s;
        animation-iteration-count: infinite;
        animation-direction: alternate-reverse;
      }

      @media (max-width: 768px) {
        .onboarding-container {
          width: 95%;
          max-height: 95vh;
          min-height: 450px;
        }

        .onboarding-step-content {
          padding: 24px;
          max-height: calc(95vh - 250px);
        }

        .onboarding-navigation {
          padding: 20px 24px;
          min-height: 80px;
        }

        .onboarding-header {
          padding: 24px 24px 16px;
        }

        .onboarding-header h1 {
          font-size: 2em;
        }

        .onboarding-header h2 {
          font-size: 1.8em;
        }

        .feature-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .demo-sequence {
          flex-direction: column;
          gap: 16px;
        }

        .demo-arrow {
          transform: rotate(90deg);
        }

        .onboarding-navigation {
          flex-direction: column;
          gap: 16px;
          text-align: center;
        }
      }

      /* Media query for short screen heights */
      @media (max-height: 600px) {
        .onboarding-container {
          max-height: 95vh;
          min-height: 400px;
        }

        .onboarding-header {
          padding: 16px 32px 12px;
        }

        .onboarding-header h1 {
          font-size: 1.8em;
          margin: 8px 0 4px 0;
        }

        .onboarding-header h2 {
          font-size: 1.6em;
          margin: 0 0 4px 0;
        }

        .onboarding-subtitle {
          font-size: 1.1em;
          margin-bottom: 0;
        }

        .onboarding-step-content {
          padding: 24px;
          max-height: calc(95vh - 200px);
        }

        .onboarding-navigation {
          padding: 16px 32px;
          min-height: 70px;
        }

        .header-icon {
          font-size: 2.5em;
        }
      }

      /* Media query for very short screen heights */
      @media (max-height: 500px) {
        .onboarding-container {
          max-height: 98vh;
          min-height: 350px;
        }

        .onboarding-header {
          padding: 12px 24px 8px;
        }

        .onboarding-header h1 {
          font-size: 1.5em;
          margin: 4px 0 2px 0;
        }

        .onboarding-header h2 {
          font-size: 1.4em;
          margin: 0 0 2px 0;
        }

        .onboarding-subtitle {
          font-size: 1em;
          margin-bottom: 0;
        }

        .onboarding-step-content {
          padding: 16px;
          max-height: calc(98vh - 160px);
        }

        .onboarding-navigation {
          padding: 12px 24px;
          min-height: 60px;
        }

        .header-icon {
          font-size: 2em;
        }

        .header-icon-container {
          margin-bottom: 8px;
        }
      }
    `;
  }

  private setupEventListeners(): void {
    const nextBtn = document.getElementById('onboarding-next');
    const backBtn = document.getElementById('onboarding-back');
    const skipBtn = document.getElementById('onboarding-skip');
    const finishBtn = document.getElementById('onboarding-finish');

    nextBtn?.addEventListener('click', () => this.nextStep());
    backBtn?.addEventListener('click', () => this.previousStep());
    skipBtn?.addEventListener('click', () => this.finish());
    finishBtn?.addEventListener('click', () => this.finish());

    // Add interactive demo elements
    const demoButton = this.element.querySelector('.demo-button');
    const clickableImage = this.element.querySelector('.demo-image-small.clickable');

    demoButton?.addEventListener('click', () => {
      demoButton.classList.add('active');
      setTimeout(() => demoButton.classList.remove('active'), 200);
    });

    clickableImage?.addEventListener('click', () => {
      clickableImage.classList.remove('clickable');
      clickableImage.classList.add('unblurred');
      clickableImage.textContent = '✨';
    });
  }

  private nextStep(): void {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.updateStep();
    }
  }

  private previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateStep();
    }
  }

  private updateStep(): void {
    // Hide all steps
    const steps = this.element.querySelectorAll('.onboarding-step');
    steps.forEach(step => step.classList.remove('active'));

    // Show current step
    const currentStepEl = this.element.querySelector(`[data-step="${this.currentStep}"]`);
    currentStepEl?.classList.add('active');

    // Update progress
    const progressFill = this.element.querySelector('.progress-fill') as HTMLElement;
    const currentStepText = document.getElementById('current-step');
    
    if (progressFill) {
      progressFill.style.width = `${((this.currentStep + 1) / this.totalSteps) * 100}%`;
    }
    
    if (currentStepText) {
      currentStepText.textContent = (this.currentStep + 1).toString();
    }

    // Update button visibility
    const nextBtn = document.getElementById('onboarding-next');
    const backBtn = document.getElementById('onboarding-back');
    const finishBtn = document.getElementById('onboarding-finish');

    if (backBtn) {
      backBtn.style.display = this.currentStep > 0 ? 'block' : 'none';
    }

    if (nextBtn && finishBtn) {
      if (this.currentStep === this.totalSteps - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'block';
      } else {
        nextBtn.style.display = 'block';
        finishBtn.style.display = 'none';
      }
    }
  }

  private finish(): void {
    // Mark onboarding as completed
    localStorage.setItem('noxbox-onboarding-completed', 'true');
    
    // Remove onboarding elements
    this.element.remove();
    const styles = document.getElementById('onboarding-styles');
    styles?.remove();
    
    console.log('Onboarding completed');
  }

  public static shouldShowOnboarding(): boolean {
    return localStorage.getItem('noxbox-onboarding-completed') !== 'true';
  }

  public static show(): void {
    if (OnboardingFlow.shouldShowOnboarding()) {
      new OnboardingFlow();
    }
  }
}
