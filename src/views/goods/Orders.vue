<template>
  <div>
    <!-- 面包屑 -->
    <BreadcrumbNav>
      <template v-slot:firstMenu>订单管理</template>
      <template v-slot:secondMenu>订单列表</template>
    </BreadcrumbNav>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="22">
          <el-form :inline="true" ref="searchFormRef" :model="queryInfo" size="mini">
            <el-form-item label="单号:" prop="order_no">
              <el-input v-model="queryInfo.order_no"></el-input>
            </el-form-item>
            <el-form-item label="支付单号:" prop="trade_no">
              <el-input v-model="queryInfo.trade_no"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-refresh" type="primary" @click="searchReset">重置</el-button>
              <el-button icon="el-icon-search" type="primary" @click="searchList">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 商品数据 -->
        <el-table :data="goodList">
          <!-- 商品名 -->
          <el-table-column label="单号" prop="order_no"></el-table-column>
          <!-- 价格 -->
          <el-table-column label="用户" prop="user_id	"></el-table-column>
          <!-- 库存 -->
          <el-table-column label="金额" prop="amount"></el-table-column>
          <!-- 状态 -->
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 1 ? 'success' : 'danger'"
              >{{scope.row.status==1?'下单':''}}{{scope.row.status==2?'支付':''}}{{scope.row.status==3?'发货':''}}{{scope.row.status==4?'收货':''}}{{scope.row.status==5?'过期':''}}</el-tag>
            </template>
          </el-table-column>
          <!-- 支付时间 -->
          <el-table-column label="支付时间" prop="pay_time"></el-table-column>
          <!-- 支付类型 -->
          <el-table-column label="支付类型" prop="pay_type"></el-table-column>
          <!-- 支付单号 -->
          <el-table-column label="支付单号" prop="trade_no"></el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template>
              <!-- 修改按钮 -->
              <el-tooltip :enterable="false" content="详情" effect="dark" placement="top-start">
                <el-button icon="el-icon-edit" size="mini" type="primary"></el-button>
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
  </div>
</template>
<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import * as $http from "@/api/Orders";
export default {
  name: 'GyyPages',
  components: {
    BreadcrumbNav,
  },
  data() {
    return {
      queryInfo: {
        current: 1,
        order_no: "",
        trade_no: '',
      },
      pager: {},
      goodList: [],
      editForm: {},
      editDialogVisible: false
    }
  },
  methods: {
    async getGoodList() {
      await $http.getOrders(this.queryInfo).then((data) => {
        this.goodList = data.data
        this.pager = data.meta.pagination
      }).catch((err) => {
        console.log(err);
      });
    },
    handleSizeChange(e) {
      this.queryInfo.current = e;
      this.getGoodList();
    },
    searchReset() {
      this.$refs.searchFormRef.resetFields();
      this.searchList();
    },
    searchList() {
      console.log(this.queryInfo);
      this.queryInfo.current = 1;
      this.getGoodList();
    },
    async showEditDialog(id) {
      this.editForm = await $http.getXiangqin(id);
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
  },
  created() {
    this.getGoodList()
  },
}
</script>
<style lang="">
</style>