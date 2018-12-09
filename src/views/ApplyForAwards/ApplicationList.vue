<template>
  <div>
    <search-form :searchform='formStructure' @queryData="queryData"></search-form>
    <section class="btn-wrapper" style="padding-top: 10px;padding-bottom: 20px;">
      <router-link to="/awards/awards-apply"><el-button>增加报奖</el-button></router-link>
      <el-button style="margin-left: 10px;">导入报奖</el-button>
      <el-button>导入获奖</el-button>
      <el-button @click="exported.visibleExportDialog = true">导出</el-button>
      <a style="margin-left: 10px;" href="http://lkker-10041312.file.myqcloud.com/documents/201804/slje1522721568703.xlsx"><el-button>下载模板</el-button></a>
      <input class="upload-btn" type="file" multiple="false" @change="onUploadAwardsExcel" style="left: 113px" />
      <input class="upload-btn" type="file" multiple="false" @change="onUploadPrizesExcel" style="left: 227px"/>
    </section>
    <el-table
      @selection-change="handleSelectionChange"
      :data="tableData">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="opus.name"
        label="作品名称">
      </el-table-column>
      <el-table-column
        prop="project_source"
        label="项目来源">
      </el-table-column>
      <el-table-column
        prop="opus.type"
        label="作品类型">
      </el-table-column>
      <el-table-column
        prop="task.categorys[0].name"
        label="分类">
      </el-table-column>
      <el-table-column
        prop="customer.cn_name"
        label="客户">
      </el-table-column>
      <el-table-column
        prop="designer"
        label="设计师">
      </el-table-column>
      <el-table-column
        prop="signatory"
        label="录入人">
      </el-table-column>
      <el-table-column
        prop="opus.ownership"
        label="作品归属权">
      </el-table-column>
      <el-table-column
        prop="task.win_status"
        label="中标状态">
      </el-table-column>
      <el-table-column
        prop="prizes[0].name"
        label="已报奖项">
      </el-table-column>
      <el-table-column
        prop="win_prizes[0].name"
        label="已获奖项">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"><router-link :to="'/awards/select/' + scope.row.id">查看</router-link></el-button>
          <el-button type="text" size="small"><router-link :to="'/awards/update/' + scope.row.id">编辑</router-link></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      @current-change="changePage"
      :page="page"
      :total="total">
    </el-pagination>
    <el-dialog
      title="导出"
      :visible.sync="exported.visibleExportDialog">
      <el-collapse>
        <el-form>
          <el-collapse-item name="1">
            <template slot="title">
              <el-checkbox :true-label="1" :false-label="0" v-model="exported.basicInfo.checked"></el-checkbox>基本信息
            </template>
              <el-col :span="8">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.basic.projectSource"></el-checkbox>项目来源
              </el-col>
              <el-col :span="8">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.basic.signatory"></el-checkbox>填写人
              </el-col>
              <el-col :span="8">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.basic.contact"></el-checkbox>联系方式
              </el-col>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <el-checkbox :true-label="1" :false-label="0" v-model="exported.ladyInfo.checked"></el-checkbox>申报者资料
            </template>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.type"></el-checkbox>申报者类型
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.enName"></el-checkbox>申报者名称(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.cnName"></el-checkbox>申报者名称(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.country"></el-checkbox>国家
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.city"></el-checkbox>城市
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.cnAddress"></el-checkbox>详细地址(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.enAddress"></el-checkbox>详细地址(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.postcode"></el-checkbox>邮编
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.tel"></el-checkbox>固定电话
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.email"></el-checkbox>公司E-mail
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.fax"></el-checkbox>传真
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.website"></el-checkbox>网站主页地址
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.corporation"></el-checkbox>法人/责任人
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.contactName"></el-checkbox>联系人姓名
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.contactTel"></el-checkbox>联系人电话
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.contactEmail"></el-checkbox>联系人E-mail
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.reporter.gender"></el-checkbox>联系人性别
              </el-col>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <el-checkbox :true-label="1" :false-label="0" v-model="exported.customerInfo.checked"></el-checkbox>客户资料
            </template>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.type"></el-checkbox>归属人类型
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.cnName"></el-checkbox>企业名称(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.enName"></el-checkbox>企业名称(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.country"></el-checkbox>国家
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.city"></el-checkbox>城市
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.cnAddress"></el-checkbox>详细地址(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.enAddress"></el-checkbox>详细地址(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.postcode"></el-checkbox>邮编
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.tel"></el-checkbox>固定电话
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.email"></el-checkbox>公司E-mail
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.fax"></el-checkbox>传真
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.website"></el-checkbox>网站主页地址
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.corporation"></el-checkbox>法人/责任人
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.contactName"></el-checkbox>联系人姓名
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.contactTel"></el-checkbox>联系人电话
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.contactEmail"></el-checkbox>联系人E-mail
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.customer.gender"></el-checkbox>联系人性别
              </el-col>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template slot="title">
              <el-checkbox :true-label="1" :false-label="0" v-model="exported.designerInfo.checked" @change="selectAll"></el-checkbox>设计师资料
            </template>
            <div>设计师资料/基本资料</div>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.cnName"></el-checkbox>姓名（中文）
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.firstName"></el-checkbox>firstname
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.lastName"></el-checkbox>lastname
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.gender"></el-checkbox>性别
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.idCard"></el-checkbox>身份证号
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.contact"></el-checkbox>联系方式
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.email"></el-checkbox>E-mail
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.photoUrl"></el-checkbox>照片
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.country"></el-checkbox>国家
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.city"></el-checkbox>城市
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.cnAddress"></el-checkbox>联系地址（中文）
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.enAddress"></el-checkbox>联系地址（英文）
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.postcode"></el-checkbox>邮编
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.workingYears"></el-checkbox>工作年限
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.fax"></el-checkbox>传真
              </el-col>
            <div>设计师资料/教育经历</div>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.schoolName"></el-checkbox>校名(最高学历)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.enSchoolName"></el-checkbox>校名(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.diploma"></el-checkbox>学历
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.country"></el-checkbox>国家
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.city"></el-checkbox>城市
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.cnAddress"></el-checkbox>联系地址（中文）
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.enAddress"></el-checkbox>联系地址（英文）
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.contactEmail"></el-checkbox>学校E-mail
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.fax"></el-checkbox>传真
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.contactTel"></el-checkbox>固定电话
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.edu.postcode"></el-checkbox>邮编
              </el-col>
            <div>设计师资料/公司信息</div>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.cnName"></el-checkbox>企业名称(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.enName"></el-checkbox>企业名称(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.depName"></el-checkbox>部门
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.post"></el-checkbox>职务
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.country"></el-checkbox>国家
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.city"></el-checkbox>城市
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.cnAddress"></el-checkbox>详细地址(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.enAddress"></el-checkbox>详细地址(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.postcode"></el-checkbox>邮编
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.tel"></el-checkbox>固定电话
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.email"></el-checkbox>公司E-mail
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.fax"></el-checkbox>传真
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.site"></el-checkbox>网站主页地址
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.orgCode"></el-checkbox>组织机构代码
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.designer.com.businessLicence"></el-checkbox>营业执照
              </el-col>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template slot="title">
              <el-checkbox :true-label="1" :false-label="0" v-model="exported.workInfo.checked"></el-checkbox>作品资料
            </template>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.name"></el-checkbox>作品名称
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.type"></el-checkbox>作品类型
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.ownership"></el-checkbox>作品归属权
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.designTime"></el-checkbox>设计时间(月)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.type"></el-checkbox>品牌状态类型
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.cnProductDesignSummary"></el-checkbox>一句话描述(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.enProductDesignSummary"></el-checkbox>一句话描述(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.cnDesignConcept"></el-checkbox>设计理念(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.enDesignConcept"></el-checkbox>设计理念(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.cnIntroExt"></el-checkbox>产品介绍延展(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.enIntroExt"></el-checkbox>产品介绍延展(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.cnChallenge"></el-checkbox>面临挑战(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.enChallenge"></el-checkbox>面临挑战(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.cnFeature"></el-checkbox>独特的设计(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.enFeature"></el-checkbox>独特的设计(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.cnUserExperience"></el-checkbox>用户体验(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.enUserExperience"></el-checkbox>用户体验(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.cnBenefitCustomer"></el-checkbox>盈利商业模式(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.enBenefitCustomer"></el-checkbox>盈利商业模式(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.cnBenefitSociety"></el-checkbox>有利于社会(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.enBenefitSociety"></el-checkbox>有利于社会(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.video"></el-checkbox>视频
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.videoPath"></el-checkbox>视频地址
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.videoPwd"></el-checkbox>视频密码
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.pictures"></el-checkbox>图片
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.documents"></el-checkbox>文档
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.exhibitType"></el-checkbox>提交实物模式
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.opus.isSendBack"></el-checkbox>是否寄回
              </el-col>
          </el-collapse-item>
          <el-collapse-item name="6">
            <template slot="title">
              <el-checkbox :true-label="1" :false-label="0" v-model="exported.productInfo.checked"></el-checkbox>产品资料
            </template>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.cnName"></el-checkbox>产品名称(中文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.enName"></el-checkbox>产品名称(英文)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.status"></el-checkbox>产品状态
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.introLength"></el-checkbox>产品长(mm)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.introWidth"></el-checkbox>产品宽(mm)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.introHeight"></el-checkbox>产品高(mm)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.introWeight"></el-checkbox>产品重量(kg)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.price"></el-checkbox>市场价格(元)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.launchDate"></el-checkbox>上市日期
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.expectedLaunchPrice"></el-checkbox>预计市场价格
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.expectedLaunchDate"></el-checkbox>预计上市日期
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.devTime"></el-checkbox>开发时间(月)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.techSource"></el-checkbox>技术来源
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.nature"></el-checkbox>产品性质
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.designWay"></el-checkbox>设计方式
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.cost"></el-checkbox>预算/研发成本
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.coreRole"></el-checkbox>核心作用
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.targetGroup"></el-checkbox>目标群体
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.targetArea"></el-checkbox>服务目标地区
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.isPatented"></el-checkbox>是否取得专利
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.patentTypeGot"></el-checkbox>专利类型(已获得)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.patentTypeApply"></el-checkbox>专利类型(正在申请)
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.patentCert"></el-checkbox>专利证明
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.isWinPrize"></el-checkbox>获奖情况
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.prizeCert"></el-checkbox>获奖证明
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.industryIntention"></el-checkbox>产业转化意向
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.industryIntentionType"></el-checkbox>产业转化需求类型
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.demandDesc"></el-checkbox>需求描述
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.purchaseLink"></el-checkbox>产品购买链接
              </el-col>
              <el-col :span="6">
                <el-checkbox :true-label="1" :false-label="0" v-model="exported.data.mark.product.keywords"></el-checkbox>产品关键词
              </el-col>
          </el-collapse-item>
        </el-form>
      </el-collapse>
      <div style="text-align: center;margin-top: 20px;"><el-button type="primary" @click="exportExcel">确定</el-button><el-button @click="exported.visibleExportDialog = false">取消</el-button></div>
    </el-dialog>
    <el-dialog
      title="导入奖项"
      :visible.sync="imported.awardsVisible">
      <el-table
        :data="imported.awardsData"
        max-height="350"
        stripe>
        <el-table-column
          label="作品序号"
          prop="opusId">
          <template slot-scope="scope">
            <el-input v-model="scope.row['opusId']" @blur="editImportAwards"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="作品名称"
          prop="opusName">
        </el-table-column>
        <el-table-column
          label="奖项编号"
          prop="prizeId">
          <template slot-scope="scope">
            <el-input v-model="scope.row['prizeId']" @blur="editImportAwards"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="奖项名称"
          prop="prizeName">
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;text-align: center;">
        <el-button @click="imported.awardsVisible = false">取消</el-button>
        <el-button type="primary" @click="saveImported">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import request from '@/utils/request'
import searchForm from '@/components/Form/inline.vue'
import sheet from '@/components/ExcelConvert/Sheet.vue'

export default {
  data () {
    var form = {
      id: '',
      opusName: '',
      projectSource: '',
      opusType: '',
      categoryId: '',
      startTime: '',
      endTime: '',
      customerName: '',
      designerName: '',
      signatory: '',
      ownership: '',
      winStatus: '',
      reportPrize: '',
      gotPrize: '',
      create_time: []
    }
    return {
      tableData: [],
      total: 0,
      page: 1,
      formStructure: {
        'id': {
          type: 'input',
          label: '序号',
          placeholder: ''
        },
        'opusName': {
          type: 'input',
          label: '作品名称',
          placeholder: ''
        },
        'projectSource': {
          type: 'select',
          label: '项目来源',
          placeholder: '',
          list: [
            {
              label: '洛可可',
              value: 1
            },
            {
              label: '洛客',
              value: 2
            }
          ]
        },
        'opusType': {
          type: 'select',
          label: '作品类型',
          placeholder: '',
          list: [
            {
              label: '工业',
              value: 1
            },
            {
              label: '品牌',
              value: 2
            }
          ]
        },
        'categoryId': {
          type: 'select',
          label: '分类',
          placeholder: '',
          list: []
        },
        'customerName': {
          type: 'input',
          label: '客户',
          placeholder: ''
        },
        'designerName': {
          type: 'input',
          label: '设计师',
          placeholder: ''
        },
        'signatory': {
          type: 'input',
          label: '录入人',
          placeholder: ''
        },
        'ownership': {
          type: 'select',
          label: '作品归属',
          placeholder: '',
          list: [
            {
              label: '洛客',
              value: 1
            },
            {
              label: '洛可可',
              value: 2
            },
            {
              label: '其他',
              value: 3
            }
          ]
        },
        'winStatus': {
          type: 'select',
          label: '中标状态',
          placeholder: '',
          list: [
            {
              label: '未中标',
              value: 0
            },
            {
              label: '已中标',
              value: 1
            }
          ]
        },
        'reportPrize': {
          type: 'select',
          label: '已报奖项',
          placeholder: '',
          list: []
        },
        'gotPrize': {
          type: 'select',
          label: '已获奖项',
          placeholder: '',
          list: []
        },
        'create_time': {
          type: 'date',
          label: '创建时间',
          name1: 'startTime',
          name2: 'endTime'
        },
        'button': {
          type: 'button',
          btnText: '搜索'
        },
        form: form
      },
      exported: {
        visibleExportDialog: false,
        data: {
          filter: form,
          mark: {
            basic: {
              projectSource: 1,
              signatory: 1,
              contact: 1
            },
            reporter: {
              type: 1,
              cnName: 1,
              enName: 1,
              country: 1,
              city: 1,
              cnAddress: 1,
              enAddress: 1,
              postcode: 1,
              tel: 1,
              email: 1,
              fax: 1,
              website: 1,
              corporation: 1,
              contactName: 1,
              contactTel: 1,
              contactEmail: 1,
              gender: 1
            },
            customer: {
              type: 1,
              cnName: 1,
              enName: 1,
              country: 1,
              city: 1,
              cnAddress: 1,
              enAddress: 1,
              postcode: 1,
              tel: 1,
              email: 1,
              fax: 1,
              website: 1,
              corporation: 1,
              contactName: 1,
              contactTel: 1,
              contactEmail: 1,
              gender: 1
            },
            designer: {
              cnName: 1,
              firstName: 1,
              lastName: 1,
              gender: 1,
              photoUrl: 1,
              idCard: 1,
              contact: 1,
              email: 1,
              fax: 1,
              country: 1,
              city: 1,
              cnAddress: 1,
              enAddress: 1,
              postcode: 1,
              workingYears: 1,
              edu: {
                schoolName: 1,
                enSchoolName: 1,
                diploma: 1,
                country: 1,
                city: 1,
                cnAddress: 1,
                enAddress: 1,
                postcode: 1,
                contactTel: 1,
                contactEmail: 1,
                fax: 1
              },
              com: {
                designerId: 1,
                cnName: 1,
                enName: 1,
                depName: 1,
                post: 1,
                country: 1,
                city: 1,
                cnAddress: 1,
                enAddress: 1,
                postcode: 1,
                tel: 1,
                email: 1,
                fax: 1,
                site: 1,
                orgCode: 1,
                businessLicence: 1
              }
            },
            opus: {
              name: 1,
              type: 1,
              ownership: 1,
              designTime: 1,
              cnProductDesignSummary: 1,
              enProductDesignSummary: 1,
              cnDesignConcept: 1,
              enDesignConcept: 1,
              cnChallenge: 1,
              enChallenge: 1,
              cnFeature: 1,
              enFeature: 1,
              cnUserExperience: 1,
              enUserExperience: 1,
              cnBenefitCustomer: 1,
              enBenefitCustomer: 1,
              cnBenefitSociety: 1,
              enBenefitSociety: 1,
              cnIntroExt: 1,
              enIntroExt: 1,
              video: 1,
              videoPath: 1,
              videoPwd: 1,
              pictures: 1,
              documents: 1,
              exhibitType: 1,
              isSendBack: 1
            },
            product: {
              cnName: 1,
              enName: 1,
              status: 1,
              introLength: 1,
              introWidth: 1,
              introHeight: 1,
              introWeight: 1,
              price: 1,
              devTime: 1,
              startDevTime: 1,
              endDevTime: 1,
              techSource: 1,
              nature: 1,
              designWay: 1,
              cost: 1,
              coreRole: 1,
              targetGroup: 1,
              targetArea: 1,
              isPatented: 1,
              patentTypeGot: 1,
              patentCert: 1,
              isWinPrize: 1,
              prizeCert: 1,
              industryIntention: 1,
              IndustryIntentionType: 1,
              demandDesc: 1,
              launchAt: 1,
              expectedLaunchPrice: 1,
              expectedLaunchDate: 1,
              patentTypeApply: 1,
              purchaseLink: 1,
              keywords: 1,
              brandDesignType: 1,
              brandStatus: 1,
              expectedTime: 1,
              endExpectedTime: 1,
              startExpectedTime: 1,
              industryIntentionType: 1,
              launchDate: 1
            }
          }
        },
        basicInfo: {
          checked: 1
        },
        ladyInfo: {
          checked: 1
        },
        customerInfo: {
          checked: 1
        },
        designerInfo: {
          checked: 1
        },
        workInfo: {
          checked: 1
        },
        productInfo: {
          checked: 1
        }
      },
      imported: {
        awardsVisible: false,
        type: '',
        awardsOriginData: [],
        awardsData: []
      },
      xx: true,
      exportsIds: []
    }
  },
  watch: {
    'exported.basicInfo.checked': function (val) {
      var obj = this.exported.data.mark.basic
      for (let p in obj) {
        obj[p] = val
      }
    },
    'exported.ladyInfo.checked': function (val) {
      var obj = this.exported.data.mark.reporter
      for (let p in obj) {
        obj[p] = val
      }
    },
    'exported.customerInfo.checked': function (val) {
      var obj = this.exported.data.mark.customer
      for (let p in obj) {
        obj[p] = val
      }
    },
    'exported.designerInfo.checked': function (val) {
      var obj = this.exported.data.mark.designer
      for (let p in obj) {
        if (p !== 'edu' || p !== 'com') {
          obj[p] = val
        } else {
          for (let pp in obj[p]) {
            obj[p][pp] = val
          }
        }
      }
    },
    'exported.workInfo.checked': function (val) {
      var obj = this.exported.data.mark.opus
      for (let p in obj) {
        obj[p] = val
      }
    },
    'exported.productInfo.checked': function (val) {
      var obj = this.exported.data.mark.product
      for (let p in obj) {
        obj[p] = val
      }
    }
  },
  methods: {
    getData (params = {}) {
      request({
        url: '/v1/award/awards',
        method: 'GET',
        params: {page: this.page, ...this.formStructure.form}
      }).then((data) => {
        if (data.code == 300000) {
          var tableData = data.data.data
          tableData.designer = []
          for (let p of tableData) {
            if (p.project_source == 1) {
              p.project_source = '洛可可'
            } else if (p.project_source == 2) {
              p.project_source = '洛客'
            }
          }
          for (let p of tableData) {
            if (p.opus) {
              if (p.opus.type == 1) {
                p.opus.type = '工业'
              } else if (p.opus.type == 2) {
                p.opus.type = '品牌'
              }
            }
          }
          for (let p of tableData) {
            if (p.opus) {
              if (p.opus.ownership == 1) {
                p.opus.ownership = '洛客'
              } else if (p.opus.ownership == 2) {
                p.opus.ownership = '洛可可'
              } else if (p.opus.ownership == 3) {
                p.opus.ownership = '其他'
              }
            }
          }
          for (let p of tableData) {
            if (p.designers) {
              p.designer = []
              for (let x of p.designers) {
                p.designer.push(x.cn_name)
              }
              p.designer = p.designer.join(' ')
            }
          }
          this.tableData = data.data.data
          this.total = data.data.total
          this.page = data.data.current_page
        }
      })
    },
    changePage (page) {
      this.page = page
      this.getData()
    },
    queryData () {
      var createTime = this.formStructure.form.create_time
      if (createTime.length > 0) {
        this.formStructure.form.startTime = createTime[0]
        this.formStructure.form.endTime = createTime[1]
      } else {
        this.formStructure.form.startTime = ''
        this.formStructure.form.endTime = ''
      }
      this.getData()
    },
    onUploadAwardsExcel (evt) {
      this.importExcel('awards', evt)
    },
    onUploadPrizesExcel (evt) {
      this.importExcel('prizes', evt)
    },
    importExcel (type, evt) {
      var that = this
      var file;
      var files = evt.target.files;

      if (!files || files.length == 0) return;

      file = files[0];

      var reader = new FileReader();
      reader.onload = function (e) {
        // pre-process data
        var binary = '';
        var bytes = new Uint8Array(e.target.result);
        var length = bytes.byteLength;
        for (var i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        /* read workbook */
        var wb = XLSX.read(binary, {type: 'binary'});

        /* grab first sheet */
        var wsname = wb.SheetNames[0];
        var ws = wb.Sheets[wsname];

        /* generate JSON */
        var awards = XLSX.utils.sheet_to_json(ws);
        that.imported.awardsOriginData = awards
        awards.forEach(function (v, k) {
          for (let p in v) {
            if (p == '作品序号') {
              v['opusId'] = v['作品序号']
              delete v['作品序号']
            }
            if (p == '奖项序号') {
              v['prizeId'] = v['奖项序号']
              delete v['奖项序号']
            }
          }
        })
        request({
          url: '/v1/award/prizes/opus',
          method: 'POST',
          data: {
            data: awards
          }
        }).then((data) => {
          if (data.code == 300000) {
            that.imported.awardsData = data.data
          }
        })
        if (type == 'awards') {
          that.imported.type = 'awards'
        } else if (type == 'prizes') {
          that.imported.type = 'prizes'
        }
        that.imported.awardsVisible = true
      };

      reader.readAsArrayBuffer(file);
    },
    saveImported () {
      var url = ''
      var data = {}
      data = this.imported.awardsData
      data.forEach(function (v, k) {
        delete v.opusName
        delete v.prizeName
      })
      if (this.imported.type == 'awards') {
        url = '/v1/award/awards/import'
      } else if (this.imported.type == 'prizes') {
        url = '/v1/award/awards/import-win'
      }
      request({
        url: url,
        method: 'post',
        data: {
          data: data
        }
      }).then((data) => {
        if (data.code == 300000) {
          this.$router.go()
        }
      })
    },
    editImportAwards () {
      var data = {}
      data = this.imported.awardsData
      delete data.opusName
      delete data.prizeName
      request({
        url: '/v1/award/prizes/opus',
        method: 'POST',
        data: {
          data: data
        }
      }).then((data) => {
        if (data.code == 300000) {
          this.imported.awardsData = data.data
        }
      })
    },
    selectAll (val) {

    },
    exportExcel () {
      var data = this.exported.data
      data.filter.ids = this.exportsIds
      request({
        url: '/v1/award/awards/export',
        method: 'post',
        data: {
          ...data
        },
        timeout: 20000
      }).then((data) => {
        if (data.code == 300000) {
          window.location.href = data.data.url
        }
      })
    },
    handleSelectionChange (val) {
      this.exportsIds = []
      if (val && val.length !== 0) {
        for (let i = 0; i < val.length; i++) {
          this.exportsIds.push(val[i].id)
        }
      }
    }
  },
  mounted () {
    request({
      url: '/v1/award/category-list',
      method: 'GET'
    }).then((data) => {
      if (data.code == 300000) {
        this.formStructure.categoryId.list = data.data
      }
    })

    request({
      url: '/v1/award/prize-list',
      method: 'GET'
    }).then((data) => {
      if (data.code == 300000) {
        this.formStructure.reportPrize.list = data.data
        this.formStructure.gotPrize.list = data.data
      }
    })

    this.getData()
  },
  components: {'search-form': searchForm, 'excel-convert': sheet}
}
</script>

<style lang="scss" scoped>
  .btn-wrapper {
    position: relative;
    .upload-btn {
      width: 100px;
      height: 40px;
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }
  }
</style>
