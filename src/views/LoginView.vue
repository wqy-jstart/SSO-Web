<style>
body {
  background-image: url("../../public/backgound.png");
  background-size: cover; /*设置封面*/
}

.layout-header {
  background: rgba(255, 255, 255, 0.5);
  color: #fff;
  text-align: left;
  line-height: 60px;
}

a {
  text-decoration: none;
  font-size: 25px;
}

.layout-main {
  text-align: center;
}
</style>
<template>

  <div>
    <el-container>
      <el-header class="layout-header">
        <div class="block">
          <h1 style="color: black;font-size: 35px">欢迎来到某鹅厂
            <span style="float: right">
            <a href="/register">Sign Up</a>
          </span>
          </h1>
        </div>
      </el-header>
      <el-main class="layout-main">
        <el-card style="width: 500px;height: 360px;margin: 300px auto;
                background-color: rgba(255,255,255,1)">
          <!--label-width设置用户名这一列所占的宽度,如果不设置会显示在上面-->
          <h1>User Login</h1>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px"
                   style="width: 400px;margin: 40px auto">
            <el-form-item label="用户名" prop="username">
              <el-input type="username" v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="position: relative;right: 30px"
                         type="primary" @click="submitForm('ruleForm')">登录
              </el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
            <el-form-item>
              <a href="javascript:void(0)" @click="sso()">
                <img width="56" height="50px" src="../../public/gitee.png">
              </a>
              <span style="margin-bottom: 5px">使用Gitee登录</span>
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
      timer: null,
      ruleForm: {// 初始化ruleForm对象
        username: '',
        password: '',
        rem: false//rem默认为false,勾选后为true
      },
      rules: { // 制定规则
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
    // 处理登录事件
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:8801/users/login';
          let formData = this.qs.stringify(this.ruleForm)
          this.axios.post(url, formData).then((response) => {
            let responseBody = response.data;
            if (responseBody.state == 20000) {
              this.$message.success("登录成功!")
              let ruleFormString = JSON.stringify(this.ruleForm.username);
              localStorage.setItem('ruleForm', ruleFormString);
              this.$router.push("/?username=" + this.ruleForm.username)
            } else {
              this.$message.error(responseBody.message);
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 处理第三方登录事件
    sso() {
      location.href = 'https://gitee.com/oauth/authorize?\n' +
          'client_id=b17799109ce3107be91362aa3130ac2408e02d1f0725cefbe8abf858a4ba3f8c&\n' +
          'redirect_uri=http://localhost:8801/git/getToken.html&response_type=code&state=200';
      let num = 0;
      while (num % 2 == 0) {
        console.log(num);
        this.submitSso();
        num++;
      }
    },
    submitSso() {
      let url = 'http://localhost:8801/git/getInfo';
      this.axios.get(url).then((response) => {
        let responseBody = response.data;
        if (responseBody.data.id != null) {
          if (responseBody.state = 20000) {
            console.log("请求已经发送!")
            location.href = '/';
          } else {
            this.$message.error(responseBody.message);
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
}
</script>

