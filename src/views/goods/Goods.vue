<template>
  <div>
    <!-- 面包屑 -->
    <BreadcrumbNav>
      <template v-slot:firstMenu>商品管理</template>
      <template v-slot:secondMenu>商品列表</template>
    </BreadcrumbNav>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="22">
          <el-form
            :inline="true"
            ref="searchFormRef"
            :model="queryInfo"
            size="mini"
          >
            <el-form-item label="商品名称:" prop="title">
              <el-input v-model="queryInfo.title"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="category_id">
              <el-cascader
                :options="categoryList"
                :props="{ value: 'id', children: 'children', label: 'name' }"
                clearable
                :value="queryInfo.category_id"
                @change="queryParentCategoryChange"
                placeholder="选择分类"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="是否上架:" prop="is_on">
              <el-radio-group size="mini" v-model="queryInfo.is_on">
                <el-radio-button label="1">已上架</el-radio-button>
                <el-radio-button label="0">未上架</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否推荐:" prop="is_recommend">
              <el-radio-group size="mini" v-model="queryInfo.is_recommend">
                <el-radio-button label="1">已推荐</el-radio-button>
                <el-radio-button label="0">未推荐</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-refresh"
                type="primary"
                @click="searchReset"
                >重置</el-button
              >
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="searchList"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加商品</el-button
          >
        </el-col>
        <!-- 展示的表格 -->
        <el-table :data="goodList">
          <!-- 图片 -->
          <el-table-column label="图片" prop="cover_url" width="80">
            <template slot-scope="scope">
              <el-image
                :preview-src-list="[scope.row.cover_url]"
                :src="scope.row.cover_url"
                fit="contain"
                style="width: 60px; height: 60px"
              ></el-image>
            </template>
          </el-table-column>
          <!-- 商品名 -->
          <el-table-column label="商品名" prop="title"></el-table-column>
          <!-- 价格 -->
          <el-table-column label="价格" prop="price"></el-table-column>
          <!-- 库存 -->
          <el-table-column label="库存" prop="stock"></el-table-column>
          <!-- 销量 -->
          <el-table-column label="销量" prop="sales"></el-table-column>
          <!-- 上架状态 -->
          <el-table-column label="是否上架" prop="is_on" width="120">
            <template slot-scope="scope">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                @change="goodOnChange(scope.row.id)"
                v-model="scope.row.is_on"
              ></el-switch>
            </template>
          </el-table-column>

          <!-- 是否推荐 -->
          <el-table-column label="是否推荐" prop="is_recommend" width="120">
            <template slot-scope="scope">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                @change="goodRecommendChange(scope.row.id)"
                v-model="scope.row.is_recommend"
              ></el-switch>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-tooltip
                :enterable="false"
                content="编辑"
                effect="dark"
                placement="top-start"
              >
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
      </el-row>
      <el-pagination
        @current-change="handleSizeChange"
        :current-page="queryInfo.current"
        :page-size="pager.per_page"
        layout="total, prev, pager, next, jumper"
        :total="pager.total"
      ></el-pagination>
    </el-card>

    <!-- 添加商品 -->
    <el-dialog
      @close="addDialogClosed"
      title="添加商品"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm">
        <el-form-item label="分类" prop="category_id">
          <el-cascader
            :options="categoryList"
            :props="{
              value: 'id',
              children: 'children',
              label: 'name',
              checkStrictly: true,
            }"
            clearable
            :value="queryInfo.category_id"
            @change="queryParentCategoryChange"
            placeholder="选择分类"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input clearable v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述(255字以内)" prop="description">
          <el-input clearable v-model="addForm.description"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input clearable v-model.number="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input clearable v-model.number="addForm.stock"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-input clearable v-model.number="addForm.cover"></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="details">
          <div style="border: 1px solid #ccc; clear: both">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="addEditor"
              :mode="mode"
            />
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="addForm.details"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑商品 -->
    <el-dialog
      @close="editDialogClosed"
      title="修改商品"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        ref="editFormRef"
        :rules="editFormRules"
        :model="editForm"
        label-width="100px"
      >
        <el-form-item label="分类" prop="category_id">
          <el-cascader
            :options="categoryList"
            :props="{
              value: 'id',
              children: 'children',
              label: 'name',
              checkStrictly: true,
            }"
            clearable
            :value="editForm.category_id"
            @change="editParentCategoryChange"
            placeholder="选择分类"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input clearable v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述(255字以内)" prop="description">
          <el-input clearable v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input clearable v-model.number="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input clearable v-model.number="editForm.stock"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-input clearable v-model.number="editForm.cover"></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="details">
          <div style="border: 1px solid #ccc; clear: both">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editEditor"
              :mode="mode"
            />
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="editForm.details"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated2"
            />
          </div>
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
import BreadcrumbNav from "@/components/BreadcrumbNav";
import * as $http from "@/api/good";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
  name: "GoodsGyy",
  components: {
    BreadcrumbNav,
    Editor,
    Toolbar,
  },
  data() {
    return {
      categoryList: [],
      goodList: [],
      queryInfo: {
        current: 1,
        title: "",
        is_on: null,
        is_recommend: null,
        category_id: null,
      },
      pager: {},
      editForm: {},
      editDialogVisible: false,
      addForm: {
        category_id: 0,
        title: "",
        description: "",
        price: 0,
        stock: 0,
        cover: "",
        details: "",
      },
      // 编辑器设置
      addEditor: null,
      editEditor: null,
      mode: "simple",
      editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {},
      },
      addDialogVisible: false,
      addFormRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "标题的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        description: [
          { required: true, message: "请输入描述内容", trigger: "blur" },
          {
            min: 3,
            max: 255,
            message: "名称的长度在3~255个字符之间",
            trigger: "blur",
          },
        ],
        price: [
          { required: true, message: "价格不能为空" },
          { type: "number", message: "价格必须为数字值" },
        ],
        stock: [
          { required: true, message: "库存不能为空" },
          { type: "number", message: "库存必须为数字值" },
        ],
        cover: [
          { required: true, message: "请输入封面", trigger: "blur" },
          {
            type: "url",
            message: "请输入正确的图片地址",
            trigger: ["blur", "change"],
          },
        ],
      },
      editFormRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "标题的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        description: [
          { required: true, message: "请输入描述内容", trigger: "blur" },
          {
            min: 3,
            max: 255,
            message: "名称的长度在3~255个字符之间",
            trigger: "blur",
          },
        ],
        price: [
          { required: true, message: "价格不能为空" },
          { type: "number", message: "价格必须为数字值" },
        ],
        stock: [
          { required: true, message: "库存不能为空" },
          { type: "number", message: "库存必须为数字值" },
        ],
        cover: [
          { required: true, message: "请输入封面", trigger: "blur" },
          {
            type: "url",
            message: "请输入正确的图片地址",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    async getGoodList() {
      const { data, meta } = await $http.getGoodsListRequest(this.queryInfo);
      this.goodList = data;
      this.pager = meta.pagination;
      console.log(this.goodList);
    },
    async goodOnChange(id) {
      await $http.changGoodOnRequest(id);
    },
    async goodRecommendChange(id) {
      await $http.changGoodRecommendRequest(id);
    },
    async showEditDialog(id) {
      this.editForm = await $http.getGoodByIdRequest(id);
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    handleSizeChange(e) {
      this.queryInfo.current = e;
      this.getGoodList();
    },
    // 获取分类数据
    async getCategoryList() {
      this.categoryList = await $http.getCategoriesListRequest();
    },
    queryParentCategoryChange(selectedkeys) {
      console.log(selectedkeys);
      if (selectedkeys.length > 0) {
        this.addForm.category_id = selectedkeys[selectedkeys.length - 1];
        return;
      }
      this.addForm.category_id = 0;
    },
    editParentCategoryChange(selectedkeys) {
      console.log(selectedkeys);
      if (selectedkeys.length > 0) {
        this.editForm.category_id = selectedkeys[selectedkeys.length - 1]
        return
      }
      this.editForm.category_id = 0
    },
    searchReset() {
      this.$refs.searchFormRef.resetFields();
      this.searchList();
    },
    searchList() {
      this.queryInfo.current = 1;
      this.getGoodList();
    },
    // 编辑器功能
    onCreated(e) {
      this.addEditor = Object.seal(e);
    },
    onCreated2(e) {
      this.editEditor = Object.seal(e);
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        await $http.addGoodRequest(this.addForm);
        this.addDialogVisible = false;
        this.getGoodList();
      });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async showEditDialog(id) {
      console.log(id);
      this.editForm = await $http.getGoodByIdRequest(id)
      this.editDialogVisible = true
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        await $http.editGoodByIdRequest(this.editForm);
        this.editDialogVisible = false;
        this.getGoodList();
      })
    },
  },
  created() {
    this.getGoodList();
    this.getCategoryList();
  },
  beforeDestroy() {
    const addEditor = this.addEditor;
    if (addEditor == null) return;
    addEditor.destroy();

    const editEditor = this.editEditor;
    if (editEditor == null) return;
    editEditor.destroy();
  },
};
</script>
<style lang="scss" scoped>
</style>
<style src="@wangeditor/editor/dist/css/style.css"></style>