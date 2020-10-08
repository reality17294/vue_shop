<template>
    <div id="home">
        <el-container class="home-container">
            <!-- 标题部分 -->
            <el-header class="header">
                <div class="avatar-box">
                    <div class="img">
                        <img src="../../assets/logo.png" alt="" />
                    </div>
                    <div class="title">电商管理系统</div>
                </div>

                <el-button class="exitBtn" type="info" @click="exit">退出</el-button>
            </el-header>
            <el-container>
                <!-- 侧边栏 -->
                <el-aside :width="isCollapse ? '64px':'200px'">
                    <div class="toggleCollapse" @click="toggleCollapse"> ||| </div>

                    <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409efe" unique-opened
                        :collapse="isCollapse" :collapse-transition="false" router onselectstart="return false"
                        :default-active="activePath">
                        <el-submenu :index="'/'+item.path" v-for="(item,index) in asideData" :key="index">
                            <template slot="title">
                                <i :class="iconList[item.id]"></i>
                                <span>{{item.authName}}</span>
                            </template>
                            <el-menu-item v-for="(cItem,cIndex) in item.children" :key="cIndex" :index="'/'+cItem.path"
                                @click="switchActive('/'+cItem.path)">
                                <i class="el-icon-menu"></i>
                                <span>{{cItem.authName}}</span>
                            </el-menu-item>
                        </el-submenu>

                    </el-menu>

                </el-aside>
                <el-container>
                    <!-- 主体 -->
                    <el-main>
                        <routerView></routerView>
                    </el-main>
                    <!-- 尾部 -->
                    <el-footer>Footer</el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import {
        getAsideData
    } from '../../network/home.js'

    export default {
        name: "",
        components: {},
        data() {
            return {
                isCollapse: false,
                asideData: [],
                iconList: {
                    '125': "el-icon-user",
                    '103': "el-icon-lock",
                    '101': "el-icon-shopping-bag-2",
                    '102': "el-icon-shopping-cart-1",
                    '145': "el-icon-document"
                },
                activePath: ''
            }
        },
        created() {
            // 请求侧边栏数据
            this._getAsideData()
            this.activePath = this.$route.path
        },

        methods: {
            exit() {
                window.sessionStorage.clear();
                this.$router.push("/login");
            },
            _getAsideData() {
                getAsideData({
                    url: 'menus',
                    method: 'get'
                }).then(res => {
                    this.asideData = res.data.data
                })
            },
            toggleCollapse() {
                this.isCollapse = !this.isCollapse

            },
            switchActive(activePath) {
                this.activePath = activePath
            }
        },
    };
</script>

<style scoped>
    .home-container {
        height: 100%;
    }

    .el-header,
    .el-footer {
        background-color: #b3c0d1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-menu {
        border-right: 0;
    }

    .el-aside {
        background-color: #d3dce6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color: #e9eef3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    body>.el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .exitBtn {
        height: 80%;
    }

    .avatar-box {
        display: flex;
        height: 60px;
    }

    .title {
        font-size: 25px;
        font-weight: 700;
    }

    .img {
        width: 100px;
    }

    .img img {
        width: 70%;
        height: 100%;
    }

    .toggleCollapse {
        height: 30px;
        font-weight: 700;
        text-align: center;
        line-height: 30px;
    }
</style>