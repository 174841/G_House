<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-logo">
        <img src="../assets/logo.png" alt />
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左边侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="rgb(64,158,255)"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="paths[subItem.id]"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState(paths[subItem.id])"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { getMenuListRequest } from '@/api/home'

export default {
  name: 'HomeGyy',

  data() {
    return {
      // 左侧菜单数据
      // menulist: [],
      menuData: [],
      iconsObj: {
        24: 'iconfont icon-yonghuming',
        26: 'iconfont icon-yingyong',
        29: 'iconfont icon-shangpin',
        32: 'iconfont icon-daipingjia',
        34: 'iconfont icon-dingdan-quanbudingdan',
        36: 'iconfont icon-lunbo',
        39: 'iconfont icon-tijikongjian'
      },
      paths: {
        25: '/users',
        27: '/cares',
        30: '/goods',
        33: '/comments',
        35: '/orders',
        37: '/pics',
        40: '/menus'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      this.menuData = await getMenuListRequest()
      console.log(this.menuData)
    },
    // 点击按钮切换菜单折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }


  },
  computed: {
    menulist() {
      const list = this.menuData;
      list.forEach((first) => {
        let menus = first.children;
        let newSeconds = menus.filter((el) => {
          return !el.name.includes("添加");
        })
        first.children = newSeconds;
      });
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/fonts/iconfont.css";
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
}
.el-aside {
  background-color: #333744;
  color: white;
  user-select: none;
  transition: width 0.3s;
}
.el-main {
  background-color: #eaedf1;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  .header-logo {
    display: flex;
    align-items: center;
    img {
      height: 50px;
    }
  }
}
.iconfont {
  font-size: 20px;
  &::before {
    margin-right: 12px;
  }
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: rgb(144, 147, 153);
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>