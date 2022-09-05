<template>
  <div>
    <!-- 面包屑 -->
    <BreadcrumbNav>
      <template v-slot:firstMenu>评价管理</template>
      <template v-slot:secondMenu>评价列表</template>
    </BreadcrumbNav>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="22">
          <el-form :inline="true" ref="searchFormRef" :model="queryInfo" size="mini">
            <el-form-item label="商品名:" prop="title">
              <el-input v-model="queryInfo.title"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-refresh" type="primary">重置</el-button>
              <el-button icon="el-icon-search" type="primary">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 商品数据 -->
        <el-table>
          <!-- 商品名 -->
          <el-table-column label="内容"></el-table-column>
          <!-- 价格 -->
          <el-table-column label="评级"></el-table-column>
          <!-- 库存 -->
          <el-table-column label="星级"></el-table-column>

          <!-- 支付时间 -->
          <el-table-column label="回复"></el-table-column>
          <!-- 支付类型 -->
          <el-table-column label="评价时间"></el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-row>
      <el-pagination layout="prev, pager, next" :total="1"></el-pagination>
    </el-card>
  </div>
</template>
<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
export default {
  name: 'GyyPages',
  components: {
    BreadcrumbNav,
  },
  data() {
    return {
      queryInfo: {
        title: ''
      }
    }
  },
}
</script>
<style lang="">
</style>