import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from '../views/Login.vue';
import Main from '@/views/Main.vue'
import User from '@/components/User.vue'
import Role from '@/components/Role.vue'
import Permission from '@/components/Permission.vue'
import View from '@/components/View.vue'
import Three from '@/views/Three.vue'

Vue.use(VueRouter);

const routes = [{
        path: '/',
        component: Main,
        redirect: '/three',
        children: [{
            path: "/main",
            name: "main",
            component: View,
        }, {
            path: "/three",
            name: "three",
            component: Three,
        }]
    },
    {
        path: "/system",
        name: "system",
        component: Main,
        children: [{
                path: 'user',
                name: 'user',
                component: User,
            },
            {
                path: 'role',
                name: 'role',
                component: Role,
            },
            {
                path: 'permission',
                name: 'permission',
                component: Permission,
            },
        ]
    },
    {
        path: "/login",
        name: "login",
        component: Login
    }
]

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
})

export default router;