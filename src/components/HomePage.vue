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

    <!-- Фильтр по классу автомобилей -->
    <div>
      <h3>Фильтр по классам автомобилей</h3>
      <div>
        <button
          v-for="classId in [1, 2, 3, 4, 5, 6, 7]"
          :key="classId"
          @click="toggleClassFilter(classId)"
          :class="{ active: selectedClasses.includes(classId) }"
        >
          Class {{ classId }}
        </button>
      </div>
      <!-- Отображение количества автомобилей -->
      <p v-if="filteredCars.length">Отображено {{ filteredCars.length }} автомобилей</p>
      <p v-else>Машин выбранных классов нет</p>
    </div>

    <!-- Прелоадер для первичной загрузки -->
    <div v-if="isLoading && cars.length === 0" class="preloader">
      <p>Загрузка данных...</p>
    </div>

    <!-- Проверка: если данные о машинах существуют -->
    <div v-if="filteredCars.length">
      <h3>Машины</h3>
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

      <!-- Зона загрузки дополнительных данных -->
      <div class="load-more-section">
        <button v-if="!isFetchingMore" @click="loadMoreCars">Загрузить еще машины</button>
        <p v-else>Загрузка данных...</p>
      </div>
    </div>

    <!-- Сообщение, если машин нет -->
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
      selectedClasses: [], // Выбранные классы машин
      locationNamesFit: [],
      isLoading: false, // Состояние для первичной загрузки
      isFetchingMore: false, // Состояние для подгрузки новых данных
      page: 1,
      perPage: 2 // Количество машин на страницу
    };
  },
  computed: {
    filteredCars() {
      if (this.selectedClasses.length === 0) {
        return this.cars; // Если классы не выбраны, отображаем все машины
      }
      return this.cars.filter(car => this.selectedClasses.includes(car.class_id));
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
    toggleClassFilter(classId) {
      const index = this.selectedClasses.indexOf(classId);
      if (index > -1) {
        this.selectedClasses.splice(index, 1); // Убираем класс, если он был выбран
      } else {
        this.selectedClasses.push(classId); // Добавляем класс, если он не был выбран
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
button.active {
  background-color: #007bff;
  color: white;
}
</style>
