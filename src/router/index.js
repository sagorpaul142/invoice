import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {path: '/', name: 'Home Page', component: () => import('../page/HomePage.vue')},
    {path: '/:id', name: 'Invoice Details', component: () => import('../page/InvoiceDetails.vue')}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;