<template>
    <div class="app-container">
      <el-form inline ref="form" :model="form" label-width="80px">
        <el-form-item label="车型">
          <el-select v-model="form.carType" placeholder="请选择车型">
            <el-option :label="item.code" :value="item.id" v-for="item in carTypeList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="reset">{{ $t('table.reset') }}</el-button>
          <el-button v-waves class="filter-item grey_bg" type="primary" icon="el-icon-plus" @click="add">{{ $t('table.add') }}</el-button>
          <el-button v-waves class="filter-item blue_bg" type="primary" icon="el-icon-edit" @click="editor">{{ $t('table.edit') }}</el-button>
          <el-button v-waves class="filter-item red_bg" type="primary" icon="el-icon-check" @click="save">{{ $t('table.save') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="singleTable"
        :data="tableData.filter(item => item.behaviourInfos.some(item2 => item2.configFlag === '0'))"
        highlight-current-row
        class="table-content"
        style="width: 100%"
        :max-height="maxHeightTable">
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-checkbox @change="handleCheckedRow(scope.row)" v-model="scope.row.checked"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="projectName"
          label="项目"
          width="120">
        </el-table-column>
        <el-table-column
          property="behaviourInfos"
          label="行为"
          width="360">
          <template slot-scope="scope">
            <span class="table-cell-tag" v-for="item in scope.row.behaviourInfos.filter(val => val.configFlag === '0')" :key="item.id">{{item.behaviourName}}</span>
<!--            <span>{{scope.row.behaviourInfos.filter(item => item.configFlag === '0').map(item => item.behaviourName).join('、')}}</span>-->
          </template>
        </el-table-column>
        <el-table-column
          property="obds"
          label="OBD">
          <template slot-scope="scope">
            <span class="table-cell-tag" :style="{width:item.obdValue?'210px':'100px'}" v-for="item in scope.row.obds.filter(val => val.configFlag === '0')" :key="item.id">{{item.obdName}}<span v-if="item.obdValue" style="margin-left: 20px;color: #f39800;">{{item.obdValue}}</span></span>
<!--            <span style="white-space: pre-line;">{{scope.row.obds.filter(item => item.configFlag === '0').map(item => item.obdName).join('、')}}</span>-->
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="规则配置" :visible.sync="dialogFormVisible" @closed="closedDialog" class="dialog-add" :close-on-click-modal="false">
        <el-form :model="formDialog" class="config-form" ref="formDialogRef" :rules="formDialogRules">
          <el-form-item label="项目" :label-width="formLabelWidth" prop="projectId">
            <el-select v-model="formDialog.projectId" placeholder="请选择项目" :disabled="disabledProject">
              <el-option :label="item.projectName" :value="item.id" v-for="item in tableData" :key="item.id" :disabled="item.behaviourInfos.some(val => val.configFlag === '0')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行为" :label-width="formLabelWidth" prop="behaviourInfos">
            <el-checkbox-group v-model="formDialog.behaviourInfos">
              <el-checkbox :label="item.behaviourName" name="behavior" v-for="item in behaviourInfos" :key="item.id"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="OBD" :label-width="formLabelWidth" prop="obds">
            <el-checkbox-group v-model="formDialog.obds">
              <div style="display: inline-block;" v-for="item in obds" :key="item.id">
                <el-checkbox :label="item.obdName" name="OBD" :style="{'margin-right': item.valueFlag==='0'?0:'30px'}"></el-checkbox>
                <el-input v-model="item.obdValue" placeholder="" size="mini" :disabled="!formDialog.obds.includes(item.obdName)" v-if="item.valueFlag==='0'"></el-input>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { getCheatRuleView, batchConfigRule } from '@/api/rule';
  import { getNoPageList } from '@/api/device';
  import waves from '@/directive/waves' // Waves directive

  import axios from 'axios'

    export default {
      name: "ruleConfig",
      directives: { waves },
      data() {
        return {
          form: {
            carType: ''
          },
          carTypeList: [],
          originalData: [],//源数据
          tableData: [
            /*{
              id: 1,
              projectName: '上车准备',
              behaviourInfos: [{
                "id": 1,
                "behaviourName": "讲话",
                "behaviourCode": "1",
                "behaviourEnName": "speak",
                "status": "1",
                "remark": "1",
                "delFlag": "0",
                "updateTime": "2020-11-02 07:40:07",
                "createTime": "2020-04-08 12:16:44",
                "tenantId": 0,
                "obdFlag": "0",
                "proBehaviorObd": null,
                "obds": null,
                "configFlag": "0"//0为true，1为false
              }],
              obds: [{
                "id": 1,
                "obdName": "左转向灯",
                "obdCode": "1",
                "status": "0",
                "remark": "1",
                "delFlag": "0",
                "updateTime": "2020-04-08 12:03:20",
                "createTime": "2020-04-08 12:03:23",
                "tenantId": 0,
                "type": "3",
                "subject": "1",
                "obdEnName": "leftTurnLamp",
                "obdValue": '10-100',
                "configFlag": "0",
                "valueFlag": "0",
              },{
                "id": 2,
                "obdName": "右转向灯",
                "obdCode": "1",
                "status": "0",
                "remark": "1",
                "delFlag": "0",
                "updateTime": "2020-04-08 12:03:20",
                "createTime": "2020-04-08 12:03:23",
                "tenantId": 0,
                "type": "3",
                "subject": "1",
                "obdEnName": "leftTurnLamp",
                "obdValue": '',
                "configFlag": "0",
                "valueFlag": "1",
              }]
            },
            {
              id: 2,
              projectName: '上车准备',
              behaviourInfos: [{
                "id": 1,
                "behaviourName": "讲话",
                "behaviourCode": "1",
                "behaviourEnName": "speak",
                "status": "1",
                "remark": "1",
                "delFlag": "0",
                "updateTime": "2020-11-02 07:40:07",
                "createTime": "2020-04-08 12:16:44",
                "tenantId": 0,
                "obdFlag": "0",
                "proBehaviorObd": null,
                "obds": null,
                "configFlag": "1"//0为true，1为false
              }],
              obds: [{
                "id": 1,
                "obdName": "左转向灯",
                "obdCode": "1",
                "status": "0",
                "remark": "1",
                "delFlag": "0",
                "updateTime": "2020-04-08 12:03:20",
                "createTime": "2020-04-08 12:03:23",
                "tenantId": 0,
                "type": "3",
                "subject": "1",
                "obdEnName": "leftTurnLamp",
                "obdValue": null,
                "configFlag": "1",
                "valueFlag": "0",
              }]
            },*/
          ],
          currentRow: null,
          isEditor: 0,//0添加，1编辑

          dialogFormVisible: false,
          formDialog: {
            projectId: '',
            behaviourInfos: [],
            obds: [],
          },
          formDialogRules: {
            projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
            behaviourInfos: [{ type: 'array', required: true, message: '请至少选择一个行为', trigger: 'change' }],
            obds: [{ type: 'array', required: true, message: '请至少选择一个OBD', trigger: 'change' }],
          },
          formLabelWidth: '120px',
          disabledProject: false,//修改时项目不可选择
          behaviourInfos: [],//行为
          obds: [],
        }
      },

      computed: {
        maxHeightTable: function () {
          return document.body.offsetHeight - 84 -40 - 58;
        }
      },

      watch: {
        "form.carType": function (nv,ov) {
          if (nv!==ov) {
            this.getData()
          }
        },

        'formDialog.projectId': function (nv) {
          let obj = this.tableData.find(item => item.id === nv);
          if (obj) {
            this.behaviourInfos = JSON.parse(JSON.stringify(obj.behaviourInfos));
            this.obds = JSON.parse(JSON.stringify(obj.obds));
          } else {
            this.behaviourInfos = [];
            this.obds = [];
          }
        }
      },

      created() {
        this.getCarType()
      },

      mounted() {

      },

      methods: {
        reset() {
          this.$confirm('重置后所有操作恢复初始状态，确定重置吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.originalData = JSON.parse(JSON.stringify(this.originalData));
            this.tableData = JSON.parse(JSON.stringify(this.originalData));
          }).catch(() => {

          });
        },

        add() {
          if (!this.form.carType) {
            return this.$message.error('请先选择车型');
          }
          this.isEditor = 0;
          this.disabledProject = false;
          this.dialogFormVisible = true;
        },

        editor() {
          if (!this.currentRow) {
            return this.$message.error('请先选择一行');
          }
          this.isEditor = 1;
          this.disabledProject = true;
          this.formDialog = {
            projectId: this.currentRow.id,
            behaviourInfos: this.currentRow.behaviourInfos.filter(item => item.configFlag==='0').map(item => item.behaviourName),
            obds: this.currentRow.obds.filter(item => item.configFlag==='0').map(item => item.obdName)
          };
          this.dialogFormVisible = true;
        },

        save() {
          this.$confirm('确定保存当前配置吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(this.tableData);
            let params = this.tableData.map(item => {
              let temp = {
                projectCode: item.projectCode,
                subject: item.projectCode,
                type: this.form.carType,
                behaviourIds: item.behaviourInfos.filter(item4 => item4.configFlag === '0').map(item2 => item2.id),
                obdSignals: item.obds.filter(item5 => item5.configFlag === '0').map(item3 => {
                  let tempObds = {
                    id: item3.id,
                    obdValue: item3.obdValue,
                    obdCode: item3.obdCode,
                    status: item3.status,
                    obdEnName: item3.obdEnName
                  };
                  return tempObds
                })
              };
              return temp
            });
            params = params.filter(item => item.behaviourIds.length>0);
            console.log(JSON.stringify(params));
            batchConfigRule(params).then(res => {
              if (res.code!==0) {
                return this.$message.error(res.message||res.msg);
              }
              this.$message.success('保存成功');
              this.getData()
            }).catch(res => {

            })
          }).catch(() => {

          });
        },

        handleCheckedRow(row) {
          if (this.currentRow) {
            if (this.currentRow == row) {
              this.currentRow = null;
            } else {
              this.currentRow.checked = false;
              this.currentRow = row;
            }

          } else {
            this.currentRow = row
          }
          console.log(this.currentRow);

        },

        confirmAdd() {
          this.$refs.formDialogRef.validate((valid) => {
            if (valid) {
              //更新配置表
              let index = this.tableData.findIndex(item => item.id == this.formDialog.projectId);
              let isEmptyVal = false;//空input输入框
              this.tableData[index].obds.forEach((item,idx) => {
                if (this.formDialog.obds.some(item2 => item.obdName===item2)) {
                  this.tableData[index].obds[idx].configFlag = '0';
                  this.tableData[index].obds[idx].obdValue = this.obds[idx].obdValue;
                  if (this.tableData[index].obds[idx].valueFlag==='0'&&!this.tableData[index].obds[idx].obdValue) {
                    isEmptyVal = true;
                  }
                } else {
                  this.tableData[index].obds[idx].configFlag = '1';
                  this.tableData[index].obds[idx].obdValue = '';
                }
              });
              if (isEmptyVal) {
                return this.$message.error('指标数值不能为空');
              }
              this.tableData[index].behaviourInfos.forEach((item,idx) => {
                if (this.formDialog.behaviourInfos.some(item2 => item.behaviourName===item2)) {
                  this.tableData[index].behaviourInfos[idx].configFlag = '0'
                } else {
                  this.tableData[index].behaviourInfos[idx].configFlag = '1'
                }
              });
              if (this.isEditor!==1) {
                this.tableData.splice(this.tableData.length-1,0,...this.tableData.splice(index,1));
              }
              this.cancelAdd()
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },

        cancelAdd() {
          this.$refs.formDialogRef.resetFields();
          this.formDialog = {
            projectId: '',
            behaviourInfos: [],
            obds: []
          };
          this.dialogFormVisible = false;
        },

        closedDialog() {
          this.cancelAdd()
        },

        getData() {
          // axios.post('/api/examProject/getCheatRuleView').then(res => {
          //   res = res.data;
          //   console.log(res);
          //   this.tableData = res.data;
          //   this.originalData = JSON.parse(JSON.stringify(res.data));
          // }).catch(res => {
          //
          // })
          let params = {
            carType: this.form.carType
          }
          getCheatRuleView(params).then(res => {
            console.log(res);
            if (res.code!==0) {
              return this.$message.error(res.message||res.msg);
            }
            this.tableData = res.data;
            this.originalData = JSON.parse(JSON.stringify(res.data));
          }).catch(res => {

          })
        },

        getCarType() {
          getNoPageList().then(res => {
            // console.log(res);
            if (res.code!==0) {
              return this.$message.error(res.message||res.msg);
            }
            this.carTypeList = res.data;
          }).catch(res => {

          })
        }

      }
    }
</script>

<style scoped lang="scss">
  .table-content>>>.cell {
    white-space: pre-line;
  }

  .table-cell-tag{
    display: inline-block;
    border: 1px solid #f26835;
    /*background-color: #f26835;*/
    /*color: #fff;*/
    width: 100px;
    padding: 0 8px;
    text-align: center;
    border-radius: 4px;
    margin: 3px 10px 3px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dialog-add>>>.el-dialog__body{
    max-height: 50vh;
    overflow: auto;
  }
  .config-form>>>.el-checkbox{
    width: 100px;
  }
  .config-form .el-input--mini{
    margin-right: 30px;
    width: 130px;
  }
</style>
