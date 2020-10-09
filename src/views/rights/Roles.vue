<template>
    <div id="roles">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRole">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" stripe border>
                <el-table-column type="expand" width="50">
                    <template v-slot="slot">
                        <el-row :class="['bdtbottom',i1 === 0 ? 'bdtop':'']" v-for="(item1,i1) in slot.row.children"
                            :key="item1.id">

                            <el-col :span="5" class="expand">
                                <el-tag closable @close="closeTag(slot.row,item1.id)"> {{item1.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>
                            <el-col class="right-box" :span="19">
                                <el-row :class="[i2 === 0 ? '':'bdtop']" v-for="(item2,i2) in item1.children"
                                    :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="closeTag(slot.row,item2.id)">
                                            {{item2.authName}}</el-tag>
                                        <i class="el-icon-arrow-right"></i>
                                    </el-col>
                                    <el-col :span="18" class="box">
                                        <el-row v-for="(item3,i3) in item2.children" :key="item3.id">
                                            <el-col>
                                                <el-tag type="success" closable @close="closeTag(slot.row,item3.id)">
                                                    {{item3.authName}}
                                                </el-tag>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </el-col>

                        </el-row>
                    </template>

                </el-table-column>

                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column prop="level" label="操作">
                    <template v-slot="slot">
                        <el-button type="primary" icon="el-icon-edit" round @click="editDialog(slot.row.id)">编辑
                        </el-button>
                        <el-button type="info" icon="el-icon-setting" round @click="rightDialog(slot.row)">分配权限
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" round @click="deleteClick(slot.row.id)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="添加角色" :visible.sync="showDialog" width="30%" @close="dialogClose">
            <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="70px">
                <el-form-item label="角色名" prop="roleName">
                    <el-input v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="roleForm.roleDesc"></el-input>
                </el-form-item>
                <!-- <el-form-item label="邮箱">
                    <el-input v-model="roleForm.email"></el-input>
                </el-form-item> -->
            </el-form>
            <el-button @click="showDialog = false">取 消</el-button>
            <el-button type="primary" @click="roleValidate">确 定</el-button>
        </el-dialog>

        <el-dialog title="编辑角色" :visible.sync="showeditDialog" width="30%" @close="dialogClose1">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-width="70px">
                <el-form-item label="角色名" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
                <!-- <el-form-item label="邮箱">
                    <el-input v-model="roleForm.email"></el-input>
                </el-form-item> -->
            </el-form>
            <el-button @click="showeditDialog = false">取 消</el-button>
            <el-button type="primary" @click="editRoleValidate">确 定</el-button>
        </el-dialog>
        <el-dialog title="分配权限" :visible.sync="showRightDialog" width="30%" @close="clearKeys">
            <el-tree :data="rightList" :props="defaultProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defaultChecked" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showRightDialog = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import rightData from "../../network/rights";

    export default {
        name: '',
        data() {
            return {
                roleList: [],
                rightList: [],
                showDialog: false,
                showeditDialog: false,
                showRightDialog: false,
                roleForm: {},
                editForm: {},
                rules: {
                    roleName: [{
                        required: true,
                        message: '请输入角色名',
                        trigger: 'blur'
                    }]
                },
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                defaultChecked: [],
                roleId: ''
            }
        },
        created() {
            this._roleData()
        },
        methods: {

            async _roleData() {
                const res = await rightData({
                    url: 'roles'
                })
                this.roleList = res.data.data
            },
            async _addRoles() {
                const res = await rightData({
                    url: 'roles',
                    method: 'post',
                    data: {
                        roleName: this.roleForm.roleName,
                        roleDesc: this.roleForm.roleDesc || ''
                    }
                })
                if (res.data.meta.status === 201) {
                    this.$message({
                        message: '添加角色成功',
                        type: 'success',
                        duration: 1500
                    })
                } else {
                    this.$message({
                        message: '添加角色失败',
                        type: 'error',
                        duration: 1500
                    })
                }
            },
            async _getEditRole(id) {
                const res = await rightData({
                    url: 'roles/' + id
                })
                if (res.data.meta.status === 200) {
                    this.editForm = res.data.data
                    // this.editForm.roleDesc = res.data.data.roleDesc
                } else {
                    this.$message({
                        message: '数据获取失败',
                        type: 'error',
                        duration: 1500
                    })
                }
            },
            async _editRoleInfo() {
                const res = await rightData({
                    url: 'roles/' + this.editForm.roleId,
                    method: 'put',
                    data: this.editForm
                })
                if (res.data.meta.status === 200) {
                    this._roleData()
                    this.$message({
                        message: '修改角色成功',
                        type: 'success',
                        duration: 1500
                    })
                }
            },
            _deleteRole(id) {
                rightData({
                    url: 'roles/' + id,
                    method: 'delete'
                })
            },
            _deleteRight(role, rightId) {
                return rightData({
                    url: `roles/${role.id}/rights/${rightId}`,
                    method: 'delete'
                })

            },
            async _rightData(type) {
                const res = await rightData({
                    url: "rights/" + type,
                });
                if (res.data.meta.status !== 200) {
                    this.$message({
                        message: '获取数据失败',
                        type: 'error',
                        duration: 1500
                    })
                } else {
                    this.rightList = res.data.data

                }
            },
            addRole() {
                this.showDialog = true
            },
            dialogClose() {
                this.$refs.roleForm.resetFields()
            },
            dialogClose1() {

                // this.$refs.editForm.resetFields()
            },
            roleValidate() {
                this._addRoles()
                this._roleData()
                this.showDialog = false
            },
            editDialog(id) {
                this._getEditRole(id)
                this.showeditDialog = true
            },
            editRoleValidate() {
                this._editRoleInfo()
                this.showeditDialog = false
            },
            deleteClick(id) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._deleteRole(id)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    setTimeout(() => {
                        this._roleData()
                    }, 500)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            closeTag(role, rightId) {
                this.$confirm('将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._deleteRight(role, rightId).then(res => {
                        role.children = res.data.data
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            getLeafKeys(node, arr) {
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getLeafKeys(item, arr)
                })
            },
            rightDialog(role) {
                this.roleId = role.id
                this._rightData('tree')
                this.getLeafKeys(role, this.defaultChecked)
                this.showRightDialog = true

            },
            clearKeys() {
                this.defaultChecked = []
            },
            async allotRights() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]

                const idStr = keys.join(',')

                const res = await rightData({
                    url: `roles/${this.roleId}/rights`,
                    method: 'post',
                    data: {
                        rids: idStr
                    }
                })

                if (res.data.meta.status !== 200) {
                    return this.$message.error('分配权限失败！')
                }

                this.$message.success('分配权限成功！')
                this._roleData()
                this.showRightDialog = false
            }
        },



    }
</script>
<style scoped>
    .el-table {
        margin-top: 15px;
    }

    .expand,
    .right-box {
        line-height: 80px;

    }


    .bdtop {
        border-top: 1px solid #ccc;

    }

    .bdtbottom {
        border-bottom: 1px solid #ccc;

    }

    .box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
</style>