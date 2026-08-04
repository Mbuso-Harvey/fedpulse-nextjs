    const customSpec = this.getAttribute('spec');
    const layoutConfig = this.getAttribute('chart-layout');
    const chartConfigOverride = this.getAttribute('chart-config');
    
    // CSS Variables for theming
    const computedStyle = getComputedStyle(this);
    const primaryColor = computedStyle.getPropertyValue('--w-chart-primary').trim() || undefined;
    const secondaryColor = computedStyle.getPropertyValue('--w-chart-secondary').trim() || undefined;

    if (customSpec) {
      try {
        const specParsed = JSON.parse(customSpec);
        // Inject our data into the custom spec
        specParsed.data = { values: this._data };
        dashboard = {
          kpis: [],
          charts: [
            {
              id: 'custom-spec',
              title: specParsed.title || 'Custom Visualization',
              score: 999,
              spec: specParsed
            }
          ],
          tableData: []
        };
      } catch (err) {
        console.error('ChartWidget: Failed to parse custom spec JSON.', err);
        dashboard = { kpis: [], charts: [], tableData: [] };
      }
    } else {
      const profiles = analyzeData(this._data);
      dashboard = recommendDashboard(profiles, this._data, { primaryColor, secondaryColor });
    }

    // Apply Config Override
    if (chartConfigOverride) {
      try {
        const parsedConfig = JSON.parse(chartConfigOverride);
        const merge = (target, source) => {
          for (const key of Object.keys(source)) {
            if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
              Object.assign(source[key], merge(target[key], source[key]));
            }
          }
          Object.assign(target || {}, source);
          return target;
        };
        dashboard.charts.forEach(chart => {
          if (!chart.spec.config) chart.spec.config = {};
          merge(chart.spec.config, parsedConfig);
        });
      } catch(err) {
        console.error('Failed to parse chart-config:', err);
      }
    }

    // Apply Layout Override
    if (layoutConfig) {
      try {
        const parsedLayout = JSON.parse(layoutConfig);
        const newCharts = [];
        parsedLayout.forEach(layoutItem => {
          const matchedChart = dashboard.charts.find(c => c.id === layoutItem.id);
          if (matchedChart) {
            matchedChart.spanOverride = layoutItem.span;
            newCharts.push(matchedChart);
          }
        });
        dashboard.charts = newCharts;
      } catch(err) {
        console.error('Failed to parse chart-layout:', err);
      }
    }

    // Global Dashboard Actions (Appears on hover of dashboard)
    const topBar = document.createElement('div');
    topBar.style.gridColumn = 'span 12';
    topBar.style.display = 'flex';
    topBar.style.justifyContent = 'flex-end';
    topBar.style.alignItems = 'center';
    topBar.style.gap = '16px';
    topBar.style.marginBottom = '-10px';
    topBar.style.opacity = '0';
    topBar.style.transition = 'opacity 0.2s';
    
    topBar.innerHTML = `
      <a href="#" class="reset-view" style="color: #94a3b8; text-decoration: none; font-size: 0.8rem; font-weight: 500; transition: color 0.2s;">↺ Reset View</a>
      <details class="vega-actions" style="position:relative; box-shadow:none; border:none; z-index:30;">
        <summary>⚙️ Dashboard Options</summary>
        <div class="vega-actions-menu" style="position:absolute; right:0; top:100%; background:white; border:1px solid #e2e8f0; border-radius:4px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); width:180px;">
          <a href="#" class="btn-export-dash-png">Save Dashboard as PNG</a>
          <a href="#" class="btn-export-dash-json">Download Raw Data (JSON)</a>
        </div>
      </details>
    `;
    layout.appendChild(topBar);

    layout.addEventListener('mouseenter', () => { topBar.style.opacity = '0.5'; });
    layout.addEventListener('mouseleave', () => { topBar.style.opacity = '0'; });
    topBar.addEventListener('mouseenter', () => { topBar.style.opacity = '1'; });
    topBar.addEventListener('mouseleave', () => { topBar.style.opacity = '0.5'; });
    
    topBar.querySelector('.reset-view').addEventListener('click', (e) => {
      e.preventDefault();
      this.render(); 
    });

    topBar.querySelector('.btn-export-dash-png').addEventListener('click', (e) => {
      e.preventDefault();
      topBar.style.visibility = 'hidden'; 
      
      let isDark = this.getAttribute('theme') === 'dark';
      if (this.getAttribute('theme') === 'auto') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      const bgColor = isDark ? '#0f172a' : '#f8fafc';
      
      toPng(layout, { backgroundColor: bgColor, style: { padding: '24px', margin: '-24px' } })
        .then((dataUrl) => {
          topBar.style.visibility = 'visible';
          const link = document.createElement('a');
          link.download = 'dashboard.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          topBar.style.visibility = 'visible';
          console.error('Failed to export dashboard', err);
        });
    });

    topBar.querySelector('.btn-export-dash-json').addEventListener('click', (e) => {
      e.preventDefault();
      const dataStr = JSON.stringify(this._data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'dashboard_data.json';
      link.href = url;
      link.click();
    });

    // Render KPIs
    if (dashboard.kpis.length > 0) {
      const kpiRow = document.createElement('div');
      kpiRow.className = 'kpi-row';
      
      dashboard.kpis.forEach(kpi => {
        const card = document.createElement('div');
        card.className = 'kpi-card';
        card.style.position = 'relative';
        
        const editMenu = document.createElement('div');
        editMenu.className = 'edit-menu';
        editMenu.innerHTML = `
          <details class="vega-actions" style="position:absolute; top:8px; right:8px; box-shadow:none; border:none; z-index:20;">
            <summary>⚙️ Options</summary>
            <div class="vega-actions-menu" style="position:absolute; right:0; top:100%; background:white; border:1px solid #e2e8f0; border-radius:4px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); width:110px;">
              <a href="#" class="btn-hide">Hide KPI</a>
            </div>
          </details>
        `;
        
        const content = document.createElement('div');
        content.innerHTML = `
          <div class="kpi-label">${kpi.label}</div>
          <div class="kpi-value">${kpi.value}</div>
        `;
        
        card.appendChild(editMenu);
        card.appendChild(content);
        
        editMenu.querySelector('.btn-hide').addEventListener('click', (e) => {
          e.preventDefault();
          card.style.display = 'none';
        });
        
        kpiRow.appendChild(card);
      });
      layout.appendChild(kpiRow);
    }

    // --- Responsive Desktop Canvas vs Mobile Grid Logic ---
    const forcedLayoutMode = this.getAttribute('layout-mode') || 'auto';
    const isDesktop = window.innerWidth >= 900;
    const isCustomLayout = !!layoutConfig;

    let useCanvas = false;
    if (forcedLayoutMode === 'canvas') {
      useCanvas = true;
    } else if (forcedLayoutMode === 'grid' || isCustomLayout) {
      useCanvas = false;
    } else {
      useCanvas = isDesktop; // auto mode
    }

    if (useCanvas && dashboard.desktopSpec) {
      // DESKTOP MODE: Cross-Filtered Monolithic Canvas
      const panel = document.createElement('div');
      panel.className = 'panel hero-panel';
      
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.marginBottom = '20px';
      
      const title = document.createElement('h3');
      title.className = 'panel-title';
      title.style.margin = '0';
      title.textContent = 'Interactive Dashboard (Drag to filter)';
      header.appendChild(title);

      const editMenu = document.createElement('div');
      editMenu.className = 'edit-menu';
      editMenu.innerHTML = `
        <details class="vega-actions" style="position:relative; top:0; right:0; box-shadow:none; border:none; z-index:20;">
          <summary>⚙️ Options</summary>
          <div class="vega-actions-menu" style="position:absolute; right:0; top:100%; background:white; border:1px solid #e2e8f0; border-radius:4px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); width:130px;">
            <a href="#" class="btn-fullscreen">Full Screen</a>
