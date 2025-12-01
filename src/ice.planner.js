import { LitElement, html, css } from 'lit';

export class IcePlanner extends LitElement {
  static get properties() {
    return {
      currentPage: { type: String },
      teamName: { type: String },
      logo: { type: String },
      iceCost: { type: Number },
      hours: { type: Number },
      feePct: { type: Number },
      feeFixed: { type: Number },
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
    this.currentPage = 'calculator';
    this.teamName = 'Penn State Champs';
    this.logo = '';
    this.iceCost = 300;
    this.hours = 50;
    this.feePct = 0.02;
    this.feeFixed = 0.99;
    this.coachCost = 3000;
    this.jerseyCost = 88;
    this.players = 1;
    this.totalBase = 0;
    this.totalWithFees = 0;
    this.perPlayer = 0;
    this._storageKey = 'ice-planner-v1';
    this._fromURLOnce = false;
    this._recalc();
  }

  firstUpdated() {
    this._loadFromURL();
    this._loadFromStorage();
    this._initRouting();
  }

  updated(changed) {
    const watched = ['iceCost', 'hours', 'feePct', 'feeFixed', 'coachCost', 'jerseyCost', 'players'];
    if (watched.some((k) => changed.has(k))) {
      this._recalc();
      this._saveToStorage();
      this._writeToURL();
    }
  }

  _initRouting() {
    window.addEventListener('page-changed', () => this._readPageFromURL());
  }

  _readPageFromURL() {
    const sp = new URLSearchParams(window.location.search);
    const page = sp.get('page') || 'calculator';
    if (page !== this.currentPage) {
      this.currentPage = page;
    }
  }

  _loadFromStorage() {
    try {
      const raw = localStorage.getItem(this._storageKey);
      if (raw) {
        Object.assign(this, JSON.parse(raw));
        this._recalc();
      }
    } catch (e) {}
  }

  _saveToStorage() {
    try {
      const data = {
        teamName: this.teamName,
        logo: this.logo,
        iceCost: this.iceCost,
        hours: this.hours,
        feePct: this.feePct,
        feeFixed: this.feeFixed,
        coachCost: this.coachCost,
        jerseyCost: this.jerseyCost,
        players: this.players,
      };
      localStorage.setItem(this._storageKey, JSON.stringify(data));
    } catch (e) {}
  }

  _loadFromURL() {
    if (this._fromURLOnce) return;
    const sp = new URLSearchParams(window.location.search);
    const N = (k, d) => {
      const n = Number(sp.get(k));
      return Number.isFinite(n) ? n : d;
    };
    const S = (k, d) => {
      const v = sp.get(k);
      return v !== null ? v : d;
    };
    if (sp.toString().length > 0) {
      this.teamName = S('team', this.teamName);
      this.logo = S('logo', this.logo);
      this.iceCost = N('ice', this.iceCost);
      this.hours = N('hrs', this.hours);
      this.feePct = N('pct', this.feePct);
      this.feeFixed = N('fix', this.feeFixed);
      this.coachCost = N('coach', this.coachCost);
      this.jerseyCost = N('jersey', this.jerseyCost);
      this.players = Math.max(1, N('players', this.players));
      this.currentPage = S('page', 'calculator');
      this._recalc();
    }
    this._fromURLOnce = true;
  }

  _writeToURL() {
    const sp = new URLSearchParams();
    sp.set('team', this.teamName);
    if (this.logo) sp.set('logo', this.logo);
    sp.set('ice', String(this.iceCost));
    sp.set('hrs', String(this.hours));
    sp.set('pct', String(this.feePct));
    sp.set('fix', String(this.feeFixed));
    sp.set('coach', String(this.coachCost));
    sp.set('jersey', String(this.jerseyCost));
    sp.set('players', String(this.players));
    sp.set('page', String(this.currentPage));
    window.history.replaceState({}, '', `${location.pathname}?${sp.toString()}`);
  }

  _recalc() {
    const base = this.iceCost * this.hours + this.coachCost + this.jerseyCost;
    const withFees = base * (1 + this.feePct) + this.feeFixed;
    const per = withFees / Math.max(1, this.players);
    this.totalBase = Number(base.toFixed(2));
    this.totalWithFees = Number(withFees.toFixed(2));
    this.perPlayer = Number(per.toFixed(2));
  }

  _onChange(field, e) {
    const n = Number(e.detail?.value ?? 0);
    this[field] = Number.isFinite(n) ? n : 0;
  }

  _copyURL() {
    navigator.clipboard?.writeText(window.location.href);
  }

  _renderPage() {
    switch (this.currentPage) {
      case 'summary':
        return html`<page-summary
          .teamName=${this.teamName || ''}
          .logo=${this.logo || ''}
          .totalBase=${this.totalBase || 0}
          .totalWithFees=${this.totalWithFees || 0}
          .perPlayer=${this.perPlayer || 0}
          .players=${this.players || 1}
          .iceCost=${this.iceCost || 0}
          .hours=${this.hours || 0}
          .coachCost=${this.coachCost || 0}
          .jerseyCost=${this.jerseyCost || 0}
        ></page-summary>`;

      case 'settings':
        return html`<page-settings
          .teamName=${this.teamName || ''}
          .logo=${this.logo || ''}
          .feePct=${this.feePct || 0}
          .feeFixed=${this.feeFixed || 0}
          @team-changed=${(e) => (this.teamName = e.detail)}
          @logo-changed=${(e) => (this.logo = e.detail)}
          @fee-pct-changed=${(e) => this._onChange('feePct', e)}
          @fee-fixed-changed=${(e) => this._onChange('feeFixed', e)}
        ></page-settings>`;

      case 'calculator':
      default:
        return html`<page-calculator
          .teamName=${this.teamName || ''}
          .logo=${this.logo || ''}
          .iceCost=${this.iceCost || 0}
          .hours=${this.hours || 0}
          .coachCost=${this.coachCost || 0}
          .jerseyCost=${this.jerseyCost || 0}
          .players=${this.players || 1}
          .totalBase=${this.totalBase || 0}
          .totalWithFees=${this.totalWithFees || 0}
          .perPlayer=${this.perPlayer || 0}
          @ice-changed=${(e) => this._onChange('iceCost', e)}
          @hours-changed=${(e) => this._onChange('hours', e)}
          @coach-changed=${(e) => this._onChange('coachCost', e)}
          @jersey-changed=${(e) => this._onChange('jerseyCost', e)}
          @players-changed=${(e) => this._onChange('players', e)}
          @team-changed=${(e) => (this.teamName = e.detail)}
          @logo-changed=${(e) => (this.logo = e.detail)}
          @copy-url=${() => this._copyURL()}
        ></page-calculator>`;
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    return html` <div class="app">${this._renderPage()}</div> `;
  }
}

customElements.define('ice-planner', IcePlanner);