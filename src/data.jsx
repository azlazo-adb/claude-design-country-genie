// === Mock data for the Country Genie prototype ===

const PUBLISHERS = [
  { id: 'adb', name: 'ADB Curated', short: 'ADB', color: '#7b8cff', desc: 'ADB-curated default (aggregated across SPI, Pre-PSA, CRiMson).' },
  { id: 'spi', name: 'SPI', short: 'SPI', color: '#4dd9c4', desc: 'Strategy, Policy & Partnerships indicators.' },
  { id: 'prepsa', name: 'Pre-PSA', short: 'Pre-PSA', color: '#f5b252', desc: 'Pre-Programmatic Sector Assessment dataset.' },
  { id: 'crimson', name: 'CRiMson', short: 'CRiMson', color: '#ef5876', desc: 'Country Risk Monitoring System.' },
];

const DIMENSIONS = [
  { id: 'economic', label: 'Economic', icon: 'chart', risk: 'very high', color: '#7b8cff' },
  { id: 'social', label: 'Social', icon: 'users', risk: 'high', color: '#c39bff' },
  { id: 'environmental', label: 'Environmental', icon: 'leaf', risk: 'moderate', color: '#4dd9c4' },
  { id: 'institutional', label: 'Institutional', icon: 'building', risk: 'high', color: '#f5b252' },
  { id: 'political', label: 'Political', icon: 'flag', risk: 'moderate', color: '#ef5876' },
  { id: 'structural', label: 'Structural', icon: 'network', risk: 'low', color: '#7ad7ff' },
];

// Country roster — South Asia DMCs
const COUNTRIES = {
  pakistan: {
    code: 'PAK', name: 'Pakistan', region: 'South Asia', income: 'Lower-middle income',
    population: '235.8M', gdp: '$338B', flag: '🇵🇰',
    dimensions: {
      economic: { risk: 'very high', summary: 'Balance of payments crisis with high inflation and debt distress requiring IMF support.' },
      social: { risk: 'high', summary: 'High poverty incidence and gender disparities, particularly in education and labor force participation.' },
      environmental: { risk: 'moderate', summary: 'Acute climate vulnerability from glacial melt, monsoon variability, and 2022 flood recovery.' },
      institutional: { risk: 'high', summary: 'Governance and PFM reforms underway; weak revenue mobilization and SOE performance.' },
      political: { risk: 'moderate', summary: 'Coalition government navigating elections aftermath; fiscal consolidation contested.' },
      structural: { risk: 'low', summary: 'Demographic dividend potential; energy mix shifting toward renewables.' },
    },
  },
  india: {
    code: 'IND', name: 'India', region: 'South Asia', income: 'Lower-middle income',
    population: '1.43B', gdp: '$3.7T', flag: '🇮🇳',
    dimensions: {
      economic: { risk: 'low', summary: 'Strong growth momentum with macro stability; ranked among fastest-growing major economies.' },
      social: { risk: 'moderate', summary: 'Persistent poverty and informality; uneven gains across states.' },
      environmental: { risk: 'high', summary: 'Air quality and water stress acute; aggressive renewables targets.' },
      institutional: { risk: 'low', summary: 'Strong digital public infrastructure; PFM modernization advanced.' },
      political: { risk: 'low', summary: 'Stable mandate; reform agenda continuing.' },
      structural: { risk: 'low', summary: 'Demographic dividend, services-led economy, growing manufacturing.' },
    },
  },
  bangladesh: {
    code: 'BGD', name: 'Bangladesh', region: 'South Asia', income: 'Lower-middle income',
    population: '173M', gdp: '$460B', flag: '🇧🇩',
    dimensions: {
      economic: { risk: 'high', summary: 'External buffers under pressure; IMF program supporting stabilization.' },
      social: { risk: 'moderate', summary: 'Strong human development gains; gender parity in education improving.' },
      environmental: { risk: 'very high', summary: 'Highly exposed to sea-level rise and cyclones; delta vulnerability.' },
      institutional: { risk: 'moderate', summary: 'PFM reforms underway; banking sector NPLs elevated.' },
      political: { risk: 'high', summary: 'Recent political transition; reform direction in flux.' },
      structural: { risk: 'moderate', summary: 'RMG export concentration; diversification needed.' },
    },
  },
  nepal: {
    code: 'NPL', name: 'Nepal', region: 'South Asia', income: 'Lower-middle income',
    population: '30.5M', gdp: '$41B', flag: '🇳🇵',
    dimensions: {
      economic: { risk: 'moderate', summary: 'Remittance-dependent; growth recovering post-pandemic and post-earthquake.' },
      social: { risk: 'moderate', summary: 'Steady HDI gains; outmigration shaping labor market.' },
      environmental: { risk: 'high', summary: 'Glacial retreat and seismic exposure; hydropower opportunity.' },
      institutional: { risk: 'high', summary: 'Federal transition still consolidating; capacity gaps at provincial level.' },
      political: { risk: 'high', summary: 'Coalition fragility; frequent government changes.' },
      structural: { risk: 'moderate', summary: 'Energy export potential via hydropower; tourism rebounding.' },
    },
  },
  srilanka: {
    code: 'LKA', name: 'Sri Lanka', region: 'South Asia', income: 'Lower-middle income',
    population: '21.9M', gdp: '$84B', flag: '🇱🇰',
    dimensions: {
      economic: { risk: 'very high', summary: 'Recovering from sovereign default; IMF EFF anchoring stabilization.' },
      social: { risk: 'high', summary: 'Poverty doubled during crisis; food insecurity elevated.' },
      environmental: { risk: 'moderate', summary: 'Coastal exposure and biodiversity richness.' },
      institutional: { risk: 'moderate', summary: 'Governance reforms tied to IMF program; SOE restructuring.' },
      political: { risk: 'high', summary: 'New administration recalibrating reform pace.' },
      structural: { risk: 'moderate', summary: 'Tourism rebound; export diversification ongoing.' },
    },
  },
  bhutan: {
    code: 'BTN', name: 'Bhutan', region: 'South Asia', income: 'Lower-middle income',
    population: '0.79M', gdp: '$2.9B', flag: '🇧🇹',
    dimensions: {
      economic: { risk: 'moderate', summary: 'Hydropower-driven; narrow base; Gelephu Mindfulness City prospects.' },
      social: { risk: 'low', summary: 'High HDI relative to peers; GNH framework.' },
      environmental: { risk: 'moderate', summary: 'Carbon-negative; glacial lake outburst risk.' },
      institutional: { risk: 'low', summary: 'Strong governance scores for the region.' },
      political: { risk: 'low', summary: 'Stable; fifth elected parliament in 2024.' },
      structural: { risk: 'moderate', summary: 'Outmigration of skilled labor; small market.' },
    },
  },
};

// Detailed indicators per dimension — used in drilldown
const INDICATORS = {
  economic: [
    { id: 'gdp_growth', name: 'GDP Growth Rate', desc: 'Real GDP growth, constant prices', unit: '%', year: 2023,
      values: { adb: -0.2, spi: -0.2, prepsa: -0.2 }, source_default: 'prepsa', sources: ['IMF WEO Oct 2024', 'World Bank WDI 2024'],
      sparkline: [3.1, 5.7, 6.5, -0.9, -0.2, 2.4],
      sub: [{name:'Agriculture', val:1.6}, {name:'Industry', val:-3.4}, {name:'Services', val:0.2}] },
    { id: 'cpi', name: 'Inflation Rate (CPI)', desc: 'Consumer price index, average annual change', unit: '%', year: 2023,
      values: { adb: 29.2, spi: 29.4, prepsa: 29.2 }, source_default: 'prepsa', sources: ['IMF WEO Oct 2024'],
      sparkline: [3.9, 9.7, 10.7, 19.9, 29.2, 23.4] },
    { id: 'debt_gdp', name: 'Debt-to-GDP Ratio', desc: 'General government gross debt as % of GDP', unit: '%', year: 2023,
      values: { adb: 77.5, spi: 77.5, prepsa: 75.6 }, source_default: 'prepsa', sources: ['IMF WEO Oct 2024'],
      sparkline: [85.4, 86.1, 76.7, 73.7, 77.5, 70.4],
      sub: [{name:'Domestic debt', val:48.7}, {name:'External debt', val:28.8}] },
    { id: 'fiscal_balance', name: 'Fiscal Balance', desc: 'General government net lending/borrowing', unit: '% of GDP', year: 2023,
      values: { adb: -7.5, spi: -7.7, prepsa: -7.5 }, source_default: 'prepsa', sources: ['IMF WEO Oct 2024'],
      sparkline: [-8.1, -8.0, -6.0, -7.9, -7.5, -6.8] },
    { id: 'cab', name: 'Current Account Balance', desc: 'Current account balance as % of GDP', unit: '% of GDP', year: 2023,
      values: { adb: -0.8, spi: -0.7, prepsa: -0.8 }, source_default: 'prepsa', sources: ['IMF WEO Oct 2024'],
      sparkline: [-1.7, -1.7, -0.8, -4.7, -0.8, -0.9] },
    { id: 'fx_reserves', name: 'Foreign Exchange Reserves', desc: 'Reserve assets in months of import coverage', unit: 'months', year: 2023,
      values: { adb: 1.3, spi: 1.5, prepsa: 1.3 }, source_default: 'adb', sources: ['State Bank of Pakistan'],
      sparkline: [3.0, 3.6, 4.0, 1.0, 1.3, 1.9] },
  ],
  social: [
    { id: 'poverty', name: 'Poverty Rate', desc: 'Share of population below national poverty line', unit: '%', year: 2023,
      values: { adb: 21.9, spi: 21.4, crimson: 22.1 }, source_default: 'spi', sources: ['World Bank WDI 2024'],
      sparkline: [24.3, 24.1, 21.9, 23.6, 21.9, 20.7] },
    { id: 'gini', name: 'Gini Index', desc: 'Income inequality (0–100)', unit: '', year: 2022,
      values: { adb: 29.6, spi: 29.6 }, source_default: 'spi', sources: ['World Bank WDI 2024'],
      sparkline: [31.6, 31.6, 29.6, 29.6, 29.6, 29.4] },
    { id: 'hdi', name: 'HDI Rank', desc: 'Human Development Index rank (out of 193)', unit: '', year: 2023,
      values: { adb: 161, crimson: 161 }, source_default: 'crimson', sources: ['UNDP HDR 2024'],
      sparkline: [154, 154, 161, 161, 161, 161] },
    { id: 'gender_gap', name: 'Gender Gap Index', desc: 'WEF Global Gender Gap rank', unit: '/146', year: 2024,
      values: { adb: 142, crimson: 142 }, source_default: 'crimson', sources: ['WEF Global Gender Gap Report 2024'],
      sparkline: [151, 145, 145, 142, 142, 142] },
    { id: 'literacy', name: 'Adult Literacy', desc: 'Adults aged 15+ who can read & write', unit: '%', year: 2023,
      values: { adb: 58.0, spi: 58.0, crimson: 58.4 }, source_default: 'spi', sources: ['UNESCO UIS'],
      sparkline: [56.4, 57.0, 58.0, 58.0, 58.0, 58.5] },
    { id: 'health_exp', name: 'Health Expenditure', desc: 'Current health expenditure as % of GDP', unit: '% of GDP', year: 2023,
      values: { adb: 2.9, spi: 2.9, spi: 2.95 }, source_default: 'spi', sources: ['WHO GHO'],
      sparkline: [2.7, 2.9, 2.9, 2.9, 2.9, 3.1] },
  ],
  environmental: [
    { id: 'climate_risk', name: 'Climate Risk Index', desc: 'Germanwatch CRI rank (lower rank = higher exposure)', unit: 'rank', year: 2023,
      values: { adb: 8, spi: 8, crimson: 9 }, source_default: 'adb', sources: ['Germanwatch Global Climate Risk Index 2024'],
      sparkline: [22, 18, 8, 8, 8, 12],
      sub: [{name:'Lives lost (avg/yr)', val:502}, {name:'Losses (USD M, PPP)', val:3772}, {name:'Losses % GDP', val:0.52}] },
    { id: 'co2', name: 'CO₂ Emissions per Capita', desc: 'Metric tons CO₂ per person, energy-related', unit: 't', year: 2023,
      values: { adb: 1.0, spi: 1.0, prepsa: 1.1 }, source_default: 'spi', sources: ['World Bank WDI 2024', 'IEA Energy Statistics'],
      sparkline: [0.8, 0.9, 1.0, 1.0, 1.0, 1.1] },
    { id: 'renewables', name: 'Renewable Energy Share', desc: 'Share of renewables in total final energy consumption', unit: '%', year: 2023,
      values: { adb: 46.1, spi: 46.1, prepsa: 45.8 }, source_default: 'adb', sources: ['IRENA Renewable Capacity Statistics 2024', 'IEA SDG7 Tracking'],
      sparkline: [45.4, 45.7, 46.0, 45.9, 46.1, 47.0],
      sub: [{name:'Hydropower', val:28.4}, {name:'Bioenergy', val:14.2}, {name:'Solar', val:2.9}, {name:'Wind', val:0.6}] },
    { id: 'water_stress', name: 'Water Stress Level', desc: 'Freshwater withdrawal as % of available resources', unit: '%', year: 2022,
      values: { adb: 81.0, spi: 81.0 }, source_default: 'spi', sources: ['FAO AQUASTAT', 'WRI Aqueduct'],
      sparkline: [74, 76, 78, 79, 81, 82] },
    { id: 'forest_cover', name: 'Forest Area', desc: 'Forest cover as % of land area', unit: '%', year: 2023,
      values: { adb: 4.8, spi: 4.8, crimson: 4.7 }, source_default: 'spi', sources: ['FAO FRA 2020', 'World Bank WDI'],
      sparkline: [5.1, 5.0, 4.9, 4.9, 4.8, 4.8] },
    { id: 'pm25', name: 'Ambient PM2.5 Exposure', desc: 'Population-weighted annual mean concentration', unit: 'µg/m³', year: 2022,
      values: { adb: 56.4, spi: 56.4, crimson: 58.1 }, source_default: 'crimson', sources: ['WHO Global Ambient Air Quality Database 2024'],
      sparkline: [58.5, 56.9, 57.3, 55.2, 56.4, 54.1] },
  ],
  institutional: [
    { id: 'gov_effectiveness', name: 'Government Effectiveness', desc: 'WGI percentile rank (0 = weakest, 100 = strongest)', unit: 'pctile', year: 2023,
      values: { adb: 27.4, spi: 27.4, crimson: 28.1 }, source_default: 'spi', sources: ['World Bank Worldwide Governance Indicators 2024'],
      sparkline: [29.8, 28.3, 27.9, 27.4, 27.4, 28.6],
      sub: [{name:'Policy quality', val:25.0}, {name:'Service delivery', val:29.3}, {name:'Civil service', val:27.8}] },
    { id: 'corruption', name: 'Control of Corruption', desc: 'WGI percentile rank (0 = weakest, 100 = strongest)', unit: 'pctile', year: 2023,
      values: { adb: 23.6, spi: 23.6, crimson: 24.0 }, source_default: 'spi', sources: ['World Bank WGI 2024', 'Transparency International CPI 2024'],
      sparkline: [27.4, 26.0, 24.5, 23.6, 23.6, 22.9] },
    { id: 'rule_of_law', name: 'Rule of Law', desc: 'WGI percentile rank (0 = weakest, 100 = strongest)', unit: 'pctile', year: 2023,
      values: { adb: 25.0, spi: 25.0 }, source_default: 'spi', sources: ['World Bank WGI 2024'],
      sparkline: [27.4, 25.9, 25.5, 25.5, 25.0, 25.5] },
    { id: 'tax_gdp', name: 'Tax Revenue / GDP', desc: 'General government tax revenue as % of GDP', unit: '%', year: 2023,
      values: { adb: 10.4, spi: 10.4, prepsa: 10.6 }, source_default: 'prepsa', sources: ['IMF Government Finance Statistics', 'FBR Pakistan Annual Report 2023-24'],
      sparkline: [11.7, 9.6, 10.1, 10.0, 10.4, 11.1],
      sub: [{name:'Income tax', val:4.2}, {name:'Sales tax', val:3.4}, {name:'Customs', val:1.5}, {name:'Other', val:1.3}] },
    { id: 'pefa', name: 'PEFA PFM Score', desc: 'Public Expenditure & Financial Accountability average score (A=4, D=1)', unit: '/4', year: 2023,
      values: { adb: 2.4, spi: 2.4 }, source_default: 'adb', sources: ['PEFA Secretariat Assessment 2023'],
      sparkline: [2.2, 2.2, 2.3, 2.3, 2.4, 2.4] },
    { id: 'ease_business', name: 'Business Ready Score', desc: 'World Bank B-READY composite (0–100)', unit: '/100', year: 2024,
      values: { adb: 54.2, spi: 54.2, crimson: 54.0 }, source_default: 'spi', sources: ['World Bank Business Ready 2024'],
      sparkline: [52.6, 53.4, 53.8, 54.0, 54.2, 55.7] },
  ],
  political: [
    { id: 'fragility', name: 'Fragile States Index', desc: 'FFP composite, higher = more fragile (0–120)', unit: '', year: 2024,
      values: { adb: 86.6, spi: 86.6, crimson: 87.1 }, source_default: 'crimson', sources: ['Fund for Peace Fragile States Index 2024'],
      sparkline: [88.6, 87.4, 86.7, 87.0, 86.6, 85.9],
      sub: [{name:'Security apparatus', val:9.1}, {name:'Group grievance', val:9.0}, {name:'State legitimacy', val:8.2}, {name:'Public services', val:8.4}] },
    { id: 'pol_stability', name: 'Political Stability', desc: 'WGI Political Stability & Absence of Violence percentile', unit: 'pctile', year: 2023,
      values: { adb: 7.5, spi: 7.5, crimson: 8.0 }, source_default: 'crimson', sources: ['World Bank WGI 2024'],
      sparkline: [9.0, 8.5, 7.5, 7.1, 7.5, 8.5] },
    { id: 'voice', name: 'Voice & Accountability', desc: 'WGI Voice & Accountability percentile', unit: 'pctile', year: 2023,
      values: { adb: 25.6, spi: 25.6 }, source_default: 'spi', sources: ['World Bank WGI 2024'],
      sparkline: [28.0, 27.5, 26.8, 25.6, 25.6, 26.6] },
    { id: 'press_freedom', name: 'Press Freedom Index', desc: 'RSF rank (lower = freer), out of 180', unit: 'rank', year: 2024,
      values: { adb: 152, crimson: 152 }, source_default: 'crimson', sources: ['Reporters Without Borders 2024'],
      sparkline: [145, 150, 157, 150, 152, 152] },
    { id: 'turnover', name: 'Cabinet Turnover (5y)', desc: 'Number of cabinet changes in past 5 years', unit: '', year: 2024,
      values: { adb: 6, crimson: 6 }, source_default: 'crimson', sources: ['CRiMson Political Events Database'],
      sparkline: [3, 4, 4, 5, 6, 6] },
  ],
  structural: [
    { id: 'trade_openness', name: 'Trade Openness', desc: 'Exports + imports as % of GDP', unit: '% of GDP', year: 2023,
      values: { adb: 27.6, spi: 27.6, prepsa: 27.4 }, source_default: 'prepsa', sources: ['World Bank WDI 2024'],
      sparkline: [28.2, 28.6, 32.2, 28.7, 27.6, 28.1],
      sub: [{name:'Exports', val:10.4}, {name:'Imports', val:17.2}] },
    { id: 'fdi', name: 'FDI Net Inflows', desc: 'Foreign direct investment, net inflows as % of GDP', unit: '% of GDP', year: 2023,
      values: { adb: 0.5, spi: 0.5, prepsa: 0.5 }, source_default: 'prepsa', sources: ['UNCTAD World Investment Report 2024', 'World Bank WDI'],
      sparkline: [0.8, 0.7, 0.6, 0.5, 0.5, 0.7] },
    { id: 'manufacturing', name: 'Manufacturing Value Added', desc: 'Manufacturing as % of GDP', unit: '% of GDP', year: 2023,
      values: { adb: 12.4, spi: 12.4 }, source_default: 'spi', sources: ['World Bank WDI 2024', 'UNIDO Industrial Statistics'],
      sparkline: [12.0, 12.4, 12.7, 12.8, 12.4, 12.3] },
    { id: 'urbanization', name: 'Urbanization Rate', desc: 'Urban population as % of total', unit: '%', year: 2023,
      values: { adb: 38.4, spi: 38.4, crimson: 38.5 }, source_default: 'spi', sources: ['UN World Urbanization Prospects 2024'],
      sparkline: [36.9, 37.2, 37.6, 38.0, 38.4, 38.7] },
    { id: 'internet', name: 'Internet Penetration', desc: 'Individuals using the internet, % of population', unit: '%', year: 2023,
      values: { adb: 54.2, spi: 54.2, crimson: 55.1 }, source_default: 'spi', sources: ['ITU World Telecommunication Indicators 2024'],
      sparkline: [25.0, 36.5, 43.4, 47.8, 54.2, 58.6],
      sub: [{name:'Mobile broadband', val:51.6}, {name:'Fixed broadband', val:1.3}] },
    { id: 'labor_part', name: 'Labor Force Participation', desc: 'Modeled ILO estimate, ages 15+, both sexes', unit: '%', year: 2023,
      values: { adb: 51.8, spi: 51.8, crimson: 52.0 }, source_default: 'spi', sources: ['ILO Modelled Estimates 2024'],
      sparkline: [52.2, 50.9, 51.1, 51.4, 51.8, 52.0],
      sub: [{name:'Male', val:78.6}, {name:'Female', val:24.5}] },
  ],
};

// Cross-country comparison rows (used in chat + dashboard)
const SOCIAL_COMPARISON = [
  { country: 'Pakistan',   pov: 21.9, gini: 29.6, hdi: 161, gg: '142/146', risk: 'high' },
  { country: 'Bangladesh', pov: 18.7, gini: 32.4, hdi: 129, gg: '71/146',  risk: 'moderate' },
  { country: 'India',      pov: 10.0, gini: 35.7, hdi: 134, gg: '127/146', risk: 'moderate' },
  { country: 'Nepal',      pov: 16.4, gini: 32.8, hdi: 146, gg: '116/146', risk: 'moderate' },
  { country: 'Sri Lanka',  pov: 14.3, gini: 36.7, hdi: 78,  gg: '115/146', risk: 'high' },
];

// Datasets (for grid view)
const DATASETS = [
  { id: 'wdi', name: 'World Development Indicators',  pub: 'spi', dim: 'economic',     count: 1462, updated: '2024-09', countries: 217, freq: 'Annual', desc: 'Comprehensive cross-country development data.', tags: ['macro','development'] },
  { id: 'weo', name: 'World Economic Outlook',        pub: 'prepsa', dim: 'economic',    count: 47, updated: '2024-10', countries: 196, freq: 'Biannual', desc: 'IMF macroeconomic projections database.', tags: ['macro','projections'] },
  { id: 'hdr', name: 'Human Development Report',      pub: 'crimson', dim: 'social',     count: 88, updated: '2024-03', countries: 193, freq: 'Annual', desc: 'HDI and composite human development metrics.', tags: ['hdi','social'] },
  { id: 'gho', name: 'Global Health Observatory',     pub: 'spi', dim: 'social',      count: 2100, updated: '2024-08', countries: 194, freq: 'Annual', desc: 'WHO health statistics across all member states.', tags: ['health'] },
  { id: 'gggr', name: 'Global Gender Gap Report',     pub: 'crimson', dim: 'social',      count: 14, updated: '2024-06', countries: 146, freq: 'Annual', desc: 'Subindex scores on gender parity.', tags: ['gender'] },
  { id: 'adb_kid', name: 'Key Indicators for Asia & Pacific', pub: 'adb', dim: 'economic', count: 285, updated: '2024-09', countries: 49, freq: 'Annual', desc: 'ADB flagship statistical compendium.', tags: ['regional','adb'] },
  { id: 'adb_ado', name: 'Asian Development Outlook', pub: 'adb', dim: 'economic',    count: 22, updated: '2024-09', countries: 49, freq: 'Quarterly', desc: 'ADB regional macro outlook.', tags: ['outlook'] },
  { id: 'cri', name: 'Climate Risk Index',            pub: 'adb', dim: 'environmental', count: 6, updated: '2024-04', countries: 180, freq: 'Annual', desc: 'Germanwatch climate vulnerability scoring.', tags: ['climate'] },
  { id: 'wgi', name: 'Worldwide Governance Indicators', pub: 'spi', dim: 'institutional', count: 6, updated: '2024-09', countries: 214, freq: 'Annual', desc: 'Six dimensions of governance quality.', tags: ['governance'] },
  { id: 'fsi', name: 'Fragile States Index',          pub: 'crimson', dim: 'political',  count: 12, updated: '2024-07', countries: 179, freq: 'Annual', desc: 'Political fragility composite.', tags: ['fragility'] },
  { id: 'pefa', name: 'PEFA Assessments',             pub: 'spi', dim: 'institutional', count: 31, updated: '2024-05', countries: 152, freq: 'Triennial', desc: 'Public expenditure and financial accountability.', tags: ['pfm'] },
  { id: 'ndcs', name: 'NDC Tracker',                  pub: 'adb', dim: 'environmental', count: 18, updated: '2024-10', countries: 198, freq: 'Quarterly', desc: 'Nationally determined contributions monitoring.', tags: ['climate','policy'] },
];

const REFERENCES = {
  dsi: [
    { n: 1, label: 'ADB Debt Sustainability Framework for Developing Member Countries, 2023', url: '#' },
    { n: 2, label: 'Pakistan Ministry of Finance, Annual Budget Statement 2024-25', url: '#' },
    { n: 3, label: "State Bank of Pakistan, Quarterly Report on the State of Pakistan's Economy Q4 2023", url: '#' },
  ],
  social: [
    { n: 1, label: 'World Bank World Development Indicators 2024', url: '#' },
    { n: 2, label: 'UNDP Human Development Report 2024', url: '#' },
    { n: 3, label: 'World Economic Forum Global Gender Gap Report 2024', url: '#' },
  ],
};

// Time-series — synthetic per-country macro for dashboard
function tsFor(country) {
  const seeds = {
    pakistan:   { gdp:[3.1,5.7,6.5,-0.9,-0.2,2.4], cpi:[3.9,9.7,10.7,19.9,29.2,23.4], debt:[85,86,77,74,78,70], pov:[24,24,22,24,22,21] },
    india:      { gdp:[6.8,3.7,9.7,7.0,7.7,7.0],   cpi:[3.7,6.6,5.1,6.7,5.4,4.7],     debt:[75,89,84,81,82,82], pov:[14,12,10,10,10,9] },
    bangladesh: { gdp:[7.9,3.4,6.9,7.1,5.8,5.5],   cpi:[5.6,5.7,5.6,7.7,9.0,9.2],     debt:[34,35,38,39,40,41], pov:[20,19,19,19,19,18] },
    nepal:      { gdp:[6.7,-2.4,4.2,5.6,1.9,3.6],  cpi:[4.6,3.6,3.6,6.3,7.7,5.4],     debt:[30,40,42,42,43,44], pov:[18,18,17,17,16,16] },
    srilanka:   { gdp:[2.3,-4.6,3.5,-7.3,-2.3,3.0], cpi:[3.5,4.6,6.0,46.4,17.4,5.0],  debt:[87,101,114,128,116,108], pov:[10,11,13,25,17,16] },
    bhutan:     { gdp:[5.8,-10.0,-3.3,5.2,4.6,5.8], cpi:[2.8,5.6,7.4,5.6,4.6,3.5],    debt:[107,121,127,132,121,120], pov:[8,8,7,7,7,6] },
  };
  return seeds[country] || seeds.pakistan;
}

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

// Filter indicators to those a given publisher actually carries.
// Rule: an indicator "ships from" publisher X iff its `values` map has a numeric entry for X.
// ADB Curated re-publishes across sources, so it carries every indicator with a value.
function indicatorsFor(publisher, dimensionId) {
  const all = INDICATORS[dimensionId] || [];
  if (!publisher) return all;
  return all.filter(ind => {
    const v = ind.values && ind.values[publisher];
    return v !== undefined && v !== null;
  });
}

window.GenieData = {
  PUBLISHERS, DIMENSIONS, COUNTRIES, INDICATORS, SOCIAL_COMPARISON, DATASETS, REFERENCES, YEARS, tsFor, indicatorsFor,
};
