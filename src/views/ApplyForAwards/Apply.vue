<template>
  <div class="outer-wrapper">
    <div class="wrapper">
      <header>
        <img class="logo" src="@/assets/images/logo.png" alt="洛客">
        <div class="desc">洛客设计奖项申报信息录入</div>
      </header>
      <nav class="stage-wrapper">
        <div class="stages">
          <div :class="{'stage-active': activeStage === 1}" class="stage">① 客户资料</div>
          <div :class="{'stage-active': activeStage === 2}" class="stage">② 设计师资料</div>
          <div :class="{'stage-active': activeStage === 3}" class="stage">③ 报奖作品介绍</div>
          <div :class="{'stage-active': activeStage === 4}" class="stage">④ 产品资料</div>
        </div>
      </nav>
      <!--表单区域-->
      <el-row>
        <el-form
          :rules="stage1Rules"
          :inline="true"
          ref="stage1"
          v-show="activeStage === 1"
          label-width="120px"
          label-position="left"
          :model="stage1"
          class="stage1">
          <el-row>
            <el-col :span="12">
              <el-form-item label="企业名称(中文)" prop="cnName">
                <el-autocomplete
                  value-key="companyName"
                  v-model="stage1.cnName"
                  :fetch-suggestions="queryStage1"
                  @select="selectStage1">
                  <template slot-scope="props">
                    <div class="name">{{ props.item.companyName }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称(英文)" prop="enName">
                <el-input v-model="stage1.enName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="国家" prop="country">
                <el-input v-model="stage1.country"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市" prop="city">
                <el-autocomplete
                  v-model="stage1.city"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  value-key="cityName"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="详细地址(中文)" prop="cnAddress">
                <el-input v-model="stage1.cnAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址(英文)" prop="enAddress">
                <el-input v-model="stage1.enAddress"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮编" prop="postcode">
                <el-input v-model="stage1.postcode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="固定电话" prop="tel">
                <el-input v-model="stage1.tel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司email" prop="email">
                <el-input v-model="stage1.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真">
                <el-input v-model="stage1.fax"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="网站主页地址" prop="website">
                <el-input v-model="stage1.website"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人/责任人" prop="corporation">
                <el-input v-model="stage1.corporation"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人姓名" prop="contactName">
                <el-input v-model="stage1.contactName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="contactTel">
                <el-input v-model="stage1.contactTel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人email" prop="contactEmail">
                <el-input v-model="stage1.contactEmail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人性别" prop="gender">
                <el-radio-group v-model="stage1.gender">
                  <el-radio :label="0">男</el-radio>
                  <el-radio :label="1">女</el-radio>
                  <el-radio :label="2">保密</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          :rules="stage2Rules"
          :inline="true"
          v-show="activeStage === 2"
          label-width="120px"
          label-position="left"
          :model="stage2.designers[k]"
          ref="stage2"
          class="stage2"
          v-for="(v, k) in stage2.designers"
          :key="k">
          <div class="title">
            <span style="vertical-align: top;">{{ k+1 }}. 设计师资料</span>
            <el-button v-if="k > 0" class="delete-designer-info" icon="el-icon-delete" type="text" @click="deleteDesignerInfo">删除</el-button>
          </div>
          <div class="line" style="margin-bottom: 20px;"></div>
          <div style="margin-bottom: 10px;">设计师基本信息 >></div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名(中文)" prop="cnName">
                <el-autocomplete
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
              <el-form-item label="first name" prop="firstName">
                <el-input v-model="v.firstName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="last name" prop="lastName">
                <el-input v-model="v.lastName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="v.gender">
                  <el-radio :label="0">男</el-radio>
                  <el-radio :label="1">女</el-radio>
                  <el-radio :label="2">保密</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="照片" prop="photoUrl">
                <upload-file :upfileSize="4000" :CBParams="{index: k}" :upfileType="'image'" customFormat="jpg、jpeg" :upLimit="1" :upMultiple="false" @urlCB="uploadstage2" info="上传正面照片"></upload-file>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="v.idCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式" prop="contact">
                <el-input v-model="v.contact"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="email" prop="email">
                <el-input v-model="v.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真">
                <el-input v-model="v.fax"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="国家" prop="country">
                <el-input v-model="v.country"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市" prop="city">
                <el-autocomplete
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
              <el-form-item label="详细地址(中文)" prop="cnAddress">
                <el-input v-model="v.cnAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址(英文)" prop="enAddress">
                <el-input v-model="v.enAddress"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮编" prop="postcode">
                <el-input v-model="v.postcode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作年限(年)" prop="workingYears">
                <el-input v-model="v.workingYears"></el-input>
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
              <el-form-item label="校名(中文)" prop="edu.schoolName">
                <el-input v-model="v.edu.schoolName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="校名(英文)" prop="edu.enSchoolName">
                <el-input v-model="v.edu.enSchoolName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="学历" prop="edu.diploma">
                <el-radio-group v-model="v.edu.diploma">
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
              <el-form-item label="国家" prop="edu.country">
                <el-input v-model="v.edu.country"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="城市" prop="edu.city">
                <el-autocomplete
                  v-model="v.edu.city"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  value-key="cityName"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址(中文)" prop="edu.cnAddress">
                <el-input v-model="v.edu.cnAddress"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="详细地址(英文)" prop="edu.enAddress">
                <el-input v-model="v.edu.enAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮编" prop="edu.postcode">
                <el-input v-model="v.edu.postcode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="固定电话" prop="edu.contactTel">
                <el-input v-model="v.edu.contactTel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学校email" prop="edu.contactEmail">
                <el-input v-model="v.edu.contactEmail"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="传真">
                <el-input v-model="v.edu.fax"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          :rules="stage3Rules"
          :inline="true"
          v-show="activeStage === 3"
          label-width="120px"
          label-position="left"
          :model="stage3"
          ref="stage3"
          class="stage3">
          <el-row>
            <el-col :span="12">
              <el-form-item label="作品名称" prop="name">
                <el-input v-model="stage3.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="作品类型" prop="type">
                <el-radio-group v-model="stage3.type">
                  <el-radio :label="1">工业</el-radio>
                  <el-radio :label="2">品牌</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="作品归属权" prop="ownership">
                <el-radio-group v-model="stage3.ownership">
                  <el-radio :label="1">洛客</el-radio>
                  <el-radio :label="2">洛可可</el-radio>
                  <el-radio :label="3">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设计时间(月)" prop="designTime">
                <el-date-picker
                  v-model="stage3.designTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  :default-value="new Date(1525244917489)"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
                <span>共{{ getMonth(stage3.designTime) || 0 }}月</span>
              </el-form-item>
            </el-col>
          </el-row>
          <h4>产品设计介绍 >><span class="tishi">（字符数包括文字数、标点和空格；请保证中英文内容描述一致）</span></h4>
          <el-row>
            <el-col :span="24">
              <el-form-item label="一句话总结(中文)" prop="cnProductDesignSummary" label-width="160px">
                <el-input @paste.native="pasteKiller" :rows="5" resize="none" v-model="stage3.cnProductDesignSummary" type="textarea" :maxlength="100" placeholder="包括您的参赛作品的官方标题，并使用完整的句子提交，最多100字符。你也可以用这句话来描述您的参赛作品。"></el-input>
                <input-counter :content="stage3.cnProductDesignSummary" maxlength="100"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="一句话总结(英文)" prop="enProductDesignSummary" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.enProductDesignSummary" type="textarea" :maxlength="100" placeholder="——Include the official title of your entry and use complete sentences to submit a comprehensive, 100-character max. description of your entry—perhaps one that you would use to describe your entry to the general public."></el-input>
                <input-counter :content="stage3.enProductDesignSummary" maxlength="100"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="设计说明(中文)" prop="cnDesignConcept" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.cnDesignConcept" type="textarea" placeholder="实现可能、使用功效、制造成本、美感质量和能源环保、对作品设计理念、用途、功能等整体进行说明。英文、含标点150字符。" :maxlength="150"></el-input>
                <input-counter :content="stage3.cnDesignConcept" maxlength="150"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="设计说明(英文)" prop="enDesignConcept" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.enDesignConcept" type="textarea" placeholder="——Realize the possible use, efficacy, manufacturing cost, aesthetic quality and energy and environmental protection, and explain the design concept, use and function of the work as a whole. English, including punctuation 150 characters."></el-input>
                <input-counter :content="stage3.enDesignConcept" maxlength="150"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="面临挑战(中文)" prop="cnChallenge" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.cnChallenge" type="textarea" :maxlength="250" placeholder="您在创建此产品/项目面临的挑战是什么？英文、含标点250字符。"></el-input>
                <input-counter :content="stage3.cnChallenge" maxlength="250"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="面临挑战(英文)" prop="enChallenge" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.enChallenge" type="textarea" :maxlength="250" placeholder="——What was the challenge that you faced in creating this product/project? English, including punctuation 250 characters."></el-input>
                <input-counter :content="stage3.enChallenge" maxlength="250"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="独特的设计(中文)" prop="cnFeature" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.cnFeature" type="textarea" :maxlength="250" placeholder="与其他此类设计相比，这种设计如何独特或创新？英文、含标点250字符。"></el-input>
                <input-counter :content="stage3.cnFeature" maxlength="250"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="独特的设计(英文)" prop="enFeature" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.enFeature" type="textarea" :maxlength="250" placeholder="——How is this design unique or innovative, compared to other designs in this category?English, including punctuation 250 characters."></el-input>
                <input-counter :content="stage3.enFeature" maxlength="250"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户体验(中文)" prop="cnUserExperience" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.cnUserExperience" type="textarea" :maxlength="250" placeholder="这种设计如何提供一种简单的、 直观的或令人愉快的用户体验？英文、含标点250字符。"></el-input>
                <input-counter :content="stage3.cnUserExperience" maxlength="250"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户体验(英文)" prop="enUserExperience" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.enUserExperience" type="textarea" :maxlength="250" placeholder="——How does this design deliver a simple, intuitive or delightful user experience?English, including punctuation 250 characters."></el-input>
                <input-counter :content="stage3.enUserExperience" maxlength="250"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="商业盈利模式(中文)" prop="cnBenefitCustomer" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.cnBenefitCustomer" type="textarea" :maxlength="250" placeholder="这种设计如何提高客户或制造商的盈利能力，品牌声誉，员工士气等？英文、含标点250字符。"></el-input>
                <input-counter :content="stage3.cnBenefitCustomer" maxlength="250"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="商业盈利模式(英文)" prop="enBenefitCustomer" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.enBenefitCustomer" type="textarea" :maxlength="250" placeholder="——How does this design improve the client or manufacturer's profitability, brand reputation, employee morale, etc.?English, including punctuation 250 characters."></el-input>
                <input-counter :content="stage3.enBenefitCustomer" maxlength="250"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="有利于社会(中文)" prop="cnBenefitSociety" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.cnBenefitSociety" type="textarea" :maxlength="250" placeholder="这种设计获得更大的利益; 有哪些好处考虑社会、 环境、 文化、 经济等？英文、含标点250字符。"></el-input>
                <input-counter :content="stage3.cnBenefitSociety" maxlength="250"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="有利于社会(英文)" prop="enBenefitSociety" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.enBenefitSociety" type="textarea" :maxlength="250" placeholder="——How does this design benefit the greater good; consider society, the environment, culture, the economy, etc.?English, including punctuation 250 characters."></el-input>
                <input-counter :content="stage3.enBenefitSociety" maxlength="250"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="产品介绍延展(中文)" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.cnIntroExt" type="textarea" :maxlength="1500" placeholder="其他延展类产品信息文字，1500个字符以内"></el-input>
                <input-counter :content="stage3.cnIntroExt" maxlength="1500"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="产品介绍延展(英文)" label-width="160px">
                <el-input :rows="5" resize="none" v-model="stage3.enIntroExt" type="textarea" :maxlength="1500" placeholder="——Other extension product information text, within 1500 characters"></el-input>
                <input-counter :content="stage3.enIntroExt" maxlength="1500"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="视频" label-width="160px">
                <upload-file :upfileSize="51200" :upfileType="'video'" customFormat="mp4" :upLimit="1" :upMultiple="false" @urlCB="uploadVideoStage3" @removeFile="removeUploadVideoStage3" info="上传视频有助于评委直观了解产品，更有利于获奖"></upload-file>
                <span class="tishi">1、格式：MP4；2、大小：50Mb；3、时长：不超过2分钟；4、内容：如有字幕，则至少应包含英文</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="视频地址" label-width="160px">
                <el-input v-model="stage3.videoPath"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="视频密码" label-width="120px">
                <el-input v-model="stage3.videoPwd"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="图片" prop="pictures" label-width="160px">
                <upload-file :upfileSize="2048" :upfileType="'image'" customForamt="jpg、jpeg" :upLimit="10" :upMultiple="false" @urlCB="uploadImageStage3" @removeFile="removeUploadImageStage3"></upload-file>
                <span class="tishi">1、数量：6-10张；2、格式（2种）：未压缩apg ，jpeg；3、尺寸：A3尺寸297mm×420mm；4、大小：2Mb；<br>5、分辨率：300DPI；6、图片内容要求：不要使用任何文字和线条已上市量产的产品必须有：实物或实景拍摄</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所有权证明文件" label-width="160px">
                <upload-file :upfileSize="4096" :upfileType="'file'" :upLimit="5" :upMultiple="false" @urlCB="uploadFileStage3" @removeFile="removeUploadFileStage3"></upload-file>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="提交实物模式" prop="isSendBack" label-width="160px">
                <el-checkbox-group v-model="stage3.exhibitType">
                  <el-checkbox :label="1">实物</el-checkbox>
                  <el-checkbox :label="2">模型</el-checkbox>
                  <el-checkbox :label="3">手板</el-checkbox>
                  <el-checkbox :label="4">展板</el-checkbox>
                  <el-checkbox :label="5">视频</el-checkbox>
                  <el-checkbox :label="6">图片</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否寄回" prop="isSendBack" label-width="160px">
                <el-radio-group v-model="stage3.isSendBack">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          :rules="stage4Rules"
          :inline="true"
          v-show="activeStage === 4"
          label-width="120px"
          label-position="left"
          :model="stage4"
          ref="stage4"
          class="stage4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品名称(中文)" prop="cnName">
                <el-input v-model="stage4.cnName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品名称(英文)" prop="enName">
                <el-input v-model="stage4.enName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="stage3.type == 1">
            <el-col :span="24">
              <el-form-item label="产品状态" prop="status">
                <el-radio-group v-model="stage4.status">
                  <el-radio :label="1">已上市</el-radio>
                  <el-radio :label="4">已量产</el-radio>
                  <el-radio :label="3">已有功能样机</el-radio>
                  <el-radio :label="2">已有外观模型</el-radio>
                  <el-radio :label="5">概念</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="stage3.type == 2">
            <el-col :span="12">
              <el-form-item label="品牌设计类型" prop="brandDesignType">
                <el-radio-group v-model="stage4.brandDesignType">
                  <el-radio :label="1">平面</el-radio>
                  <el-radio :label="2">包装</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="stage3.type == 2">
            <el-col :span="12">
              <el-form-item label="品牌状态类型" prop="brandStatus">
                <el-radio-group v-model="stage4.brandStatus">
                  <el-radio :label="1">已投放使用</el-radio>
                  <el-radio :label="2">未投放使用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="stage3.type == 2 && stage4.brandStatus == 1">
              <el-form-item label="投放日期" prop="launchAt">
                <el-date-picker
                  :default-value="new Date(1525244917489)"
                  value-format="yyyy-MM-dd"
                  v-model="stage4.launchAt">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品长(mm)" prop="introLength">
                <el-input v-model="stage4.introLength"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品宽(mm)" prop="introWidth">
                <el-input v-model="stage4.introWidth"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="stage3.type == 1 || (stage4.brandDesignType == 2 && stage3.type == 2)">
              <el-form-item label="产品高(mm)" prop="introHeight">
                <el-input v-model="stage4.introHeight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="stage3.type == 1 && (stage4.status == 1 || stage4.status == 4)">
              <el-form-item label="产品重量(kg)" prop="introWeight">
                <el-input v-model="stage4.introWeight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="stage3.type == 1 && (stage4.status == 1 || stage4.status == 4 || stage4.status == 3)">
              <el-form-item label="开发时间(月)" prop="devTime">
                <el-date-picker
                  :default-value="new Date(1525244917489)"
                  v-model="stage4.devTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
                <span>共{{ getMonth(stage3.devTime) || 0 }}月</span>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="stage3.type == 1">
            <el-row>
              <el-col :span="24" v-if="stage4.status == 2">
                <el-form-item label="产品开发日期和预计产品开发结束日期" prop="expectedTime" style="line-height: 14px;">
                  <el-date-picker
                    :default-value="new Date(1525244917489)"
                    v-model="stage4.expectedTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                  <span>共{{ getMonth(stage3.expectedTime) || 0 }}月</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="stage4.status == 1">
                <el-form-item label="市场价格(元)" prop="price">
                  <el-input v-model="stage4.price"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="stage4.status == 1">
                <el-form-item label="上市日期" prop="launchDate">
                  <el-date-picker
                    :default-value="new Date(1525244917489)"
                    value-format="yyyy-MM-dd"
                    v-model="stage4.launchDate">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="stage4.status == 2 || stage4.status == 3 || stage4.status == 4|| stage4.status == 5">
                <el-form-item label="预计市场价格" prop="expectedLaunchPrice">
                  <el-input v-model="stage4.expectedLaunchPrice" placeholder="元"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" v-if="stage4.status == 2 || stage4.status == 3 || stage4.status == 4|| stage4.status == 5">
                <el-form-item label="预计上市日期" prop="expectedLaunchDate">
                  <el-date-picker
                    :default-value="new Date(1525244917489)"
                    v-model="stage4.expectedLaunchDate"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="stage4.status == 2|| stage4.status == 3">
              <el-col :span="24">
                <el-form-item label="技术来源" prop="techSource">
                  <el-select
                    v-model="stage4.techSource">
                    <el-option
                      label="项目负责人个人发明"
                      value="1"></el-option>
                    <el-option
                      label="知名导师科研成果"
                      value="2"></el-option>
                    <el-option
                      label="行业领先专家科研成果"
                      value="3"></el-option>
                    <el-option
                      label="科研院所研究成果"
                      value="4"></el-option>
                    <el-option
                      label="其他"
                      value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="stage3.type == 1">
              <el-col :span="24">
                <el-form-item label="产品性质" prop="nature">
                  <el-checkbox-group v-model="stage4.nature">
                    <el-checkbox :label="1">在中国（含港澳台）设计</el-checkbox>
                    <el-checkbox :label="2">在中国（含港澳台）生产</el-checkbox>
                    <el-checkbox :label="3">中国（含港澳台）上市</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="stage3.type == 1">
              <el-col :span="24">
                <el-form-item label="设计方式" prop="designWay">
                  <el-select
                    v-model="stage4.designWay">
                    <el-option
                      label="企业内部设计：企业内部人员自行设计"
                      value="1"></el-option>
                    <el-option
                      label="外部设计：为其他单位人员自行设计"
                      value="2"></el-option>
                    <el-option
                      label="共同设计：为企业内部人员与其他单位人员共同参与设计"
                      value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="stage4.status == 1 || stage4.status == 2|| stage4.status == 3|| stage4.status == 4">
              <el-col :span="24">
                <el-form-item label="预算/研发成本" prop="cost">
                  <el-select
                    v-model="stage4.cost">
                    <el-option
                      label="5万以下"
                      value="1">
                    </el-option>
                    <el-option
                      label="5-10万"
                      value="2">
                    </el-option>
                    <el-option
                      label="10-20万"
                      value="3">
                    </el-option>
                    <el-option
                      label="20-50万"
                      value="4">
                    </el-option>
                    <el-option
                      label="50-100万"
                      value="5">
                    </el-option>
                    <el-option
                      label="100-200万"
                      value="6">
                    </el-option>
                    <el-option
                      label="200-500万"
                      value="7">
                    </el-option>
                    <el-option
                      label="500-1000万"
                      value="8">
                    </el-option>
                    <el-option
                      label="1000-2000万"
                      value="9">
                    </el-option>
                    <el-option
                      label="2000-5000万"
                      value="10">
                    </el-option>
                    <el-option
                      label="5000-1亿"
                      value="11">
                    </el-option>
                    <el-option
                      label="1亿以上"
                      value="12">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="stage3.type == 1">
              <el-col :span="24">
                <el-form-item label="核心评估标准" prop="coreRole">
                  <el-select multiple
                             v-model="stage4.coreRole">
                    <el-option
                      label="美学设计质量"
                      :value="1"></el-option>
                    <el-option
                      label="创新"
                      :value="2"></el-option>
                    <el-option
                      label="自治"
                      :value="3"></el-option>
                    <el-option
                      label="安全实际使用"
                      :value="4"></el-option>
                    <el-option
                      label="可用性"
                      :value="5"></el-option>
                    <el-option
                      label="人类工效学"
                      :value="6"></el-option>
                    <el-option
                      label="对环境的影响"
                      :value="7"></el-option>
                    <el-option
                      label="执行"
                      :value="8"></el-option>
                    <el-option
                      label="材料选择"
                      :value="9"></el-option>
                    <el-option
                      label="品牌标识"
                      :value="10"></el-option>
                    <el-option
                      label="目标群体适合"
                      :value="11"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="stage4.status == 1 || stage4.status == 2|| stage4.status == 3|| stage4.status == 4">
              <el-col :span="24">
                <el-form-item label="目标群体" prop="targetGroup">
                  <el-radio-group v-model="stage4.targetGroup">
                    <el-radio :label="1">消费者 用户</el-radio>
                    <el-radio :label="2">贸易 行业</el-radio>
                    <el-radio :label="3">公共部门 政府</el-radio>
                    <el-radio :label="4">其他目标群体</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="stage4.status == 1 || stage4.status == 2|| stage4.status == 3|| stage4.status == 4">
              <el-col :span="24">
                <el-form-item label="服务目标地区" prop="targetArea">
                  <el-checkbox-group v-model="stage4.targetArea">
                    <el-checkbox :label="1">亚洲</el-checkbox>
                    <el-checkbox :label="2">澳大利亚 大洋洲</el-checkbox>
                    <el-checkbox :label="3">欧洲</el-checkbox>
                    <el-checkbox :label="4">北美</el-checkbox>
                    <el-checkbox :label="5">南美</el-checkbox>
                    <el-checkbox :label="6">进一步本地化</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否取得专利" prop="isPatented">
                <el-radio-group v-model="stage4.isPatented">
                  <el-radio :label="2">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                  <el-radio :label="3">申请中</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="stage4.isPatented == 2">
            <el-col :span="24">
              <el-form-item label="专利类型(已获得)" prop="patentTypeGot" class="label-lh" label-width="150px">
                <el-checkbox-group v-model="stage4.patentTypeGot">
                  <el-checkbox :label="1">发明专利</el-checkbox>
                  <el-checkbox :label="2">使用新型专利</el-checkbox>
                  <el-checkbox :label="3">外观设计专利</el-checkbox>
                  <el-checkbox :label="4">商标</el-checkbox>
                  <el-checkbox :label="5">版权</el-checkbox>
                  <el-checkbox :label="6">其他</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-if="stage4.isPatented == 3">
              <el-form-item label="专利类型(正在申请)" prop="patentTypeApply" label-width="150px">
                <el-checkbox-group v-model="stage4.patentTypeApply">
                  <el-checkbox :label="1">发明专利</el-checkbox>
                  <el-checkbox :label="2">使用新型专利</el-checkbox>
                  <el-checkbox :label="3">外观设计专利</el-checkbox>
                  <el-checkbox :label="4">商标</el-checkbox>
                  <el-checkbox :label="5">版权</el-checkbox>
                  <el-checkbox :label="6">其他</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="stage4.isPatented == 2">
              <el-form-item label="专利证明" prop="patentCert">
                <upload-file :upfileSize="4096" :upfileType="'image'" customFormat="jpg、jpeg、png" :upLimit="5" :upMultiple="false" @urlCB="uploadFile1Stage4" @removeFile="removeUploadFile1Stage3"></upload-file>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="获奖情况">
                <el-radio-group v-model="stage4.isWinPrize">
                  <el-radio :label="1">已获奖</el-radio>
                  <el-radio :label="0">暂未获奖</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="stage4.isWinPrize == 1">
            <el-col :span="12">
              <el-form-item label="奖项证明">
                <upload-file :upfileSize="3072" :upfileType="'image'" :upLimit="3" :upMultiple="false" @urlCB="uploadFile2Stage4" @removeFile="removeUploadFile2Stage3"></upload-file>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="stage3.type == 1">
            <el-col :span="12">
              <el-form-item label="产业转化意向" prop="industryIntention">
                <el-radio-group v-model="stage4.industryIntention">
                  <el-radio :label="1">需要</el-radio>
                  <el-radio :label="0">不需要</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="stage3.type == 1 && stage4.industryIntention == 1">
            <el-col :span="24">
              <el-form-item label="产业转化需求类型" prop="industryIntentionType" label-width="140px">
                <el-checkbox-group v-model="stage4.industryIntentionType">
                  <el-checkbox :label="1">场地支持</el-checkbox>
                  <el-checkbox :label="2">设计支持</el-checkbox>
                  <el-checkbox :label="3">技术支持</el-checkbox>
                  <el-checkbox :label="4">销售支持</el-checkbox>
                  <el-checkbox :label="5">资金支持</el-checkbox>
                  <el-checkbox :label="6">不需要</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="stage3.type == 1 && stage4.industryIntention == 1">
            <el-col :span="24">
              <el-form-item label="需求描述" prop="demandDesc">
                <el-input v-model="stage4.demandDesc" :maxlength="500" placeholder="500字以内, 请包含项目介绍、公司简介、需求描述" type="textarea" resize="none" :row="5"></el-input>
                <input-counter :content="stage4.demandDesc" maxlength="500"></input-counter>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="stage3.type == 1 && stage4.status == 1">
            <el-col :span="12">
              <el-form-item label="产品购买链接">
                <el-input v-model="stage4.purchaseLink"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="stage3.type == 1 && stage4.status == 1">
            <el-col :span="12">
              <el-form-item label="产品关键词">
                <el-input v-model="stage4.keywords" placeholder="用空格分隔，最多五个"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <!--按钮区域-->
      <el-row>
        <div class="add-designer-btn" @click="addDesigner" v-show="activeStage === 2">＋ 增加设计师</div>
        <div class="btn-wrapper">
          <el-button v-show="activeStage === 4" @click="submit">保存并提交</el-button>
          <el-button v-show="activeStage === 2||activeStage === 3||activeStage === 4" @click="goPrevStage">上一页</el-button>
          <el-button v-show="activeStage === 1||activeStage === 2||activeStage === 3" @click="goNextStage">下一页</el-button>
        </div>
      </el-row>
      <!--弹窗区域-->
      <el-dialog
        title="提示"
        :visible.sync="designerDeleteDialogVisible"
        width="30%"
        center>
        <span>确定要删除该条设计师资料么?</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="designerDeleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureDelete()">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import uploadFile from '@/components/Upload/upload'
import inputCounter from '@/components/Form/InputCounter.vue'
import request from '@/utils/request'
import chineseCities from '@/utils/cities'
export default {
  data () {
    var id = ''
    var stage1 = {
      projectSource: 1,
      customerId: '',
      baseId: '',
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
    var stage2 = [
      {
        cnName: '',
        firstName: '',
        lastName: '',
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
        }
      }
    ]
    var stage3 = {
      name: '',
      type: '',
      ownership: '',
      designTime: ['', ''],
      startDesignTime: '',
      endDesignTime: '',
      status: '',
      cnProductDesignSummary: '',
      enProductDesignSummary: '',
      cnDesignConcept: '',
      enDesignConcept: '',
      cnIntroExt: '',
      enIntroExt: '',
      cnDesc: '',
      enDesc: '',
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
      videoUrl: '',
      videoPath: '',
      videoPwd: '',
      pictures: [],
      documents: [],
      isSendBack: 0,
      exhibitType: []
    }
    var stage4 = {
      cnName: '',
      enName: '',
      status: '',
      introLength: '',
      introWidth: '',
      introHeight: '',
      introWeight: '',
      price: '',
      devTime: ['', ''],
      startDevTime: '',
      endDevTime: '',
      techSource: '',
      nature: [],
      designWay: '',
      cost: '',
      coreRole: [],
      targetGroup: '',
      targetArea: [],
      isPatented: '',
      patentTypeGot: [],
      patentCert: [],
      isWinPrize: '',
      prizeCert: [],
      industryIntention: '',
      IndustryIntentionType: [],
      demandDesc: '',
      launchAt: '',
      expectedLaunchPrice: '',
      expectedLaunchDate: '',
      patentTypeApply: [],
      purchaseLink: '',
      keywords: '',
      brandDesignType: '',
      brandStatus: '',
      expectedTime: ['', ''],
      endExpectedTime: '',
      startExpectedTime: '',
      industryIntentionType: [],
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
    var stage1Rules = {}
    Object.keys(stage1).forEach(function (v, k) {
      stage1Rules[v] = inputRequired
      if (v == 'gender') {
        stage1Rules[v] = radioRequired
      }
    })
    var stage2Rules = {}
    Object.keys(stage2[0]).forEach(function (v, k) {
      if (v !== 'edu') {
        stage2Rules[v] = inputRequired
        if (v == 'gender') {
          stage2Rules[v] = radioRequired
        }
      }
    })
    Object.keys(stage2[0].edu).forEach(function (v, k) {
      var fix = 'edu.' + v
      stage2Rules[fix] = inputRequired
      if (v == 'diploma') {
        stage2Rules[fix] = radioRequired
      }
    })
    var stage3Rules = {}
    Object.keys(stage3).forEach(function (v, k) {
      stage3Rules[v] = inputRequired
      if (v == 'type' || v == 'ownership' || v == 'status' || v == 'isSendBack') {
        stage3Rules[v] = radioRequired
      }
    })
    var stage4Rules = {}
    Object.keys(stage4).forEach(function (v, k) {
      stage4Rules[v] = inputRequired
      if (v == 'status' || v == 'techSource' || v == 'nature' || v == 'designWay' || v == 'cost' || v == 'coreRole' || v == 'targetGroup' || v == 'targetArea' || v == 'isPatented' || v == 'patentTypeGot' || v == 'isWinPrize' || v == 'industryIntention') {
        stage4Rules[v] = radioRequired
      }
      if (v == 'industryIntentionType') {
        stage4Rules[v] = checkboxRequired
      }
    })

    return {
      stage1: stage1,
      stage2: {baseId: '', designers: stage2},
      stage3: stage3,
      stage4: stage4,
      stage1Rules: stage1Rules,
      stage2Rules: stage2Rules,
      stage3Rules: stage3Rules,
      stage4Rules: stage4Rules,
      activeStage: 1,
      id: id,
      designerDeleteDialogVisible: false,
      designerInternalObj: {},
      designerNumber: 1,
      chineseCities: chineseCities
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
    goPrevStage () {
      this.activeStage--
    },
    goNextStage () {
      this
        .submit()
        .then(() => { this.activeStage++ })
        .catch((data) => { console.log(data); this.$message('保存失败') })
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
      this.stage1.cnAddress = item.companyAddress
      this.stage1.city = item.companyCity
      this.stage1.contactTel = item.contactPhone
      this.stage1.contactName = item.contactName
      this.stage1.contactEmail = item.contactEmail
      this.stage1.customerId = item.id
      this.stage1.gender = item.user.gender

      this.$refs['stage1'].validate()
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
      this.stage2.designers[this.designerNumber].city = item.user.city
      this.stage2.designers[this.designerNumber].email = item.user.email
      this.stage2.designers[this.designerNumber].contact = item.user.phone
      this.stage2.designers[this.designerNumber].gender = item.user.sex
      this.stage2.designers[this.designerNumber].idCard = item.user.id_card

      if (item.colleges.length > 0) {
        this.stage2.designers[this.designerNumber].edu.schoolName = item.colleges[0].college_name
      }
      for (let x of this.$refs['stage2']) {
        x.validate()
      }
    },
    uploadstage2 (file, CBParams) {
      var k = CBParams.index
      this.stage2.designers[k].photoUrl = file.file_url
    },
    removeUploadStage2 (arr, CBParams) {
      var k = CBParams.index
      this.stage2.designers[k].photoUrl = arr[0].url
    },
    uploadVideoStage3 (file) {
      this.stage3.videoUrl = file.file_url
    },
    removeUploadVideoStage3 (arr) {
      this.stage3.videoUrl = arr[0].url
    },
    uploadImageStage3 (file) {
      this.stage3.pictures.push(file.file_url)
    },
    removeUploadImageStage3 (arr) {
      var that = this
      this.stage3.pictures = []
      arr.forEach(function (v) {
        that.stage3.pictures.push(v.url)
      })
    },
    uploadFileStage3 (file) {
      this.stage3.documents.push(file.file_url)
    },
    removeUploadFileStage3 (arr) {
      var that = this
      this.stage3.documents = []
      arr.forEach(function (v) {
        that.stage3.documents.push(v.url)
      })
    },
    uploadFile1Stage4 (file) {
      this.stage4.patentCert.push(file.file_url)
    },
    removeUploadFile1Stage4 (arr) {
      var that = this
      this.stage4.patentCert = []
      arr.forEach(function (v) {
        that.stage3.patentCert.push(v.url)
      })
    },
    uploadFile2Stage4 (file) {
      this.stage4.prizeCert.push(file.file_url)
    },
    removeUploadFile2Stage4 (arr) {
      var that = this
      this.stage4.prizeCert = []
      arr.forEach(function (v) {
        that.stage3.prizeCert.push(v.url)
      })
    },
    submit () {
      var p = new Promise((resolve, reject) => {
        if (this.activeStage == 1) {
          this.submitStage1(resolve, reject)
        } else if (this.activeStage == 2) {
          this.submitStage2(resolve, reject)
        } else if (this.activeStage == 3) {
          this.submitStage3(resolve, reject)
        } else if (this.activeStage == 4) {
          this.submitStage4(resolve, reject)
        }
      })
      return p
    },
    submitStage1 (resolve, reject) {
      var that = this
      this.$refs['stage1'].validate((valid) => {
        if (valid) {
          request({
            url: '/v1/award/process-customer',
            method: 'post',
            data: {
              ...that.stage1
            }
          }).then((data) => {
            if (data.code == 300000) {
              resolve()
              that.id = data.data.id
              that.stage1.baseId = that.id
              that.stage2.baseId = that.id
              that.stage3.baseId = that.id
              that.stage4.baseId = that.id
            }
          })
        } else {
          reject()
          this.$message('提交失败')
          return false;
        }
      });
    },
    submitStage2 (resolve, reject) {
      var that = this
      let flag = true
      this.$refs['stage2'].forEach(function (v) {
        v.validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
      })
      if (flag) {
        request({
          url: '/v1/award/process-designer',
          method: 'post',
          data: {
            ...that.stage2
          }
        }).then((data) => {
          if (data.code == 300000) {
            resolve()
          } else {
            that.$message(data.msg)
          }
        })
      }
    },
    submitStage3 (resolve, reject) {
      var that = this
      that.stage3.startDesignTime = that.stage3.designTime[0]
      that.stage3.endDesignTime = that.stage3.designTime[1]
      if (this.stage3.pictures.length < 6) {
        that.$message('至少上传6张图片')
        return
      }
      this.$refs['stage3'].validate((valid) => {
        if (valid) {
          request({
            url: '/v1/award/process-opus',
            method: 'post',
            data: {
              ...that.stage3
            }
          }).then((data) => {
            if (data.code == 300000) {
              resolve()
            } else {
              that.$message(data.msg)
            }
          })
        } else {
          reject()
          this.$message('提交失败')
          return false;
        }
      });
    },
    submitStage4 (resolve, reject) {
      var that = this
      that.stage4.startDevTime = that.stage4.devTime[0]
      that.stage4.endDevTime = that.stage4.devTime[1]
      that.stage4.startExpectedTime = that.stage4.expectedTime[0]
      that.stage4.endExpectedTime = that.stage4.expectedTime[1]
      if (typeof that.stage4.keywords == 'string') {
        that.stage4.keywords = that.stage4.keywords.split(' ').slice(0, 5)
      }
      this.$refs['stage4'].validate((valid) => {
        if (valid) {
          request({
            url: '/v1/award/process-product',
            method: 'post',
            data: {
              ...that.stage4
            }
          }).then((data) => {
            if (data.code == 300000) {
              this.$message('保存成功')
              setTimeout(function () {
                that.$router.go('/')
              }, 1000)
            } else {
              that.$message(data.msg)
            }
          })
        } else {
          reject()
          // hack for stage4.keywords
          that.stage4.keywords = that.stage4.keywords.join(' ')
          this.$message('提交失败')
          return false;
        }
      });
    },
    deleteDesignerInfo () {
      this.designerDeleteDialogVisible = true
    },
    ensureDelete () {
      this.designerDeleteDialogVisible = false
      this.stage2.designers.pop()
    },
    addDesigner () {
      var obj = {
        cnName: '',
        enName: '',
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
        }
      }
      this.stage2.designers.push(obj)
    },
    getDesignerNumber (k) {
      this.designerNumber = k
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
    },
    getMonth (dateArr) {
      var start = ''
      var end = ''
      var month = ''
      if (dateArr) {
        if (dateArr.length > 0) {
          start = dateArr[0].split('-')
          end = dateArr[1].split('-')
          month = (end[0] - start[0]) * 12 + (end[1] - start[1])
        }
        return month
      }
    }
  },
  components: {
    'upload-file': uploadFile,
    'input-counter': inputCounter
  },
  mounted () {
    if (this.$route.query.task_id) {
      this.stage1.projectSource = 2
      this.stage1.taskId = this.$route.query.task_id
    }
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
    background: linear-gradient(#86ebd3, #ffffff);
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
          width: 210px;
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
</style>
