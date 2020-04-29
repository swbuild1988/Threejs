<template>
    <div class="login">
        <div class="form-wrap">
            <Form ref="loginData" :model="loginData" :rules="ruleValidate" :label-width="80">
                <h2 class="title">登录</h2>
                <FormItem label="Account" prop="acct">
                    <Input type="text" v-model="loginData.acct" placeholder="请输入账号" class="input" />
                </FormItem>
                <FormItem label="Password" prop="pass">
                    <Input type="password" v-model="loginData.pass" placeholder="请输入密码" class="input" />
                </FormItem>
                   <FormItem>
                                    <Button type="primary" @click="handleSubmit('loginData')"
                        class="submit">Submit</Button>
                    <Button type="default"  @click="handleReset('loginData')"  style="margin-left: 8px">Reset</Button>
                                 </FormItem>
            </Form>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator';
    import router from '../router'
    import {
        sha256
    } from 'js-sha256';
    import {
        Message
    } from 'iview'

    @Component({})
    export default class Login extends Vue {

        loginData: any = {
            acct: '',
            pass: ''
        }
        ruleValidate: any = {
            acct: [{
                    required: true,
                    message: '账号不能为空',
                    trigger: 'blur'
                },
                {
                    min: 3,
                    max: 16,
                    message: '账号长度3-16个字符',
                    trigger: 'blur'
                }
            ],
            pass: [{
                    required: true,
                    message: '密码不能为空',
                    trigger: 'blur'
                },
                {
                    type: 'string',
                    min: 6,
                    max: 16,
                    message: '密码长度6-16个字符',
                    trigger: 'blur'
                }
            ]
        }

        mounted() {
            console.log("this.Message", this.$Message)
            console.log("this.User", this.$User)
        }

        handleSubmit(name: string) {

            (this.$refs[name] as any).validate((valid: boolean) => {
                if (valid) {
                    let loginParams: any = {
                        username: this.loginData.acct,
                        password: sha256(this.loginData.pass)
                    };

                    this.$store.dispatch('login', loginParams).then((result: any) => {

                        router.push({
                            path: "/main"
                        });
                        this.$Message.success('提交成功!');

                    }).catch(err => {
                        this.$Message.warning('登陆失败！')
                    })
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        }

        handleReset(name: string) {
            (this.$refs[name] as any).resetFields();
        }

    }
</script>

<style lang="less">
    .login {
        width: 100%;
        height: 100%;
        background-color: #1c2438;
        position: relative;

        .form-wrap {
            position: fixed;
            left: 48%;
            margin-left: -200px;
            top: 48%;
            margin-top: -150px;
            width: 400px;
            height: 230px;
            border-radius: 10px;
            background-color: #fff;
            padding: 20px 30px;

            h2 {
                text-align: center;
                margin-bottom: 20px;
                font-size: 1.2rem;
            }

        }
    }
</style>