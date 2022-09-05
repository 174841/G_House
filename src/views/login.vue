<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo2.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { loginRequest } from '@/api/login'
export default {
  name: 'LoginGyy',
  data() {
    return {
      loginFormRules: {
        // 验证用户名是否合法
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      loginForm: {
        email: 'super@a.com',
        password: '123123'
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this) // VueComponent
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid) // false/ture
        if (!valid) return false;

        // 请求后端api进行身份验证
        const LoginData = await loginRequest(this.loginForm)
        this.$message({
          message: '恭喜，登录成功',
          type: 'success'
        })

        // 1. 将登录成功之后的 token 保存到客户端的 sessionStorage 中（会话期间的存储机制）（所以不放在loaclStorage中）
        window.sessionStorage.setItem('token', LoginData.access_token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }

  }

}
</script>

<style lang="scss" scoped>
.login_container {
  background-color: #409eff;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  margin-top: 100px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>