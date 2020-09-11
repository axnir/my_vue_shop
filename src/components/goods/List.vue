<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加按钮</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- table表格区域 -->
    <el-table :data="goodsList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间" prop="add_time">
        <template v-slot="scope">
          <!-- 调用过滤器，管道符 -->
          {{scope.row.add_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button icon="el-icon-edit" type="primary" size="mini"></el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
            @click="deleteById(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询参数对象
      queryInfo: {
        // 查询名称
        query: '',
        // 当前页码数
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取相应的商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 每页显示条数发生变化时
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 当前页码发生变化是
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 根据id删除商品
    async deleteById (goodsId) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除商品')
      }
      const { data: res } = await this.$http.delete(`goods/${goodsId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('商品删除失败')
      }
      this.getGoodsList()
    },
    // 添加跳转按钮
    goAddPage () {
      // 路由跳转
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
