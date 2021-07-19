<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">工号</label>
        <el-input v-model="query.jobNumber" clearable placeholder="工号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">姓名</label>
        <el-input v-model="query.userName" clearable placeholder="姓名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">考勤月份</label>
        <el-date-picker v-model="query.month" type="month" class="filter-item" style="width: 185px;" placeholder="请选择考勤月份" :clearable="false" @input="onInput()" @change="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="缺勤天数" prop="absenceDays">
            <el-input v-model="form.absenceDays" type="number" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="迟到天数" prop="late">
            <el-input v-model="form.late" type="number" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        default-expand-all
        row-key="orgPath"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="jobNumber" label="工号" />
        <el-table-column prop="userName" label="姓名" />
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudstructure from '@/api/website/websitType'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, userName: null, jobNumber: null, month: null, attendanceDays: null, absenceDays: null, late: null }
export default {
  name: 'Structure',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '分类', idField: 'id', crudMethod: { ...crudstructure }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'attendance:add'],
        edit: ['admin', 'attendance:edit'],
        del: ['admin', 'attendance:del']
      },
      rules: {
        jobNumber: { required: true, message: '工号不能为空', trigger: 'blur' },
      }
    }
  },
  methods: {
    // 刷新 - 之前
    [CRUD.HOOK.beforeRefresh](crud) {
      return true
    },
    // 编辑 - 之前
    [CRUD.HOOK.beforeToEdit](crud) {
      return true
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      return true
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
