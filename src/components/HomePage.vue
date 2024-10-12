<template>
  <div>
    <!-- Весь код, который был в App.vue -->
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

    <!-- Прелоадер -->
    <div v-if="isLoading" class="preloader">
      <p>Загрузка данных...</p>
    </div>

    <!-- Выводим данные как есть для отладки -->
    <!-- <pre v-else>{{ data }}</pre> -->

    <!-- Проверка: если данные о машинах существуют -->
    <div v-if="data && data.vehicles && data.vehicles.length && !isLoading">
      <h3>Машины</h3>
      <div v-for="vehicle in data.vehicles" :key="vehicle.id">
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
        />
      </div>
    </div>

    <!-- Сообщение, если машин нет -->
    <p v-else-if="!isLoading">Машины не найдены или данные недоступны</p>
  </div>
</template>

<script>
import axios from 'axios';
import CarCard from '../components/CarCard.vue'; // Импортируем компонент

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
      data: null,
      locationNamesFit: [],
      isLoading: false
    };
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
          page: 1,
          per_page: 2
        };
        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(`https://new.mycarrental.ru/api/v2/search_cars?${queryString}`);
        this.data = response.data;
      } catch (error) {
        console.error('Ошибка запроса:', error);
      } finally {
        this.isLoading = false;
      }
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
</style>
