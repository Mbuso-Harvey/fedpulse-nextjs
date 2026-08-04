                data: chartDef.spec.data,
                config: chartDef.spec.config,
                layer: [
                  baseMark,
                  {
                    mark: { type: 'rule', color: '#ef4444', strokeWidth: 2, strokeDash: [4, 4] },
                    encoding: {
                      y: { aggregate: 'mean', field: fieldToAverage, type: 'quantitative' }
                    }
                  }
                ]
              };
            } else {
              // Already layered, just toggle
              if (chartDef.spec.layer.length > 1) {
                chartDef.spec.layer.pop(); 
              } else {
                const fieldToAverage = chartDef.spec.layer[0].encoding.y.field;
                chartDef.spec.layer.push({
                  mark: { type: 'rule', color: '#ef4444', strokeWidth: 2, strokeDash: [4, 4] },
                  encoding: {
                    y: { aggregate: 'mean', field: fieldToAverage, type: 'quantitative' }
                  }
                });
              }
            }
            renderChart();
          });
        }
      });
    }

    // Render Detail Table
    if (dashboard.tableData && dashboard.tableData.length > 0) {
      const tablePanel = document.createElement('div');
      tablePanel.className = 'panel table-panel';
      tablePanel.style.gridColumn = 'span 12';
      
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'flex-start';
      header.style.marginBottom = '20px';

      const tableTitle = document.createElement('h3');
      tableTitle.className = 'panel-title';
      tableTitle.style.margin = '0';
      tableTitle.textContent = 'Detail Drill-Down';
      header.appendChild(tableTitle);

      const editMenu = document.createElement('div');
      editMenu.className = 'edit-menu';
      editMenu.innerHTML = `
        <details class="vega-actions" style="position:relative; top:0; right:0; box-shadow:none; border:none; z-index:20;">
          <summary>⚙️ Options</summary>
          <div class="vega-actions-menu" style="position:absolute; right:0; top:100%; background:white; border:1px solid #e2e8f0; border-radius:4px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); width:130px;">
            <a href="#" class="btn-hide">Hide Table</a>
            <a href="#" class="btn-export-csv">Save as CSV</a>
          </div>
        </details>
      `;
      header.appendChild(editMenu);
      tablePanel.appendChild(header);

      // Event Listeners for Table Options
      const btnHide = editMenu.querySelector('.btn-hide');
      if (btnHide) {
        btnHide.addEventListener('click', (e) => {
          e.preventDefault();
          tablePanel.style.display = 'none';
        });
      }
      
      const btnExportCsv = editMenu.querySelector('.btn-export-csv');
      if (btnExportCsv) {
        btnExportCsv.addEventListener('click', (e) => {
          e.preventDefault();
          const data = dashboard.tableData;
          if (!data || data.length === 0) return;
          const cols = Object.keys(data[0]);
          const csvLines = [];
          csvLines.push(cols.join(','));
          data.forEach(row => {
            const line = cols.map(col => {
              let val = row[col];
              if (val === null || val === undefined) val = '';
              const strVal = String(val);
              if (strVal.includes(',') || strVal.includes('"')) {
                return '"' + strVal.replace(/"/g, '""') + '"';
              }
              return strVal;
            }).join(',');
            csvLines.push(line);
          });
          const csvString = csvLines.join('\\n');
          const blob = new Blob([csvString], {type: 'text/csv;charset=utf-8'});
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'data.csv';
          link.click();
        });
      }

      const tableWrapper = document.createElement('div');
      tableWrapper.style.overflowX = 'auto';

      const table = document.createElement('table');
      table.className = 'detail-table';
      
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      const cols = Object.keys(dashboard.tableData[0]);
      
      cols.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      dashboard.tableData.forEach(rowData => {
        const tr = document.createElement('tr');
        cols.forEach(col => {
          const td = document.createElement('td');
          const isCurrency = /price|sales|revenue|cost|margin|spend|budget|profit/i.test(col);
          let formattedValue = rowData[col];
          if (typeof rowData[col] === 'number') {
            formattedValue = new Intl.NumberFormat().format(rowData[col]);
            if (isCurrency) formattedValue = '$' + formattedValue;
          }
          td.textContent = formattedValue;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      tableWrapper.appendChild(table);
      tablePanel.appendChild(tableWrapper);
      layout.appendChild(tablePanel);
    }

    const isApprovalMode = this.getAttribute('approval-mode') === 'true';

    if (isApprovalMode) {
      const approvalBar = document.createElement('div');
      approvalBar.className = 'approval-bar';
      
      const approvalText = document.createElement('div');
      approvalText.className = 'approval-text';
      approvalText.innerHTML = '<strong>Founder Mode:</strong> How did the V2 Layout Engine do?';
      
      const btnGroup = document.createElement('div');
      btnGroup.className = 'approval-buttons';

      const approveBtn = document.createElement('button');
      approveBtn.className = 'btn-approve';
      approveBtn.textContent = '👍 Approve Layout';
      
      const rejectBtn = document.createElement('button');
      rejectBtn.className = 'btn-reject';
      rejectBtn.textContent = '👎 Reject';

      const dispatchFeedback = (decision) => {
        const event = new CustomEvent('dashboard-feedback', {
          detail: {
            timestamp: new Date().toISOString(),
            decision: decision,
            inputProfiles: profiles,
            outputDashboard: dashboard
          },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(event);
        
        approvalBar.innerHTML = `<div class="approval-text" style="color: #10b981;"><strong>✓ Feedback successfully logged!</strong> (${decision})</div>`;
      };

      approveBtn.addEventListener('click', () => dispatchFeedback('approved'));
      rejectBtn.addEventListener('click', () => dispatchFeedback('rejected'));

      btnGroup.appendChild(approveBtn);
      btnGroup.appendChild(rejectBtn);
      approvalBar.appendChild(approvalText);
      approvalBar.appendChild(btnGroup);
      
      layout.appendChild(approvalBar);
    }
  }
}

if (!customElements.get('chart-widget')) {
  customElements.define('chart-widget', ChartWidget);
}
