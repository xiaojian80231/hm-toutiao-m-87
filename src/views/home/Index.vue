<template>
  <div class="container">
    <van-tabs @change="changeChannel" :lazy-render="false" swipeable v-model="activeIndex">
      <van-tab :key="channel.id" v-for="channel in myChannels" :title="channel.name">
        <div ref="scroll-wrapper" class="scroll-wrapper" @scroll="remember($event)">
          <!-- van-list 列表组件 实现上拉加载 -->
          <!-- v-model="upLoading" 如果值 true 代表正在加载中  false 代表加载完毕 -->
          <!-- :finished="finished" 如果值 true 代表所有数据加载完毕  false 代表还有数据 -->
          <!-- finished-text="没有更多文章了"  加载完毕的提示文章 -->
          <!-- @load="onLoad" 上拉加载触发的事件： -->

          <!-- van-pull-refresh下拉刷新组件 -->
          <!-- v-model="downLoading"  值为true 正在刷新中  值为false  结束刷新效果 -->
          <!-- :success-text="refreshSuccessText" 刷新成功后的文案  （更新成功|暂无更新） -->
          <!-- @refresh="onRefresh" 下拉刷新事件：下拉后松手后触发 -->
          <van-pull-refresh
            v-model="channel.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            <van-list
              v-model="channel.upLoading"
              :finished="channel.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell v-for="item in channel.articles" :key="item.art_id.toString()">
                <div class="article_item">
                  <h3 class="van-ellipsis">{{item.title}}</h3>
                  <div class="img_box" v-if="item.cover.type===3">
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
                  </div>
                  <div class="img_box" v-if="item.cover.type===1">
                    <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{item.aut_name}}</span>
                    <span>{{item.comm_count}}评论</span>
                    <span>{{item.pubdate|relTime}}</span>
                    <span @click="openMoreAction" v-if="user.token" class="close">
                      <van-icon name="ellipsis" />
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 使用更多操作组件 -->
     <!--v-model语法糖原理  :value="showMoreAction" @input="showMoreAction=$event" -->
    <more-action v-if="user.token" v-model="showMoreAction"></more-action>
  </div>
</template>

<script>
// 渲染列表
// 1：封装API
// 2：上拉加载 获取数据
// 3：渲染文章
// 4：下拉刷新
import { getMyChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
import MoreAction from './components/more-action'

export default {
  name: 'home-index',
  components: {
    MoreAction
  },
  data () {
    return {
      upLoading: false, // 上拉加载中
      finished: false, // 是否全部加载完成
      articles: [], // 文章列表
      downLoading: false, // 是否是刷新状态
      refreshSuccessText: '', // 刷新完成的提示   文案（暂无更新|更新成功）
      myChannels: [], // 我的频道列表
      activeIndex: 0, // 当前激活的频道索引
      showMoreAction: false// 显示more-action中的van-popup组件
    }
  },
  watch: {
    // 监听user.refresh_token 变化，然后去更新频道数据
    'user.refresh_token': function () {
      // 默认激活推荐频道
      this.activeIndex = 0
      // 加载频道数据
      this.getMyChannels()
      // 加载文章列表
      this.onLoad()
    }
  },
  computed: {
    ...mapState(['user']),

    activeChannel () {
      return this.myChannels[this.activeIndex]
    }
  },
  // 组件激活钩子(激活的时候触发，初始化时也会触发)
  activated () {
    // 1：获取当前激活的频道中的滚动容器DOM
    // 2：给容器的scrollTop赋值，当前激活频道的阅读位置
    if (this.$refs['scroll-wrapper']) {
      const dom = this.$refs['scroll-wrapper'][this.activeIndex]
      dom.scrollTop = this.activeChannel.scrollTop
    }
  },
  created () {
    this.getMyChannels()
  },
  methods: {
    // 打开更多操作
    openMoreAction () {
      this.showMoreAction = true
    },
    // 记住滚动的位置
    remember (e) {
      // 记录当前频道滚动的位置
      this.activeChannel.scrollTop = e.target.scrollTop
    },
    // 选择频道
    changeChannel () {
      // (当前激活频道下无文章数据) 自己加载渲染当前激活频道的文章列表
      if (!this.activeChannel.articles.length) {
        // 开启加载效果
        this.activeChannel.upLoading = true
        // 关闭没有数据的提示
        this.activeChannel.finished = false
        // 加载文章
        this.onLoad()
      } else {
        // 有数据(根据当前频道记录的阅读位置进行滚动)
        // 在切换到频道后：tab组件默认做了滚动顶部操作
        // 保证 自己的操作逻辑在 tab组件逻辑之后执行

        // 原始写法：
        // window.setTimeout(() => {
        //   const dom = this.$refs['scroll-wrapper'][this.activeIndex]
        //   dom.scrollTop = this.activeChannel.scrollTop
        // }, 0)

        // 下一帧 $nextTick() 延时一会执行
        this.$nextTick(() => {
          const dom = this.$refs['scroll-wrapper'][this.activeIndex]
          dom.scrollTop = this.activeChannel.scrollTop
        })
      }
    },

    // 获取我的频道数据
    async getMyChannels () {
      const data = await getMyChannels()
      // map函数作用得到新数组：遍历数组，回调函数，回调函数的返回值，作为新数组的每一项
      // 小技巧：先清空数据(tabs组件置空)，再赋值新的数据
      this.myChannels = []
      this.$nextTick(() => {
        this.myChannels = data.channels.map(item => {
          return {
            id: item.id,
            name: item.name,
            articles: [], // 文章列表
            upLoading: false, // 上拉加载中
            downLoading: false, // 下拉刷新中
            finished: false, // 是否完全加载完毕
            timestamp: Date.now(), // 当前时间
            scrollTop: 0 // 阅读位置
          }
        })
      })
    },

    // 下拉刷新
    async onRefresh () {
      // await this.$sleep()// 延时1.5秒  测试可用，上线切记别用
      // // 模拟获取数据
      // window.setTimeout(() => {
      //   // 获取数据成功
      //   const data = [1, 2, 3, 4]
      //   // 结束刷新效果
      //   this.downLoading = false
      //   if (data.length) {
      //     // 替换数据
      //     this.articles = data
      //     // 提示文案
      //     this.refreshSuccessText = '更新成功'
      //     // 防止不足一屏数据，主动触发一次加载数据
      //     this.onLoad()
      //     // 重置是否加载完毕
      //     this.finished = false
      //   } else {
      //     this.refreshSuccessText = '暂无数据'
      //   }
      // }, 1500)

      // 把当前激活频道的时间戳改成当前时间
      this.activeChannel.timestamp = Date.now()
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      // 关闭刷新效果
      this.activeChannel.downLoading = false
      // 判断是否获取数据
      if (data.results.length) {
        // 替换
        this.activeChannel.articles = data.results
        // 文案
        this.refreshSuccessText = '更新成功'
        // 加载下一页数据前  时间戳使用后台给的
        this.activeChannel.timestamp = data.pre_timestamp
        // 主动加载下一页
        this.onLoad()
        // 重置是否加载完毕
        this.activeChannel.finished = false
      } else {
        this.refreshSuccessText = '暂无数据'
      }
    },

    // 上拉加载
    async onLoad () {
      // await this.$sleep()// 延时1.5秒  测试可用，上线切记别用
      // // 模拟获取数据
      // window.setTimeout(() => {
      //   // 获取数据成功
      //   const data = []
      //   for (let i = this.articles.length; i < this.articles.length + 10; i++) {
      //     data.push(i + 1)
      //   }
      //   // 追加数据
      //   this.articles.push(...data)
      //   // 结束加载中效果
      //   this.upLoading = false
      //   // 考虑：是否全部数据加载完毕   假设超过40就没有数据了
      //   if (this.articles.length >= 40) {
      //     this.finished = true
      //   }
      // }, 1500)

      // 严谨考虑：判断是否有激活频道
      if (!this.activeChannel) return false
      // 当前激活频道的ID和时间戳
      // this.myChannels[this.activeIndex] ===this.activeChannel  当前激活的频道
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      // 往当前激活频道下的文章列表中去追加
      this.activeChannel.articles.push(...data.results)
      // 结束当前激活频道的加载效果
      this.activeChannel.upLoading = false
      // 判断是否有数据
      if (data.pre_timestamp) {
        // 存入时间戳，当前激活的频道
        this.activeChannel.timestamp = data.pre_timestamp
      } else {
        this.activeChannel.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}

//文章列表
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
