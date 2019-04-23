<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isShow?'65px':'200px'">
        <div class="toggle_bar" @click="isShow=!isShow">|||</div>
        <el-menu 
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409EFF"
        :unique-opened="true" 
        :collapse="isShow"
        :collapse-transition="false"
        >
          <el-submenu 
           :index="item.id+''"
           v-for="(item,k) in sideLIst"
           :key="item.id"
           :style="{width:isShow?'65px':'200px'}"
          >
            <template slot="title">
              <i :class="'iconfont icon-'+ iconList[k]"></i>
              <span>{{ item.authName }}</span>
            </template> 
             <el-menu-item 
             :index="item.id+'-'+item2.id"
             v-for="item2 in item.children"
             :key="item2.id"
             >
             <i class="el-icon-menu"></i>
             <span>{{ item2.authName }}</span>
             </el-menu-item> 
          </el-submenu>
          </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created(){
    this.getSideList()
  },
  methods:{
    logout(){
      this.$confirm('确定要退出系统吗?', '退出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          // 清除token
          window.sessionStorage.removeItem('token')
          // 重定向login页面
          this.$router.push('/login')
        })
        .catch(() => {})        
    },
    async getSideList(){
      const { data: dt} = await this.$http.get('menus')
      if(dt.meta.status !== 200) {
        return this.$message.error()
      }
      this.sideLIst = dt.data
    }
  },
  data(){
    return {
      iconList:[
        'users', 'tijikongjian', 'shangpin', 'danju', 'baobiao'
      ],
      sideLIst: [],
      // 左侧折叠开关
      isShow: false
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    padding: 0;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    .logo-box {
      display: flex;
      font-size: 22px;
      color: #fff;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle_bar {
      background-color: #4a5064;
      color: #fff;
      text-align: center;
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      // 空隙间距
      letter-spacing: 0.1em;
      user-select: none;
      // 鼠标悬停小手
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
