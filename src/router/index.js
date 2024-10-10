import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue'; // Главная страница
import CarDetails from '../components/CarDetails.vue'; // Страница с информацией о машине

const routes = [
	{
		path: '/',
		name: 'Home',
		component: HomePage
	},
	{
		path: '/car/:id', // Маршрут для каждой машины
		name: 'CarDetails',
		component: CarDetails,
		props: true // Чтобы передавать параметры как пропсы
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;
