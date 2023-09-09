import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/HomePage.vue'
import Projectsx from './views/Projects.vue'
import Reports from './views/Reports.vue'
import Users from './views/Users.vue'
import Calendar from './views/Calendar.vue'
import Billing from './views/Billing.vue'
import Clients from './views/Clients.vue'
import Projects from './views/ProjectsPage.vue'
import Tasks from './views/Tasks.vue'
import TaskEdit from './views/TaskEdit.vue'
import Dashboard from './views/Dashboard.vue'
import Holidays from './views/Holidays.vue'
import Chat from './views/Chat.vue'
import TeamMember from './views/TeamMember.vue'
import Timers from './views/Timers.vue'
import Search from './views/Search.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/projects',
      name: 'projects-x',
      component: Projectsx
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/reports/billing',
      name: 'reports',
      component: Reports
    },
    {
      path: '/config/users',
      name: 'users',
      component: Users
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    },
    {
      path: '/billing',
      name: 'billing',
      component: Billing
    },
    {
      path: '/config/clients',
      name: 'clients',
      component: Clients
    },
    {
      path: '/config/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/config/tasks',
      name: 'tasks-config',
      component: Tasks
    }, 
    {
      path: '/config/holidays',
      name: 'config-holidays',
      component: Holidays
    }, 
    {
      path: '/config/tasks/:taskId',
      name: 'task-edit',
      component: TaskEdit
    },
    {
      path: '/team/:memberId',
      name: 'team-member',
      component: TeamMember
    },
    {
      path: '/Chat',
      name: 'chat-hub',
      component: Chat
    },
    {
      path: '/reports/timers',
      name: 'timers-report',
      component: Timers
    }
  ]
})
