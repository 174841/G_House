<template>
  <div>
    <BreadcrumbNav>
      <template slot="firstMenu">用户管理</template>
      <template slot="secondMenu">用户列表</template>
    </BreadcrumbNav>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入邮箱"
            class="input-with-select"
            v-model="queryInfo.email"
            @clear="searchList"
            clearable
          >
            <el-button @click="searchList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table stripe border :data="userList">
        <el-table-column prop="avatar_url" label="头像">
          <template slot-scope="scope">
            <el-avatar :size="32" :src="scope.row.avatar_url"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="is_locked" label="是否已锁定">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_locked"
              :active-value="1"
              :inactive-value="0"
              @change="userStateChange(scope.row.id)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" content="编辑" effect="dark" placement="top-start">
              <el-button
                @click="showEditDialog(scope.row.id)"
                icon="el-icon-edit"
                size="mini"
                type="primary"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleSizeChange"
        :current-page="queryInfo.current"
        :page-size="pager.per_page"
        layout="total, prev, pager, next, jumper"
        :total="pager.total"
      ></el-pagination>
    </el-card>

    <el-dialog @close="addDialogClosed" title="添加用户" :visible.sync="addDialogVisible" width="30%">
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="70px">
        <el-form-item label="用户名" prop="name">
          <el-input clearable v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input clearable v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input clearable v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog @close="editDialogClosed" title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="70px">
        <el-form-item label="用户名" prop="name">
          <el-input clearable v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input clearable v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button @click="editUserInfo" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BreadcrumbNav from "@/components/BreadcrumbNav.vue"
import * as $http from "@/api/user"
export default {
  name: 'UserS',
  components: {
    BreadcrumbNav
  },
  data() {
    return {
      userList: [],
      queryInfo: {
        current: 1,
        email: ''
      },
      pager: {},
      addDialogVisible: false,
      addForm: {
        name: '',
        email: '',
        password: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }, { min: 6, max: 16, message: '长度在6到16个字符之间', trigger: 'blur' },
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data, meta } = await $http.getUserListRequest(this.queryInfo)
      this.userList = data,
        this.pager = meta.pagination

    },
    handleSizeChange(e) {
      this.queryInfo.current = e
      this.getUserList()
    },

    async userStateChange(userid) {
      await $http.changUserStateRequest(userid)
    },
    searchList() {
      this.queryInfo.current = 1
      this.getUserList()
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        await $http.addUserRequest(this.addForm);
        this.addDialogVisible = false;
        this.getUserList();
      })
    },
    async showEditDialog(id) {
      console.log(id);
      this.editForm = await $http.getUserByIdRequest(id)
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        await $http.editUserByIdRequest(this.editForm);
        this.editDialogVisible = false;
        this.getUserList();
      })
    }
  },
}
</script>
<style lang="">
</style>