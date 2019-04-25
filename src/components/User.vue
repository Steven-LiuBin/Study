<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialog"
      width="50%"
      @close="$refs.editUserRef.resetFields()"
    >
      <el-form :model="editUser" :rules="editUserRules" ref="editUserRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="xiugai()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="50%"
      @close="$refs.addUserRef.resetFields()"
    >
      <el-form :model="addUser" :rules="addUserRules" ref="addUserRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="tianjia()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 卡片区 -->
    <el-card class="box-card">
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
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdit(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              placement="top"
              effect="dark"
              content="分配角色"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
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
    xiugai() {
      this.$refs.editUserRef.validate(async valid => {
        if (valid === true) {
          // 获取修改数据传递给服务器
          const { data: dt } = await this.$http.put(
            'users/' + this.editUser.id,
            this.editUser
          )
          // 判断修改失败、成功
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.message.msg)
          }
          // 修改成功，关闭对话框、成功提示、刷新用户列表
          this.$message.success(dt.meta.msg)
          this.editUserDialog = false
          this.getUserList()
        }
      })
    },
    // 显示修改弹出框--修改用户信息
    async showEdit(id) {
      // 获取被修改用户信息
      const { data: dt } = await this.$http.get('users/' + id)
      // 将获取的数据赋值给表单数据
      this.editUser = dt.data
      // 显示对话框
      this.editUserDialog = true
    },
    // 显示删除弹出框--删除用户信息
    delUser(id) {
      this.$confirm('确认删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 删除逻辑
          const { data: dt } = await this.$http.delete('users/' + id)
          // 删除失败提示
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 删除成功提示
          this.$message.success(dt.meta.msg)
          // 若当前页码只有一个数据，并不是第一页，删除后请给页码 -1 操作
          if (this.userList.length === 1 && this.querycdt.pagenum) {
            this.querycdt.pagenum--
          }
          // 刷新数据
          this.getUserList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加用户表单，点击提交再次校验
    tianjia() {
      this.$refs.addUserRef.validate(async valid => {
        if (valid === true) {
          // 添加好的表单域数据储存到服务器
          const { data: dt } = await this.$http.post('users', this.addUser)
          // 判断提示信息
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          // 数据添加成功 提示信息，关闭添加弹出框（对话框），数据再次刷新
          this.$message.success(dt.meta.msg)
          this.addUserDialog = false
          this.getUserList()
        }
      })
    },
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
    // 获取用于显示的真实用户数据
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
    // 手机号自定义校验
    var checkMobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error('手机号格式不正确'))
      }
      callback()
    }
    return {
      // 修改用户按钮--对话框显示标志
      editUserDialog: false,
      // 修改的校验表单规则
      editUserRules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 表单数据对象--添加弹出框
      editUser: {
        username: '',
        mobile: '',
        email: ''
      },
      // 添加的校验表单规则
      addUserRules: {
        usecrname: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 表单数据对象--添加弹出框
      addUser: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      // 添加用户按钮--对话框显示标志
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
