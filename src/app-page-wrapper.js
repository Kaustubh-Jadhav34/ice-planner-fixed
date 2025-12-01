import { LitElement, html, css } from 'lit';

export class AppPageWrapper extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      showNav: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.title = 'Page';
    this.showNav = true;
  }

  _navigateTo(page) {
    const sp = new URLSearchParams(window.location.search);
    sp.set('page', page);
    window.history.replaceState({}, '', `${location.pathname}?${sp.toString()}`);
    window.dispatchEvent(new CustomEvent('page-changed'));
  }

  static get styles() {
    return css`
      :host {
        display: block;
        --card: #0e1529;
        --fg: #dbeafe;
        --muted: #93a3b8;
        --ring: #263449;
        --accent: var(--ddd-theme-default-wonderPurple, #7c5dff);
      }
      @media (prefers-color-scheme: light) {
        :host {
          --card: #ffffff;
          --fg: #0b1c5b;
          --muted: #475569;
          --ring: #cbd5e1;
        }
      }

      .page-wrapper {
        background: var(--card);
        color: var(--fg);
        border: 1px solid var(--ring);
        border-radius: 16px;
        overflow: hidden;
      }

      .page-header {
        background: linear-gradient(90deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.1));
        border-bottom: 1px solid var(--ring);
        padding: 16px 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      h2 {
        margin: 0;
        font: 800 1.2rem/1.1 system-ui, Arial, sans-serif;
        color: var(--accent);
      }

      .page-nav {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .nav-btn {
        padding: 6px 12px;
        border-radius: 8px;
        border: 1px solid var(--ring);
        background: transparent;
        color: var(--fg);
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.15s ease;
      }

      .nav-btn:hover {
        background: rgba(96, 165, 250, 0.1);
        border-color: #60a5fa;
      }

      .nav-btn.active {
        background: #60a5fa;
        color: #fff;
        border-color: #60a5fa;
      }

      .page-body {
        padding: 18px;
        display: grid;
        gap: 14px;
      }

      .page-footer {
        border-top: 1px dashed var(--ring);
        padding: 12px 18px;
        text-align: center;
        color: var(--muted);
        font-size: 0.85rem;
      }
    `;
  }

  render() {
    return html`
      <div class="page-wrapper">
        ${this.showNav
          ? html`
              <div class="page-header">
                <h2>${this.title}</h2>
                <div class="page-nav">
                  <button class="nav-btn active" @click=${() => this._navigateTo('calculator')}>
                    Calculator
                  </button>
                  <button class="nav-btn" @click=${() => this._navigateTo('summary')}>
                    Summary
                  </button>
                  <button class="nav-btn" @click=${() => this._navigateTo('settings')}>
                    Settings
                  </button>
                </div>
              </div>
            `
          : html``}

        <div class="page-body">
          <slot></slot>
        </div>

        <div class="page-footer">
          Ice Planner v2 • Multiple Pages • Responsive Design
        </div>
      </div>
    `;
  }
}

customElements.define('app-page-wrapper', AppPageWrapper);