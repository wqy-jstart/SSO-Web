<style>
body {
  background-image: url("../../public/backgound.png");
  background-size: cover; /*设置封面*/
}

.layout-main {
  text-align: center;
}
</style>
<template>
  <div>
    <el-page-header style="background: rgba(255, 255, 255, 0.5); color: white;
    line-height: 60px; font-weight: bold" @back="goBack" content="某鹅厂登录">
    </el-page-header>
    <el-container>
      <el-main class="layout-main">
        <el-card style="width: 500px;height: 360px;margin: 300px auto;
                background-color: rgba(255,255,255,1)">
          <!--label-width设置用户名这一列所占的宽度,如果不设置会显示在上面-->
          <h1>Sign Up</h1>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px"
                   style="width: 400px;margin: 40px auto">
            <el-form-item label="昵称" prop="nickname">
              <el-input type="nickname" v-model="ruleForm.nickname" placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input type="username" v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="position: relative;right: 30px"
                         type="primary" @click="submitForm('ruleForm')">注册
              </el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {// 初始化ruleForm对象
        nickname:'',
        username: '',
        password: '',
      },
      rules: { // 制定规则
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
        ],
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        ],
      }
    };
  },
  methods: {
    // 处理注册事件
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:8801/users/insert';
          console.log('url='+url);
          let formData = this.qs.stringify(this.ruleForm);
          this.axios.post(url,formData).then((response)=>{
            let responseBody = response.data;
            if (responseBody.state==20000){
              this.$message({
                message: '注册成功!',
                type: 'success'
              });
              this.$router.push('/login');
            }else {
              this.$message.error(responseBody.message);
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    goBack() {
      history.back();//返回上一页面
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>