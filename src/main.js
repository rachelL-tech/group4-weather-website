// 引入渲染工具
import { renderHourlyForecast, renderDailySummary } from './render.js';
import { getCard1RenderData, getCard2RenderData, getNow10MinRenderData,} from './api.js';

// 跳轉頁面

const homePageBtn = document.getElementById('homePageBtn');
const forecastPageBtn = document.getElementById('forecastPageBtn');

if (forecastPageBtn) {
  forecastPageBtn.addEventListener('click', () => {
    window.location.href = 'forecast.html';
  });
}

if (homePageBtn) {
  homePageBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

// const now_Data = await getNow10MinRenderData("臺北市");

const card1_Data = await getCard1RenderData("臺北市");
renderHourlyForecast(card1_Data);

const card2_Data = await getCard2RenderData("臺北市");
renderDailySummary(card2_Data);