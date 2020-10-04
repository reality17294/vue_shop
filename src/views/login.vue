<template>
    <div id="login">
        <div class="login-box">
            <!-- 用户头像部分 -->
            <div class="avatar">
                <img src="../assets/login/login-avatar.jpg" alt="">
            </div>
            <!-- 输入账号密码区域 -->
            <div class="account">
                <el-form ref="loginForm" :model="form" :rules="loginRules" label-width="80px">
                    <el-form-item label="账号" prop="username">
                        <el-input v-model="form.username" placeholder="请输入账号" prefix-icon="el-icon-user-solid">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-key">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 按钮区域 -->
            <div class="btn">
                <el-button type="warning" @click="clearClick">重置</el-button>
                <el-button type="primary" @click="loginClick">登录</el-button>

            </div>

        </div>
    </div>
</template>

<script>
    import request from '../network/request.js'

    export default {
        name: '',
        data() {
            return {
                form: {
                    username: '',
                    password: ''
                },
                loginRules: {
                    username: [{
                            required: true,
                            message: '请输入账号',
                            trigger: 'blur'
                        },
                        {
                            min: 5,
                            max: 12,
                            message: '长度在 5 到 12 个字符',
                            trigger: 'blur'
                        }
                    ],
                    password: [{
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        },
                        {
                            min: 5,
                            max: 10,
                            message: '长度在 5 到 10 个字符',
                            trigger: 'blur'
                        }
                    ],
                }
            }
        },
        methods: {
            clearClick() {
                this.$refs.loginForm.resetFields()
            },
            loginClick() {
                // 对表单进行预验证
                this.$refs.loginForm.validate(res => {
                    if (!res) return;
                    request({
                        url: 'login',
                        method: 'post',
                        params: this.form
                    }).then(res => {
                        const status = res.data.meta.status
                        if (status !== 200) {
                            this.$message({
                                message: '用户名或者密码输入错误，请重新输入',
                                type: 'error',
                                center: true,
                                duration: 3000
                            });
                            // alert('用户名或密码不正确，请重新输入')
                            this.$refs.loginForm.resetFields()
                        } else {
                            const token = res.data.data.token
                            window.sessionStorage.setItem("token", token)
                            this.$message({
                                message: '登入成功',
                                type: 'success',
                                center: true,
                                duration: 3000
                            });

                            this.$router.push('/home')
                        }
                    })

                })

            },
        }
    }
</script>
<style scoped>
    #login {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background-color: #ccc;
    }

    .login-box {
        width: 500px;
        height: 300px;
        background-color: #fff;
    }

    .avatar {
        width: 130px;
        height: 130px;
        margin: -50px auto;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 50%;
        background-color: #fff;
    }

    .avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;

    }

    .account {
        margin: 60px 0 40px 0;
        padding: 0 80px 0 40px;
    }

    .btn {
        display: flex;
        padding: 0 50px;
        justify-content: space-evenly;
    }
</style>