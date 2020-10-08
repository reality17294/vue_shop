<template>
    <div id="users">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
                        @clear="_getUserData">
                        <el-button slot="append" icon="el-icon-search" @click="_getUserData">
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <div class="list-box">
                <el-table :data="userList" stripe border style="width: 100%">
                    <el-table-column type="index" label="序号" />
                    <el-table-column prop="username" label="姓名" width="180" />
                    <el-table-column prop="role_name" label="身份" />
                    <el-table-column prop="email" label="邮箱" />
                    <el-table-column label="状态">
                        <template v-slot="slot">
                            <el-switch v-model="slot.row.mg_state" @change="stateChange(slot.row)" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template v-slot="slot">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-button type="primary" icon="el-icon-edit" circle @click="editClick(slot.row.id)">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="设置" placement="top">
                                <el-button type="success" icon="el-icon-setting" circle></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button type="danger" icon="el-icon-delete" circle @click="deleteClick(slot.row.id)">
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum" :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>

        </el-card>
        <!-- 添加用户 -->
        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="dialogClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="userValidate">确 定</el-button>
        </el-dialog>
        <!-- 编辑用户 -->
        <el-dialog title="编辑用户" :visible.sync="EditDialog" width="30%" @close="editDialogClose">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="EditDialog = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import userData from '../../../network/user.js'

    export default {
        name: "",
        data() {
            // 自定义校验规则
            var checkEmail = (rule, value, callback) => {
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    return callback
                } else {
                    callback('请输入合法的邮箱')
                }
            }
            var checkMobile = (rule, value, callback) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (regMobile.test(value)) {
                    return callback
                } else {
                    callback('请输入合法的手机号')
                }
            }


            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                userList: [],
                total: 0,
                dialogVisible: false,
                ruleForm: {
                    username: '',
                    password: '',
                    email: ''
                },
                rules: {
                    username: [{
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 10,
                            message: '长度在 6 到 10 个字符',
                            trigger: 'blur'
                        }
                    ],
                    password: [{
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 10,
                            message: '长度在 6 到 10 个字符',
                            trigger: 'blur'
                        }
                    ],
                    email: [{
                            required: true,
                            message: '请输入邮箱',
                            trigger: 'blur'
                        },
                        {
                            validator: checkEmail,
                            trigger: 'blur'
                        }
                    ],
                    mobile: [{
                            required: true,
                            message: '请输入手机号',
                            trigger: 'blur'
                        },
                        {
                            validator: checkMobile,
                            trigger: 'blur'
                        }
                    ]
                },
                EditDialog: false,
                editForm: {}
            }
        },
        created() {
            this._getUserData()
        },
        methods: {
            async _getUserData() {
                const data = await userData({
                    url: 'users',
                    method: 'get',
                    params: this.queryInfo
                })
                this.userList = data.data.data.users
                this.total = data.data.data.total
            },
            async _addUsers() {
                const res = await userData({
                    url: 'users',
                    method: 'post',
                    data: this.ruleForm
                })
                console.log(res);
                if (res.data.meta.status !== 201) {

                    this.$message({
                        message: '用户添加失败',
                        type: 'error',
                        center: true,
                        duration: 1500
                    });
                } else {
                    this.$message({
                        message: '用户添加成功',
                        type: 'success',
                        center: true,
                        duration: 1500
                    });

                }
            },
            async _getUsers(id) {
                const data = await userData({
                    url: 'users/' + id
                })
                this.editForm = data.data.data
            },
            async _editUsers() {
                const res = await userData({
                    url: 'users/' + this.editForm.id,
                    method: 'put',
                    data: {
                        email: this.editForm.email,
                        mobile: this.editForm.mobile
                    }
                })
                if (res.data.meta.status !== 200) {

                    this.$message({
                        message: '用户修改失败',
                        type: 'error',
                        center: true,
                        duration: 1500
                    });
                } else {
                    this.$message({
                        message: '用户修改成功',
                        type: 'success',
                        center: true,
                        duration: 1500
                    });

                }


            },
            _deleteUser(id) {
                userData({
                    url: 'users/' + id,
                    method: 'delete'
                })

            },
            editClick(index) {
                this.EditDialog = true
                this._getUsers(index)
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this._getUserData()
            },
            handleCurrentChange(newPagenum) {
                this.queryInfo.pagenum = newPagenum
                this._getUserData()
            },
            // 修改状态
            stateChange(userInfo) {
                userData({
                    url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
                    method: 'put'
                }).then(res => {
                    console.log(res);
                    if (res.data.meta.status !== 200) {
                        userInfo.mg_state = !userInfo.mg_state
                        this.$message({
                            message: '状态修改失败',
                            type: 'error',
                            center: true,
                            duration: 1500
                        });
                    } else {
                        this.$message({
                            message: '修改状态成功',
                            type: 'success',
                            center: true,
                            duration: 1500
                        });
                    }
                })
            },
            // 对话框关闭重置表单
            dialogClose() {
                this._getUserData()
                this.$refs.ruleForm.resetFields()
            },

            // 添加用户
            userValidate() {
                this.dialogVisible = false
                this._addUsers()
                this._getUserData()


            },
            //    修改用户信息
            editUser() {
                this.EditDialog = false
                this._editUsers()
                this._getUserData()

            },
            // 对话框关闭重置表单
            editDialogClose() {
                this.$refs.editForm.resetFields()

            },
            // 删除用户
            deleteClick(id) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._deleteUser(id)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this._getUserData()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            }

        },
    };
</script>

<style scoped>
    .box-card {
        /* width: 100%; */
        margin-top: 20px;
    }

    .block,
    .list-box {
        margin-top: 10px;
    }

    .el-form {
        padding: 0 50px 0 10px;
        margin-bottom: 10px;
    }
</style>