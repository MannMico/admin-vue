<template>
  <div class="outer-wrapper">
    <div class="wrapper">
      <header>
        <img class="logo" src="@/assets/images/logo.png" alt="洛客">
      </header>
      <!--表单区域-->
      <el-row>
        <el-form
          :rules="rules"
          :inline="true"
          ref="data"
          label-width="120px"
          label-position="left"
          :model="data"
          class="stage1">
          <h1 class="section-header">基本信息</h1>
          <el-row>
            <el-col :span="24">
              <el-form-item label="项目来源">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.projectSource">
                  <el-radio :label="1">洛可可</el-radio>
                  <el-radio :label="2">洛客</el-radio>
                  <el-radio :label="3">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系方式">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.signContact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="填写人">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.signatory"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <h1 class="section-header">申报者资料</h1>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申报者类型" prop="reporter.type">
                <el-select :disabled="mode == 1 ? false : true"
                           v-model="data.reporter.type">
                  <el-option
                    label="企业"
                    :value="1"></el-option>
                  <el-option
                    label="小型企业（少于10人）"
                    :value="2"></el-option>
                  <el-option
                    label="设计工作室"
                    :value="3"></el-option>
                  <el-option
                    label="机构&大学"
                    :value="4"></el-option>
                  <el-option
                    label="设计师&多设计师小组"
                    :value="5"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申报者名称(中文)" prop="reporter.cnName">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.cnName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申报者名称(英文)" prop="reporter.enName">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.enName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="国家" prop="reporter.country">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.country"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市" prop="reporter.city">
                <el-autocomplete
                  :disabled="mode == 1 ? false : true"
                  v-model="data.reporter.city"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  value-key="cityName"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="详细地址(中文)" prop="reporter.cnAddress">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.cnAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址(英文)" prop="reporter.enAddress">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.enAddress"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮编" prop="reporter.postcode">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.postcode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="固定电话" prop="reporter.tel">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.tel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司email" prop="reporter.email">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.fax"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="网站主页地址" prop="reporter.site">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.site"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人/责任人" prop="reporter.corporation">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.corporation"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人姓名" prop="reporter.contactName">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.contactName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="reporter.contactTel">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.contactTel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人email" prop="reporter.contactEmail">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.reporter.contactEmail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人性别" prop="reporter.gender">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.reporter.gender">
                  <el-radio :label="0">男</el-radio>
                  <el-radio :label="1">女</el-radio>
                  <el-radio :label="2">保密</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <h1 class="section-header">客户资料</h1>
            <el-col :span="12">
              <el-form-item label="企业名称(中文)" prop="customer.cnName">
                <el-autocomplete
                  :disabled="mode == 1 ? false : true"
                  value-key="companyName"
                  v-model="data.customer.cnName"
                  :fetch-suggestions="queryStage1"
                  @select="selectStage1">
                  <template slot-scope="props">
                    <div class="name">{{ props.item.companyName }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称(英文)" prop="customer.enName">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.enName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="国家" prop="customer.country">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.country"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市" prop="customer.city">
                <el-autocomplete
                  :disabled="mode == 1 ? false : true"
                  v-model="data.customer.city"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  value-key="cityName"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="详细地址(中文)" prop="customer.cnAddress">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.cnAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址(英文)" prop="customer.enAddress">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.enAddress"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮编" prop="customer.postcode">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.postcode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="固定电话" prop="customer.tel">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.tel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司email" prop="customer.email">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.fax"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="网站主页地址" prop="customer.site">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.site"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人/责任人" prop="customer.corporation">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.corporation"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人姓名" prop="customer.contactName">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.contactName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="customer.contactTel">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.contactTel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人email" prop="customer.contactEmail">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.customer.contactEmail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人性别" prop="customer.gender">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.customer.gender">
                  <el-radio :label="0">男</el-radio>
                  <el-radio :label="1">女</el-radio>
                  <el-radio :label="2">保密</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <h1 class="section-header">设计师资料</h1>
          <div v-for="(v, k) in data.designers" :key="k">
            <div class="title">
              <span style="vertical-align: top;">{{ k+1 }}. 设计师资料</span>
              <el-button v-if="k > 0" class="delete-designer-info" icon="el-icon-delete" type="text">删除</el-button>
            </div>
            <div class="line" style="margin-bottom: 20px;"></div>
            <div style="margin-bottom: 10px;">设计师基本信息 >></div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名(中文)">
                  <el-autocomplete
                    :disabled="mode == 1 ? false : true"
                    @focus="getDesignerNumber(k)"
                    value-key="cnName"
                    v-model="v.cnName"
                    :fetch-suggestions="queryStage2"
                    @select="selectStage2">
                    <template slot-scope="props">
                      <div class="name">{{ props.item.cnName }}</div>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="first name">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.enName.firstName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="last name">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.enName.lastName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-radio-group :disabled="mode == 1 ? false : true" v-model="v.gender">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                    <el-radio :label="2">保密</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="照片">
                  <upload-file info="重新上传" v-if="mode == 1" :upfileSize="123" :CBParams="{index: k}" :upfileType="'image'" customFormat="jpg、jpeg" :upLimit="1" :upMultiple="false" @urlCB="uploadstage2"></upload-file>
                  <img v-if="mode != 1" :src="v.photoUrl" alt="photo" style="width: 100px; height: 100px;">
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="身份证号">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.idCard"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系方式">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.contact"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="email">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.email"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="传真">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.fax"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="国家">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.country"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="城市">
                  <el-autocomplete
                    :disabled="mode == 1 ? false : true"
                    v-model="v.city"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="false"
                    value-key="cityName"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="详细地址(中文)">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.cnAddress"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="详细地址(英文)">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.enAddress"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="邮编">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.postcode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作年限(年)">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.workingYears"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div style="margin-bottom: 10px;">教育经历 >></div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="校名(中文)">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.edu.schoolName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="校名(英文)">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.edu.enSchoolName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="学历">
                  <el-radio-group :disabled="mode == 1 ? false : true" v-model="v.edu.diploma">
                    <el-radio :label="1">博士研究生</el-radio>
                    <el-radio :label="2">硕士研究生</el-radio>
                    <el-radio :label="3">大学本科</el-radio>
                    <el-radio :label="4">大学专科</el-radio>
                    <el-radio :label="5">成人高等教育</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="国家">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.edu.country"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="城市">
                  <el-autocomplete
                    :disabled="mode == 1 ? false : true"
                    v-model="v.edu.city"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="false"
                    value-key="cityName"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="详细地址(中文)">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.edu.cnAddress"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="详细地址(英文)">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.edu.enAddress"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮编">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.edu.postcode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="固定电话">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.edu.contactTel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学校email">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.edu.contactEmail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="传真">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.edu.fax"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div style="margin-bottom: 10px;">公司信息 >></div>
              </el-col>
            </el-row>
            <el-row>
            <el-col :span="12">
              <el-form-item label="企业名称(中文)">
                <el-input :disabled="mode == 1 ? false : true" v-model="v.com.cnName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称(英文)">
                <el-input :disabled="mode == 1 ? false : true" v-model="v.com.enName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="部门">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.deptName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职位">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.post"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="国家">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.country"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="城市">
                  <el-autocomplete
                    :disabled="mode == 1 ? false : true"
                    v-model="v.com.city"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="false"
                    value-key="cityName"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="详细地址(中文)">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.cnAddress"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="详细地址(英文)">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.enAddress"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="邮编">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.postcode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="固定电话">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.tel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="公司email">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.email"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="传真">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.fax"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="网站主页地址">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.site"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="组织机构代码">
                  <el-input :disabled="mode == 1 ? false : true" v-model="v.com.orgCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <h1 class="section-header">报奖作品介绍</h1>
            <el-col :span="12">
              <el-form-item label="作品名称" prop="opus.name">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.opus.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="作品类型" prop="opus.type">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.opus.type">
                  <el-radio :label="1">工业</el-radio>
                  <el-radio :label="2">品牌</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="作品归属权" prop="opus.ownership">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.opus.ownership">
                  <el-radio :label="1">洛客</el-radio>
                  <el-radio :label="2">洛可可</el-radio>
                  <el-radio :label="3">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设计时间(月)" prop="opus.designTime">
                <el-date-picker
                  :disabled="mode == 1 ? false : true"
                  v-model="data.opus.designTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
                <span></span>
              </el-form-item>
            </el-col>
          </el-row>
          <h4>产品设计介绍 >><span class="tishi">（字符数包括文字数、标点和空格；请保证中英文内容描述一致）</span></h4>
          <el-row>
            <el-col :span="24">
              <el-form-item label="一句话总结(中文)" prop="opus.cnProductDesignSummary" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" @paste.native="pasteKiller" :rows="5" resize="none" v-model="data.opus.cnProductDesignSummary" type="textarea" :maxlength="100" placeholder="包括您的参赛作品的官方标题，并使用完整的句子提交，最多100字符。你也可以用这句话来描述您的参赛作品。"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="一句话总结(英文)" prop="opus.enProductDesignSummary" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.enProductDesignSummary" type="textarea" :maxlength="100" placeholder="——Include the official title of your entry and use complete sentences to submit a comprehensive, 100-character max. description of your entry—perhaps one that you would use to describe your entry to the general public."></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="设计说明(中文)" prop="opus.cnDesignConcept" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.cnDesignConcept" type="textarea" placeholder="实现可能、使用功效、制造成本、美感质量和能源环保、对作品设计理念、用途、功能等整体进行说明。英文、含标点150字符。" :maxlength="150"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="设计说明(英文)" prop="opus.enDesignConcept" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.enDesignConcept" type="textarea" placeholder="——Realize the possible use, efficacy, manufacturing cost, aesthetic quality and energy and environmental protection, and explain the design concept, use and function of the work as a whole. English, including punctuation 150 characters."></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="面临挑战(中文)" prop="opus.cnChallenge" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.cnChallenge" type="textarea" :maxlength="250" placeholder="您在创建此产品/项目面临的挑战是什么？英文、含标点250字符。"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="面临挑战(英文)" prop="opus.enChallenge" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.enChallenge" type="textarea" :maxlength="250" placeholder="——What was the challenge that you faced in creating this product/project? English, including punctuation 250 characters."></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="独特的设计(中文)" prop="opus.cnFeature" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.cnFeature" type="textarea" :maxlength="250" placeholder="与其他此类设计相比，这种设计如何独特或创新？英文、含标点250字符。"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="独特的设计(英文)" prop="opus.enFeature" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.enFeature" type="textarea" :maxlength="250" placeholder="——How is this design unique or innovative, compared to other designs in this category?English, including punctuation 250 characters."></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户体验(中文)" prop="opus.cnUserExperience" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.cnUserExperience" type="textarea" :maxlength="250" placeholder="这种设计如何提供一种简单的、 直观的或令人愉快的用户体验？英文、含标点250字符。"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户体验(英文)" prop="opus.enUserExperience" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.enUserExperience" type="textarea" :maxlength="250" placeholder="——How does this design deliver a simple, intuitive or delightful user experience?English, including punctuation 250 characters."></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="商业盈利模式(中文)" prop="opus.cnBenefitCustomer" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.cnBenefitCustomer" type="textarea" :maxlength="250" placeholder="这种设计如何提高客户或制造商的盈利能力，品牌声誉，员工士气等？英文、含标点250字符。"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="商业盈利模式(英文)" prop="opus.enBenefitCustomer" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.enBenefitCustomer" type="textarea" :maxlength="250" placeholder="——How does this design improve the client or manufacturer's profitability, brand reputation, employee morale, etc.?English, including punctuation 250 characters."></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="有利于社会(中文)" prop="opus.cnBenefitSociety" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.cnBenefitSociety" type="textarea" :maxlength="250" placeholder="这种设计获得更大的利益; 有哪些好处考虑社会、 环境、 文化、 经济等？英文、含标点250字符。"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="有利于社会(英文)" prop="opus.enBenefitSociety" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.enBenefitSociety" type="textarea" :maxlength="250" placeholder="——How does this design benefit the greater good; consider society, the environment, culture, the economy, etc.?English, including punctuation 250 characters."></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="产品介绍延展(中文)" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.cnIntroExt" type="textarea" :maxlength="1500" placeholder="其他延展类产品信息文字，1500个字符以内"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="产品介绍延展(英文)" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" :rows="5" resize="none" v-model="data.opus.enIntroExt" type="textarea" :maxlength="1500" placeholder="——Other extension product information text, within 1500 characters"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="视频" label-width="160px">
                <upload-file info="重新上传" v-if="mode == 1" :upfileSize="51200" :upfileType="'video'" customFormat="mp4" :upLimit="1" :upMultiple="false" @urlCB="uploadVideoStage3"></upload-file>
                <span v-if="mode == 1" class="tishi">1、格式：MP4；2、大小：50Mb；3、时长：不超过2分钟；4、内容：如有字幕，则至少应包含英文</span>
                <a v-if="mode != 1" :href="data.opus.videoUrl">下载</a>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="视频地址" label-width="160px">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.opus.videoPath"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="视频密码" label-width="120px">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.opus.videoPass"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="图片" prop="opus.pictures" label-width="160px">
                <upload-file info="重新上传" v-if="mode == 1" :upfileSize="2048" :upfileType="'image'" customForamt="jpg、jpeg" :upLimit="10" :upMultiple="false" @urlCB="uploadImageStage3"></upload-file>
                <span class="tishi">1、数量：6-10张；2、格式（2种）：未压缩apg ，jpeg；3、尺寸：A3尺寸297mm×420mm；4、大小：2Mb；<br>5、分辨率：300DPI；6、图片内容要求：不要使用任何文字和线条已上市量产的产品必须有：实物或实景拍摄</span>
                <div><img style="width: 150px; height: 150px;margin: 0 10px 10px 0;" v-if="mode != 1" v-for="(v, k) in data.opus.pictures" :key="k" :src="v" alt="photo"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所有权证明文件" label-width="160px">
                <upload-file info="重新上传" v-if="mode == 1" :upfileSize="4096" :upfileType="'file'" :upLimit="5" :upMultiple="false" @urlCB="uploadFileStage3"></upload-file>
                <a v-if="mode != 1" v-for="(v, k) in data.opus.documents" :key="k" :href="v" style="margin-right: 10px;">下载</a>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="提交实物模式" prop="opus.isSendBack" label-width="160px">
                <el-checkbox-group :disabled="mode == 1 ? false : true" v-model="data.opus.exhibitType">
                  <el-checkbox label="1">实物</el-checkbox>
                  <el-checkbox label="2">模型</el-checkbox>
                  <el-checkbox label="3">手板</el-checkbox>
                  <el-checkbox label="4">展板</el-checkbox>
                  <el-checkbox label="5">视频</el-checkbox>
                  <el-checkbox label="6">图片</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否寄回" prop="opus.isSendBack" label-width="160px">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.opus.isSendBack">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <h1 class="section-header">产品资料</h1>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品名称(中文)" prop="product.cnName">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.product.cnName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品名称(英文)" prop="product.enName">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.product.enName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.opus.type == 1">
            <el-col :span="24">
              <el-form-item label="产品状态" prop="product.status">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.product.status">
                  <el-radio :label="1">已上市</el-radio>
                  <el-radio :label="4">已量产</el-radio>
                  <el-radio :label="3">已有功能样机</el-radio>
                  <el-radio :label="2">已有外观模型</el-radio>
                  <el-radio :label="5">概念</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.opus.type == 2">
            <el-col :span="12">
              <el-form-item label="品牌设计类型" prop="product.brandDesignType">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.product.brandDesignType">
                  <el-radio :label="1">平面</el-radio>
                  <el-radio :label="2">包装</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.opus.type == 2">
            <el-col :span="12">
              <el-form-item label="品牌状态类型" prop="product.brandStatus">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.product.brandStatus">
                  <el-radio :label="1">已投放使用</el-radio>
                  <el-radio :label="2">未投放使用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="data.opus.type == 2 && data.product.brandStatus == 1">
              <el-form-item label="投放日期" prop="product.launchAt">
                <el-date-picker
                  :disabled="mode == 1 ? false : true"
                  value-format="yyyy-MM-dd"
                  v-model="data.product.launchAt">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品长(mm)" prop="product.introLength">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.product.introLength"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品宽(mm)" prop="product.introWidth">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.product.introWidth"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="data.opus.type == 1 || (data.product.brandDesignType == 2 && data.opus.type == 2)">
              <el-form-item label="产品高(mm)" prop="product.introHeight">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.product.introHeight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="data.opus.type == 1 && (data.product.status == 1 || data.product.status == 4)">
              <el-form-item label="产品重量(kg)" prop="product.introWeight">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.product.introWeight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="data.opus.type == 1 && (data.product.status == 1 || data.product.status == 4 || data.product.status == 3)">
              <el-form-item label="开发时间(月)" prop="product.devTime">
                <el-date-picker
                  :disabled="mode == 1 ? false : true"
                  v-model="data.product.devTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
                <span></span>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="data.opus.type == 1">
            <el-row>
              <el-col :span="24" v-if="data.product.status == 2">
                <el-form-item label="产品开发日期和预计产品开发结束日期" prop="product.expectedTime" style="line-height: 14px;">
                  <el-date-picker
                    :disabled="mode == 1 ? false : true"
                    v-model="data.product.expectedTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                  <span></span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="data.product.status == 1">
                <el-form-item label="市场价格(元)" prop="product.price">
                  <el-input :disabled="mode == 1 ? false : true" v-model="data.product.price"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="data.product.status == 1">
                <el-form-item label="上市日期" prop="product.launchDate">
                  <el-date-picker
                    :disabled="mode == 1 ? false : true"
                    value-format="yyyy-MM-dd"
                    v-model="data.product.launchDate">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="data.product.status == 2 || data.product.status == 3 || data.product.status == 4|| data.product.status == 5">
                <el-form-item label="预计市场价格" prop="product.expectedLaunchPrice">
                  <el-input :disabled="mode == 1 ? false : true" v-model="data.product.expectedLaunchPrice" placeholder="元"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="data.product.status == 2 || data.product.status == 3 || data.product.status == 4|| data.product.status == 5">
                <el-form-item label="预计上市日期" prop="product.expectedLaunchDate">
                  <el-date-picker
                    :disabled="mode == 1 ? false : true"
                    v-model="data.product.expectedLaunchDate"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="data.product.status == 2|| data.product.status == 3">
              <el-col :span="24">
                <el-form-item label="技术来源" prop="product.techSource">
                  <el-select :disabled="mode == 1 ? false : true"
                             v-model="data.product.techSource">
                    <el-option
                      label="项目负责人个人发明"
                      :value="1"></el-option>
                    <el-option
                      label="知名导师科研成果"
                      :value="2"></el-option>
                    <el-option
                      label="行业领先专家科研成果"
                      :value="3"></el-option>
                    <el-option
                      label="科研院所研究成果"
                      :value="4"></el-option>
                    <el-option
                      label="其他"
                      :value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="data.opus.type == 1">
              <el-col :span="24">
                <el-form-item label="产品性质" prop="product.nature">
                  <el-checkbox-group :disabled="mode == 1 ? false : true" v-model="data.product.nature">
                    <el-checkbox label="1">在中国（含港澳台）设计</el-checkbox>
                    <el-checkbox label="2">在中国（含港澳台）生产</el-checkbox>
                    <el-checkbox label="3">中国（含港澳台）上市</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="data.opus.type == 1">
              <el-col :span="24">
                <el-form-item label="设计方式" prop="product.designWay">
                  <el-select :disabled="mode == 1 ? false : true"
                             v-model="data.product.designWay">
                    <el-option
                      label="企业内部设计：企业内部人员自行设计"
                      :value="1"></el-option>
                    <el-option
                      label="外部设计：为其他单位人员自行设计"
                      :value="2"></el-option>
                    <el-option
                      label="共同设计：为企业内部人员与其他单位人员共同参与设计"
                      :value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="data.product.status == 1 || data.product.status == 2|| data.product.status == 3|| data.product.status == 4">
              <el-col :span="24">
                <el-form-item label="预算/研发成本" prop="product.cost">
                  <el-select :disabled="mode == 1 ? false : true"
                             v-model="data.product.cost">
                    <el-option
                      label="5万以下"
                      :value="1">
                    </el-option>
                    <el-option
                      label="5-10万"
                      :value="2">
                    </el-option>
                    <el-option
                      label="10-20万"
                      :value="3">
                    </el-option>
                    <el-option
                      label="20-50万"
                      :value="4">
                    </el-option>
                    <el-option
                      label="50-100万"
                      :value="5">
                    </el-option>
                    <el-option
                      label="100-200万"
                      :value="6">
                    </el-option>
                    <el-option
                      label="200-500万"
                      :value="7">
                    </el-option>
                    <el-option
                      label="500-1000万"
                      :value="8">
                    </el-option>
                    <el-option
                      label="1000-2000万"
                      :value="9">
                    </el-option>
                    <el-option
                      label="2000-5000万"
                      :value="10">
                    </el-option>
                    <el-option
                      label="5000-1亿"
                      :value="11">
                    </el-option>
                    <el-option
                      label="1亿以上"
                      :value="12">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="data.opus.type == 1">
              <el-col :span="24">
                <el-form-item label="核心评估标准" prop="product.coreRole">
                  <el-select :disabled="mode == 1 ? false : true" multiple
                             v-model="data.product.coreRole">
                    <el-option
                      label="美学设计质量"
                      value="1"></el-option>
                    <el-option
                      label="创新"
                      value="2"></el-option>
                    <el-option
                      label="自治"
                      value="3"></el-option>
                    <el-option
                      label="安全实际使用"
                      value="4"></el-option>
                    <el-option
                      label="可用性"
                      value="5"></el-option>
                    <el-option
                      label="人类工效学"
                      value="6"></el-option>
                    <el-option
                      label="对环境的影响"
                      value="7"></el-option>
                    <el-option
                      label="执行"
                      value="8"></el-option>
                    <el-option
                      label="材料选择"
                      value="9"></el-option>
                    <el-option
                      label="品牌标识"
                      value="10"></el-option>
                    <el-option
                      label="目标群体适合"
                      value="11"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="data.product.status == 1 || data.product.status == 2|| data.product.status == 3|| data.product.status == 4">
              <el-col :span="24">
                <el-form-item label="目标群体" prop="product.targetGroup">
                  <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.product.targetGroup">
                    <el-radio :label="1">消费者 用户</el-radio>
                    <el-radio :label="2">贸易 行业</el-radio>
                    <el-radio :label="3">公共部门 政府</el-radio>
                    <el-radio :label="4">其他目标群体</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="data.product.status == 1 || data.product.status == 2|| data.product.status == 3|| data.product.status == 4">
              <el-col :span="24">
                <el-form-item label="服务目标地区" prop="product.targetArea">
                  <el-checkbox-group :disabled="mode == 1 ? false : true" v-model="data.product.targetArea">
                    <el-checkbox label="1">亚洲</el-checkbox>
                    <el-checkbox label="2">澳大利亚 大洋洲</el-checkbox>
                    <el-checkbox label="3">欧洲</el-checkbox>
                    <el-checkbox label="4">北美</el-checkbox>
                    <el-checkbox label="5">南美</el-checkbox>
                    <el-checkbox label="6">进一步本地化</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否取得专利" prop="product.isPatented">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.product.isPatented">
                  <el-radio :label="2">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                  <el-radio :label="3">申请中</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.product.isPatented == 2">
            <el-col :span="24">
              <el-form-item label="专利类型(已获得)" prop="product.patentTypeGot" class="label-lh" label-width="150px">
                <el-checkbox-group :disabled="mode == 1 ? false : true" v-model="data.product.patentTypeGot">
                  <el-checkbox label="1">发明专利</el-checkbox>
                  <el-checkbox label="2">使用新型专利</el-checkbox>
                  <el-checkbox label="3">外观设计专利</el-checkbox>
                  <el-checkbox label="4">商标</el-checkbox>
                  <el-checkbox label="5">版权</el-checkbox>
                  <el-checkbox label="6">其他</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-if="data.product.isPatented == 3">
              <el-form-item label="专利类型(正在申请)" prop="product.patentTypeApply" label-width="150px">
                <el-checkbox-group :disabled="mode == 1 ? false : true" v-model="data.product.patentTypeApply">
                  <el-checkbox label="1">发明专利</el-checkbox>
                  <el-checkbox label="2">使用新型专利</el-checkbox>
                  <el-checkbox label="3">外观设计专利</el-checkbox>
                  <el-checkbox label="4">商标</el-checkbox>
                  <el-checkbox label="5">版权</el-checkbox>
                  <el-checkbox label="6">其他</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="data.product.isPatented == 2">
              <el-form-item label="专利证明" prop="patentCert">
                <upload-file info="重新上传" v-if="mode == 1" :upfileSize="4096" :upfileType="'image'" customFormat="jpg、jpeg、png" :upLimit="5" :upMultiple="false" @urlCB="uploadFile1Stage4"></upload-file>
                <div><img style="width: 150px; height: 150px;margin: 0 10px 10px 0;" v-if="mode != 1" v-for="(v, k) in data.product.patentCert" :key="k" :src="v" alt="photo"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="获奖情况">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.product.isWinPrize">
                  <el-radio :label="1">已获奖</el-radio>
                  <el-radio :label="0">暂未获奖</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.product.isWinPrize == 1">
            <el-col :span="12">
              <el-form-item label="奖项证明">
                <upload-file info="重新上传" v-if="mode == 1" :upfileSize="3072" :upfileType="'image'" :upLimit="3" :upMultiple="false" @urlCB="uploadFile2Stage4"></upload-file>
                <div><img style="width: 150px; height: 150px;margin: 0 10px 10px 0;" v-if="mode != 1" v-for="(v, k) in data.product.prizeCert" :key="k" :src="v" alt="photo"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.opus.type == 1">
            <el-col :span="12">
              <el-form-item label="产业转化意向" prop="product.industryIntention">
                <el-radio-group :disabled="mode == 1 ? false : true" v-model="data.product.industryIntention">
                  <el-radio :label="1">需要</el-radio>
                  <el-radio :label="0">不需要</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.opus.type == 1 && data.product.industryIntention == 1">
            <el-col :span="24">
              <el-form-item label="产业转化需求类型" prop="product.industryIntentionType" label-width="140px">
                <el-checkbox-group :disabled="mode == 1 ? false : true" v-model="data.product.industryIntentionType">
                  <el-checkbox label="1">场地支持</el-checkbox>
                  <el-checkbox label="2">设计支持</el-checkbox>
                  <el-checkbox label="3">技术支持</el-checkbox>
                  <el-checkbox label="4">销售支持</el-checkbox>
                  <el-checkbox label="5">资金支持</el-checkbox>
                  <el-checkbox label="6">不需要</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.opus.type == 1 && data.product.industryIntention == 1">
            <el-col :span="24">
              <el-form-item label="需求描述" prop="product.demandDesc">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.product.demandDesc" :maxlength="500" placeholder="500字以内, 请包含项目介绍、公司简介、需求描述" type="textarea" resize="none" :row="5"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.opus.type == 1 && data.product.status == 1">
            <el-col :span="12">
              <el-form-item label="产品购买链接">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.product.purchaseLink"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.opus.type == 1 && data.product.status == 1">
            <el-col :span="12">
              <el-form-item label="产品关键词">
                <el-input :disabled="mode == 1 ? false : true" v-model="data.product.keywords" placeholder="用空格分隔，最多五个"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <!--按钮区域-->
      <el-row>
        <!--<div class="add-designer-btn" @click="addDesigner">＋ 增加设计师</div>-->
        <div class="btn-wrapper">
          <el-button v-if="mode == 1" @click="submit">保存</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import uploadFile from '@/components/Upload/upload'
import request from '@/utils/request'
import chineseCities from '@/utils/cities'
export default {
  data () {
    var id = ''
    var reporterRules = {}
    var customerRules = {}
    var designerRules = {}
    var opusRules = {}
    var productRules = {}

    var reporter = {
      type: '',
      cnName: '',
      enName: '',
      country: '',
      city: '',
      cnAddress: '',
      enAddress: '',
      postcode: '',
      tel: '',
      email: '',
      fax: '',
      website: '',
      corporation: '',
      contactName: '',
      contactTel: '',
      contactEmail: '',
      gender: ''
    }
    var customer = {
      type: '',
      cnName: '',
      enName: '',
      country: '',
      city: '',
      cnAddress: '',
      enAddress: '',
      postcode: '',
      tel: '',
      email: '',
      fax: '',
      site: '',
      corporation: '',
      contactName: '',
      contactTel: '',
      contactEmail: '',
      gender: ''
    }
    var designer = [{
      cnName: '',
      enName: {
        firstName: '',
        lastName: ''
      },
      gender: '',
      photoUrl: '',
      idCard: '',
      contact: '',
      email: '',
      fax: '',
      country: '',
      city: '',
      cnAddress: '',
      enAddress: '',
      postcode: '',
      workingYears: '',
      edu: {
        schoolName: '',
        enSchoolName: '',
        diploma: '',
        country: '',
        city: '',
        cnAddress: '',
        enAddress: '',
        postcode: '',
        contactTel: '',
        contactEmail: '',
        fax: ''
      },
      com: {
        designerId: '',
        cnName: '',
        enName: '',
        deptName: '',
        post: '',
        country: '',
        city: '',
        cnAddress: '',
        enAddress: '',
        postcode: '',
        tel: '',
        email: '',
        fax: '',
        site: '',
        orgCode: '',
        businessLicence: ''
      }
    }]
    var opus = {
      name: '',
      type: '',
      ownership: '',
      designTime: [],
      cnProductDesignSummary: '',
      enProductDesignSummary: '',
      cnDesignConcept: '',
      enDesignConcept: '',
      cnChallenge: '',
      enChallenge: '',
      cnFeature: '',
      enFeature: '',
      cnUserExperience: '',
      enUserExperience: '',
      cnBenefitCustomer: '',
      enBenefitCustomer: '',
      cnBenefitSociety: '',
      enBenefitSociety: '',
      cnIntroExt: '',
      enIntroExt: '',
      videoURL: '',
      videoPath: '',
      videoPass: '',
      pictures: [],
      documents: [],
      exhibitType: [],
      isSendBack: ''
    }
    var product = {
      cnName: '',
      enName: '',
      status: '',
      introLength: '',
      introWidth: '',
      introHeight: '',
      introWeight: '',
      price: '',
      devTime: [],
      startDevTime: '',
      endDevTime: '',
      techSource: '',
      nature: '',
      designWay: '',
      cost: '',
      coreRole: [],
      targetGroup: '',
      targetArea: '',
      isPatented: '',
      patentTypeGot: '',
      patentCert: '',
      isWinPrize: '',
      prizeCert: '',
      industryIntention: '',
      IndustryIntentionType: [],
      demandDesc: '',
      launchAt: '',
      expectedLaunchPrice: '',
      expectedLaunchDate: '',
      patentTypeApply: '',
      purchaseLink: '',
      keywords: '',
      brandDesignType: '',
      brandStatus: '',
      expectedTime: [],
      endExpectedTime: '',
      startExpectedTime: '',
      industryIntentionType: '',
      launchDate: ''
    }

    var inputRequired = [
      {required: true, message: '请填写此项', trigger: 'blur'}
    ]
    var radioRequired = [
      {required: true, message: '请选择', trigger: 'change'}
    ]
    var checkboxRequired = [
      {type: 'array', required: true, message: '请至少选择一个', trigger: 'change'}
    ]
    Object.keys(reporter).forEach(function (v, k) {
      if (v !== 'projectSource') {
        reporterRules[v] = inputRequired
      } else {
        reporterRules[v] = radioRequired
      }
    })
    Object.keys(customer).forEach(function (v, k) {
      customerRules[v] = inputRequired
      if (v == 'gender') {
        customerRules[v] = radioRequired
      }
    })
    Object.keys(opus).forEach(function (v, k) {
      opusRules[v] = inputRequired
      if (v == 'type' || v == 'ownership' || v == 'status' || v == 'isSendBack') {
        opusRules[v] = radioRequired
      }
    })
    Object.keys(product).forEach(function (v, k) {
      productRules[v] = inputRequired
      if (v == 'status' || v == 'techSource' || v == 'nature' || v == 'designWay' || v == 'cost' || v == 'coreRole' || v == 'targetGroup' || v == 'targetArea' || v == 'isPatented' || v == 'patentTypeGot' || v == 'isWinPrize' || v == 'industryIntention') {
        productRules[v] = radioRequired
      }
      if (v == 'industryIntentionType') {
        productRules[v] = checkboxRequired
      }
    })

    return {
      mode: 0,
      id: id,
      designerDeleteDialogVisible: false,
      designerInternalObj: {},
      designerNumber: 1,
      chineseCities: chineseCities,
      data: {
        signatory: '',
        signContact: '',
        projectSource: 2,
        reporter: reporter,
        customer: customer,
        designers: designer,
        opus: opus,
        product: product
      },
      rules: {
        signatory: inputRequired,
        signContact: inputRequired,
        projectSource: radioRequired,
        reporter: reporterRules,
        customer: customerRules,
        designers: designerRules,
        opus: opusRules,
        product: productRules
      }
    }
  },
  methods: {
    pasteKiller (a) {
      var that = a.target
      if (a.clipboardData.getData('Text').length > that.maxLength) {
        setTimeout(function () {
          that.value = ''
        }, 20)
      }
    },
    queryStage1 (string, cb) {
      request({
        url: '/v1/award/customers',
        method: 'get',
        params: {
          name: string
        }
      }).then((data) => {
        if (data.code == 300000) {
          cb(data.data.data)
        }
      })
    },
    selectStage1 (item) {
      this.customer.cnAddress = item.companyAddress
      this.customer.city = item.companyCity
      this.customer.contactTel = item.contactPhone
      this.customer.contactName = item.contactName
      this.customer.contactEmail = item.contactEmail
      this.customer.customerId = item.id
      this.customer.gender = item.user.gender
    },
    queryStage2 (string, cb) {
      request({
        url: '/v1/award/designers',
        method: 'get',
        params: {
          name: string
        }
      }).then((data) => {
        if (data.code == 300000) {
          if (data.data) {
            cb(data.data.data)
          }
        }
      })
    },
    selectStage2 (item) {
      this.stage2.designers[this.designerNumber].designerId = item.id
      for (let x of this.$refs['stage2']) {
        x.validate()
      }
    },
    getDesignerNumber (k) {
      this.designerNumber = k
    },
    uploadstage2 (file, CBParams) {
      var k = CBParams.index
      this.data.designers[k].photoUrl = file.file_url
    },
    uploadVideoStage3 (file) {
      this.data.opus.videoUrl = file.file_url
    },
    uploadImageStage3 (file) {
      this.data.opus.pictures.push(file.file_url)
    },
    uploadFileStage3 (file) {
      this.data.opus.documents.push(file.file_url)
    },
    uploadFile1Stage4 (file) {
      this.data.product.patentCert.push(file.file_url)
    },
    uploadFile2Stage4 (file) {
      this.data.product.prizeCert.push(file.file_url)
    },
    submit () {
      request({
        url: '/v1/award/awards/' + this.$route.params.id,
        method: 'put',
        data: {
          ...this.data
        }
      }).then((data) => {
        if (data.code == 300000) {
          this.$router.push({path: '/awards/application-list'})
        }
      })
    },
    querySearch (queryString, cb) {
      var chineseCities = this.chineseCities;
      var results = queryString ? chineseCities.filter(this.createFilter(queryString)) : chineseCities;
      cb(results);
    },
    createFilter (queryString) {
      return (chineseCities) => {
        return (chineseCities.cityName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    }
  },
  mounted () {
    var that = this
    if (this.$route.path.indexOf('select') > -1) {
      this.mode = 0
    }
    if (this.$route.path.indexOf('update') > -1) {
      this.mode = 1
    }
    request({
      url: '/v1/award/awards/' + that.$route.params.id,
      method: 'get'
    }).then((data) => {
      if (data.code == 300000) {
        that.data = data.data
        that.data.opus.designTime = [that.data.opus.startDesignTime, that.data.opus.endDesignTime]
        that.data.product.devTime = [that.data.product.startDevTime, that.data.product.endDevTime]
        that.data.product.expectedTime = [that.data.product.startExpectedTime, that.data.product.endExpectedTime]
      }
    })
  },
  components: {
    'upload-file': uploadFile
  }
}
</script>

<style lang="scss" scoped>
  .el-input__inner, .el-input, .el-select, .el-autocomplete {
    width: 240px!important;
  }
</style>
<style scoped lang="scss">
  @import 'src/styles/mixin.scss';
  .outer-wrapper {
    background: linear-gradient(#409EFF, #ffffff);
  }
  .wrapper {
    margin: 0 auto;
    width: 1180px;
    background-color: #fff;
    border-radius: 10px;
    .logo {
      display: block;
      margin: 0 auto;
      padding-top: 30px;
      padding-bottom: 20px;
    }
    .desc {
      font-size: 20px;
      color: #444156;
      padding-bottom: 30px;
      text-align: center;
    }
    .stage-wrapper {
      margin-bottom: 30px;
      border-top: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
      height: 48px;
      .stages {
        @extend %clearfix;
        width: 844px;
        border-left: 1px solid #ebebeb;
        height: 100%;
        margin: 0 auto;
        .stage {
          @extend %fl;
          display: inline-block;
          height: 100%;
          line-height: 100%;
          width: 139px;
          border-right: 1px solid #ebebeb;
          background-color: #f7f9f8;
          color: #6c6f6e;
          text-align: center;
          line-height: 50px;
        }
        .stage-active {
          background-color: #34cca6;
          color: #fff;
        }
      }
    }
    .stage1, .stage2, .stage3, .stage4 {
      width: 844px;
      margin: 0 auto;
    }
    .title {
      margin-top: 30px;
      margin-bottom: 24px;
      border-left: 4px solid #6e90e3;
      height: 16px;
      line-height: 1;
      font-size: 16px;
      padding-left: 14px;
      color: #333;
      position: relative;
    }
    .line {
      width: 100%;
      height: 1px;
      background-color: #ebebeb;
    }
    .btn-wrapper {
      padding-top: 40px;
      padding-bottom: 50px;
      text-align: center;
    }
    .delete-designer-info {
      position: absolute;
      right: 0;
    }
  }
  .add-designer-btn {
    width: 600px;
    margin: 0 auto;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    background-color: #34cca6;
    color: #fff;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: darken(#34cca6, 10%);
    }
  }
  .el-textarea {
    width: 660px;
  }
  .label-lh {
    label {
      line-height:1.4!important;
    }
  }
  .tishi {
    font-size: 12px;
    color: #999;
  }
  .section-header {
    color: #666;
    padding-bottom: 10px;
    border-bottom: 1px solid #666;
    margin-bottom: 20px;
    margin-top: 30px;
  }
</style>
