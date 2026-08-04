import vegaEmbed from 'https://cdn.jsdelivr.net/npm/vega-embed@6.26.0/+esm';
import { toPng } from 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/+esm';
import { analyzeData } from './analyzer.js';
import { recommendDashboard } from './recommender.js';

class ChartWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
    this._isLoading = false;
    this._error = null;
  }

  static get observedAttributes() {
    return ['data', 'approval-mode', 'api-key', 'dataset-id', 'theme', 'spec', 'chart-config', 'chart-layout', 'layout-mode'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'data') {
      try {
        this._data = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
        this.render();
      } catch(e) {
        console.error('Invalid JSON passed to data attribute');
      }
    } else if (name === 'approval-mode' || name === 'theme' || name === 'spec' || name === 'chart-config' || name === 'chart-layout' || name === 'layout-mode') {
      if (this._data) this.render();
    } else if (name === 'dataset-id' || name === 'api-key') {
      const datasetId = this.getAttribute('dataset-id');
      const apiKey = this.getAttribute('api-key');
      if (datasetId) {
        this._fetchRemoteData(datasetId, apiKey);
      }
    }
  }

  get data() {
    return this._data;
  }

  set data(input) {
    try {
      this._data = typeof input === 'string' ? JSON.parse(input) : input;
      if (this._data && !Array.isArray(this._data)) {
        this._data = [this._data];
      }
      this._error = null;
      this._isLoading = false;
      this.render();
    } catch (err) {
      this._error = 'Failed to parse raw data.';
      this._data = null;
      this.renderError('Data Error', this._error);
    }
  }

  async _fetchRemoteData(datasetId, apiKey) {
    this._isLoading = true;
    this._error = null;
    this.render();

    await new Promise(r => setTimeout(r, 1200));

    if (apiKey !== 'test_key_123') {
      this._isLoading = false;
      this._error = 'Unauthorized: Invalid API Key. Please check your credentials.';
      this._data = null;
      this.renderError('Access Denied', this._error);
      return;
    }

    if (datasetId !== 'ds_999') {
      this._isLoading = false;
      this._error = 'Not Found: The requested dataset ID does not exist.';
      this._data = null;
      this.renderError('Not Found', this._error);
      return;
    }

    // V3 Data: Includes transaction_id (100% cardinality) to test Statistical Profiling!
    this._isLoading = false;
    this._error = null;
    this.data = [
      { transaction_id: 'tx_101', date: '2023-01-01', region: 'North America', sales: 12000, margin: 4000 },
      { transaction_id: 'tx_102', date: '2023-01-01', region: 'EMEA', sales: 15000, margin: 4500 },
      { transaction_id: 'tx_103', date: '2023-02-01', region: 'North America', sales: 13000, margin: 4200 },
      { transaction_id: 'tx_104', date: '2023-02-01', region: 'EMEA', sales: 16000, margin: 4800 },
      { transaction_id: 'tx_105', date: '2023-03-01', region: 'North America', sales: 18000, margin: 6000 },
      { transaction_id: 'tx_106', date: '2023-03-01', region: 'EMEA', sales: 14000, margin: 3800 },
      { transaction_id: 'tx_107', date: '2023-04-01', region: 'North America', sales: 21000, margin: 7000 },
      { transaction_id: 'tx_108', date: '2023-04-01', region: 'EMEA', sales: 19000, margin: 5500 }
    ];
  }

  connectedCallback() {
    this.render();
    
    // Listen for resize to toggle Desktop Canvas vs Mobile Grid
    this._mql = window.matchMedia('(min-width: 900px)');
    this._mqlListener = () => { this.render(); };
    this._mql.addEventListener('change', this._mqlListener);
  }

  disconnectedCallback() {
    if (this._mql) {
      this._mql.removeEventListener('change', this._mqlListener);
    }
  }

  renderError(title, message) {
    this.shadowRoot.innerHTML = `
      <div class="error-container">
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
    `;
  }

  render() {
    this.shadowRoot.innerHTML = '';
    
    // Core styles for the Dashboard Composition & UI
    const style = document.createElement('style');
    style.textContent = `
      :host {
        /* Light Theme (Default) */
        --w-bg: #f8fafc;
        --w-panel-bg: #ffffff;
        --w-border: #e2e8f0;
        --w-border-hover: #cbd5e1;
        --w-text-main: #0f172a;
        --w-text-muted: #64748b;
        --w-hover-bg: #f1f5f9;
        --w-menu-bg: #ffffff;
        --w-kpi-gradient: linear-gradient(90deg, #0f172a, #334155);
        --w-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        --w-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        --w-table-th: #f8fafc;
        --w-table-th-text: #475569;
        --w-table-td: #334155;
        
        display: block;
        padding: 24px;
        background: var(--w-bg); 
        border: 1px solid var(--w-border);
        border-radius: 12px;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        color: var(--w-text-main);
      }
      
      :host([theme="dark"]) {
        /* Dark Theme */
        --w-bg: #0f172a;
        --w-panel-bg: #1e293b;
        --w-border: #334155;
        --w-border-hover: #475569;
        --w-text-main: #f8fafc;
        --w-text-muted: #94a3b8;
        --w-hover-bg: #334155;
        --w-menu-bg: #1e293b;
        --w-kpi-gradient: linear-gradient(90deg, #f8fafc, #e2e8f0);
        --w-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        --w-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        --w-table-th: #0f172a;
        --w-table-th-text: #94a3b8;
        --w-table-td: #e2e8f0;
      }
      
      @media (prefers-color-scheme: dark) {
        :host([theme="auto"]) {
          --w-bg: #0f172a;
          --w-panel-bg: #1e293b;
          --w-border: #334155;
          --w-border-hover: #475569;
          --w-text-main: #f8fafc;
          --w-text-muted: #94a3b8;
          --w-hover-bg: #334155;
          --w-menu-bg: #1e293b;
          --w-kpi-gradient: linear-gradient(90deg, #f8fafc, #e2e8f0);
          --w-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          --w-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
          --w-table-th: #0f172a;
          --w-table-th-text: #94a3b8;
          --w-table-td: #e2e8f0;
        }
      }

      .dashboard-layout {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 24px;
      }
      
      /* Panels and Cards */
      .panel {
        background: var(--w-panel-bg);
        border: 1px solid var(--w-border);
        border-radius: 12px;
        box-shadow: var(--w-shadow);
        padding: 24px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        position: relative; 
      }
      .panel:hover {
        box-shadow: var(--w-shadow-hover);
      }
      
      /* KPI Row */
      .kpi-row {
        grid-column: span 12;
        display: flex;
        gap: 24px;
        flex-wrap: wrap; 
      }
      .kpi-card {
        flex: 1;
        min-width: 200px;
