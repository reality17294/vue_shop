<template>
    <div id="rights">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-table :data="rightList" stripe border>
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template v-slot="slot">
                        <el-tag v-if="slot.row.level === '0'">一级</el-tag>
                        <el-tag type="success" v-else="slot.row.level === '1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
    </div>
</template>

<script>
    import rightData from "../../network/rights";

    export default {
        name: "",
        created() {
            this._rightData('list')
        },
        data() {
            return {
                rightList: []
            };
        },
        methods: {
            async _rightData(type) {
                const res = await rightData({
                    url: "rights/" + type,
                });
                console.log(res);
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
        },
    };
</script>

<style scoped>

</style>