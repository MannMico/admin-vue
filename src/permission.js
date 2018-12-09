import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import * as Auth from '@/utils/auth';
import Constant from '@/utils/config'

NProgress.configure({ showSpinner: true })

/**
 * 判断是否有权限
 * @param {Array}
 * @param {any}
 * @returns Boolean
 */
const whiteList = ['/login'];
const noBackUrlList = ['/404']

router.beforeEach((to, from, next) => {
  NProgress.start();
  let routeName = to.meta.title || to.name;
  if (Auth.getToken(Constant.token)) {
    if (to.path == '/login') {
      next({path: '/'})
      NProgress.done();
    } else {
      // 是否已经获取用户信息
      if (!store.getters.status) {
        // 没有获取用户信息 => 获取
        store.dispatch('GetUserInfo')
          .then(() => {
            store.dispatch('GetMenulists')
              .then(() => {
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                let backFullPath = localStorage.getItem('backFullPath')
                localStorage.removeItem('backFullPath')
                if (backFullPath) {
                  location.href = backFullPath
                } else {
                  next({ ...to, replace: true })
                }
              })
              .catch(err => Message.error(err))
            store.dispatch('GetMyPermissons')
            store.dispatch('GetCitys')
          })
          .catch((err) => {
            err = err || '获取用户信息失败，请重新登录'
            // 不在登录页面的时候
            if (from.path === '/login') {
              Message.error(err)
              setTimeout(() => {
                location.reload();
              }, 3100);
              return
            }
            // 获取信息失败，重新获取
            store.dispatch('FedLogOut')
              .then(() => {
                Message.error(err)
                next({ path: '/login' })
              })
          })
      } else {
        // 适用于不需要动态添加权限的需求
        /* if (hasPermisson(store.getters.roles, to.meta.roles)) {
          window.document.title = routeName || '洛客-后台系统';
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true } })
        } */
        window.document.title = routeName || '洛客-后台系统';
        next()
      }
    }
  } else {
    // 没有登录
    if (whiteList.indexOf(to.path) !== -1) {
      // 不用登录页面，可直接登录
      window.document.title = routeName || '洛客-后台系统';
      next()
    } else {
      // 统一跳转到login页面
      try {
        // 记录当前地址跟参数
        if (noBackUrlList.indexOf(to.path) === -1) {
          localStorage.setItem('backFullPath', to.fullPath)
        }
      } catch (e) {
        throw new Error(e)
      }
      next('/login')
      NProgress.done();
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
