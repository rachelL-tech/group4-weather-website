// dropdown menu function
export function initLocationDropdown(city) {
    const dropdown = document.querySelector(".dropdown");
    if (!dropdown) return;
    const button = dropdown.querySelector(".dropdown-toggle.current-weather__location");
    if (!button) return;

    const menu = dropdown.querySelector(".dropdown-menu");

    const currentCity = city;
    const prevCity = button.textContent;

    if (currentCity && currentCity !== prevCity) {
        let matchedItem = null;
        dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
            const itemCity = item.dataset.location || item.textContent;
            if (itemCity === currentCity) matchedItem = item;
        });

        if (matchedItem) {
            button.textContent = currentCity;
            matchedItem.textContent = prevCity;
            matchedItem.dataset.location = prevCity;
        } else {
            button.textContent = currentCity;

            // 移除清單中與 currentCity 相同的項目，避免重複
            dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
                const itemCity = item.dataset.location || item.textContent;
                if (itemCity === currentCity) item.remove();
            });

            // 確保 prevCity 在清單內，方便之後 swap
            if (prevCity) {
                const hasPrev = Array.from(dropdown.querySelectorAll(".dropdown-item")).some(
                    (item) => normalizeCity(item.dataset.location || item.textContent) === prevCity
                );
                if (!hasPrev) {
                    const item = document.createElement("a");
                    item.href = "#";
                    item.className = "dropdown-item";
                    item.dataset.location = prevCity;
                    item.textContent = prevCity;
                    menu.appendChild(item);
                }
            }
        }
    } else if (currentCity) {
        button.textContent = currentCity;
    }

    // 只在「不能 hover 的裝置」才用 click toggle，避免桌機 hover + click 狀態打架
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) {
        button.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("active");
        });
    }

    // 點按鈕：開/關選單
    button.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("active");
    });

    // 點選城市：swap + 存 city + 觸發事件給 API 那邊
    dropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            const nextCity = (this.dataset.location || this.textContent || "").trim();
            const prevCity = (button.textContent || "").trim();

            // 1) UI：button 顯示新城市
            button.textContent = nextCity;

            // 2) 讓「原本被點的那個 item」變成「上一個城市」
            //    這樣新城市就不在清單裡了；臺北市也會被放回清單
            this.textContent = prevCity;
            this.dataset.location = prevCity;

            // 3) 存 city
            window.city = nextCity;

            // 4) 通知其他檔案（例如 api.js / main.js）去抓資料並渲染
            document.dispatchEvent(new CustomEvent("citychange", { detail: { city: window.city } }));

            // 5) 視覺回饋 + 關閉選單
            dropdown.classList.remove("active");
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 300);
        });
    });
    
    // Improve keyboard accessibility
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const dropdown = this.closest('.dropdown');
                dropdown.classList.toggle('active');
            }
        });
    });
}

// focus button fuction to get realtime nearest weather data
// 按鈕被點到 → 取得定位
export function setupGeoButton({
  buttonSelector = ".location_container .focus",
  onSuccess,
} = {}) {
  const btn = document.querySelector(buttonSelector);
  if (!btn) return;

  btn.addEventListener("click", () => {
    // 呼叫瀏覽器定位 API，成功後會把「位置物件」丟進 callback 參數 pos
    navigator.geolocation.getCurrentPosition((pos) => {
    // 從 pos.coords 解構出緯度經度兩個欄位
      const { latitude, longitude } = pos.coords;
      onSuccess({ lat: latitude, lon: longitude });
    });
  });
}

export function findNearestStation(user, stations) {
  // stations: [{ lat, lon, ... }, ...]
  let best = null;
  let bestD2 = Infinity;

  // console.log(stations);
  for (const st of stations) {
    const dLat = st.lat - user.lat;
    const dLon = st.lon - user.lon;
    const d2 = dLat * dLat + dLon * dLon; // 先用平方距離做最近比較

    if (d2 < bestD2) {
      bestD2 = d2;
      best = st;
    }
  }
  return best;
}
