<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格 -->
    <tree-table
      class="treeTable"
      :data="cateList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="#"
      border
      :show-row-hover="false"
    >
      <!-- 是否有效 -->
      <template slot="isok" scope="scope">
        <i
          class="el-icon-success"
          v-if="scope.row.cat_deleted === false"
          style="color: lightgreen;"
        ></i>
        <i class="el-icon-error" v-else style="color: red;"></i>
      </template>
      <!-- 排序 -->
      <template slot="order" scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag size="mini" v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
        <el-tag size="mini" v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="option" scope="scope">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="showEditCateDialog(scope.row)"
        >编辑</el-button>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="removeCate(scope.row.cat_id)"
        >删除</el-button>
      </template>
    </tree-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @closed="dialogClosed('addCateFormRef')"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="添加分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form ref="editCateFormRef" :model="editCateForm" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 数据
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 总数据条数
      total: 0,
      // 为TreeTable指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 将当前列定义为模板列
        type: 'template',
        // 这一列使用的模板名称
        template: 'isok'
      },
      {
        label: '排序',
        // 将当前列定义为模板列
        type: 'template',
        // 这一列使用的模板名称
        template: 'order'
      },
      {
        label: '操作',
        // 将当前列定义为模板列
        type: 'template',
        // 这一列使用的模板名称
        template: 'option'
      }],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类表单
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类等级,默认为一级分类
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器
      cascaderProps: {
        // checkStrictly是否严格的遵守父子节点不互相关联
        checkStrictly: true,
        // expandTrigger选择点击还是hover
        expandTrigger: 'hover',
        // 指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // 指定选项标签为选项对象的某个属性值
        label: 'cat_name',
        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      },
      // 选中的父级分类id
      selectedKeys: [],
      // 控制编辑对话框的显示与隐藏
      editCateDialogVisible: false,
      // 控制删除对话框的显示与隐藏
      deleteCateDialogVisible: false,
      // 编辑列表
      editCateForm: {}
    }
  },
  //   生命周期created
  created () {
    this.getCateList()
  },
  //   方法
  methods: {
    // 获取商品分类信息
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        this.$message.error('获取分类数据失败')
      }
      // 保存数据列表和数据总条数
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 显示添加分类对话框
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      // 保存父级分类列表
      this.parentCateList = res.data
    },
    // 级联选择器发生变化后执行
    parentCateChanged () {
      // 如果selectedKeys数组中的length大于0，证明选中父级分类
      // 反之，就说明没有选中任何父级分类
      // 父级分类id
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 分类等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        }
        // 隐藏对话框
        this.addCateDialogVisible = false
        // 刷新分类列表
        this.getCateList()
      })
    },
    // 监听对话框关闭事件，重制表单数据
    dialogClosed (formRef) {
      this.$refs[formRef].resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 展示编辑对话框
    showEditCateDialog (cateInfo) {
      this.editCateForm = cateInfo
      this.editCateDialogVisible = true
    },
    // 点击按钮编辑分类
    async editCate () {
      const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getCateList()
      this.$message.success('分类信息编辑成功')
      this.editCateDialogVisible = false
    },
    // 点击按钮删除分类
    async removeCate (cateId) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除已取消')
      }
      const { data: res } = await this.$http.delete(`categories/${cateId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('分类删除失败')
      }
      this.$message.success('分类删除成功')
      // 更新分类列表
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  padding-left: 10px;
}
</style>
