<style>
body {
  background-image: url("../../public/backgound.png");
  background-size: cover; /*设置封面*/
}

</style>
<template>
  <div>
    <h1>欢迎来到主页!</h1>
    <div v-if="select">
      <p style="color: white;font-family: 幼圆;text-align: center">用户名:{{localUser.username}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">昵称:{{localUser.nickname}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">创建时间:{{localUser.gmtCreate}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">修改时间:{{localUser.gmtModified}}</p>
    </div>
    <div v-else>
    <el-avatar :size="120"
               :src="gitUser.avatarUrl"></el-avatar>
      <p style="color: white;font-family: 幼圆;text-align: center">登录:{{gitUser.login}}</p>
    <p style="color: white;font-family: 幼圆;text-align: center">昵称:{{gitUser.name}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">电子邮箱:{{gitUser.email}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">签名:{{gitUser.bio}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">公开作品:{{gitUser.publicRepos}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">粉丝数量:{{gitUser.followers}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">关注数量:{{gitUser.following}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">星选集数量:{{gitUser.stared}}</p>
    <p style="color: white;font-family: 幼圆;text-align: center">全部作品:{{gitUser.watched}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
     localUser:{},
      gitUser: {},
      select: true
    }
  },
  methods:{
// 加载本地的表单中的数据,存放到roleForm中去
    loadLocalRuleForm(){
      let localRuleFormString = localStorage.getItem('ruleForm');
      if (localRuleFormString) {
        let localRuleForm = JSON.parse(localRuleFormString);
        console.log(localRuleForm)
      }
    },
  },
  mounted() {
    // 发请求获取gitee用户信息
    if (location.search ==''){
      this.select = false;
      let url = 'http://localhost:8801/git/getInfo';
      this.axios.get(url).then((response)=>{
        let responseBody = response.data;
        if (responseBody.state = 20000){
          this.gitUser = responseBody.data;
        }else {
          this.$message.error(responseBody.message);
        }
      })
    }
    // 发请求回去本地登录用户信息
    let url1 = 'http://localhost:8801/users/selectByUsername'+location.search;
    this.axios.get(url1).then((response)=>{
      let responseBody = response.data;
      if (responseBody.state = 20000){
        this.localUser = responseBody.data;
      }else {
        this.$message.error(responseBody.message);
      }
    })
    this.loadLocalRuleForm();
  }
}
</script>
