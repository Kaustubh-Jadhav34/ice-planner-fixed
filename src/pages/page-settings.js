import { LitElement, html, css } from 'lit';
import '../app-page-wrapper.js';
import '../app-number-input.js';

export class PageSettings extends LitElement {
  static get properties() {
    return {
      teamName: { type: String },
      logo: { type: String },
      feePct: { type: Number },
      feeFixed: { type: Number },
    };
  }

  constructor() {
    super();
    this.teamName = '';
    this.logo = '';
    this.feePct = 0.02;
    this.feeFixed = 0.99;
  }

  _handleTeamChange(e) {
    this.dispatchEvent(new CustomEvent('team-changed', { detail: e.target.value }));
  }

  _handleLogoChange(e) {
    this.dispatchEvent(new CustomEvent('logo-changed', { detail: e.target.value }));
  }

  _emitChange(event, field) {
    this.dispatchEvent(
      new CustomEvent(field, { detail: event.detail?.value ?? 0 })
    );
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

      .section {
        background: rgba(96, 165, 250, 0.06);
        border: 1px solid var(--ring);
        border-radius: 12px;
        padding: 14px;
      }

      .section h3 {
        margin: 0 0 12px 0;
        color: var(--accent);
        font-size: 1rem;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-group:last-child {
        margin-bottom: 0;
      }

      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--fg);
      }

      .pill {
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
        font: inherit;
      }

      .pill input::placeholder {
        color: var(--muted);
      }

      .description {
        font-size: 0.85rem;
        color: var(--muted);
        margin-top: 4px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 14px;
      }

      .example {
        background: rgba(96, 165, 250, 0.04);
        border-left: 3px solid var(--accent);
        border-radius: 4px;
        padding: 10px 12px;
        margin-top: 8px;
        font-size: 0.85rem;
        color: var(--muted);
      }

      .example strong {
        color: var(--fg);
      }
    `;
  }

  render() {
    return html`
      <app-page-wrapper .title=${"Settings"} .showNav=${true}>
        <div class="section">
          <h3>Team Information</h3>
          <div class="form-group">
            <label for="team-name">Team Name</label>
            <div class="pill">
              <input
                id="team-name"
                type="text"
                .value=${this.teamName}
                @input=${this._handleTeamChange}
                placeholder="Enter team name"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="logo-url">Logo URL</label>
            <div class="pill">
              <input
                id="logo-url"
                type="url"
                .value=${this.logo}
                @input=${this._handleLogoChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div class="description">Logo will appear at 42×42px on the calculator page</div>
          </div>
        </div>

        <div class="section">
          <h3>Fee Configuration</h3>
          <p class="description" style="margin: 0 0 12px 0;">
            Fees are applied to the base cost. Formula: (Base × Percent) + Fixed
          </p>

          <div class="grid">
            <div class="form-group">
              <app-number-input
                label="Fee Percentage"
                .value=${this.feePct}
                .min=${0}
                .step=${0.005}
                @value-changed=${(e) => this._emitChange(e, 'fee-pct-changed')}
              ></app-number-input>
              <div class="example">
                <strong>${this.feePct.toFixed(3)}</strong> = ${(this.feePct * 100).toFixed(1)}% fee
              </div>
            </div>

            <div class="form-group">
              <app-number-input
                label="Fixed Fee"
                .value=${this.feeFixed}
                .min=${0}
                .step=${0.5}
                suffix="$"
                @value-changed=${(e) => this._emitChange(e, 'fee-fixed-changed')}
              ></app-number-input>
              <div class="example">
                Flat <strong>$${this.feeFixed.toFixed(2)}</strong> added per transaction
              </div>
            </div>
          </div>

          <div class="example" style="margin-top: 14px; border-left-color: var(--accent);">
            <strong>Example:</strong> Base cost $1000 with ${(this.feePct * 100).toFixed(1)}% + $${this.feeFixed.toFixed(2)}:
            <br />($1000 × ${(1 + this.feePct).toFixed(3)}) + $${this.feeFixed.toFixed(2)} =
            <strong>$${(1000 * (1 + this.feePct) + this.feeFixed).toFixed(2)}</strong>
          </div>
        </div>

        <div class="section">
          <h3>About</h3>
          <p style="margin: 0; color: var(--muted); font-size: 0.9rem;">
            Ice Planner v2 helps teams calculate costs and share expenses fairly. Data is saved
            locally in your browser and synced via shareable URLs.
          </p>
        </div>
      </app-page-wrapper>
    `;
  }
}

customElements.define('page-settings', PageSettings);