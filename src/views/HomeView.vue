<style>
body {
  background-image: url("../../public/backgound.png");
  background-size: cover; /*设置封面*/
}

</style>
<template>
  <div>
    <h1>欢迎来到主页!</h1>
    <div>
    <el-avatar :size="120"
               :src="user.avatarUrl"></el-avatar>
      <p style="color: white;font-family: 幼圆;text-align: center">登录:{{user.login}}</p>
    <p style="color: white;font-family: 幼圆;text-align: center">昵称:{{user.name}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">电子邮箱:{{user.email}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">签名:{{user.bio}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">公开作品:{{user.publicRepos}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">粉丝数量:{{user.followers}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">关注数量:{{user.following}}</p>
      <p style="color: white;font-family: 幼圆;text-align: center">星选集数量:{{user.stared}}</p>
    <p style="color: white;font-family: 幼圆;text-align: center">全部作品:{{user.watched}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      user: {}
    }
  },
  methods:{

  },
  created() {
    let url = 'http://localhost:8801/user/getInfo';
    this.axios.get(url).then((response)=>{
      this.user = response.data;
    })
  }
}
</script>
