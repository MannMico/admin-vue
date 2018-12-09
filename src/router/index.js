import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

const _import = require('./_import_' + (process.env.NODE_ENV !== 'development' ? 'production' : 'development'))

Vue.use(Router)
Vue.use(ElementUI)

// 不需要权限、登录路由配置
export const baseRouter = [
  {
    path: '/',
    redirect: '/layout',
    hidden: true
  },
  {
    path: '/login',
    name: 'login',
    component: _import('Login'),
    hidden: true,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/layout',
    name: 'layout',
    component: _import('Layout/Layout'),
    type: 'welcome',
    redirect: '/welcome',
    children: [
      {
        path: 'welcome',
        alias: '/welcome',
        name: 'welcome',
        component: _import('Welcome'),
        meta: {
          title: '欢迎使用洛客后台管理',
          scrollTop: true
        }
      }
    ]
  },
  {
    path: '/401',
    name: 'page401',
    component: _import('Common/401'),
    hidden: true,
    meta: {
      title: '无权访问'
    }
  },
  {
    path: '/404',
    name: 'page404',
    component: _import('Common/404'),
    hidden: true,
    meta: {
      title: '找不到页面'
    }
  }
];

// 滚动信息
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    const position = {}

    // 滚动到锚点
    if (to.hash) {
      position.selector = to.hash
    }

    // 组件定义了是否滚动到顶部scrollTop
    if (to.matched.some(m => m.meta.scrollTop)) {
      position.x = 0
      position.y = 0
    }

    return position
  }
}

/**
 * @description 动态路由数组
 * @param {String} redirect 如果`redirect:noredirect`,面包屑导航中点击不跳转；需要跳转的，需要填入组件的path
 * @param {String} title 组件title，用于标签页，访问过的组件名显示
 * @param {String} icon 侧边栏模块对应的icon
 * @param {String} rule 权限列表中模块对应的name，如果不是侧边栏涉及的路由，用于具体业务中，如添加xxx，rule设置为''即可
 * @param {Boolean} noCache 是否需要缓存组件，默认`不缓存`，缓存的时候需要路由中的name跟具体组件中的name一致
 * @param {Boolean} hidden 是否在侧边栏显示，默认`显示`，例如：登录，404等页面需要设置为false
 */
export const asyncRouterMap = [
  {
    path: '/accounts',
    name: 'accounts',
    component: _import('Layout/Layout'),
    redirect: '/account',
    meta: { title: '账户管理', icon: 'icon-lkker-account', rule: 'v1.adminUser.user' },
    children: [
      {
        path: 'account',
        alias: '/account',
        name: 'account',
        component: _import('Accounts/Account'),
        meta: {
          title: '账户管理',
          rule: 'v1.adminUser.user.manager',
          noCache: true
        }
      },
      {
        path: 'identify',
        alias: '/identify',
        name: 'identify',
        component: _import('Accounts/Identify/index'),
        meta: {
          title: '身份管理',
          rule: 'v1.adminUser.identify.manager',
          noCache: true
        }
      },
      {
        path: 'organize',
        alias: '/organize',
        name: 'organize',
        component: _import('Accounts/Organize'),
        meta: {
          title: '运营中心管理',
          rule: 'v1.adminUser.organize.manager',
          noCache: true
        }
      },
      {
        path: 'role',
        alias: '/role',
        name: 'role',
        component: _import('Accounts/Role'),
        meta: {
          title: '用户组管理',
          rule: 'v1.adminUser.role.manager',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/permissions',
    name: 'permissions',
    component: _import('Layout/Layout'),
    redirect: '/permisson',
    meta: { title: '权限管理', icon: 'icon-lkker-permission', rule: 'v1.adminUser.permission.manager' },
    children: [
      {
        path: 'permisson',
        alias: '/permisson',
        name: 'permisson',
        component: _import('Permissions/Permission'),
        meta: {
          title: '权限列表',
          rule: 'v1.adminUser.permission.list',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/tags',
    name: 'tags',
    component: _import('Layout/Layout'),
    redirect: '/tag',
    meta: { title: '标签管理', icon: 'icon-lkker-tag', rule: 'v1.adminUser.tags.manager' },
    children: [
      {
        path: 'tag',
        alias: '/tag',
        name: 'tag',
        component: _import('Tag/Index'),
        meta: {
          title: '标签配置',
          rule: 'v1.adminUser.tags.setting',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/topic',
    name: 'topic',
    component: _import('Layout/Layout'),
    redirect: '/topiclist',
    meta: { title: '话题广场', icon: 'icon-lkker-topic', rule: 'v1.topic.manage' },
    children: [
      {
        path: 'topiclist',
        alias: '/topiclist',
        name: 'topiclist',
        component: _import('Topic/Topiclist'),
        meta: {
          title: '话题列表',
          rule: 'v1.topic.index',
          noCache: true
        }
      },
      {
        path: 'topicClassify',
        alias: '/topicClassify',
        name: 'topicClassify',
        component: _import('Topic/TopicClassify'),
        meta: {
          title: '话题分类',
          rule: 'v1.topic.type-list',
          noCache: true
        }
      },
      {
        path: 'recommendUser',
        alias: '/recommendUser',
        name: 'recommendUser',
        component: _import('Topic/RecommendUser'),
        meta: {
          title: '推荐用户',
          rule: 'v1.topic.user-recommend-list',
          noCache: true
        }
      },
      {
        path: 'commentAdmin',
        alias: '/commentAdmin',
        name: 'commentAdmin',
        component: _import('Topic/CommentAdmin'),
        meta: {
          title: '评论管理',
          rule: 'v1.comment.topic-square.index',
          noCache: true
        }
      },
      {
        path: 'topicDetail',
        alias: '/topicDetail',
        name: 'topicDetail',
        hidden: true,
        component: _import('Topic/TopicDetail'),
        meta: {
          title: '话题详情',
          rule: 'v1.topic.type-topic-list',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/awards',
    name: 'awards',
    component: _import('Layout/Layout'),
    redirect: 'noredirect',
    meta: { title: '报奖管理', icon: 'icon-lkker-award', rule: 'v1.adminUser.awards.manager' },
    children: [
      {
        path: 'application-list',
        name: 'ApplicationList',
        component: _import('ApplyForAwards/ApplicationList'),
        meta: {
          title: '报奖列表',
          rule: 'v1.adminUser.awards.list',
          noCache: true
        }
      },
      {
        path: 'awards-apply',
        name: 'AwardsApply',
        hidden: true,
        component: _import('ApplyForAwards/Apply'),
        meta: {
          title: '报奖申请',
          rule: 'v1.adminUser.awards.apply',
          noCache: true
        }
      },
      {
        path: 'select/:id',
        name: 'Select',
        hidden: true,
        component: _import('ApplyForAwards/Edit'),
        meta: {
          title: '查看报奖',
          rule: 'v1.adminUser.awards.view',
          noCache: true
        }
      },
      {
        path: 'update/:id',
        name: 'Update',
        hidden: true,
        component: _import('ApplyForAwards/Edit'),
        meta: {
          title: '编辑报奖',
          rule: 'v1.adminUser.awards.update',
          noCache: true
        }
      },
      {
        path: 'awards-list',
        name: 'AwardsList',
        component: _import('ApplyForAwards/AwardsList'),
        meta: {
          title: '奖项列表',
          rule: 'v1.adminUser.awards.prizes.list',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/channel',
    name: 'channels',
    component: _import('Layout/Layout'),
    redirect: '/channel/list',
    meta: { title: '渠道管理', icon: 'icon-lkker-channel', rule: 'v1.channel.channel.manager' },
    children: [
      {
        path: 'list',
        name: 'channelList',
        component: _import('Channel/ChannelList'),
        meta: {
          title: '渠道管理',
          rule: 'v1.channel.channel.query',
          noCache: true
        }
      },
      {
        path: 'detail/:utm_source',
        name: 'channelDetail',
        component: _import('Channel/ChannelDetail'),
        hidden: true,
        meta: {
          title: '渠道详情',
          rule: 'v1.channel.channel.query',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/data',
    name: 'datas',
    component: _import('Layout/Layout'),
    redirect: '/data/channel',
    meta: { title: '数据管理', icon: 'icon-lkker-data', rule: 'v1.analysis.manager' },
    children: [
      {
        path: 'channel',
        name: 'ChannelData',
        component: _import('Data/Channel/Index'),
        meta: {
          title: '渠道数据',
          rule: 'v1.channel.analysis.manager',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/design-power',
    name: 'design-power',
    component: _import('Layout/Layout'),
    redirect: 'noredirect',
    meta: { title: '设计合伙人', icon: 'icon-lkker-partner', rule: 'v1.designer.manage' },
    children: [
      {
        path: 'enroll-list',
        name: 'enrollList',
        component: _import('DesignPower/EnrollList'),
        meta: {
          title: '报名列表',
          rule: 'v1.designer.partner-enroll-list',
          noCache: true
        }
      },
      {
        path: 'task-list',
        name: 'taskList',
        component: _import('DesignPower/TaskList'),
        meta: {
          title: '任务列表',
          rule: 'v1.designer.partner-task-list',
          noCache: true
        }
      },
      {
        path: 'opus-list/:id',
        name: 'opusList',
        component: _import('DesignPower/OpusList'),
        hidden: true,
        meta: {
          title: '作品列表',
          rule: 'v1.designer.partner-opus-list',
          noCache: true
        }
      },
      {
        path: 'designer/:id',
        name: 'designerInfo',
        component: _import('DesignPower/DesignerInfo'),
        hidden: true,
        meta: {
          title: '设计师详情',
          rule: '',
          noCache: true
        }
      }

    ]
  },
  {
    path: '/smallProgram',
    name: 'smallProgram',
    component: _import('Layout/Layout'),
    redirect: '/sowingMap',
    meta: { title: '小程序管理', icon: 'icon-lkker-mini-app', rule: 'v1.draw.menu' },
    children: [
      {
        path: 'sowingMap',
        alias: '/sowingMap',
        name: 'sowingMap',
        component: _import('smallProgram/sowingMap'),
        meta: {
          title: '轮播图',
          rule: 'v1.draw.banner.menu',
          noCache: true
        }
      },
      {
        path: 'content',
        alias: '/content',
        name: 'content',
        component: _import('smallProgram/content'),
        meta: {
          title: '轮播图内容',
          rule: 'v1.draw.content.menu',
          noCache: true
        }
      },
      {
        path: 'theme',
        alias: '/theme',
        name: 'theme',
        component: _import('smallProgram/theme'),
        meta: {
          title: '主题',
          rule: 'v1.draw.theme.menu',
          noCache: true
        }
      },
      {
        path: 'works',
        alias: '/works',
        name: 'works',
        component: _import('smallProgram/works'),
        meta: {
          title: '作品',
          rule: 'v1.draw.opus.menu',
          noCache: true
        }
      },
      {
        path: 'user',
        alias: '/user',
        name: 'user',
        component: _import('smallProgram/user'),
        meta: {
          title: '用户',
          rule: 'v1.draw.users.menu',
          noCache: true
        }
      },
      {
        path: 'sowingMapDetail',
        alias: '/sowingMapDetail',
        name: 'sowingMapDetail',
        hidden: true,
        component: _import('smallProgram/sowingMapDetail'),
        meta: {
          title: '轮播详情页',
          rule: '',
          noCache: true
        }
      },
      {
        path: 'contentDetail',
        alias: '/contentDetail',
        name: 'contentDetail',
        hidden: true,
        component: _import('smallProgram/contentDetail'),
        meta: {
          title: '添加轮播内容详情页',
          rule: '',
          noCache: true
        }
      },
      {
        path: 'themeDetail',
        alias: '/themeDetail',
        name: 'themeDetail',
        hidden: true,
        component: _import('smallProgram/themeDetail'),
        meta: {
          title: '添加主题详情页',
          rule: '',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/good-product',
    name: 'good-product',
    component: _import('Layout/Layout'),
    redirect: '/product-list',
    meta: {
      title: '好产品管理',
      rule: 'v1.goodProduct',
      icon: 'icon-lkker-product'
    },
    children: [
      {
        path: '/product-list',
        name: 'product-list',
        alias: '/prdocutList',
        component: _import('GoodProduct/GoodProduct'),
        meta: {
          title: '好产品管理',
          rule: 'v1.goodProduct.manager',
          noCache: true
        }
      },
      {
        path: '/product-detail',
        name: 'product-detail',
        alias: '/prdocutDetail',
        component: _import('GoodProduct/ProductDetail'),
        hidden: true,
        meta: {
          title: '好产品详情',
          rule: '',
          noCache: true
        }
      },
      {
        path: '/add-product',
        name: 'add-product',
        alias: '/addproduct',
        component: _import('GoodProduct/AddProduct'),
        hidden: true,
        meta: {
          title: '新增好产品',
          rule: '',
          noCache: true
        }
      },
      {
        path: '/bulk-import',
        name: 'bulk-import',
        alias: '/bulkImport',
        component: _import('GoodProduct/BulkImport'),
        hidden: true,
        meta: {
          title: '批量导入好产品',
          rule: '',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/sku',
    name: 'sku',
    component: _import('Layout/Layout'),
    redirect: '/classification',
    meta: { title: 'SKU管理', icon: 'icon-lkker-sku', rule: 'v1.sku.manager' },
    children: [
      {
        path: 'classification',
        alias: '/classification',
        name: 'classification',
        component: _import('sku/classification'),
        meta: {
          title: '分类管理',
          rule: 'v1.sku.category.get',
          noCache: true
        }
      },
      {
        path: 'service',
        alias: '/service',
        name: 'service',
        component: _import('sku/service'),
        meta: {
          title: '服务列表',
          rule: 'v1.sku.spu.get',
          noCache: true
        }
      },
      {
        path: 'journalList',
        alias: '/journalList',
        name: 'journalList',
        component: _import('sku/journalList'),
        meta: {
          title: '日志列表',
          rule: '',
          noCache: true
        }
      },
      {
        path: 'journal/:id',
        alias: '/journal',
        name: 'journal',
        hidden: true,
        component: _import('sku/journal'),
        meta: {
          title: '日志明细',
          rule: '',
          noCache: true
        }
      },
      {
        path: 'seeServiceNum/:type/:id',
        name: 'seeServiceNum',
        hidden: true,
        component: _import('sku/seeServiceNum'),
        meta: {
          title: '查看服务数量',
          rule: '',
          noCache: true
        }
      },
      {
        path: 'addService',
        name: 'addService',
        hidden: true,
        component: _import('sku/addService'),
        meta: {
          title: '添加服务',
          rule: '',
          noCache: true
        }
      },
      {
        path: 'introSpu/:id',
        name: 'introSpu',
        hidden: true,
        component: _import('sku/introSpu'),
        meta: {
          title: '编辑服务介绍',
          rule: '',
          noCache: true
        }
      },
      {
        path: 'richText/:id',
        name: 'richText',
        hidden: true,
        component: _import('sku/richText'),
        meta: {
          title: 'SPU详情页',
          rule: '',
          noCache: true
        }
      },
      {
        path: 'editors/:id',
        name: 'editors',
        hidden: true,
        component: _import('sku/editors'),
        meta: {
          title: '服务列表',
          rule: '',
          noCache: true
        }
      },
      {
        path: 'seeService/:id',
        name: 'seeService',
        hidden: true,
        component: _import('sku/seeService'),
        meta: {
          title: '查看服务',
          rule: '',
          noCache: true
        }
      }
    ]
  },
  {
    path: 'couponHome',
    name: '/couponHome',
    component: _import('Layout/Layout'),
    redirect: 'noredirect',
    meta: { title: '优惠券', icon: 'el-icon-date', rule: 'v1.coupon.coupon.list' },
    children: [
      {
        path: 'coupon',
        alias: '/coupon',
        name: 'coupon',
        component: _import('Coupon/CouponHome'),
        meta: {
          title: '优惠券管理',
          rule: 'v1.coupon.coupon.export',
          noCache: true
        }
      },
      {
        path: 'coupon-creat',
        alias: '/coupon-creat',
        name: 'coupon-creat',
        component: _import('Coupon/CouponCreat'),
        hidden: true,
        meta: {
          title: '创建优惠券',
          rule: 'v1.coupon.coupon.export',
          noCache: true
        }
      },
      {
        path: 'coupon-info/:id',
        alias: '/coupon-info/:id',
        name: 'coupon-info',
        component: _import('Coupon/CouponInfo'),
        hidden: true,
        meta: {
          title: '优惠券详情',
          rule: 'v1.coupon.coupon.export',
          noCache: true
        }
      }
    ]
  },
  // 大会模板
  {
    path: '/conference',
    name: 'conference',
    component: _import('Layout/Layout'),
    meta: { title: 'H5大会模板', icon: 'icon-lkker-template', rule: 'v1.conference.menu' },
    children: [
      {
        path: 'list',
        name: 'conferenceList',
        component: _import('Conference/List'),
        meta: {
          title: '大会列表',
          rule: 'v1.conference.list.menu',
          noCache: true
        }
      },
      {
        path: '/conference/create/:id',
        name: 'TemplateCreate',
        component: _import('Conference/Create'),
        hidden: true,
        meta: {
          title: '新建大会模板',
          rule: '',
          noCache: true
        }
      },
      {
        path: '/conference/:id/coupon/list',
        name: 'couponList',
        component: _import('Conference/CouponList'),
        hidden: true,
        meta: {
          title: '优惠券列表',
          rule: '',
          noCache: true
        }
      },
      {
        path: '/conference/:id/coupon/detail',
        name: 'couponDetail',
        component: _import('Conference/CouponDetail'),
        hidden: true,
        meta: {
          title: '优惠券领取详情',
          rule: '',
          noCache: true
        }
      }
    ]
  },
  // 报名模板
  {
    path: '/enroll',
    name: 'enroll',
    component: _import('Layout/Layout'),
    meta: { title: 'H5报名模板', icon: 'icon-lkker-template', rule: 'v1.sign-up.menu' },
    children: [
      {
        path: 'list',
        name: 'EnrollTemplateList',
        component: _import('Enroll/EnrollTemplateList'),
        meta: {
          title: '报名模板列表',
          rule: 'v1.sign-up.list.menu',
          noCache: true
        }
      },
      {
        path: 'create',
        name: 'EnrollCreate',
        component: _import('Enroll/Create'),
        hidden: true,
        meta: {
          title: '新建报名模板',
          rule: '',
          noCache: true
        }
      },
      {
        path: '/enroll/edit/:id',
        name: 'EnrollEdit',
        component: _import('Enroll/Edit'),
        hidden: true,
        meta: {
          title: '编辑报名模板',
          rule: '',
          noCache: true
        }
      },
      {
        path: '/enroll/:id/list',
        name: 'EnrollList',
        component: _import('Enroll/EnrollList'),
        hidden: true,
        meta: {
          title: '报名列表',
          rule: '',
          noCache: true
        }
      }
    ]
  },
  {
    path: 'quoteList',
    name: '/quoteList',
    component: _import('Layout/Layout'),
    redirect: 'noredirect',
    meta: { title: '报价管理', icon: 'icon-lkker-quote', rule: 'v1.quotation.menu' },
    children: [
      {
        path: 'quote',
        alias: '/quote',
        name: 'quote',
        component: _import('quote/QuoteHome'),
        meta: {
          title: '报价列表',
          rule: 'v1.quotation.quotations.list',
          noCache: true
        }
      },
      {
        path: 'quote/service-identity',
        alias: '/quote/service-identity',
        name: 'service-identity',
        component: _import('quote/identity'),
        meta: {
          title: '服务身份管理',
          rule: 'v1.attendant.menu',
          noCache: true
        }
      },
      {
        path: 'quote/add-quote/:id/:type',
        alias: '/quote/add-quote/:id/:type',
        name: 'add-quote',
        component: _import('quote/AddQuote'),
        hidden: true,
        meta: {
          title: '新建报价单',
          rule: 'v1.quotation.quotations.create',
          noCache: true
        }
      },
      {
        path: 'quote/drafts',
        alias: '/quote/drafts',
        name: 'quote-drafts',
        component: _import('quote/Drafts'),
        hidden: true,
        meta: {
          title: '草稿箱',
          rule: 'v1.quotation.quotations.drafts.list',
          noCache: true
        }
      },
      {
        path: 'quote/quote-detail/:id',
        alias: '/quote/quote-detail/:id',
        name: 'quoteDetail',
        component: _import('quote/QuoteDetail'),
        hidden: true,
        meta: {
          title: '报价单详情',
          rule: 'v1.quotation.quotations.view',
          noCache: true
        }
      }
    ]
  },
  {
    path: 'payment-by-public',
    name: '/payment-by-public',
    component: _import('Layout/Layout'),
    redirect: 'noredirect',
    meta: { title: '财务管理', icon: 'icon-lkker-payment', rule: 'v1.financial.menu' },
    children: [
      {
        path: 'payment-by-public',
        alias: '/payment-by-public',
        name: 'payment-by-public',
        component: _import('ConllectRecord/paymentByPublic'),
        meta: {
          title: '对公转账支付管理',
          rule: 'v1.order.order.payments',
          noCache: true
        }
      },
      {
        path: 'public-detail/:id',
        alias: '/public-detail/:id',
        name: 'public-detail',
        component: _import('ConllectRecord/publicDetail'),
        meta: {
          title: '查看详情',
          rule: 'v1.order.order.payment',
          noCache: true
        }
      },
      {
        path: 'payment-water',
        alias: '/payment-water',
        name: 'payment-water',
        component: _import('ConllectRecord/paymentWater'),
        meta: {
          title: '收款流水管理',
          rule: 'v1.collection-record.menu',
          noCache: true
        }
      },
      {
        path: 'upload-data',
        alias: '/upload-data',
        name: 'upload-data',
        component: _import('ConllectRecord/uploadData'),
        hidden: true,
        meta: {
          title: '上传数据',
          rule: 'v1.collection-record.upload',
          noCache: true
        }
      }
    ]
  },
  {
    path: 'orderHome',
    name: '/orderHome',
    component: _import('Layout/Layout'),
    redirect: 'noredirect',
    meta: { title: '订单管理', icon: 'icon-lkker-order', rule: 'v1.order.menu' },
    children: [
      {
        path: 'order',
        alias: '/order',
        name: 'order',
        component: _import('Order/orderHome'),
        meta: {
          title: '订单管理',
          rule: 'v1.order.order.list',
          noCache: true
        }
      },
      {
        path: 'order-detail/:id',
        alias: '/order-detail/:id',
        name: 'order-detail',
        component: _import('Order/orderDetail'),
        hidden: true,
        meta: {
          title: '订单详情',
          rule: 'v1.order.order.view',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/mental',
    name: 'mental',
    component: _import('Layout/Layout'),
    redirect: '/mentalList',
    meta: { title: '脑力值管理', icon: 'icon-lkker-iq', rule: 'v1.points-manage.menu' },
    children: [
      {
        path: 'mentalList',
        alias: '/mentalList',
        name: 'mentalList',
        component: _import('Mental/MentalList'),
        meta: {
          title: '脑力值列表',
          rule: 'v1.points-manage.list.menu',
          noCache: true
        }
      },
      {
        path: 'mentalDetail',
        alias: '/mentalDetail',
        name: 'mentalDetail',
        hidden: true,
        component: _import('Mental/MentalDetail'),
        meta: {
          title: '脑力值详情',
          rule: '',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    component: _import('Layout/Layout'),
    redirect: '/questionList',
    meta: { title: '问卷管理', icon: 'icon-lkker-wenjuan', rule: 'v1.qnr.questionnaire' },
    children: [
      {
        path: 'questionList',
        alias: '/questionList',
        name: 'questionList',
        component: _import('Questionnaire/QuestionList'),
        meta: {
          title: '问卷列表',
          rule: 'v1.qnr.questionnaire.list',
          noCache: true
        }
      },
      {
        path: 'questionCreate',
        alias: '/questionCreate',
        name: 'questionCreate',
        hidden: true,
        component: _import('Questionnaire/QuestionCreate'),
        meta: {
          title: '问卷创建',
          rule: '',
          noCache: true
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

export default new Router({
  mode: 'history',
  routes: baseRouter,
  scrollBehavior
})
