// ساخت آبجکت API
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
}

// ترجمه وضعیت آب و هوا به فارسی
function translateWeather(status) {
    const translations = {
        'Clear': '☀️ صاف',
        'Clouds': '☁️ ابری',
        'Rain': '🌧️ بارانی',
        'Drizzle': '🌦️ نم‌نم باران',
        'Thunderstorm': '⛈️ رعد و برق',
        'Snow': '🌨️ برفی',
        'Mist': '🌫️ مه‌آلود',
        'Fog': '🌫️ مه غلیظ',
        'Haze': '🌫️ غبارآلود',
        'Sand': '🏜️ طوفان شن',
        'Dust': '🌪️ گرد و غبار',
        'Squall': '💨 باد شدید',
        'Tornado': '🌪️ گردباد'
    };
    return translations[status] || status;
}

// اضافه کردن شنونده رویداد برای کلید Enter
let searchInputBox = document.getElementById('input-box');
searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        getWeatherReport(searchInputBox.value);
    }
})

// دریافت گزارش آب و هوا
function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric&lang=fa`)
        .then(weather => {
            return weather.json();
        }).then(showWeaterReport);
}

// نمایش گزارش آب و هوا
function showWeaterReport(weather) {
    let city_code = weather.cod;
    if (city_code === '400') {
        swal("ورودی خالی", "لطفاً نام یک شهر را وارد کنید", "error");
        reset();
    } else if (city_code === '404') {
        swal("ورودی نامعتبر", "شهر مورد نظر یافت نشد", "warning");
        reset();
    } else {
        let op = document.getElementById('weather-body');
        op.style.display = 'block';
        let todayDate = new Date();
        let parent = document.getElementById('parent');
        let weather_body = document.getElementById('weather-body');
        weather_body.innerHTML = `
            <div class="location-deatils">
                <i class="fas fa-map-marker-alt"></i>
                ${weather.name}، ${weather.sys.country}
            </div>
            <div class="date">
                <i class="far fa-calendar-alt"></i>
                ${dateManage(todayDate)}
            </div>
            <div class="weather-status">
                <div class="temp">
                    ${Math.round(weather.main.temp)}°C
                </div>
                <div class="weather">
                    ${translateWeather(weather.weather[0].main)}
                </div>
                <div class="min-max">
                    حداقل: ${Math.floor(weather.main.temp_min)}°C | حداکثر: ${Math.ceil(weather.main.temp_max)}°C
                </div>
                <div class="date">
                    آخرین بروزرسانی: ${getTime(todayDate)}
                </div>
            </div>
            <div class="day_details">
                <div class="basic">
                    <i class="fas fa-thermometer-half"></i>
                    دمای حسی: ${weather.main.feels_like}°C
                </div>
                <div class="sun-detail">
                    <i class="fas fa-tint"></i>
                    رطوبت: ${weather.main.humidity}%
                </div>
                <div class="basic">
                    <i class="fas fa-compress-arrows-alt"></i>
                    فشار هوا: ${weather.main.pressure} hPa
                </div>
                <div class="sun-detail">
                    <i class="fas fa-wind"></i>
                    سرعت باد: ${weather.wind.speed} km/h
                </div>
            </div>
        `;
        parent.append(weather_body);
        changeBg(weather.weather[0].main);
        reset();
    }
}

// تابع برای نمایش ساعت فعلی
function getTime(todayDate) {
    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());
    return `${hour}:${minute}`;
}

// تابع برای مدیریت تاریخ
function dateManage(dateArg) {
    let days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

    let months = ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
        'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'];

    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];
    return `${date} ${month} (${day}) ، ${year}`;
}

// تابع برای تغییر پس‌زمینه بر اساس وضعیت آب و هوا
function changeBg(status) {
    if (status === 'Clouds') {
        document.body.style.backgroundImage = 'url(img/clouds.jpg)';
    } else if (status === 'Rain') {
        document.body.style.backgroundImage = 'url(img/rainy.jpg)';
    } else if (status === 'Clear') {
        document.body.style.backgroundImage = 'url(img/clear.jpg)';
    } else if (status === 'Snow') {
        document.body.style.backgroundImage = 'url(img/snow.jpg)';
    } else if (status === 'Sunny') {
        document.body.style.backgroundImage = 'url(img/sunny.jpg)';
    } else if (status === 'Thunderstorm') {
        document.body.style.backgroundImage = 'url(img/thunderstrom.jpg)';
    } else if (status === 'Drizzle') {
        document.body.style.backgroundImage = 'url(img/drizzle.jpg)';
    } else if (status === 'Mist' || status === 'Haze' || status === 'Fog') {
        document.body.style.backgroundImage = 'url(img/mist.jpg)';
    } else {
        document.body.style.backgroundImage = 'url(img/bg.jpg)';
    }
}

// تابع برای نام کلاس آیکون
function getIconClass(classarg) {
    if (classarg === 'Rain') {
        return 'fas fa-cloud-showers-heavy';
    } else if (classarg === 'Clouds') {
        return 'fas fa-cloud';
    } else if (classarg === 'Clear') {
        return 'fas fa-cloud-sun';
    } else if (classarg === 'Snow') {
        return 'fas fa-snowman';
    } else if (classarg === 'Sunny') {
        return 'fas fa-sun';
    } else if (classarg === 'Mist') {
        return 'fas fa-smog';
    } else if (classarg === 'Thunderstorm' || classarg === 'Drizzle') {
        return 'fas fa-thunderstorm';
    } else {
        return 'fas fa-cloud-sun';
    }
}

function reset() {
    let input = document.getElementById('input-box');
    input.value = "";
}

// تابع برای اضافه کردن صفر قبل از اعداد کمتر از ۱۰
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}