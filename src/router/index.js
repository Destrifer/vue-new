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
		path: '/car/:id',
		name: 'CarDetails',
		component: CarDetails,
		props: route => ({
			carId: Number(route.params.id),
			image: route.params.image,
			model: route.params.model,
			transmission: route.params.transmission,
			seats: route.params.seats,
			engine_capacity: route.params.engine_capacity,
			engine_hp: route.params.engine_hp,
			deposit: route.params.deposit,
			rent_period_days: route.params.rent_period_days,
			rate_subtotal: route.params.rate_subtotal
		})
	}
];


const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;
