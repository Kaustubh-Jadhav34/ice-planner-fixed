import { LitElement, html, css } from 'lit';
import '../app-page-wrapper.js';
import '../app-number-input.js';

export class PageCalculator extends LitElement {
  static get properties() {
    return {
      teamName: { type: String },
      logo: { type: String },
      iceCost: { type: Number },
      hours: { type: Number },
      coachCost: { type: Number },
      jerseyCost: { type: Number },
      players: { type: Number },
      totalBase: { type: Number },
      totalWithFees: { type: Number },
      perPlayer: { type: Number },
    };
  }

  constructor() {
    super();
    this.teamName = '';
    this.logo = '';
    this.iceCost = 0;
    this.hours = 0;
    this.coachCost = 0;
    this.jerseyCost = 0;
    this.players = 1;
  }

  _emitChange(event, field) {
    this.dispatchEvent(
      new CustomEvent(field, { detail: event.detail?.value ?? 0 })
    );
  }

  _handleTeamChange(e) {
    this.dispatchEvent(new CustomEvent('team-changed', { detail: e.target.value }));
  }

  _handleLogoChange(e) {
    this.dispatchEvent(new CustomEvent('logo-changed', { detail: e.target.value }));
  }

  static get styles() {
    return css`
      :host {
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

      .top {
        display: grid;
        gap: 10px;
        grid-template-columns: minmax(220px, 1fr) minmax(200px, 1fr);
        align-items: center;
      }

      .title {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      h2 {
        margin: 0;
        font: 800 1.2rem/1.1 system-ui, Arial, sans-serif;
        color: var(--accent);
      }

      .row {
        display: flex;
        gap: 10px;
      }

      .pill {
        flex: 1;
        min-width: 140px;
        display: flex;
        gap: 8px;
        align-items: center;
        background: rgba(96, 165, 250, 0.07);
        border: 1px solid var(--ring);
        border-radius: 999px;
        padding: 8px 12px;
      }

      .pill input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        color: var(--fg);
      }

      img.logo {
        height: 42px;
        width: 42px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid var(--ring);
      }

      .grid {
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(2, minmax(220px, 1fr));
      }

      @media (max-width: 720px) {
        .grid {
          grid-template-columns: 1fr;
        }
        .top {
          grid-template-columns: 1fr;
        }
      }

      .totals {
        display: grid;
        gap: 8px;
        border-top: 1px dashed var(--ring);
        padding-top: 12px;
      }

      .pair {
        display: flex;
        justify-content: space-between;
      }

      .muted {
        color: var(--muted);
      }

      .strong {
        font-weight: 800;
      }

      .cta {
        margin-top: 8px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      button.btn {
        background: linear-gradient(90deg, #60a5fa, #a78bfa);
        color: #fff;
        border: none;
        border-radius: 12px;
        padding: 10px 14px;
        cursor: pointer;
      }
    `;
  }

  render() {
    return html`
      <app-page-wrapper .title=${"Calculator"} .showNav=${true}>
        <div class="top">
          <div class="title">
            ${this.logo ? html`<img class="logo" src="${this.logo}" alt="logo" />` : html``}
            <h2>Ice Planner</h2>
          </div>
          <div class="row">
            <div class="pill">
              <span class="muted">Team</span>
              <input
                type="text"
                .value=${this.teamName}
                @input=${this._handleTeamChange}
              />
            </div>
            <div class="pill">
              <span class="muted">Logo URL</span>
              <input
                type="text"
                .value=${this.logo}
                @input=${this._handleLogoChange}
              />
            </div>
          </div>
        </div>

        <div class="grid">
          <app-number-input
            label="Ice cost ($/hour)"
            .value=${this.iceCost}
            .min=${0}
            .step=${1}
            suffix="$"
            @value-changed=${(e) => this._emitChange(e, 'ice-changed')}
          ></app-number-input>
          <app-number-input
            label="Hours"
            .value=${this.hours}
            .min=${0}
            .step=${1}
            @value-changed=${(e) => this._emitChange(e, 'hours-changed')}
          ></app-number-input>
          <app-number-input
            label="Coaches ($)"
            .value=${this.coachCost}
            .min=${0}
            .step=${1}
            suffix="$"
            @value-changed=${(e) => this._emitChange(e, 'coach-changed')}
          ></app-number-input>
          <app-number-input
            label="Jerseys ($)"
            .value=${this.jerseyCost}
            .min=${0}
            .step=${1}
            suffix="$"
            @value-changed=${(e) => this._emitChange(e, 'jersey-changed')}
          ></app-number-input>
          <app-number-input
            label="Players"
            .value=${this.players}
            .min=${1}
            .step=${1}
            @value-changed=${(e) => this._emitChange(e, 'players-changed')}
          ></app-number-input>
        </div>

        <div class="totals">
          <div class="pair">
            <span class="muted">Base total</span
            ><span class="strong">$${this.totalBase}</span>
          </div>
          <div class="pair">
            <span class="muted">With fees</span
            ><span class="strong">$${this.totalWithFees}</span>
          </div>
          <div class="pair">
            <span class="muted">Per player</span
            ><span class="strong">$${this.perPlayer}</span>
          </div>
          <div class="cta">
            <button class="btn" @click=${() => this.dispatchEvent(new CustomEvent('copy-url'))}>
              Copy sharable URL
            </button>
          </div>
        </div>
      </app-page-wrapper>
    `;
  }
}

customElements.define('page-calculator', PageCalculator);