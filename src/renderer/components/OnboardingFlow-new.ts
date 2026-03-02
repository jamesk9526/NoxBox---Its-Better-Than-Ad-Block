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
        <div class="backdrop-pattern"></div>
      </div>
      <div class="onboarding-container">
        <div class="onboarding-header">
          <div class="brand-section">
            <div class="brand-icon">🛡️</div>
            <h1 class="brand-title">NoxBox</h1>
            <p class="brand-tagline">Privacy-first browsing</p>
          </div>
        </div>

        <div class="onboarding-content">

        <!-- Step 1: Welcome -->
        <div class="onboarding-step active" data-step="0">
          <div class="step-content">
            <div class="welcome-section">
              <h2>Welcome to NoxBox</h2>
              <p class="welcome-description">
                Take control of your digital experience with intelligent media blurring and selective content control.
              </p>

              <div class="key-features">
                <div class="feature-item">
                  <div class="feature-icon">👁️</div>
                  <div class="feature-text">
                    <h3>Smart Blur</h3>
                    <p>Automatically blur distracting content</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">🎯</div>
                  <div class="feature-text">
                    <h3>Selective Control</h3>
                    <p>Click to reveal what matters to you</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">⚡</div>
                  <div class="feature-text">
                    <h3>Lightning Fast</h3>
                    <p>Seamless browsing experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: How It Works -->
        <div class="onboarding-step" data-step="1">
          <div class="step-content">
            <h2>How NoxBox Works</h2>
            <div class="demo-section">
              <div class="browser-mockup">
                <div class="browser-header">
                  <div class="browser-controls">
                    <span class="control-dot red"></span>
                    <span class="control-dot yellow"></span>
                    <span class="control-dot green"></span>
                  </div>
                  <div class="browser-address">example.com</div>
                </div>
                <div class="browser-content">
                  <div class="content-text">Regular webpage content...</div>
                  <div class="content-media blurred">
                    <div class="blur-indicator">
                      <span class="blur-icon">🔒</span>
                      <span class="blur-text">Auto-blurred</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="demo-explanation">
                <p>All images and videos are automatically blurred when you visit a website.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Unblur Mode -->
        <div class="onboarding-step" data-step="2">
          <div class="step-content">
            <h2>Take Control</h2>
            <div class="control-section">
              <div class="control-step">
                <div class="step-number">1</div>
                <div class="step-info">
                  <h3>Enter Unblur Mode</h3>
                  <p>Click the eye icon in the toolbar to activate selective control</p>
                </div>
              </div>
              <div class="control-arrow">↓</div>
              <div class="control-step">
                <div class="step-number">2</div>
                <div class="step-info">
                  <h3>Click to Reveal</h3>
                  <p>Click on any blurred content to unblur it instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Get Started -->
        <div class="onboarding-step" data-step="3">
          <div class="step-content">
            <h2>You're All Set!</h2>
            <div class="final-section">
              <div class="success-message">
                <div class="success-icon">🎉</div>
                <p>Ready to browse with focus and control</p>
              </div>

              <div class="tips-section">
                <h3>Quick Tips</h3>
                <div class="tips-list">
                  <div class="tip-item">
                    <span class="tip-bullet">•</span>
                    <span>Use the settings panel to adjust blur intensity</span>
                  </div>
                  <div class="tip-item">
                    <span class="tip-bullet">•</span>
                    <span>Hover over blurred content for quick previews</span>
                  </div>
                  <div class="tip-item">
                    <span class="tip-bullet">•</span>
                    <span>Right-click for additional options</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>

        <!-- Navigation -->
        <div class="onboarding-navigation">
          <div class="nav-left">
            <button id="onboarding-skip" class="nav-btn secondary">Skip</button>
          </div>

          <div class="progress-section">
            <div class="progress-dots">
              <div class="progress-dot active" data-step="0"></div>
              <div class="progress-dot" data-step="1"></div>
              <div class="progress-dot" data-step="2"></div>
              <div class="progress-dot" data-step="3"></div>
            </div>
            <span class="progress-text">Step <span id="current-step">1</span> of ${this.totalSteps}</span>
          </div>

          <div class="nav-right">
            <button id="onboarding-back" class="nav-btn secondary" style="display: none;">Back</button>
            <button id="onboarding-next" class="nav-btn primary">Next</button>
            <button id="onboarding-finish" class="nav-btn primary success" style="display: none;">Get Started</button>
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        animation: fadeIn 0.5s ease-out;
      }

      .onboarding-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        overflow: hidden;
      }

      .backdrop-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image:
          radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        animation: patternShift 20s ease-in-out infinite;
      }

      .onboarding-container {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        box-shadow:
          0 25px 50px rgba(0, 0, 0, 0.15),
          0 10px 25px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        position: relative;
        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .onboarding-header {
        padding: 24px 32px;
        text-align: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%);
      }

      .brand-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .brand-icon {
        font-size: 3rem;
        animation: gentlePulse 2s ease-in-out infinite;
      }

      .brand-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1a202c;
        margin: 0;
        letter-spacing: -0.02em;
      }

      .brand-tagline {
        font-size: 1rem;
        color: #718096;
        margin: 0;
        font-weight: 500;
      }

      .onboarding-content {
        flex: 1;
        overflow-y: auto;
        padding: 0;
      }

      .onboarding-step {
        display: none;
        padding: 32px;
        min-height: 400px;
      }

      .onboarding-step.active {
        display: block;
        animation: fadeInUp 0.5s ease-out;
      }

      .step-content h2 {
        font-size: 1.75rem;
        font-weight: 600;
        color: #1a202c;
        margin: 0 0 16px 0;
        text-align: center;
      }

      .welcome-description {
        font-size: 1.125rem;
        color: #4a5568;
        text-align: center;
        margin: 0 0 32px 0;
        line-height: 1.6;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      .key-features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;
        margin-top: 32px;
      }

      .feature-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 20px;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        transition: all 0.2s ease;
      }

      .feature-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      .feature-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }

      .feature-text h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1a202c;
        margin: 0 0 4px 0;
      }

      .feature-text p {
        font-size: 0.875rem;
        color: #718096;
        margin: 0;
        line-height: 1.5;
      }

      .demo-section {
        text-align: center;
        margin-top: 24px;
      }

      .browser-mockup {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin: 0 auto 24px;
        max-width: 500px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
      }

      .browser-header {
        background: #f8fafc;
        padding: 12px 16px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .browser-controls {
        display: flex;
        gap: 8px;
      }

      .control-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      .control-dot.red { background: #ff5f57; }
      .control-dot.yellow { background: #ffbd2e; }
      .control-dot.green { background: #28ca42; }

      .browser-address {
        background: #ffffff;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.875rem;
        color: #4a5568;
        border: 1px solid #e2e8f0;
        flex: 1;
        text-align: center;
      }

      .browser-content {
        padding: 24px;
      }

      .content-text {
        font-size: 0.875rem;
        color: #718096;
        margin-bottom: 16px;
      }

      .content-media {
        height: 120px;
        background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        filter: blur(4px);
      }

      .blur-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: #4a5568;
      }

      .blur-icon {
        font-size: 1.5rem;
      }

      .blur-text {
        font-size: 0.75rem;
        font-weight: 500;
      }

      .demo-explanation {
        margin-top: 16px;
      }

      .demo-explanation p {
        font-size: 1rem;
        color: #4a5568;
        margin: 0;
        line-height: 1.6;
      }

      .control-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 32px;
        margin-top: 24px;
      }

      .control-step {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 24px;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        max-width: 400px;
        width: 100%;
      }

      .step-number {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
        flex-shrink: 0;
      }

      .step-info h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1a202c;
        margin: 0 0 4px 0;
      }

      .step-info p {
        font-size: 0.875rem;
        color: #718096;
        margin: 0;
        line-height: 1.5;
      }

      .control-arrow {
        font-size: 1.5rem;
        color: #667eea;
        font-weight: bold;
      }

      .final-section {
        text-align: center;
        margin-top: 24px;
      }

      .success-message {
        margin-bottom: 32px;
      }

      .success-icon {
        font-size: 3rem;
        margin-bottom: 16px;
        animation: bounce 1s ease-out;
      }

      .success-message p {
        font-size: 1.125rem;
        color: #4a5568;
        margin: 0;
        line-height: 1.6;
      }

      .tips-section {
        text-align: left;
        max-width: 400px;
        margin: 0 auto;
      }

      .tips-section h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1a202c;
        margin: 0 0 16px 0;
      }

      .tips-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .tip-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }

      .tip-bullet {
        color: #667eea;
        font-weight: bold;
        flex-shrink: 0;
      }

      .tip-item span:last-child {
        font-size: 0.875rem;
        color: #718096;
        line-height: 1.5;
      }

      .onboarding-navigation {
        padding: 24px 32px;
        border-top: 1px solid #e2e8f0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
      }

      .nav-left, .nav-right {
        flex-shrink: 0;
      }

      .progress-section {
        flex: 1;
        text-align: center;
      }

      .progress-dots {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .progress-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #e2e8f0;
        transition: all 0.3s ease;
      }

      .progress-dot.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transform: scale(1.2);
      }

      .progress-text {
        font-size: 0.875rem;
        color: #718096;
        font-weight: 500;
      }

      .nav-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
        background: transparent;
      }

      .nav-btn.secondary {
        color: #718096;
        border: 1px solid #e2e8f0;
      }

      .nav-btn.secondary:hover {
        background: #f8fafc;
        border-color: #cbd5e0;
      }

      .nav-btn.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .nav-btn.primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
      }

      .nav-btn.success {
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
      }

      .nav-btn.success:hover {
        box-shadow: 0 6px 16px rgba(72, 187, 120, 0.4);
      }

      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes patternShift {
        0%, 100% {
          transform: translateX(0) translateY(0);
        }
        50% {
          transform: translateX(-20px) translateY(-20px);
        }
      }

      @keyframes gentlePulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .onboarding-container {
          width: 95%;
          max-height: 95vh;
        }

        .onboarding-header {
          padding: 20px 24px;
        }

        .brand-title {
          font-size: 1.5rem;
        }

        .brand-icon {
          font-size: 2.5rem;
        }

        .onboarding-step {
          padding: 24px;
        }

        .step-content h2 {
          font-size: 1.5rem;
        }

        .key-features {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .control-section {
          gap: 24px;
        }

        .control-step {
          padding: 20px;
        }

        .onboarding-navigation {
          padding: 20px 24px;
          flex-direction: column;
          gap: 16px;
        }

        .nav-left, .nav-right {
          width: 100%;
        }

        .nav-left {
          order: 2;
        }

        .nav-right {
          order: 3;
        }

        .progress-section {
          order: 1;
        }
      }

      @media (max-width: 480px) {
        .onboarding-step {
          padding: 20px;
        }

        .welcome-description {
          font-size: 1rem;
        }

        .feature-item {
          padding: 16px;
        }

        .control-step {
          padding: 16px;
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

    // Update progress dots
    const dots = this.element.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentStep) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update progress text
    const currentStepText = document.getElementById('current-step');
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
