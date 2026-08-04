          </div>
        </details>
      `;
      header.appendChild(editMenu);
      panel.appendChild(header);

      const chartContainer = document.createElement('div');
      chartContainer.className = 'chart-container';
      
      // Fullscreen event listener
      const btnFullscreen = editMenu.querySelector('.btn-fullscreen');
      btnFullscreen.addEventListener('click', (e) => {
        e.preventDefault();
        if (!document.fullscreenElement) {
          panel.requestFullscreen().catch(err => console.error(err));
        } else {
          document.exitFullscreen();
        }
      });
      // Center the unified canvas
      chartContainer.style.display = 'flex';
      chartContainer.style.justifyContent = 'center';
      panel.appendChild(chartContainer);
      layout.appendChild(panel);

      let isDark = this.getAttribute('theme') === 'dark';
      if (this.getAttribute('theme') === 'auto') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      // Apply config override to desktop spec if exists
      if (chartConfigOverride) {
        try {
          const parsedConfig = JSON.parse(chartConfigOverride);
          if (!dashboard.desktopSpec.config) dashboard.desktopSpec.config = {};
          Object.assign(dashboard.desktopSpec.config, parsedConfig);
        } catch(e) {}
      }

      vegaEmbed(chartContainer, dashboard.desktopSpec, {
        actions: false,
        theme: isDark ? 'dark' : 'quartz'
      }).catch(console.error);

    } else {
      // MOBILE / CUSTOM GRID MODE: Separated Scrolling Panels
      dashboard.charts.forEach((chartDef, index) => {
        const panel = document.createElement('div');
        
        // Dynamic Layout Scoring Logic
        if (chartDef.spanOverride) {
           panel.className = 'panel';
           panel.style.gridColumn = `span ${chartDef.spanOverride}`;
        } else if (index === 0) {
           // Highest scored chart gets Hero treatment
           panel.className = `panel hero-panel`;
        } else {
           // Subsequent charts get Breakdown treatment
           panel.className = `panel breakdown-panel`;
        }
        
        // Panel Header with Title and Edit Menu
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'flex-start';
        header.style.marginBottom = '20px';

        const title = document.createElement('h3');
        title.className = 'panel-title';
        title.style.margin = '0';
        title.textContent = chartDef.title;
        header.appendChild(title);

        // --- V3: Light Editing UI ---
        const editMenu = document.createElement('div');
        editMenu.className = 'edit-menu';
        editMenu.innerHTML = `
          <details class="vega-actions" style="position:relative; top:0; right:0; box-shadow:none; border:none; z-index:20;">
            <summary>⚙️ Options</summary>
            <div class="vega-actions-menu" style="position:absolute; right:0; top:100%; background:white; border:1px solid #e2e8f0; border-radius:4px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); width:130px;">
              <a href="#" class="btn-fullscreen">Full Screen</a>
              <a href="#" class="btn-hide">Hide Chart</a>
              ${chartDef.spec.mark?.type === 'bar' ? '<a href="#" class="btn-swap-donut">Swap to Donut</a>' : ''}
              ${chartDef.spec.mark?.type === 'line' ? '<a href="#" class="btn-swap-area">Swap to Area</a>' : ''}
              ${['bar', 'line', 'area'].includes(chartDef.spec.mark?.type) || chartDef.spec.layer ? '<a href="#" class="btn-toggle-avg">Toggle Average Line</a>' : ''}
              <a href="#" class="btn-export-png">Save as PNG</a>
              <a href="#" class="btn-export-svg">Save as SVG</a>
            </div>
          </details>
        `;
        header.appendChild(editMenu);
        panel.appendChild(header);

        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        panel.appendChild(chartContainer);
        layout.appendChild(panel);

        const renderChart = () => {
          let isDark = this.getAttribute('theme') === 'dark';
          if (this.getAttribute('theme') === 'auto') {
            isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          }

          vegaEmbed(chartContainer, chartDef.spec, {
            actions: false, // Disable native Vega actions so we only have ONE clean menu
            theme: isDark ? 'dark' : 'quartz'
          }).then(result => {
            chartDef.view = result.view;
          }).catch(console.error);
        };
        
        renderChart();

        // Edit Event Listeners
        const btnFullscreen = editMenu.querySelector('.btn-fullscreen');
        if (btnFullscreen) {
          btnFullscreen.addEventListener('click', (e) => {
            e.preventDefault();
            if (!document.fullscreenElement) {
              panel.requestFullscreen().catch(err => console.error(err));
            } else {
              document.exitFullscreen();
            }
          });
        }

        const btnHide = editMenu.querySelector('.btn-hide');
        if (btnHide) {
          btnHide.addEventListener('click', (e) => {
            e.preventDefault();
            panel.style.display = 'none';
          });
        }
        
        const btnExportPng = editMenu.querySelector('.btn-export-png');
        if (btnExportPng) {
          btnExportPng.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!chartDef.view) return;
            const url = await chartDef.view.toImageURL('png');
            const link = document.createElement('a');
            link.href = url;
            link.download = 'chart.png';
            link.click();
          });
        }

        const btnExportSvg = editMenu.querySelector('.btn-export-svg');
        if (btnExportSvg) {
          btnExportSvg.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!chartDef.view) return;
            const svg = await chartDef.view.toSVG();
            const blob = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'chart.svg';
            link.click();
          });
        }

        const btnSwapDonut = editMenu.querySelector('.btn-swap-donut');
        if (btnSwapDonut) {
          btnSwapDonut.addEventListener('click', (e) => {
            e.preventDefault();
            chartDef.spec.mark = { type: 'arc', innerRadius: 50 };
            const oldY = chartDef.spec.encoding.y;
            const oldX = chartDef.spec.encoding.x;
            
            const newTheta = { ...oldY };
            delete newTheta.axis;
            delete newTheta.sort;
            
            const newColor = { ...oldX };
            delete newColor.axis;
            delete newColor.sort;
            
            chartDef.spec.encoding = {
              theta: newTheta,
              color: newColor,
              tooltip: oldX ? [oldX, oldY] : [oldY]
            };
            renderChart();
            btnSwapDonut.style.display = 'none';
          });
        }
        const btnSwapArea = editMenu.querySelector('.btn-swap-area');
        if (btnSwapArea) {
          btnSwapArea.addEventListener('click', (e) => {
            e.preventDefault();
            chartDef.spec.mark.type = 'area';
            chartDef.spec.mark.opacity = 0.4;
            renderChart();
            btnSwapArea.style.display = 'none';
          });
        }

        const btnToggleAvg = editMenu.querySelector('.btn-toggle-avg');
        if (btnToggleAvg) {
          btnToggleAvg.addEventListener('click', (e) => {
            e.preventDefault();
            if (!chartDef.spec.layer) {
              // First time: convert mark to layer
              const baseMark = { ...chartDef.spec };
              delete baseMark.$schema;
              delete baseMark.width;
              delete baseMark.height;
              delete baseMark.data;
              delete baseMark.config;
              delete baseMark.title;
              
              const fieldToAverage = baseMark.encoding.y.field;
              
              chartDef.spec = {
                $schema: chartDef.spec.$schema,
                width: chartDef.spec.width,
                height: chartDef.spec.height,
