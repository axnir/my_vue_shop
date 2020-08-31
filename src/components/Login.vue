<template>
  <div class="login_content">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登陆表单区域 -->
      <!-- :model双向绑定  :rules验证规则属性绑定  ref给元素或子组件注册引用信息-->
      <el-form
        label-width="0px"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username" label>
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <!-- rules的信息由prop传递 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-key"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login('loginFormRef')">登录</el-button>
          <el-button type="info" @click="resetLoginForm('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登陆表单
    resetLoginForm (formName) {
      // 访问$refs
      this.$refs[formName].resetFields()
    },
    login (formName) {
      // Promise async await
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        // 解构赋值
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          // return console.log('登陆失败!!!')
          return this.$message({
            message: '错了哦，用户名或验证码错误',
            type: 'error',
            showClose: true
          })
        }
        this.$message({
          message: '恭喜你，登陆成功',
          type: 'success',
          showClose: true
        })
        // 1. 将登陆成功之后的token， 保存到客户端的sessionStorage中
        //  1.1 项目中出了登陆之外的其他API接口，必须在登录之后才能访问
        //  1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_content {
  background-color: #ff6347;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  // 使用 绝对定位 + translate居中
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #eee;
  position: absolute;
  left: 50%;
  // 移动的是相对自身的百分比
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
