import { LitElement, html, css } from 'lit';
import '../app-page-wrapper.js';

export class PageSummary extends LitElement {
  static get properties() {
    return {
      teamName: { type: String },
      logo: { type: String },
      totalBase: { type: Number },
      totalWithFees: { type: Number },
      perPlayer: { type: Number },
      players: { type: Number },
      iceCost: { type: Number },
      hours: { type: Number },
      coachCost: { type: Number },
      jerseyCost: { type: Number },
    };
  }

  constructor() {
    super();
    this.teamName = '';
    this.logo = '';
    this.totalBase = 0;
    this.totalWithFees = 0;
    this.perPlayer = 0;
    this.players = 1;
    this.iceCost = 0;
    this.hours = 0;
    this.coachCost = 0;
    this.jerseyCost = 0;
  }

  _calcIceTotal() {
    return Number((this.iceCost * this.hours).toFixed(2));
  }

  _calcJerseyTotal() {
    return Number((this.jerseyCost * this.players).toFixed(2));
  }

  _calcFees() {
    const base = this.totalBase;
    return Number((this.totalWithFees - base).toFixed(2));
  }

  _calcPerPlayerBreakdown(category) {
    const base = this.totalBase;
    const breakdown = {
      ice: (this.iceCost * this.hours) / Math.max(1, this.players),
      coach: this.coachCost / Math.max(1, this.players),
      jersey: this.jerseyCost,
      fees: this._calcFees() / Math.max(1, this.players),
    };
    return Number((breakdown[category] || 0).toFixed(2));
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

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      img.logo {
        height: 48px;
        width: 48px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid var(--ring);
      }

      .team-info h3 {
        margin: 0 0 4px 0;
        color: var(--accent);
      }

      .team-info p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--muted);
      }

      .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
      }

      .stat-card {
        background: rgba(96, 165, 250, 0.08);
        border: 1px solid var(--ring);
        border-radius: 12px;
        padding: 12px;
        text-align: center;
      }

      .stat-label {
        font-size: 0.85rem;
        color: var(--muted);
        margin-bottom: 6px;
      }

      .stat-value {
        font-size: 1.4rem;
        font-weight: 800;
        color: var(--accent);
      }

      .breakdown {
        background: rgba(96, 165, 250, 0.06);
        border: 1px solid var(--ring);
        border-radius: 12px;
        padding: 14px;
      }

      .breakdown h4 {
        margin: 0 0 10px 0;
        color: var(--accent);
        font-size: 0.95rem;
      }

      .breakdown-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px dashed var(--ring);
      }

      .breakdown-row:last-child {
        border-bottom: none;
      }

      .breakdown-label {
        color: var(--muted);
        font-size: 0.9rem;
      }

      .breakdown-value {
        font-weight: 600;
        color: var(--fg);
      }

      .breakdown-value.total {
        color: var(--accent);
        font-weight: 800;
        font-size: 1.05rem;
      }
    `;
  }

  render() {
    return html`
      <app-page-wrapper .title=${"Summary"} .showNav=${true}>
        <div class="header">
          ${this.logo
            ? html`<img class="logo" src="${this.logo}" alt="logo" />`
            : html`<div style="width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--ring); background: rgba(96, 165, 250, 0.1);"></div>`}
          <div class="team-info">
            <h3>${this.teamName || 'Team'}</h3>
            <p>${this.players} player${this.players !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-label">Base Total</div>
            <div class="stat-value">$${this.totalBase}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Fees</div>
            <div class="stat-value">$${this._calcFees()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total</div>
            <div class="stat-value">$${this.totalWithFees}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Per Player</div>
            <div class="stat-value">$${this.perPlayer}</div>
          </div>
        </div>

        <div class="breakdown">
          <h4>Cost Breakdown (Total)</h4>
          <div class="breakdown-row">
            <span class="breakdown-label">Ice Time (${this.hours}h @ $${this.iceCost}/h)</span>
            <span class="breakdown-value">$${this._calcIceTotal()}</span>
          </div>
          <div class="breakdown-row">
            <span class="breakdown-label">Coaches</span>
            <span class="breakdown-value">$${this.coachCost}</span>
          </div>
          <div class="breakdown-row">
            <span class="breakdown-label">Jerseys (${this.players} @ $${this.jerseyCost} each)</span>
            <span class="breakdown-value">$${this._calcJerseyTotal()}</span>
          </div>
          <div class="breakdown-row">
            <span class="breakdown-label">Subtotal</span>
            <span class="breakdown-value">$${this.totalBase}</span>
          </div>
          <div class="breakdown-row">
            <span class="breakdown-label">Fees</span>
            <span class="breakdown-value">$${this._calcFees()}</span>
          </div>
          <div class="breakdown-row">
            <span class="breakdown-label">Total</span>
            <span class="breakdown-value total">$${this.totalWithFees}</span>
          </div>
        </div>

        <div class="breakdown">
          <h4>Per-Player Breakdown</h4>
          <div class="breakdown-row">
            <span class="breakdown-label">Ice Time Share</span>
            <span class="breakdown-value">$${this._calcPerPlayerBreakdown('ice').toFixed(2)}</span>
          </div>
          <div class="breakdown-row">
            <span class="breakdown-label">Coach Share</span>
            <span class="breakdown-value">$${this._calcPerPlayerBreakdown('coach').toFixed(2)}</span>
          </div>
          <div class="breakdown-row">
            <span class="breakdown-label">Jersey</span>
            <span class="breakdown-value">$${this._calcPerPlayerBreakdown('jersey').toFixed(2)}</span>
          </div>
          <div class="breakdown-row">
            <span class="breakdown-label">Fee Share</span>
            <span class="breakdown-value">$${this._calcPerPlayerBreakdown('fees').toFixed(2)}</span>
          </div>
          <div class="breakdown-row">
            <span class="breakdown-label">Total Per Player</span>
            <span class="breakdown-value total">$${this.perPlayer}</span>
          </div>
        </div>
      </app-page-wrapper>
    `;
  }
}

customElements.define('page-summary', PageSummary);