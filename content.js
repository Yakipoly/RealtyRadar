
function formatDate(dateString) {
  // создаем объект даты из переданной строки
  const dateObj = new Date(dateString);

  // массивы для преобразования числа месяца и дня недели в текстовый вид
  const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

  // извлекаем день недели, день месяца и название месяца
  const dayOfWeek = dayNames[dateObj.getDay()];
  const dayOfMonth = dateObj.getDate();
  const monthName = monthNames[dateObj.getMonth()];

  // возвращаем отформатированную дату в виде строки
  return `${dayOfMonth} ${monthName} ${dateObj.getFullYear()} года, ${dayOfWeek}`;
}
function declOfNum(number, words) {
  return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
}

async function getIdByUrl(typeAdDataBase) {
  try {
    const response = await fetch("https://rc-cloud.ru/history/search/getIDByURL", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "token": "_"
      },
      body: JSON.stringify({
        type_table: typeAdDataBase,
        url: window.location.href
      })
    });
    if (response.ok) {
      const json = await response.json();
      return json;
    } else if (response.status === 500) {
      throw new Error("Server Error");
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {

    return "К сожалению, сервер не отвечает, попробуйте обновить страницу";
  }
}

async function getIdByDescription(typeAdDataBase, description) { // добавляем ключевое слово async
  const response = await fetch("https://rc-cloud.ru/history/chrome_ext/hash_opis", { // добавляем ключевое слово await
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': '_'
    },
    body: JSON.stringify({
      type_table: typeAdDataBase, description: description
    })
  });
  const json = await response.json(); // добавляем ключевое слово await
  return json; // возвращаем результат выполнения запроса
}


async function askChatGPT(description, sellerInfoLabel) {
  try {
    const response = await fetch("https://rc-cloud.ru/chatgpt/check_agent", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "token": "_"
      },
      body: JSON.stringify({
        description: description, seller_info_label: sellerInfoLabel
      })
    });
    if (response.ok) {
      const json = await response.json();
      return json;
    } else if (response.status === 500) {
      throw new Error("Server Error");
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {

    return { "output_text": "К сожалению, сервер не отвечает, попробуйте обновить страницу" }
  }
}


async function getChartData(type_table, category, address) {
  try {
    const response = await fetch("https://rc-cloud.ru/history/trend/getPriceChangeParam", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "token": "_"
      },
      body: JSON.stringify({
        type_table: type_table,
        address: address,
        id_category: category,
        type: "area_month"
      })
    });
    if (response.ok) {
      const json = await response.json();
      return json;
    } else if (response.status === 500) {
      throw new Error("Server Error");
    } else if (response.status === 400) {
      throw new Error("Server Error");
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    return { "output_text": "К сожалению, по этому объявлению не нашлось необходимых данных" }
  }
}


//получить все объявления на оснвое айдишников
async function getObjects(typeAdDataBase, ids) { // добавляем ключевое слово async
  const response = await fetch("https://rc-cloud.ru/history/search/getByIDs", { // добавляем ключевое слово await
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': '_'
    },
    body: JSON.stringify({
      type_table: typeAdDataBase, ids: ids, fields: ''
    })
  });
  const json = await response.json(); // добавляем ключевое слово await
  return json; // возвращаем результат выполнения запроса
}

function checkStringAvito(str) {
  const substrings = [
    "| Купить квартиру",
    "| Снять квартиру",
    "| Купить комнату",
    "| Снять комнату",
    "| Гаражи и машиноместа",
    "| Продажа земельных участков",
    "| Купить дом",
    "| Снять дом",
    "| Продажа коммерческой недвижимости",
    "| Аренда коммерческой недвижимости",
  ]
  for (const substring of substrings) {
    if (str.includes(substring)) {
      return true;
    }
  }
  return false;
}

function getCategoryAvito(str) {
  const substrings = {
    "1": [
      "| Купить квартиру",
      "| Снять квартиру",
    ],
    "2": [
      "| Купить комнату",
      "| Снять комнату"
    ],
    "3": [
      "| Гаражи и машиноместа",
    ],
    "4": [
      "| Продажа земельных участков",
      "| Аренда земельных участков",
    ],
    "5": [
      "| Купить дом",
      "| Снять дом"
    ],
    "6": [
      "| Продажа коммерческой недвижимости",
      "| Аренда коммерческой недвижимости",
    ]
  };
  for (const [key, values] of Object.entries(substrings)) {
    for (const value of values) {
      if (str.includes(value)) {
        return parseInt(key);
      }
    }
  }
  return -1;
}
function getCategoryCian(url, title) {
  if (url.includes("/flat/")) {
    if (title.includes(" комнат")) {
      return "2";
    }
    return "1";
  }
  if (url.includes("/suburban/")) {
    if (title.includes(" участок")) {
      return "4";
    }
    return "5";
  }
  if (url.includes("/commercial/")) {
    return "6";
  }
}

function getCategoryDomClick(url) {
  if (url.includes("__flat__")) { return "1"; }
  if (url.includes("__parking_place__")) { return "3"; }
  if (url.includes("__room__")) { return "2"; }
  if (url.includes("__house__") || url.includes("__house_part__") || url.includes("__townhouse__")) { return "5"; }
  if (url.includes("__free_purpose__") || url.includes("__office__") || url.includes("__retail__")) { return "6"; }
}


function getTypeSite() {

  const url = window.location.href;
  let typeSite = 0, elementPanel = null, descriptionPanelText = "", sellerInfoLabel = "", typeAdDataBase = 'sale', address = "", category = "";
  let title = (document.querySelector('title')?.innerText ?? "");

  // Авито
  if (url.includes('avito')) {

    typeSite = 1;
    typeAdDataBase = (title.includes("| Снять") || title.includes("| Аренда")) ? "rent" : "sale";
    category = getCategoryAvito(title);

    elementPanel = document.querySelector("[class*='-price-value-main-']");
    if (!checkStringAvito(title)) { elementPanel = null; }

    descriptionPanelText = (document.querySelector("[class*='style-item-description-text'], [class*='style-item-description-html']")?.innerText ?? "");

    sellerInfoLabel = (document.querySelector('[data-marker="seller-info/label"]')?.innerText ?? "");

    address = (document.querySelector("[class*='style-item-address__string']")?.innerText ?? "");
  }

  if (url.includes('cian')) {
    typeSite = 2;
    category = getCategoryCian(url, title);
    typeAdDataBase = (url.includes("/rent/")) ? "rent" : "sale";
    elementPanel = document.querySelector("[class*='--price--']");
    descriptionPanelText = (document.querySelector("#description[class*='--description--']")?.innerText ?? "");
    const addressElement = document.querySelector('div[data-name="Geo"] span[itemprop="name"]');
    address = addressElement ? addressElement.getAttribute('content') : "";
  }
  if (url.includes('domclick')) {
    typeSite = 11;
    category = getCategoryDomClick(url);
    typeAdDataBase = (title.includes("Сдам ") || title.includes("Аренда ") || title.includes("Снять ")) ? "rent" : "sale";
    elementPanel = document.querySelector("[class*='product-page__sticky']");
    descriptionPanelText = (document.querySelector("#description")?.innerText ?? "");
    address = (document.querySelector('[itemprop="name"]')?.innerText ?? "");
  }
  console.log("elementPanel", elementPanel, "typeAdDataBase", typeAdDataBase, "descriptionPanelText", descriptionPanelText)
  return [elementPanel, typeAdDataBase, descriptionPanelText, sellerInfoLabel, category, address];
}
//Дизайн 
// Минипанелька
async function createPanelMini() {

  const extensionMini = document.createElement("button");
  extensionMini.setAttribute('id', 'extension-mini');
  extensionMini.addEventListener('click', function () {
    chrome.storage.sync.set({ realtycloudhide: 1 }, function () {
      document.querySelector("#extension-mini").style.display = 'none';
      document.querySelector("#extension").style.display = '';
    })
  });
  const extensionMiniImage = document.createElement("img");
  extensionMiniImage.setAttribute('src', 'https://realtycloud.ru/images/logo-new.svg');
  extensionMiniImage.setAttribute('style', 'width: 60px; height: 60px; margin-top: 5px;cursor: pointer;display: inline;');

  var p = new Promise(function (resolve, reject) {
    chrome.storage.sync.get('realtycloudhide', function (data) {
      const realtycloudhide = (data.realtycloudhide) ? data.realtycloudhide : 1;
      resolve(realtycloudhide);
    })
  });
  const is_extensionMini_hide = await p;
  if (is_extensionMini_hide == 1) {
    extensionMini.style.display = 'none';
  }
  extensionMini.appendChild(extensionMiniImage);
  document.body.appendChild(extensionMini);
}


// Заготовка большой панельки
async function createPanelLarge() {
  var p = new Promise(function (resolve, reject) {
    chrome.storage.sync.get('realtycloudhide', function (data) {
      const realtycloudhide = (data.realtycloudhide) ? data.realtycloudhide : 1;
      resolve(realtycloudhide);
    })
  });
  const is_cardDiv_hide = await p;

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDiv.setAttribute('id', 'extension');
  cardDiv.style.display = (is_cardDiv_hide != 1) ? "none" : "";
  cardDiv.innerHTML = '<div class="card-header">\
      <a class="extension-button extension-button-active">Описание</a>\
      <a class="extension-button">Оценка</a>\
      <a class="extension-hider" href="#">X</a>\
    </div>\
    <div class="card-body extention-loader" style="">\
      <span class="loader"></span>\
    </div>\
    <div class="card-body extention-body-desc" style="">\
      <div>\
        <div class="text-white">\
          <h5 class="extention-text extention-text-repub"></h5>\
          <h6 class="text-muted extention-text extention-text-descr"></h6>\
        </div>\
        <div class="text-white extention-text">\
          <h5 class="text-danger extention-text extention-text-chatgpt"></h5>\
        </div>\
      </div>\
      </div>\
      <div class="card-body extention-body-graph" style="display: none;">\
      <div id="container-chart" style="height: 250px;"></div>\
    </div>';

  await document.body.appendChild(cardDiv);
  let extension_btn = document.querySelectorAll(".extension-button");
  extension_btn[0].addEventListener('click', function () {
    document.querySelector(".extension-button-active").setAttribute("class", "extension-button");
    this.setAttribute("class", "extension-button extension-button-active");
    document.querySelector(".extention-body-desc").style.display = '';
    document.querySelector(".extention-body-graph").style.display = 'none';
  });
  extension_btn[1].addEventListener('click', function () {
    document.querySelector(".extension-button-active").setAttribute("class", "extension-button");
    this.setAttribute("class", "extension-button extension-button-active");

    document.querySelector(".extention-body-desc").style.display = 'none';
    document.querySelector(".extention-body-graph").style.display = '';
  });
  document.querySelector(".extension-hider").addEventListener('click', function () {
    chrome.storage.sync.set({ realtycloudhide: 0 }, function () {
      document.querySelector("#extension-mini").style.display = '';
      document.querySelector("#extension").style.display = 'none';
    });
  });
}

async function generate() {

  const [elementPanel, typeAdDataBase, descriptionPanelText, sellerInfoLabel, category, address] = getTypeSite()
  if (elementPanel === null || elementPanel.parentNode === null) {
    return;
  }

  await createPanelMini()
  await createPanelLarge();

  await Promise.all([
    askChatGPT(descriptionPanelText, sellerInfoLabel)
      .then((askChatGPTResult) => {
        console.log(askChatGPTResult);
        document.querySelector(".extention-text-chatgpt").innerText = askChatGPTResult["output_text"];
      }),
    getChartData(typeAdDataBase, category, address)
      .then((chart_data) => {
        
        if ("output_text" in chart_data) {
          let result = document.querySelector("#container-chart");
          result.innerText = chart_data.output_text;
          result.setAttribute("class", "text-white");
          result.setAttribute("style", "");
          return;
        }
        chart_data = chart_data.data.list;
        if (chart_data.length == 0) {
          let result = document.querySelector("#container-chart");
          result.innerText = "К сожалению, по этому объявлению не нашлось необходимых данных";
          result.setAttribute("class", "text-white");
          result.setAttribute("style", "");
          return;
        }
        chart_data.forEach(function (point) {
          point[0] = Date.parse(point[0]);
        });
        chart_data.sort(function(a, b) {
          return a[0] - b[0];
        });
        console.log("chart_data", chart_data);
        Highcharts.setOptions({ lang: { months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'], shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'] } });

        Highcharts.chart('container-chart', {
          accessibility: {
            enabled: false
          },
          chart: { type: 'line', backgroundColor: null, },
          title: { text: '' },
          xAxis: {
            labels: {
              enabled: false,
              style: { fontSize: '12px' },
            },
          },
          tooltip: {
            style: { fontSize: '12px' },
            formatter: function () {
              return '<b>' + Highcharts.dateFormat('%B %Y', this.x) + '</b><br/>' + this.series.name + ': ' + this.y;
            }
          },
          yAxis: { title: { text: '' }, enabled: false, labels: { style: { color: "#fff", fontSize: '12px' } } },
          series: [{ showInLegend: false, name: 'В районе', data: chart_data }]
        });
      }),
    getIdByDescription(typeAdDataBase, descriptionPanelText)
      .then((nums_descriptions) => {
        console.log(nums_descriptions);
        let result = document.querySelector(".extention-text-descr");
        if (nums_descriptions['status'] != 'success') {
          result.innerText = 'К сожалению, мы не можем проверить данное объявление';
          return;
        }
        if (nums_descriptions['count'] == 0) {
          result.innerText = 'По такому описанию не нашлось других объявлений';
          return;
        }
        const advertsDCount = nums_descriptions['data'].length;
        result.innerText = "По такому описанию уже существует " + advertsDCount + declOfNum(advertsDCount, [" объявление", " объявления", " объявлений"]);
      }),
    getIdByUrl(typeAdDataBase)
      .then((numbers) => {
        console.log(numbers);
        let result = document.querySelector(".extention-text-repub");
        if (numbers['status'] != 'success') {
          result.innerText = 'К сожалению, мы не можем проверить данное объявление';
          return Promise.resolve(null);
        }
        if (numbers['id'].length == 0) {
          result.innerText = 'Упс, в базе данных это объявление не появлялось';
          return Promise.resolve(null);
        }
        return getObjects(typeAdDataBase, numbers['id']);
      })
      .then((adverts) => {
        if (adverts) {
          console.log(adverts);
          let result = document.querySelector(".extention-text-repub");
          if (adverts['status'] != 'success') {
            result.innerText = 'К сожалению, мы не можем узнать данные об объявлении';
            return;
          }
          const minDate = adverts['data'].reduce((prev, current) => {
            const prevDate = new Date(prev.date);
            const currentDate = new Date(current.date);
            return prevDate < currentDate ? prev : current;
          });
          result.innerText = "Это объявление было впервые опубликовано " + formatDate(minDate.date);
        }

        return adverts;
      })
  ]);
  document.querySelector("span.loader").style.display = 'none';
}


generate()

