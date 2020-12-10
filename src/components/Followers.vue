<template>
  <div>
    <!-- header area -->
    <a-row type="flex" justify="center" class="headRow">
      <a-col :xs="7" :sm="8" :md="4" :lg="4" :xl="4">
        <div class="logo"></div>
      </a-col>
      <a-col :xs="15" :sm="14" :md="16" :lg="16" :xl="16">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="line-height: 90px;">
          <a-input-search placeholder="input search text" allow-clear v-model="searchText"/>
        </a-col>
      </a-col>
    </a-row>

    <!--content area-->
    <a-row type="flex" justify="center" class="content">
      <a-col :xs="20" :sm="20" :md="12" :lg="12" :xl="12">
        <template v-if="pagination.total > 0">
          <a-table :data-source="followerList.filter(data => !searchText || data.login.toLowerCase().includes(searchText.toLowerCase()))"
                 :loading="tableLoading"
                 :pagination="pagination"
                 :rowClassName="rowClass">
          <a-table-column key="avatar_url" title="Avatar" data-index="avatar_url">
            <template slot-scope="avatar_url">
              <a-avatar size="large" :src="avatar_url"/>
            </template>
          </a-table-column>
          <a-table-column key="login" title="Name" data-index="login">
            <template slot-scope="login">
              {{ login }}
            </template>
          </a-table-column>
          <a-table-column key="html_url" title="Repository" data-index="html_url">
            <template slot-scope="html_url">
              <a-button type="link" @click="visitRepository(html_url)">
                Visit
              </a-button>
            </template>
          </a-table-column>
        </a-table>
        </template>
        <template v-else>
          <a-empty />
        </template>
      </a-col>
    </a-row>

    <!--footer area-->
    <div class="footer">
      <a-row type="flex" justify="center">
        <a-col :xs="22" :sm="22" :md="20" :lg="20" :xl="20">
          2020 &copy; Founders Lair
        </a-col>
      </a-row>
      <a-row type="flex" justify="center">
        <a-col :xs="22" :sm="22" :md="20" :lg="20" :xl="20">
          <div class="socialLink">
            <font-awesome-icon :icon="['fab', 'facebook-square']"/>
          </div>
          <div class="socialLink">
            <font-awesome-icon :icon="['fab', 'instagram-square']"/>
          </div>
          <div class="socialLink">
            <font-awesome-icon :icon="['fab', 'linkedin']" class="icon"/>
          </div>
        </a-col>
      </a-row>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faFacebookSquare, faLinkedin, faInstagramSquare} from '@fortawesome/free-brands-svg-icons'

library.add(faFacebookSquare, faLinkedin, faInstagramSquare);

export default {
  name: "Followers.vue",
  data() {
    return {
      gitHubToken: process.env.VUE_APP_ACCESS_TOKEN,
      targetUser: 'mosh-hamedani',
      tableLoading: true,
      pagination: {
        pageSize: 6,
        total: 6,
        size: 'small'
      },
      searchText: '',
      rowClass: function () {
        return 'tableRow';
      },
      followerList: []
    }
  },
  components: {},
  methods: {
    visitRepository: function (link) {
      window.open(link, "_blank");
      return true;
    },
    getTotalFollowers(username) {
      return axios.get(`https://api.github.com/users/` + username)
          .then(response => {
            this.pagination.total = parseInt(response.data['followers']);
            //this.pagination.total = 0;
          })
          .catch(e => {
            this.$notification['error']({
              message: 'Error!',
              description: 'There was an error while fetching data. please check logs.',
            });
            console.log(e);
            this.pagination.total = 0;
          });
    },
    getFollowersList(username, perPage, pageNo) {
      let totalPages = Math.ceil(this.pagination.total / 100);
      let queryString = new URLSearchParams({
        'per_page': perPage,
        'page': pageNo
      }).toString();

      return axios({
        method: "get",
        url: `https://api.github.com/users/` + username + `/followers?` + queryString,
        headers: {
          //Authorization: (this.gitHubToken) ? 'Bearer ' + this.gitHubToken : '',
          "Content-Type": "application/json"
        },
        auth: {
          username: 'jerry-inc',
        }
      }).then(response => {
        let data = response.data;
        for (let i = 0; i <= (data.length - 1); i++) {
          data[i]['key'] = pageNo + '-' + i;
        }
        this.followerList.push(...data);
        if (totalPages !== pageNo) {
          if(pageNo === 4){
            this.$message.loading({content: 'Taking longer than usual, please wait..', key: 1, duration: 0});
          }
          this.getFollowersList(username, 100, pageNo + 1);
        } else {
          this.$message.success({ content: 'Loaded successfully!', key: 1, duration: 2 })
          this.followerList = this.sortFollowerList(this.followerList);
          this.tableLoading = false;
        }
      }).catch(e => {
        this.$notification['error']({
          message: 'Error!',
          description: 'There was an error while fetching data. please check logs.',
        });
        console.log(e);
        this.pagination.total = 0;
      });
    },
    getUserData(username) {
      this.getTotalFollowers(username).then(() => {
        if (this.pagination.total) {
          this.getFollowersList(username, 100, 1);
        } else {
          this.$notification['info']({
            message: 'No Data',
            description: 'Seems like user ' + this.targetUser + ' has No Followers',
          });
        }
      })
    },
    sortFollowerList(dataArray){
      return dataArray.sort((a, b) => a['login'].localeCompare(b['login']));
    }
  },
  mounted() {
    this.getUserData(this.targetUser);
  }
}
</script>

<style scoped lang="less">

</style>