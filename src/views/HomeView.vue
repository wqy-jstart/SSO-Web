<style>
body {
  background-image: url("../../public/backgound.png");
  background-size: cover; /*设置封面*/
}
a {
  text-decoration: none;
  margin-left: 20px;
  font-size: 25px;
}

</style>
<template>
  <div>
    <el-header style="background: rgba(255, 255, 255, 0.5); color: white;
    line-height: 60px; font-weight: bold">
    </el-header>
    <div style="float: right;position: absolute; right: 10px;top: 12px;font-weight: bold">
      <a href="javascript:void(0)" @click="openLogOff()">退出登录</a>
    </div>
    <h1>欢迎来到主页!</h1>
    <div v-if="select">
      <p style="color: white;font-family: 幼圆;text-align: center">用户名:{{ localUser.username }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">昵称:{{ localUser.nickname }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">创建时间:{{ localUser.gmtCreate }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">修改时间:{{ localUser.gmtModified }}</p>
    </div>
    <div v-else>
      <el-avatar :size="120"
                 :src="gitUser.avatarUrl"></el-avatar>
      <p style="color: white;font-family: 幼圆;text-align: center">登录:{{ gitUser.login }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">昵称:{{ gitUser.name }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">电子邮箱:{{ gitUser.email }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">签名:{{ gitUser.bio }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">公开作品:{{ gitUser.publicRepos }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">粉丝数量:{{ gitUser.followers }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">关注数量:{{ gitUser.following }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">星选集数量:{{ gitUser.stared }}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">全部作品:{{ gitUser.watched }}</p>
    </div>

    <!-- 绑定弹框表单 -->
    <el-dialog width="40%" title="确认绑定信息:" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名:" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.username" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="原密码:" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消绑定</el-button>
        <el-button type="primary" @click="submitTrue()">确认绑定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localUser: {
        id:''
      },
      gitUser: {
        userId:''
      },
      select: false,
      code:'',
      dialogFormVisible: false,// 弹框默认不打开
      ruleForm: {
        username: '',
        password: ''
      },
      formLabelWidth: '120px',
      rules: { // 制定规则
        password: [
          {required: true, message: '密码不能为空!', trigger: 'blur'},
          {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
// 加载本地的表单中的数据,存放到roleForm中去
    check(){
      let url = location.search.split("=")[0];
      if (url != '?code'){
        this.select = true;
      }
    },
    // 处理绑定时验证账号密码是否正确
    submitTrue(){
      let url = 'http://localhost:8801/users/login';
      let ruleFormString = this.qs.stringify(this.ruleForm);
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).post(url,ruleFormString).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state == 20000){
          this.bind();
          this.dialogFormVisible = false;
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    binding(){
      let url = 'http://localhost:8801/git/insert';
      let gitUserString = this.qs.stringify(this.gitUser);
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).post(url, gitUserString).then((response) => {
        let responseBody = response.data;
        if (responseBody.state == 20000) {
          this.$message.success("绑定成功!")
        } else {
          this.$message.error(responseBody.message);
        }
      })
    },
    // 处理绑定时将gitee用户信息保存到数据库中
    bind() {
      let url1 = 'http://localhost:8801/users/selectByUsername?username=' + this.ruleForm.username;
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url1).then((response) => {
        let responseBody = response.data;
        if (responseBody.state = 20000) {
          this.gitUser.userId = responseBody.data.id;
          this.binding();
        } else {
          this.$message.error(responseBody.message);
        }
      })

    },
    // 根据gitee的用户名去后端数据库中查询是否存在,如果不存在提示绑定
    selectByLogin(){
      let url = 'http://localhost:8801/git/selectLogin?name=' + this.gitUser.login;
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.data == null&&this.gitUser.login !=null){
          this.dialogFormVisible = true;// 如果没有数据说明未绑定,提示弹框进行绑定!
        }
      })
    },
    getCode(){
      // 获取code用户信息
      this.code= location.search.split("=")[1];
      // 拿到code后,利用code向后端发送请求,拿用户数据
      let url = 'http://localhost:8801/git/getInfo?code='+this.code+'&state=200';
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state =20000){
          this.gitUser = responseBody.data;// 拿到用户数据
          this.selectByLogin();// 查询是否绑定
        }else {
          this.$message.error(responseBody.message);
        }
      })
    },
    getUserInfo(){
      //发请求回去本地登录用户信息
      let url1 = 'http://localhost:8801/users/selectByUsername' + location.search;
      this.axios
          .create({
            'headers': {
              'Authorization': localStorage.getItem('jwt')
            }
          }).get(url1).then((response) => {
        let responseBody = response.data;
        if (responseBody.state = 20000) {
          this.localUser = responseBody.data;
        } else {
          this.$message.error(responseBody.message);
        }
      })
    },
    openLogOff(){
      location.href = '/login'
    }
  },
  mounted() {
    this.getCode();// 发请求获取gitee返回的code
    this.getUserInfo();//发请求获取本地用户信息
    this.check();
  }
}
</script>
