        background: var(--w-panel-bg);
        border: 1px solid var(--w-border);
        border-radius: 12px;
        box-shadow: var(--w-shadow);
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
      }
      .kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--w-shadow-hover);
        border-color: var(--w-border-hover);
      }
      .kpi-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--w-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 8px;
      }
      .kpi-value {
        font-size: 2.5rem;
        font-weight: 700;
        background: var(--w-kpi-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      /* Chart panels */
      .hero-panel { grid-column: span 12; }
      .breakdown-panel { grid-column: span 12; }
      
      @media (min-width: 900px) {
        .hero-panel { grid-column: span 8; }
        .breakdown-panel { grid-column: span 4; }
      }
      
      .panel-title {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--w-text-main);
      }
      .chart-container {
        width: 100%;
        overflow-x: auto;
      }
      .empty-state {
        padding: 40px 20px;
        text-align: center;
        color: var(--w-text-muted);
        background: var(--w-panel-bg);
        border: 2px dashed var(--w-border-hover);
        border-radius: 8px;
        grid-column: span 12;
      }

      /* Vega-Lite Actions Menu & Custom Edit Menu */
      details.vega-actions {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
        font-size: 0.75rem;
      }
      details.vega-actions summary {
        list-style: none;
        padding: 4px 8px;
        cursor: pointer;
        color: var(--w-border-hover);
        opacity: 0; /* Hidden by default */
        transition: color 0.2s, opacity 0.2s, background 0.2s;
        border-radius: 4px;
      }
      .panel:hover details.vega-actions summary,
      .kpi-card:hover details.vega-actions summary {
        opacity: 0.5; /* Appears when hovering over the chart panel or KPI */
      }
      details.vega-actions summary:hover { 
        color: var(--w-text-muted); 
        opacity: 1;
        background: var(--w-hover-bg);
      }
      details.vega-actions summary::-webkit-details-marker { display: none; }
      details.vega-actions .vega-actions-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 4px;
        padding: 4px 0;
        background: var(--w-menu-bg);
        border: 1px solid var(--w-border);
        border-radius: 6px;
        box-shadow: var(--w-shadow-hover);
        min-width: 120px;
      }
      details.vega-actions .vega-actions-menu a {
        display: block;
        padding: 6px 12px;
        text-decoration: none;
        color: var(--w-text-main);
        font-weight: 500;
      }
      details.vega-actions .vega-actions-menu a:hover {
        background: var(--w-hover-bg);
      }

      /* Detail Table */
      .detail-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
        text-align: left;
      }
      .detail-table th {
        background: var(--w-table-th);
        padding: 12px 16px;
        color: var(--w-table-th-text);
        font-weight: 600;
        border-bottom: 2px solid var(--w-border);
        white-space: nowrap;
      }
      .detail-table td {
        padding: 12px 16px;
        border-bottom: 1px solid var(--w-border);
        color: var(--w-table-td);
      }
      .detail-table tr:hover td {
        background: var(--w-hover-bg);
      }
      
      /* Animations */
      .spinner { animation: spin 1s linear infinite; }
      @keyframes spin { 100% { transform: rotate(360deg); } }

      /* Phase 5: Approval UI */
      .approval-bar {
        grid-column: span 12;
        margin-top: 12px;
        padding: 16px 24px;
        background: var(--w-hover-bg);
        border: 1px dashed var(--w-text-muted);
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .approval-text {
        font-size: 0.95rem;
        color: var(--w-text-main);
      }
      .approval-buttons {
        display: flex;
        gap: 12px;
      }
      .btn-approve, .btn-reject {
        font-family: inherit;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        font-size: 0.875rem;
        transition: opacity 0.2s;
      }
      .btn-approve:hover, .btn-reject:hover { opacity: 0.8; }
      .btn-approve { background: #10b981; color: white; }
      .btn-reject { background: #ef4444; color: white; }
    `;
    this.shadowRoot.appendChild(style);

    const layout = document.createElement('div');
    layout.className = 'dashboard-layout';
    this.shadowRoot.appendChild(layout);

    if (this._isLoading) {
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'empty-state';
      loadingMsg.innerHTML = `
        <div style="margin-bottom: 12px; color: #3b82f6;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        </div>
        <strong>Authenticating & Fetching Data...</strong>
      `;
      layout.appendChild(loadingMsg);
      return;
    }

    if (this._error) {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'empty-state';
      errorMsg.style.borderColor = '#ef4444';
      errorMsg.style.background = '#fef2f2';
      errorMsg.innerHTML = `<strong style="color: #ef4444;">Access Denied</strong><br/><br/>${this._error}`;
      layout.appendChild(errorMsg);
      return;
    }

    if (!this._data || this._data.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-state';
      emptyMsg.textContent = 'Awaiting data...';
      layout.appendChild(emptyMsg);
      return;
    }

    let dashboard;
