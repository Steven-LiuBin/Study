<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 添加用户的对话框 -->
      <el-dialog title="提示" :visible.sync="addUserDialog" width="30%">
        <span>信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="addUserDialog = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="getUserList()"
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="8">
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据显示 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column property="username" label="用户名"></el-table-column>
        <el-table-column property="mobile" label="手机号" width="130"></el-table-column>
        <el-table-column property="role_name" label="角色"></el-table-column>
        <el-table-column property="email" label="邮箱"></el-table-column>
        <el-table-column property="mg_state" label="状态">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="270">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-tooltip class="item" placement="top" effect="dark" content="分配角色" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  methods: {
    // 每条记录条数变化的回调处理
    handleSizeChange(arg) {
      this.querycdt.pagesize = arg
      // 重新根据条件获得数据
      this.getUserList()
    },
    // 当前页码变化的回调处理
    handleCurrentChange(arg) {
      this.querycdt.pagenum = arg
      this.getUserList()
    },
    async getUserList() {
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 将获取的总记录条数的数目赋予tot
      this.tot = dt.data.total
      // 获获取到的数据赋值给userList
      this.userList = dt.data.users
    }
  },
  data() {
    return {
      // 添加对话框显示标志
      addUserDialog: false,
      // 设置总条数
      tot: 0,
      // 获取用户列表数据成员
      userList: [],
      // 获取查询用户数据的条件
      querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 3 // 每页显示数据条数
      }
      // tableData: [
      //   {
      //     date: '2016-05-02',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄'
      //   },
      //   {
      //     date: '2016-05-04',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1517 弄'
      //   }
      // ]
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>
