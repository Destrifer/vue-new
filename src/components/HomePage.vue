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
    </form>

    <!-- Прелоадер для первичной загрузки -->
    <div v-if="isLoading && cars.length === 0" class="preloader">
      <p>Загрузка данных...</p>
    </div>

    <!-- Фильтры по классу машин -->
    <div class="filter-buttons">
      <button v-for="id in [1, 2, 3, 4, 5, 6, 7]" :key="id" @click="filterClass(id)" :class="{ active: activeClassId === id }">
        Класс {{ id }}
      </button>
    </div>

    <!-- Проверка: если данные о машинах существуют -->
    <div v-if="filteredCars.length">
      <h3>Машины класса {{ activeClassId }}</h3>
      <div v-for="vehicle in filteredCars" :key="vehicle.id">
        <CarCard
          :car-id="vehicle.id"
          :image="vehicle.images[0].image"
          :model="vehicle.model"
          :transmission="vehicle.transmission"
          :seats="vehicle.seats"
          :engine_capacity="vehicle.engine_capacity"
          :engine_hp="vehicle.engine_hp"
          :deposit="vehicle.deposit"
          :rent_period_days="vehicle.rent_period_days"
          :rate_subtotal="vehicle.rate_subtotal"
          :form-from-id="form.fromId"
          :form-from-date="form.fromDate"
          :form-to-date="form.toDate"
        />
      </div>

      <pre>{{ this.cars }}</pre>

      <!-- Зона загрузки дополнительных данных -->
      <div class="load-more-section">
        <button v-if="!isFetchingMore" @click="loadMoreCars">Загрузить еще машины</button>
        <p v-else>Загрузка данных...</p>
      </div>
    </div>

    <!-- Сообщение, если машин выбранного класса нет -->
    <p v-else-if="!isLoading && filteredCars.length === 0">Машины класса {{ activeClassId }} не найдены</p>

    <!-- Сообщение, если машин нет вообще -->
    <p v-else-if="!isLoading && cars.length === 0">Машины не найдены или данные недоступны</p>
  </div>
</template>

<script>
import axios from 'axios';
import CarCard from '../components/CarCard.vue'; // Импорт компонента

export default {
  components: {
    CarCard
  },
  data() {
    return {
      form: {
        fromId: null,
        fromDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        toDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]
      },
      cars: [], // Список всех загруженных машин
      locationNamesFit: [],
      isLoading: false, // Состояние для первичной загрузки
      isFetchingMore: false, // Состояние для подгрузки новых данных
      page: 1,
      perPage: 2, // Количество машин на страницу
      activeClassId: 1 // Активный class_id для фильтрации
    };
  },
  computed: {
    // Отфильтрованные машины по class_id
    filteredCars() {
      return this.cars.filter(car => car.class_id === this.activeClassId);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`;
    },
    async fetchCars() {
      if (!this.form.fromId) return;
      this.isLoading = true;
      try {
        const fromDateFormatted = this.formatDate(this.form.fromDate);
        const toDateFormatted = this.formatDate(this.form.toDate);

        axios.defaults.headers.common['X-Requested-With'] = null;
        const params = {
          'from-id': this.form.fromId,
          'to-id': 71,
          'from-date': fromDateFormatted,
          'to-date': toDateFormatted,
          'from-time': '12:00',
          'to-time': '12:00',
          promocode: null,
          page: this.page,
          per_page: this.perPage
        };
        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(`https://new.mycarrental.ru/api/v2/search_cars?${queryString}`);
        this.cars = response.data.vehicles; // Загружаем первую партию машин
      } catch (error) {
        console.error('Ошибка запроса:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async loadMoreCars() {
      this.page += 1;
      this.isFetchingMore = true;
      try {
        const fromDateFormatted = this.formatDate(this.form.fromDate);
        const toDateFormatted = this.formatDate(this.form.toDate);

        axios.defaults.headers.common['X-Requested-With'] = null;
        const params = {
          'from-id': this.form.fromId,
          'to-id': 71,
          'from-date': fromDateFormatted,
          'to-date': toDateFormatted,
          'from-time': '12:00',
          'to-time': '12:00',
          promocode: null,
          page: this.page,
          per_page: this.perPage
        };
        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(`https://new.mycarrental.ru/api/v2/search_cars?${queryString}`);
        this.cars = [...this.cars, ...response.data.vehicles]; // Добавляем новые машины к существующему списку
      } catch (error) {
        console.error('Ошибка при подгрузке машин:', error);
      } finally {
        this.isFetchingMore = false;
      }
    },
    filterClass(classId) {
      this.activeClassId = classId;
    },
    async fetchRegions() {
      this.isLoading = true;
      try {
        axios.defaults.headers.common['X-Requested-With'] = null;
        const response = await axios.get('https://new.mycarrental.ru/api/v2/regions/sochy');
        this.locationNamesFit = response.data.branchOffice.locationNamesFit;
        if (this.locationNamesFit.length > 0) {
          this.form.fromId = this.locationNamesFit[0].id;
        }
      } catch (error) {
        console.error('Ошибка запроса:', error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  watch: {
    'form.fromId'(newId) {
      if (newId) {
        this.page = 1;
        this.fetchCars();
      }
    },
    'form.fromDate': 'fetchCars',
    'form.toDate': 'fetchCars'
  },
  async mounted() {
    await this.fetchRegions();
    this.fetchCars();
  }
};
</script>

<style scoped>
.preloader {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.load-more-section {
  text-align: center;
  margin-top: 20px;
}
.filter-buttons {
  text-align: center;
  margin-bottom: 20px;
}
.filter-buttons button {
  margin-right: 10px;
  padding: 10px 20px;
  cursor: pointer;
}
.filter-buttons button.active {
  background-color: #007bff;
  color: white;
}
</style>
