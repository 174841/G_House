<template>
  <div>
    <BreadcrumbNav>
      <template v-slot:firstMenu>分类管理</template>
      <template v-slot:secondMenu>分类列表</template>
    </BreadcrumbNav>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 渲染分类列表数据 -->
      <el-table row-key="id" :tree-props="{children: 'children'}" height="700" :data="categoryList">
        <el-table-column label="分类名称" prop="name"></el-table-column>
        <!-- 是否禁用 -->
        <el-table-column label="是否已禁用" prop="status">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              @change="cateStateChange(scope.row.id)"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
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
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog @close="addDialogClosed" title="添加分类" :visible.sync="addDialogVisible" width="30%">
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input clearable v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="pid">
          <el-cascader
            :options="categoryList"
            :props="{ value: 'id', checkStrictly: true ,children:'children',label:'name'}"
            clearable
            @change="addParentCategoryChange"
            placeholder="选择所属分类，不选择时为顶级分类"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addUserInfo" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类 -->
    <el-dialog @close="editDialogClosed" title="修改分类" :visible.sync="editDialogVisible" width="50%">
      <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input clearable v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="pid">
          <el-cascader
            :options="categoryList"
            :props="{ value: 'id', checkStrictly: true ,children:'children',label:'name'}"
            clearable
            :value="editForm.pid"
            @change="editParentCategoryChange"
            placeholder="选择所属分类，不选择时为顶级分类"
          ></el-cascader>
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
import BreadcrumbNav from '@/components/BreadcrumbNav'
import * as $http from "@/api/cate"
export default {
  name: 'CatesGyy',
  components: {
    BreadcrumbNav,
  },
  data() {
    return {
      categoryList: [],
      queryInfo: {
        type: 'all'
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }, { min: 3, max: 10, message: '名称的长度在3~10个字符之间', trigger: 'blur' },
        ],

      },
      addDialogVisible: false,
      addForm: {
        name: '',
        pid: 0
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }, { min: 3, max: 10, message: '名称的长度在3~10个字符之间', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    async getCategoryList() {
      this.categoryList = await $http.getCategoriesListRequest(this.queryInfo)

      console.log(this.categoryList);
    },
    async cateStateChange(id) {
      await $http.changCategoryStateRequest(id)
    },
    addParentCategoryChange(selectedkeys) {
      console.log(selectedkeys);
      console.log(this.addForm.pid);
      if (selectedkeys.length > 0) {
        this.addForm.pid = selectedkeys[selectedkeys.length - 1]
        return
      }
      this.addForm.pid = 0
    },
    async showEditDialog(id) {
      console.log(id);
      this.editForm = await $http.getCategoryByIdRequest(id)
      this.editDialogVisible = true
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        await $http.editCategoryByIdRequest(this.editForm);
        this.editDialogVisible = false;
        this.getCategoryList();
      })
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    addUserInfo() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        await $http.addCategoryRequest(this.addForm);
        this.addDialogVisible = false;
        this.getCategoryList();
      })
    },
    editParentCategoryChange(selectedkeys) {
      console.log(selectedkeys);
      if (selectedkeys.length > 0) {
        this.editForm.pid = selectedkeys[selectedkeys.length - 1]
        return
      }
      this.editForm.pid = 0
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>
<style lang="">
</style>