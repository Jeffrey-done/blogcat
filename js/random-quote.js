// 配置项
const API_CONFIG = {
  primary: 'https://v2.xxapi.cn/api/renjian',   // 主API
  backup: 'https://api.btstu.cn/yan/api.php',   // 备用API
  retries: 3,                                   // 最大重试次数
  timeout: 5000                                 // 请求超时(ms)
};

const FALLBACK_QUOTES = [
  "人生没有标准答案，珍惜当下就好。",
  "每一天都是新的练习。",
  "在平凡的日子里热爱生活。"
];

let currentAPI = API_CONFIG.primary;
let retryCount = 0;

// 主逻辑
async function fetchQuote() {
  const quoteElement = document.getElementById('dynamic-quote');
  
  try {
    showLoadingState(quoteElement);
    
    // 带超时的请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(currentAPI, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await parseResponse(response);
    handleSuccess(quoteElement, data);
    retryCount = 0;

  } catch (error) {
    handleError(quoteElement, error);
  }
}

// 响应解析
async function parseResponse(response) {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  
  // 备用API文本处理
  const text = await response.text();
  return { code: 200, data: text };
}

// 成功处理
function handleSuccess(element, data) {
  let quoteText = '';
  
  if (currentAPI === API_CONFIG.primary) {
    quoteText = data.data || FALLBACK_QUOTES[0];
  } else {
    quoteText = data;
  }

  element.innerHTML = `
    <div class="quote-content">
      「 ${quoteText} 」
      ${currentAPI !== API_CONFIG.primary ? '<div class="api-source">备用源</div>' : ''}
    </div>
  `;
}

// 错误处理
function handleError(element, error) {
  console.error('Error:', error);
  retryCount++;

  if (retryCount <= API_CONFIG.retries) {
    element.innerHTML = `
      <div class="retry-state">
        <i class="fas fa-sync-alt fa-spin"></i>
        第 ${retryCount} 次重试中...
      </div>
    `;
    setTimeout(fetchQuote, 1000 * Math.pow(2, retryCount));
  } else {
    switchAPI(element);
  }
}

// 切换API
function switchAPI(element) {
  retryCount = 0;
  currentAPI = currentAPI === API_CONFIG.primary 
    ? API_CONFIG.backup 
    : API_CONFIG.primary;

  if (currentAPI === API_CONFIG.backup) {
    element.innerHTML = `
      <div class="api-switch-notice">
        <i class="fas fa-random"></i>
        已切换备用数据源
      </div>
    `;
    setTimeout(fetchQuote, 1000);
  } else {
    showFallback(element);
  }
}

// 显示备用文案
function showFallback(element) {
  const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
  element.innerHTML = `
    <div class="fallback-quote">
      「 ${FALLBACK_QUOTES[randomIndex]} 」
      <div class="fallback-notice">
        <i class="fas fa-database"></i>
        本地库存语录
      </div>
    </div>
  `;
}

// 状态显示
function showLoadingState(element) {
  element.innerHTML = `
    <div class="loading-state">
      <div class="loading-wave">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      正在连接灵感池...
    </div>
  `;
}

// 刷新功能
function refreshQuote() {
  retryCount = 0;
  currentAPI = API_CONFIG.primary;
  fetchQuote();
}
