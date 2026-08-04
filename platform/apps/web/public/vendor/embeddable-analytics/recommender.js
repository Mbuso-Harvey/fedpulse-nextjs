/**
 * Recommends a full dashboard layout based on column profiles and the raw data.
 * V3 Engine: Statistical Profiling & Auto-Scoring Layout.
 * @param {Object} profiles 
 * @param {Array<Object>} data 
 * @param {Object} themeConfig Custom colors for charts
 * @returns {Object} Dashboard spec containing kpis, charts, and tableData
 */
export function recommendDashboard(profiles, data, themeConfig = {}) {
  const keys = Object.keys(profiles);
  
  let dateCol = null;
  let numberCols = [];
  let stringCols = [];

  // 1. Statistical Profiling: Identify column roles
  keys.forEach(key => {
    const p = profiles[key];
    if (p.type === 'date' && !dateCol) {
      dateCol = key;
    } else if (p.type === 'number') {
      numberCols.push(key);
    } else if (p.type === 'string') {
      // Version 2 Profiling Rule: If cardinality ratio is > 0.8, it's an ID, NOT a category!
      // Example: 99 unique values out of 100 rows is an ID.
      if (p.cardinalityRatio < 0.8) {
        stringCols.push({ key, cardinality: p.cardinality });
      }
    }
  });

  // Sort string cols by cardinality ascending (prefer low cardinality)
  stringCols.sort((a, b) => a.cardinality - b.cardinality);

  const dashboard = {
    kpis: [],
    charts: [],
    tableData: []
  };

  if (numberCols.length === 0) {
    return dashboard; 
  }

  // --- KPI Calculation (Support up to 4 metrics) ---
  const kpiCols = numberCols.slice(0, 4);
  kpiCols.forEach(metric => {
    let total = 0;
    data.forEach(row => {
      if (typeof row[metric] === 'number') total += row[metric];
    });
    const isCurrency = /price|sales|revenue|cost|margin|spend|budget|profit/i.test(metric);
    let formattedTotal = new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(total);
    if (isCurrency) {
      formattedTotal = '$' + formattedTotal;
    }
    dashboard.kpis.push({
      label: `Total ${capitalize(metric)}`,
      value: formattedTotal,
      isCurrency // Keep track for table rendering
    });
  });

  const primaryMetric = numberCols[0];
  const secondaryMetric = numberCols.length > 1 ? numberCols[1] : null;
  const primaryCategory = stringCols.length > 0 ? stringCols[0].key : null;
  const secondaryCategory = stringCols.length > 1 ? stringCols[1].key : null;
  
  const isPriCurrency = primaryMetric && /price|sales|revenue|cost|margin|spend|budget|profit/i.test(primaryMetric);
  const isSecCurrency = secondaryMetric && /price|sales|revenue|cost|margin|spend|budget|profit/i.test(secondaryMetric);

  const primaryColor = themeConfig.primaryColor || '#8b5cf6';
  const secondaryColor = themeConfig.secondaryColor || '#f59e0b';
  const tertiaryColor = themeConfig.primaryColor || '#3b82f6';

  // Shared V3 Premium Visual Config
  const premiumConfig = {
    font: 'inherit',
    view: { stroke: 'transparent' },
    axis: { 
      domainColor: '#e2e8f0', 
      tickColor: '#e2e8f0', 
      labelColor: '#64748b', 
      titleColor: '#334155',
      titleFontWeight: 600,
      gridColor: '#f1f5f9',
      gridDash: [4, 4],
      labelFontSize: 11
    },
    legend: { labelColor: '#475569', titleColor: '#334155', titleFontWeight: 600 }
  };

  // --- Auto-Scoring Layout Engine ---
  // Generate all possible valid charts, score them, and sort.
  let candidateCharts = [];

  // A. Time Series (Score: 100 - Always the most important if it exists)
  if (dateCol) {
    const encoding = {
      x: { field: dateCol, type: 'temporal', axis: { title: capitalize(dateCol), grid: false } },
      y: { aggregate: 'sum', field: primaryMetric, type: 'quantitative', axis: { title: `Sum of ${primaryMetric}`, format: isPriCurrency ? "$.2s" : ".2s" } },
      tooltip: [
        { field: dateCol, type: 'temporal', title: 'Date' },
        { aggregate: 'sum', field: primaryMetric, type: 'quantitative', title: capitalize(primaryMetric), format: isPriCurrency ? "$,.0f" : ",.0f" }
      ]
    };
    if (primaryCategory && stringCols[0].cardinality <= 7) {
      encoding.color = { field: primaryCategory, type: 'nominal', title: capitalize(primaryCategory) };
      encoding.tooltip.push({ field: primaryCategory, type: 'nominal', title: 'Category' });
    }
    candidateCharts.push({
      id: 'chart-time-series',
      title: `${capitalize(primaryMetric)} Trend`,
      score: 100,
      spec: {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container', height: 320, data: { values: data },
        mark: { type: 'line', point: true, strokeWidth: 3, interpolate: 'monotone' },
        encoding: encoding, config: premiumConfig
      }
    });
  }

  // B. Correlation Scatter Plot (Score: 90 if no date, 70 if date exists)
  if (secondaryMetric) {
    candidateCharts.push({
      id: 'chart-scatter',
      title: `${capitalize(primaryMetric)} vs ${capitalize(secondaryMetric)}`,
      score: dateCol ? 70 : 90,
      spec: {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container', height: 300, data: { values: data },
        mark: { type: 'point', size: 100, filled: true, opacity: 0.7 },
        encoding: {
          x: { field: primaryMetric, type: 'quantitative', axis: { title: capitalize(primaryMetric), format: isPriCurrency ? "$.2s" : ".2s" } },
          y: { field: secondaryMetric, type: 'quantitative', axis: { title: capitalize(secondaryMetric), format: isSecCurrency ? "$.2s" : ".2s" } },
          color: primaryCategory ? { field: primaryCategory, type: 'nominal' } : undefined,
          tooltip: [
            { field: primaryMetric, type: 'quantitative', title: capitalize(primaryMetric), format: isPriCurrency ? "$,.0f" : ",.0f" },
            { field: secondaryMetric, type: 'quantitative', title: capitalize(secondaryMetric), format: isSecCurrency ? "$,.0f" : ",.0f" },
            ...(primaryCategory ? [{ field: primaryCategory, type: 'nominal', title: 'Category' }] : [])
          ]
        }, config: premiumConfig
      }
    });
  }

  // C. Primary Category Breakdown (Score: 85)
  if (primaryCategory) {
    candidateCharts.push({
      id: 'chart-breakdown-primary',
      title: `${capitalize(primaryMetric)} by ${capitalize(primaryCategory)}`,
      score: 85,
      spec: {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container', height: 250, data: { values: data },
        mark: { type: 'bar', color: primaryColor, cornerRadiusEnd: 4 },
        encoding: {
          x: { field: primaryCategory, type: 'nominal', sort: '-y', axis: { title: null, labelAngle: -45, grid: false } },
          y: { aggregate: 'sum', field: primaryMetric, type: 'quantitative', axis: { title: `Sum of ${primaryMetric}`, format: isPriCurrency ? "$.2s" : ".2s" } },
          tooltip: [
            { field: primaryCategory, type: 'nominal', title: 'Category' },
            { aggregate: 'sum', field: primaryMetric, type: 'quantitative', title: capitalize(primaryMetric), format: isPriCurrency ? "$,.0f" : ",.0f" }
          ]
        }, config: premiumConfig
      }
    });
  }

  // D. Secondary Category Breakdown (Score: 60)
  if (secondaryCategory) {
    candidateCharts.push({
      id: 'chart-breakdown-secondary',
      title: `${capitalize(primaryMetric)} by ${capitalize(secondaryCategory)}`,
      score: 60,
      spec: {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container', height: 250, data: { values: data },
        mark: { type: 'bar', color: secondaryColor, cornerRadiusEnd: 4 },
        encoding: {
          x: { field: secondaryCategory, type: 'nominal', sort: '-y', axis: { title: null, labelAngle: -45, grid: false } },
          y: { aggregate: 'sum', field: primaryMetric, type: 'quantitative', axis: { title: `Sum of ${primaryMetric}`, format: isPriCurrency ? "$.2s" : ".2s" } },
          tooltip: [
            { field: secondaryCategory, type: 'nominal', title: 'Category' },
            { aggregate: 'sum', field: primaryMetric, type: 'quantitative', title: capitalize(primaryMetric), format: isPriCurrency ? "$,.0f" : ",.0f" }
          ]
        }, config: premiumConfig
      }
    });
  }

  // E. Histogram Distribution (Score: 65)
  if (primaryMetric && !dateCol) {
    candidateCharts.push({
      id: 'chart-histogram',
      title: `${capitalize(primaryMetric)} Distribution`,
      score: 65,
      spec: {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container', height: 250, data: { values: data },
        mark: { type: 'bar', color: tertiaryColor, cornerRadiusEnd: 4 },
        encoding: {
          x: { bin: true, field: primaryMetric, type: 'quantitative', axis: { title: capitalize(primaryMetric), grid: false, format: isPriCurrency ? "$.2s" : undefined } },
          y: { aggregate: 'count', type: 'quantitative', axis: { title: 'Frequency', format: ".2s" } },
          tooltip: [
            { field: primaryMetric, type: 'quantitative', title: capitalize(primaryMetric), bin: true, format: isPriCurrency ? "$,.0f" : undefined },
            { aggregate: 'count', type: 'quantitative', title: 'Count' }
          ]
        }, config: premiumConfig
      }
    });
  }

  // F. Heatmap (Score: 80)
  if (primaryCategory && secondaryCategory) {
    candidateCharts.push({
      id: 'chart-heatmap',
      title: `${capitalize(primaryMetric)} by ${capitalize(primaryCategory)} & ${capitalize(secondaryCategory)}`,
      score: 80,
      spec: {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container', height: 300, data: { values: data },
        mark: { type: 'rect', cornerRadius: 4 },
        encoding: {
          x: { field: primaryCategory, type: 'nominal', axis: { title: capitalize(primaryCategory), labelAngle: -45, grid: false } },
          y: { field: secondaryCategory, type: 'nominal', axis: { title: capitalize(secondaryCategory), grid: false } },
          color: { aggregate: 'sum', field: primaryMetric, type: 'quantitative', title: capitalize(primaryMetric), scale: { scheme: 'blues' } },
          tooltip: [
            { field: primaryCategory, type: 'nominal', title: capitalize(primaryCategory) },
            { field: secondaryCategory, type: 'nominal', title: capitalize(secondaryCategory) },
            { aggregate: 'sum', field: primaryMetric, type: 'quantitative', title: capitalize(primaryMetric), format: isPriCurrency ? "$,.0f" : ",.0f" }
          ]
        }, config: premiumConfig
      }
    });
  }

  candidateCharts.sort((a, b) => b.score - a.score);
  dashboard.charts = candidateCharts;

  const sortedData = [...data].sort((a, b) => (b[primaryMetric] || 0) - (a[primaryMetric] || 0));
  dashboard.tableData = sortedData.slice(0, 25);

  if (dashboard.charts.length >= 3) {
    const tsChart = JSON.parse(JSON.stringify(dashboard.charts[0].spec));
    const scatterChart = JSON.parse(JSON.stringify(dashboard.charts[1].spec));
    const barChart = JSON.parse(JSON.stringify(dashboard.charts[2].spec));

    [tsChart, scatterChart, barChart].forEach(spec => {
      delete spec.$schema;
      delete spec.data;
      delete spec.config;
    });

    tsChart.title = dashboard.charts[0].title;
    scatterChart.title = dashboard.charts[1].title;

    tsChart.width = 750;
    tsChart.height = 250;
    scatterChart.width = 350;
    scatterChart.height = 250;

    scatterChart.params = [{
      "name": "scatter_click",
      "select": {"type": "point", "toggle": true, "clear": "dblclick"}
    }];
    scatterChart.encoding.opacity = {
      condition: { param: "bar_click", value: 1 },
      value: 0.1
    };

    barChart.params = [{
      "name": "bar_click",
      "select": {"type": "point", "fields": [primaryCategory], "toggle": true, "clear": "dblclick"}
    }];
    const originalColor = barChart.encoding.color || { value: tertiaryColor };
    barChart.encoding.color = {
      condition: { param: "scatter_click", ...originalColor },
      value: "#e2e8f0"
    };
    tsChart.transform = [{"filter": {"param": "bar_click"}}];

    dashboard.desktopSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { values: data },
      config: { ...premiumConfig, concat: { spacing: 60 } },
      vconcat: [
        tsChart,
        { hconcat: [barChart, scatterChart] }
      ]
    };
  }

  return dashboard;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
