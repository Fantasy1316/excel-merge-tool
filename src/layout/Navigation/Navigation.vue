<template>
	<div class="container">
		<header class="header">
			<img src="../../assets/images/emt-logo.png" class="header-logo" alt="" />
		</header>
		<div class="body">
			<!-- <aside class="body-aside">
        <router-link class="body-aside-item" active-class="body-aside-item_active" to="merge" title="合并文件">
          <div class="item-icon">
            <i class="iconfont icon-hebing"></i>
          </div>
        </router-link>
        <router-link class="body-aside-item" active-class="body-aside-item_active" to="errorlog" title="错误日志">
          <div class="item-icon">
            <i class="iconfont icon-rizhishenji"></i>
          </div>
        </router-link>
        <router-link class="body-aside-item" active-class="body-aside-item_active" to="setting" title="通用设置">
          <div class="item-icon">
            <i class="iconfont icon-shezhi-xianxing"></i>
          </div>
        </router-link>
      </aside> -->
			<div class="body-main">
				<!-- <p class="body-main-title">{{ title }}</p> -->
				<div class="body-main-view">
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = ref('')

watch(
	() => route,
	(newRoute) => {
		title.value = newRoute.meta.title
	},
	{
		immediate: true,
		deep: true
	}
)
</script>

<style lang="scss">
.container {
	display: flex;
	flex-direction: column;
	@include --mixin-container(#f8f8f8);

	.header {
		position: relative;
		height: 60px;
		padding: 14px 24px;
		background-color: $--primary-color;
		box-sizing: border-box;
		box-shadow: 2px 0 4px #858585;

		&-logo {
			height: 100%;
			user-select: none;
			-webkit-user-drag: none;
		}
	}

	.body {
		flex: 1;
		display: flex;
		overflow-y: scroll;

		&::-webkit-scrollbar {
			display: none;
		}

		&-aside {
			display: flex;
			flex-direction: column;
			width: 60px;
			padding: 20px 0;
			background-color: #fff;

			&-item {
				margin-bottom: 10px;
				text-decoration: none;
				color: #333;

				.item-icon {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 40px;
					height: 40px;
					margin: 0 auto;
					border-radius: 4px;

					&:hover {
						cursor: pointer;
						background-color: #f8f8f8;
					}

					.iconfont {
						font-size: 20px;
					}
				}

				&_active {
					.item-icon {
						color: #fff !important;
						background-color: rgba(239, 181, 20, 0.8) !important;
					}
				}
			}
		}

		&-main {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 24px 40px;
			box-sizing: border-box;

			&-title {
				padding-left: 14px;
				margin-bottom: 18px;
				font-size: 16px;
				font-weight: 700;
				color: $--default-text-color;
				letter-spacing: 1px;
			}

			&-view {
				flex: 1;
				padding: 20px;
				background-color: #fff;
				border-radius: 8px;
				overflow-y: scroll;

				&::-webkit-scrollbar {
					display: none;
				}
			}
		}
	}
}
</style>
