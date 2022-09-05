<template>
  <div>
    <BreadcrumbNav>
      <template v-slot:firstMenu>轮播管理</template>
      <template v-slot:secondMenu>轮播列表</template>
    </BreadcrumbNav>

    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="addDialogVisible = true">添加轮播图</el-button>
        </el-col>
      </el-row>

      <el-table :data="slideList">
        <el-table-column prop="img_url" label="轮播图片">
          <template slot-scope="scope">
            <el-image fit="contain" style="width: 100px;height: 100px;" :src="scope.row.img_url"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="url" label="跳转链接"></el-table-column>
        <el-table-column prop="status" label="是否启用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="sildeStateChange(scope.row.id)"
            ></el-switch>
          </template>
        </el-table-column>

        <!-- 排序 -->
        <el-table-column prop="seq" label="排序">
          <template slot-scope="scope">
            <el-input-number
              :max="20"
              :min="1"
              @change="slideSeqChange(scope.row)"
              size="small"
              v-model="scope.row.seq"
            ></el-input-number>
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

            <!-- 删除按钮 -->
            <el-button
              @click="removeSlideById(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
              type="danger"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改轮播图 -->
    <el-dialog
      @close="editDialogClosed"
      title="修改轮播图"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="100px">
        <el-form-item label="名称" prop="title">
          <el-input clearable v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" prop="img">
          <el-input clearable v-model="editForm.img"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="url">
          <el-input clearable v-model="editForm.url"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button @click="editUserInfo" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加轮播图 -->
    <el-dialog @close="addDialogClosed" title="添加轮播图" :visible.sync="addDialogVisible" width="50%">
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input clearable v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" prop="img">
          <el-input clearable v-model="addForm.img"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="url">
          <el-input clearable v-model="addForm.url"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch :active-value="1" :inactive-value="0" v-model="addForm.status"></el-switch>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BreadcrumbNav from '@/components/BreadcrumbNav'
import * as $http from "@/api/slide"
export default {

  name: 'SlidesGyy',
  components: {
    BreadcrumbNav,
  },
  data() {
    return {
      slideList: [],
      queryInfo: {
        current: 1
      },
      pager: {

      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' }, { min: 3, max: 10, message: '名称的长度在3~10个字符之间', trigger: 'blur' },
        ],
        img: [
          { required: true, message: '请输入图片地址', trigger: 'blur' }, { type: 'url', message: '请输入正确的图片地址', trigger: ['blur', 'change'] },
        ],
        url: [
          { required: true, message: '请输入跳转链接', trigger: 'blur' }, { type: 'url', message: '请输入正确的跳转链接', trigger: ['blur', 'change'] },
        ]
      },
      addDialogVisible: false,
      addForm: {
        title: '',
        img: '',
        url: '',
        status: 1
      },
      addFormRules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' }, { min: 3, max: 10, message: '名称的长度在3~10个字符之间', trigger: 'blur' },
        ],
        img: [
          { required: true, message: '请输入图片地址', trigger: 'blur' }, { type: 'url', message: '请输入正确的图片地址', trigger: ['blur', 'change'] },
        ],
        url: [
          { required: true, message: '请输入跳转链接', trigger: 'blur' }, { type: 'url', message: '请输入正确的跳转链接', trigger: ['blur', 'change'] },
        ]
      },
    }
  },
  methods: {
    async getSlideList() {
      const { data, meta } = await $http.getSlideListRequest(this.queryInfo)
      this.slideList = data
      this.pager = meta.pagination
      console.log(this.slideList)
    },
    async sildeStateChange(id) {
      console.log(id);
      await $http.changeSlideStateRequest(id)
    },
    async slideSeqChange(slide) {
      await $http.changeSlideSeqRequest(slide)
    },
    async showEditDialog(id) {
      console.log(id);
      this.editForm = await $http.getSlideByIdRequest(id)
      this.editDialogVisible = true
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        await $http.editSlideByIdRequest(this.editForm);
        this.editDialogVisible = false;
        this.getSlideList();
      })
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        await $http.addUserRequest(this.addForm);
        this.addDialogVisible = false;
        this.getSlideList();
      })
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    removeSlideById(id) {
      this.$confirm("此操作将删除该图片,是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
      }).then(async () => {
        await $http.removeSlideByIdRequest(id);
        this.getSlideList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created() {
    this.getSlideList()
  }
}
</script>
<style lang="">
</style>