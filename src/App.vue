<template>
  <div>
    <!-- Форма для поиска машин -->
    <form @submit.prevent="fetchCars">
      <div>
        <label for="from-id">From Location:</label>
        <select v-model="form.fromId" id="from-id">
          <option v-for="location in locationNamesFit" :key="location.id" :value="location.id">
            {{ location.name }}
          </option>
        </select>
      </div>
      <div>
        <label for="from-date">From Date:</label>
        <input type="date" v-model="form.fromDate" id="from-date" />
      </div>
      <div>
        <label for="to-date">To Date:</label>
        <input type="date" v-model="form.toDate" id="to-date" />
      </div>
      <button type="submit">Поиск машин </button>
    </form>

    <!-- Прелоадер -->
    <div v-if="isLoading" class="preloader">
      <p>Загрузка данных...</p>
    </div>

    <!-- Выводим данные как есть для отладки -->
    <pre v-else>{{ data }}</pre>

    <!-- Проверка: если данные о машинах существуют -->
    <div v-if="data && data.vehicles && data.vehicles.length && !isLoading">
      <h3>Машины</h3>
      <div v-for="(vehicle, index) in data.vehicles" :key="vehicle.id" class="vehicle-block">
        <h4>Машина #{{ index + 1 }} — {{ vehicle.model }} ({{ vehicle.year }})</h4>
        <table>
          <tbody>
            <tr>
              <td><strong>ID</strong></td>
              <td>{{ vehicle.id }}</td>
            </tr>
            <!-- Остальная информация о машине -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Сообщение, если машин нет -->
    <p v-else-if="!isLoading">Машины не найдены или данные недоступны</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        fromId: null, // Значение будет установлено автоматически
        fromDate: '2024-10-12', // Значение по умолчанию
        toDate: '2024-10-16' // Значение по умолчанию
      },
      data: null, // Данные поиска машин
      locationNamesFit: [], // Данные из locationNamesFit
      isLoading: false // Состояние загрузки
    };
  },
  methods: {
    // Метод для преобразования даты
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`;
    },

    // Метод для поиска машин
    async fetchCars() {
      if (!this.form.fromId) return; // Проверяем, что выбран регион
      this.isLoading = true; // Включаем прелоадер перед запросом
      try {
        const fromDateFormatted = this.formatDate(this.form.fromDate);
        const toDateFormatted = this.formatDate(this.form.toDate);

        axios.defaults.headers.common['X-Requested-With'] = null;
        const params = {
          'from-id': this.form.fromId,
          'to-id': 71, // Оставляем это значение по умолчанию
          'from-date': fromDateFormatted, // Преобразованная дата
          'to-date': toDateFormatted, // Преобразованная дата
          'from-time': '12:00', // Оставляем это значение по умолчанию
          'to-time': '12:00', // Оставляем это значение по умолчанию
          promocode: null, // Оставляем это значение по умолчанию
          page: 1,
          per_page: 2
        };
        const queryString = new URLSearchParams(params).toString();

        const response = await axios.get(`https://new.mycarrental.ru/api/v2/search_cars?${queryString}`);

        console.log(response); // Выводим весь ответ сервера для проверки
        this.data = response.data; // Обновляем данные поиска машин
      } catch (error) {
        console.error('Ошибка запроса:', error);
      } finally {
        this.isLoading = false; // Отключаем прелоадер после завершения запроса
      }
    },

    // Метод для получения данных по регионам
    async fetchRegions() {
      this.isLoading = true; // Включаем прелоадер перед запросом
      try {
        axios.defaults.headers.common['X-Requested-With'] = null;
        const response = await axios.get('https://new.mycarrental.ru/api/v2/regions/sochy');
        this.locationNamesFit = response.data.branchOffice.locationNamesFit;

        // Автоматически выбираем первый регион как значение по умолчанию
        if (this.locationNamesFit.length > 0) {
          this.form.fromId = this.locationNamesFit[0].id;
        }

        console.log(response.data.branchOffice.locationNamesFit); // Выводим весь ответ для проверки
      } catch (error) {
        console.error('Ошибка запроса:', error);
      } finally {
        this.isLoading = false; // Отключаем прелоадер после завершения запроса
      }
    }
  },
  watch: {
    // Наблюдаем за изменением выбранного региона и запускаем поиск машин
    'form.fromId'(newId) {
      if (newId) {
        this.fetchCars(); // Выполняем поиск машин при изменении региона
      }
    },
    // Наблюдаем за изменением дат и также запускаем поиск
    'form.fromDate': 'fetchCars',
    'form.toDate': 'fetchCars'
  },
  // Загружаем данные по регионам при монтировании компонента
  async mounted() {
    await this.fetchRegions(); // Загружаем локации при загрузке
    this.fetchCars(); // Запрашиваем машины сразу после загрузки локаций
  }
};
</script>

<style>
/* Стили для прелоадера */
.preloader {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>
